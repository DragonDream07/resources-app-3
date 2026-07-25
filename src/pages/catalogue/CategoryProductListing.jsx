import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import emptyState from '@/assets/images/empty-state.svg';
import chevronLeft from '@/assets/icons/chevron-left.svg';
import chevronRight from '@/assets/icons/chevron-right.svg';
import chevronDown from '@/assets/icons/chevron-down.svg';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
];

const PAGE_SIZE = 20;

const styles = {
  page: {
    background: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px',
    display: 'flex',
    gap: '32px',
  },
  breadcrumb: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px 24px 0',
    fontSize: '14px',
    color: '#495057',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  breadcrumbLink: {
    color: '#4c6ef5',
    textDecoration: 'none',
  },
  sidebar: {
    width: '260px',
    flexShrink: 0,
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
  filterCard: {
    background: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    marginBottom: '16px',
    border: '1px solid #e9ecef',
  },
  filterTitle: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '12px',
  },
  filterOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#343a40',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    accentColor: '#4c6ef5',
    cursor: 'pointer',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  resultCount: {
    fontSize: '14px',
    color: '#495057',
  },
  resultCountBold: {
    fontWeight: '700',
    color: '#212529',
  },
  sortSelect: {
    padding: '8px 32px 8px 12px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#343a40',
    background: '#ffffff',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("${chevronDown}")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    backgroundSize: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '24px',
  },
  productCard: {
    background: '#ffffff',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid #e9ecef',
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    transition: 'box-shadow 0.15s ease',
  },
  productImage: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    background: '#f8f9fa',
  },
  productInfo: {
    padding: '16px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  productName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    lineHeight: '24px',
  },
  productBrand: {
    fontSize: '12px',
    color: '#495057',
  },
  productPrice: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#4c6ef5',
    marginTop: '8px',
  },
  taxNote: {
    fontSize: '11px',
    color: '#868e96',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '64px 24px',
    gap: '16px',
  },
  emptyImg: {
    width: '120px',
    opacity: 0.5,
  },
  emptyText: {
    fontSize: '16px',
    color: '#495057',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '40px',
  },
  pageBtn: {
    minWidth: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #868e96',
    borderRadius: '6px',
    background: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#343a40',
    padding: '0 12px',
  },
  pageBtnActive: {
    background: '#4c6ef5',
    color: '#ffffff',
    border: '1px solid #4c6ef5',
    fontWeight: '600',
  },
  pageBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  pageIcon: {
    width: '18px',
    height: '18px',
  },
  categoryHeader: {
    background: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    marginBottom: '24px',
    border: '1px solid #e9ecef',
  },
  categoryName: {
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.01em',
    color: '#212529',
    marginBottom: '4px',
  },
  categoryDesc: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
  },
  skeleton: {
    background: 'linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.2s infinite',
    borderRadius: '6px',
  },
  errorMsg: {
    color: '#f03e3e',
    background: '#ffe3e3',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  rangeRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  rangeInput: {
    width: '80px',
    padding: '6px 8px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#343a40',
  },
};

