/**
 * @fileoverview JSDoc type definitions for admin-related shapes.
 */

/**
 * @typedef {Object} DashboardStats
 * @property {number} total_orders - Total number of orders
 * @property {number} total_revenue - Total revenue in paise
 * @property {number} orders_today - Orders placed today
 * @property {number} revenue_today - Revenue from orders today (in paise)
 * @property {number} pending_returns - Number of return requests pending review
 * @property {number} active_users - Number of registered (non-guest) active users
 * @property {number} low_stock_skus - Number of SKUs with critically low stock
 */

/**
 * @typedef {Object} ReportData
 * @property {string} period - Report period label (e.g. '2024-01', 'Q1 2024')
 * @property {number} orders_count - Number of orders in this period
 * @property {number} revenue - Total revenue in this period (in paise)
 * @property {number} avg_order_value - Average order value in this period (in paise)
 * @property {number} returns_count - Number of return requests in this period
 * @property {number} refunds_total - Total refunds issued in this period (in paise)
 */

/**
 * @typedef {Object} AdminUser
 * @property {string} id - UUID of the admin user
 * @property {string} email - Email address
 * @property {string} first_name - First name
 * @property {string} last_name - Last name
 * @property {string|null} phone - Phone number
 * @property {string[]} roles - Array of role names (includes 'admin')
 * @property {boolean} is_active - Whether the account is active
 * @property {string} created_at - ISO timestamp of account creation
 * @property {string} updated_at - ISO timestamp of last update
 */

export {};
