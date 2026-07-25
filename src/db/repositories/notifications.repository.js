const db = require('../client');

const TABLE = 'notifications';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function listByUser(user_id, { limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .where({ user_id })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset);
}

async function countUnread(user_id) {
  const [{ total }] = await db(TABLE)
    .where({ user_id, is_read: false })
    .count('id as total');
  return Number(total);
}

async function create(data) {
  const [id] = await db(TABLE).insert(data);
  return findById(id);
}

async function markAsRead(id, user_id) {
  await db(TABLE).where({ id, user_id }).update({ is_read: true });
  return db(TABLE).where({ id }).first();
}

async function markAllAsRead(user_id) {
  return db(TABLE).where({ user_id, is_read: false }).update({ is_read: true });
}

module.exports = {
  findById,
  listByUser,
  countUnread,
  create,
  markAsRead,
  markAllAsRead,
};
