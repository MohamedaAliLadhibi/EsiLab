// src/models/Supplier.js
const db = require('../db/knex');
const slugify = require('slugify');

const TABLE = 'suppliers';

const Supplier = {
  // ── Queries ──────────────────────────────────────────────────────────────

  findAll({ activeOnly = false } = {}) {
    const q = db(TABLE).orderBy('name');
    if (activeOnly) q.where('is_active', true);
    return q;
  },

  findById(id) {
    return db(TABLE).where({ id }).first();
  },

  findBySlug(slug) {
    return db(TABLE).where({ slug }).first();
  },

  // ── Supplier with its full field mapping (joined) ─────────────────────────

  async findWithMappings(id) {
    const supplier = await db(TABLE).where({ id }).first();
    if (!supplier) return null;

    const mappings = await db('supplier_field_mappings as m')
      .join('product_fields as f', 'f.id', 'm.field_id')
      .where('m.supplier_id', id)
      .select(
        'm.id',
        'm.source_column',
        'f.id as field_id',
        'f.field_key',
        'f.field_label',
        'f.field_type',
      )
      .orderBy('f.sort_order');

    return { ...supplier, mappings };
  },

  // ── Mutations ─────────────────────────────────────────────────────────────

  async create(data) {
    const slug = await Supplier._uniqueSlug(data.name);
    const [row] = await db(TABLE)
      .insert({ ...data, slug })
      .returning('*');
    return row;
  },

  async update(id, data) {
    const [row] = await db(TABLE)
      .where({ id })
      .update({ ...data, updated_at: db.fn.now() })
      .returning('*');
    return row;
  },

  async delete(id) {
    return db(TABLE).where({ id }).delete();
  },

  // ── Helpers ───────────────────────────────────────────────────────────────

  async _uniqueSlug(name, excludeId = null) {
    let base = slugify(name, { lower: true, strict: true });
    let slug = base;
    let count = 1;

    while (true) {
      const q = db(TABLE).where({ slug });
      if (excludeId) q.whereNot('id', excludeId);
      const existing = await q.first();
      if (!existing) break;
      slug = `${base}-${count++}`;
    }

    return slug;
  },
};

module.exports = Supplier;
