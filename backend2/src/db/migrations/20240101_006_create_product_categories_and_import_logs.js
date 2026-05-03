// src/db/migrations/20240101_006_create_product_categories_and_import_logs.js
exports.up = async function (knex) {
  // ── Pivot: products ↔ categories ─────────────────────────────────────────
  await knex.schema.createTable('product_categories', (t) => {
    t.bigInteger('product_id').notNullable().unsigned()
      .references('id').inTable('products').onDelete('CASCADE');
    t.bigInteger('category_id').notNullable().unsigned()
      .references('id').inTable('categories').onDelete('CASCADE');
    t.primary(['product_id', 'category_id']);
    t.index('category_id');
  });

  // ── Import job audit log ──────────────────────────────────────────────────
  await knex.schema.createTable('import_logs', (t) => {
    t.bigIncrements('id').primary();
    t.bigInteger('supplier_id').notNullable().unsigned()
      .references('id').inTable('suppliers').onDelete('CASCADE');
    t.string('original_filename', 255).notNullable();
    t.enu('status', ['pending', 'processing', 'completed', 'failed'])
      .notNullable().defaultTo('pending');
    t.integer('rows_processed').defaultTo(0);
    t.integer('rows_inserted').defaultTo(0);
    t.integer('rows_updated').defaultTo(0);
    t.integer('rows_skipped').defaultTo(0);
    // JSONB array of per-row errors: [{row: 5, error: "missing SKU"}, ...]
    t.jsonb('errors').defaultTo('[]');
    t.timestamp('started_at').nullable();
    t.timestamp('completed_at').nullable();
    t.timestamps(true, true);

    t.index('supplier_id');
    t.index('status');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('import_logs');
  await knex.schema.dropTableIfExists('product_categories');
};
