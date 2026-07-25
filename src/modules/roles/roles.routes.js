const express = require('express');
const rolesController = require('./roles.controller');

const router = express.Router();

// Role CRUD
router.get('/', rolesController.getAllRoles);
router.get('/:roleId', rolesController.getRoleById);
router.post('/', rolesController.createRole);
router.put('/:roleId', rolesController.updateRole);
router.delete('/:roleId', rolesController.deleteRole);

// User-Role association
router.get('/:roleId/users', rolesController.getUsersByRole);
router.post('/assign', rolesController.assignRoleToUser);
router.delete('/assign', rolesController.removeRoleFromUser);
router.get('/users/:userId/roles', rolesController.getRolesByUser);

module.exports = router;
