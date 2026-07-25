const db = require('../client');

const TABLE = 'stock_reservations';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByOrderAndSku(order_id, sku_id) {
  return db(TABLE).where({ order_id, sku_id }).first();
}

async function listByOrder(order_id) {
  return db(TABLE).where({ order_id });
}

async function create(data, trx) {
  const [id] = await (trx || db)(TABLE).insert(data);
  return (trx || db)(TABLE).where({ id }).first();
}

async function update(id, data, trx) {
  await (trx || db)(TABLE).where({ id }).update(data);
  return (trx || db)(TABLE).where({ id }).first();
}

async function remove(id, trx) {
  return (trx || db)(TABLE).where({ id }).delete();
}

async function releaseByOrder(order_id, trx) {
  return (trx || db)(TABLE).where({ order_id }).delete();
}

module.exports = {
  findById,
  findByOrderAndSku,
  listByOrder,
  create,
  update,
  remove,
  releaseByOrder,
};
