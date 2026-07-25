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
    flexWrap: 'wrap',
    gap: '16px',
  },
  titleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  breadcrumb: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: '#495057',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  breadcrumbLink: {
    color: '#4c6ef5',
    textDecoration: 'none',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
    margin: '0',
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    lineHeight: '16px',
  },
  select: {
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    padding: '8px 12px',
    minHeight: '44px',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'auto',
  },
  refreshBtn: {
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '20px',
    color: '#ffffff',
    backgroundColor: '#4c6ef5',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 20px',
    minHeight: '44px',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    color: '#212529',
    margin: '0 0 16px 0',
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
  metricRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #e9ecef',
  },
  metricLabel: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: '#495057',
  },
  metricValue: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    color: '#212529',
  },
  kpiCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  kpiLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    lineHeight: '16px',
    color: '#495057',
  },
  kpiValue: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
  },
  kpiChange: {
    fontSize: '12px',
    fontWeight: '600',
    lineHeight: '16px',
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '9999px',
    marginTop: '4px',
    alignSelf: 'flex-start',
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
  thRight: {
    textAlign: 'right',
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
  tdRight: {
    textAlign: 'right',
  },
  progressBarWrap: {
    backgroundColor: '#e9ecef',
    borderRadius: '9999px',
    height: '6px',
    overflow: 'hidden',
    flex: '1',
    minWidth: '80px',
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
  errorBox: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '10px',
    padding: '16px',
    marginBottom: '24px',
    fontSize: '14px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e9ecef',
    margin: '32px 0',
  },
  orderId: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    lineHeight: '20px',
  },
  noData: {
    textAlign: 'center',
    padding: '40px 24px',
    color: '#495057',
    fontSize: '14px',
  },
  skeletonLine: {
    backgroundColor: '#e9ecef',
    borderRadius: '9999px',
    height: '12px',
    marginBottom: '8px',
  },
};

const PERIOD_OPTIONS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'ytd', label: 'Year to date' },
];

const MOCK_REPORT_DATA = {
  kpis: [
    { label: 'Total Revenue', value: '₹8,42,190', change: '+14.2%', positive: true },
    { label: 'Total Orders', value: '3,841', change: '+9.7%', positive: true },
    { label: 'Avg Order Value', value: '₹2,192', change: '+4.1%', positive: true },
    { label: 'Cancellation Rate', value: '3.2%', change: '-0.8%', positive: true },
    { label: 'Return Rate', value: '2.1%', change: '+0.3%', positive: false },
    { label: 'New Customers', value: '1,204', change: '+22.5%', positive: true },
  ],
  ordersByStatus: [
    { status: 'Delivered', count: 2890, pct: 75 },
    { status: 'Processing', count: 530, pct: 14 },
    { status: 'Shipped', count: 190, pct: 5 },
    { status: 'Pending', count: 115, pct: 3 },
    { status: 'Cancelled', count: 80, pct: 2 },
    { status: 'Returned', count: 36, pct: 1 },
  ],
  topProducts: [
    { name: 'Classic Cotton T-Shirt (Blue, L)', sku: 'SKU-00124', revenue: '₹82,400', units: 412 },
    { name: 'Running Shoes Pro (White, 42)', sku: 'SKU-00087', revenue: '₹74,800', units: 187 },
    { name: 'Slim Fit Jeans (Dark, 32)', sku: 'SKU-00201', revenue: '₹68,200', units: 310 },
    { name: 'Woollen Hoodie (Grey, XL)', sku: 'SKU-00055', revenue: '₹61,500', units: 205 },
    { name: 'Canvas Sneakers (Black, 40)', sku: 'SKU-00143', revenue: '₹54,900', units: 274 },
  ],
  topCategories: [
    { name: "Men's Clothing", revenue: '₹2,84,000', orders: 1420, pct: 34 },
    { name: 'Footwear', revenue: '₹1,96,500', orders: 982, pct: 23 },
    { name: "Women's Clothing", revenue: '₹1,72,000', orders: 860, pct: 20 },
    { name: 'Accessories', revenue: '₹1,04,800', orders: 524, pct: 12 },
    { name: 'Sportswear', revenue: '₹84,890', orders: 425, pct: 10 },
  ],
  revenueByMonth: [
    { month: 'Aug 2023', revenue: '₹54,200', orders: 271 },
    { month: 'Sep 2023', revenue: '₹61,800', orders: 309 },
    { month: 'Oct 2023', revenue: '₹78,400', orders: 392 },
    { month: 'Nov 2023', revenue: '₹1,12,600', orders: 563 },
    { month: 'Dec 2023', revenue: '₹1,48,900', orders: 744 },
    { month: 'Jan 2024', revenue: '₹86,290', orders: 431 },
  ],
  returns: {
    total: 81,
    approved: 52,
    rejected: 16,
    pending: 13,
    refundedAmount: '₹1,02,400',
  },
  promos: [
    { code: 'WELCOME10', uses: 512, discountGiven: '₹25,600', orders: 512 },
    { code: 'FESTIVE20', uses: 284, discountGiven: '₹56,800', orders: 284 },
    { code: 'FLAT50', uses: 96, discountGiven: '₹4,800', orders: 96 },
  ],
};

