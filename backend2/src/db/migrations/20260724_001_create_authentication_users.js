const { hashPassword } = require('../../authentication/passwords');

exports.up = async function (knex) {
  const exists = await knex.schema.hasTable('users');

  if (!exists) {
    await knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.string('email', 255).notNullable().unique();
      table.text('password_hash').notNullable();
      table.string('role', 30).notNullable().defaultTo('employer');
      table.string('status', 30).notNullable().defaultTo('pending');
      table.timestamp('approved_at').nullable();
      table.timestamps(true, true);
    });
  }

  await knex('users')
    .insert({
      name: 'Mohamed Ali',
      email: 'ammamedali@gmail.com',
      password_hash: hashPassword(process.env.INITIAL_ADMIN_PASSWORD || 'mohamedali2003'),
      role: 'admin',
      status: 'approved',
      approved_at: knex.fn.now(),
    })
    .onConflict('email')
    .ignore();
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
