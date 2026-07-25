/**
 * Free shipping threshold in Indian Rupees.
 */
export const FREE_SHIPPING_THRESHOLD = 799;

/**
 * Standard shipping charge in Indian Rupees when the order total is below the free threshold.
 */
export const STANDARD_SHIPPING_CHARGE = 49;

/**
 * Computes the shipping charge based on the cart/order total.
 *
 * Returns ₹0 if the total is greater than or equal to ₹799, otherwise returns ₹49.
 *
 * @param {number} orderTotal - The cart or order subtotal in Rupees (after discounts, before shipping).
 * @returns {number} Shipping charge in Rupees (0 or 49).
 */
export function computeShippingCharge(orderTotal) {
  if (orderTotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  return STANDARD_SHIPPING_CHARGE;
}

/**
 * Returns true if the given order total qualifies for free shipping.
 *
 * @param {number} orderTotal - The cart or order subtotal in Rupees.
 * @returns {boolean}
 */
export function isFreeShipping(orderTotal) {
  return orderTotal >= FREE_SHIPPING_THRESHOLD;
}

/**
 * Returns how much more the user needs to spend to qualify for free shipping.
 * Returns 0 if the user already qualifies.
 *
 * @param {number} orderTotal - The cart or order subtotal in Rupees.
 * @returns {number} Amount remaining to reach free shipping threshold.
 */
export function amountToFreeShipping(orderTotal) {
  const remaining = FREE_SHIPPING_THRESHOLD - orderTotal;
  return remaining > 0 ? Math.round(remaining * 100) / 100 : 0;
}
