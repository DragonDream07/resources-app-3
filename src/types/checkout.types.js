/**
 * @fileoverview JSDoc type definitions for checkout-related shapes.
 */

/**
 * @typedef {Object} CheckoutInitiatePayload
 * @property {string} cart_id - UUID of the cart to check out
 * @property {string} address_id - UUID of the delivery address
 */

/**
 * @typedef {Object} CheckoutConfirmPayload
 * @property {string} cart_id - UUID of the cart being confirmed
 * @property {string} address_id - UUID of the confirmed delivery address
 * @property {string} [payment_method] - Payment method identifier (e.g. 'mock', 'razorpay')
 */

export {};
