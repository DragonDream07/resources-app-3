import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    padding: '40px 16px',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '32px',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#495057',
  },
  stepItemActive: {
    color: '#4c6ef5',
    fontWeight: '600',
  },
  stepItemDone: {
    color: '#37b24d',
  },
  stepDot: {
    width: '28px',
    height: '28px',
    borderRadius: '9999px',
    backgroundColor: '#e9ecef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    color: '#495057',
  },
  stepDotActive: {
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
  },
  stepDotDone: {
    backgroundColor: '#37b24d',
    color: '#ffffff',
  },
  stepDivider: {
    flex: 1,
    height: '1px',
    backgroundColor: '#868e96',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: '24px',
    alignItems: 'start',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    color: '#212529',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  cardHeading: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '16px',
  },
  itemRow: {
    display: 'flex',
    gap: '16px',
    padding: '12px 0',
    borderBottom: '1px solid #e9ecef',
  },
  itemImg: {
    width: '72px',
    height: '72px',
    objectFit: 'cover',
    borderRadius: '6px',
    backgroundColor: '#e9ecef',
    flexShrink: 0,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '4px',
  },
  itemMeta: {
    fontSize: '13px',
    color: '#495057',
  },
  itemPrice: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#212529',
    textAlign: 'right',
    flexShrink: 0,
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    fontSize: '14px',
    color: '#343a40',
  },
  summaryRowTotal: {
    fontWeight: '700',
    fontSize: '16px',
    color: '#212529',
    padding: '12px 0 0',
    borderTop: '2px solid #212529',
    marginTop: '4px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e9ecef',
    margin: '12px 0',
  },
  promoRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '16px',
    alignItems: 'flex-end',
  },
  promoInput: {
    flex: 1,
    height: '44px',
    padding: '0 12px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    color: '#212529',
    backgroundColor: '#ffffff',
    outline: 'none',
    textTransform: 'uppercase',
    boxSizing: 'border-box',
  },
  promoBtn: {
    height: '44px',
    padding: '0 20px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    flexShrink: 0,
  },
  promoBtnDisabled: {
    backgroundColor: '#adb5bd',
    cursor: 'not-allowed',
  },
  promoSuccess: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#d3f9d8',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '13px',
    color: '#37b24d',
    marginTop: '10px',
  },
  promoError: {
    fontSize: '12px',
    color: '#f03e3e',
    marginTop: '6px',
  },
  removePromo: {
    background: 'none',
    border: 'none',
    color: '#f03e3e',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    marginLeft: 'auto',
    padding: '0',
  },
  shippingBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#d3f9d8',
    color: '#37b24d',
    borderRadius: '6px',
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: '600',
  },
  addressText: {
    fontSize: '14px',
    color: '#343a40',
    lineHeight: '1.6',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
  },
  backBtn: {
    height: '44px',
    padding: '0 24px',
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  placeOrderBtn: {
    height: '48px',
    padding: '0 40px',
    backgroundColor: '#37b24d',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    width: '100%',
    marginTop: '16px',
  },
  placeOrderBtnDisabled: {
    backgroundColor: '#adb5bd',
    cursor: 'not-allowed',
  },
  loadingText: {
    fontSize: '14px',
    color: '#495057',
    textAlign: 'center',
    padding: '40px',
  },
  errorAlert: {
    backgroundColor: '#ffe3e3',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    color: '#f03e3e',
    marginBottom: '16px',
  },
  discountText: {
    color: '#37b24d',
    fontWeight: '600',
  },
};

