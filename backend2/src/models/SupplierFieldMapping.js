// src/models/SupplierFieldMapping.js
const db = require('../db/knex');

const TABLE = 'supplier_field_mappings';

const SupplierFieldMapping = {
  // Returns mappings for a supplier keyed by field_key for O(1) lookup
  // e.g. { sku: { source_column: 'A', field_type: 'text', ... }, name: { source_column: 'B', ... } }
  async getMappingMap(supplierId) {
    const rows = await db(TABLE)
      .join('product_fields as f', 'f.id', `${TABLE}.field_id`)
      .where(`${TABLE}.supplier_id`, supplierId)
      .select(
        `${TABLE}.source_column`,
        'f.field_key',
        'f.field_type',
        'f.field_label',
      );

    return rows.reduce((map, row) => {
      map[row.field_key] = row;
      return map;
    }, {});
  },

  async forSupplier(supplierId) {
    return db(TABLE)
      .join('product_fields as f', 'f.id', `${TABLE}.field_id`)
      .where(`${TABLE}.supplier_id`, supplierId)
      .select(
        `${TABLE}.id`,
        `${TABLE}.source_column`,
        `${TABLE}.supplier_id`,
        'f.id as field_id',
        'f.field_key',
        'f.field_label',
        'f.field_type',
      )
      .orderBy('f.sort_order');
  },

  // Replaces all mappings for a supplier in one transaction
  async replaceForSupplier(supplierId, mappings) {
    // mappings: [{ field_id, source_column }, ...]
    return db.transaction(async (trx) => {
      await trx(TABLE).where({ supplier_id: supplierId }).delete();
      if (mappings.length > 0) {
        const rows = mappings.map((m) => ({
          supplier_id: supplierId,
          field_id: m.field_id,
          source_column: m.source_column.toUpperCase(),
        }));
        await trx(TABLE).insert(rows);
      }
    });
  },

  async delete(id) {
    return db(TABLE).where({ id }).delete();
  },
};

module.exports = SupplierFieldMapping;
