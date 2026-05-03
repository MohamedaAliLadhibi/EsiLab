// src/db/migrations/20240101_004_create_products.js
exports.up = async function (knex) {
  await knex.schema.createTable('products', (t) => {
    t.bigIncrements('id').primary();
    t.bigInteger('supplier_id').notNullable().unsigned()
      .references('id').inTable('suppliers').onDelete('CASCADE');
    t.string('slug', 255).notNullable().unique();
    // Flexible JSON payload — shape varies per supplier.
    // Prices are NEVER stored here. Stripped at import time.
    t.jsonb('data').notNullable().defaultTo('{}');
    t.boolean('is_active').notNullable().defaultTo(true);
    t.timestamps(true, true);

    t.index('supplier_id');
    t.index('is_active');
    t.index('slug');
  });

  // Functional index on SKU inside the JSON for fast lookup during re-imports
  await knex.raw(`
    CREATE INDEX products_data_sku_idx
    ON products ((data->>'sku'));
  `);

  // GIN index to enable full-text search across the entire JSON document
  await knex.raw(`
    CREATE INDEX products_data_gin_idx
    ON products USING gin (data);
  `);
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('products');
};
