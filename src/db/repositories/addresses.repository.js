const db = require('../client');

const TABLE = 'addresses';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByIdAndUser(id, user_id) {
  return db(TABLE).where({ id, user_id }).first();
}

async function listByUser(user_id) {
  return db(TABLE).where({ user_id }).orderBy('created_at', 'desc');
}

async function create(data) {
  const [id] = await db(TABLE).insert(data);
  return findById(id);
}

async function update(id, user_id, data) {
  await db(TABLE).where({ id, user_id }).update(data);
  return findByIdAndUser(id, user_id);
}

async function remove(id, user_id) {
  return db(TABLE).where({ id, user_id }).delete();
}

async function setDefault(id, user_id) {
  return db.transaction(async (trx) => {
    await trx(TABLE).where({ user_id }).update({ is_default: false });
    await trx(TABLE).where({ id, user_id }).update({ is_default: true });
    return trx(TABLE).where({ id, user_id }).first();
  });
}

module.exports = {
  findById,
  findByIdAndUser,
  listByUser,
  create,
  update,
  remove,
  setDefault,
};
