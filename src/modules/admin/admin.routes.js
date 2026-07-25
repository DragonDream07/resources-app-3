'use strict';

const express = require('express');
const adminController = require('./admin.controller');
const rolesController = require('../roles/roles.controller');

const router = express.Router();

// Middleware: require authenticated admin with admin RBAC
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userRoles = (req.user.roles || []).map((r) => (typeof r === 'string' ? r : r.name));
  if (!userRoles.includes('admin') && !userRoles.includes('superadmin')) {
    return res.status(403).json({ error: 'Forbidden: admin access required' });
  }
  return next();
};

// Apply admin RBAC to all routes
router.use(requireAdmin);

// ── Reports ────────────────────────────────────────────────────────────────
router.get('/reports', adminController.getReports);

// ── Permissions ────────────────────────────────────────────────────────────
router.get('/permissions', adminController.getPermissions);

// ── Roles ──────────────────────────────────────────────────────────────────
router.get('/roles', adminController.getRoles);
router.post('/roles', adminController.createRole);
router.get('/roles/:roleId', adminController.getRoleById);
router.put('/roles/:roleId', adminController.updateRole);
router.delete('/roles/:roleId', adminController.deleteRole);

// ── Role Permissions ───────────────────────────────────────────────────────
router.get('/roles/:roleId/permissions', adminController.getRolePermissions);
router.post('/roles/:roleId/permissions', adminController.addRolePermission);
router.delete('/roles/:roleId/permissions/:permissionId', adminController.removeRolePermission);

// ── Serviceable Pin Codes ──────────────────────────────────────────────────
router.get('/serviceable-pin-codes', adminController.getServiceablePinCodes);
router.post('/serviceable-pin-codes', adminController.createServiceablePinCode);
router.put('/serviceable-pin-codes/:pinCodeId', adminController.updateServiceablePinCode);
router.delete('/serviceable-pin-codes/:pinCodeId', adminController.deleteServiceablePinCode);

module.exports = router;
