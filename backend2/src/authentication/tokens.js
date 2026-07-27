const crypto = require('crypto');

const DEFAULT_EXPIRES_IN_SECONDS = 24 * 60 * 60;

function base64url(input) {
  return Buffer.from(JSON.stringify(input)).toString('base64url');
}

function sign(payload) {
  const secret = process.env.AUTH_TOKEN_SECRET || process.env.ADMIN_TOKEN_SECRET;
  if (!secret) {
    throw new Error('AUTH_TOKEN_SECRET is required');
  }

  const header = base64url({ alg: 'HS256', typ: 'JWT' });
  const body = base64url({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + DEFAULT_EXPIRES_IN_SECONDS,
  });
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');

  return `${header}.${body}.${signature}`;
}

function verify(token) {
  const secret = process.env.AUTH_TOKEN_SECRET || process.env.ADMIN_TOKEN_SECRET;
  if (!secret) {
    throw new Error('AUTH_TOKEN_SECRET is required');
  }

  const [header, body, signature] = String(token || '').split('.');
  if (!header || !body || !signature) return null;

  const expectedSignature = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  if (signature.length !== expectedSignature.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return null;

  let payload;
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch (_err) {
    return null;
  }

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

  return payload;
}

module.exports = {
  sign,
  verify,
};
