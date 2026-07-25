import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import plusIcon from '@/assets/icons/plus.svg';
import trashIcon from '@/assets/icons/trash.svg';

const API_BASE = '/api';

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
}

async function fetchProduct(productId) {
  const res = await fetch(`${API_BASE}/products/${productId}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load product');
  return res.json();
}
async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}
async function fetchBrands() {
  const res = await fetch(`${API_BASE}/brands`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}
async function fetchSkus(productId) {
  const res = await fetch(`${API_BASE}/products/${productId}/skus`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}
async function updateProduct(productId, payload) {
  const res = await fetch(`${API_BASE}/products/${productId}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(payload) });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw e; }
  return res.json();
}
async function createSku(productId, payload) {
  const res = await fetch(`${API_BASE}/products/${productId}/skus`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw e; }
  return res.json();
}
async function updateSku(productId, skuId, payload) {
  const res = await fetch(`${API_BASE}/products/${productId}/skus/${skuId}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(payload) });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw e; }
  return res.json();
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ name: '', slug: '', description: '', category_id: '', brand_id: '', base_price: '', tax_rate: '', is_active: true });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [productLoadError, setProductLoadError] = useState('');
  const [successToast, setSuccessToast] = useState(location.state?.successToast || '');

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [refLoading, setRefLoading] = useState(true);
  const [catError, setCatError] = useState(false);
  const [brandError, setBrandError] = useState(false);

  const [skus, setSkus] = useState([]);
  const [skuLoading, setSkuLoading] = useState(true);
  const [skuError, setSkuError] = useState('');
  const [newSku, setNewSku] = useState({ sku_code: '', price: '', stock_qty: '', attributes: '' });
  const [addingSkuError, setAddingSkuError] = useState('');
  const [addingSku, setAddingSku] = useState(false);

  useEffect(() => {
    if (successToast) {
      const t = setTimeout(() => setSuccessToast(''), 4000);
      return () => clearTimeout(t);
    }
  }, [successToast]);

  const loadProduct = useCallback(() => {
    setLoadingProduct(true);
    setProductLoadError('');
    fetchProduct(id)
      .then((data) => {
        const p = data.product || data;
        setForm({
          name: p.name || '',
          slug: p.slug || '',
          description: p.description || '',
          category_id: p.category_id || '',
          brand_id: p.brand_id || '',
          base_price: p.base_price != null ? String(p.base_price) : '',
          tax_rate: p.tax_rate != null ? String(p.tax_rate) : '',
          is_active: p.is_active !== undefined ? p.is_active : true,
        });
      })
      .catch(() => setProductLoadError('Could not load product.'))
      .finally(() => setLoadingProduct(false));
  }, [id]);

  useEffect(() => { loadProduct(); }, [loadProduct]);

  useEffect(() => {
    setRefLoading(true);
    Promise.allSettled([fetchCategories(), fetchBrands()]).then(([catRes, brandRes]) => {
      if (catRes.status === 'fulfilled') setCategories(catRes.value.categories || catRes.value.data || catRes.value);
      else setCatError(true);
      if (brandRes.status === 'fulfilled') setBrands(brandRes.value.brands || brandRes.value.data || brandRes.value);
      else setBrandError(true);
      setRefLoading(false);
    });
  }, []);

  useEffect(() => {
    setSkuLoading(true);
    fetchSkus(id)
      .then((data) => setSkus(data.skus || data.data || data))
      .catch(() => setSkuError('Could not load SKUs.'))
      .finally(() => setSkuLoading(false));
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required.';
    if (!form.base_price || isNaN(Number(form.base_price)) || Number(form.base_price) < 0) errors.base_price = 'Base price is required and must be a non-negative number.';
    if (form.tax_rate === '' || isNaN(Number(form.tax_rate)) || Number(form.tax_rate) < 0) errors.tax_rate = 'Tax rate is required and must be a non-negative number.';
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    setFieldErrors({});
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setSubmitting(true);
    try {
      await updateProduct(id, {
        name: form.name.trim(),
        slug: form.slug || slugify(form.name),
        description: form.description,
        category_id: form.category_id || undefined,
        brand_id: form.brand_id || undefined,
        base_price: Number(form.base_price),
        tax_rate: Number(form.tax_rate),
        is_active: form.is_active,
      });
      setSuccessToast('Product saved successfully.');
    } catch (err) {
      if (err?.errors) setFieldErrors(err.errors);
      setSubmitError('Product could not be saved.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddSku(e) {
    e.preventDefault();
    setAddingSkuError('');
    if (!newSku.sku_code.trim()) { setAddingSkuError('SKU code is required.'); return; }
    if (!newSku.price || isNaN(Number(newSku.price))) { setAddingSkuError('Price is required.'); return; }
    setAddingSku(true);
    try {
      let attrs = {};
      if (newSku.attributes.trim()) {
        try { attrs = JSON.parse(newSku.attributes); } catch { setAddingSkuError('Attributes must be valid JSON.'); setAddingSku(false); return; }
      }
      const created = await createSku(id, { sku_code: newSku.sku_code.trim(), price: Number(newSku.price), stock_qty: Number(newSku.stock_qty) || 0, attributes: attrs });
      setSkus((prev) => [...prev, created.sku || created]);
      setNewSku({ sku_code: '', price: '', stock_qty: '', attributes: '' });
    } catch {
      setAddingSkuError('Could not add SKU.');
    } finally {
      setAddingSku(false);
    }
  }

  async function handleUpdateSkuField(sku, field, value) {
    try {
      const updated = await updateSku(id, sku.id, { ...sku, [field]: field === 'price' || field === 'stock_qty' ? Number(value) : value });
      setSkus((prev) => prev.map((s) => s.id === sku.id ? (updated.sku || updated) : s));
    } catch {
      // silently fail inline
    }
  }

  const inputStyle = (field) => ({
    width: '100%', padding: '10px 12px', border: `1px solid ${fieldErrors[field] ? '#f03e3e' : '#868e96'}`, borderRadius: '6px', fontSize: '14px', color: '#212529', backgroundColor: '#fff', boxSizing: 'border-box', fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif",
  });
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#495057', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' };

  if (loadingProduct) {
    return <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", padding: '64px', textAlign: 'center', color: '#495057' }}>Loading product…</div>;
  }
  if (productLoadError) {
    return <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", padding: '64px', textAlign: 'center', color: '#f03e3e' }}>{productLoadError}</div>;
  }

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {successToast && (
          <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: '#d3f9d8', color: '#37b24d', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, zIndex: 9999, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>{successToast}</div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#212529', letterSpacing: '-0.01em', lineHeight: '32px', margin: 0 }}>Edit Product</h1>
        </div>

        {submitError && (
          <div style={{ backgroundColor: '#ffe3e3', color: '#f03e3e', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', fontWeight: 500 }}>{submitError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #868e96', padding: '24px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#212529', margin: '0 0 20px 0' }}>Basic Information</h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Name <span style={{ color: '#f03e3e' }}>*</span></label>
              <input type="text" name="name" value={form.name} onChange={handleChange} style={inputStyle('name')} />
              {fieldErrors.name && <p style={{ color: '#f03e3e', fontSize: '12px', marginTop: '4px' }}>{fieldErrors.name}</p>}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Slug</label>
              <input type="text" name="slug" value={form.slug} onChange={handleChange} style={inputStyle('slug')} />
              {fieldErrors.slug && <p style={{ color: '#f03e3e', fontSize: '12px', marginTop: '4px' }}>{fieldErrors.slug}</p>}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} style={{ ...inputStyle('description'), resize: 'vertical' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Category</label>
                {refLoading ? (
                  <div style={{ height: '40px', backgroundColor: '#e9ecef', borderRadius: '6px' }} />
                ) : catError ? (
                  <p style={{ color: '#f03e3e', fontSize: '13px' }}>Could not load options — <button type="button" onClick={() => { setCatError(false); fetchCategories().then((d) => setCategories(d.categories || d.data || d)).catch(() => setCatError(true)); }} style={{ background: 'none', border: 'none', color: '#4c6ef5', cursor: 'pointer', fontSize: '13px', padding: 0 }}>retry</button></p>
                ) : (
                  <select name="category_id" value={form.category_id} onChange={handleChange} style={inputStyle('category_id')}>
                    <option value="">Select category…</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                )}
              </div>
              <div>
                <label style={labelStyle}>Brand</label>
                {refLoading ? (
                  <div style={{ height: '40px', backgroundColor: '#e9ecef', borderRadius: '6px' }} />
                ) : brandError ? (
                  <p style={{ color: '#f03e3e', fontSize: '13px' }}>Could not load options — <button type="button" onClick={() => { setBrandError(false); fetchBrands().then((d) => setBrands(d.brands || d.data || d)).catch(() => setBrandError(true)); }} style={{ background: 'none', border: 'none', color: '#4c6ef5', cursor: 'pointer', fontSize: '13px', padding: 0 }}>retry</button></p>
                ) : (
                  <select name="brand_id" value={form.brand_id} onChange={handleChange} style={inputStyle('brand_id')}>
                    <option value="">Select brand…</option>
                    {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Base Price (₹) <span style={{ color: '#f03e3e' }}>*</span></label>
                <input type="number" name="base_price" value={form.base_price} onChange={handleChange} min="0" step="0.01" style={inputStyle('base_price')} />
                {fieldErrors.base_price && <p style={{ color: '#f03e3e', fontSize: '12px', marginTop: '4px' }}>{fieldErrors.base_price}</p>}
              </div>
              <div>
                <label style={labelStyle}>Tax Rate (%) <span style={{ color: '#f03e3e' }}>*</span></label>
                <input type="number" name="tax_rate" value={form.tax_rate} onChange={handleChange} min="0" step="0.01" style={inputStyle('tax_rate')} />
                {fieldErrors.tax_rate && <p style={{ color: '#f03e3e', fontSize: '12px', marginTop: '4px' }}>{fieldErrors.tax_rate}</p>}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" id="is_active" name="is_active" checked={form.is_active} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              <label htmlFor="is_active" style={{ fontSize: '14px', color: '#212529', cursor: 'pointer' }}>Active</label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginBottom: '32px' }}>
            <button type="button" onClick={() => navigate('/admin/catalogue/products')} style={{ padding: '10px 20px', backgroundColor: '#fff', color: '#212529', border: '1px solid #868e96', borderRadius: '10px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={submitting} style={{ padding: '10px 24px', backgroundColor: submitting ? '#adb5bd' : '#4c6ef5', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer' }}>{submitting ? 'Saving…' : 'Save Changes'}</button>
          </div>
        </form>

        {/* SKUs Section */}
        <div style={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #868e96', padding: '24px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#212529', margin: '0 0 20px 0' }}>SKUs</h2>
          {skuLoading ? (
            <div style={{ color: '#495057', fontSize: '14px' }}>Loading SKUs…</div>
          ) : skuError ? (
            <div style={{ color: '#f03e3e', fontSize: '14px' }}>{skuError}</div>
          ) : (
            <>
              {skus.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', marginBottom: '20px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #868e96' }}>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#495057', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>SKU Code</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#495057', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Price (₹)</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#495057', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Stock</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#495057', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Attributes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skus.map((sku, idx) => (
                      <tr key={sku.id} style={{ borderBottom: idx < skus.length - 1 ? '1px solid #e9ecef' : 'none' }}>
                        <td style={{ padding: '10px 12px', fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace", fontSize: '13px', color: '#212529' }}>{sku.sku_code}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <input
                            type="number"
                            defaultValue={sku.price}
                            onBlur={(e) => handleUpdateSkuField(sku, 'price', e.target.value)}
                            step="0.01" min="0"
                            style={{ width: '100px', padding: '6px 8px', border: '1px solid #868e96', borderRadius: '6px', fontSize: '13px' }}
                          />
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <input
                            type="number"
                            defaultValue={sku.stock_qty}
                            onBlur={(e) => handleUpdateSkuField(sku, 'stock_qty', e.target.value)}
                            min="0"
                            style={{ width: '80px', padding: '6px 8px', border: '1px solid #868e96', borderRadius: '6px', fontSize: '13px' }}
                          />
                        </td>
                        <td style={{ padding: '10px 12px', color: '#495057', fontSize: '13px' }}>{sku.attributes ? JSON.stringify(sku.attributes) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div style={{ borderTop: skus.length > 0 ? '1px solid #e9ecef' : 'none', paddingTop: skus.length > 0 ? '20px' : 0 }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#212529', margin: '0 0 12px 0' }}>Add SKU</h3>
                {addingSkuError && <p style={{ color: '#f03e3e', fontSize: '12px', marginBottom: '10px' }}>{addingSkuError}</p>}
                <form onSubmit={handleAddSku} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr auto', gap: '12px', alignItems: 'flex-end' }}>
                  <div>
                    <label style={labelStyle}>SKU Code</label>
                    <input type="text" value={newSku.sku_code} onChange={(e) => setNewSku((p) => ({ ...p, sku_code: e.target.value }))} style={{ width: '100%', padding: '8px 10px', border: '1px solid #868e96', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Price (₹)</label>
                    <input type="number" value={newSku.price} onChange={(e) => setNewSku((p) => ({ ...p, price: e.target.value }))} min="0" step="0.01" style={{ width: '100%', padding: '8px 10px', border: '1px solid #868e96', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Stock Qty</label>
                    <input type="number" value={newSku.stock_qty} onChange={(e) => setNewSku((p) => ({ ...p, stock_qty: e.target.value }))} min="0" style={{ width: '100%', padding: '8px 10px', border: '1px solid #868e96', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Attributes (JSON)</label>
                    <input type="text" value={newSku.attributes} onChange={(e) => setNewSku((p) => ({ ...p, attributes: e.target.value }))} placeholder='{"color":"red"}' style={{ width: '100%', padding: '8px 10px', border: '1px solid #868e96', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <button type="submit" disabled={addingSku} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#4c6ef5', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: addingSku ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
                      <img src={plusIcon} alt="" width={14} height={14} style={{ filter: 'brightness(0) invert(1)' }} />
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
