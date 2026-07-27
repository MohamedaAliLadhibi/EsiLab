const db = require('../db/knex');

const SAFE_COLUMNS = ['id', 'name', 'email', 'role', 'status', 'created_at', 'updated_at', 'approved_at'];

function sanitize(user) {
  if (!user) return null;
  return SAFE_COLUMNS.reduce((safeUser, column) => {
    safeUser[column] = user[column];
    return safeUser;
  }, {});
}

async function findByEmail(email) {
  return db('users').whereRaw('LOWER(email) = LOWER(?)', [email]).first();
}

async function findById(id) {
  return db('users').where({ id }).first();
}

async function list(filters = {}) {
  const query = db('users').select(SAFE_COLUMNS).orderBy('created_at', 'desc');
  if (filters.status) query.where({ status: filters.status });
  return query;
}

async function create(payload) {
  const [user] = await db('users').insert(payload).returning(SAFE_COLUMNS);
  return user;
}

async function update(id, payload) {
  const [user] = await db('users')
    .where({ id })
    .update({ ...payload, updated_at: db.fn.now() })
    .returning(SAFE_COLUMNS);
  return user || null;
}

async function remove(id) {
  return db('users').where({ id }).delete();
}

module.exports = {
  sanitize,
  findByEmail,
  findById,
  list,
  create,
  update,
  remove,
};
