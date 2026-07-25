const db = require('../client');

const TABLE = 'return_requests';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByOrderId(order_id) {
  return db(TABLE).where({ order_id });
}

async function list({ limit = 20, offset = 0, status } = {}) {
  const query = db(TABLE);
  if (status) query.where({ status });
  return query.orderBy('created_at', 'desc').limit(limit).offset(offset);
}

async function count({ status } = {}) {
  const query = db(TABLE);
  if (status) query.where({ status });
  const [{ total }] = await query.count('id as total');
  return Number(total);
}

async function create(data, trx) {
  const [id] = await (trx || db)(TABLE).insert(data);
  return (trx || db)(TABLE).where({ id }).first();
}

async function update(id, data, trx) {
  await (trx || db)(TABLE).where({ id }).update(data);
  return (trx || db)(TABLE).where({ id }).first();
}

module.exports = {
  findById,
  findByOrderId,
  list,
  count,
  create,
  update,
};
