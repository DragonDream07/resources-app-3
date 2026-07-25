const { body, validationResult } = require('express-validator');

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}

const validateRegister = [
  body('email')
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Email must be a valid email address.'),
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
  body('firstName')
    .optional()
    .isString().withMessage('First name must be a string.'),
  body('lastName')
    .optional()
    .isString().withMessage('Last name must be a string.'),
  handleValidationErrors,
];

const validateLogin = [
  body('email')
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Email must be a valid email address.'),
  body('password')
    .notEmpty().withMessage('Password is required.'),
  handleValidationErrors,
];

const validateGuestRegister = [
  body('email')
    .optional()
    .isEmail().withMessage('Email must be a valid email address.'),
  handleValidationErrors,
];

const validateForgotPassword = [
  body('email')
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Email must be a valid email address.'),
  handleValidationErrors,
];

const validateResetPassword = [
  body('token')
    .notEmpty().withMessage('Reset token is required.'),
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateGuestRegister,
  validateForgotPassword,
  validateResetPassword,
};
