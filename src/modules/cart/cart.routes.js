const express = require('express');
const router = express.Router();
const cartController = require('./cart.controller');
const { validateCreateCart, validateAddItem, validateUpdateItem, validateApplyPromo } = require('./cart.validator');
const { authenticate, optionalAuthenticate } = require('../../middleware/auth');

// POST /carts — create a new cart (guest or authenticated)
router.post('/', optionalAuthenticate, validateCreateCart, cartController.createCart);

// GET /carts/:cartId — retrieve cart by ID
router.get('/:cartId', optionalAuthenticate, cartController.getCart);

// POST /carts/:cartId/items — add item to cart
router.post('/:cartId/items', optionalAuthenticate, validateAddItem, cartController.addItem);

// PATCH /carts/:cartId/items/:itemId — update item in cart
router.patch('/:cartId/items/:itemId', optionalAuthenticate, validateUpdateItem, cartController.updateItem);

// DELETE /carts/:cartId/items/:itemId — remove item from cart
router.delete('/:cartId/items/:itemId', optionalAuthenticate, cartController.removeItem);

// POST /carts/:cartId/promo — apply promo code
router.post('/:cartId/promo', optionalAuthenticate, validateApplyPromo, cartController.applyPromo);

// DELETE /carts/:cartId/promo — remove promo code
router.delete('/:cartId/promo', optionalAuthenticate, cartController.removePromo);

module.exports = router;
