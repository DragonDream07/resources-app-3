import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
    margin: '0',
  },
  reportsLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '10px 20px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '20px',
    transition: 'background-color 0.15s ease',
    minHeight: '44px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    letterSpacing: '0em',
    lineHeight: '28px',
    color: '#212529',
    marginBottom: '16px',
    marginTop: '0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  statLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    lineHeight: '16px',
    textTransform: 'uppercase',
    color: '#495057',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
  },
  statSubtext: {
    fontSize: '12px',
    fontWeight: '400',
    letterSpacing: '0.02em',
    lineHeight: '16px',
    color: '#495057',
  },
  statAccent: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    lineHeight: '16px',
    textTransform: 'uppercase',
    padding: '2px 8px',
    borderRadius: '9999px',
  },
  tilesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  tile: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    textDecoration: 'none',
    color: '#212529',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'box-shadow 0.15s ease, transform 0.15s ease',
    border: '1px solid transparent',
  },
  tileIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileTitle: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    color: '#212529',
    margin: '0',
  },
  tileDesc: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: '#495057',
    margin: '0',
  },
  recentSection: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '40px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    textAlign: 'left',
    padding: '8px 12px',
    borderBottom: '2px solid #e9ecef',
  },
  td: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: '#343a40',
    padding: '12px',
    borderBottom: '1px solid #e9ecef',
    verticalAlign: 'middle',
  },
  badge: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    lineHeight: '16px',
    padding: '2px 8px',
    borderRadius: '9999px',
  },
  orderId: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    lineHeight: '20px',
  },
  loadingBar: {
    backgroundColor: '#e9ecef',
    borderRadius: '9999px',
    height: '8px',
    overflow: 'hidden',
    marginTop: '4px',
  },
  loadingBarFill: {
    height: '100%',
    borderRadius: '9999px',
    backgroundColor: '#4c6ef5',
  },
  errorBox: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '10px',
    padding: '16px',
    marginBottom: '24px',
    fontSize: '14px',
  },
};

const STATUS_COLORS = {
  pending: { bg: '#fff4e6', color: '#fd7e14' },
  processing: { bg: '#e8ecfd', color: '#4c6ef5' },
  shipped: { bg: '#e8ecfd', color: '#4c6ef5' },
  delivered: { bg: '#d3f9d8', color: '#37b24d' },
  cancelled: { bg: '#ffe3e3', color: '#f03e3e' },
  returned: { bg: '#ffe3e3', color: '#f03e3e' },
  refunded: { bg: '#fff4e6', color: '#fd7e14' },
};

function getStatusStyle(status) {
  const s = STATUS_COLORS[status?.toLowerCase()] || { bg: '#e9ecef', color: '#495057' };
  return { backgroundColor: s.bg, color: s.color };
}

const QUICK_TILES = [
  {
    title: 'Manage Orders',
    desc: 'View and process all customer orders',
    href: '/admin/orders',
    iconBg: '#e8ecfd',
    iconColor: '#4c6ef5',
    icon: '📦',
  },
  {
    title: 'Products',
    desc: 'Add, edit, or remove products and SKUs',
    href: '/admin/products',
    iconBg: '#d3f9d8',
    iconColor: '#37b24d',
    icon: '🛒',
  },
  {
    title: 'Categories',
    desc: 'Manage product categories and hierarchy',
    href: '/admin/categories',
    iconBg: '#fff3e6',
    iconColor: '#fd7e14',
    icon: '🗂️',
  },
  {
    title: 'Returns',
    desc: 'Review and process return requests',
    href: '/admin/returns',
    iconBg: '#ffe3e3',
    iconColor: '#f03e3e',
    icon: '↩️',
  },
  {
    title: 'Promo Codes',
    desc: 'Create and manage promotional codes',
    href: '/admin/promos',
    iconBg: '#fff3e6',
    iconColor: '#fd7e14',
    icon: '🎫',
  },
  {
    title: 'Reports',
    desc: 'Consolidated business reports and metrics',
    href: '/admin/reports',
    iconBg: '#e8ecfd',
    iconColor: '#4c6ef5',
    icon: '📊',
  },
];

