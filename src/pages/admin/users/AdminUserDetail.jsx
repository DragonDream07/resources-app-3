import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const API_BASE = '/api';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    padding: '32px 24px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  breadcrumb: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  breadcrumbLink: {
    color: '#4c6ef5',
    textDecoration: 'none',
  },
  breadcrumbSep: {
    color: '#868e96',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#212529',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    margin: '0 0 24px 0',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    padding: '24px',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '16px',
    marginTop: '0',
  },
  fieldRow: {
    display: 'grid',
    gridTemplateColumns: '160px 1fr',
    gap: '8px',
    padding: '10px 0',
    borderBottom: '1px solid #f1f3f5',
  },
  fieldLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#495057',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
  },
  fieldValue: {
    fontSize: '14px',
    color: '#343a40',
    lineHeight: '20px',
    display: 'flex',
    alignItems: 'center',
  },
  badge: (role) => {
    const map = {
      admin: { bg: '#e8ecfd', color: '#3b5bdb' },
      manager: { bg: '#fff3e6', color: '#fd7e14' },
      customer: { bg: '#d3f9d8', color: '#2f9e44' },
    };
    const colors = map[role] || { bg: '#e9ecef', color: '#495057' };
    return {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 10px',
      borderRadius: '9999px',
      backgroundColor: colors.bg,
      color: colors.color,
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      marginRight: '6px',
    };
  },
  roleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '16px',
  },
  roleCheckbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '6px',
    border: '1px solid #868e96',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#343a40',
    minHeight: '44px',
  },
  roleCheckboxActive: {
    borderColor: '#4c6ef5',
    backgroundColor: '#e8ecfd',
    color: '#3b5bdb',
  },
  saveBtn: (loading) => ({
    padding: '10px 24px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: loading ? '#adb5bd' : '#4c6ef5',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer',
    minHeight: '44px',
    transition: 'background-color 0.15s ease',
  }),
  successBox: {
    backgroundColor: '#d3f9d8',
    color: '#2f9e44',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  errorBox: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  codeText: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    color: '#343a40',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    color: '#495057',
    fontSize: '14px',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: '#4c6ef5',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
  },
};

const ALL_ROLES = ['admin', 'manager', 'customer'];

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [allRoles, setAllRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  });

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      const u = data.user || data;
      setUser(u);
      setSelectedRoles(u.roles || []);
    } catch (err) {
      setError(err.message || 'Failed to load user.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/roles`, {
        headers: authHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setAllRoles((data.roles || data || []).map((r) => (typeof r === 'string' ? r : r.name)));
      } else {
        setAllRoles(ALL_ROLES);
      }
    } catch {
      setAllRoles(ALL_ROLES);
    }
  }, []);

  useEffect(() => {
    fetchUser();
    fetchRoles();
  }, [fetchUser, fetchRoles]);

  const toggleRole = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
    setSaveSuccess(false);
    setSaveError(null);
  };

  const handleSaveRoles = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}/roles`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ roles: selectedRoles }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Error ${res.status}`);
      }
      setSaveSuccess(true);
      fetchUser();
    } catch (err) {
      setSaveError(err.message || 'Failed to save roles.');
    } finally {
      setSaving(false);
    }
  };

  const displayRoles = allRoles.length > 0 ? allRoles : ALL_ROLES;

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.emptyState}>Loading…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorBox}>{error}</div>
          <Link to="/admin/users" style={styles.backLink}>
            ← Back to Users
          </Link>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const fullName = [
    user.first_name || user.firstName || '',
    user.last_name || user.lastName || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.breadcrumb}>
          <Link to="/admin/users" style={styles.breadcrumbLink}>
            Users
          </Link>
          <span style={styles.breadcrumbSep}>/</span>
          <span>{fullName || user.email}</span>
        </div>

        <h1 style={styles.title}>{fullName || user.email}</h1>

        {/* User Information */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>User Information</h2>

          <div style={styles.fieldRow}>
            <span style={styles.fieldLabel}>User ID</span>
            <span style={{ ...styles.fieldValue, ...styles.codeText }}>{user.id}</span>
          </div>

          <div style={styles.fieldRow}>
            <span style={styles.fieldLabel}>First Name</span>
            <span style={styles.fieldValue}>
              {user.first_name || user.firstName || '—'}
            </span>
          </div>

          <div style={styles.fieldRow}>
            <span style={styles.fieldLabel}>Last Name</span>
            <span style={styles.fieldValue}>
              {user.last_name || user.lastName || '—'}
            </span>
          </div>

          <div style={styles.fieldRow}>
            <span style={styles.fieldLabel}>Email</span>
            <span style={styles.fieldValue}>{user.email}</span>
          </div>

          <div style={styles.fieldRow}>
            <span style={styles.fieldLabel}>Phone</span>
            <span style={styles.fieldValue}>
              {user.phone || user.phone_number || '—'}
            </span>
          </div>

          <div style={styles.fieldRow}>
            <span style={styles.fieldLabel}>Current Roles</span>
            <span style={styles.fieldValue}>
              {(user.roles || []).length > 0
                ? (user.roles || []).map((r) => (
                    <span key={r} style={styles.badge(r)}>
                      {r}
                    </span>
                  ))
                : <span style={{ color: '#868e96' }}>No roles assigned</span>}
            </span>
          </div>

          <div style={{ ...styles.fieldRow, borderBottom: 'none' }}>
            <span style={styles.fieldLabel}>Joined</span>
            <span style={styles.fieldValue}>
              {user.created_at
                ? new Date(user.created_at).toLocaleString()
                : '—'}
            </span>
          </div>
        </div>

        {/* Role Assignment */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Role Assignment</h2>

          {saveSuccess && (
            <div style={styles.successBox}>Roles updated successfully.</div>
          )}
          {saveError && (
            <div style={styles.errorBox}>{saveError}</div>
          )}

          <div style={styles.roleRow}>
            {displayRoles.map((role) => {
              const active = selectedRoles.includes(role);
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  style={{
                    ...styles.roleCheckbox,
                    ...(active ? styles.roleCheckboxActive : {}),
                  }}
                  aria-pressed={active}
                >
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      border: `2px solid ${active ? '#4c6ef5' : '#868e96'}`,
                      borderRadius: '3px',
                      backgroundColor: active ? '#4c6ef5' : '#ffffff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {active && (
                      <span
                        style={{
                          color: '#ffffff',
                          fontSize: '10px',
                          fontWeight: '700',
                          lineHeight: 1,
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </span>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              type="button"
              style={styles.saveBtn(saving)}
              disabled={saving}
              onClick={handleSaveRoles}
            >
              {saving ? 'Saving…' : 'Save Roles'}
            </button>
            <Link
              to="/admin/users"
              style={{
                fontSize: '14px',
                color: '#495057',
                textDecoration: 'none',
              }}
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
