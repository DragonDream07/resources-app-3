/**
 * @fileoverview JSDoc type definitions for order-related shapes.
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} id - UUID of the order item
 * @property {string} order_id - UUID of the parent order
 * @property {string} sku_id - UUID of the SKU
 * @property {string} product_name - Snapshot of product name at order time
 * @property {string} sku_code - Snapshot of SKU code at order time
 * @property {Object.<string, string>} sku_attributes - Snapshot of SKU attributes at order time
 * @property {number} quantity - Quantity ordered
 * @property {number} unit_price - Price per unit at order time (in paise)
 * @property {number} total_price - Total price for this line (in paise)
 * @property {string|null} image_url - Product image URL snapshot
 */

/**
 * @typedef {Object} OrderStatusHistory
 * @property {string} id - UUID of the status history entry
 * @property {string} order_id - UUID of the order
 * @property {string} status - Status value at this point
 * @property {string|null} note - Optional note about the transition
 * @property {string} created_at - ISO timestamp of when this status was set
 */

/**
 * @typedef {Object} OrderTracking
 * @property {string} id - UUID of the tracking entry
 * @property {string} order_id - UUID of the order
 * @property {string|null} carrier - Carrier name
 * @property {string|null} tracking_number - Carrier tracking number
 * @property {string|null} tracking_url - URL for carrier tracking page
 * @property {string|null} estimated_delivery - ISO date of estimated delivery
 * @property {string} updated_at - ISO timestamp of last tracking update
 */

/**
 * @typedef {Object} Order
 * @property {string} id - UUID of the order
 * @property {string} user_id - UUID of the owning user
 * @property {string} status - Current order status
 * @property {string|null} promo_code_id - Applied promo code UUID
 * @property {number} subtotal - Order subtotal before discount (in paise)
 * @property {number} discount_amount - Discount applied (in paise)
 * @property {number} total - Final order total (in paise)
 * @property {Object} shipping_address - Snapshot of the delivery address
 * @property {OrderItem[]} [items] - Line items on the order
 * @property {OrderStatusHistory[]} [status_history] - Status transition history
 * @property {OrderTracking} [tracking] - Current tracking information
 * @property {string} created_at - ISO timestamp of order creation
 * @property {string} updated_at - ISO timestamp of last update
 */

export {};
