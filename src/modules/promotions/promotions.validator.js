const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

const validatePromoCode = [
  body('code')
    .exists({ checkFalsy: true })
    .withMessage('Promo code is required.')
    .isString()
    .withMessage('Promo code must be a string.')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Promo code must be between 1 and 50 characters.'),
  handleValidationErrors,
];

const validateCreatePromoCode = [
  body('code')
    .exists({ checkFalsy: true })
    .withMessage('Code is required.')
    .isString()
    .withMessage('Code must be a string.')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Code must be between 1 and 50 characters.')
    .matches(/^[A-Za-z0-9_-]+$/)
    .withMessage('Code may only contain alphanumeric characters, hyphens, and underscores.'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string.')
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters.'),

  body('discountType')
    .exists({ checkFalsy: true })
    .withMessage('Discount type is required.')
    .isIn(['percentage', 'fixed'])
    .withMessage('Discount type must be either percentage or fixed.'),

  body('discountValue')
    .exists({ checkNull: true })
    .withMessage('Discount value is required.')
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a non-negative number.'),

  body('maxDiscountAmount')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Max discount amount must be a non-negative number.'),

  body('minimumOrderValue')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Minimum order value must be a non-negative number.'),

  body('usageLimit')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('Usage limit must be a positive integer.'),

  body('perUserLimit')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('Per-user limit must be a positive integer.'),

  body('validFrom')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Valid from must be a valid ISO 8601 date.'),

  body('validUntil')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Valid until must be a valid ISO 8601 date.')
    .custom((value, { req }) => {
      if (req.body.validFrom && value && new Date(value) <= new Date(req.body.validFrom)) {
        throw new Error('Valid until must be after valid from.');
      }
      return true;
    }),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean.'),

  handleValidationErrors,
];

const validateUpdatePromoCode = [
  body('code')
    .optional()
    .isString()
    .withMessage('Code must be a string.')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Code must be between 1 and 50 characters.')
    .matches(/^[A-Za-z0-9_-]+$/)
    .withMessage('Code may only contain alphanumeric characters, hyphens, and underscores.'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string.')
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters.'),

  body('discountType')
    .optional()
    .isIn(['percentage', 'fixed'])
    .withMessage('Discount type must be either percentage or fixed.'),

  body('discountValue')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a non-negative number.'),

  body('maxDiscountAmount')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Max discount amount must be a non-negative number.'),

  body('minimumOrderValue')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Minimum order value must be a non-negative number.'),

  body('usageLimit')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('Usage limit must be a positive integer.'),

  body('perUserLimit')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('Per-user limit must be a positive integer.'),

  body('validFrom')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Valid from must be a valid ISO 8601 date.'),

  body('validUntil')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Valid until must be a valid ISO 8601 date.')
    .custom((value, { req }) => {
      if (req.body.validFrom && value && new Date(value) <= new Date(req.body.validFrom)) {
        throw new Error('Valid until must be after valid from.');
      }
      return true;
    }),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean.'),

  handleValidationErrors,
];

module.exports = {
  validatePromoCode,
  validateCreatePromoCode,
  validateUpdatePromoCode,
};
