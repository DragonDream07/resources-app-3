const db = require('../client');

const TABLE = 'skus';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findBySku(sku) {
  return db(TABLE).where({ sku }).first();
}

async function listByProduct(product_id) {
  return db(TABLE).where({ product_id }).orderBy('created_at', 'asc');
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

/**
 * Atomically decrement stock_quantity for a SKU.
 * Returns number of rows affected (0 if insufficient stock).
 */
async function decrementStock(id, quantity, trx) {
  const query = (trx || db)(TABLE)
    .where({ id })
    .where('stock_quantity', '>=', quantity)
    .update(
      db.raw('stock_quantity = stock_quantity - ?', [quantity])
    );
  return query;
}

/**
 * Atomically increment stock_quantity for a SKU (e.g., on cancellation/return).
 */
async function incrementStock(id, quantity, trx) {
  return (trx || db)(TABLE)
    .where({ id })
    .update(
      db.raw('stock_quantity = stock_quantity + ?', [quantity])
    );
}

async function getStockQuantity(id) {
  const row = await db(TABLE).where({ id }).select('stock_quantity').first();
  return row ? row.stock_quantity : null;
}

module.exports = {
  findById,
  findBySku,
  listByProduct,
  create,
  update,
  remove,
  decrementStock,
  incrementStock,
  getStockQuantity,
};
