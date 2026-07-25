import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import chevronLeft from '@/assets/icons/chevron-left.svg';
import chevronRight from '@/assets/icons/chevron-right.svg';
import plusIcon from '@/assets/icons/plus.svg';
import minusIcon from '@/assets/icons/minus.svg';
import cartIcon from '@/assets/icons/cart.svg';
import checkIcon from '@/assets/icons/check.svg';
import starIcon from '@/assets/icons/star.svg';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

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
  },
  breadcrumb: {
    fontSize: '14px',
    color: '#495057',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  breadcrumbLink: {
    color: '#4c6ef5',
    textDecoration: 'none',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '48px',
    alignItems: 'start',
  },
  imageSection: {
    position: 'sticky',
    top: '24px',
  },
  mainImage: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    borderRadius: '16px',
    background: '#ffffff',
    border: '1px solid #e9ecef',
    display: 'block',
  },
  thumbnailRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    flexWrap: 'wrap',
  },
  thumbnail: {
    width: '72px',
    height: '72px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '2px solid transparent',
    cursor: 'pointer',
    background: '#ffffff',
    transition: 'border-color 0.15s',
  },
  thumbnailActive: {
    borderColor: '#4c6ef5',
  },
  infoSection: {},
  brand: {
    fontSize: '14px',
    color: '#4c6ef5',
    fontWeight: '500',
    textDecoration: 'none',
    display: 'inline-block',
    marginBottom: '8px',
  },
  productName: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    color: '#212529',
    lineHeight: '1.2',
    marginBottom: '8px',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '16px',
  },
  starIcon: {
    width: '16px',
    height: '16px',
  },
  ratingText: {
    fontSize: '14px',
    color: '#495057',
    marginLeft: '4px',
  },
  priceBlock: {
    marginBottom: '24px',
    paddingBottom: '24px',
    borderBottom: '1px solid #e9ecef',
  },
  price: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#4c6ef5',
    letterSpacing: '-0.02em',
  },
  originalPrice: {
    fontSize: '18px',
    color: '#868e96',
    textDecoration: 'line-through',
    marginLeft: '12px',
  },
  discountBadge: {
    display: 'inline-block',
    background: '#fff3e6',
    color: '#fd7e14',
    fontSize: '12px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '3px',
    marginLeft: '8px',
    letterSpacing: '0.02em',
  },
  taxInfo: {
    fontSize: '12px',
    color: '#868e96',
    marginTop: '4px',
  },
  variantSection: {
    marginBottom: '24px',
  },
  variantLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '10px',
    display: 'block',
  },
  variantAttrRow: {
    marginBottom: '16px',
  },
  variantChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  chip: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1.5px solid #868e96',
    fontSize: '14px',
    color: '#343a40',
    background: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
  },
  chipSelected: {
    borderColor: '#4c6ef5',
    background: '#e8ecfd',
    color: '#4c6ef5',
    fontWeight: '600',
  },
  chipDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
    background: '#e9ecef',
  },
  qtyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  qtyLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
  },
  qtyControl: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #868e96',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  qtyBtn: {
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  qtyBtnDisabled: {
    background: '#e9ecef',
    cursor: 'not-allowed',
  },
  qtyDisplay: {
    minWidth: '44px',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    borderLeft: '1px solid #868e96',
    borderRight: '1px solid #868e96',
    lineHeight: '44px',
  },
  qtyIcon: {
    width: '16px',
    height: '16px',
  },
  atcBtn: {
    width: '100%',
    padding: '14px 24px',
    borderRadius: '10px',
    background: '#4c6ef5',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    minHeight: '44px',
    marginBottom: '12px',
    transition: 'background 0.15s',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  atcBtnDisabled: {
    background: '#adb5bd',
    cursor: 'not-allowed',
  },
  atcBtnSuccess: {
    background: '#37b24d',
  },
  atcIcon: {
    width: '20px',
    height: '20px',
  },
  outOfStockBanner: {
    background: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '16px',
    textAlign: 'center',
  },
  errorMsg: {
    color: '#f03e3e',
    background: '#ffe3e3',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  successMsg: {
    color: '#37b24d',
    background: '#d3f9d8',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  descSection: {
    marginTop: '32px',
    padding: '24px',
    background: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
  },
  descTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '12px',
  },
  descText: {
    fontSize: '16px',
    color: '#343a40',
    lineHeight: '1.625',
  },
  skuCode: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '12px',
    color: '#868e96',
    background: '#f8f9fa',
    padding: '2px 6px',
    borderRadius: '3px',
    display: 'inline-block',
    marginTop: '4px',
  },
  skeleton: {
    background: 'linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.2s infinite',
    borderRadius: '6px',
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
  stockBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    fontWeight: '600',
    padding: '3px 10px',
    borderRadius: '9999px',
    marginBottom: '16px',
  },
  stockBadgeIn: {
    background: '#d3f9d8',
    color: '#37b24d',
  },
  stockBadgeLow: {
    background: '#fff4e6',
    color: '#fd7e14',
  },
  stockBadgeOut: {
    background: '#ffe3e3',
    color: '#f03e3e',
  },
};

