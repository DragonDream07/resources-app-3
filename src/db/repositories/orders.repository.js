const db = require('../client');

const ORDERS_TABLE = 'orders';
const ITEMS_TABLE = 'order_items';
const HISTORY_TABLE = 'order_status_history';
const TRACKING_TABLE = 'order_tracking';

async function findById(id) {
  return db(ORDERS_TABLE).where({ id }).first();
}

async function findByOrderNumber(order_number) {
  return db(ORDERS_TABLE).where({ order_number }).first();
}

async function listByUser(user_id, { limit = 20, offset = 0 } = {}) {
  return db(ORDERS_TABLE)
    .where({ user_id })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset);
}

async function countByUser(user_id) {
  const [{ total }] = await db(ORDERS_TABLE).where({ user_id }).count('id as total');
  return Number(total);
}

async function list({ limit = 20, offset = 0, status } = {}) {
  const query = db(ORDERS_TABLE);
  if (status) query.where({ status });
  return query.orderBy('created_at', 'desc').limit(limit).offset(offset);
}

async function count({ status } = {}) {
  const query = db(ORDERS_TABLE);
  if (status) query.where({ status });
  const [{ total }] = await query.count('id as total');
  return Number(total);
}

async function create(data, trx) {
  const [id] = await (trx || db)(ORDERS_TABLE).insert(data);
  return (trx || db)(ORDERS_TABLE).where({ id }).first();
}

async function update(id, data, trx) {
  await (trx || db)(ORDERS_TABLE).where({ id }).update(data);
  return (trx || db)(ORDERS_TABLE).where({ id }).first();
}

async function listItems(order_id) {
  return db(ITEMS_TABLE).where({ order_id });
}

async function findItemById(id) {
  return db(ITEMS_TABLE).where({ id }).first();
}

async function createItem(data, trx) {
  const [id] = await (trx || db)(ITEMS_TABLE).insert(data);
  return (trx || db)(ITEMS_TABLE).where({ id }).first();
}

async function updateItem(id, data, trx) {
  await (trx || db)(ITEMS_TABLE).where({ id }).update(data);
  return (trx || db)(ITEMS_TABLE).where({ id }).first();
}

async function addStatusHistory(data, trx) {
  const [id] = await (trx || db)(HISTORY_TABLE).insert(data);
  return (trx || db)(HISTORY_TABLE).where({ id }).first();
}

async function getStatusHistory(order_id) {
  return db(HISTORY_TABLE).where({ order_id }).orderBy('created_at', 'asc');
}

async function findTracking(order_id) {
  return db(TRACKING_TABLE).where({ order_id }).first();
}

async function upsertTracking(order_id, data, trx) {
  const existing = await (trx || db)(TRACKING_TABLE).where({ order_id }).first();
  if (existing) {
    await (trx || db)(TRACKING_TABLE).where({ order_id }).update(data);
    return (trx || db)(TRACKING_TABLE).where({ order_id }).first();
  }
  const [id] = await (trx || db)(TRACKING_TABLE).insert({ order_id, ...data });
  return (trx || db)(TRACKING_TABLE).where({ id }).first();
}

module.exports = {
  findById,
  findByOrderNumber,
  listByUser,
  countByUser,
  list,
  count,
  create,
  update,
  listItems,
  findItemById,
  createItem,
  updateItem,
  addStatusHistory,
  getStatusHistory,
  findTracking,
  upsertTracking,
};
