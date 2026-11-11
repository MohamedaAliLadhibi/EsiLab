// src/controllers/admin/productController.js
const Product = require('../../models/Product');
const db = require('../../db/knex');
const Joi = require('joi');

const updateSchema = Joi.object({
  data:      Joi.object(),
  is_active: Joi.boolean(),
}).min(1);

function csvCell(value) {
  const text = value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

// GET /admin/products/export — download the complete catalogue as UTF-8 CSV.
exports.exportCsv = async (_req, res, next) => {
  try {
    const rows = await db('products as p')
      .leftJoin('suppliers as s', 's.id', 'p.supplier_id')
      .select(
        'p.id', 'p.slug', 'p.is_active', 'p.supplier_id', 's.name as supplier_name', 'p.data',
        db.raw(`(
          SELECT c.name
          FROM product_categories pc
          JOIN categories c ON c.id = pc.category_id
          WHERE pc.product_id = p.id
          ORDER BY c.name
          LIMIT 1
        ) AS assigned_category`),
      )
      .orderBy('p.id');

    const headers = [
      'Product ID', 'Slug', 'Active', 'Supplier ID', 'Supplier', 'SKU', 'Product name',
      'Brand', 'Category', 'Description', 'Image URL', 'Datasheet URL', 'Manufacturer URL',
      'Technical specs (JSON)', 'Product data (JSON)',
    ];
    const lines = [headers.map(csvCell).join(',')];

    for (const row of rows) {
      const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data || {};
      lines.push([
        row.id, row.slug, row.is_active, row.supplier_id, row.supplier_name,
        data.sku, data.name || data.product_name || data.title, data.brand || data.supplier || data.manufacturer,
        row.assigned_category || data.category, data.description || data.short_description,
        data.image_url || data.image, data.datasheet_url, data.manufacturer_url,
        data.technical_specs, data,
      ].map(csvCell).join(','));
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="esilab-catalogue.csv"');
    res.send(`\uFEFF${lines.join('\r\n')}`);
  } catch (err) {
    next(err);
  }
};

// GET /admin/products
exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, search, supplier_id } = req.query;
    const result = await Product.findAll({
      page:       parseInt(page),
      limit:      Math.min(parseInt(limit), 100),
      search:     search || null,
      supplierId: supplier_id ? parseInt(supplier_id) : null,
    });
    res.json(result);
  } catch (err) { next(err); }
};

// GET /admin/products/:id
exports.show = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ data: product });
  } catch (err) { next(err); }
};

// PATCH /admin/products/:id
exports.update = async (req, res, next) => {
  try {
    const { error, value } = updateSchema.validate(req.body);
    if (error) return res.status(422).json({ error: error.details[0].message });

    const product = await Product.update(req.params.id, value);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ data: product });
  } catch (err) { next(err); }
};

// DELETE /admin/products/:id  (hard delete)
exports.destroy = async (req, res, next) => {
  try {
    await Product.delete(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
};

// PATCH /admin/products/:id/toggle-active  (soft enable/disable)
exports.toggleActive = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const updated = await Product.update(req.params.id, { is_active: !product.is_active });
    res.json({ data: updated });
  } catch (err) { next(err); }
};

// GET /admin/product-fields
exports.listFields = async (req, res, next) => {
  try {
    const fields = await db('product_fields').orderBy('sort_order');
    res.json({ data: fields });
  } catch (err) { next(err); }
};

// POST /admin/products/manual  — create a product manually
exports.createManual = async (req, res, next) => {
  try {
    const { supplier_id, data } = req.body;
    if (!supplier_id) return res.status(422).json({ error: 'supplier_id is required' });
    if (!data?.sku)   return res.status(422).json({ error: 'data.sku is required' });
    if (!data?.name)  return res.status(422).json({ error: 'data.name is required' });

    // Safety: strip any price keys
    const PRICE = /price|cost|tarif|prix|preis|rate|msrp|rrp/i;
    for (const k of Object.keys(data)) { if (PRICE.test(k)) delete data[k]; }

    const product = await Product.create({ supplierId: supplier_id, data });
    res.status(201).json({ data: product });
  } catch (err) { next(err); }
};
