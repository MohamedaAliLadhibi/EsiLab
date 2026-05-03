exports.up = async function (knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS pg_trgm');

  await knex.raw(`
    CREATE INDEX IF NOT EXISTS products_data_sku_trgm_idx
    ON products USING gin ((data->>'sku') gin_trgm_ops)
  `);
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS products_data_name_trgm_idx
    ON products USING gin ((data->>'name') gin_trgm_ops)
  `);
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS products_data_short_description_trgm_idx
    ON products USING gin ((data->>'short_description') gin_trgm_ops)
  `);
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS products_data_description_trgm_idx
    ON products USING gin ((data->>'description') gin_trgm_ops)
  `);
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS products_data_brand_trgm_idx
    ON products USING gin ((data->>'brand') gin_trgm_ops)
  `);
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS products_data_category_trgm_idx
    ON products USING gin ((data->>'category') gin_trgm_ops)
  `);
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS import_logs_created_at_idx
    ON import_logs (created_at DESC)
  `);
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS import_logs_supplier_created_at_idx
    ON import_logs (supplier_id, created_at DESC)
  `);
};

exports.down = async function (knex) {
  await knex.raw('DROP INDEX IF EXISTS import_logs_supplier_created_at_idx');
  await knex.raw('DROP INDEX IF EXISTS import_logs_created_at_idx');
  await knex.raw('DROP INDEX IF EXISTS products_data_category_trgm_idx');
  await knex.raw('DROP INDEX IF EXISTS products_data_brand_trgm_idx');
  await knex.raw('DROP INDEX IF EXISTS products_data_description_trgm_idx');
  await knex.raw('DROP INDEX IF EXISTS products_data_short_description_trgm_idx');
  await knex.raw('DROP INDEX IF EXISTS products_data_name_trgm_idx');
  await knex.raw('DROP INDEX IF EXISTS products_data_sku_trgm_idx');
};
