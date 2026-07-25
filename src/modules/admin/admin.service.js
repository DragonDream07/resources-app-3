'use strict';

const db = require('../../db');
const ordersService = require('../orders/orders.service');
const returnsService = require('../returns/returns.service');
const usersService = require('../users/users.service');
const rolesService = require('../roles/roles.service');

// ── Reports ────────────────────────────────────────────────────────────────

/**
 * Generates cross-domain aggregated reports.
 * Delegates to individual domain services for data collection.
 * @param {object} params - { from, to, type }
 */
async function generateReports({ from, to, type } = {}) {
  const dateFilter = {};
  if (from) dateFilter.from = from;
  if (to) dateFilter.to = to;

  const [orderStats, returnStats, userStats] = await Promise.all([
    _getOrderStats(dateFilter),
    _getReturnStats(dateFilter),
    _getUserStats(dateFilter),
  ]);

  return {
    generatedAt: null,
    filters: { from: from || null, to: to || null, type: type || null },
    orders: orderStats,
    returns: returnStats,
    users: userStats,
  };
}

async function _getOrderStats(dateFilter) {
  try {
    const query = `
      SELECT
        COUNT(*) AS total_orders,
        COALESCE(SUM(total_amount), 0) AS total_revenue,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) AS delivered,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending
      FROM orders
      WHERE ($1::date IS NULL OR created_at >= $1::date)
        AND ($2::date IS NULL OR created_at <= $2::date)
    `;
    const result = await db.query(query, [
      dateFilter.from || null,
      dateFilter.to || null,
    ]);
    return result.rows[0] || {};
  } catch {
    return {};
  }
}

async function _getReturnStats(dateFilter) {
  try {
    const query = `
      SELECT
        COUNT(*) AS total_returns,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) AS approved,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) AS rejected,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending
      FROM return_requests
      WHERE ($1::date IS NULL OR created_at >= $1::date)
        AND ($2::date IS NULL OR created_at <= $2::date)
    `;
    const result = await db.query(query, [
      dateFilter.from || null,
      dateFilter.to || null,
    ]);
    return result.rows[0] || {};
  } catch {
    return {};
  }
}

async function _getUserStats(dateFilter) {
  try {
    const query = `
      SELECT
        COUNT(*) AS total_users,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) AS new_last_30_days
      FROM users
      WHERE ($1::date IS NULL OR created_at >= $1::date)
        AND ($2::date IS NULL OR created_at <= $2::date)
    `;
    const result = await db.query(query, [
      dateFilter.from || null,
      dateFilter.to || null,
    ]);
    return result.rows[0] || {};
  } catch {
    return {};
  }
}

// ── Permissions ────────────────────────────────────────────────────────────

/**
 * Returns all available permissions.
 */
async function getAllPermissions() {
  const result = await db.query(
    'SELECT id, name, description, resource, action FROM permissions ORDER BY resource, action'
  );
  return result.rows;
}

// ── Roles ──────────────────────────────────────────────────────────────────

/**
 * Lists all roles (delegates to roles service).
 */
async function listRoles() {
  return rolesService.listRoles();
}

/**
 * Creates a new role.
 * @param {object} data - { name, description }
 */
async function createRole(data) {
  return rolesService.createRole(data);
}

/**
 * Fetches a role by its ID.
 * @param {string|number} roleId
 */
async function getRoleById(roleId) {
  return rolesService.getRoleById(roleId);
}

/**
 * Updates a role by ID.
 * @param {string|number} roleId
 * @param {object} data
 */
async function updateRole(roleId, data) {
  return rolesService.updateRole(roleId, data);
}

/**
 * Deletes a role by ID.
 * @param {string|number} roleId
 */
async function deleteRole(roleId) {
  return rolesService.deleteRole(roleId);
}

// ── Role Permissions ───────────────────────────────────────────────────────

/**
 * Returns permissions for a given role.
 * @param {string|number} roleId
 */
async function getRolePermissions(roleId) {
  const result = await db.query(
    `SELECT p.id, p.name, p.description, p.resource, p.action
     FROM permissions p
     INNER JOIN role_permissions rp ON rp.permission_id = p.id
     WHERE rp.role_id = $1
     ORDER BY p.resource, p.action`,
    [roleId]
  );
  return result.rows;
}

