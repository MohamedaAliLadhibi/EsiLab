// src/models/Product.js
const db = require('../db/knex');
const slugify = require('slugify');
const { classifyProduct } = require('../services/ProductCategorizer');

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
            .orWhereRaw(`${TABLE}.data->>'category' ILIKE ?`, [term])
            .orWhereRaw(`${TABLE}.data->>'product_family_key' ILIKE ?`, [term]);
        });
      }
    };

    const [{ count }] = await db(TABLE).modify(applyFilters)
      .count(`${TABLE}.id as count`);

    const rows = await db(TABLE)
      .modify(applyFilters)
      .orderBy(`${TABLE}.created_at`, 'desc')
      .leftJoin('product_categories as pc_display', 'pc_display.product_id', `${TABLE}.id`)
      .leftJoin('categories as c_display', 'c_display.id', 'pc_display.category_id')
      .select(`${TABLE}.*`, 'c_display.slug as category_slug', 'c_display.name as assigned_category')
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
      .leftJoin('product_categories as pc_display', 'pc_display.product_id', `${TABLE}.id`)
      .leftJoin('categories as c_display', 'c_display.id', 'pc_display.category_id')
      .where({ [`${TABLE}.slug`]: slug, [`${TABLE}.is_active`]: true })
      .select(`${TABLE}.*`, 'c_display.slug as category_slug', 'c_display.name as assigned_category')
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
    data = { ...data };
    const category = classifyProduct(data);
    if (category) data.category_slug = category.slug;
    else delete data.category_slug;

    const slug = await Product._uniqueSlug(data.name || data.sku || String(Date.now()));
    return db.transaction(async (trx) => {
      const [row] = await trx(TABLE).insert({
        supplier_id: supplierId,
        slug,
        data: JSON.stringify(data),
        is_active: true,
      })
      .returning('*');
      await Product._syncCategory(trx, row.id, category);
      return Product._deserialize(row);
    });
  },

  async update(id, { data, is_active }) {
    const updates = { updated_at: db.fn.now() };
    let category = null;
    if (data !== undefined) {
      data = { ...data };
      category = classifyProduct(data);
      if (category) data.category_slug = category.slug;
      else delete data.category_slug;
      updates.data = JSON.stringify(data);
    }
    if (is_active !== undefined) updates.is_active = is_active;

    return db.transaction(async (trx) => {
      const [row] = await trx(TABLE).where({ id }).update(updates).returning('*');
      if (row && data !== undefined) await Product._syncCategory(trx, id, category);
      return row ? Product._deserialize(row) : null;
    });
  },

  // Bulk upsert used during Excel import
  async upsertBySku(supplierId, productDataArray) {
    return db.transaction(async (trx) => {
      const results = { inserted: 0, updated: 0, skipped: 0, errors: [] };
      const supplier = await trx('suppliers').where({ id: supplierId }).first('name');

      for (const data of productDataArray) {
        try {
          if (!data.sku) {
            results.skipped++;
            continue;
          }

          const category = classifyProduct(data, supplier?.name || '');
          const productData = { ...data };
          if (category) productData.category_slug = category.slug;
          else delete productData.category_slug;

          const existing = await trx(TABLE)
            .where({ supplier_id: supplierId })
            .whereRaw(`data->>'sku' = ?`, [String(data.sku)])
            .first();

          if (existing) {
            await trx(TABLE)
              .where({ id: existing.id })
              .update({ data: JSON.stringify(productData), updated_at: trx.fn.now() });
            await Product._syncCategory(trx, existing.id, category);
            results.updated++;
          } else {
            const slug = await Product._uniqueSlug(productData.name || productData.sku, trx);
            const [inserted] = await trx(TABLE).insert({
              supplier_id: supplierId,
              slug,
              data: JSON.stringify(productData),
              is_active: true,
            }).returning('id');
            await Product._syncCategory(trx, inserted.id, category);
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

  async _syncCategory(trx, productId, category) {
    await trx('product_categories').where({ product_id: productId }).delete();
    if (!category) return;
    const record = await trx('categories').where({ slug: category.slug }).first('id');
    if (record) await trx('product_categories').insert({ product_id: productId, category_id: record.id });
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
