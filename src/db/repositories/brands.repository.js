const db = require('../client');

const TABLE = 'brands';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findBySlug(slug) {
  return db(TABLE).where({ slug }).first();
}

async function findByName(name) {
  return db(TABLE).where({ name }).first();
}

async function list({ limit = 20, offset = 0 } = {}) {
  return db(TABLE).orderBy('name', 'asc').limit(limit).offset(offset);
}

async function count() {
  const [{ total }] = await db(TABLE).count('id as total');
  return Number(total);
}

async function create(data) {
  const [id] = await db(TABLE).insert(data);
  return findById(id);
}

async function update(id, data) {
  await db(TABLE).where({ id }).update(data);
  return findById(id);
}

async function remove(id) {
  return db(TABLE).where({ id }).delete();
}

module.exports = {
  findById,
  findBySlug,
  findByName,
  list,
  count,
  create,
  update,
  remove,
};
