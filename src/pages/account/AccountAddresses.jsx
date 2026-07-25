import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    maxWidth: '720px',
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
  btnPrimary: {
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '44px',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  addressText: {
    fontSize: '16px',
    color: '#212529',
    lineHeight: '1.5',
    margin: 0,
  },
  muted: {
    fontSize: '14px',
    color: '#495057',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
    marginLeft: '16px',
  },
  btnGhost: {
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px solid #4c6ef5',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '44px',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  },
  btnDanger: {
    backgroundColor: 'transparent',
    color: '#f03e3e',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '44px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    color: '#495057',
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
  defaultBadge: {
    backgroundColor: '#e8ecfd',
    color: '#4c6ef5',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '600',
    padding: '2px 10px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginLeft: '8px',
  },
};

export default function AccountAddresses() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const fetchAddresses = () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    fetch('/api/users/me/addresses', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load addresses');
        return res.json();
      })
      .then((data) => {
        setAddresses(data.addresses || data.data || data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    setDeleteError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/users/me/addresses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete address');
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ ...styles.skeleton, height: '40px', width: '200px', marginBottom: '24px' }} />
          {[1, 2].map((i) => (
            <div key={i} style={{ ...styles.skeleton, height: '100px', marginBottom: '16px' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Address Book</h1>
          <Link to="/account/addresses/new" style={styles.btnPrimary}>+ Add address</Link>
        </div>

        {error && <div style={styles.errorBanner}>{error}</div>}
        {deleteError && <div style={styles.errorBanner}>{deleteError}</div>}

        {addresses.length === 0 && !error && (
          <div style={styles.emptyState}>
            <img src="/src/assets/images/empty-state.svg" alt="" style={{ width: '80px', marginBottom: '16px' }} />
            <p style={{ fontSize: '16px', color: '#212529', fontWeight: '600' }}>No saved addresses</p>
            <p style={{ fontSize: '14px', color: '#495057' }}>Add an address for faster checkout.</p>
            <Link to="/account/addresses/new" style={{ color: '#4c6ef5', fontSize: '14px' }}>Add your first address →</Link>
          </div>
        )}

        {addresses.map((addr) => (
          <div key={addr.id} style={styles.card}>
            <div>
              <p style={styles.addressText}>
                <strong>{addr.full_name || `${addr.first_name || ''} ${addr.last_name || ''}`.trim()}</strong>
                {addr.is_default && <span style={styles.defaultBadge}>Default</span>}
              </p>
              <p style={{ ...styles.addressText, marginTop: '4px' }}>
                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}
              </p>
              <p style={{ ...styles.addressText, marginTop: '2px' }}>
                {addr.city}, {addr.state} {addr.postal_code}
              </p>
              {addr.phone && <p style={{ ...styles.muted, marginTop: '4px' }}>{addr.phone}</p>}
            </div>
            <div style={styles.actions}>
              <Link to={`/account/addresses/${addr.id}/edit`} style={styles.btnGhost}>Edit</Link>
              <button style={styles.btnDanger} onClick={() => handleDelete(addr.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
