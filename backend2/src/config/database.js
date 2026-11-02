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
  // Keep idle connections low on the single 4 GB VPS; connections are opened
  // on demand and capped so both API processes share PostgreSQL comfortably.
  pool: {
    min: Number(process.env.DB_POOL_MIN ?? 0),
    max: Number(process.env.DB_POOL_MAX ?? 5),
  },
  migrations: {
    directory: './src/db/migrations',
    tableName:  'knex_migrations',
  },
  seeds: {
    directory: './src/db/seeds',
  },
};

module.exports = config;
