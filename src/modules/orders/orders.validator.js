const { body, param } = require('express-validator');
const { handleValidationErrors } = require('../../middleware/validation.middleware');

const VALID_ADVANCE_STATUSES = [
  'confirmed',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'return_requested',
  'returned',
  'refunded',
];

const validateAdvanceOrder = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .isUUID()
    .withMessage('Order ID must be a valid UUID'),

  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(VALID_ADVANCE_STATUSES)
    .withMessage(`Status must be one of: ${VALID_ADVANCE_STATUSES.join(', ')}`),

  body('trackingNumber')
    .optional()
    .isString()
    .withMessage('Tracking number must be a string')
    .trim()
    .isLength({ max: 255 })
    .withMessage('Tracking number must not exceed 255 characters'),

  body('trackingUrl')
    .optional()
    .isURL()
    .withMessage('Tracking URL must be a valid URL'),

  body('carrier')
    .optional()
    .isString()
    .withMessage('Carrier must be a string')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Carrier must not exceed 100 characters'),

  handleValidationErrors,
];

const validateCancelOrder = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .isUUID()
    .withMessage('Order ID must be a valid UUID'),

  body('reason')
    .optional()
    .isString()
    .withMessage('Reason must be a string')
    .trim()
    .isLength({ max: 500 })
    .withMessage('Reason must not exceed 500 characters'),

  handleValidationErrors,
];

const validateReturnRequest = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .isUUID()
    .withMessage('Order ID must be a valid UUID'),

  body('reason')
    .notEmpty()
    .withMessage('Reason is required')
    .isString()
    .withMessage('Reason must be a string')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Reason must be between 10 and 1000 characters'),

  body('items')
    .notEmpty()
    .withMessage('Items are required')
    .isArray({ min: 1 })
    .withMessage('Items must be a non-empty array'),

  body('items.*.orderItemId')
    .notEmpty()
    .withMessage('Order item ID is required')
    .isUUID()
    .withMessage('Order item ID must be a valid UUID'),

  body('items.*.quantity')
    .notEmpty()
    .withMessage('Item quantity is required')
    .isInt({ min: 1 })
    .withMessage('Item quantity must be a positive integer'),

  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string')
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Notes must not exceed 2000 characters'),

  handleValidationErrors,
];

module.exports = {
  validateAdvanceOrder,
  validateCancelOrder,
  validateReturnRequest,
};