function getCartId() {
  return localStorage.getItem('cartId');
}

function setCartId(id) {
  localStorage.setItem('cartId', id);
}

async function ensureCart() {
  let cartId = getCartId();
  if (cartId) return cartId;
  const res = await fetch(`${API_BASE}/carts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  if (res.ok) {
    const data = await res.json();
    cartId = data.data?.id || data.id || data.cartId;
    if (cartId) setCartId(cartId);
    return cartId;
  }
  throw new Error('Could not create cart');
}

function StockBadge({ qty }) {
  if (qty === 0) {
    return <span style={{ ...styles.stockBadge, ...styles.stockBadgeOut }}>Out of Stock</span>;
  }
  if (qty <= 5) {
    return <span style={{ ...styles.stockBadge, ...styles.stockBadgeLow }}>Only {qty} left</span>;
  }
  return <span style={{ ...styles.stockBadge, ...styles.stockBadgeIn }}><img src={checkIcon} alt="" style={{ width: 12 }} /> In Stock</span>;
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [skus, setSkus] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedAttrs, setSelectedAttrs] = useState({});
  const [selectedSku, setSelectedSku] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [cartError, setCartError] = useState(null);

  // Fetch product by slug via GET /products (filter by slug) or direct ID if needed
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Try fetching by slug via product list
        const listRes = await fetch(`${API_BASE}/products?slug=${encodeURIComponent(slug)}&limit=1`);
        let productData = null;
        if (listRes.ok) {
          const listData = await listRes.json();
          const items = listData.data || listData.products || [];
          productData = items.find(p => p.slug === slug) || items[0] || null;
        }
        // Fallback: try /products/:slug as productId (some backends accept slug)
        if (!productData) {
          const directRes = await fetch(`${API_BASE}/products/${encodeURIComponent(slug)}`);
          if (directRes.ok) {
            const d = await directRes.json();
            productData = d.data || d.product || d;
          }
        }
        if (!productData) throw new Error('Product not found');
        setProduct(productData);

        const productId = productData.id;

        // Fetch SKUs
        const skusRes = await fetch(`${API_BASE}/products/${productId}/skus`);
        if (skusRes.ok) {
          const sd = await skusRes.json();
          const skuList = sd.data || sd.skus || [];
          setSkus(skuList);
          if (skuList.length > 0) setSelectedSku(skuList[0]);
        }

        // Fetch images
        const imgsRes = await fetch(`${API_BASE}/products/${productId}/images`);
        if (imgsRes.ok) {
          const id = await imgsRes.json();
          const imgList = id.data || id.images || [];
          setImages(imgList);
        }
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  // Derive attribute options from SKUs
  const attrMap = {};
  skus.forEach(sku => {
    if (sku.attributes && typeof sku.attributes === 'object') {
      Object.entries(sku.attributes).forEach(([key, val]) => {
        if (!attrMap[key]) attrMap[key] = new Set();
        attrMap[key].add(val);
      });
    }
  });
  const attrKeys = Object.keys(attrMap);

  function handleAttrSelect(key, value) {
    const next = { ...selectedAttrs, [key]: value };
    setSelectedAttrs(next);
    // Find matching SKU
    const matched = skus.find(sku =>
      sku.attributes && Object.entries(next).every(([k, v]) => sku.attributes[k] === v)
    );
    if (matched) setSelectedSku(matched);
    setQuantity(1);
  }

  function isAttrAvailable(key, value) {
    const tentative = { ...selectedAttrs, [key]: value };
    return skus.some(sku =>
      sku.attributes && Object.entries(tentative).every(([k, v]) => sku.attributes[k] === v)
    );
  }

  const stockQty = selectedSku?.stock_quantity ?? selectedSku?.quantity ?? null;
  const outOfStock = stockQty !== null && stockQty === 0;
  const maxQty = stockQty !== null ? Math.min(stockQty, 10) : 10;

  async function handleAddToCart() {
    if (!selectedSku) return;
    setAddingToCart(true);
    setCartError(null);
    setCartSuccess(false);
    try {
      const cartId = await ensureCart();
      const res = await fetch(`${API_BASE}/carts/${cartId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku_id: selectedSku.id, quantity }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to add to cart');
      }
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 3000);
    } catch (err) {
      setCartError(err.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  }

  const displayImages = images.length > 0
    ? images.map(i => i.url || i.image_url || i)
    : product?.primary_image_url
      ? [product.primary_image_url]
      : [placeholderProduct];

  const displayPrice = selectedSku?.price ?? product?.base_price ?? null;
  const originalPrice = selectedSku?.original_price ?? product?.original_price ?? null;
  const discountPct = displayPrice && originalPrice && originalPrice > displayPrice
    ? Math.round((1 - displayPrice / originalPrice) * 100)
    : null;

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ ...styles.layout }}>
            <div style={{ ...styles.skeleton, aspectRatio: '1', width: '100%', borderRadius: '16px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ ...styles.skeleton, height: '16px', width: '30%' }} />
              <div style={{ ...styles.skeleton, height: '40px', width: '80%' }} />
              <div style={{ ...styles.skeleton, height: '36px', width: '50%' }} />
              <div style={{ ...styles.skeleton, height: '20px', width: '40%', marginTop: '8px' }} />
              <div style={{ ...styles.skeleton, height: '44px', width: '100%', marginTop: '16px' }} />
            </div>
          </div>
        </div>
        <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorMsg} role="alert">{error || 'Product not found'}</div>
          <Link to="/products" style={{ color: '#4c6ef5', fontSize: '14px' }}>← Back to Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Breadcrumb */}
        <nav style={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/" style={styles.breadcrumbLink}>Home</Link>
          <span>/</span>
          <Link to="/products" style={styles.breadcrumbLink}>Products</Link>
          {product.category_name && (
            <>
              <span>/</span>
              <Link
                to={`/categories/${product.category_slug || product.category_id}/products`}
                style={styles.breadcrumbLink}
              >
                {product.category_name}
              </Link>
            </>
          )}
          <span>/</span>
          <span style={{ color: '#212529' }}>{product.name}</span>
        </nav>

        <div style={styles.layout}>
          {/* Image Section */}
          <div style={styles.imageSection}>
            <img
              src={displayImages[activeImageIdx] || placeholderProduct}
              alt={product.name}
              style={styles.mainImage}
              onError={e => { e.target.src = placeholderProduct; }}
            />
            {displayImages.length > 1 && (
              <div style={styles.thumbnailRow}>
                {displayImages.map((src, idx) => (
                  <img
                    key={idx}
                    src={src || placeholderProduct}
                    alt={`${product.name} view ${idx + 1}`}
                    style={{
                      ...styles.thumbnail,
                      ...(idx === activeImageIdx ? styles.thumbnailActive : {}),
                    }}
                    onClick={() => setActiveImageIdx(idx)}
                    onError={e => { e.target.src = placeholderProduct; }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div style={styles.infoSection}>
            {product.brand_name && (
              <Link
                to={`/products?brand=${product.brand_id}`}
                style={styles.brand}
              >
                {product.brand_name}
              </Link>
            )}

            <h1 style={styles.productName}>{product.name}</h1>

            {selectedSku?.sku_code && (
              <span style={styles.skuCode}>SKU: {selectedSku.sku_code}</span>
            )}

            {/* Price Block */}
            <div style={styles.priceBlock}>
              <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px', marginTop: '16px' }}>
                {displayPrice != null ? (
                  <span style={styles.price}>
                    ₹{Number(displayPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                ) : null}
                {originalPrice && originalPrice > displayPrice && (
                  <span style={styles.originalPrice}>
                    ₹{Number(originalPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                )}
                {discountPct && (
                  <span style={styles.discountBadge}>{discountPct}% OFF</span>
                )}
              </div>
              <div style={styles.taxInfo}>Price inclusive of all taxes</div>
            </div>

            {/* Stock */}
            {stockQty !== null && <StockBadge qty={stockQty} />}

            {/* Variant Picker */}
            {attrKeys.length > 0 && (
              <div style={styles.variantSection}>
                {attrKeys.map(key => (
                  <div key={key} style={styles.variantAttrRow}>
                    <span style={styles.variantLabel}>
                      {key}{selectedAttrs[key] ? `: ${selectedAttrs[key]}` : ''}
                    </span>
                    <div style={styles.variantChips}>
                      {[...attrMap[key]].map(val => {
                        const available = isAttrAvailable(key, val);
                        const selected = selectedAttrs[key] === val;
                        return (
                          <button
                            key={val}
                            style={{
                              ...styles.chip,
                              ...(selected ? styles.chipSelected : {}),
                              ...(!available ? styles.chipDisabled : {}),
                            }}
                            onClick={() => available && handleAttrSelect(key, val)}
                            disabled={!available}
                            aria-pressed={selected}
                            aria-label={`${key}: ${val}${!available ? ' (unavailable)' : ''}`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            {!outOfStock && (
              <div style={styles.qtyRow}>
                <span style={styles.qtyLabel}>Qty</span>
                <div style={styles.qtyControl}>
                  <button
                    style={{ ...styles.qtyBtn, ...(quantity <= 1 ? styles.qtyBtnDisabled : {}) }}
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <img src={minusIcon} alt="Decrease" style={styles.qtyIcon} />
                  </button>
                  <span style={styles.qtyDisplay} aria-live="polite" aria-label={`Quantity: ${quantity}`}>
                    {quantity}
                  </span>
                  <button
                    style={{ ...styles.qtyBtn, ...(quantity >= maxQty ? styles.qtyBtnDisabled : {}) }}
                    onClick={() => setQuantity(q => Math.min(maxQty, q + 1))}
                    disabled={quantity >= maxQty}
                    aria-label="Increase quantity"
                  >
                    <img src={plusIcon} alt="Increase" style={styles.qtyIcon} />
                  </button>
                </div>
              </div>
            )}

            {/* Out of Stock Banner */}
            {outOfStock && (
              <div style={styles.outOfStockBanner} role="status">
                Currently out of stock
              </div>
            )}

            {/* Cart Feedback */}
            {cartSuccess && (
              <div style={styles.successMsg} role="status">
                Item added to cart successfully!
              </div>
            )}
            {cartError && (
              <div style={styles.errorMsg} role="alert">{cartError}</div>
            )}

            {/* Add to Cart */}
            <button
              style={{
                ...styles.atcBtn,
                ...(outOfStock || addingToCart || !selectedSku ? styles.atcBtnDisabled : {}),
                ...(cartSuccess ? styles.atcBtnSuccess : {}),
              }}
              onClick={handleAddToCart}
              disabled={outOfStock || addingToCart || !selectedSku}
              aria-busy={addingToCart}
            >
              {cartSuccess ? (
                <><img src={checkIcon} alt="" style={styles.atcIcon} />Added to Cart</>
              ) : addingToCart ? (
                'Adding…'
              ) : (
                <><img src={cartIcon} alt="" style={styles.atcIcon} />Add to Cart</>
              )}
            </button>
          </div>
        </div>

        {/* Description Section */}
        {product.description && (
          <div style={styles.descSection}>
            <h2 style={styles.descTitle}>Product Details</h2>
            <p style={styles.descText}>{product.description}</p>
          </div>
        )}

        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div style={{ ...styles.descSection, marginTop: '16px' }}>
            <h2 style={styles.descTitle}>Specifications</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <tbody>
                {Object.entries(product.specifications).map(([key, val]) => (
                  <tr key={key}>
                    <td style={{ padding: '8px 12px 8px 0', color: '#495057', fontWeight: '500', width: '40%', borderBottom: '1px solid #e9ecef' }}>{key}</td>
                    <td style={{ padding: '8px 0', color: '#343a40', borderBottom: '1px solid #e9ecef' }}>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (max-width: 768px) {
          .pdp-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
