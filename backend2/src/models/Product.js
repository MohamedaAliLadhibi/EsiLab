// src/models/Product.js
const db = require('../db/knex');
const slugify = require('slugify');

const TABLE = 'products';

const Product = {
  // ── Public queries ────────────────────────────────────────────────────────

  async findAll({ page = 1, limit = 24, search = null, categoryId = null, supplierId = null } = {}) {
    const offset = (page - 1) * limit;
    const term = search ? `%${String(search).trim()}%` : null;

    const applyFilters = (qb) => {
      qb.where(`${TABLE}.is_active`, true);

      if (supplierId) qb.where(`${TABLE}.supplier_id`, supplierId);

      if (categoryId) {
        qb.join('product_categories as pc', 'pc.product_id', `${TABLE}.id`)
          .where('pc.category_id', categoryId);
      }

      if (term) {
        qb.where((inner) => {
          inner
            .whereRaw(`${TABLE}.data->>'sku' ILIKE ?`, [term])
            .orWhereRaw(`${TABLE}.data->>'name' ILIKE ?`, [term])
            .orWhereRaw(`${TABLE}.data->>'short_description' ILIKE ?`, [term])
            .orWhereRaw(`${TABLE}.data->>'description' ILIKE ?`, [term])
            .orWhereRaw(`${TABLE}.data->>'brand' ILIKE ?`, [term])
            .orWhereRaw(`${TABLE}.data->>'category' ILIKE ?`, [term]);
        });
      }
    };

    const [{ count }] = await db(TABLE).modify(applyFilters)
      .count(`${TABLE}.id as count`);

    const rows = await db(TABLE)
      .modify(applyFilters)
      .orderBy(`${TABLE}.created_at`, 'desc')
      .select(`${TABLE}.*`)
      .limit(limit)
      .offset(offset);

    return {
      data: rows.map(Product._deserialize),
      meta: {
        total:       parseInt(count),
        page,
        limit,
        totalPages:  Math.ceil(parseInt(count) / limit),
      },
    };
  },

  async findBySlug(slug) {
    const row = await db(TABLE)
      .where({ slug, is_active: true })
      .first();
    return row ? Product._deserialize(row) : null;
  },

  async findById(id) {
    const row = await db(TABLE).where({ id }).first();
    return row ? Product._deserialize(row) : null;
  },

  // Find by SKU within a supplier (for upsert during re-import)
  async findBySku(supplierId, sku) {
    const row = await db(TABLE)
      .where({ supplier_id: supplierId })
      .whereRaw(`data->>'sku' = ?`, [String(sku)])
      .first();
    return row ? Product._deserialize(row) : null;
  },

  // ── Mutations ─────────────────────────────────────────────────────────────

  async create({ supplierId, data }) {
    const slug = await Product._uniqueSlug(data.name || data.sku || String(Date.now()));
    const [row] = await db(TABLE)
      .insert({
        supplier_id: supplierId,
        slug,
        data: JSON.stringify(data),
        is_active: true,
      })
      .returning('*');
    return Product._deserialize(row);
  },

  async update(id, { data, is_active }) {
    const updates = { updated_at: db.fn.now() };
    if (data !== undefined)      updates.data = JSON.stringify(data);
    if (is_active !== undefined) updates.is_active = is_active;

    const [row] = await db(TABLE)
      .where({ id })
      .update(updates)
      .returning('*');
    return Product._deserialize(row);
  },

  // Bulk upsert used during Excel import
  async upsertBySku(supplierId, productDataArray) {
    return db.transaction(async (trx) => {
      const results = { inserted: 0, updated: 0, skipped: 0, errors: [] };

      for (const data of productDataArray) {
        try {
          if (!data.sku) {
            results.skipped++;
            continue;
          }

          const existing = await trx(TABLE)
            .where({ supplier_id: supplierId })
            .whereRaw(`data->>'sku' = ?`, [String(data.sku)])
            .first();

          if (existing) {
            await trx(TABLE)
              .where({ id: existing.id })
              .update({ data: JSON.stringify(data), updated_at: trx.fn.now() });
            results.updated++;
          } else {
            const slug = await Product._uniqueSlug(data.name || data.sku, trx);
            await trx(TABLE).insert({
              supplier_id: supplierId,
              slug,
              data: JSON.stringify(data),
              is_active: true,
            });
            results.inserted++;
          }
        } catch (err) {
          results.errors.push({ sku: data.sku, error: err.message });
        }
      }

      return results;
    });
  },

  async delete(id) {
    return db(TABLE).where({ id }).delete();
  },

  // ── Helpers ───────────────────────────────────────────────────────────────

  _deserialize(row) {
    return {
      ...row,
      data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data,
    };
  },

  async _uniqueSlug(base, trx = db) {
    let slug = slugify(String(base), { lower: true, strict: true });
    let candidate = slug;
    let count = 1;

    while (true) {
      const existing = await trx(TABLE).where({ slug: candidate }).first();
      if (!existing) break;
      candidate = `${slug}-${count++}`;
    }

    return candidate;
  },
};

module.exports = Product;
