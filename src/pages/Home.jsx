import { Link } from 'react-router-dom';
import logoSrc from '@/assets/images/logo.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import searchIcon from '@/assets/icons/search.svg';
import cartIcon from '@/assets/icons/cart.svg';
import userIcon from '@/assets/icons/user.svg';
import bellIcon from '@/assets/icons/bell.svg';
import heartIcon from '@/assets/icons/heart.svg';
import starIcon from '@/assets/icons/star.svg';
import chevronRight from '@/assets/icons/chevron-right.svg';

const categories = [
  { id: 1, label: 'Electronics', emoji: '💻' },
  { id: 2, label: 'Fashion', emoji: '👗' },
  { id: 3, label: 'Home & Living', emoji: '🏠' },
  { id: 4, label: 'Sports', emoji: '⚽' },
  { id: 5, label: 'Beauty', emoji: '💄' },
  { id: 6, label: 'Toys', emoji: '🧸' },
];

const featuredProducts = [
  { id: 1, name: 'Wireless Headphones', price: 1299, originalPrice: 2499, rating: 4.5, reviews: 128 },
  { id: 2, name: 'Running Shoes', price: 899, originalPrice: 1599, rating: 4.3, reviews: 94 },
  { id: 3, name: 'Smart Watch', price: 2199, originalPrice: 3999, rating: 4.7, reviews: 210 },
  { id: 4, name: 'Yoga Mat', price: 449, originalPrice: 799, rating: 4.6, reviews: 67 },
];

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f8f9fa',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
  },
  navbar: {
    background: '#ffffff',
    borderBottom: '1px solid #868e96',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    height: '64px',
    gap: '16px',
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
  searchBar: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    background: '#f8f9fa',
    border: '1px solid #868e96',
    borderRadius: '6px',
    padding: '0 12px',
    height: '44px',
    gap: '8px',
    maxWidth: '480px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: '14px',
    color: '#212529',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginLeft: 'auto',
  },
  iconBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    border: 'none',
    background: 'transparent',
    borderRadius: '10px',
    cursor: 'pointer',
    position: 'relative',
  },
  hero: {
    background: 'linear-gradient(135deg, #4c6ef5 0%, #3b5bdb 100%)',
    color: '#ffffff',
    padding: '64px 24px',
    textAlign: 'center',
  },
  heroInner: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  heroEyebrow: {
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '12px',
  },
  heroTitle: {
    fontSize: '40px',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: '1.2',
    marginBottom: '16px',
    margin: '0 auto 16px',
    maxWidth: '700px',
  },
  heroSubtitle: {
    fontSize: '16px',
    lineHeight: '1.5',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: '32px',
    maxWidth: '520px',
    margin: '0 auto 32px',
  },
  heroActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: '#ffffff',
    color: '#4c6ef5',
    border: 'none',
    borderRadius: '9999px',
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
    gap: '8px',
    padding: '12px 24px',
    background: 'rgba(255,255,255,0.15)',
    color: '#ffffff',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: '9999px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    minHeight: '44px',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
  section: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '48px 24px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 700,
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    color: '#212529',
    margin: 0,
  },
  viewAllLink: {
    fontSize: '14px',
    color: '#4c6ef5',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontWeight: 500,
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '16px',
  },
  categoryCard: {
    background: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    padding: '24px 16px',
    textAlign: 'center',
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#212529',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    transition: 'box-shadow 0.15s',
  },
  categoryEmoji: {
    fontSize: '32px',
    lineHeight: 1,
  },
  categoryLabel: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#212529',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
  },
  productCard: {
    background: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    overflow: 'hidden',
    textDecoration: 'none',
    color: '#212529',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
  },
  productImageWrap: {
    position: 'relative',
    background: '#f8f9fa',
    aspectRatio: '1 / 1',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  wishlistBtn: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '32px',
    height: '32px',
    borderRadius: '9999px',
    background: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
  },
  productBody: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },
  productName: {
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '24px',
    color: '#212529',
    margin: 0,
  },
  productRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#495057',
  },
  productPriceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: 'auto',
  },
  productPrice: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#212529',
  },
  productOriginalPrice: {
    fontSize: '14px',
    color: '#868e96',
    textDecoration: 'line-through',
  },
  productDiscount: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#37b24d',
    background: '#d3f9d8',
    padding: '2px 6px',
    borderRadius: '3px',
    letterSpacing: '0.02em',
  },
  promoBanner: {
    background: '#fff3e6',
    borderRadius: '16px',
    padding: '32px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    flexWrap: 'wrap',
    marginTop: '0',
  },
  promoTextGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  promoEyebrow: {
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#fd7e14',
  },
  promoTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#212529',
    letterSpacing: '-0.01em',
    margin: 0,
  },
  promoSubtitle: {
    fontSize: '14px',
    color: '#495057',
    margin: 0,
  },
  promoCode: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    background: '#ffffff',
    border: '1.5px dashed #fd7e14',
    borderRadius: '6px',
    padding: '6px 12px',
    color: '#fd7e14',
    fontWeight: 600,
    letterSpacing: '0.06em',
  },
  promoBtnGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  btnOrange: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '12px 24px',
    background: '#fd7e14',
    color: '#ffffff',
    border: 'none',
    borderRadius: '9999px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    minHeight: '44px',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
  divider: {
    height: '1px',
    background: '#e9ecef',
    margin: '0 24px',
  },
  footer: {
    background: '#ffffff',
    borderTop: '1px solid #e9ecef',
    padding: '40px 24px',
    marginTop: '48px',
  },
  footerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '32px',
    justifyContent: 'space-between',
  },
  footerBrand: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxWidth: '260px',
  },
  footerLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  footerLinkGroup: {
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '4px',
  },
  footerLink: {
    fontSize: '14px',
    color: '#4c6ef5',
    textDecoration: 'none',
    lineHeight: '20px',
  },
  footerCopy: {
    marginTop: '32px',
    textAlign: 'center',
    fontSize: '12px',
    color: '#868e96',
  },
};

