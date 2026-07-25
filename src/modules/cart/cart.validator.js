const { body } = require('express-validator');
const { handleValidationErrors } = require('../../middleware/validate');

/**
 * Validation for POST /carts
 * Create cart — guestId is optional
 */
const validateCreateCart = [
  body('guestId')
    .optional()
    .isString()
    .withMessage('guestId must be a string.'),
  handleValidationErrors,
];

/**
 * Validation for POST /carts/:cartId/items
 * Add item to cart
 */
const validateAddItem = [
  body('skuId')
    .notEmpty()
    .withMessage('skuId is required.')
    .isString()
    .withMessage('skuId must be a string.'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required.')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer.'),
  body('guestId')
    .optional()
    .isString()
    .withMessage('guestId must be a string.'),
  handleValidationErrors,
];

/**
 * Validation for PATCH /carts/:cartId/items/:itemId
 * Update item quantity
 */
const validateUpdateItem = [
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required.')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer.'),
  body('guestId')
    .optional()
    .isString()
    .withMessage('guestId must be a string.'),
  handleValidationErrors,
];

/**
 * Validation for POST /carts/:cartId/promo
 * Apply promo code
 */
const validateApplyPromo = [
  body('promoCode')
    .notEmpty()
    .withMessage('Promo code is required.')
    .isString()
    .withMessage('Promo code must be a string.')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Promo code must be between 1 and 50 characters.'),
  body('guestId')
    .optional()
    .isString()
    .withMessage('guestId must be a string.'),
  handleValidationErrors,
];

module.exports = {
  validateCreateCart,
  validateAddItem,
  validateUpdateItem,
  validateApplyPromo,
};
