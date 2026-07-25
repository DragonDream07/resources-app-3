const { body } = require('express-validator');

/**
 * Validation schema for creating a return request.
 * POST /orders/:orderId/return-requests
 */
const validateCreateReturnRequest = [
  body('reason')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Reason is required.')
    .isString()
    .withMessage('Reason must be a string.')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Reason must be between 10 and 1000 characters.'),

  body('items')
    .optional()
    .isArray()
    .withMessage('Items must be an array.'),

  body('items.*.sku_id')
    .optional()
    .isString()
    .withMessage('Each item sku_id must be a string.')
    .notEmpty()
    .withMessage('Each item sku_id must not be empty.'),

  body('items.*.quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Each item quantity must be a positive integer.'),
];

/**
 * Validation schema for reviewing a return request.
 * POST /return-requests/:returnRequestId/review
 */
const validateReviewReturnRequest = [
  body('decision')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Decision is required.')
    .isIn(['approved', 'rejected'])
    .withMessage('Decision must be either approved or rejected.'),

  body('adminNote')
    .optional()
    .isString()
    .withMessage('Admin note must be a string.')
    .isLength({ max: 2000 })
    .withMessage('Admin note must not exceed 2000 characters.'),
];

module.exports = {
  validateCreateReturnRequest,
  validateReviewReturnRequest,
};
