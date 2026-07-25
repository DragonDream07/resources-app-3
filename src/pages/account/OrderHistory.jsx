import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
    <span
      style={{
        backgroundColor: s.bg,
        color: s.color,
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        padding: '3px 10px',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        display: 'inline-block',
      }}
    >
      {status}
    </span>
  );
}

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
    margin: 0,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'inherit',
  },
  orderId: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    color: '#212529',
    fontWeight: '600',
  },
  muted: {
    fontSize: '14px',
    color: '#495057',
    marginTop: '4px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    color: '#495057',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    color: '#f03e3e',
    fontSize: '14px',
    marginBottom: '16px',
  },
  skeleton: {
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
  },
  chevron: {
    color: '#868e96',
    fontSize: '20px',
  },
  paginationRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '24px',
  },
  pageBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #868e96',
    borderRadius: '6px',
    padding: '8px 14px',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#212529',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '44px',
  },
  pageBtnActive: {
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    borderColor: '#4c6ef5',
  },
};

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = (p = 1) => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    setLoading(true);
    fetch(`/api/orders?page=${p}&limit=10`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load orders');
        return res.json();
      })
      .then((data) => {
        setOrders(data.orders || data.data || []);
        setTotalPages(data.pagination?.total_pages || data.totalPages || 1);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => { fetchOrders(page); }, [page]);

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatCurrency = (amount) => {
    if (amount == null) return '';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ ...styles.skeleton, height: '40px', width: '200px', marginBottom: '24px' }} />
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ ...styles.skeleton, height: '80px', marginBottom: '16px' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Order history</h1>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            {error}
            <button onClick={() => fetchOrders(page)} style={{ marginLeft: '12px', background: 'none', border: 'none', color: '#f03e3e', cursor: 'pointer', textDecoration: 'underline' }}>Retry</button>
          </div>
        )}

        {!error && orders.length === 0 && (
          <div style={styles.emptyState}>
            <img src="/src/assets/images/empty-state.svg" alt="" style={{ width: '80px', marginBottom: '16px' }} />
            <p style={{ fontSize: '16px', color: '#212529', fontWeight: '600' }}>No orders yet</p>
            <p style={{ fontSize: '14px', color: '#495057' }}>Your order history will appear here.</p>
            <Link to="/" style={{ color: '#4c6ef5', fontSize: '14px' }}>Start shopping →</Link>
          </div>
        )}

        {orders.map((order) => (
          <Link key={order.id} to={`/account/orders/${order.id}`} style={styles.card}>
            <div>
              <span style={styles.orderId}>#{order.id}</span>
              <p style={styles.muted}>{formatDate(order.created_at)} · {order.items_count || order.item_count || ''} item(s)</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#212529', margin: 0 }}>
                  {formatCurrency(order.total_amount || order.total)}
                </p>
                <StatusBadge status={order.status} />
              </div>
              <span style={styles.chevron}>›</span>
            </div>
          </Link>
        ))}

        {totalPages > 1 && (
          <div style={styles.paginationRow}>
            <button
              style={styles.pageBtn}
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ‹ Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                style={{ ...styles.pageBtn, ...(p === page ? styles.pageBtnActive : {}) }}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              style={styles.pageBtn}
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
