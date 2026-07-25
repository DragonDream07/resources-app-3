import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const API_BASE = '/api';

const ROLES = ['all', 'admin', 'customer', 'manager'];

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    padding: '32px 24px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
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
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#212529',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    margin: 0,
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#495057',
  },
  filterButton: (active) => ({
    padding: '8px 16px',
    borderRadius: '6px',
    border: active ? '1px solid #4c6ef5' : '1px solid #868e96',
    backgroundColor: active ? '#e8ecfd' : '#ffffff',
    color: active ? '#3b5bdb' : '#343a40',
    fontSize: '14px',
    fontWeight: active ? '600' : '400',
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'all 0.15s ease',
  }),
  searchInput: {
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1px solid #868e96',
    fontSize: '14px',
    color: '#212529',
    backgroundColor: '#ffffff',
    minHeight: '44px',
    width: '260px',
    outline: 'none',
    marginLeft: 'auto',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    backgroundColor: '#f8f9fa',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#495057',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    borderBottom: '1px solid #e9ecef',
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#343a40',
    borderBottom: '1px solid #e9ecef',
    lineHeight: '20px',
  },
  trHover: {
    transition: 'background-color 0.1s ease',
  },
  badge: (role) => {
    const map = {
      admin: { bg: '#e8ecfd', color: '#3b5bdb' },
      manager: { bg: '#fff3e6', color: '#fd7e14' },
      customer: { bg: '#d3f9d8', color: '#2f9e44' },
    };
    const colors = map[role] || { bg: '#e9ecef', color: '#495057' };
    return {
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '9999px',
      backgroundColor: colors.bg,
      color: colors.color,
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
    };
  },
  linkCell: {
    color: '#4c6ef5',
    textDecoration: 'none',
    fontWeight: '500',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    color: '#495057',
    fontSize: '14px',
  },
  errorBox: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '20px',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '8px',
    padding: '16px',
    borderTop: '1px solid #e9ecef',
  },
  pageBtn: (disabled) => ({
    padding: '8px 14px',
    borderRadius: '6px',
    border: '1px solid #868e96',
    backgroundColor: disabled ? '#e9ecef' : '#ffffff',
    color: disabled ? '#adb5bd' : '#343a40',
    fontSize: '14px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    minHeight: '44px',
  }),
  pageInfo: {
    fontSize: '14px',
    color: '#495057',
  },
};

export default function AdminUserList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const roleFilter = searchParams.get('role') || 'all';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 20;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (roleFilter !== 'all') params.set('role', roleFilter);
      if (search) params.set('search', search);
      params.set('page', String(page));
      params.set('limit', String(limit));

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setUsers(data.users || data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [roleFilter, search, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    next.set(key, value);
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleSearchChange = (e) => {
    setParam('search', e.target.value);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Users</h1>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.filterBar}>
          <span style={styles.filterLabel}>Role:</span>
          {ROLES.map((role) => (
            <button
              key={role}
              style={styles.filterButton(roleFilter === role)}
              onClick={() => setParam('role', role)}
              type="button"
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
          <input
            type="text"
            placeholder="Search by name or email…"
            style={styles.searchInput}
            value={search}
            onChange={handleSearchChange}
            aria-label="Search users"
          />
        </div>

        <div style={styles.card}>
          {loading ? (
            <div style={styles.emptyState}>Loading…</div>
          ) : users.length === 0 ? (
            <div style={styles.emptyState}>No users found.</div>
          ) : (
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role(s)</th>
                  <th style={styles.th}>Joined</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    style={styles.trHover}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={styles.td}>
                      {user.first_name || user.firstName || ''}{' '}
                      {user.last_name || user.lastName || ''}
                    </td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>
                      {(user.roles || []).length > 0
                        ? (user.roles || []).map((r) => (
                            <span key={r} style={{ ...styles.badge(r), marginRight: '4px' }}>
                              {r}
                            </span>
                          ))
                        : <span style={styles.badge('customer')}>customer</span>
                      }
                    </td>
                    <td style={styles.td}>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td style={styles.td}>
                      <Link to={`/admin/users/${user.id}`} style={styles.linkCell}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && users.length > 0 && (
            <div style={styles.pagination}>
              <button
                type="button"
                style={styles.pageBtn(page <= 1)}
                disabled={page <= 1}
                onClick={() => setParam('page', String(page - 1))}
              >
                Previous
              </button>
              <span style={styles.pageInfo}>
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                style={styles.pageBtn(page >= totalPages)}
                disabled={page >= totalPages}
                onClick={() => setParam('page', String(page + 1))}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
