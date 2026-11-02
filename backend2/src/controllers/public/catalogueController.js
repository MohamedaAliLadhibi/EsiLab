// src/controllers/public/catalogueController.js
const Product = require('../../models/Product');
const db = require('../../db/knex');

// GET /api/products
exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 24, search, category_id } = req.query;
    const result = await Product.findAll({
      page:       parseInt(page),
      limit:      Math.min(parseInt(limit), 48),
      search:     search || null,
      categoryId: category_id ? parseInt(category_id) : null,
    });
    res.json(result);
  } catch (err) { next(err); }
};

// GET /api/products/:slug
exports.show = async (req, res, next) => {
  try {
    const product = await Product.findBySlug(req.params.slug);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Enrich with field metadata for the frontend to know how to render each field
    const fieldKeys = Object.keys(product.data);
    const fieldMeta = await db('product_fields')
      .whereIn('field_key', fieldKeys)
      .select('field_key', 'field_label', 'field_type', 'sort_order')
      .orderBy('sort_order');

    const fieldMetaMap = fieldMeta.reduce((acc, f) => {
      acc[f.field_key] = f;
      return acc;
    }, {});

    const familyKey = product.data.product_family_key;
    const familyQuery = familyKey
      ? db('products').where({ is_active: true }).whereRaw("data->>'product_family_key' = ?", [familyKey]).whereNot({ id: product.id })
      : null;
    const relatedVariantsTotal = familyQuery
      ? Number((await familyQuery.clone().count('id as count').first()).count)
      : 0;
    const relatedVariants = familyQuery
      ? await familyQuery.clone().select('id', 'slug', 'data').orderBy('slug').limit(24)
      : [];

    res.json({
      data: {
        ...product,
        related_variants_total: relatedVariantsTotal,
        related_variants: relatedVariants.map((variant) => ({
          id: variant.id,
          slug: variant.slug,
          data: typeof variant.data === 'string' ? JSON.parse(variant.data) : variant.data,
        })),
        data: {
          ...product.data,
          ...(product.assigned_category ? { category: product.assigned_category } : {}),
          ...(product.category_slug ? { category_slug: product.category_slug } : {}),
        },
        _fieldMeta: fieldMetaMap, // Tells the frontend how to render each field
      },
    });
  } catch (err) { next(err); }
};

// GET /api/categories
exports.categories = async (req, res, next) => {
  try {
    const categories = await db('categories').orderBy('name');
    res.json({ data: categories });
  } catch (err) { next(err); }
};

// GET /api/categories/:slug/products
exports.categoryProducts = async (req, res, next) => {
  try {
    const category = await db('categories').where({ slug: req.params.slug }).first();
    if (!category) return res.status(404).json({ error: 'Category not found' });

    const { page = 1, limit = 24, search } = req.query;
    const result = await Product.findAll({
      page:       parseInt(page),
      limit:      Math.min(parseInt(limit), 48),
      categoryId: category.id,
      search:     search || null,
    });
    res.json({ ...result, category });
  } catch (err) { next(err); }
};
