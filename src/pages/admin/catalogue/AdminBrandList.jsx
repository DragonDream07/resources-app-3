import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import plusIcon from '@/assets/icons/plus.svg';
import editIcon from '@/assets/icons/edit.svg';

const API_BASE = '/api';

async function fetchBrands() {
  const res = await fetch(`${API_BASE}/brands`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!res.ok) throw new Error('Failed to load brands');
  return res.json();
}

export default function AdminBrandList() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchBrands()
      .then((data) => setBrands(data.brands || data.data || data))
      .catch(() => setError('Could not load brands.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#212529', letterSpacing: '-0.01em', lineHeight: '32px', margin: 0 }}>Brands</h1>
          <Link
            to="/admin/catalogue/brands/new"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#4c6ef5', color: '#fff', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}
          >
            <img src={plusIcon} alt="" width={16} height={16} style={{ filter: 'brightness(0) invert(1)' }} />
            New Brand
          </Link>
        </div>

        {error && <div style={{ backgroundColor: '#ffe3e3', color: '#f03e3e', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

        <div style={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #868e96', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#495057', fontSize: '14px' }}>Loading…</div>
          ) : brands.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#495057', fontSize: '14px' }}>No brands found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #868e96' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#495057', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Slug</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#495057', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand, idx) => (
                  <tr key={brand.id} style={{ borderBottom: idx < brands.length - 1 ? '1px solid #e9ecef' : 'none' }}>
                    <td style={{ padding: '12px 16px', color: '#212529', fontWeight: 500 }}>{brand.name}</td>
                    <td style={{ padding: '12px 16px', color: '#495057', fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace", fontSize: '12px' }}>{brand.slug}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button onClick={() => navigate(`/admin/catalogue/brands/${brand.id}/edit`)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', backgroundColor: '#e8ecfd', color: '#4c6ef5', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                        <img src={editIcon} alt="" width={13} height={13} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
