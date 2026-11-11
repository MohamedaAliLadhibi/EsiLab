const { CATEGORIES, classifyProduct } = require('../../services/ProductCategorizer');

const BACKUP_PRODUCTS = 'category_reclassify_backup_20261109_products';
const BACKUP_ASSIGNMENTS = 'category_reclassify_backup_20261109_assignments';
const CHUNK_SIZE = 1200;

exports.up = async function (knex) {
  await knex.raw("CREATE INDEX IF NOT EXISTS products_active_family_key_id_idx ON products ((data->>'product_family_key'), id) WHERE is_active = true");
  await knex.schema.createTable(BACKUP_PRODUCTS, (table) => {
    table.bigInteger('product_id').primary();
    table.jsonb('data').notNullable();
  });
  await knex.schema.createTable(BACKUP_ASSIGNMENTS, (table) => {
    table.bigInteger('product_id').notNullable();
    table.bigInteger('category_id').notNullable();
    table.primary(['product_id', 'category_id']);
  });

  await knex(BACKUP_PRODUCTS).insert(
    (await knex('products').select('id', 'data')).map((product) => ({ product_id: product.id, data: product.data })),
  );
  await knex(BACKUP_ASSIGNMENTS).insert(
    (await knex('product_categories').select('product_id', 'category_id')).map((assignment) => ({
      product_id: assignment.product_id,
      category_id: assignment.category_id,
    })),
  );

  await knex('categories')
    .insert(CATEGORIES.map((category) => ({ ...category, parent_id: null })))
    .onConflict('slug')
    .merge(['name', 'updated_at']);

  const categoryIds = new Map(
    (await knex('categories').whereIn('slug', CATEGORIES.map(({ slug }) => slug)).select('id', 'slug'))
      .map((category) => [category.slug, category.id]),
  );
  const rows = await knex('products as p')
    .leftJoin('suppliers as s', 's.id', 'p.supplier_id')
    .select('p.id', 'p.data', 's.name as supplier_name');
  const idsByCategory = new Map(CATEGORIES.map(({ slug }) => [slug, []]));

  for (const row of rows) {
    const data = typeof row.data === 'string' ? JSON.parse(row.data) : { ...row.data };
    delete data.category_slug;
    const category = classifyProduct(data, row.supplier_name || '');
    if (category) idsByCategory.get(category.slug).push(row.id);
  }

  await knex('product_categories')
    .whereIn('category_id', Array.from(categoryIds.values()))
    .delete();
  await knex('products')
    .whereRaw("data->>'category_slug' IS NOT NULL")
    .update({ data: knex.raw("data - 'category_slug'") });

  for (const { slug } of CATEGORIES) {
    const categoryId = categoryIds.get(slug);
    const ids = idsByCategory.get(slug);
    for (let offset = 0; categoryId && offset < ids.length; offset += CHUNK_SIZE) {
      const chunk = ids.slice(offset, offset + CHUNK_SIZE);
      await knex('products').whereIn('id', chunk).update({
        data: knex.raw("data || jsonb_build_object('category_slug', ?::text)", [slug]),
        updated_at: knex.fn.now(),
      });
      await knex('product_categories').insert(chunk.map((productId) => ({
        product_id: productId,
        category_id: categoryId,
      })));
    }
  }
};

exports.down = async function (knex) {
  const productBackups = await knex(BACKUP_PRODUCTS).select('product_id', 'data');
  for (const backup of productBackups) {
    await knex('products').where({ id: backup.product_id }).update({ data: backup.data });
  }
  const assignments = await knex(BACKUP_ASSIGNMENTS).select('product_id', 'category_id');
  const affectedCategoryIds = Array.from(new Set(assignments.map(({ category_id }) => category_id)));
  if (affectedCategoryIds.length) {
    await knex('product_categories').whereIn('category_id', affectedCategoryIds).delete();
  }
  for (let offset = 0; offset < assignments.length; offset += CHUNK_SIZE) {
    await knex('product_categories').insert(assignments.slice(offset, offset + CHUNK_SIZE));
  }
  await knex('categories').where({ slug: 'metrologie-masses-pesage' }).delete();
  await knex.raw('DROP INDEX IF EXISTS products_active_family_key_id_idx');
  await knex.schema.dropTableIfExists(BACKUP_ASSIGNMENTS);
  await knex.schema.dropTableIfExists(BACKUP_PRODUCTS);
};
