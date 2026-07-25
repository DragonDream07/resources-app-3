import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const STATUS_BADGE = {
  pending: { bg: '#fff3e6', color: '#fd7e14' },
  confirmed: { bg: '#e8ecfd', color: '#4c6ef5' },
  processing: { bg: '#e8ecfd', color: '#4c6ef5' },
  shipped: { bg: '#e8ecfd', color: '#3b5bdb' },
  delivered: { bg: '#d3f9d8', color: '#37b24d' },
  cancelled: { bg: '#ffe3e3', color: '#f03e3e' },
  'return requested': { bg: '#fff4e6', color: '#fd7e14' },
  returned: { bg: '#fff4e6', color: '#fd7e14' },
};

function StatusBadge({ status }) {
  const s = STATUS_BADGE[status?.toLowerCase()] || { bg: '#e9ecef', color: '#495057' };
  return (
    <span style={{
      backgroundColor: s.bg, color: s.color, borderRadius: '9999px',
      fontSize: '12px', fontWeight: '600', padding: '3px 10px',
      letterSpacing: '0.06em', textTransform: 'uppercase', display: 'inline-block',
    }}>
      {status}
    </span>
  );
}

const styles = {
  page: { backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" },
  container: { maxWidth: '900px', margin: '0 auto', padding: '32px 16px' },
  backLink: { color: '#4c6ef5', fontSize: '14px', textDecoration: 'none', display: 'inline-block', marginBottom: '16px' },
  pageTitle: { fontSize: '24px', fontWeight: '700', letterSpacing: '-0.01em', lineHeight: '32px', color: '#212529', margin: '0 0 4px 0' },
  orderId: { fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", fontSize: '14px', color: '#495057' },
  card: { backgroundColor: '#ffffff', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '20px' },
  sectionLabel: { fontSize: '12px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#495057', marginBottom: '16px' },
  itemRow: { display: 'flex', gap: '16px', alignItems: 'center', paddingBottom: '16px', marginBottom: '16px', borderBottom: '1px solid #e9ecef' },
  itemImage: { width: '64px', height: '64px', borderRadius: '6px', objectFit: 'cover', backgroundColor: '#f8f9fa' },
  itemName: { fontSize: '16px', fontWeight: '600', color: '#212529', margin: '0 0 4px 0' },
  muted: { fontSize: '14px', color: '#495057' },
  timelineItem: { display: 'flex', gap: '12px', marginBottom: '16px' },
  timelineDot: { width: '12px', height: '12px', borderRadius: '9999px', backgroundColor: '#37b24d', flexShrink: 0, marginTop: '4px' },
  timelineDotPending: { backgroundColor: '#e9ecef', border: '2px solid #868e96' },
  timelineContent: { flex: 1 },
  timelineLabel: { fontSize: '14px', fontWeight: '600', color: '#212529' },
  timelineDate: { fontSize: '12px', color: '#495057' },
  actionsRow: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  btnDanger: { backgroundColor: 'transparent', color: '#f03e3e', border: '1px solid #f03e3e', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", minHeight: '44px' },
  btnSecondary: { backgroundColor: '#fd7e14', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", minHeight: '44px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' },
  errorBanner: { backgroundColor: '#ffe3e3', border: '1px solid #f03e3e', borderRadius: '6px', padding: '12px 16px', color: '#f03e3e', fontSize: '14px', marginBottom: '16px' },
  successBanner: { backgroundColor: '#d3f9d8', border: '1px solid #37b24d', borderRadius: '6px', padding: '12px 16px', color: '#37b24d', fontSize: '14px', marginBottom: '16px' },
  skeleton: { backgroundColor: '#e9ecef', borderRadius: '6px' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#495057', marginBottom: '8px' },
  totalRowBold: { display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700', color: '#212529', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e9ecef' },
  trackingBox: { backgroundColor: '#f8f9fa', borderRadius: '6px', padding: '16px', fontSize: '14px', color: '#495057' },
};

export default function OrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    Promise.all([
      fetch(`/api/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`/api/orders/${id}/timeline`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`/api/orders/${id}/tracking`, { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(async ([orderRes, timelineRes, trackingRes]) => {
        if (!orderRes.ok) throw new Error('Order not found or you do not have permission to view it.');
        const orderData = await orderRes.json();
        setOrder(orderData.order || orderData);
        if (timelineRes.ok) {
          const tl = await timelineRes.json();
          setTimeline(tl.timeline || tl.data || []);
        }
        if (trackingRes.ok) {
          const tr = await trackingRes.json();
          setTracking(tr.tracking || tr.data || tr);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, navigate]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return;
    setCancelLoading(true);
    setCancelError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${id}/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to cancel order');
      }
      setCancelSuccess(true);
      setOrder((prev) => ({ ...prev, status: 'cancelled' }));
    } catch (err) {
      setCancelError(err.message);
    } finally {
      setCancelLoading(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (amount) => {
    if (amount == null) return '';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const canCancel = order && !['cancelled', 'delivered', 'returned'].includes(order.status?.toLowerCase());
  const canReturn = order && order.status?.toLowerCase() === 'delivered';

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ ...styles.skeleton, height: '14px', width: '160px', marginBottom: '16px' }} />
          <div style={{ ...styles.skeleton, height: '32px', width: '260px', marginBottom: '8px' }} />
          <div style={{ ...styles.skeleton, height: '200px', marginBottom: '20px' }} />
          <div style={{ ...styles.skeleton, height: '160px', marginBottom: '20px' }} />
          <div style={{ ...styles.skeleton, height: '120px' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorBanner}>
            {error}
            {' '}
            <Link to="/account/orders" style={{ color: '#f03e3e' }}>← Back to order history</Link>
          </div>
        </div>
      </div>
    );
  }

  const items = order?.items || order?.order_items || [];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/account/orders" style={styles.backLink}>← Back to order history</Link>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={styles.pageTitle}>Order Detail</h1>
            <span style={styles.orderId}>#{order?.id}</span>
          </div>
          <StatusBadge status={order?.status} />
        </div>

        {cancelSuccess && <div style={styles.successBanner}>Order cancelled successfully.</div>}
        {cancelError && <div style={styles.errorBanner}>{cancelError}</div>}

        {/* Items */}
        <div style={styles.card}>
          <div style={styles.sectionLabel}>Items</div>
          {items.map((item, idx) => (
            <div key={item.id || idx} style={{ ...styles.itemRow, ...(idx === items.length - 1 ? { borderBottom: 'none', paddingBottom: 0, marginBottom: 0 } : {}) }}>
              <img
                src={item.image_url || '/src/assets/images/placeholder-product.svg'}
                alt={item.product_name || item.name || 'Product'}
                style={styles.itemImage}
              />
              <div style={{ flex: 1 }}>
                <p style={styles.itemName}>{item.product_name || item.name}</p>
                {item.sku_attributes && <p style={styles.muted}>{Object.entries(item.sku_attributes).map(([k, v]) => `${k}: ${v}`).join(', ')}</p>}
                <p style={styles.muted}>Qty: {item.quantity}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#212529' }}>{formatCurrency(item.unit_price * item.quantity)}</p>
                <p style={styles.muted}>{formatCurrency(item.unit_price)} each</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div style={styles.card}>
          <div style={styles.sectionLabel}>Order Summary</div>
          <div style={styles.totalRow}><span>Subtotal</span><span>{formatCurrency(order?.subtotal)}</span></div>
          {order?.discount_amount > 0 && <div style={styles.totalRow}><span>Discount</span><span style={{ color: '#37b24d' }}>-{formatCurrency(order.discount_amount)}</span></div>}
          {order?.shipping_amount != null && <div style={styles.totalRow}><span>Shipping</span><span>{formatCurrency(order.shipping_amount)}</span></div>}
          {order?.tax_amount != null && <div style={styles.totalRow}><span>Tax</span><span>{formatCurrency(order.tax_amount)}</span></div>}
          <div style={styles.totalRowBold}><span>Total</span><span>{formatCurrency(order?.total_amount || order?.total)}</span></div>
        </div>

        {/* Shipping address */}
        {order?.shipping_address && (
          <div style={styles.card}>
            <div style={styles.sectionLabel}>Shipping Address</div>
            <p style={{ fontSize: '14px', color: '#212529', margin: 0, lineHeight: '1.6' }}>
              {order.shipping_address.full_name || `${order.shipping_address.first_name || ''} ${order.shipping_address.last_name || ''}`.trim()}<br />
              {order.shipping_address.line1}{order.shipping_address.line2 ? `, ${order.shipping_address.line2}` : ''}<br />
              {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}<br />
              {order.shipping_address.country}
            </p>
          </div>
        )}

        {/* Status timeline */}
        {timeline.length > 0 && (
          <div style={styles.card}>
            <div style={styles.sectionLabel}>Status Timeline</div>
            {timeline.map((step, idx) => (
              <div key={idx} style={styles.timelineItem}>
                <div style={{ ...styles.timelineDot, ...(step.completed ? {} : styles.timelineDotPending) }} />
                <div style={styles.timelineContent}>
                  <p style={styles.timelineLabel}>{step.status || step.label}</p>
                  {step.created_at && <p style={styles.timelineDate}>{formatDate(step.created_at)}</p>}
                  {step.note && <p style={styles.muted}>{step.note}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tracking */}
        {tracking && (
          <div style={styles.card}>
            <div style={styles.sectionLabel}>Tracking</div>
            <div style={styles.trackingBox}>
              {tracking.carrier && <p style={{ margin: '0 0 4px 0' }}><strong>Carrier:</strong> {tracking.carrier}</p>}
              {tracking.tracking_number && <p style={{ margin: '0 0 4px 0' }}><strong>Tracking number:</strong> <span style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}>{tracking.tracking_number}</span></p>}
              {tracking.estimated_delivery && <p style={{ margin: '0 0 4px 0' }}><strong>Estimated delivery:</strong> {formatDate(tracking.estimated_delivery)}</p>}
              {tracking.tracking_url && <a href={tracking.tracking_url} target="_blank" rel="noopener noreferrer" style={{ color: '#4c6ef5', fontSize: '14px' }}>Track shipment →</a>}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={styles.actionsRow}>
          {canReturn && (
            <Link to={`/account/orders/${id}/return`} style={styles.btnSecondary}>Request return</Link>
          )}
          {canCancel && (
            <button style={styles.btnDanger} onClick={handleCancel} disabled={cancelLoading}>
              {cancelLoading ? 'Cancelling…' : 'Cancel order'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
