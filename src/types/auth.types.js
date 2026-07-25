/**
 * @fileoverview JSDoc type definitions for authentication-related shapes.
 */

/**
 * @typedef {Object} User
 * @property {string} id - UUID of the user
 * @property {string} email - Email address
 * @property {string} first_name - First name
 * @property {string} last_name - Last name
 * @property {string|null} phone - Phone number
 * @property {boolean} is_guest - Whether the user is a guest
 * @property {boolean} is_active - Whether the user account is active
 * @property {string[]} roles - Array of role names assigned to the user
 * @property {string} created_at - ISO timestamp of creation
 * @property {string} updated_at - ISO timestamp of last update
 */

/**
 * @typedef {Object} LoginPayload
 * @property {string} email - User's email address
 * @property {string} password - User's password
 */

/**
 * @typedef {Object} RegisterPayload
 * @property {string} first_name - First name
 * @property {string} last_name - Last name
 * @property {string} email - Email address
 * @property {string} password - Password
 * @property {string|null} [phone] - Optional phone number
 */

/**
 * @typedef {Object} ResetPayload
 * @property {string} token - Password reset token
 * @property {string} password - New password
 */

export {};
