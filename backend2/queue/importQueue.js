// src/queue/importQueue.js
const Bull = require('bull');
const { runImport } = require('../src/services/ImportService');
const logger = require('../src/utils/logger');

// Prefer a managed Redis URL (Railway and most cloud providers provide one).
// Keep the host/port form for local development and existing deployments.
function getRedisConfig() {
  if (process.env.REDIS_URL) {
    const url = new URL(process.env.REDIS_URL);
    const database = url.pathname.replace(/^\//, '');
    const config = {
      host: url.hostname,
      port: Number(url.port || (url.protocol === 'rediss:' ? 6380 : 6379)),
    };

    if (url.username) config.username = decodeURIComponent(url.username);
    if (url.password) config.password = decodeURIComponent(url.password);
    if (database) config.db = Number(database);
    if (url.protocol === 'rediss:') config.tls = {};

    return config;
  }

  const config = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || 6379),
  };

  if (process.env.REDIS_USERNAME) config.username = process.env.REDIS_USERNAME;
  if (process.env.REDIS_PASSWORD) config.password = process.env.REDIS_PASSWORD;
  if (process.env.REDIS_TLS === 'true') config.tls = {};

  return config;
}

const importQueue = new Bull('import', {
  redis: getRedisConfig(),
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
