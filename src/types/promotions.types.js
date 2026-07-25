/**
 * @fileoverview JSDoc type definitions for promotions-related shapes.
 */

/**
 * @typedef {'percentage'|'flat'} DiscountType
 * Represents the type of discount applied by a promo code.
 */

/**
 * @typedef {Object} PromoCode
 * @property {string} id - UUID of the promo code
 * @property {string} code - The promo code string
 * @property {DiscountType} discount_type - Type of discount: 'percentage' or 'flat'
 * @property {number} discount_value - Value of the discount (percentage points or flat amount in paise)
 * @property {number|null} max_discount_amount - Maximum discount cap in paise (for percentage type), null if no cap
 * @property {number|null} min_order_amount - Minimum order amount required to apply this code (in paise)
 * @property {number|null} usage_limit - Maximum total number of uses allowed, null for unlimited
 * @property {number} times_used - Number of times this code has been used
 * @property {boolean} is_active - Whether the promo code is currently active
 * @property {string|null} expires_at - ISO timestamp of expiry, null if no expiry
 * @property {string} created_at - ISO timestamp of creation
 * @property {string} updated_at - ISO timestamp of last update
 */

export {};
