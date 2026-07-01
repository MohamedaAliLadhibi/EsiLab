/**
 * Admin security:
 * 1. IP whitelist  - requests from unknown IPs are rejected immediately
 * 2. Session cookie - signed short-lived auth cookie for dashboard users
 * 3. API key        - optional server-to-server fallback
 */

const ALLOWED_IPS = (process.env.ADMIN_ALLOWED_IPS || '127.0.0.1,::1')
  .split(',')
  .map((ip) => ip.trim());

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
const { verifySessionToken, parseCookies } = require('../utils/auth');

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  return forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress;
}

module.exports = function adminAuth(req, res, next) {
  const clientIp = getClientIp(req);
  if (ALLOWED_IPS.length > 0 && !ALLOWED_IPS.includes(clientIp)) {
    return res.status(403).json({ error: 'Forbidden: IP not allowed' });
  }

  const cookieToken = parseCookies(req.headers.cookie || '').admin_session;
  const session = verifySessionToken(cookieToken);
  if (session) {
    req.adminUser = session;
    return next();
  }

  if (ADMIN_API_KEY) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (token && token === ADMIN_API_KEY) {
      return next();
    }
  }

  return res.status(401).json({ error: 'Unauthorized: please log in' });
};
