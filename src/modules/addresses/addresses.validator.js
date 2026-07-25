const { body, validationResult } = require('express-validator');

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.param, message: e.msg })),
    });
  }
  next();
}

const createAddressRules = [
  body('full_name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Phone number must be a valid 10-digit Indian mobile number'),

  body('address_line1')
    .trim()
    .notEmpty()
    .withMessage('Address line 1 is required'),

  body('address_line2')
    .optional({ nullable: true })
    .trim(),

  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),

  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),

  body('pin_code')
    .trim()
    .notEmpty()
    .withMessage('Pin code is required')
    .matches(/^\d{6}$/)
    .withMessage('Pin code must be a 6-digit number'),

  body('country')
    .optional({ nullable: true })
    .trim(),

  body('is_default')
    .optional()
    .isBoolean()
    .withMessage('is_default must be a boolean'),

  body('address_type')
    .optional()
    .trim()
    .isIn(['home', 'work', 'other'])
    .withMessage('address_type must be one of home, work, other'),
];

const updateAddressRules = [
  body('full_name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Full name cannot be empty'),

  body('phone')
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Phone number must be a valid 10-digit Indian mobile number'),

  body('address_line1')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Address line 1 cannot be empty'),

  body('address_line2')
    .optional({ nullable: true })
    .trim(),

  body('city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City cannot be empty'),

  body('state')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('State cannot be empty'),

  body('pin_code')
    .optional()
    .trim()
    .matches(/^\d{6}$/)
    .withMessage('Pin code must be a 6-digit number'),

  body('country')
    .optional({ nullable: true })
    .trim(),

  body('is_default')
    .optional()
    .isBoolean()
    .withMessage('is_default must be a boolean'),

  body('address_type')
    .optional()
    .trim()
    .isIn(['home', 'work', 'other'])
    .withMessage('address_type must be one of home, work, other'),
];

const validateCreateAddress = [...createAddressRules, handleValidationErrors];
const validateUpdateAddress = [...updateAddressRules, handleValidationErrors];

module.exports = {
  validateCreateAddress,
  validateUpdateAddress,
};
