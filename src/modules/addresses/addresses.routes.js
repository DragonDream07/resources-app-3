const express = require('express');
const router = express.Router();
const addressesController = require('./addresses.controller');
const addressesValidator = require('./addresses.validator');
const { authenticate } = require('../../middleware/auth');

router.use(authenticate);

router.get('/', addressesController.getAddresses);
router.post('/', addressesValidator.validateCreateAddress, addressesController.createAddress);
router.get('/:addressId', addressesController.getAddress);
router.put('/:addressId', addressesValidator.validateUpdateAddress, addressesController.updateAddress);
router.delete('/:addressId', addressesController.deleteAddress);

module.exports = router;
