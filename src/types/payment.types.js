/**
 * @fileoverview JSDoc type definitions for payment-related shapes.
 */

/**
 * @typedef {'success'|'failure'|'pending'} PaymentOutcome
 * Represents the outcome state of a payment attempt.
 */

/**
 * @typedef {Object} PaymentAttempt
 * @property {string} id - UUID of the payment attempt
 * @property {string} order_id - UUID of the associated order
 * @property {string} payment_method - Payment method used (e.g. 'mock', 'razorpay')
 * @property {string} gateway_reference - Reference ID returned by the payment gateway
 * @property {PaymentOutcome} status - Outcome of this payment attempt
 * @property {number} amount - Amount attempted (in paise)
 * @property {string|null} failure_reason - Reason for failure, if applicable
 * @property {Object|null} gateway_response - Raw response payload from the gateway
 * @property {string} created_at - ISO timestamp of the attempt
 * @property {string} updated_at - ISO timestamp of last update
 */

export {};
