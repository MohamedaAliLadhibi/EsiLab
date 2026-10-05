// src/queue/importQueue.js
const Bull = require('bull');
const { runImport } = require('../src/services/ImportService');
const logger = require('../src/utils/logger');

// Connect to Redis using environment variables
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const importQueue = new Bull('import', {
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
  defaultJobOptions: {
    attempts: 1,          // retry once if fails
    timeout: 600000,      // 10 minutes max per job
    removeOnComplete: true,
    removeOnFail: true,
  },
});

// Worker processor â€“ processes each job
importQueue.process(async (job) => {
  const { importLogId, supplierId, fileBuffer, originalFilename } = job.data;

  logger.info(`[Queue] Job #${job.id} started for import log #${importLogId}`);

  try {
    // Run the import (synchronous, but we're in a separate process)
    const buffer = Buffer.isBuffer(fileBuffer)
    ? fileBuffer
    : Buffer.from(fileBuffer?.data ?? fileBuffer);

  const result = await runImport(importLogId, supplierId, buffer, originalFilename);
    logger.info(`[Queue] Job #${job.id} completed for import log #${importLogId}`);
    return result;
  } catch (err) {
    logger.error(`[Queue] Job #${job.id} failed: ${err.message}`);
    throw err; // Bull will mark the job as failed
  }
});

// Optional: event listeners for debugging
importQueue.on('completed', (job, result) => {
  logger.info(`[Queue] Job #${job.id} completed with result: ${JSON.stringify(result)}`);
});

importQueue.on('failed', (job, err) => {
  logger.error(`[Queue] Job #${job.id} failed: ${err.message}`);
});

module.exports = importQueue;