const crypto = require('crypto');

const COOKIE_NAME = 'admin_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET not set');
  }
  return secret;
}

function base64Url(input) {
  return Buffer.from(input).toString('base64url');
}

function sign(value) {
  return crypto.createHmac('sha256', getSecret()).update(value).digest('base64url');
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const iterations = 120000;
  const digest = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');
  return {
    passwordHash: `pbkdf2$${iterations}$${salt}$${digest}`,
  };
}

function verifyPassword(password, storedHash) {
  const [scheme, iterationsStr, salt, digest] = String(storedHash).split('$');
  if (scheme !== 'pbkdf2' || !iterationsStr || !salt || !digest) return false;
  const iterations = Number(iterationsStr);
  const computed = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(digest));
}

function createSessionToken(user) {
  const payload = JSON.stringify({
    sub: String(user.id),
    email: user.email,
    role: user.role,
    exp: Date.now() + SESSION_TTL_MS,
  });
  const encoded = base64Url(payload);
  return `${encoded}.${sign(encoded)}`;
}

function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;
  if (sign(encoded) !== signature) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function buildCookie(token) {
  const secure = String(process.env.NODE_ENV) === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 8}${secure}`;
}

function clearCookie() {
  const secure = String(process.env.NODE_ENV) === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secure}`;
}

function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((acc, pair) => {
    const [key, ...rest] = pair.trim().split('=');
    if (!key) return acc;
    acc[key] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
}

module.exports = {
  COOKIE_NAME,
  SESSION_TTL_MS,
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  buildCookie,
  clearCookie,
  parseCookies,
};
