const Joi = require('joi');
const User = require('./User');
const { hashPassword, verifyPassword } = require('./passwords');
const tokens = require('./tokens');

const signupSchema = Joi.object({
  name: Joi.string().trim().min(2).max(255).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(8).max(255).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required(),
});

exports.signup = async (req, res, next) => {
  try {
    const { error, value } = signupSchema.validate(req.body);
    if (error) return res.status(422).json({ error: error.details[0].message });

    const existing = await User.findByEmail(value.email);
    if (existing) return res.status(409).json({ error: 'Email is already registered' });

    const user = await User.create({
      name: value.name,
      email: value.email,
      password_hash: hashPassword(value.password),
      role: 'employer',
      status: 'pending',
    });

    res.status(201).json({
      data: user,
      message: 'Signup received. An admin must approve this account before login.',
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(422).json({ error: error.details[0].message });

    const user = await User.findByEmail(value.email);
    if (!user || !verifyPassword(value.password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.status !== 'approved') {
      return res.status(403).json({ error: 'Account is waiting for admin approval' });
    }

    const safeUser = User.sanitize(user);
    res.json({
      data: {
        user: safeUser,
        token: tokens.sign({ id: safeUser.id, role: safeUser.role }),
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res) => {
  res.json({ data: req.user });
};
