// src/models/ProductField.js
const db = require('../db/knex');

const TABLE = 'product_fields';

const ProductField = {
  findAll() {
    return db(TABLE).orderBy('sort_order');
  },

  findById(id) {
    return db(TABLE).where({ id }).first();
  },

  findByKey(field_key) {
    return db(TABLE).where({ field_key }).first();
  },

  async create(data) {
    const [row] = await db(TABLE).insert(data).returning('*');
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
};

module.exports = ProductField;
