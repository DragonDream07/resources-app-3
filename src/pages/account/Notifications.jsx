import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const styles = {
  page: { backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" },
  container: { maxWidth: '720px', margin: '0 auto', padding: '32px 16px' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' },
  pageTitle: { fontSize: '32px', fontWeight: '700', letterSpacing: '-0.02em', lineHeight: '40px', color: '#212529', margin: 0 },
  btnGhost: { backgroundColor: 'transparent', color: '#4c6ef5', border: '1px solid #4c6ef5', borderRadius: '10px', padding: '8px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", minHeight: '44px' },
  notifCard: { backgroundColor: '#ffffff', borderRadius: '10px', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer', border: '1px solid transparent', transition: 'border-color 0.15s' },
  notifCardUnread: { borderColor: '#4c6ef5', backgroundColor: '#f7f9ff' },
  notifDot: { width: '10px', height: '10px', borderRadius: '9999px', backgroundColor: '#4c6ef5', flexShrink: 0, marginTop: '6px' },
  notifDotRead: { backgroundColor: 'transparent', border: '2px solid #e9ecef' },
  notifTitle: { fontSize: '14px', fontWeight: '600', color: '#212529', margin: '0 0 4px 0' },
  notifBody: { fontSize: '16px', color: '#212529', lineHeight: '1.625', margin: '0 0 6px 0' },
  notifDate: { fontSize: '12px', color: '#495057' },
  emptyState: { textAlign: 'center', padding: '64px 24px', color: '#495057' },
  errorBanner: { backgroundColor: '#ffe3e3', border: '1px solid #f03e3e', borderRadius: '6px', padding: '12px 16px', color: '#f03e3e', fontSize: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' },
  successBanner: { backgroundColor: '#d3f9d8', border: '1px solid #37b24d', borderRadius: '6px', padding: '12px 16px', color: '#37b24d', fontSize: '14px', marginBottom: '16px' },
  skeleton: { backgroundColor: '#e9ecef', borderRadius: '6px' },
  retryBtn: { background: 'none', border: 'none', color: '#f03e3e', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", padding: 0 },
  typeTag: { fontSize: '12px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#495057' },
};

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markAllSuccess, setMarkAllSuccess] = useState(false);
  const [markAllError, setMarkAllError] = useState(null);

  const fetchNotifications = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    setLoading(true);
    setError(null);
    fetch('/api/notifications', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error('Unable to load notifications. Please try again.');
        return res.json();
      })
      .then((data) => {
        setNotifications(data.notifications || data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [navigate]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const handleMarkRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      setNotifications((prev) =>
        prev.map((n) => n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n)
      );
    } catch {
      // silently ignore individual mark-read failures
    }
  };

  const handleMarkAllRead = async () => {
    setMarkAllSuccess(false);
    setMarkAllError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/notifications/read-all', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to mark all as read');
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
      );
      setMarkAllSuccess(true);
    } catch (err) {
      setMarkAllError(err.message);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ ...styles.skeleton, height: '40px', width: '200px', marginBottom: '24px' }} />
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ ...styles.skeleton, height: '80px', marginBottom: '12px' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={styles.pageTitle}>Notifications</h1>
            {unreadCount > 0 && (
              <span style={{ backgroundColor: '#4c6ef5', color: '#ffffff', borderRadius: '9999px', fontSize: '12px', fontWeight: '600', padding: '2px 8px', minWidth: '20px', textAlign: 'center' }}>
                {unreadCount}
              </span>
            )}
          </div>
          <button style={styles.btnGhost} onClick={handleMarkAllRead} disabled={unreadCount === 0}>
            Mark all as read
          </button>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <span>⚠ {error}</span>
            <button style={styles.retryBtn} onClick={fetchNotifications}>Retry</button>
          </div>
        )}

        {markAllSuccess && <div style={styles.successBanner}>All notifications marked as read</div>}
        {markAllError && <div style={{ ...styles.errorBanner, justifyContent: 'flex-start' }}>{markAllError}</div>}

        {!error && notifications.length === 0 && (
          <div style={styles.emptyState}>
            <img src="/src/assets/icons/bell.svg" alt="" style={{ width: '48px', marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#212529', marginBottom: '8px' }}>You're all caught up — no notifications yet</p>
            <Link to="/" style={{ color: '#4c6ef5', fontSize: '14px' }}>Browse products</Link>
          </div>
        )}

        {notifications.map((notif) => {
          const isUnread = !notif.read_at;
          return (
            <div
              key={notif.id}
              style={{ ...styles.notifCard, ...(isUnread ? styles.notifCardUnread : {}) }}
              onClick={() => { if (isUnread) handleMarkRead(notif.id); }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' && isUnread) handleMarkRead(notif.id); }}
              aria-label={isUnread ? `Unread notification: ${notif.title || notif.type}` : `Notification: ${notif.title || notif.type}`}
            >
              <div style={{ ...styles.notifDot, ...(isUnread ? {} : styles.notifDotRead) }} />
              <div style={{ flex: 1 }}>
                {(notif.title || notif.type) && (
                  <p style={styles.notifTitle}>{notif.title || notif.type}</p>
                )}
                <p style={styles.notifBody}>{notif.message || notif.body}</p>
                <p style={styles.notifDate}>{formatDate(notif.created_at)}</p>
              </div>
              {isUnread && (
                <button
                  style={{ background: 'none', border: 'none', color: '#4c6ef5', fontSize: '12px', cursor: 'pointer', padding: '4px', flexShrink: 0 }}
                  onClick={(e) => { e.stopPropagation(); handleMarkRead(notif.id); }}
                  aria-label="Mark as read"
                >
                  Mark read
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