const STATUS_COLORS = {
  Delivered: { bg: '#d3f9d8', color: '#37b24d' },
  Processing: { bg: '#e8ecfd', color: '#4c6ef5' },
  Shipped: { bg: '#e8ecfd', color: '#4c6ef5' },
  Pending: { bg: '#fff4e6', color: '#fd7e14' },
  Cancelled: { bg: '#ffe3e3', color: '#f03e3e' },
  Returned: { bg: '#ffe3e3', color: '#f03e3e' },
};

function getStatusStyle(status) {
  const s = STATUS_COLORS[status] || { bg: '#e9ecef', color: '#495057' };
  return { backgroundColor: s.bg, color: s.color };
}

function SkeletonCard() {
  return (
    <div style={styles.card}>
      <div style={{ ...styles.skeletonLine, width: '60%' }} />
      <div style={{ ...styles.skeletonLine, width: '40%', height: '32px' }} />
      <div style={{ ...styles.skeletonLine, width: '30%' }} />
    </div>
  );
}

export default function AdminReports() {
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      setReport(MOCK_REPORT_DATA);
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [period]);

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setReport(MOCK_REPORT_DATA);
      setLoading(false);
    }, 500);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.titleGroup}>
            <nav style={styles.breadcrumb} aria-label="Breadcrumb">
              <Link to="/admin" style={styles.breadcrumbLink}>Admin</Link>
              <span aria-hidden="true">›</span>
              <span>Reports</span>
            </nav>
            <h1 style={styles.pageTitle}>Reports</h1>
          </div>
          <div style={styles.filterBar}>
            <label htmlFor="period-select" style={styles.filterLabel}>Period</label>
            <select
              id="period-select"
              value={period}
              onChange={e => setPeriod(e.target.value)}
              style={styles.select}
              aria-label="Select reporting period"
            >
              {PERIOD_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleRefresh}
              style={styles.refreshBtn}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3b5bdb')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#4c6ef5')}
              aria-label="Refresh report data"
            >
              Refresh
            </button>
          </div>
        </header>

        {error && (
          <div style={styles.errorBox} role="alert">{error}</div>
        )}

        {loading ? (
          <>
            <section aria-label="Loading KPIs">
              <h2 style={styles.sectionTitle}>Key Performance Indicators</h2>
              <div style={styles.grid2}>
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            </section>
          </>
        ) : report ? (
          <>
            {/* KPIs */}
            <section aria-labelledby="kpi-heading">
              <h2 id="kpi-heading" style={styles.sectionTitle}>Key Performance Indicators</h2>
              <div style={styles.grid2}>
                {report.kpis.map(kpi => (
                  <div key={kpi.label} style={styles.kpiCard}>
                    <span style={styles.kpiLabel}>{kpi.label}</span>
                    <span style={styles.kpiValue}>{kpi.value}</span>
                    <span
                      style={{
                        ...styles.kpiChange,
                        backgroundColor: kpi.positive ? '#d3f9d8' : '#ffe3e3',
                        color: kpi.positive ? '#37b24d' : '#f03e3e',
                      }}
                    >
                      {kpi.change}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <hr style={styles.divider} />

            {/* Revenue Over Time */}
            <section aria-labelledby="revenue-time-heading">
              <h2 id="revenue-time-heading" style={styles.sectionTitle}>Revenue Over Time</h2>
              <div style={styles.card}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={styles.table} aria-label="Revenue by month">
                    <thead>
                      <tr>
                        <th style={styles.th}>Month</th>
                        <th style={{ ...styles.th, ...styles.thRight }}>Revenue</th>
                        <th style={{ ...styles.th, ...styles.thRight }}>Orders</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.revenueByMonth.map(row => (
                        <tr key={row.month}>
                          <td style={styles.td}>{row.month}</td>
                          <td style={{ ...styles.td, ...styles.tdRight }}>{row.revenue}</td>
                          <td style={{ ...styles.td, ...styles.tdRight }}>{row.orders}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <hr style={styles.divider} />

            {/* Orders by Status + Top Categories */}
            <div style={styles.grid3}>
              <section aria-labelledby="orders-status-heading">
                <h2 id="orders-status-heading" style={styles.sectionTitle}>Orders by Status</h2>
                <div style={styles.card}>
                  {report.ordersByStatus.map(row => (
                    <div key={row.status} style={{ marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span
                          style={{ ...styles.badge, ...getStatusStyle(row.status) }}
                        >
                          {row.status}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#212529' }}>
                          {row.count} <span style={{ fontSize: '12px', color: '#495057', fontWeight: '400' }}>({row.pct}%)</span>
                        </span>
                      </div>
                      <div style={styles.progressBarWrap}>
                        <div
                          style={{
                            height: '100%',
                            borderRadius: '9999px',
                            backgroundColor: getStatusStyle(row.status).color,
                            width: `${row.pct}%`,
                            transition: 'width 0.4s ease',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section aria-labelledby="top-categories-heading">
                <h2 id="top-categories-heading" style={styles.sectionTitle}>Top Categories</h2>
                <div style={styles.card}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={styles.table} aria-label="Revenue by category">
                      <thead>
                        <tr>
                          <th style={styles.th}>Category</th>
                          <th style={{ ...styles.th, ...styles.thRight }}>Revenue</th>
                          <th style={{ ...styles.th, ...styles.thRight }}>Orders</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.topCategories.map(cat => (
                          <tr key={cat.name}>
                            <td style={styles.td}>
                              <div>{cat.name}</div>
                              <div style={styles.progressBarWrap}>
                                <div
                                  style={{
                                    height: '100%',
                                    borderRadius: '9999px',
                                    backgroundColor: '#4c6ef5',
                                    width: `${cat.pct}%`,
                                  }}
                                />
                              </div>
                            </td>
                            <td style={{ ...styles.td, ...styles.tdRight }}>{cat.revenue}</td>
                            <td style={{ ...styles.td, ...styles.tdRight }}>{cat.orders}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>

            <hr style={styles.divider} />

            {/* Top Products */}
            <section aria-labelledby="top-products-heading">
              <h2 id="top-products-heading" style={styles.sectionTitle}>Top Products</h2>
              <div style={styles.card}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={styles.table} aria-label="Top selling products">
                    <thead>
                      <tr>
                        <th style={styles.th}>Product</th>
                        <th style={styles.th}>SKU</th>
                        <th style={{ ...styles.th, ...styles.thRight }}>Revenue</th>
                        <th style={{ ...styles.th, ...styles.thRight }}>Units Sold</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.topProducts.map((product, idx) => (
                        <tr key={product.sku}>
                          <td style={styles.td}>
                            <span style={{ fontWeight: '500', marginRight: '8px', color: '#4c6ef5' }}>#{idx + 1}</span>
                            {product.name}
                          </td>
                          <td style={styles.td}>
                            <span style={styles.orderId}>{product.sku}</span>
                          </td>
                          <td style={{ ...styles.td, ...styles.tdRight }}>{product.revenue}</td>
                          <td style={{ ...styles.td, ...styles.tdRight }}>{product.units}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <hr style={styles.divider} />

            {/* Returns Summary + Promo Codes */}
            <div style={styles.grid3}>
              <section aria-labelledby="returns-summary-heading">
                <h2 id="returns-summary-heading" style={styles.sectionTitle}>Returns Summary</h2>
                <div style={styles.card}>
                  {[
                    { label: 'Total Return Requests', value: report.returns.total },
                    { label: 'Approved', value: report.returns.approved },
                    { label: 'Rejected', value: report.returns.rejected },
                    { label: 'Pending Review', value: report.returns.pending },
                    { label: 'Total Refunded', value: report.returns.refundedAmount },
                  ].map((item, i, arr) => (
                    <div
                      key={item.label}
                      style={{
                        ...styles.metricRow,
                        borderBottom: i === arr.length - 1 ? 'none' : '1px solid #e9ecef',
                      }}
                    >
                      <span style={styles.metricLabel}>{item.label}</span>
                      <span style={styles.metricValue}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section aria-labelledby="promo-heading">
                <h2 id="promo-heading" style={styles.sectionTitle}>Promo Code Usage</h2>
                <div style={styles.card}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={styles.table} aria-label="Promotional code performance">
                      <thead>
                        <tr>
                          <th style={styles.th}>Code</th>
                          <th style={{ ...styles.th, ...styles.thRight }}>Uses</th>
                          <th style={{ ...styles.th, ...styles.thRight }}>Discount Given</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.promos.map(promo => (
                          <tr key={promo.code}>
                            <td style={styles.td}>
                              <span style={styles.orderId}>{promo.code}</span>
                            </td>
                            <td style={{ ...styles.td, ...styles.tdRight }}>{promo.uses}</td>
                            <td style={{ ...styles.td, ...styles.tdRight }}>{promo.discountGiven}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>
          </>
        ) : (
          <div style={styles.noData}>
            <p>No report data available. Try refreshing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
