// src/db/migrations/20240101_003_create_supplier_field_mappings.js
exports.up = function (knex) {
  return knex.schema.createTable('supplier_field_mappings', (t) => {
    t.bigIncrements('id').primary();
    t.bigInteger('supplier_id').notNullable().unsigned()
      .references('id').inTable('suppliers').onDelete('CASCADE');
    t.bigInteger('field_id').notNullable().unsigned()
      .references('id').inTable('product_fields').onDelete('CASCADE');
    t.string('source_column', 10).notNullable()
      .comment('Excel column letter, e.g. A, B, AA. Never a price column.');
    t.timestamps(true, true);

    // Each field can only be mapped once per supplier
    t.unique(['supplier_id', 'field_id']);
    t.index('supplier_id');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('supplier_field_mappings');
};
