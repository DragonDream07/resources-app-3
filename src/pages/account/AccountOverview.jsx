import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
    margin: '0 0 24px 0',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '24px',
  },
  sectionLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '8px',
  },
  h2: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 8px 0',
  },
  muted: {
    color: '#495057',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  tilesRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '24px',
  },
  tile: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    flex: '1',
    minWidth: '140px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    border: '1px solid #e9ecef',
    transition: 'box-shadow 0.15s',
  },
  tileTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
  },
  tileDesc: {
    fontSize: '14px',
    color: '#495057',
  },
  quickLinksCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '24px',
  },
  quickLinkButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    background: 'none',
    border: 'none',
    borderBottom: '1px solid #868e96',
    padding: '16px 20px',
    fontSize: '16px',
    color: '#4c6ef5',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    textAlign: 'left',
  },
  skeleton: {
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
    animation: 'shimmer 1.5s infinite',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '600',
    padding: '2px 8px',
    minWidth: '20px',
  },
};

export default function AccountOverview() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    Promise.all([
      fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/notifications', { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(async ([userRes, notifRes]) => {
        if (!userRes.ok) throw new Error('Failed to load profile');
        const userData = await userRes.json();
        setUser(userData);
        if (notifRes.ok) {
          const notifData = await notifRes.json();
          const unread = (notifData.notifications || notifData.data || []).filter(
            (n) => !n.read_at
          ).length;
          setUnreadCount(unread);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ ...styles.skeleton, height: '40px', width: '200px', marginBottom: '24px' }} />
          <div style={{ ...styles.skeleton, height: '120px', marginBottom: '24px' }} />
          <div style={{ display: 'flex', gap: '16px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ ...styles.skeleton, height: '100px', flex: 1 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div
            style={{
              backgroundColor: '#ffe3e3',
              border: '1px solid #f03e3e',
              borderRadius: '10px',
              padding: '24px',
              color: '#f03e3e',
            }}
          >
            <strong>Unable to load account overview.</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>My Account</h1>

        {/* Profile summary */}
        <div style={styles.card}>
          <div style={styles.sectionLabel}>Profile</div>
          <h2 style={styles.h2}>
            {user?.first_name} {user?.last_name}
          </h2>
          <p style={styles.muted}>{user?.email}</p>
          <p style={{ ...styles.muted, marginTop: '8px' }}>
            Save your details for faster checkout and access your full order history anytime.
          </p>
          <Link
            to="/account/profile"
            style={{
              display: 'inline-block',
              marginTop: '12px',
              color: '#4c6ef5',
              fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            Edit profile →
          </Link>
        </div>

        {/* Quick tiles */}
        <div style={styles.tilesRow}>
          <div style={styles.tile} onClick={() => navigate('/account/orders')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && navigate('/account/orders')}>
            <span style={styles.sectionLabel}>Orders</span>
            <span style={styles.tileTitle}>Order History</span>
            <span style={styles.tileDesc}>Track your orders and view order history</span>
          </div>

          <div style={styles.tile} onClick={() => navigate('/account/addresses')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && navigate('/account/addresses')}>
            <span style={styles.sectionLabel}>Addresses</span>
            <span style={styles.tileTitle}>Address Book</span>
            <span style={styles.tileDesc}>Manage your saved addresses</span>
          </div>

          <div style={styles.tile} onClick={() => navigate('/account/notifications')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && navigate('/account/notifications')}>
            <span style={styles.sectionLabel}>Notifications</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={styles.tileTitle}>Notifications</span>
              {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
            </div>
            <p style={{ ...styles.muted, fontSize: '14px', margin: 0 }}>Unread notifications</p>
          </div>
        </div>

        {/* Quick links */}
        <div style={styles.quickLinksCard}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e9ecef' }}>
            <span style={styles.sectionLabel}>Quick Links</span>
          </div>
          <button style={styles.quickLinkButton} onClick={() => navigate('/account/orders')}>
            Order history
          </button>
          <button style={styles.quickLinkButton} onClick={() => navigate('/account/addresses')}>
            Manage addresses
          </button>
          <button style={styles.quickLinkButton} onClick={() => navigate('/account/profile')}>
            Edit profile
          </button>
          <button
            style={{ ...styles.quickLinkButton, borderBottom: 'none' }}
            onClick={() => navigate('/account/notifications')}
          >
            Notifications
          </button>
        </div>
      </div>
    </div>
  );
}
