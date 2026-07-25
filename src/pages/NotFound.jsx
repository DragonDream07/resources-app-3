import { Link } from 'react-router-dom';
import logoSrc from '@/assets/images/logo.svg';
import emptyStateSrc from '@/assets/images/empty-state.svg';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f8f9fa',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
    display: 'flex',
    flexDirection: 'column',
  },
  navbar: {
    background: '#ffffff',
    borderBottom: '1px solid #868e96',
  },
  navInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    height: '64px',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#4c6ef5',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    whiteSpace: 'nowrap',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px 24px',
    textAlign: 'center',
  },
  illustration: {
    width: '200px',
    height: '200px',
    marginBottom: '32px',
    opacity: 0.85,
  },
  statusCode: {
    fontSize: '40px',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: '1.2',
    color: '#4c6ef5',
    margin: '0 0 8px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    color: '#212529',
    margin: '0 0 12px',
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#495057',
    maxWidth: '480px',
    margin: '0 0 32px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '12px 24px',
    background: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    minHeight: '44px',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '12px 24px',
    background: '#ffffff',
    color: '#4c6ef5',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    minHeight: '44px',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    color: '#495057',
    marginBottom: '24px',
    justifyContent: 'center',
  },
  breadcrumbLink: {
    color: '#4c6ef5',
    textDecoration: 'none',
    fontSize: '14px',
  },
  footer: {
    background: '#ffffff',
    borderTop: '1px solid #e9ecef',
    padding: '20px 24px',
    textAlign: 'center',
  },
  footerCopy: {
    fontSize: '12px',
    color: '#868e96',
    margin: 0,
  },
};

export default function NotFound() {
  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.navbar} role="navigation" aria-label="Main navigation">
        <div style={styles.navInner}>
          <Link to="/" style={styles.logo} aria-label="ShopMini home">
            <img src={logoSrc} alt="" width={28} height={28} />
            ShopMini
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <main style={styles.main} role="main">
        <img
          src={emptyStateSrc}
          alt="Page not found illustration"
          style={styles.illustration}
        />

        <nav aria-label="Breadcrumb" style={styles.breadcrumb}>
          <Link to="/" style={styles.breadcrumbLink}>Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">404</span>
        </nav>

        <h1 style={styles.statusCode} aria-label="Error 404">404</h1>
        <h2 style={styles.title}>Page not found</h2>
        <p style={styles.description}>
          Sorry, we couldn&apos;t find the page you were looking for. It may have been moved,
          deleted, or perhaps the URL was mistyped.
        </p>

        <div style={styles.actions}>
          <Link to="/" style={styles.btnPrimary}>
            Go to Home
          </Link>
          <Link to="/products" style={styles.btnSecondary}>
            Browse Products
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerCopy}>&copy; {new Date().getFullYear()} ShopMini. All rights reserved.</p>
      </footer>
    </div>
  );
}
