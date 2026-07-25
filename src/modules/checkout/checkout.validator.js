const { body, query } = require('express-validator');
const { handleValidationErrors } = require('../../middleware/validation.middleware');

/**
 * Validation for POST /checkout/start
 */
const validateCheckoutStart = [
  body('cartId')
    .notEmpty()
    .withMessage('cartId is required.')
    .isString()
    .withMessage('cartId must be a string.'),

  body('guestToken')
    .optional()
    .isString()
    .withMessage('guestToken must be a string.'),

  handleValidationErrors,
];

/**
 * Validation for POST /checkout/address
 */
const validateCheckoutAddress = [
  body('checkoutToken')
    .notEmpty()
    .withMessage('checkoutToken is required.')
    .isString()
    .withMessage('checkoutToken must be a string.'),

  body('address')
    .notEmpty()
    .withMessage('address is required.')
    .isObject()
    .withMessage('address must be an object.'),

  body('address.fullName')
    .notEmpty()
    .withMessage('address.fullName is required.')
    .isString()
    .withMessage('address.fullName must be a string.'),

  body('address.line1')
    .notEmpty()
    .withMessage('address.line1 is required.')
    .isString()
    .withMessage('address.line1 must be a string.'),

  body('address.line2')
    .optional()
    .isString()
    .withMessage('address.line2 must be a string.'),

  body('address.city')
    .notEmpty()
    .withMessage('address.city is required.')
    .isString()
    .withMessage('address.city must be a string.'),

  body('address.state')
    .notEmpty()
    .withMessage('address.state is required.')
    .isString()
    .withMessage('address.state must be a string.'),

  body('address.pincode')
    .notEmpty()
    .withMessage('address.pincode is required.')
    .matches(/^\d{6}$/)
    .withMessage('address.pincode must be a valid 6-digit PIN code.'),

  body('address.country')
    .notEmpty()
    .withMessage('address.country is required.')
    .isString()
    .withMessage('address.country must be a string.'),

  body('address.phone')
    .notEmpty()
    .withMessage('address.phone is required.')
    .matches(/^\d{10}$/)
    .withMessage('address.phone must be a valid 10-digit phone number.'),

  handleValidationErrors,
];

/**
 * Validation for POST /checkout/place-order
 */
const validateCheckoutPlaceOrder = [
  body('checkoutToken')
    .notEmpty()
    .withMessage('checkoutToken is required.')
    .isString()
    .withMessage('checkoutToken must be a string.'),

  body('paymentMethod')
    .notEmpty()
    .withMessage('paymentMethod is required.')
    .isString()
    .withMessage('paymentMethod must be a string.')
    .isIn(['card', 'upi', 'netbanking', 'cod', 'wallet'])
    .withMessage('paymentMethod must be one of: card, upi, netbanking, cod, wallet.'),

  body('promoCode')
    .optional()
    .isString()
    .withMessage('promoCode must be a string.')
    .trim(),

  handleValidationErrors,
];

module.exports = {
  validateCheckoutStart,
  validateCheckoutAddress,
  validateCheckoutPlaceOrder,
};
