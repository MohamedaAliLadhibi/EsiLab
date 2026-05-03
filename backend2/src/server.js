// src/server.js — PUBLIC CATALOGUE API
// Read-only. No auth. Served at catalogue.com
require('dotenv').config();

const express  = require('express');
const helmet   = require('helmet');
const cors     = require('cors');
const rateLimit = require('express-rate-limit');

const publicRoutes   = require('./routes/public');
const errorHandler   = require('./middleware/errorHandler');
const logger         = require('./utils/logger');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Security headers ─────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: '*', methods: ['GET'] })); // Public catalogue is GET-only

// ── Rate limiting ────────────────────────────────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max:      300,
  standardHeaders: true,
  legacyHeaders:   false,
}));

app.use(express.json());

// ── Static assets (downloaded product images) ────────────────────────────
app.use('/assets', express.static('storage/public'));

// ── Health check ─────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', app: 'public' }));

// ── Routes ────────────────────────────────────────────────────────────────
app.use('/api', publicRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// ── Error handler ─────────────────────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`🌐  Public catalogue API running on port ${PORT}`);
});

module.exports = app; // For tests
