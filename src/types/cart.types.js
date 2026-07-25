/**
 * @fileoverview JSDoc type definitions for cart-related shapes.
 */

/**
 * @typedef {Object} CartItem
 * @property {string} id - UUID of the cart item
 * @property {string} cart_id - UUID of the parent cart
 * @property {string} sku_id - UUID of the SKU
 * @property {number} quantity - Quantity added to cart
 * @property {number} unit_price - Price per unit at time of adding (in paise)
 * @property {Object.<string, string>} [sku_attributes] - Denormalised SKU attributes
 * @property {string} [product_name] - Denormalised product name
 * @property {string} [sku_code] - Denormalised SKU code
 * @property {string} [image_url] - Product image URL
 * @property {string} created_at - ISO timestamp of creation
 * @property {string} updated_at - ISO timestamp of last update
 */

/**
 * @typedef {Object} Cart
 * @property {string} id - UUID of the cart
 * @property {string|null} user_id - UUID of the owning user (null for anonymous)
 * @property {string|null} guest_token - Guest session token
 * @property {string|null} promo_code_id - Applied promo code UUID
 * @property {string|null} promo_code - Applied promo code string
 * @property {number} subtotal - Sum of item totals before discount (in paise)
 * @property {number} discount_amount - Total discount applied (in paise)
 * @property {number} total - Final total after discount (in paise)
 * @property {CartItem[]} items - Line items in the cart
 * @property {string} created_at - ISO timestamp of creation
 * @property {string} updated_at - ISO timestamp of last update
 */

export {};
