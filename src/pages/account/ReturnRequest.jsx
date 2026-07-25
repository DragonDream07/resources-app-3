import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const styles = {
  page: { backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" },
  container: { maxWidth: '720px', margin: '0 auto', padding: '32px 16px' },
  backLink: { color: '#4c6ef5', fontSize: '14px', textDecoration: 'none', display: 'inline-block', marginBottom: '16px' },
  pageTitle: { fontSize: '32px', fontWeight: '700', letterSpacing: '-0.02em', lineHeight: '40px', color: '#212529', margin: '0 0 4px 0' },
  muted: { fontSize: '14px', color: '#495057' },
  card: { backgroundColor: '#ffffff', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '20px' },
  sectionLabel: { fontSize: '12px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#495057', marginBottom: '16px' },
  itemRow: { display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #e9ecef' },
  itemImage: { width: '52px', height: '52px', borderRadius: '6px', objectFit: 'cover', backgroundColor: '#f8f9fa' },
  itemName: { fontSize: '14px', fontWeight: '600', color: '#212529', margin: '0 0 2px 0' },
  checkboxRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '400', letterSpacing: '0.02em', color: '#495057', marginBottom: '4px' },
  select: { display: 'block', width: '100%', padding: '12px', fontSize: '16px', color: '#212529', backgroundColor: '#ffffff', border: '1px solid #868e96', borderRadius: '6px', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" },
  textarea: { display: 'block', width: '100%', padding: '12px', fontSize: '16px', color: '#212529', backgroundColor: '#ffffff', border: '1px solid #868e96', borderRadius: '6px', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", minHeight: '100px', resize: 'vertical' },
  selectError: { borderColor: '#f03e3e' },
  errorText: { color: '#f03e3e', fontSize: '12px', marginTop: '4px' },
  btnPrimary: { backgroundColor: '#4c6ef5', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", minHeight: '44px' },
  errorBanner: { backgroundColor: '#ffe3e3', border: '1px solid #f03e3e', borderRadius: '6px', padding: '12px 16px', color: '#f03e3e', fontSize: '14px', marginBottom: '16px' },
  successPanel: { textAlign: 'center', padding: '48px 24px', backgroundColor: '#ffffff', borderRadius: '10px' },
  skeleton: { backgroundColor: '#e9ecef', borderRadius: '6px' },
};

const RETURN_REASONS = [
  'Defective or damaged item',
  'Wrong item received',
  'Item not as described',
  'No longer needed',
  'Size or fit issue',
  'Other',
];

export default function ReturnRequest() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    fetch(`/api/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load order');
        return res.json();
      })
      .then((data) => {
        const o = data.order || data;
        setOrder(o);
        const initSelected = {};
        const items = o.items || o.order_items || [];
        items.forEach((item) => { initSelected[item.id] = false; });
        setSelectedItems(initSelected);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, navigate]);

  const toggleItem = (itemId) => {
    setSelectedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
    setFieldErrors((prev) => ({ ...prev, items: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    const chosen = Object.keys(selectedItems).filter((k) => selectedItems[k]);
    if (chosen.length === 0) errors.items = 'Please select at least one item to return.';
    if (!reason) errors.reason = 'Please select a reason for the return.';
    if (Object.keys(errors).length) { setFieldErrors(errors); return; }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${id}/return-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ item_ids: chosen, reason, notes }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to submit return request');
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ ...styles.skeleton, height: '14px', width: '120px', marginBottom: '16px' }} />
          <div style={{ ...styles.skeleton, height: '40px', width: '260px', marginBottom: '24px' }} />
          <div style={{ ...styles.skeleton, height: '300px' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorBanner}>
            {error} <Link to={`/account/orders/${id}`} style={{ color: '#f03e3e' }}>← Back to order</Link>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.successPanel}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#212529', margin: '0 0 8px 0' }}>Return request submitted</h2>
            <p style={{ fontSize: '14px', color: '#495057', marginBottom: '24px' }}>Our team will review your request within 1–2 business days.</p>
            <Link to={`/account/orders/${id}`} style={{ color: '#4c6ef5', fontSize: '14px' }}>← Back to order detail</Link>
          </div>
        </div>
      </div>
    );
  }

  const items = order?.items || order?.order_items || [];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to={`/account/orders/${id}`} style={styles.backLink}>← Back to order detail</Link>
        <h1 style={styles.pageTitle}>Return request</h1>
        <p style={{ ...styles.muted, marginBottom: '24px' }}>Order #{id}</p>

        {submitError && <div style={styles.errorBanner}>{submitError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Item selection */}
          <div style={styles.card}>
            <div style={styles.sectionLabel}>Select items to return</div>
            {fieldErrors.items && <p style={styles.errorText}>{fieldErrors.items}</p>}
            {items.map((item, idx) => (
              <div key={item.id || idx} style={{ ...styles.itemRow, ...(idx === items.length - 1 ? { borderBottom: 'none' } : {}) }}>
                <input
                  type="checkbox"
                  id={`item-${item.id}`}
                  checked={selectedItems[item.id] || false}
                  onChange={() => toggleItem(item.id)}
                  style={{ width: '16px', height: '16px', flexShrink: 0 }}
                />
                <img
                  src={item.image_url || '/src/assets/images/placeholder-product.svg'}
                  alt={item.product_name || item.name || 'Product'}
                  style={styles.itemImage}
                />
                <label htmlFor={`item-${item.id}`} style={{ flex: 1, cursor: 'pointer' }}>
                  <p style={styles.itemName}>{item.product_name || item.name}</p>
                  {item.sku_attributes && <p style={styles.muted}>{Object.entries(item.sku_attributes).map(([k, v]) => `${k}: ${v}`).join(', ')}</p>}
                  <p style={styles.muted}>Qty: {item.quantity}</p>
                </label>
              </div>
            ))}
          </div>

          {/* Reason */}
          <div style={styles.card}>
            <div style={styles.sectionLabel}>Return reason</div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="reason">Reason for return</label>
              <select
                id="reason"
                style={{ ...styles.select, ...(fieldErrors.reason ? styles.selectError : {}) }}
                value={reason}
                onChange={(e) => { setReason(e.target.value); setFieldErrors((prev) => ({ ...prev, reason: undefined })); }}
              >
                <option value="">Select a reason…</option>
                {RETURN_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              {fieldErrors.reason && <p style={styles.errorText}>{fieldErrors.reason}</p>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="notes">Additional notes (optional)</label>
              <textarea
                id="notes"
                style={styles.textarea}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe the issue in more detail…"
              />
            </div>
          </div>

          <button type="submit" style={styles.btnPrimary} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit return request'}
          </button>
        </form>
      </div>
    </div>
  );
}
