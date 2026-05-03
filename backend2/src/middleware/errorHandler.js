// src/middleware/errorHandler.js
const logger = require('../utils/logger');

module.exports = function errorHandler(err, req, res, next) {
  logger.error(`${req.method} ${req.path} — ${err.message}`, { stack: err.stack });

  // Knex unique constraint violation
  if (err.code === '23505') {
    return res.status(409).json({ error: 'A record with that value already exists.' });
  }

  // Knex foreign key violation
  if (err.code === '23503') {
    return res.status(422).json({ error: 'Referenced record does not exist.' });
  }

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: status === 500 ? 'Internal server error' : err.message,
  });
};
