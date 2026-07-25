import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import emptyStateImg from '@/assets/images/empty-state.svg';
import trashIcon from '@/assets/icons/trash.svg';
import plusIcon from '@/assets/icons/plus.svg';
import minusIcon from '@/assets/icons/minus.svg';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

function getCartId() {
  return localStorage.getItem('cartId') || null;
}

async function fetchCart(cartId) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/carts/${cartId}`, { headers });
  if (!res.ok) throw new Error('Failed to fetch cart');
  return res.json();
}

async function apiUpdateItem(cartId, itemId, quantity) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/carts/${cartId}/items/${itemId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error('Failed to update item');
  return res.json();
}

async function apiRemoveItem(cartId, itemId) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/carts/${cartId}/items/${itemId}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error('Failed to remove item');
  return res.ok;
}

async function apiApplyPromo(cartId, promoCode) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/carts/${cartId}/promo`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ code: promoCode }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Invalid promo code');
  }
  return res.json();
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg = type === 'error'
    ? '#ffe3e3'
    : type === 'success'
    ? '#d3f9d8'
    : '#e8ecfd';
  const border = type === 'error'
    ? '#f03e3e'
    : type === 'success'
    ? '#37b24d'
    : '#4c6ef5';
  const color = type === 'error' ? '#f03e3e' : '#212529';

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        background: bg,
        border: `1px solid ${border}`,
        color,
        borderRadius: '10px',
        padding: '12px 20px',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        fontSize: '14px',
        lineHeight: '20px',
        boxShadow: '0 4px 16px rgba(33,37,41,0.12)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '360px',
      }}
    >
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        aria-label="Dismiss"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color,
          fontSize: '16px',
          lineHeight: 1,
          padding: 0,
        }}
      >
        ✕
      </button>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        padding: '20px',
        background: '#ffffff',
        borderRadius: '10px',
        marginBottom: '12px',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '6px',
          background: '#e9ecef',
          flexShrink: 0,
          animation: 'shimmer 1.4s infinite',
        }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ height: '16px', background: '#e9ecef', borderRadius: '3px', width: '60%', animation: 'shimmer 1.4s infinite' }} />
        <div style={{ height: '14px', background: '#e9ecef', borderRadius: '3px', width: '40%', animation: 'shimmer 1.4s infinite' }} />
        <div style={{ height: '14px', background: '#e9ecef', borderRadius: '3px', width: '30%', animation: 'shimmer 1.4s infinite' }} />
      </div>
    </div>
  );
}

function SkeletonSummary() {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '10px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {[80, 60, 70, 50, 100].map((w, i) => (
        <div
          key={i}
          style={{
            height: i === 4 ? '44px' : '16px',
            background: '#e9ecef',
            borderRadius: i === 4 ? '10px' : '3px',
            width: `${w}%`,
            animation: 'shimmer 1.4s infinite',
          }}
        />
      ))}
    </div>
  );
}

