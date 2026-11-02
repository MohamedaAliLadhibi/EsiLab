const { classifyProduct } = require('../../services/ProductCategorizer');

const CATEGORY_SLUGS = [
  'equipements-laboratoires', 'metrologie-dimensionnelle',
  'inspection-emballage', 'produits-chimiques-reactifs',
];
const CHUNK_SIZE = 1500;

async function clearAssignments(knex) {
  await knex('product_categories')
    .whereIn('category_id', knex('categories').select('id').whereIn('slug', CATEGORY_SLUGS))
    .delete();
  await knex('products')
    .whereRaw("data->>'category_slug' IS NOT NULL")
    .update({ data: knex.raw("data - 'category_slug'") });
}

exports.up = async function (knex) {
  const categories = await knex('categories').whereIn('slug', CATEGORY_SLUGS).select('id', 'slug');
  const categoryIds = new Map(categories.map((category) => [category.slug, category.id]));
  const rows = await knex('products as p')
    .leftJoin('suppliers as s', 's.id', 'p.supplier_id')
    .select('p.id', 'p.data', 's.name as supplier_name');
  const productIdsByCategory = new Map(CATEGORY_SLUGS.map((slug) => [slug, []]));

  for (const row of rows) {
    const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
    delete data.category_slug;
    const category = classifyProduct(data, row.supplier_name || '');
    if (category) productIdsByCategory.get(category.slug).push(row.id);
  }

  await clearAssignments(knex);

  for (const slug of CATEGORY_SLUGS) {
    const categoryId = categoryIds.get(slug);
    const ids = productIdsByCategory.get(slug);
    if (!categoryId || ids.length === 0) continue;

    for (let offset = 0; offset < ids.length; offset += CHUNK_SIZE) {
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

exports.down = clearAssignments;
