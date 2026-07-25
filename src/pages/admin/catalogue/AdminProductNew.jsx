import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = '/api';

async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!res.ok) throw new Error('Failed to load categories');
  return res.json();
}

async function fetchBrands() {
  const res = await fetch(`${API_BASE}/brands`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!res.ok) throw new Error('Failed to load brands');
  return res.json();
}

async function createProduct(payload) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }
  return res.json();
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminProductNew() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', slug: '', description: '', category_id: '', brand_id: '', base_price: '', tax_rate: '', is_active: true });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [refLoading, setRefLoading] = useState(true);
  const [catError, setCatError] = useState(false);
  const [brandError, setBrandError] = useState(false);

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

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'name') setForm((prev) => ({ ...prev, name: value, slug: slugify(value) }));
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
      const created = await createProduct({
        name: form.name.trim(),
        slug: form.slug || slugify(form.name),
        description: form.description,
        category_id: form.category_id || undefined,
        brand_id: form.brand_id || undefined,
        base_price: Number(form.base_price),
        tax_rate: Number(form.tax_rate),
        is_active: form.is_active,
      });
      navigate(`/admin/catalogue/products/${created.id || created.product?.id}/edit`, { state: { successToast: 'Product created successfully.' } });
    } catch (err) {
      if (err?.errors) setFieldErrors(err.errors);
      setSubmitError('Product could not be saved.');
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle = (field) => ({
    width: '100%', padding: '10px 12px', border: `1px solid ${fieldErrors[field] ? '#f03e3e' : '#868e96'}`, borderRadius: '6px', fontSize: '14px', color: '#212529', backgroundColor: '#fff', boxSizing: 'border-box', fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif",
  });

  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#495057', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' };

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#212529', letterSpacing: '-0.01em', lineHeight: '32px', margin: 0 }}>New Product</h1>
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
                  <p style={{ color: '#f03e3e', fontSize: '13px' }}>Could not load options — <button type="button" onClick={() => { setCatError(false); setRefLoading(true); fetchCategories().then((d) => setCategories(d.categories || d.data || d)).catch(() => setCatError(true)).finally(() => setRefLoading(false)); }} style={{ background: 'none', border: 'none', color: '#4c6ef5', cursor: 'pointer', fontSize: '13px', padding: 0 }}>retry</button></p>
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
                  <p style={{ color: '#f03e3e', fontSize: '13px' }}>Could not load options — <button type="button" onClick={() => { setBrandError(false); setRefLoading(true); fetchBrands().then((d) => setBrands(d.brands || d.data || d)).catch(() => setBrandError(true)).finally(() => setRefLoading(false)); }} style={{ background: 'none', border: 'none', color: '#4c6ef5', cursor: 'pointer', fontSize: '13px', padding: 0 }}>retry</button></p>
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

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => navigate('/admin/catalogue/products')} style={{ padding: '10px 20px', backgroundColor: '#fff', color: '#212529', border: '1px solid #868e96', borderRadius: '10px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={submitting} style={{ padding: '10px 24px', backgroundColor: submitting ? '#adb5bd' : '#4c6ef5', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer' }}>{submitting ? 'Saving…' : 'Create Product'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
