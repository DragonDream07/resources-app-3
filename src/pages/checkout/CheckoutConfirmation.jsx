import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import checkIcon from '@/assets/icons/check.svg';
import packageIcon from '@/assets/icons/package.svg';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    padding: '40px 16px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  container: {
    maxWidth: '640px',
    width: '100%',
  },
  successBanner: {
    backgroundColor: '#d3f9d8',
    borderRadius: '16px',
    padding: '40px 32px',
    textAlign: 'center',
    marginBottom: '24px',
  },
  checkCircle: {
    width: '72px',
    height: '72px',
    borderRadius: '9999px',
    backgroundColor: '#37b24d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  checkIcon: {
    width: '36px',
    height: '36px',
    filter:
      'invert(1) brightness(2)',
  },
  confirmTitle: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
    marginBottom: '8px',
  },
  confirmSubtitle: {
    fontSize: '16px',
    color: '#495057',
    lineHeight: '1.5',
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
  orderIdRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #e9ecef',
  },
  orderIdLabel: {
    fontSize: '13px',
    color: '#495057',
    fontWeight: '500',
  },
  orderIdValue: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    letterSpacing: '0.02em',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    fontSize: '14px',
    color: '#343a40',
    borderBottom: '1px solid #f0f0f0',
  },
  detailLabel: {
    color: '#495057',
  },
  detailValue: {
    fontWeight: '600',
    color: '#212529',
  },
  itemRow: {
    display: 'flex',
    gap: '14px',
    padding: '10px 0',
    borderBottom: '1px solid #f0f0f0',
    alignItems: 'center',
  },
  itemImg: {
    width: '56px',
    height: '56px',
    objectFit: 'cover',
    borderRadius: '6px',
    backgroundColor: '#e9ecef',
    flexShrink: 0,
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#212529',
  },
  itemMeta: {
    fontSize: '12px',
    color: '#495057',
    marginTop: '2px',
  },
  itemPrice: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    marginLeft: 'auto',
    flexShrink: 0,
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: '700',
    fontSize: '16px',
    color: '#212529',
    padding: '12px 0 0',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  timelineStep: {
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start',
  },
  timelineDotActive: {
    width: '12px',
    height: '12px',
    borderRadius: '9999px',
    backgroundColor: '#4c6ef5',
    marginTop: '4px',
    flexShrink: 0,
  },
  timelineDotPending: {
    width: '12px',
    height: '12px',
    borderRadius: '9999px',
    border: '2px solid #868e96',
    marginTop: '4px',
    flexShrink: 0,
  },
  timelineLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#212529',
  },
  timelineSub: {
    fontSize: '12px',
    color: '#495057',
  },
  actionRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  primaryBtn: {
    height: '44px',
    padding: '0 28px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  },
  secondaryBtn: {
    height: '44px',
    padding: '0 28px',
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  },
  guestRegisterBox: {
    backgroundColor: '#e8ecfd',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    padding: '20px 24px',
    marginBottom: '20px',
  },
  guestRegisterTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '6px',
  },
  guestRegisterDesc: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '12px',
  },
  guestRegisterBtn: {
    height: '40px',
    padding: '0 24px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '15px',
    color: '#495057',
  },
};

const ORDER_TIMELINE = [
  { id: 'confirmed', label: 'Order Confirmed', sub: 'Your order has been received.' },
  { id: 'processing', label: 'Processing', sub: 'We are preparing your order.' },
  { id: 'shipped', label: 'Shipped', sub: 'Your order is on its way.' },
  { id: 'delivered', label: 'Delivered', sub: 'Enjoy your purchase!' },
];

export default function CheckoutConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  const orderId = location.state?.orderId;

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isGuest = !localStorage.getItem('token');

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem('token');
    fetch(`/api/orders/${orderId}`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setOrderData(data?.data || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loadingText}>Loading order details…</div>
        </div>
      </div>
    );
  }

  const items = orderData?.items || [];
  const address = orderData?.address || orderData?.deliveryAddress || {};
  const pricing = orderData?.pricing || {};

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.successBanner}>
          <div style={styles.checkCircle}>
            <img src={checkIcon} alt="Order confirmed" style={styles.checkIcon} />
          </div>
          <div style={styles.confirmTitle}>Order Confirmed!</div>
          <div style={styles.confirmSubtitle}>
            Thank you for your purchase. We'll send you updates as your order progresses.
          </div>
        </div>

        {isGuest && (
          <div style={styles.guestRegisterBox}>
            <div style={styles.guestRegisterTitle}>Save your details for next time</div>
            <div style={styles.guestRegisterDesc}>
              Create an account to track your orders, manage returns and enjoy a faster checkout.
            </div>
            <Link
              to="/checkout/register"
              state={{ orderId }}
              style={styles.guestRegisterBtn}
            >
              Create Account
            </Link>
          </div>
        )}

        <div style={styles.card}>
          <div style={styles.cardHeading}>Order Details</div>
          {orderId && (
            <div style={styles.orderIdRow}>
              <span style={styles.orderIdLabel}>Order ID</span>
              <span style={styles.orderIdValue}>{orderId}</span>
            </div>
          )}
          {orderData?.createdAt && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Order Date</span>
              <span style={styles.detailValue}>
                {new Date(orderData.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}
          {orderData?.paymentMethod && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Payment</span>
              <span style={styles.detailValue}>
                {orderData.paymentMethod.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>
            </div>
          )}
          {address.city && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Delivery To</span>
              <span style={styles.detailValue}>
                {address.city}, {address.state}
              </span>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div style={styles.card}>
            <div style={styles.cardHeading}>Items Ordered</div>
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
                <div>
                  <div style={styles.itemName}>{item.name}</div>
                  <div style={styles.itemMeta}>
                    {item.skuLabel ? `Variant: ${item.skuLabel} · ` : ''}Qty: {item.quantity}
                  </div>
                </div>
                <div style={styles.itemPrice}>
                  {formatCurrency(item.total || item.price * item.quantity)}
                </div>
              </div>
            ))}
            {pricing.total && (
              <div style={styles.totalRow}>
                <span>Total Paid</span>
                <span>{formatCurrency(pricing.total)}</span>
              </div>
            )}
          </div>
        )}

        <div style={styles.card}>
          <div style={styles.cardHeading}>What Happens Next</div>
          <div style={styles.timeline}>
            {ORDER_TIMELINE.map((step, idx) => (
              <div key={step.id} style={styles.timelineStep}>
                <div
                  style={
                    idx === 0 ? styles.timelineDotActive : styles.timelineDotPending
                  }
                />
                <div>
                  <div style={styles.timelineLabel}>{step.label}</div>
                  <div style={styles.timelineSub}>{step.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.actionRow}>
          {orderId && (
            <Link to={`/orders/${orderId}`} style={styles.primaryBtn}>
              Track Order
            </Link>
          )}
          <Link to="/" style={styles.secondaryBtn}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
