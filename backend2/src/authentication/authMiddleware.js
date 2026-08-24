const User = require('./User');
const tokens = require('./tokens');

async function requireAuth(req, res, next) {
  try {
    // 🔥 Read token from the secure HttpOnly cookie
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const payload = tokens.verify(token);
    if (!payload?.id) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const user = await User.findById(payload.id);
    if (!user || user.status !== 'approved') {
      return res.status(401).json({ error: 'Account is not approved' });
    }

    req.user = User.sanitize(user);
    next();
  } catch (err) {
    next(err);
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
}

module.exports = {
  requireAuth,
  requireAdmin,
};