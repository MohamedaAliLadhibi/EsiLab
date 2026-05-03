// src/middleware/adminAuth.js
/**
 * Two-layer admin security:
 * 1. IP whitelist  — requests from unknown IPs are rejected immediately
 * 2. API key       — Bearer token checked on every request
 *
 * In production, also sit the admin server behind a VPN or Nginx with
 * allow/deny directives so it is unreachable from the public internet.
 */

const ALLOWED_IPS = (process.env.ADMIN_ALLOWED_IPS || '127.0.0.1,::1')
  .split(',')
  .map((ip) => ip.trim());

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

function getClientIp(req) {
  // Respect X-Forwarded-For if behind a trusted proxy (Nginx, etc.)
  const forwarded = req.headers['x-forwarded-for'];
  return forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress;
}

module.exports = function adminAuth(req, res, next) {
  // ── 1. IP check ──────────────────────────────────────────────────────────
  const clientIp = getClientIp(req);
  if (ALLOWED_IPS.length > 0 && !ALLOWED_IPS.includes(clientIp)) {
    return res.status(403).json({ error: 'Forbidden: IP not allowed' });
  }

  // ── 2. API key check ─────────────────────────────────────────────────────
  if (!ADMIN_API_KEY) {
    return res.status(500).json({ error: 'Server misconfiguration: ADMIN_API_KEY not set' });
  }

  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token || token !== ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: invalid or missing API key' });
  }

  next();
};
