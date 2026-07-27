const crypto = require('crypto');

const ITERATIONS = 310000;
const KEY_LENGTH = 32;
const DIGEST = 'sha256';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
  return `pbkdf2$${ITERATIONS}$${salt}$${hash}`;
}

function verifyPassword(password, storedHash) {
  const [algorithm, iterations, salt, originalHash] = String(storedHash || '').split('$');
  if (algorithm !== 'pbkdf2' || !iterations || !salt || !originalHash) return false;

  const hash = crypto
    .pbkdf2Sync(password, salt, Number(iterations), KEY_LENGTH, DIGEST)
    .toString('hex');

  if (hash.length !== originalHash.length) return false;

  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'));
}

module.exports = {
  hashPassword,
  verifyPassword,
};
