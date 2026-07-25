import React from 'react';

/**
 * OrderSummaryPanel
 * Props:
 *   items        – array of { name, quantity, price, imageUrl? }
 *   subtotal     – number
 *   discount     – number (positive value = reduction)
 *   shippingFee  – number (0 = free)
 *   tax          – number
 *   total        – number
 *   promoCode    – string | null (applied promo label)
 *   collapsed    – bool (show condensed view without item list)
 */
const fmt = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);

const OrderSummaryPanel = ({
  items = [],
  subtotal = 0,
  discount = 0,
  shippingFee = 0,
  tax = 0,
  total = 0,
  promoCode = null,
  collapsed = false,
}) => {
  return (
    <aside className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <h2 className="text-base font-semibold text-gray-800">Order Summary</h2>

      {!collapsed && items.length > 0 && (
        <ul className="divide-y divide-gray-100 space-y-0">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 py-2">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-md border border-gray-100 flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 font-medium truncate">{item.name}</p>
                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-gray-800 whitespace-nowrap">{fmt(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{fmt(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>
              Discount{promoCode ? ` (${promoCode})` : ''}
            </span>
            <span>−{fmt(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>
            {shippingFee === 0 ? (
              <span className="text-green-600 font-medium">Free</span>
            ) : (
              fmt(shippingFee)
            )}
          </span>
        </div>

        {tax > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Taxes &amp; fees</span>
            <span>{fmt(tax)}</span>
          </div>
        )}

        <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-2 mt-1">
          <span>Total</span>
          <span>{fmt(total)}</span>
        </div>
      </div>
    </aside>
  );
};

export default OrderSummaryPanel;
