// src/controllers/admin/supplierController.js
const Supplier = require('../../models/Supplier');
const SupplierFieldMapping = require('../../models/SupplierFieldMapping');
const ProductField = require('../../models/ProductField');
const Joi = require('joi');

const supplierSchema = Joi.object({
  name:              Joi.string().max(255).required(),
  contact_email:     Joi.string().email().allow('', null),
  contact_phone:     Joi.string().max(100).allow('', null),
  notes:             Joi.string().allow('', null),
  header_row_number: Joi.number().integer().min(1).default(1),
  is_active:         Joi.boolean().default(true),
});

const mappingSchema = Joi.array().items(
  Joi.object({
    field_id:      Joi.number().integer().required(),
    source_column: Joi.string().max(10).regex(/^[A-Za-z]+$/).required()
      .messages({ 'string.pattern.base': 'source_column must be an Excel column letter (e.g. A, B, AA)' }),
  })
);

// GET /admin/suppliers
exports.list = async (req, res, next) => {
  try {
    const suppliers = await Supplier.findAll();
    res.json({ data: suppliers });
  } catch (err) { next(err); }
};

// GET /admin/suppliers/:id
exports.show = async (req, res, next) => {
  try {
    const supplier = await Supplier.findWithMappings(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ data: supplier });
  } catch (err) { next(err); }
};

// POST /admin/suppliers
exports.create = async (req, res, next) => {
  try {
    const { error, value } = supplierSchema.validate(req.body);
    if (error) return res.status(422).json({ error: error.details[0].message });

    const supplier = await Supplier.create(value);
    res.status(201).json({ data: supplier });
  } catch (err) { next(err); }
};

// PUT /admin/suppliers/:id
exports.update = async (req, res, next) => {
  try {
    const { error, value } = supplierSchema.validate(req.body);
    if (error) return res.status(422).json({ error: error.details[0].message });

    const supplier = await Supplier.update(req.params.id, value);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ data: supplier });
  } catch (err) { next(err); }
};

// DELETE /admin/suppliers/:id
exports.destroy = async (req, res, next) => {
  try {
    await Supplier.delete(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
};

// GET /admin/suppliers/:id/mappings
exports.getMappings = async (req, res, next) => {
  try {
    const mappings = await SupplierFieldMapping.forSupplier(req.params.id);
    const allFields = await ProductField.findAll();
    res.json({ data: { mappings, allFields } });
  } catch (err) { next(err); }
};

// PUT /admin/suppliers/:id/mappings
// Replaces ALL mappings for a supplier atomically
exports.replaceMappings = async (req, res, next) => {
  try {
    const { error, value } = mappingSchema.validate(req.body.mappings);
    if (error) return res.status(422).json({ error: error.details[0].message });

    await SupplierFieldMapping.replaceForSupplier(req.params.id, value);
    const updated = await SupplierFieldMapping.forSupplier(req.params.id);
    res.json({ data: updated });
  } catch (err) { next(err); }
};
