// src/db/migrations/20240101_002_create_product_fields.js
exports.up = function (knex) {
  return knex.schema.createTable('product_fields', (t) => {
    t.bigIncrements('id').primary();
    t.string('field_key', 100).notNullable().unique()
      .comment('Machine name, e.g. "description", "cas_number"');
    t.string('field_label', 255).notNullable()
      .comment('Human-readable label shown in admin UI and public frontend');
    t.enu('field_type', ['text', 'textarea', 'rich_text', 'url', 'image_url'])
      .notNullable().defaultTo('text');
    t.boolean('is_required').notNullable().defaultTo(false);
    t.integer('sort_order').notNullable().defaultTo(0);
    t.timestamps(true, true);

    t.index('field_key');
    t.index('sort_order');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('product_fields');
};
