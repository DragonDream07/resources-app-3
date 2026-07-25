/**
 * @fileoverview JSDoc type definitions for address shapes.
 */

/**
 * @typedef {Object} Address
 * @property {string} id - UUID of the address
 * @property {string} user_id - UUID of the owning user
 * @property {string} full_name - Full name of the recipient
 * @property {string} phone - Contact phone number
 * @property {string} line1 - Address line 1 (street, building)
 * @property {string|null} line2 - Address line 2 (apartment, suite, etc.)
 * @property {string} city - City name
 * @property {string} state - State / province
 * @property {string} pin_code - Postal / PIN code
 * @property {string} country - Country name or ISO code
 * @property {boolean} is_default - Whether this is the user's default address
 * @property {boolean} [is_serviceable] - Whether the pin_code is in the serviceable area (populated on serviceability check)
 * @property {string} created_at - ISO timestamp of creation
 * @property {string} updated_at - ISO timestamp of last update
 */

export {};
