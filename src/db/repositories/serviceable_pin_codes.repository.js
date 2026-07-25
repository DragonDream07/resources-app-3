const db = require('../client');

const TABLE = 'serviceable_pin_codes';

async function findByPinCode(pin_code) {
  return db(TABLE).where({ pin_code }).first();
}

async function isServiceable(pin_code) {
  const record = await findByPinCode(pin_code);
  return Boolean(record && record.is_active);
}

async function list({ limit = 100, offset = 0 } = {}) {
  return db(TABLE).limit(limit).offset(offset);
}

async function create(data) {
  const [id] = await db(TABLE).insert(data);
  return db(TABLE).where({ id }).first();
}

async function update(id, data) {
  await db(TABLE).where({ id }).update(data);
  return db(TABLE).where({ id }).first();
}

async function remove(id) {
  return db(TABLE).where({ id }).delete();
}

module.exports = {
  findByPinCode,
  isServiceable,
  list,
  create,
  update,
  remove,
};
