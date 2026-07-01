const Joi = require('joi');
const db = require('../../db/knex');
const { hashPassword } = require('../../utils/auth');

const userSchema = Joi.object({
  name: Joi.string().max(150).required(),
  email: Joi.string().email().max(255).required(),
  password: Joi.string().min(8).max(255).required(),
  role: Joi.string().max(50).default('admin'),
  is_active: Joi.boolean().default(true),
});

// GET /admin/users
exports.list = async (_req, res, next) => {
  try {
    const users = await db('users')
      .select('id', 'name', 'email', 'role', 'is_active', 'last_login_at', 'created_at', 'updated_at')
      .orderBy([{ column: 'created_at', order: 'desc' }]);
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
};

// POST /admin/users
exports.create = async (req, res, next) => {
  try {
    const { error, value } = userSchema.validate(req.body);
    if (error) return res.status(422).json({ error: error.details[0].message });

    const normalizedEmail = value.email.trim().toLowerCase();
    const { passwordHash } = hashPassword(value.password);

    const [user] = await db('users')
      .insert({
        name: value.name.trim(),
        email: normalizedEmail,
        password_hash: passwordHash,
        role: value.role,
        is_active: value.is_active,
      })
      .returning(['id', 'name', 'email', 'role', 'is_active', 'last_login_at', 'created_at', 'updated_at']);

    res.status(201).json({ data: user });
  } catch (err) {
    next(err);
  }
};

// DELETE /admin/users/:id
exports.destroy = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ error: 'Invalid user id.' });
    }

    if (String(req.adminUser?.sub) === String(userId)) {
      return res.status(403).json({ error: 'You cannot delete your own account.' });
    }

    const [{ count }] = await db('users').count('* as count');
    if (Number(count) <= 1) {
      return res.status(409).json({ error: 'You cannot delete the last remaining user.' });
    }

    const deleted = await db('users').where({ id: userId }).del();
    if (!deleted) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};
