const express = require('express');
const router = express.Router();
const promotionsController = require('./promotions.controller');
const { validatePromoCode, validateCreatePromoCode, validateUpdatePromoCode } = require('./promotions.validator');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

// Public / cart-facing route
router.post('/carts/:cartId/promo', authenticate, validatePromoCode, promotionsController.applyPromoCode);

// Admin CRUD routes
router.get('/admin/promo-codes', authenticate, authorize('admin'), promotionsController.listPromoCodes);
router.post('/admin/promo-codes', authenticate, authorize('admin'), validateCreatePromoCode, promotionsController.createPromoCode);
router.get('/admin/promo-codes/:promoCodeId', authenticate, authorize('admin'), promotionsController.getPromoCode);
router.put('/admin/promo-codes/:promoCodeId', authenticate, authorize('admin'), validateUpdatePromoCode, promotionsController.updatePromoCode);
router.delete('/admin/promo-codes/:promoCodeId', authenticate, authorize('admin'), promotionsController.deletePromoCode);

// Admin list (named endpoint from contract)
router.get('/promo-codes', authenticate, authorize('admin'), promotionsController.listPromoCodes);

module.exports = router;
