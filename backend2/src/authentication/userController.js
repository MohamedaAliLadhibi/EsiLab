const Joi = require('joi');
const User = require('./User');
const { hashPassword } = require('./passwords');

const roleSchema = Joi.string().valid('admin', 'employer');
const statusSchema = Joi.string().valid('pending', 'approved', 'rejected');

const createSchema = Joi.object({
  name: Joi.string().trim().min(2).max(255).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(8).max(255).required(),
  role: roleSchema.default('employer'),
  status: statusSchema.default('approved'),
});

const updateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(255),
  email: Joi.string().trim().lowercase().email(),
  password: Joi.string().min(8).max(255),
  role: roleSchema,
  status: statusSchema,
}).min(1);

exports.list = async (req, res, next) => {
  try {
    const users = await User.list({ status: req.query.status });
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) return res.status(422).json({ error: error.details[0].message });

    const existing = await User.findByEmail(value.email);
    if (existing) return res.status(409).json({ error: 'Email is already registered' });

    const user = await User.create({
      name: value.name,
      email: value.email,
      password_hash: hashPassword(value.password),
      role: value.role,
      status: value.status,
      approved_at: value.status === 'approved' ? new Date() : null,
    });

    res.status(201).json({ data: user });
  } catch (err) {
    next(err);
  }
};

exports.show = async (req, res, next) => {
  try {
    const user = User.sanitize(await User.findById(req.params.id));
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { error, value } = updateSchema.validate(req.body);
    if (error) return res.status(422).json({ error: error.details[0].message });

    if (value.email) {
      const existing = await User.findByEmail(value.email);
      if (existing && Number(existing.id) !== Number(req.params.id)) {
        return res.status(409).json({ error: 'Email is already registered' });
      }
    }

    const payload = { ...value };
    if (payload.password) {
      payload.password_hash = hashPassword(payload.password);
      delete payload.password;
    }
    if (payload.status === 'approved') payload.approved_at = new Date();

    const user = await User.update(req.params.id, payload);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ data: user });
  } catch (err) {
    next(err);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    await User.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.approve = async (req, res, next) => {
  try {
    const user = await User.update(req.params.id, {
      status: 'approved',
      approved_at: new Date(),
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
};

exports.reject = async (req, res, next) => {
  try {
    const user = await User.update(req.params.id, { status: 'rejected' });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
};
