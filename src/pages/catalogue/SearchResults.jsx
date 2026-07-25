import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import emptyState from '@/assets/images/empty-state.svg';
import searchIcon from '@/assets/icons/search.svg';
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
  searchBarSection: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px 0',
  },
  searchBarWrapper: {
    position: 'relative',
    maxWidth: '640px',
  },
  searchInput: {
    width: '100%',
    padding: '12px 48px 12px 16px',
    fontSize: '16px',
    border: '1px solid #868e96',
    borderRadius: '10px',
    background: '#ffffff',
    color: '#212529',
    outline: 'none',
    boxSizing: 'border-box',
  },
  searchIcon: {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
    opacity: 0.5,
    pointerEvents: 'none',
  },
  suggestList: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    background: '#ffffff',
    border: '1px solid #e9ecef',
    borderRadius: '10px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    zIndex: 100,
    overflow: 'hidden',
  },
  suggestItem: {
    padding: '12px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#343a40',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
  queryHeading: {
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.01em',
    color: '#212529',
    marginBottom: '4px',
  },
  queryMeta: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '24px',
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
  facetCount: {
    fontSize: '12px',
    color: '#868e96',
    marginLeft: 'auto',
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

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [facets, setFacets] = useState({ brands: [], categories: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const suggestTimer = useRef(null);
  const searchBarRef = useRef(null);

  const q = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') || 'relevance';
  const selectedBrands = searchParams.getAll('brand');
  const selectedCategories = searchParams.getAll('category');
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const fetchResults = useCallback(async () => {
    if (!q.trim()) {
      setProducts([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('q', q);
      params.set('page', page);
      params.set('limit', PAGE_SIZE);
      if (sort && sort !== 'relevance') params.set('sort', sort);
      selectedBrands.forEach(b => params.append('brand', b));
      selectedCategories.forEach(c => params.append('category', c));
      if (minPrice) params.set('min_price', minPrice);
      if (maxPrice) params.set('max_price', maxPrice);

      const res = await fetch(`${API_BASE}/search?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch search results');
      const data = await res.json();
      setProducts(data.data || data.products || data.results || []);
      setTotal(data.total || 0);
      if (data.facets) setFacets(data.facets);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [q, page, sort, selectedBrands.join(','), selectedCategories.join(','), minPrice, maxPrice]);

  useEffect(() => { fetchResults(); }, [fetchResults]);

  useEffect(() => { setInputValue(q); }, [q]);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e) {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleInputChange(e) {
    const val = e.target.value;
    setInputValue(val);
    if (suggestTimer.current) clearTimeout(suggestTimer.current);
    if (val.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    suggestTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/search/suggest?q=${encodeURIComponent(val)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.suggestions || data.data || []);
          setShowSuggestions(true);
        }
      } catch {
        // silently fail
      }
    }, 300);
  }

  function handleSearch(term) {
    const next = new URLSearchParams();
    next.set('q', term || inputValue);
    next.set('page', '1');
    setSearchParams(next);
    setShowSuggestions(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch();
    if (e.key === 'Escape') setShowSuggestions(false);
  }

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

  const facetBrands = facets.brands || [];
  const facetCategories = facets.categories || [];

  return (
    <div style={styles.page}>
      <div style={styles.searchBarSection}>
        <div style={styles.searchBarWrapper} ref={searchBarRef}>
          <input
            type="search"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search for products…"
            style={styles.searchInput}
            aria-label="Search products"
            aria-autocomplete="list"
            aria-expanded={showSuggestions}
          />
          <img src={searchIcon} alt="" style={styles.searchIcon} />
          {showSuggestions && suggestions.length > 0 && (
            <ul style={styles.suggestList} role="listbox">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  style={styles.suggestItem}
                  role="option"
                  onMouseDown={() => { setInputValue(s.text || s); handleSearch(s.text || s); }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#e8ecfd'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <img src={searchIcon} alt="" style={{ width: 14, opacity: 0.4 }} />
                  {s.text || s}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div style={styles.container}>
        {/* Facet Filters Sidebar */}
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

          {facetBrands.length > 0 && (
            <FilterSection title="Brand">
              {facetBrands.map(b => (
                <label key={b.id || b.value} style={styles.filterOption}>
                  <input
                    type="checkbox"
                    style={styles.checkbox}
                    checked={selectedBrands.includes(String(b.id || b.value))}
                    onChange={() => toggleMulti('brand', String(b.id || b.value))}
                  />
                  {b.name || b.label}
                  {b.count != null && <span style={styles.facetCount}>({b.count})</span>}
                </label>
              ))}
            </FilterSection>
          )}

          {facetCategories.length > 0 && (
            <FilterSection title="Category">
              {facetCategories.map(c => (
                <label key={c.id || c.value} style={styles.filterOption}>
                  <input
                    type="checkbox"
                    style={styles.checkbox}
                    checked={selectedCategories.includes(String(c.id || c.value))}
                    onChange={() => toggleMulti('category', String(c.id || c.value))}
                  />
                  {c.name || c.label}
                  {c.count != null && <span style={styles.facetCount}>({c.count})</span>}
                </label>
              ))}
            </FilterSection>
          )}
        </aside>

        {/* Results */}
        <main style={styles.main}>
          {q && (
            <>
              <h1 style={styles.queryHeading}>
                {loading ? 'Searching…' : `Results for "${q}"`}
              </h1>
              {!loading && (
                <p style={styles.queryMeta}>
                  <strong>{total.toLocaleString()}</strong> products found
                </p>
              )}
            </>
          )}

          {!q && (
            <h1 style={styles.queryHeading}>Search Products</h1>
          )}

          {error && <div style={styles.errorMsg} role="alert">{error}</div>}

          {q && (
            <div style={styles.topBar}>
              <span />
              <select
                value={sort}
                onChange={e => setParam('sort', e.target.value)}
                style={styles.sortSelect}
                aria-label="Sort results"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          )}

          {loading ? (
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
          ) : !q ? (
            <div style={styles.emptyState}>
              <img src={emptyState} alt="Search for products" style={styles.emptyImg} />
              <p style={styles.emptyText}>Enter a search term to find products.</p>
            </div>
          ) : products.length === 0 ? (
            <div style={styles.emptyState}>
              <img src={emptyState} alt="No results" style={styles.emptyImg} />
              <p style={styles.emptyText}>No results found for &ldquo;{q}&rdquo;. Try a different search term.</p>
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
        input[type=search]::-webkit-search-cancel-button { display: none; }
      `}</style>
    </div>
  );
}