export default function CheckoutReview() {
  const navigate = useNavigate();

  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [placeError, setPlaceError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/checkout/review', {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        setReviewData(data.data || data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load order summary. Please go back and try again.');
        setLoading(false);
      });
  }, []);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoError('');
    setPromoLoading(true);
    try {
      const token = localStorage.getItem('token');
      const cartId = reviewData?.cartId;
      const res = await fetch(`/api/carts/${cartId}/promo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ promoCode: promoCode.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (res.ok) {
        setPromoApplied(data.data || data);
        setPromoError('');
      } else {
        setPromoError(data.message || 'Invalid or expired promo code.');
      }
    } catch {
      setPromoError('Failed to apply promo code. Please try again.');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(null);
    setPromoCode('');
    setPromoError('');
  };

  const handlePlaceOrder = async () => {
    setPlaceError('');
    setPlacingOrder(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/checkout/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) {
        const orderId = data.data?.orderId || data.orderId;
        navigate('/checkout/confirmation', { state: { orderId } });
      } else {
        setPlaceError(data.message || 'Failed to place order. Please try again.');
      }
    } catch {
      setPlaceError('Something went wrong. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loadingText}>Loading order summary…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorAlert}>{error}</div>
          <button style={styles.backBtn} onClick={() => navigate('/checkout/payment')} type="button">
            ← Back
          </button>
        </div>
      </div>
    );
  }

  const items = reviewData?.items || [];
  const address = reviewData?.address || {};
  const pricing = reviewData?.pricing || {};

  const subtotal = pricing.subtotal || 0;
  const shipping = pricing.shippingCharge ?? 0;
  const tax = pricing.tax || 0;
  const discount = promoApplied?.discountAmount || pricing.discount || 0;
  const total = subtotal + shipping + tax - discount;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.stepIndicator}>
          <div style={{ ...styles.stepItem, ...styles.stepItemDone }}>
            <div style={{ ...styles.stepDot, ...styles.stepDotDone }}>✓</div>
            Address
          </div>
          <div style={styles.stepDivider} />
          <div style={{ ...styles.stepItem, ...styles.stepItemDone }}>
            <div style={{ ...styles.stepDot, ...styles.stepDotDone }}>✓</div>
            Payment
          </div>
          <div style={styles.stepDivider} />
          <div style={{ ...styles.stepItem, ...styles.stepItemActive }}>
            <div style={{ ...styles.stepDot, ...styles.stepDotActive }}>3</div>
            Review
          </div>
        </div>

        <h1 style={styles.heading}>Review Your Order</h1>

        {placeError && <div style={styles.errorAlert}>{placeError}</div>}

        <div style={styles.layout}>
          <div>
            <div style={styles.card}>
              <div style={styles.cardHeading}>Order Items ({items.length})</div>
              {items.map((item, idx) => (
                <div key={item.id || idx} style={styles.itemRow}>
                  <img
                    src={item.imageUrl || '/src/assets/images/placeholder-product.svg'}
                    alt={item.name}
                    style={styles.itemImg}
                    onError={(e) => {
                      e.target.src = '/src/assets/images/placeholder-product.svg';
                    }}
                  />
                  <div style={styles.itemInfo}>
                    <div style={styles.itemName}>{item.name}</div>
                    <div style={styles.itemMeta}>
                      {item.skuLabel && <span>Variant: {item.skuLabel} · </span>}
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <div style={styles.itemPrice}>{formatCurrency(item.total || item.price * item.quantity)}</div>
                </div>
              ))}
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeading}>Delivery Address</div>
              <div style={styles.addressText}>
                <strong>{address.fullName}</strong>
                <br />
                {address.addressLine1}
                {address.addressLine2 ? `, ${address.addressLine2}` : ''}
                <br />
                {address.city}, {address.state} – {address.pinCode}
                <br />
                Phone: {address.phone}
              </div>
            </div>
          </div>

          <div>
            <div style={styles.card}>
              <div style={styles.cardHeading}>Order Summary</div>

              <div style={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span style={styles.shippingBadge}>FREE</span>
                  ) : (
                    formatCurrency(shipping)
                  )}
                </span>
              </div>
              <div style={styles.summaryRow}>
                <span>Tax (GST)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              {discount > 0 && (
                <div style={styles.summaryRow}>
                  <span>Discount</span>
                  <span style={styles.discountText}>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div style={{ ...styles.summaryRow, ...styles.summaryRowTotal }}>
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>

              <hr style={styles.divider} />

              <div style={{ fontSize: '13px', fontWeight: '600', color: '#495057', marginBottom: '6px' }}>
                Promo Code
              </div>

              {!promoApplied ? (
                <>
                  <div style={styles.promoRow}>
                    <input
                      style={styles.promoInput}
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value.toUpperCase());
                        setPromoError('');
                      }}
                      placeholder="ENTER CODE"
                      aria-label="Promo code"
                    />
                    <button
                      style={{
                        ...styles.promoBtn,
                        ...(promoLoading ? styles.promoBtnDisabled : {}),
                      }}
                      onClick={handleApplyPromo}
                      disabled={promoLoading}
                      type="button"
                    >
                      {promoLoading ? '…' : 'Apply'}
                    </button>
                  </div>
                  {promoError && <div style={styles.promoError}>{promoError}</div>}
                </>
              ) : (
                <div style={styles.promoSuccess}>
                  <span>✓</span>
                  <span>
                    <strong
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {promoApplied.promoCode}
                    </strong>{' '}
                    applied — you save {formatCurrency(discount)}
                  </span>
                  <button
                    style={styles.removePromo}
                    onClick={handleRemovePromo}
                    type="button"
                    aria-label="Remove promo code"
                  >
                    Remove
                  </button>
                </div>
              )}

              <button
                style={{
                  ...styles.placeOrderBtn,
                  ...(placingOrder ? styles.placeOrderBtnDisabled : {}),
                }}
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                type="button"
              >
                {placingOrder ? 'Placing Order…' : 'Place Order'}
              </button>
            </div>

            <div style={styles.footer}>
              <button
                style={styles.backBtn}
                onClick={() => navigate('/checkout/payment')}
                type="button"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
