import React from 'react';

const FREE_SHIPPING_THRESHOLD = 499;
const SHIPPING_FEE = 49;

/**
 * ShippingBadge
 * Props:
 *   orderTotal   – number  (current cart/order total in INR)
 *   shippingFee  – number  (override; if provided, use directly instead of threshold logic)
 *   compact      – bool    (single-line variant without "add more" hint)
 */
const ShippingBadge = ({ orderTotal, shippingFee, compact = false }) => {
  const isFree =
    shippingFee !== undefined ? shippingFee === 0 : orderTotal >= FREE_SHIPPING_THRESHOLD;

  const amountNeeded =
    !isFree && shippingFee === undefined
      ? FREE_SHIPPING_THRESHOLD - (orderTotal || 0)
      : 0;

  const fmt = (v) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  if (isFree) {
    return (
      <div
        role="status"
        aria-label="Free shipping applied"
        className="inline-flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-3 py-1"
      >
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4 text-green-500 flex-shrink-0"
          aria-hidden="true"
        >
          <path
            d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
          />
          <path
            d="M3 4a1 1 0 00-1 1v1a1 1 0 001 1h1l1.5 5h7l1.5-5H17a1 1 0 000-2H3zm2.5 7l-1-3.5h9l-1 3.5h-7z"
          />
        </svg>
        <span className="text-xs font-semibold text-green-700">Free Shipping</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-label={`Shipping fee ${fmt(SHIPPING_FEE)}`}
      className="inline-flex flex-col rounded-md bg-orange-50 border border-orange-200 px-3 py-1.5"
    >
      <div className="flex items-center gap-1.5">
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4 text-orange-400 flex-shrink-0"
          aria-hidden="true"
        >
          <path
            d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
          />
          <path
            d="M3 4a1 1 0 00-1 1v1a1 1 0 001 1h1l1.5 5h7l1.5-5H17a1 1 0 000-2H3zm2.5 7l-1-3.5h9l-1 3.5h-7z"
          />
        </svg>
        <span className="text-xs font-semibold text-orange-700">
          Shipping: {fmt(SHIPPING_FEE)}
        </span>
      </div>
      {!compact && amountNeeded > 0 && (
        <p className="mt-0.5 text-xs text-orange-600">
          Add {fmt(amountNeeded)} more for free shipping.
        </p>
      )}
    </div>
  );
};

export default ShippingBadge;
