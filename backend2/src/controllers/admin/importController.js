// src/controllers/admin/importController.js
const path = require('path');
const db = require('../../db/knex');
const importQueue = require('../../../queue/importQueue');  // ✅ fixed
const logger = require('../../utils/logger');
// ... rest of the file

// POST /admin/suppliers/:id/import
// Accepts a multipart Excel upload, queues the import job.
exports.upload = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded. Send an Excel file as multipart field "file".' });
  }

  const supplierId = parseInt(req.params.id);
  const originalFilename = req.file.originalname;

  // Validate extension
  const ext = path.extname(originalFilename).toLowerCase();
  if (!['.xlsx', '.xls'].ext(ext)) {
    return res.status(422).json({ error: 'Only .xlsx and .xls files are accepted.' });
  }

  // Create an import log record with status 'pending' (or 'queued')
  const [importLog] = await db('import_logs')
    .insert({
      supplier_id: supplierId,
      original_filename: originalFilename,
      status: 'pending', // will be updated to 'processing' by worker
    })
    .returning('*');

  // Add job to Bull queue
  const job = await importQueue.add({
    importLogId: importLog.id,
    supplierId,
    fileBuffer: req.file.buffer, // Buffer is serializable
    originalFilename,
  });

  logger.info(`[Import] Job #${job.id} queued for import log #${importLog.id}`);

  // Respond immediately with job ID and log ID
  res.status(202).json({
    message: 'Import job queued. Check status via /admin/imports/:logId.',
    jobId: job.id,
    importLogId: importLog.id,
    status: 'queued',
  });
};

// GET /admin/suppliers/:id/imports – list logs (unchanged)
exports.listLogs = async (req, res, next) => {
  try {
    const logs = await db('import_logs')
      .where({ supplier_id: req.params.id })
      .orderBy('created_at', 'desc')
      .limit(50);
    res.json({ data: logs });
  } catch (err) { next(err); }
};

// GET /admin/imports/:logId – show single log (unchanged)
exports.showLog = async (req, res, next) => {
  try {
    const log = await db('import_logs').where({ id: req.params.logId }).first();
    if (!log) return res.status(404).json({ error: 'Import log not found' });
    res.json({ data: log });
  } catch (err) { next(err); }
};