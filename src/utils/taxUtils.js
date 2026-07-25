/**
 * Default GST rate used across the application (18%).
 */
export const DEFAULT_GST_RATE = 0.18;

/**
 * Returns the GST-inclusive display price given a base (exclusive) price and GST rate.
 *
 * @param {number} basePrice - Price before tax.
 * @param {number} [gstRate=DEFAULT_GST_RATE] - GST rate as a decimal fraction (e.g. 0.18 for 18%).
 * @returns {number} Price inclusive of GST, rounded to 2 decimal places.
 */
export function getInclusivePrice(basePrice, gstRate = DEFAULT_GST_RATE) {
  const inclusive = basePrice * (1 + gstRate);
  return Math.round(inclusive * 100) / 100;
}

/**
 * Extracts the tax portion from a GST-inclusive price.
 *
 * @param {number} inclusivePrice - Price already including GST.
 * @param {number} [gstRate=DEFAULT_GST_RATE] - GST rate as a decimal fraction (e.g. 0.18 for 18%).
 * @returns {number} The tax amount embedded in the inclusive price, rounded to 2 decimal places.
 */
export function extractTaxFromInclusive(inclusivePrice, gstRate = DEFAULT_GST_RATE) {
  const tax = inclusivePrice - inclusivePrice / (1 + gstRate);
  return Math.round(tax * 100) / 100;
}

/**
 * Returns a GST breakdown object for display in order/cart summaries.
 *
 * @param {number} inclusivePrice - The total price including GST.
 * @param {number} [gstRate=DEFAULT_GST_RATE] - GST rate as a decimal fraction.
 * @returns {{ baseAmount: number, taxAmount: number, gstRate: number, gstPercent: number }}
 */
export function getTaxBreakdown(inclusivePrice, gstRate = DEFAULT_GST_RATE) {
  const taxAmount = extractTaxFromInclusive(inclusivePrice, gstRate);
  const baseAmount = Math.round((inclusivePrice - taxAmount) * 100) / 100;
  return {
    baseAmount,
    taxAmount,
    gstRate,
    gstPercent: Math.round(gstRate * 100),
  };
}
