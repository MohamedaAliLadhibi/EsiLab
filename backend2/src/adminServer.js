// src/adminServer.js - ADMIN API
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const adminRoutes = require('./routes/admin');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.ADMIN_PORT || 3001;

const ALLOWED_ORIGINS = (process.env.ADMIN_CORS_ORIGINS || 'http://localhost:4000')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error('CORS: origin not allowed'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', app: 'admin' }));
app.use('/admin', adminRoutes);
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Admin API running on port ${PORT}`);
});

module.exports = app;
