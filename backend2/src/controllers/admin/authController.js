const db = require('../../db/knex');
const { createSessionToken, buildCookie, clearCookie, verifyPassword, hashPassword } = require('../../utils/auth');

async function bootstrap(req, res, next) {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    if (!normalizedEmail.includes('@')) {
      return res.status(400).json({ error: 'A valid email is required.' });
    }

    if (String(password).length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    const { passwordHash } = hashPassword(String(password));
    const [user] = await db('users')
      .insert({
        name: String(name).trim(),
        email: normalizedEmail,
        password_hash: passwordHash,
        role: 'admin',
        is_active: true,
      })
      .returning(['id', 'name', 'email', 'role']);

    const token = createSessionToken(user);
    res.setHeader('Set-Cookie', buildCookie(token));

    return res.status(201).json({
      data: {
        user,
      },
    });
  } catch (err) {
    if (String(err.message || '').toLowerCase().includes('users_email_unique')) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await db('users').whereRaw('lower(email) = lower(?)', [email]).first();
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const valid = verifyPassword(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    await db('users').where({ id: user.id }).update({ last_login_at: db.fn.now(), updated_at: db.fn.now() });

    const token = createSessionToken(user);
    res.setHeader('Set-Cookie', buildCookie(token));
    return res.json({
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

async function me(req, res) {
  return res.json({ data: req.adminUser || null });
}

async function logout(_req, res) {
  res.setHeader('Set-Cookie', clearCookie());
  return res.json({ data: { ok: true } });
}

module.exports = {
  bootstrap,
  login,
  me,
  logout,
};
