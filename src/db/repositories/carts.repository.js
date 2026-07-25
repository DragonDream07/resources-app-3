const db = require('../client');

const CARTS_TABLE = 'carts';
const ITEMS_TABLE = 'cart_items';

async function findCartById(id) {
  return db(CARTS_TABLE).where({ id }).first();
}

async function findCartByUser(user_id) {
  return db(CARTS_TABLE).where({ user_id }).first();
}

async function createCart(data) {
  const [id] = await db(CARTS_TABLE).insert(data);
  return findCartById(id);
}

async function updateCart(id, data) {
  await db(CARTS_TABLE).where({ id }).update(data);
  return findCartById(id);
}

async function deleteCart(id) {
  return db(CARTS_TABLE).where({ id }).delete();
}

async function findItemById(id) {
  return db(ITEMS_TABLE).where({ id }).first();
}

async function findItemByCartAndSku(cart_id, sku_id) {
  return db(ITEMS_TABLE).where({ cart_id, sku_id }).first();
}

async function listItemsByCart(cart_id) {
  return db(ITEMS_TABLE).where({ cart_id }).orderBy('created_at', 'asc');
}

async function addItem(data) {
  const [id] = await db(ITEMS_TABLE).insert(data);
  return findItemById(id);
}

async function updateItem(id, data) {
  await db(ITEMS_TABLE).where({ id }).update(data);
  return findItemById(id);
}

async function removeItem(id) {
  return db(ITEMS_TABLE).where({ id }).delete();
}

async function clearItems(cart_id) {
  return db(ITEMS_TABLE).where({ cart_id }).delete();
}

module.exports = {
  findCartById,
  findCartByUser,
  createCart,
  updateCart,
  deleteCart,
  findItemById,
  findItemByCartAndSku,
  listItemsByCart,
  addItem,
  updateItem,
  removeItem,
  clearItems,
};
