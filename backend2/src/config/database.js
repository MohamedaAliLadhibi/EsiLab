// src/config/database.js
require('dotenv').config();

const config = {
  client: 'pg',
  connection: {
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME     || 'lab_catalogue',
    user:     process.env.DB_USER     || 'postgres',
    password: process.env.DB_PASSWORD || '',
  },
  pool: { min: 2, max: 10 },
  migrations: {
    directory: './src/db/migrations',
    tableName:  'knex_migrations',
  },
  seeds: {
    directory: './src/db/seeds',
  },
};

module.exports = config;
