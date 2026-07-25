import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import trashIcon from '@/assets/icons/trash.svg';
import editIcon from '@/assets/icons/edit.svg';
import plusIcon from '@/assets/icons/plus.svg';
import searchIcon from '@/assets/icons/search.svg';

const API_BASE = '/api';

async function fetchProducts(params) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/products?${qs}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!res.ok) throw new Error('Failed to load products');
  return res.json();
}

async function deleteProduct(productId) {
  const res = await fetch(`${API_BASE}/products/${productId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!res.ok) throw new Error('Failed to delete product');
}

export default function AdminProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const limit = 20;

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchProducts({ page, limit, search })
      .then((data) => {
        setProducts(data.products || data.data || []);
        setTotal(data.total || 0);
      })
      .catch(() => setError('Could not load products.'))
      .finally(() => setLoading(false));
  }, [page, search]);

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  }

  async function handleDelete(productId) {
    if (!window.confirm('Delete this product?')) return;
    setDeleteError('');
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setTotal((t) => t - 1);
    } catch {
      setDeleteError('Could not delete product.');
    }
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#212529', letterSpacing: '-0.01em', lineHeight: '32px', margin: 0 }}>Products</h1>
          <Link
            to="/admin/catalogue/products/new"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#4c6ef5', color: '#fff', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}
          >
            <img src={plusIcon} alt="" width={16} height={16} style={{ filter: 'brightness(0) invert(1)' }} />
            New Product
          </Link>
        </div>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <img src={searchIcon} alt="" width={16} height={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products…"
              style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #868e96', borderRadius: '6px', fontSize: '14px', color: '#212529', backgroundColor: '#fff', boxSizing: 'border-box' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4c6ef5', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Search</button>
        </form>

        {deleteError && <div style={{ backgroundColor: '#ffe3e3', color: '#f03e3e', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{deleteError}</div>}
        {error && <div style={{ backgroundColor: '#ffe3e3', color: '#f03e3e', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

        <div style={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #868e96', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#495057', fontSize: '14px' }}>Loading…</div>
          ) : products.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#495057', fontSize: '14px' }}>No products found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #868e96' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Slug</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Brand</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Base Price</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#495057', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => (
                  <tr key={product.id} style={{ borderBottom: idx < products.length - 1 ? '1px solid #e9ecef' : 'none' }}>
                    <td style={{ padding: '12px 16px', color: '#212529', fontWeight: 500 }}>{product.name}</td>
                    <td style={{ padding: '12px 16px', color: '#495057', fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace", fontSize: '12px' }}>{product.slug}</td>
                    <td style={{ padding: '12px 16px', color: '#495057' }}>{product.brand?.name || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#212529' }}>{product.base_price != null ? `₹${Number(product.base_price).toFixed(2)}` : '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ backgroundColor: product.is_active ? '#d3f9d8' : '#e9ecef', color: product.is_active ? '#37b24d' : '#495057', padding: '2px 8px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600 }}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => navigate(`/admin/catalogue/products/${product.id}/edit`)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', backgroundColor: '#e8ecfd', color: '#4c6ef5', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                          <img src={editIcon} alt="" width={14} height={14} />
                          Edit
                        </button>
                        <button onClick={() => handleDelete(product.id)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', backgroundColor: '#ffe3e3', color: '#f03e3e', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                          <img src={trashIcon} alt="" width={14} height={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} style={{ padding: '8px 16px', border: '1px solid #868e96', borderRadius: '6px', backgroundColor: page === 1 ? '#e9ecef' : '#fff', color: page === 1 ? '#adb5bd' : '#212529', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: '14px' }}>Previous</button>
            <span style={{ padding: '8px 16px', fontSize: '14px', color: '#495057' }}>Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} style={{ padding: '8px 16px', border: '1px solid #868e96', borderRadius: '6px', backgroundColor: page === totalPages ? '#e9ecef' : '#fff', color: page === totalPages ? '#adb5bd' : '#212529', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: '14px' }}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