const MOCK_STATS = [
  { label: 'Total Orders', value: '1,284', subtext: 'All time', accentText: '+12%', accentStyle: { backgroundColor: '#d3f9d8', color: '#37b24d' } },
  { label: 'Revenue', value: '₹4.2L', subtext: 'This month', accentText: '+8%', accentStyle: { backgroundColor: '#d3f9d8', color: '#37b24d' } },
  { label: 'Active Users', value: '342', subtext: 'Last 30 days', accentText: '+5%', accentStyle: { backgroundColor: '#d3f9d8', color: '#37b24d' } },
  { label: 'Pending Orders', value: '27', subtext: 'Awaiting action', accentText: 'Action needed', accentStyle: { backgroundColor: '#fff4e6', color: '#fd7e14' } },
  { label: 'Open Returns', value: '9', subtext: 'Pending review', accentText: 'Review now', accentStyle: { backgroundColor: '#ffe3e3', color: '#f03e3e' } },
  { label: 'Products', value: '186', subtext: 'In catalogue', accentText: 'Active', accentStyle: { backgroundColor: '#d3f9d8', color: '#37b24d' } },
];

const MOCK_RECENT_ORDERS = [
  { orderId: 'ORD-20240001', customer: 'Priya Sharma', amount: '₹1,299', status: 'delivered', date: '2024-01-15' },
  { orderId: 'ORD-20240002', customer: 'Rahul Verma', amount: '₹2,850', status: 'processing', date: '2024-01-15' },
  { orderId: 'ORD-20240003', customer: 'Anjali Singh', amount: '₹699', status: 'pending', date: '2024-01-14' },
  { orderId: 'ORD-20240004', customer: 'Mohammed Ali', amount: '₹4,199', status: 'shipped', date: '2024-01-14' },
  { orderId: 'ORD-20240005', customer: 'Deepika Nair', amount: '₹899', status: 'cancelled', date: '2024-01-13' },
];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats] = useState(MOCK_STATS);
  const [recentOrders] = useState(MOCK_RECENT_ORDERS);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleTileHover = (e, enter) => {
    if (enter) {
      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.borderColor = '#4c6ef5';
    } else {
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = 'transparent';
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 className="page-title" style={styles.pageTitle}>Admin Dashboard</h1>
          <Link
            to="/admin/reports"
            style={styles.reportsLink}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3b5bdb')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#4c6ef5')}
          >
            View Reports
          </Link>
        </header>

        {error && (
          <div style={styles.errorBox} role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div>
            <h2 style={styles.sectionTitle}>Overview</h2>
            <div style={styles.statsGrid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={styles.statCard}>
                  <div style={{ ...styles.loadingBar, width: '60%' }}>
                    <div style={{ ...styles.loadingBarFill, width: '100%', animation: 'pulse 1.5s infinite' }} />
                  </div>
                  <div style={{ ...styles.loadingBar, width: '40%', marginTop: '8px' }}>
                    <div style={{ ...styles.loadingBarFill, width: '100%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <section aria-labelledby="overview-heading">
              <h2 id="overview-heading" style={styles.sectionTitle}>Overview</h2>
              <div style={styles.statsGrid}>
                {stats.map((stat) => (
                  <div key={stat.label} style={styles.statCard}>
                    <span style={styles.statLabel}>{stat.label}</span>
                    <span style={styles.statValue}>{stat.value}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={styles.statSubtext}>{stat.subtext}</span>
                      <span style={{ ...styles.statAccent, ...stat.accentStyle }}>
                        {stat.accentText}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="quick-access-heading">
              <h2 id="quick-access-heading" style={styles.sectionTitle}>Quick Access</h2>
              <div style={styles.tilesGrid}>
                {QUICK_TILES.map((tile) => (
                  <Link
                    key={tile.href}
                    to={tile.href}
                    style={styles.tile}
                    onMouseEnter={e => handleTileHover(e, true)}
                    onMouseLeave={e => handleTileHover(e, false)}
                  >
                    <div style={{ ...styles.tileIcon, backgroundColor: tile.iconBg }}>
                      <span role="img" aria-hidden="true" style={{ fontSize: '20px' }}>{tile.icon}</span>
                    </div>
                    <div>
                      <p style={styles.tileTitle}>{tile.title}</p>
                      <p style={styles.tileDesc}>{tile.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section aria-labelledby="recent-orders-heading">
              <div style={styles.recentSection}>
                <h2 id="recent-orders-heading" style={{ ...styles.sectionTitle, marginBottom: '20px' }}>
                  Recent Orders
                </h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={styles.table} aria-label="Recent orders">
                    <thead>
                      <tr>
                        <th style={styles.th}>Order ID</th>
                        <th style={styles.th}>Customer</th>
                        <th style={styles.th}>Amount</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.orderId}>
                          <td style={styles.td}>
                            <span style={styles.orderId}>{order.orderId}</span>
                          </td>
                          <td style={styles.td}>{order.customer}</td>
                          <td style={styles.td}>{order.amount}</td>
                          <td style={styles.td}>
                            <span
                              style={{ ...styles.badge, ...getStatusStyle(order.status) }}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td style={styles.td}>{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
