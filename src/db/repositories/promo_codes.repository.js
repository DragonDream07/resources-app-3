const db = require('../client');

const TABLE = 'promo_codes';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByCode(code) {
  return db(TABLE).where({ code }).first();
}

async function list({ limit = 20, offset = 0, is_active } = {}) {
  const query = db(TABLE);
  if (is_active !== undefined) query.where({ is_active });
  return query.orderBy('created_at', 'desc').limit(limit).offset(offset);
}

async function count({ is_active } = {}) {
  const query = db(TABLE);
  if (is_active !== undefined) query.where({ is_active });
  const [{ total }] = await query.count('id as total');
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

async function incrementUsageCount(id, trx) {
  return (trx || db)(TABLE)
    .where({ id })
    .update(db.raw('usage_count = usage_count + 1'));
}

async function remove(id) {
  return db(TABLE).where({ id }).delete();
}

module.exports = {
  findById,
  findByCode,
  list,
  count,
  create,
  update,
  incrementUsageCount,
  remove,
};
