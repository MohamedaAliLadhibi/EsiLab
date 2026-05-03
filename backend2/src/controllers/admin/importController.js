// src/controllers/admin/importController.js
const path = require('path');
const db = require('../../db/knex');
const { runImport } = require('../../services/ImportService');
const logger = require('../../utils/logger');

// POST /admin/suppliers/:id/import
// Accepts a multipart Excel upload, runs the import (sync for simplicity,
// swap for a Bull queue job in production for large files).
exports.upload = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded. Send an Excel file as multipart field "file".' });
  }

  const supplierId = parseInt(req.params.id);
  const originalFilename = req.file.originalname;

  // Validate extension
  const ext = path.extname(originalFilename).toLowerCase();
  if (!['.xlsx', '.xls'].includes(ext)) {
    return res.status(422).json({ error: 'Only .xlsx and .xls files are accepted.' });
  }

  // Create an import log record
  const [importLog] = await db('import_logs')
    .insert({
      supplier_id:       supplierId,
      original_filename: originalFilename,
      status:            'pending',
    })
    .returning('*');

  logger.info(`[Import] Job #${importLog.id} queued for supplier ${supplierId}, file: ${originalFilename}`);

  try {
    // For large files: push to Bull queue instead of running inline
    const result = await runImport(importLog.id, supplierId, req.file.buffer, originalFilename);

    res.status(202).json({
      message:      'Import completed.',
      importLogId:  importLog.id,
      inserted:     result.inserted,
      updated:      result.updated,
      skipped:      result.skipped,
      rowErrors:    result.rowErrors,
    });
  } catch (err) {
    res.status(500).json({
      error:       'Import failed.',
      importLogId: importLog.id,
      detail:      err.message,
    });
  }
};

// GET /admin/suppliers/:id/imports
exports.listLogs = async (req, res, next) => {
  try {
    const logs = await db('import_logs')
      .where({ supplier_id: req.params.id })
      .orderBy('created_at', 'desc')
      .limit(50);
    res.json({ data: logs });
  } catch (err) { next(err); }
};

// GET /admin/imports/:logId
exports.showLog = async (req, res, next) => {
  try {
    const log = await db('import_logs').where({ id: req.params.logId }).first();
    if (!log) return res.status(404).json({ error: 'Import log not found' });
    res.json({ data: log });
  } catch (err) { next(err); }
};
