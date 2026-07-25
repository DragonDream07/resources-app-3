import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const STATUS_OPTIONS = [
  { value: '', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'return_requested', label: 'Return Requested' },
  { value: 'returned', label: 'Returned' },
];

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

function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || { bg: '#e9ecef', text: '#495057' };
  return (
    <span
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        padding: '2px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {status ? status.replace(/_/g, ' ') : 'unknown'}
    </span>
  );
}

export default function AdminOrderList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const activeStatus = searchParams.get('status') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (activeStatus) params.set('status', activeStatus);
      if (searchQuery) params.set('q', searchQuery);
      params.set('page', String(currentPage));
      params.set('limit', '20');

      const res = await fetch(`/orders?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data.data || data.orders || []);
      if (data.pagination) setPagination(data.pagination);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching orders.');
    } finally {
      setLoading(false);
    }
  }, [activeStatus, currentPage, searchQuery]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  function handleStatusFilter(status) {
    const next = new URLSearchParams(searchParams);
    if (status) next.set('status', status);
    else next.delete('status');
    next.set('page', '1');
    setSearchParams(next);
  }

  function handleSearch(e) {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchQuery) next.set('q', searchQuery);
    else next.delete('q');
    next.set('page', '1');
    setSearchParams(next);
  }

  function handlePage(page) {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(page));
    setSearchParams(next);
  }

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
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '16px',
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#212529',
      letterSpacing: '-0.01em',
      lineHeight: '32px',
      margin: 0,
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      border: '1px solid #868e96',
      overflow: 'hidden',
    },
    filtersRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '16px 24px',
      borderBottom: '1px solid #868e96',
      flexWrap: 'wrap',
    },
    filterBtn: (active) => ({
      padding: '6px 14px',
      borderRadius: '9999px',
      border: active ? '2px solid #4c6ef5' : '1px solid #868e96',
      backgroundColor: active ? '#e8ecfd' : '#ffffff',
      color: active ? '#4c6ef5' : '#495057',
      fontSize: '14px',
      fontWeight: active ? '600' : '400',
      cursor: 'pointer',
      transition: 'all 0.15s',
      minHeight: '44px',
      outline: 'none',
    }),
    searchForm: {
      display: 'flex',
      gap: '8px',
      padding: '16px 24px',
      borderBottom: '1px solid #868e96',
    },
    searchInput: {
      flex: 1,
      padding: '10px 14px',
      borderRadius: '6px',
      border: '1px solid #868e96',
      fontSize: '16px',
      color: '#212529',
      outline: 'none',
      minHeight: '44px',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    },
    searchBtn: {
      padding: '10px 20px',
      borderRadius: '6px',
      backgroundColor: '#4c6ef5',
      color: '#ffffff',
      border: 'none',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      minHeight: '44px',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '12px 24px',
      backgroundColor: '#f8f9fa',
      color: '#495057',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      textAlign: 'left',
      borderBottom: '1px solid #868e96',
    },
    td: {
      padding: '14px 24px',
      color: '#343a40',
      fontSize: '14px',
      borderBottom: '1px solid #e9ecef',
      verticalAlign: 'middle',
    },
    orderId: {
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      fontSize: '14px',
      color: '#4c6ef5',
      textDecoration: 'none',
      fontWeight: '500',
    },
    trHover: {
      backgroundColor: '#f8f9fa',
    },
    emptyState: {
      textAlign: 'center',
      padding: '64px 24px',
      color: '#495057',
    },
    emptyImg: {
      width: '80px',
      height: '80px',
      marginBottom: '16px',
      opacity: 0.5,
    },
    paginationRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      borderTop: '1px solid #e9ecef',
      flexWrap: 'wrap',
      gap: '12px',
    },
    pageBtn: (disabled) => ({
      padding: '8px 14px',
      borderRadius: '6px',
      border: '1px solid #868e96',
      backgroundColor: disabled ? '#e9ecef' : '#ffffff',
      color: disabled ? '#adb5bd' : '#343a40',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: '14px',
      minHeight: '44px',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    }),
    pageInfo: {
      fontSize: '14px',
      color: '#495057',
    },
    errorBanner: {
      backgroundColor: '#ffe3e3',
      color: '#f03e3e',
      padding: '12px 16px',
      borderRadius: '6px',
      marginBottom: '16px',
      fontSize: '14px',
    },
    loadingText: {
      textAlign: 'center',
      padding: '64px',
      color: '#495057',
      fontSize: '16px',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Orders</h1>
        </div>

        {error && <div style={styles.errorBanner}>{error}</div>}

        <div style={styles.card}>
          {/* Status Filters */}
          <div style={styles.filtersRow}>
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                style={styles.filterBtn(activeStatus === opt.value)}
                onClick={() => handleStatusFilter(opt.value)}
                aria-pressed={activeStatus === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <form style={styles.searchForm} onSubmit={handleSearch}>
            <input
              style={styles.searchInput}
              type="search"
              placeholder="Search by order ID or customer email…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search orders"
            />
            <button type="submit" style={styles.searchBtn}>
              Search
            </button>
          </form>

          {/* Table */}
          {loading ? (
            <div style={styles.loadingText}>Loading orders…</div>
          ) : orders.length === 0 ? (
            <div style={styles.emptyState}>
              <img
                src="/src/assets/images/empty-state.svg"
                alt="No orders"
                style={styles.emptyImg}
              />
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#212529', margin: '0 0 8px' }}>
                No orders found
              </p>
              <p style={{ fontSize: '14px', color: '#495057', margin: 0 }}>
                Try adjusting your filters or search query.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Order ID</th>
                    <th style={styles.th}>Customer</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Items</th>
                    <th style={styles.th}>Total</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                    >
                      <td style={styles.td}>
                        <Link to={`/admin/orders/${order.id}`} style={styles.orderId}>
                          #{order.id}
                        </Link>
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontWeight: '500', color: '#212529' }}>
                          {order.user?.name || order.guestName || '—'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#495057' }}>
                          {order.user?.email || order.guestEmail || ''}
                        </div>
                      </td>
                      <td style={styles.td}>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td style={styles.td}>
                        {Array.isArray(order.items) ? order.items.length : order.itemCount ?? '—'}
                      </td>
                      <td style={styles.td}>
                        ₹{order.totalAmount != null ? Number(order.totalAmount).toLocaleString('en-IN') : '—'}
                      </td>
                      <td style={styles.td}>
                        <StatusBadge status={order.status} />
                      </td>
                      <td style={styles.td}>
                        <Link
                          to={`/admin/orders/${order.id}`}
                          style={{
                            color: '#4c6ef5',
                            fontSize: '14px',
                            fontWeight: '500',
                            textDecoration: 'none',
                          }}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div style={styles.paginationRow}>
              <span style={styles.pageInfo}>
                Page {pagination.page} of {pagination.totalPages} &mdash; {pagination.total} orders
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  style={styles.pageBtn(currentPage <= 1)}
                  disabled={currentPage <= 1}
                  onClick={() => handlePage(currentPage - 1)}
                >
                  ← Previous
                </button>
                <button
                  style={styles.pageBtn(currentPage >= pagination.totalPages)}
                  disabled={currentPage >= pagination.totalPages}
                  onClick={() => handlePage(currentPage + 1)}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
