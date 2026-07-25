const { body, param } = require('express-validator');
const { validationResult } = require('express-validator');

// ---------------------------------------------------------------------------
// Reusable error handler middleware
// ---------------------------------------------------------------------------
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}

// ---------------------------------------------------------------------------
// POST /payments/initiate
// ---------------------------------------------------------------------------
const validateInitiatePayment = [
  body('orderId')
    .notEmpty()
    .withMessage('orderId is required.')
    .isString()
    .withMessage('orderId must be a string.'),

  body('amount')
    .notEmpty()
    .withMessage('amount is required.')
    .isFloat({ gt: 0 })
    .withMessage('amount must be a positive number.'),

  body('currency')
    .optional()
    .isString()
    .withMessage('currency must be a string.')
    .isLength({ min: 3, max: 3 })
    .withMessage('currency must be a 3-letter ISO code.'),

  body('method')
    .notEmpty()
    .withMessage('method is required.')
    .isIn(['card', 'upi', 'netbanking', 'wallet', 'cod'])
    .withMessage('method must be one of: card, upi, netbanking, wallet, cod.'),

  body('meta')
    .optional()
    .isObject()
    .withMessage('meta must be an object.'),

  handleValidationErrors,
];

// ---------------------------------------------------------------------------
// POST /payments/callback
// ---------------------------------------------------------------------------
const validateCallback = [
  body()
    .custom((value) => {
      if (typeof value !== 'object' || value === null) {
        throw new Error('Callback payload must be a JSON object.');
      }
      return true;
    }),

  handleValidationErrors,
];

// ---------------------------------------------------------------------------
// POST /payments/:paymentId/retry
// ---------------------------------------------------------------------------
const validateRetry = [
  param('paymentId')
    .notEmpty()
    .withMessage('paymentId is required.')
    .isUUID()
    .withMessage('paymentId must be a valid UUID.'),

  body('method')
    .optional()
    .isIn(['card', 'upi', 'netbanking', 'wallet', 'cod'])
    .withMessage('method must be one of: card, upi, netbanking, wallet, cod.'),

  body('meta')
    .optional()
    .isObject()
    .withMessage('meta must be an object.'),

  handleValidationErrors,
];

module.exports = {
  validateInitiatePayment,
  validateCallback,
  validateRetry,
};
