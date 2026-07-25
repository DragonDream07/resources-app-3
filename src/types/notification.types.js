/**
 * @fileoverview JSDoc type definitions for notification shapes.
 */

/**
 * @typedef {Object} Notification
 * @property {string} id - UUID of the notification
 * @property {string} user_id - UUID of the recipient user
 * @property {string} type - Notification type identifier (e.g. 'order_status', 'return_update')
 * @property {string} title - Short title of the notification
 * @property {string} body - Full notification body text
 * @property {Object|null} meta - Arbitrary metadata (e.g. order_id, return_request_id)
 * @property {boolean} is_read - Whether the notification has been read
 * @property {string|null} read_at - ISO timestamp of when the notification was read
 * @property {string} created_at - ISO timestamp of notification creation
 */

export {};
