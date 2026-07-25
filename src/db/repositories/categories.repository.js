const db = require('../client');

const TABLE = 'categories';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findBySlug(slug) {
  return db(TABLE).where({ slug }).first();
}

async function listAll() {
  return db(TABLE).orderBy('sort_order', 'asc');
}

async function listRoots() {
  return db(TABLE).whereNull('parent_id').orderBy('sort_order', 'asc');
}

async function listChildren(parent_id) {
  return db(TABLE).where({ parent_id }).orderBy('sort_order', 'asc');
}

async function getAncestors(id) {
  const ancestors = [];
  let current = await findById(id);
  while (current && current.parent_id) {
    current = await findById(current.parent_id);
    if (current) ancestors.unshift(current);
  }
  return ancestors;
}

async function getDescendantIds(id) {
  const ids = [];
  const queue = [id];
  while (queue.length > 0) {
    const current = queue.shift();
    const children = await listChildren(current);
    for (const child of children) {
      ids.push(child.id);
      queue.push(child.id);
    }
  }
  return ids;
}

async function create(data) {
  const [newId] = await db(TABLE).insert(data);
  return findById(newId);
}

async function update(id, data) {
  await db(TABLE).where({ id }).update(data);
  return findById(id);
}

async function remove(id) {
  return db(TABLE).where({ id }).delete();
}

module.exports = {
  findById,
  findBySlug,
  listAll,
  listRoots,
  listChildren,
  getAncestors,
  getDescendantIds,
  create,
  update,
  remove,
};
