exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name', 150).notNullable();
    table.string('email', 255).notNullable().unique();
    table.text('password_hash').notNullable();
    table.string('role', 50).notNullable().defaultTo('admin');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('last_login_at');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
