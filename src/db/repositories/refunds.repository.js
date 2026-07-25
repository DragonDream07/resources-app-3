const db = require('../client');

const TABLE = 'refunds';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByGatewayRef(gateway_reference) {
  return db(TABLE).where({ gateway_reference }).first();
}

async function listByOrder(order_id) {
  return db(TABLE).where({ order_id }).orderBy('created_at', 'desc');
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
  findByGatewayRef,
  listByOrder,
  create,
  update,
};
