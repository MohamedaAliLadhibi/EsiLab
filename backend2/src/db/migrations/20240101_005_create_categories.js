// src/db/migrations/20240101_005_create_categories.js
exports.up = function (knex) {
  return knex.schema.createTable('categories', (t) => {
    t.bigIncrements('id').primary();
    t.string('name', 255).notNullable();
    t.string('slug', 255).notNullable().unique();
    // Self-referencing for subcategories (nullable = root category)
    t.bigInteger('parent_id').nullable().unsigned()
      .references('id').inTable('categories').onDelete('SET NULL');
    t.timestamps(true, true);

    t.index('slug');
    t.index('parent_id');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('categories');
};
