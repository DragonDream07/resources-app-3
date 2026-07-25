'use strict';

const adminService = require('./admin.service');

// ── Reports ────────────────────────────────────────────────────────────────

/**
 * GET /admin/reports
 * Aggregates cross-domain report data for the admin dashboard.
 */
async function getReports(req, res, next) {
  try {
    const { from, to, type } = req.query;
    const report = await adminService.generateReports({ from, to, type });
    return res.status(200).json(report);
  } catch (err) {
    return next(err);
  }
}

// ── Permissions ────────────────────────────────────────────────────────────

/**
 * GET /admin/permissions
 * Returns the list of all available permissions in the system.
 */
async function getPermissions(req, res, next) {
  try {
    const permissions = await adminService.getAllPermissions();
    return res.status(200).json({ permissions });
  } catch (err) {
    return next(err);
  }
}

// ── Roles ──────────────────────────────────────────────────────────────────

/**
 * GET /admin/roles
 * Lists all roles.
 */
async function getRoles(req, res, next) {
  try {
    const roles = await adminService.listRoles();
    return res.status(200).json({ roles });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /admin/roles
 * Creates a new role.
 */
async function createRole(req, res, next) {
  try {
    const role = await adminService.createRole(req.body);
    return res.status(201).json({ role });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /admin/roles/:roleId
 * Fetches a single role by ID.
 */
async function getRoleById(req, res, next) {
  try {
    const role = await adminService.getRoleById(req.params.roleId);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    return res.status(200).json({ role });
  } catch (err) {
    return next(err);
  }
}

/**
 * PUT /admin/roles/:roleId
 * Updates an existing role.
 */
async function updateRole(req, res, next) {
  try {
    const role = await adminService.updateRole(req.params.roleId, req.body);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    return res.status(200).json({ role });
  } catch (err) {
    return next(err);
  }
}

/**
 * DELETE /admin/roles/:roleId
 * Deletes a role.
 */
async function deleteRole(req, res, next) {
  try {
    await adminService.deleteRole(req.params.roleId);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

// ── Role Permissions ───────────────────────────────────────────────────────

/**
 * GET /admin/roles/:roleId/permissions
 * Returns permissions assigned to a role.
 */
async function getRolePermissions(req, res, next) {
  try {
    const permissions = await adminService.getRolePermissions(req.params.roleId);
    return res.status(200).json({ permissions });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /admin/roles/:roleId/permissions
 * Assigns a permission to a role.
 */
async function addRolePermission(req, res, next) {
  try {
    const result = await adminService.addRolePermission(req.params.roleId, req.body);
    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
}

/**
 * DELETE /admin/roles/:roleId/permissions/:permissionId
 * Removes a permission from a role.
 */
async function removeRolePermission(req, res, next) {
  try {
    await adminService.removeRolePermission(req.params.roleId, req.params.permissionId);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

// ── Serviceable Pin Codes ──────────────────────────────────────────────────

/**
 * GET /admin/serviceable-pin-codes
 * Lists all serviceable pin codes.
 */
async function getServiceablePinCodes(req, res, next) {
  try {
    const { page = 1, limit = 50, search } = req.query;
    const result = await adminService.listServiceablePinCodes({
      page: Number(page),
      limit: Number(limit),
      search,
    });
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /admin/serviceable-pin-codes
 * Creates a new serviceable pin code entry.
 */
async function createServiceablePinCode(req, res, next) {
  try {
    const pinCode = await adminService.createServiceablePinCode(req.body);
    return res.status(201).json({ pinCode });
  } catch (err) {
    return next(err);
  }
}

/**
 * PUT /admin/serviceable-pin-codes/:pinCodeId
 * Updates a serviceable pin code entry.
 */
async function updateServiceablePinCode(req, res, next) {
  try {
    const pinCode = await adminService.updateServiceablePinCode(
      req.params.pinCodeId,
      req.body
    );
    if (!pinCode) {
      return res.status(404).json({ error: 'Pin code not found' });
    }
    return res.status(200).json({ pinCode });
  } catch (err) {
    return next(err);
  }
}

/**
 * DELETE /admin/serviceable-pin-codes/:pinCodeId
 * Deletes a serviceable pin code entry.
 */
async function deleteServiceablePinCode(req, res, next) {
  try {
    await adminService.deleteServiceablePinCode(req.params.pinCodeId);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getReports,
  getPermissions,
  getRoles,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
  getRolePermissions,
  addRolePermission,
  removeRolePermission,
  getServiceablePinCodes,
  createServiceablePinCode,
  updateServiceablePinCode,
  deleteServiceablePinCode,
};
