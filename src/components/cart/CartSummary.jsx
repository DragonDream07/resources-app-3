import React from 'react';

const formatCurrency = (value) => {
  const num = typeof value === 'number' ? value : 0;
  return `₹${num.toFixed(2)}`;
};

const CartSummary = ({ summary }) => {
  const {
    subtotal = 0,
    shippingCharge = 0,
    discount = 0,
    gst = 0,
    grandTotal = 0,
  } = summary || {};

  return (
    <div className="cart-summary">
      <h2 className="cart-summary__title">Order Summary</h2>

      <ul className="cart-summary__lines">
        <li className="cart-summary__line">
          <span className="cart-summary__line-label">Subtotal</span>
          <span className="cart-summary__line-value">{formatCurrency(subtotal)}</span>
        </li>

        <li className="cart-summary__line">
          <span className="cart-summary__line-label">Shipping</span>
          <span className="cart-summary__line-value">
            {shippingCharge === 0 ? 'FREE' : formatCurrency(shippingCharge)}
          </span>
        </li>

        {discount > 0 && (
          <li className="cart-summary__line cart-summary__line--discount">
            <span className="cart-summary__line-label">Discount</span>
            <span className="cart-summary__line-value">- {formatCurrency(discount)}</span>
          </li>
        )}

        <li className="cart-summary__line">
          <span className="cart-summary__line-label">GST (included)</span>
          <span className="cart-summary__line-value">{formatCurrency(gst)}</span>
        </li>
      </ul>

      <div className="cart-summary__divider" />

      <div className="cart-summary__grand-total">
        <span className="cart-summary__grand-total-label">Grand Total</span>
        <span className="cart-summary__grand-total-value">{formatCurrency(grandTotal)}</span>
      </div>
    </div>
  );
};

export default CartSummary;
