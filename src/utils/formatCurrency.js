/**
 * Formats a numeric amount as Indian Rupees (₹) with locale-aware decimals.
 *
 * @param {number} amount - The numeric value to format.
 * @param {object} [options] - Optional Intl.NumberFormat options overrides.
 * @returns {string} Formatted currency string, e.g. "₹1,299.00"
 */
export function formatCurrency(amount, options = {}) {
  const defaultOptions = {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return new Intl.NumberFormat('en-IN', mergedOptions).format(amount);
}

/**
 * Formats a numeric amount as Indian Rupees without decimal places.
 *
 * @param {number} amount - The numeric value to format.
 * @returns {string} Formatted currency string without decimals, e.g. "₹1,299"
 */
export function formatCurrencyCompact(amount) {
  return formatCurrency(amount, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