function CartItemRow({ item, cartId, onUpdate, onRemove, disabled }) {
  const [qty, setQty] = useState(item.quantity);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setQty(item.quantity);
  }, [item.quantity]);

  const handleQtyChange = useCallback(
    async (newQty) => {
      if (newQty < 1) return;
      setUpdating(true);
      try {
        const updated = await apiUpdateItem(cartId, item.id, newQty);
        setQty(newQty);
        onUpdate(updated);
      } catch {
        onUpdate(null, 'Could not update quantity. Please try again.');
        setQty(item.quantity);
      } finally {
        setUpdating(false);
      }
    },
    [cartId, item.id, item.quantity, onUpdate]
  );

  const handleRemove = useCallback(async () => {
    setUpdating(true);
    try {
      await apiRemoveItem(cartId, item.id);
      onRemove(item.id);
    } catch {
      onUpdate(null, 'Could not remove item. Please try again.');
    } finally {
      setUpdating(false);
    }
  }, [cartId, item.id, onRemove, onUpdate]);

  const imageUrl = item.image_url || placeholderProduct;
  const unitPrice = item.unit_price ?? item.price ?? 0;
  const lineTotal = unitPrice * qty;

  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        padding: '20px',
        background: '#ffffff',
        borderRadius: '10px',
        marginBottom: '12px',
        alignItems: 'flex-start',
        opacity: disabled || updating ? 0.6 : 1,
        transition: 'opacity 0.2s',
        boxShadow: '0 1px 4px rgba(33,37,41,0.06)',
      }}
    >
      <img
        src={imageUrl}
        alt={item.product_name || item.name || 'Product image'}
        onError={(e) => { e.currentTarget.src = placeholderProduct; }}
        style={{
          width: '80px',
          height: '80px',
          objectFit: 'cover',
          borderRadius: '6px',
          flexShrink: 0,
          background: '#f8f9fa',
          border: '1px solid #e9ecef',
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: '24px',
            color: '#212529',
            marginBottom: '4px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.product_name || item.name || 'Product'}
        </div>
        {item.sku_label && (
          <div
            style={{
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
              fontSize: '12px',
              color: '#495057',
              marginBottom: '8px',
            }}
          >
            SKU: {item.sku_label}
          </div>
        )}
        <div
          style={{
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '14px',
            color: '#495057',
            marginBottom: '12px',
          }}
        >
          ₹{unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} each
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #868e96',
              borderRadius: '6px',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => handleQtyChange(qty - 1)}
              disabled={disabled || updating || qty <= 1}
              aria-label="Decrease quantity"
              style={{
                width: '36px',
                height: '36px',
                background: 'none',
                border: 'none',
                cursor: qty <= 1 || disabled || updating ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                color: qty <= 1 ? '#adb5bd' : '#212529',
              }}
            >
              <img src={minusIcon} alt="-" style={{ width: '14px', height: '14px' }} />
            </button>
            <span
              style={{
                minWidth: '32px',
                textAlign: 'center',
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                fontSize: '16px',
                fontWeight: 600,
                color: '#212529',
                padding: '0 4px',
              }}
            >
              {qty}
            </span>
            <button
              onClick={() => handleQtyChange(qty + 1)}
              disabled={disabled || updating}
              aria-label="Increase quantity"
              style={{
                width: '36px',
                height: '36px',
                background: 'none',
                border: 'none',
                cursor: disabled || updating ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                color: '#212529',
              }}
            >
              <img src={plusIcon} alt="+" style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
          <button
            onClick={handleRemove}
            disabled={disabled || updating}
            aria-label="Remove item"
            style={{
              background: 'none',
              border: 'none',
              cursor: disabled || updating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '14px',
              color: '#f03e3e',
              padding: '4px 12px',
              borderRadius: '6px',
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              minHeight: '44px',
            }}
          >
            <img src={trashIcon} alt="" style={{ width: '14px', height: '14px' }} />
            Remove
          </button>
        </div>
      </div>
      <div
        style={{
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '16px',
          fontWeight: 700,
          color: '#212529',
          whiteSpace: 'nowrap',
          minWidth: '80px',
          textAlign: 'right',
        }}
      >
        ₹{lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    </div>
  );
}

