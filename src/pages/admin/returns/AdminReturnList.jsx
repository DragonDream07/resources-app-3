import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const STATUS_COLORS = {
  pending: { bg: '#fff4e6', text: '#fd7e14', label: 'Pending' },
  approved: { bg: '#d3f9d8', text: '#37b24d', label: 'Approved' },
  rejected: { bg: '#ffe3e3', text: '#f03e3e', label: 'Rejected' },
  completed: { bg: '#e8ecfd', text: '#4c6ef5', label: 'Completed' },
};

function StatusBadge({ status }) {
  const config = STATUS_COLORS[status] || { bg: '#e9ecef', text: '#495057', label: status };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '9999px',
        backgroundColor: config.bg,
        color: config.text,
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        lineHeight: '16px',
      }}
    >
      {config.label}
    </span>
  );
}

export default function AdminReturnList() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const fetchReturns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page, limit });
      if (statusFilter) params.set('status', statusFilter);
      const token = localStorage.getItem('token');
      const res = await fetch(`/return-requests?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load return requests.');
      const data = await res.json();
      setReturns(data.data || data.returnRequests || []);
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  function handleStatusFilter(e) {
    setStatusFilter(e.target.value);
    setPage(1);
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        color: '#212529',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '700',
                letterSpacing: '-0.01em',
                lineHeight: '32px',
                margin: '0 0 4px',
              }}
            >
              Return Requests
            </h1>
            <p style={{ fontSize: '14px', color: '#495057', margin: 0 }}>
              Review and action customer return requests
            </p>
          </div>
        </div>

        {/* Filters */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #868e96',
            borderRadius: '10px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <label
            htmlFor="status-filter"
            style={{ fontSize: '14px', fontWeight: '600', color: '#212529' }}
          >
            Status:
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusFilter}
            style={{
              padding: '8px 12px',
              border: '1px solid #868e96',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#212529',
              backgroundColor: '#ffffff',
              minWidth: '160px',
              minHeight: '44px',
            }}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              backgroundColor: '#ffe3e3',
              border: '1px solid #f03e3e',
              borderRadius: '6px',
              padding: '12px 16px',
              color: '#f03e3e',
              marginBottom: '20px',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        {/* Table */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #868e96',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <div
              style={{
                padding: '48px',
                textAlign: 'center',
                color: '#495057',
                fontSize: '16px',
              }}
            >
              Loading return requests…
            </div>
          ) : returns.length === 0 ? (
            <div
              style={{
                padding: '64px 24px',
                textAlign: 'center',
                color: '#495057',
              }}
            >
              <img
                src="/src/assets/images/empty-state.svg"
                alt=""
                style={{ width: '80px', marginBottom: '16px', opacity: 0.5 }}
              />
              <p style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px' }}>
                No return requests found
              </p>
              <p style={{ fontSize: '14px', color: '#868e96', margin: 0 }}>
                {statusFilter ? 'Try changing the status filter.' : 'No return requests have been submitted yet.'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px',
                }}
              >
                <thead>
                  <tr style={{ borderBottom: '1px solid #868e96', backgroundColor: '#f8f9fa' }}>
                    {['Request ID', 'Order ID', 'Customer', 'Reason', 'Status', 'Requested', 'Action'].map(
                      (col) => (
                        <th
                          key={col}
                          style={{
                            padding: '12px 16px',
                            textAlign: 'left',
                            fontSize: '12px',
                            fontWeight: '600',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: '#495057',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {returns.map((req, idx) => (
                    <tr
                      key={req.id}
                      style={{
                        borderBottom: idx < returns.length - 1 ? '1px solid #e9ecef' : 'none',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                    >
                      <td
                        style={{
                          padding: '14px 16px',
                          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                          fontSize: '13px',
                          color: '#212529',
                        }}
                      >
                        #{req.id}
                      </td>
                      <td
                        style={{
                          padding: '14px 16px',
                          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                          fontSize: '13px',
                          color: '#4c6ef5',
                        }}
                      >
                        <Link
                          to={`/admin/orders/${req.orderId}`}
                          style={{ color: '#4c6ef5', textDecoration: 'none' }}
                        >
                          #{req.orderId}
                        </Link>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#343a40' }}>
                        {req.customerName || req.user?.name || '—'}
                      </td>
                      <td
                        style={{
                          padding: '14px 16px',
                          color: '#495057',
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {req.reason || '—'}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <StatusBadge status={req.status} />
                      </td>
                      <td style={{ padding: '14px 16px', color: '#495057', whiteSpace: 'nowrap' }}>
                        {req.createdAt
                          ? new Date(req.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <Link
                          to={`/admin/returns/${req.id}`}
                          style={{
                            display: 'inline-block',
                            padding: '6px 14px',
                            backgroundColor: '#4c6ef5',
                            color: '#ffffff',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontSize: '13px',
                            fontWeight: '500',
                            minHeight: '32px',
                            lineHeight: '20px',
                          }}
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginTop: '24px',
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: '8px 16px',
                border: '1px solid #868e96',
                borderRadius: '6px',
                backgroundColor: page === 1 ? '#e9ecef' : '#ffffff',
                color: page === 1 ? '#adb5bd' : '#212529',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                minHeight: '44px',
              }}
            >
              Previous
            </button>
            <span style={{ fontSize: '14px', color: '#495057' }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: '8px 16px',
                border: '1px solid #868e96',
                borderRadius: '6px',
                backgroundColor: page === totalPages ? '#e9ecef' : '#ffffff',
                color: page === totalPages ? '#adb5bd' : '#212529',
                cursor: page === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                minHeight: '44px',
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
