exports.up = function (knex) {
  return knex.schema.dropTableIfExists('users');
};

exports.down = function () {
  return Promise.resolve();
};
