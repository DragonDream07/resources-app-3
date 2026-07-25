const express = require('express');
const router = express.Router();
const usersController = require('./users.controller');
const usersValidator = require('./users.validator');
const { authenticate, authorize } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');

// Authenticated user routes
router.get('/me', authenticate, usersController.getMe);
router.patch('/me', authenticate, validate(usersValidator.updateMe), usersController.updateMe);
router.post('/me/change-password', authenticate, validate(usersValidator.changePassword), usersController.changePassword);

// Address routes
router.get('/me/addresses', authenticate, usersController.getMyAddresses);
router.post('/me/addresses', authenticate, validate(usersValidator.createAddress), usersController.createAddress);
router.get('/me/addresses/:addressId', authenticate, usersController.getAddressById);
router.put('/me/addresses/:addressId', authenticate, validate(usersValidator.updateAddress), usersController.updateAddress);
router.delete('/me/addresses/:addressId', authenticate, usersController.deleteAddress);

// Admin routes
router.get('/', authenticate, authorize('admin'), usersController.getAllUsers);
router.get('/:userId', authenticate, authorize('admin'), usersController.getUserById);
router.patch('/:userId', authenticate, authorize('admin'), validate(usersValidator.adminUpdateUser), usersController.adminUpdateUser);
router.delete('/:userId', authenticate, authorize('admin'), usersController.deleteUser);

module.exports = router;
