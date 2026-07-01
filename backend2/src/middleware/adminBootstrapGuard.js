const db = require('../db/knex');

const ALLOWED_IPS = (process.env.ADMIN_ALLOWED_IPS || '127.0.0.1,::1')
  .split(',')
  .map((ip) => ip.trim())
  .filter(Boolean);

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  return forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress;
}

module.exports = async function adminBootstrapGuard(req, res, next) {
  const clientIp = getClientIp(req);
  if (ALLOWED_IPS.length > 0 && !ALLOWED_IPS.includes(clientIp)) {
    return res.status(403).json({ error: 'Forbidden: IP not allowed' });
  }

  const bootstrapToken = process.env.ADMIN_BOOTSTRAP_TOKEN;
  if (!bootstrapToken) {
    return res.status(503).json({
      error: 'Bootstrap is disabled. Set ADMIN_BOOTSTRAP_TOKEN to enable first-admin creation.',
    });
  }

  const authHeader = req.headers.authorization || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (bearerToken !== bootstrapToken) {
    return res.status(401).json({ error: 'Unauthorized: invalid bootstrap token' });
  }

  try {
    const [{ count }] = await db('users').count('* as count');
    if (Number(count) > 0) {
      return res.status(409).json({ error: 'Bootstrap unavailable: an admin account already exists.' });
    }
    return next();
  } catch (err) {
    return next(err);
  }
};