function StarRating({ rating }) {
  return (
    <span style={styles.productRating}>
      <img src={starIcon} alt="star" width={12} height={12} />
      <span style={{ fontWeight: 500, color: '#212529' }}>{rating}</span>
    </span>
  );
}

function ProductCard({ product }) {
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  return (
    <Link to={`/products/${product.id}`} style={styles.productCard}>
      <div style={styles.productImageWrap}>
        <img src={placeholderProduct} alt={product.name} style={styles.productImage} />
        <button
          style={styles.wishlistBtn}
          aria-label="Add to wishlist"
          onClick={(e) => e.preventDefault()}
        >
          <img src={heartIcon} alt="" width={16} height={16} />
        </button>
      </div>
      <div style={styles.productBody}>
        <h3 style={styles.productName}>{product.name}</h3>
        <StarRating rating={product.rating} />
        <div style={styles.productPriceRow}>
          <span style={styles.productPrice}>₹{product.price.toLocaleString('en-IN')}</span>
          <span style={styles.productOriginalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</span>
          <span style={styles.productDiscount}>{discount}% off</span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.navbar} role="navigation" aria-label="Main navigation">
        <div style={styles.navInner}>
          <Link to="/" style={styles.logo} aria-label="ShopMini home">
            <img src={logoSrc} alt="" width={28} height={28} />
            ShopMini
          </Link>
          <div style={styles.searchBar} role="search">
            <img src={searchIcon} alt="" width={16} height={16} style={{ opacity: 0.5 }} />
            <input
              style={styles.searchInput}
              type="search"
              placeholder="Search products, brands..."
              aria-label="Search products"
            />
          </div>
          <div style={styles.navActions}>
            <Link to="/notifications" style={styles.iconBtn} aria-label="Notifications">
              <img src={bellIcon} alt="" width={20} height={20} />
            </Link>
            <Link to="/cart" style={styles.iconBtn} aria-label="Cart">
              <img src={cartIcon} alt="" width={20} height={20} />
            </Link>
            <Link to="/account" style={styles.iconBtn} aria-label="Account">
              <img src={userIcon} alt="" width={20} height={20} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero} aria-label="Hero banner">
        <div style={styles.heroInner}>
          <p style={styles.heroEyebrow}>Limited time deals</p>
          <h1 style={styles.heroTitle}>
            Up to 60% off on electronics, fashion &amp; home essentials
          </h1>
          <p style={styles.heroSubtitle}>
            Shop thousands of products across top categories. Free delivery on orders above ₹499.
          </p>
          <div style={styles.heroActions}>
            <Link to="/products" style={styles.btnPrimary}>
              Shop Now
            </Link>
            <Link to="/categories" style={styles.btnSecondary}>
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Shop by Category</h2>
          <Link to="/categories" style={styles.viewAllLink}>
            View all
            <img src={chevronRight} alt="" width={14} height={14} />
          </Link>
        </div>
        <div style={styles.categoriesGrid}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.id}/products`}
              style={styles.categoryCard}
              aria-label={cat.label}
            >
              <span style={styles.categoryEmoji} aria-hidden="true">{cat.emoji}</span>
              <span style={styles.categoryLabel}>{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div style={styles.divider} role="separator" />

      {/* Promo Banner */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px 0' }}>
        <div style={styles.promoBanner} role="complementary" aria-label="Promotional offer">
          <div style={styles.promoTextGroup}>
            <span style={styles.promoEyebrow}>Exclusive offer</span>
            <h2 style={styles.promoTitle}>Get extra 10% off your first order</h2>
            <p style={styles.promoSubtitle}>Use code at checkout. Valid on all categories.</p>
          </div>
          <div style={styles.promoBtnGroup}>
            <code style={styles.promoCode}>FIRST10</code>
            <Link to="/products" style={styles.btnOrange}>
              Claim Offer
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Featured Products</h2>
          <Link to="/products" style={styles.viewAllLink}>
            View all
            <img src={chevronRight} alt="" width={14} height={14} />
          </Link>
        </div>
        <div style={styles.productsGrid}>
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerBrand}>
            <Link to="/" style={{ ...styles.logo, fontSize: '18px' }}>
              <img src={logoSrc} alt="" width={24} height={24} />
              ShopMini
            </Link>
            <p style={{ fontSize: '14px', color: '#495057', lineHeight: '1.5', margin: 0 }}>
              Your one-stop destination for electronics, fashion, home essentials and more.
            </p>
          </div>
          <div style={styles.footerLinks}>
            <span style={styles.footerLinkGroup}>Quick Links</span>
            <Link to="/products" style={styles.footerLink}>All Products</Link>
            <Link to="/categories" style={styles.footerLink}>Categories</Link>
            <Link to="/orders" style={styles.footerLink}>My Orders</Link>
            <Link to="/account" style={styles.footerLink}>My Account</Link>
          </div>
          <div style={styles.footerLinks}>
            <span style={styles.footerLinkGroup}>Support</span>
            <Link to="/" style={styles.footerLink}>Help Center</Link>
            <Link to="/" style={styles.footerLink}>Returns</Link>
            <Link to="/" style={styles.footerLink}>Track Order</Link>
            <Link to="/" style={styles.footerLink}>Contact Us</Link>
          </div>
        </div>
        <p style={styles.footerCopy}>&copy; {new Date().getFullYear()} ShopMini. All rights reserved.</p>
      </footer>
    </div>
  );
}
