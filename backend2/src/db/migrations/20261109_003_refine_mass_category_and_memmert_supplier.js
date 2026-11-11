const { CATEGORIES, classifyProduct } = require('../../services/ProductCategorizer');

const BACKUP_PRODUCTS = 'category_refine_backup_20261109_products';
const BACKUP_ASSIGNMENTS = 'category_refine_backup_20261109_assignments';
const BACKUP_SUPPLIERS = 'category_refine_backup_20261109_suppliers';
const CHUNK_SIZE = 1200;

exports.up = async function (knex) {
  await knex.schema.createTable(BACKUP_PRODUCTS, (table) => {
    table.bigInteger('product_id').primary();
    table.jsonb('data').notNullable();
  });
  await knex.schema.createTable(BACKUP_ASSIGNMENTS, (table) => {
    table.bigInteger('product_id').notNullable();
    table.bigInteger('category_id').notNullable();
    table.primary(['product_id', 'category_id']);
  });
  await knex.schema.createTable(BACKUP_SUPPLIERS, (table) => {
    table.bigInteger('supplier_id').primary();
    table.string('name').notNullable();
  });

  await knex(BACKUP_PRODUCTS).insert(
    (await knex('products').select('id', 'data')).map(({ id, data }) => ({ product_id: id, data })),
  );
  await knex(BACKUP_ASSIGNMENTS).insert(
    (await knex('product_categories').select('product_id', 'category_id'))
      .map(({ product_id, category_id }) => ({ product_id, category_id })),
  );

  const misspelledSupplier = await knex('suppliers')
    .whereRaw("upper(btrim(name)) = 'MERMMET'")
    .select('id', 'name');
  if (misspelledSupplier.length) {
    await knex(BACKUP_SUPPLIERS).insert(misspelledSupplier.map(({ id, name }) => ({ supplier_id: id, name })));
    await knex('suppliers').whereIn('id', misspelledSupplier.map(({ id }) => id)).update({ name: 'MEMMERT' });
  }

  const categoryIds = new Map(
    (await knex('categories').whereIn('slug', CATEGORIES.map(({ slug }) => slug)).select('id', 'slug'))
      .map(({ id, slug }) => [slug, id]),
  );
  const products = await knex('products as p')
    .leftJoin('suppliers as s', 's.id', 'p.supplier_id')
    .select('p.id', 'p.data', 's.name as supplier_name');
  const idsByCategory = new Map(CATEGORIES.map(({ slug }) => [slug, []]));

  for (const row of products) {
    const data = typeof row.data === 'string' ? JSON.parse(row.data) : { ...row.data };
    delete data.category_slug;
    const category = classifyProduct(data, row.supplier_name || '');
    if (category) idsByCategory.get(category.slug).push(row.id);
  }

  await knex('product_categories').whereIn('category_id', Array.from(categoryIds.values())).delete();
  await knex('products').whereRaw("data->>'category_slug' IS NOT NULL")
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
      await knex('product_categories').insert(chunk.map((product_id) => ({ product_id, category_id: categoryId })));
    }
  }
};

exports.down = async function (knex) {
  const products = await knex(BACKUP_PRODUCTS).select('product_id', 'data');
  for (const row of products) {
    await knex('products').where({ id: row.product_id }).update({ data: row.data });
  }

  const categoryIds = (await knex('categories').whereIn('slug', CATEGORIES.map(({ slug }) => slug)).pluck('id'));
  if (categoryIds.length) await knex('product_categories').whereIn('category_id', categoryIds).delete();
  const assignments = await knex(BACKUP_ASSIGNMENTS).select('product_id', 'category_id');
  for (let offset = 0; offset < assignments.length; offset += CHUNK_SIZE) {
    await knex('product_categories').insert(assignments.slice(offset, offset + CHUNK_SIZE));
  }

  const suppliers = await knex(BACKUP_SUPPLIERS).select('supplier_id', 'name');
  for (const supplier of suppliers) {
    await knex('suppliers').where({ id: supplier.supplier_id }).update({ name: supplier.name });
  }

  await knex.schema.dropTableIfExists(BACKUP_SUPPLIERS);
  await knex.schema.dropTableIfExists(BACKUP_ASSIGNMENTS);
  await knex.schema.dropTableIfExists(BACKUP_PRODUCTS);
};
