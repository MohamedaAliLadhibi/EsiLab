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

    res.json({
      data: {
        ...product,
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

    const { page = 1, limit = 24 } = req.query;
    const result = await Product.findAll({
      page:       parseInt(page),
      limit:      Math.min(parseInt(limit), 48),
      categoryId: category.id,
    });
    res.json({ data: { category, ...result } });
  } catch (err) { next(err); }
};