function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      style={styles.productCard}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(76,110,245,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
    >
      <img
        src={product.primary_image_url || placeholderProduct}
        alt={product.name}
        style={styles.productImage}
        onError={e => { e.target.src = placeholderProduct; }}
      />
      <div style={styles.productInfo}>
        {product.brand_name && <span style={styles.productBrand}>{product.brand_name}</span>}
        <span style={styles.productName}>{product.name}</span>
        {product.base_price != null && (
          <>
            <span style={styles.productPrice}>
              ₹{Number(product.base_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <span style={styles.taxNote}>Incl. all taxes</span>
          </>
        )}
      </div>
    </Link>
  );
}

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={styles.filterCard}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          ...styles.filterTitle,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: 0,
        }}
        aria-expanded={open}
      >
        {title}
        <img src={chevronDown} alt="" style={{ width: 14, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {open && <div style={{ marginTop: '12px' }}>{children}</div>}
    </div>
  );
}

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);
  return (
    <nav style={styles.pagination} aria-label="Pagination">
      <button
        style={{ ...styles.pageBtn, ...(page === 1 ? styles.pageBtnDisabled : {}) }}
        onClick={() => page > 1 && onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <img src={chevronLeft} alt="Previous" style={styles.pageIcon} />
      </button>
      {start > 1 && (
        <>
          <button style={styles.pageBtn} onClick={() => onPageChange(1)}>1</button>
          {start > 2 && <span style={{ padding: '0 4px', color: '#868e96' }}>…</span>}
        </>
      )}
      {pages.map(p => (
        <button
          key={p}
          style={{ ...styles.pageBtn, ...(p === page ? styles.pageBtnActive : {}) }}
          onClick={() => onPageChange(p)}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span style={{ padding: '0 4px', color: '#868e96' }}>…</span>}
          <button style={styles.pageBtn} onClick={() => onPageChange(totalPages)}>{totalPages}</button>
        </>
      )}
      <button
        style={{ ...styles.pageBtn, ...(page === totalPages ? styles.pageBtnDisabled : {}) }}
        onClick={() => page < totalPages && onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <img src={chevronRight} alt="Next" style={styles.pageIcon} />
      </button>
    </nav>
  );
}

export default function CategoryProductListing() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [category, setCategory] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState(null);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') || 'relevance';
  const selectedBrands = searchParams.getAll('brand');
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Resolve slug → categoryId by fetching all categories
  useEffect(() => {
    async function resolveCategory() {
      setCategoryLoading(true);
      try {
        const res = await fetch(`${API_BASE}/categories`);
        if (!res.ok) throw new Error('Failed to load category');
        const data = await res.json();
        const cats = data.data || data.categories || [];
        const found = cats.find(c => c.slug === slug || String(c.id) === slug);
        if (found) {
          setCategory(found);
          setCategoryId(found.id);
        } else {
          setError('Category not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load category');
      } finally {
        setCategoryLoading(false);
      }
    }
    resolveCategory();
  }, [slug]);

  const fetchProducts = useCallback(async () => {
    if (!categoryId) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('limit', PAGE_SIZE);
      if (sort && sort !== 'relevance') params.set('sort', sort);
      selectedBrands.forEach(b => params.append('brand', b));
      if (minPrice) params.set('min_price', minPrice);
      if (maxPrice) params.set('max_price', maxPrice);

      const res = await fetch(`${API_BASE}/categories/${categoryId}/products?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load products');
      const data = await res.json();
      setProducts(data.data || data.products || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [categoryId, page, sort, selectedBrands.join(','), minPrice, maxPrice]);

  const fetchBrands = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/brands`);
      if (res.ok) {
        const bd = await res.json();
        setBrands(bd.data || bd.brands || []);
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => { if (categoryId) fetchProducts(); }, [fetchProducts, categoryId]);
  useEffect(() => { fetchBrands(); }, [fetchBrands]);

  function setParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set('page', '1');
    setSearchParams(next);
  }

  function toggleMulti(key, value) {
    const next = new URLSearchParams(searchParams);
    const existing = next.getAll(key);
    next.delete(key);
    if (existing.includes(value)) {
      existing.filter(v => v !== value).forEach(v => next.append(key, v));
    } else {
      [...existing, value].forEach(v => next.append(key, v));
    }
    next.set('page', '1');
    setSearchParams(next);
  }

  function handlePageChange(p) {
    const next = new URLSearchParams(searchParams);
    next.set('page', p);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const isLoading = loading || categoryLoading;

  return (
    <div style={styles.page}>
      <nav style={styles.breadcrumb} aria-label="Breadcrumb">
        <Link to="/" style={styles.breadcrumbLink}>Home</Link>
        <span>/</span>
        <Link to="/products" style={styles.breadcrumbLink}>Products</Link>
        <span>/</span>
        <span style={{ color: '#212529' }}>{category?.name || slug}</span>
      </nav>

      <div style={styles.container}>
        <aside style={styles.sidebar} aria-label="Filters">
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#212529', marginBottom: '16px' }}>Filters</h2>

          <FilterSection title="Price Range">
            <div style={styles.rangeRow}>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                style={styles.rangeInput}
                min={0}
                onChange={e => setParam('min_price', e.target.value)}
                aria-label="Minimum price"
              />
              <span style={{ color: '#868e96' }}>–</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                style={styles.rangeInput}
                min={0}
                onChange={e => setParam('max_price', e.target.value)}
                aria-label="Maximum price"
              />
            </div>
          </FilterSection>

          {brands.length > 0 && (
            <FilterSection title="Brand">
              {brands.map(b => (
                <label key={b.id} style={styles.filterOption}>
                  <input
                    type="checkbox"
                    style={styles.checkbox}
                    checked={selectedBrands.includes(String(b.id))}
                    onChange={() => toggleMulti('brand', String(b.id))}
                  />
                  {b.name}
                </label>
              ))}
            </FilterSection>
          )}
        </aside>

        <main style={styles.main}>
          {!categoryLoading && category && (
            <div style={styles.categoryHeader}>
              <h1 style={styles.categoryName}>{category.name}</h1>
              {category.description && (
                <p style={styles.categoryDesc}>{category.description}</p>
              )}
            </div>
          )}

          {error && <div style={styles.errorMsg} role="alert">{error}</div>}

          <div style={styles.topBar}>
            <span style={styles.resultCount}>
              {isLoading ? 'Loading…' : (<><strong style={styles.resultCountBold}>{total.toLocaleString()}</strong> products</>)}
            </span>
            <select
              value={sort}
              onChange={e => setParam('sort', e.target.value)}
              style={styles.sortSelect}
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div style={styles.grid}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ background: '#ffffff', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e9ecef' }}>
                  <div style={{ ...styles.skeleton, aspectRatio: '1', width: '100%' }} />
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ ...styles.skeleton, height: '12px', width: '60%' }} />
                    <div style={{ ...styles.skeleton, height: '18px', width: '85%' }} />
                    <div style={{ ...styles.skeleton, height: '18px', width: '40%', marginTop: '4px' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={styles.emptyState}>
              <img src={emptyState} alt="No products found" style={styles.emptyImg} />
              <p style={styles.emptyText}>No products found in this category.</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </main>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