function OrderSummary({ cart, promoCode, setPromoCode, onApplyPromo, promoLoading, promoError, onCheckout }) {
  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => {
    const price = item.unit_price ?? item.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const discount = cart?.discount ?? 0;
  const shipping = cart?.shipping_charge ?? 0;
  const tax = cart?.tax ?? 0;
  const total = cart?.total ?? subtotal + shipping + tax - discount;

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '10px',
        padding: '24px',
        boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
        position: 'sticky',
        top: '24px',
      }}
    >
      <h2
        style={{
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '20px',
          fontWeight: 600,
          lineHeight: '28px',
          color: '#212529',
          marginBottom: '20px',
          marginTop: 0,
        }}
      >
        Order Summary
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        <SummaryLine label="Subtotal" value={subtotal} />
        {discount > 0 && (
          <SummaryLine label="Discount" value={-discount} isDiscount />
        )}
        <SummaryLine label="Shipping" value={shipping} freeLabel={shipping === 0} />
        {tax > 0 && <SummaryLine label="Tax" value={tax} />}
        <div
          style={{
            borderTop: '1px solid #e9ecef',
            paddingTop: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              fontSize: '16px',
              fontWeight: 700,
              color: '#212529',
            }}
          >
            Total
          </span>
          <span
            style={{
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              fontSize: '20px',
              fontWeight: 700,
              color: '#212529',
            }}
          >
            ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="promo-code"
          style={{
            display: 'block',
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#495057',
            marginBottom: '8px',
          }}
        >
          Promo Code
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            id="promo-code"
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            aria-describedby={promoError ? 'promo-error' : undefined}
            style={{
              flex: 1,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
              fontSize: '14px',
              padding: '10px 12px',
              borderRadius: '6px',
              border: `1px solid ${promoError ? '#f03e3e' : '#868e96'}`,
              background: '#ffffff',
              color: '#212529',
              outline: 'none',
              minHeight: '44px',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={onApplyPromo}
            disabled={promoLoading || !promoCode.trim()}
            style={{
              padding: '10px 16px',
              borderRadius: '6px',
              border: 'none',
              background: promoLoading || !promoCode.trim() ? '#e9ecef' : '#4c6ef5',
              color: promoLoading || !promoCode.trim() ? '#adb5bd' : '#ffffff',
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              cursor: promoLoading || !promoCode.trim() ? 'not-allowed' : 'pointer',
              minHeight: '44px',
              whiteSpace: 'nowrap',
            }}
          >
            {promoLoading ? 'Applying…' : 'Apply'}
          </button>
        </div>
        {promoError && (
          <p
            id="promo-error"
            role="alert"
            style={{
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              fontSize: '12px',
              color: '#f03e3e',
              marginTop: '4px',
              marginBottom: 0,
            }}
          >
            {promoError}
          </p>
        )}
        {cart?.promo_code && !promoError && (
          <p
            style={{
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              fontSize: '12px',
              color: '#37b24d',
              marginTop: '4px',
              marginBottom: 0,
            }}
          >
            ✓ Promo code applied
          </p>
        )}
      </div>

      <button
        onClick={onCheckout}
        disabled={items.length === 0}
        style={{
          width: '100%',
          padding: '14px 24px',
          borderRadius: '10px',
          border: 'none',
          background: items.length === 0 ? '#e9ecef' : '#4c6ef5',
          color: items.length === 0 ? '#adb5bd' : '#ffffff',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '16px',
          fontWeight: 600,
          cursor: items.length === 0 ? 'not-allowed' : 'pointer',
          minHeight: '44px',
          transition: 'background 0.15s',
        }}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}

function SummaryLine({ label, value, isDiscount, freeLabel }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span
        style={{
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '14px',
          color: '#495057',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '14px',
          fontWeight: 500,
          color: isDiscount ? '#37b24d' : '#212529',
        }}
      >
        {freeLabel && value === 0
          ? 'FREE'
          : `${isDiscount ? '-' : ''}₹${Math.abs(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
      </span>
    </div>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | empty | error | ready
  const [toast, setToast] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, key: Date.now() });
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  const loadCart = useCallback(async () => {
    const cartId = getCartId();
    if (!cartId) {
      setStatus('empty');
      return;
    }
    setStatus('loading');
    try {
      const data = await fetchCart(cartId);
      setCart(data);
      const items = data?.items || [];
      setStatus(items.length === 0 ? 'empty' : 'ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleUpdate = useCallback(
    (updatedCart, errorMsg) => {
      if (errorMsg) {
        showToast(errorMsg, 'error');
        return;
      }
      if (updatedCart) {
        setCart(updatedCart);
        const items = updatedCart?.items || [];
        if (items.length === 0) setStatus('empty');
      }
    },
    [showToast]
  );

  const handleRemove = useCallback(
    (itemId) => {
      setCart((prev) => {
        if (!prev) return prev;
        const items = (prev.items || []).filter((i) => i.id !== itemId);
        const updated = { ...prev, items };
        if (items.length === 0) setStatus('empty');
        return updated;
      });
      showToast('Item removed from cart', 'success');
    },
    [showToast]
  );

  const handleApplyPromo = useCallback(async () => {
    const cartId = getCartId();
    if (!cartId || !promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      const updated = await apiApplyPromo(cartId, promoCode.trim());
      setCart(updated);
      showToast('Promo code applied!', 'success');
    } catch (err) {
      setPromoError(err.message || 'Invalid promo code');
    } finally {
      setPromoLoading(false);
    }
  }, [cartId, promoCode, showToast]);

  const handleCheckout = useCallback(() => {
    navigate('/checkout/review');
  }, [navigate]);

  const cartId = getCartId();
  const items = cart?.items || [];
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        @media (max-width: 768px) {
          .cart-layout {
            flex-direction: column !important;
          }
          .cart-summary-col {
            position: static !important;
          }
        }
      `}</style>

      <main
        style={{
          background: '#f8f9fa',
          minHeight: '100vh',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          padding: '32px 16px 64px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {/* Page Title */}
          <h1
            style={{
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              fontSize: '24px',
              fontWeight: 700,
              lineHeight: '32px',
              letterSpacing: '-0.01em',
              color: '#212529',
              marginBottom: '24px',
              marginTop: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            Your cart
            {status === 'ready' && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#e8ecfd',
                  color: '#4c6ef5',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '2px 10px',
                  verticalAlign: 'middle',
                }}
              >
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </h1>

          {/* Loading State */}
          {status === 'loading' && (
            <div
              className="cart-layout"
              style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}
            >
              <div style={{ flex: 1 }}>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </div>
              <div
                className="cart-summary-col"
                style={{ width: '340px', flexShrink: 0 }}
              >
                <SkeletonSummary />
              </div>
            </div>
          )}

          {/* Empty State */}
          {status === 'empty' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '64px 24px',
                textAlign: 'center',
              }}
            >
              <img
                src={emptyStateImg}
                alt="Empty cart"
                style={{ width: '160px', height: '160px', marginBottom: '24px', opacity: 0.7 }}
              />
              <h2
                style={{
                  fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#212529',
                  marginBottom: '8px',
                  marginTop: 0,
                }}
              >
                Your cart is empty
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: '16px',
                  color: '#495057',
                  marginBottom: '24px',
                  marginTop: 0,
                }}
              >
                Looks like you haven't added anything yet.
              </p>
              <Link
                to="/products"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  background: '#4c6ef5',
                  color: '#ffffff',
                  fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: '16px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  minHeight: '44px',
                }}
              >
                Start shopping
              </Link>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div
              role="alert"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '64px 24px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  marginBottom: '16px',
                  lineHeight: 1,
                }}
              >
                ⚠️
              </div>
              <h2
                style={{
                  fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#212529',
                  marginBottom: '8px',
                  marginTop: 0,
                }}
              >
                Couldn't load your cart
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: '16px',
                  color: '#495057',
                  marginBottom: '24px',
                  marginTop: 0,
                }}
              >
                Please refresh the page.
              </p>
              <button
                onClick={loadCart}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#4c6ef5',
                  color: '#ffffff',
                  fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                Refresh
              </button>
            </div>
          )}

          {/* Ready State */}
          {status === 'ready' && cart && (
            <div
              className="cart-layout"
              style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}
            >
              {/* Cart Items Column */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    cartId={cartId}
                    onUpdate={handleUpdate}
                    onRemove={handleRemove}
                    disabled={false}
                  />
                ))}
              </div>

              {/* Summary Column */}
              <div
                className="cart-summary-col"
                style={{ width: '340px', flexShrink: 0 }}
              >
                <OrderSummary
                  cart={cart}
                  promoCode={promoCode}
                  setPromoCode={setPromoCode}
                  onApplyPromo={handleApplyPromo}
                  promoLoading={promoLoading}
                  promoError={promoError}
                  onCheckout={handleCheckout}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </>
  );
}
