/**
 * @fileoverview JSDoc type definitions for returns and refund shapes.
 */

/**
 * @typedef {Object} ReturnRequest
 * @property {string} id - UUID of the return request
 * @property {string} order_id - UUID of the order being returned
 * @property {string} user_id - UUID of the user making the request
 * @property {string} status - Current status of the return request
 * @property {string} reason - Reason provided for the return
 * @property {string|null} notes - Additional notes from the user
 * @property {string|null} admin_notes - Internal notes added by admin during review
 * @property {string|null} reviewed_at - ISO timestamp of admin review
 * @property {string|null} reviewed_by - UUID of the admin who reviewed the request
 * @property {string} created_at - ISO timestamp of request creation
 * @property {string} updated_at - ISO timestamp of last update
 */

/**
 * @typedef {Object} Refund
 * @property {string} id - UUID of the refund
 * @property {string} order_id - UUID of the order being refunded
 * @property {string|null} return_request_id - UUID of the linked return request
 * @property {number} amount - Refund amount (in paise)
 * @property {string} status - Current refund status (e.g. 'pending', 'processed', 'failed')
 * @property {string|null} gateway_reference - Reference returned by the payment gateway
 * @property {string|null} processed_at - ISO timestamp of when the refund was processed
 * @property {string} created_at - ISO timestamp of refund creation
 * @property {string} updated_at - ISO timestamp of last update
 */

export {};
