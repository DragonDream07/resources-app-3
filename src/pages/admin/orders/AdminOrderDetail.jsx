import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import packageIcon from '@/assets/icons/package.svg';
import mapPinIcon from '@/assets/icons/map-pin.svg';
import chevronLeftIcon from '@/assets/icons/chevron-left.svg';
import checkIcon from '@/assets/icons/check.svg';

const STATUS_COLORS = {
  pending: { bg: '#fff3e6', text: '#fd7e14' },
  confirmed: { bg: '#e8ecfd', text: '#4c6ef5' },
  processing: { bg: '#e8ecfd', text: '#4c6ef5' },
  shipped: { bg: '#e8ecfd', text: '#3b5bdb' },
  delivered: { bg: '#d3f9d8', text: '#37b24d' },
  cancelled: { bg: '#ffe3e3', text: '#f03e3e' },
  return_requested: { bg: '#fff3e6', text: '#fd7e14' },
  returned: { bg: '#e9ecef', text: '#495057' },
};

const STATUS_FLOW = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
];

function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || { bg: '#e9ecef', text: '#495057' };
  return (
    <span
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        padding: '3px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        display: 'inline-block',
      }}
    >
      {status ? status.replace(/_/g, ' ') : 'unknown'}
    </span>
  );
}

function SectionCard({ title, children }) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #868e96',
        marginBottom: '24px',
        overflow: 'hidden',
      }}
    >
      {title && (
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #e9ecef',
            fontSize: '16px',
            fontWeight: '600',
            color: '#212529',
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          }}
        >
          {title}
        </div>
      )}
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  );
}

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [advancing, setAdvancing] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [cancelNote, setCancelNote] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [orderRes, timelineRes, refundsRes] = await Promise.all([
        fetch(`/orders/${id}`, { headers }),
        fetch(`/orders/${id}/timeline`, { headers }),
        fetch(`/orders/${id}/refunds`, { headers }),
      ]);

      if (!orderRes.ok) throw new Error('Failed to fetch order');
      const orderData = await orderRes.json();
      setOrder(orderData.data || orderData);

      if (timelineRes.ok) {
        const tlData = await timelineRes.json();
        setTimeline(tlData.data || tlData.timeline || tlData || []);
      }

      if (refundsRes.ok) {
        const rfData = await refundsRes.json();
        setRefunds(rfData.data || rfData.refunds || rfData || []);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the order.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  async function handleAdvanceStatus() {
    setAdvancing(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/orders/${id}/advance`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to advance order status');
      }
      const data = await res.json();
      setActionSuccess(`Order status advanced to "${(data.data?.status || data.status || '').replace(/_/g, ' ')}".`);
      await fetchOrder();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setAdvancing(false);
    }
  }

  async function handleCancelOrder() {
    setCancelling(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/orders/${id}/cancel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: cancelNote }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to cancel order');
      }
      setActionSuccess('Order has been cancelled.');
      setShowCancelModal(false);
      setCancelNote('');
      await fetchOrder();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setCancelling(false);
    }
  }

  const canAdvance =
    order &&
    STATUS_FLOW.includes(order.status) &&
    STATUS_FLOW.indexOf(order.status) < STATUS_FLOW.length - 1;

  const canCancel =
    order &&
    ['pending', 'confirmed', 'processing'].includes(order.status);

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      padding: '32px 24px',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      color: '#4c6ef5',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '20px',
    },
    header: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
      marginBottom: '24px',
    },
    titleBlock: {},
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#212529',
      letterSpacing: '-0.01em',
      margin: '0 0 8px',
    },
    orderId: {
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      fontSize: '14px',
      color: '#495057',
    },
    actionsBlock: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    advanceBtn: {
      padding: '10px 20px',
      borderRadius: '10px',
      backgroundColor: '#4c6ef5',
      color: '#ffffff',
      border: 'none',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      minHeight: '44px',
      opacity: advancing ? 0.7 : 1,
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    },
    cancelBtn: {
      padding: '10px 20px',
      borderRadius: '10px',
      backgroundColor: '#ffffff',
      color: '#f03e3e',
      border: '1px solid #f03e3e',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      minHeight: '44px',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    },
    twoCol: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
    },
    label: {
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: '#495057',
      marginBottom: '4px',
    },
    value: {
      fontSize: '14px',
      color: '#212529',
      fontWeight: '500',
    },
    fieldGroup: {
      marginBottom: '16px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '10px 0',
      color: '#495057',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      textAlign: 'left',
      borderBottom: '1px solid #e9ecef',
    },
    td: {
      padding: '12px 0',
      color: '#343a40',
      fontSize: '14px',
      borderBottom: '1px solid #f1f3f5',
      verticalAlign: 'top',
    },
    timelineItem: {
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-start',
      paddingBottom: '20px',
    },
    timelineDot: {
      width: '12px',
      height: '12px',
      borderRadius: '9999px',
      backgroundColor: '#4c6ef5',
      marginTop: '4px',
      flexShrink: 0,
    },
    alertSuccess: {
      backgroundColor: '#d3f9d8',
      color: '#37b24d',
      padding: '12px 16px',
      borderRadius: '6px',
      marginBottom: '16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    alertError: {
      backgroundColor: '#ffe3e3',
      color: '#f03e3e',
      padding: '12px 16px',
      borderRadius: '6px',
      marginBottom: '16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(33,37,41,0.48)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '24px',
    },
    modal: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '32px',
      maxWidth: '480px',
      width: '100%',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#212529',
      marginBottom: '12px',
    },
    modalText: {
      fontSize: '14px',
      color: '#495057',
      marginBottom: '20px',
    },
    textarea: {
      width: '100%',
      padding: '10px 14px',
      borderRadius: '6px',
      border: '1px solid #868e96',
      fontSize: '14px',
      color: '#212529',
      marginBottom: '20px',
      minHeight: '80px',
      resize: 'vertical',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      boxSizing: 'border-box',
    },
    modalActions: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
    },
    modalCancelBtn: {
      padding: '10px 20px',
      borderRadius: '10px',
      backgroundColor: '#ffffff',
      color: '#495057',
      border: '1px solid #868e96',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      minHeight: '44px',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    },
    modalConfirmBtn: {
      padding: '10px 20px',
      borderRadius: '10px',
      backgroundColor: '#f03e3e',
      color: '#ffffff',
      border: 'none',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      minHeight: '44px',
      opacity: cancelling ? 0.7 : 1,
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      fontSize: '14px',
      color: '#343a40',
      borderBottom: '1px solid #f1f3f5',
    },
    summaryTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0 0',
      fontSize: '16px',
      fontWeight: '700',
      color: '#212529',
    },
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', padding: '64px', color: '#495057', fontSize: '16px' }}>
            Loading order…
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <Link to="/admin/orders" style={styles.backLink}>
            <img src={chevronLeftIcon} alt="" style={{ width: '16px', height: '16px' }} />
            Back to Orders
          </Link>
          <div style={styles.alertError}>{error}</div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const shippingAddr = order.shippingAddress || order.shipping_address || {};
  const items = order.items || [];
  const payment = order.paymentAttempt || order.payment || {};

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/admin/orders" style={styles.backLink}>
          <img src={chevronLeftIcon} alt="" style={{ width: '16px', height: '16px' }} />
          Back to Orders
        </Link>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.titleBlock}>
            <h1 style={styles.title}>
              Order <span style={styles.orderId}>#{order.id}</span>
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <StatusBadge status={order.status} />
              <span style={{ fontSize: '14px', color: '#495057' }}>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })
                  : ''}
              </span>
            </div>
          </div>
          <div style={styles.actionsBlock}>
            {canAdvance && (
              <button
                style={styles.advanceBtn}
                onClick={handleAdvanceStatus}
                disabled={advancing}
              >
                {advancing ? 'Advancing…' : `Advance to "${STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1]?.replace(/_/g, ' ')}"`}
              </button>
            )}
            {canCancel && (
              <button
                style={styles.cancelBtn}
                onClick={() => setShowCancelModal(true)}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* Action feedback */}
        {actionSuccess && <div style={styles.alertSuccess}>{actionSuccess}</div>}
        {actionError && <div style={styles.alertError}>{actionError}</div>}

        {/* Main content */}
        <div style={styles.twoCol}>
          {/* Left column */}
          <div>
            {/* Customer */}
            <SectionCard title="Customer">
              <div style={styles.fieldGroup}>
                <div style={styles.label}>Name</div>
                <div style={styles.value}>
                  {order.user?.name || order.guestName || '—'}
                </div>
              </div>
              <div style={styles.fieldGroup}>
                <div style={styles.label}>Email</div>
                <div style={styles.value}>
                  {order.user?.email || order.guestEmail || '—'}
                </div>
              </div>
              <div style={styles.fieldGroup}>
                <div style={styles.label}>Phone</div>
                <div style={styles.value}>
                  {order.user?.phone || order.guestPhone || shippingAddr.phone || '—'}
                </div>
              </div>
              {order.user?.id && (
                <div style={styles.fieldGroup}>
                  <div style={styles.label}>User ID</div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                      fontSize: '13px',
                      color: '#495057',
                    }}
                  >
                    {order.user.id}
                  </div>
                </div>
              )}
            </SectionCard>

            {/* Shipping Address */}
            <SectionCard title="Shipping Address">
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <img src={mapPinIcon} alt="" style={{ width: '18px', height: '18px', marginTop: '2px', flexShrink: 0, opacity: 0.6 }} />
                <div style={{ fontSize: '14px', color: '#343a40', lineHeight: '1.6' }}>
                  {shippingAddr.name && <div style={{ fontWeight: '600' }}>{shippingAddr.name}</div>}
                  {shippingAddr.line1 && <div>{shippingAddr.line1}</div>}
                  {shippingAddr.line2 && <div>{shippingAddr.line2}</div>}
                  <div>
                    {[shippingAddr.city, shippingAddr.state, shippingAddr.pinCode || shippingAddr.pin_code]
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                  {shippingAddr.phone && <div style={{ marginTop: '4px', color: '#495057' }}>{shippingAddr.phone}</div>}
                </div>
              </div>
            </SectionCard>

            {/* Payment */}
            <SectionCard title="Payment">
              <div style={styles.fieldGroup}>
                <div style={styles.label}>Method</div>
                <div style={styles.value}>
                  {payment.method || order.paymentMethod || '—'}
                </div>
              </div>
              <div style={styles.fieldGroup}>
                <div style={styles.label}>Status</div>
                <div style={styles.value}>
                  {payment.status || order.paymentStatus || '—'}
                </div>
              </div>
              {payment.transactionId && (
                <div style={styles.fieldGroup}>
                  <div style={styles.label}>Transaction ID</div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                      fontSize: '13px',
                      color: '#495057',
                    }}
                  >
                    {payment.transactionId}
                  </div>
                </div>
              )}
              {order.promoCode && (
                <div style={styles.fieldGroup}>
                  <div style={styles.label}>Promo Code</div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                      fontSize: '13px',
                      color: '#4c6ef5',
                      fontWeight: '600',
                    }}
                  >
                    {order.promoCode}
                  </div>
                </div>
              )}
            </SectionCard>
          </div>

          {/* Right column */}
          <div>
            {/* Order Items */}
            <SectionCard title="Order Items">
              {items.length === 0 ? (
                <p style={{ fontSize: '14px', color: '#495057', margin: 0 }}>No items found.</p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Product</th>
                      <th style={{ ...styles.th, textAlign: 'right' }}>Qty</th>
                      <th style={{ ...styles.th, textAlign: 'right' }}>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td style={styles.td}>
                          <div style={{ fontWeight: '500', color: '#212529', marginBottom: '2px' }}>
                            {item.productName || item.product?.name || '—'}
                          </div>
                          {(item.skuCode || item.sku?.code) && (
                            <div
                              style={{
                                fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                                fontSize: '12px',
                                color: '#495057',
                              }}
                            >
                              {item.skuCode || item.sku?.code}
                            </div>
                          )}
                          {item.variantLabel && (
                            <div style={{ fontSize: '12px', color: '#495057' }}>{item.variantLabel}</div>
                          )}
                        </td>
                        <td style={{ ...styles.td, textAlign: 'right' }}>{item.quantity}</td>
                        <td style={{ ...styles.td, textAlign: 'right' }}>
                          ₹{Number(item.price || item.unitPrice || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Order Summary */}
              <div style={{ marginTop: '20px', borderTop: '1px solid #e9ecef', paddingTop: '16px' }}>
                {order.subtotal != null && (
                  <div style={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span>₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {order.discount != null && order.discount > 0 && (
                  <div style={{ ...styles.summaryRow, color: '#37b24d' }}>
                    <span>Discount</span>
                    <span>−₹{Number(order.discount).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {order.shippingCharge != null && (
                  <div style={styles.summaryRow}>
                    <span>Shipping</span>
                    <span>
                      {order.shippingCharge === 0
                        ? 'Free'
                        : `₹${Number(order.shippingCharge).toLocaleString('en-IN')}`}
                    </span>
                  </div>
                )}
                {order.tax != null && (
                  <div style={styles.summaryRow}>
                    <span>Tax</span>
                    <span>₹{Number(order.tax).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div style={styles.summaryTotal}>
                  <span>Total</span>
                  <span>₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </SectionCard>

            {/* Timeline */}
            <SectionCard title="Status Timeline">
              {timeline.length === 0 ? (
                <p style={{ fontSize: '14px', color: '#495057', margin: 0 }}>No timeline events.</p>
              ) : (
                <div>
                  {timeline.map((event, idx) => (
                    <div key={event.id || idx} style={styles.timelineItem}>
                      <div style={styles.timelineDot} />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#212529', textTransform: 'capitalize' }}>
                          {(event.status || event.toStatus || '').replace(/_/g, ' ')}
                        </div>
                        {event.note && (
                          <div style={{ fontSize: '13px', color: '#495057', marginTop: '2px' }}>
                            {event.note}
                          </div>
                        )}
                        <div style={{ fontSize: '12px', color: '#868e96', marginTop: '4px' }}>
                          {event.createdAt
                            ? new Date(event.createdAt).toLocaleString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                          {event.actor && ` · ${event.actor}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Refunds */}
            {refunds.length > 0 && (
              <SectionCard title="Refunds">
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Amount</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refunds.map((refund, idx) => (
                      <tr key={refund.id || idx}>
                        <td style={styles.td}>
                          ₹{Number(refund.amount || 0).toLocaleString('en-IN')}
                        </td>
                        <td style={styles.td}>
                          <StatusBadge status={refund.status} />
                        </td>
                        <td style={styles.td}>
                          {refund.createdAt
                            ? new Date(refund.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </SectionCard>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div
          style={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-modal-title"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCancelModal(false); }}
        >
          <div style={styles.modal}>
            <h2 id="cancel-modal-title" style={styles.modalTitle}>Cancel Order</h2>
            <p style={styles.modalText}>
              Are you sure you want to cancel order <strong>#{order.id}</strong>? This action cannot be
              undone.
            </p>
            <textarea
              style={styles.textarea}
              placeholder="Reason for cancellation (optional)"
              value={cancelNote}
              onChange={(e) => setCancelNote(e.target.value)}
              aria-label="Cancellation reason"
            />
            {actionError && <div style={{ ...styles.alertError, marginBottom: '16px' }}>{actionError}</div>}
            <div style={styles.modalActions}>
              <button
                style={styles.modalCancelBtn}
                onClick={() => { setShowCancelModal(false); setCancelNote(''); setActionError(null); }}
                disabled={cancelling}
              >
                Keep Order
              </button>
              <button
                style={styles.modalConfirmBtn}
                onClick={handleCancelOrder}
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling…' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
