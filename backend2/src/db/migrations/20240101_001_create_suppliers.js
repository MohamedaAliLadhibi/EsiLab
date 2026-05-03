// src/db/migrations/20240101_001_create_suppliers.js
exports.up = function (knex) {
  return knex.schema.createTable('suppliers', (t) => {
    t.bigIncrements('id').primary();
    t.string('name', 255).notNullable();
    t.string('slug', 255).notNullable().unique();
    t.string('contact_email', 255).nullable();
    t.string('contact_phone', 100).nullable();
    t.text('notes').nullable();
    t.integer('header_row_number').notNullable().defaultTo(1)
      .comment('Row number in the Excel file that contains column headers');
    t.boolean('is_active').notNullable().defaultTo(true);
    t.timestamps(true, true);

    t.index('slug');
    t.index('is_active');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('suppliers');
};