/**
 * Assigns a permission to a role.
 * @param {string|number} roleId
 * @param {object} data - { permissionId }
 */
async function addRolePermission(roleId, data) {
  const { permissionId } = data;
  const existing = await db.query(
    'SELECT id FROM role_permissions WHERE role_id = $1 AND permission_id = $2',
    [roleId, permissionId]
  );
  if (existing.rows.length > 0) {
    return { roleId: Number(roleId), permissionId: Number(permissionId), alreadyAssigned: true };
  }
  await db.query(
    'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)',
    [roleId, permissionId]
  );
  return { roleId: Number(roleId), permissionId: Number(permissionId), alreadyAssigned: false };
}

/**
 * Removes a permission from a role.
 * @param {string|number} roleId
 * @param {string|number} permissionId
 */
async function removeRolePermission(roleId, permissionId) {
  await db.query(
    'DELETE FROM role_permissions WHERE role_id = $1 AND permission_id = $2',
    [roleId, permissionId]
  );
}

// ── Serviceable Pin Codes ──────────────────────────────────────────────────

/**
 * Lists serviceable pin codes with optional pagination and search.
 * @param {object} params - { page, limit, search }
 */
async function listServiceablePinCodes({ page = 1, limit = 50, search } = {}) {
  const offset = (page - 1) * limit;
  const values = [];
  let whereClause = '';

  if (search) {
    values.push(`%${search}%`);
    whereClause = `WHERE pin_code ILIKE $${values.length} OR city ILIKE $${values.length} OR state ILIKE $${values.length}`;
  }

  values.push(limit);
  values.push(offset);

  const dataQuery = `
    SELECT id, pin_code, city, state, is_active, created_at, updated_at
    FROM serviceable_pin_codes
    ${whereClause}
    ORDER BY pin_code ASC
    LIMIT $${values.length - 1} OFFSET $${values.length}
  `;

  const countValues = search ? [`%${search}%`] : [];
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM serviceable_pin_codes
    ${whereClause ? `WHERE pin_code ILIKE $1 OR city ILIKE $1 OR state ILIKE $1` : ''}
  `;

  const [dataResult, countResult] = await Promise.all([
    db.query(dataQuery, values),
    db.query(countQuery, countValues),
  ]);

  return {
    pinCodes: dataResult.rows,
    total: parseInt(countResult.rows[0].total, 10),
    page,
    limit,
  };
}

/**
 * Creates a new serviceable pin code.
 * @param {object} data - { pin_code, city, state, is_active }
 */
async function createServiceablePinCode(data) {
  const { pin_code, city, state, is_active = true } = data;
  const result = await db.query(
    `INSERT INTO serviceable_pin_codes (pin_code, city, state, is_active)
     VALUES ($1, $2, $3, $4)
     RETURNING id, pin_code, city, state, is_active, created_at, updated_at`,
    [pin_code, city, state, is_active]
  );
  return result.rows[0];
}

/**
 * Updates a serviceable pin code entry.
 * @param {string|number} pinCodeId
 * @param {object} data
 */
async function updateServiceablePinCode(pinCodeId, data) {
  const { pin_code, city, state, is_active } = data;
  const result = await db.query(
    `UPDATE serviceable_pin_codes
     SET
       pin_code   = COALESCE($1, pin_code),
       city       = COALESCE($2, city),
       state      = COALESCE($3, state),
       is_active  = COALESCE($4, is_active),
       updated_at = NOW()
     WHERE id = $5
     RETURNING id, pin_code, city, state, is_active, created_at, updated_at`,
    [pin_code || null, city || null, state || null, is_active !== undefined ? is_active : null, pinCodeId]
  );
  return result.rows[0] || null;
}

/**
 * Deletes a serviceable pin code entry.
 * @param {string|number} pinCodeId
 */
async function deleteServiceablePinCode(pinCodeId) {
  await db.query('DELETE FROM serviceable_pin_codes WHERE id = $1', [pinCodeId]);
}

module.exports = {
  generateReports,
  getAllPermissions,
  listRoles,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
  getRolePermissions,
  addRolePermission,
  removeRolePermission,
  listServiceablePinCodes,
  createServiceablePinCode,
  updateServiceablePinCode,
  deleteServiceablePinCode,
};
