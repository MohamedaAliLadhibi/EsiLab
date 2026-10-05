// src/controllers/admin/importController.js
const path = require('path');
const db = require('../../db/knex');
const importQueue = require('../../../queue/importQueue');
const logger = require('../../utils/logger');

// POST /admin/suppliers/:id/import
// Accepts a multipart Excel upload and enqueues it for async processing.
exports.upload = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'No file uploaded. Send an Excel file as multipart field "file".',
    });
  }

  const supplierId = parseInt(req.params.id);
  const originalFilename = req.file.originalname;

  // Validate extension
  const ext = path.extname(originalFilename).toLowerCase();
  if (!['.xlsx', '.xls'].includes(ext)) {
    return res.status(422).json({ error: 'Only .xlsx and .xls files are accepted.' });
  }

  // Create an import log record before enqueuing so failures remain traceable.
  const [importLog] = await db('import_logs')
    .insert({
      supplier_id: supplierId,
      original_filename: originalFilename,
      status: 'pending',
    })
    .returning('*');

  logger.info(`[Import] Enqueuing import log #${importLog.id} for supplier ${supplierId}`);

  try {
    await importQueue.add({
      importLogId: importLog.id,
      supplierId,
      fileBuffer: req.file.buffer,   // ← matches worker destructuring
      originalFilename,
    });

    res.status(202).json({
      message: 'Import enqueued.',
      importLogId: importLog.id,
    });
  } catch (err) {
    logger.error(`[Import] Failed to enqueue import log #${importLog.id}: ${err.message}`);
    next(err);
  }
};

// GET /admin/suppliers/:id/imports – list logs
exports.listLogs = async (req, res, next) => {
  try {
    const logs = await db('import_logs')
      .where({ supplier_id: req.params.id })
      .orderBy('created_at', 'desc')
      .limit(50);
    res.json({ data: logs });
  } catch (err) {
    next(err);
  }
};

// GET /admin/imports/:logId – show single log
exports.showLog = async (req, res, next) => {
  try {
    const log = await db('import_logs').where({ id: req.params.logId }).first();
    if (!log) return res.status(404).json({ error: 'Import log not found' });
    res.json({ data: log });
  } catch (err) {
    next(err);
  }
};