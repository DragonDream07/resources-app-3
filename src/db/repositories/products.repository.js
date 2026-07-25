const db = require('../client');

const PRODUCTS_TABLE = 'products';
const IMAGES_TABLE = 'product_images';

async function findById(id) {
  return db(PRODUCTS_TABLE).where({ id }).first();
}

async function findBySlug(slug) {
  return db(PRODUCTS_TABLE).where({ slug }).first();
}

async function list({ limit = 20, offset = 0, category_id, brand_id, is_active } = {}) {
  const query = db(PRODUCTS_TABLE);
  if (category_id !== undefined) query.where({ category_id });
  if (brand_id !== undefined) query.where({ brand_id });
  if (is_active !== undefined) query.where({ is_active });
  return query.orderBy('created_at', 'desc').limit(limit).offset(offset);
}

async function listByCategoryIds(category_ids, { limit = 20, offset = 0 } = {}) {
  return db(PRODUCTS_TABLE)
    .whereIn('category_id', category_ids)
    .where({ is_active: true })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset);
}

async function countByCategoryIds(category_ids) {
  const [{ total }] = await db(PRODUCTS_TABLE)
    .whereIn('category_id', category_ids)
    .where({ is_active: true })
    .count('id as total');
  return Number(total);
}

async function count({ category_id, brand_id, is_active } = {}) {
  const query = db(PRODUCTS_TABLE);
  if (category_id !== undefined) query.where({ category_id });
  if (brand_id !== undefined) query.where({ brand_id });
  if (is_active !== undefined) query.where({ is_active });
  const [{ total }] = await query.count('id as total');
  return Number(total);
}

async function create(data) {
  const [id] = await db(PRODUCTS_TABLE).insert(data);
  return findById(id);
}

async function update(id, data) {
  await db(PRODUCTS_TABLE).where({ id }).update(data);
  return findById(id);
}

async function remove(id) {
  return db(PRODUCTS_TABLE).where({ id }).delete();
}

async function getImages(product_id) {
  return db(IMAGES_TABLE).where({ product_id }).orderBy('sort_order', 'asc');
}

async function addImage(data) {
  const [id] = await db(IMAGES_TABLE).insert(data);
  return db(IMAGES_TABLE).where({ id }).first();
}

async function removeImage(id) {
  return db(IMAGES_TABLE).where({ id }).delete();
}

async function removeImagesByProduct(product_id) {
  return db(IMAGES_TABLE).where({ product_id }).delete();
}

module.exports = {
  findById,
  findBySlug,
  list,
  listByCategoryIds,
  countByCategoryIds,
  count,
  create,
  update,
  remove,
  getImages,
  addImage,
  removeImage,
  removeImagesByProduct,
};
