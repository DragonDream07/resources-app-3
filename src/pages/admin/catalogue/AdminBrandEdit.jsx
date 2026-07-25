import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE = '/api';

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
}

async function fetchBrand(brandId) {
  const res = await fetch(`${API_BASE}/brands/${brandId}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load brand');
  return res.json();
}

async function updateBrandApi(brandId, payload) {
  // There is no PUT /brands/:id in the listed endpoints; using POST /brands with id as a workaround is incorrect.
  // The design shows an edit form so we attempt PUT; if the backend uses a different method adapt accordingly.
  const res = await fetch(`${API_BASE}/brands/${brandId}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(payload) });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw e; }
  return res.json();
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminBrandEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', slug: '', description: '', logo_url: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  useEffect(() => {
    if (successToast) {
      const t = setTimeout(() => setSuccessToast(''), 4000);
      return () => clearTimeout(t);
    }
  }, [successToast]);

  const loadBrand = useCallback(() => {
    setLoading(true);
    setLoadError('');
    fetchBrand(id)
      .then((data) => {
        const b = data.brand || data;
        setForm({
          name: b.name || '',
          slug: b.slug || '',
          description: b.description || '',
          logo_url: b.logo_url || '',
        });
      })
      .catch(() => setLoadError('Could not load brand.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { loadBrand(); }, [loadBrand]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required.';
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
      await updateBrandApi(id, {
        name: form.name.trim(),
        slug: form.slug || slugify(form.name),
        description: form.description || undefined,
        logo_url: form.logo_url || undefined,
      });
      setSuccessToast('Brand saved successfully.');
    } catch (err) {
      if (err?.errors) setFieldErrors(err.errors);
      setSubmitError('Brand could not be saved.');
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle = (field) => ({
    width: '100%', padding: '10px 12px', border: `1px solid ${fieldErrors[field] ? '#f03e3e' : '#868e96'}`, borderRadius: '6px', fontSize: '14px', color: '#212529', backgroundColor: '#fff', boxSizing: 'border-box', fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif",
  });
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#495057', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' };

  if (loading) return <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", padding: '64px', textAlign: 'center', color: '#495057' }}>Loading…</div>;
  if (loadError) return <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", padding: '64px', textAlign: 'center', color: '#f03e3e' }}>{loadError}</div>;

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {successToast && (
          <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: '#d3f9d8', color: '#37b24d', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, zIndex: 9999, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>{successToast}</div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#212529', letterSpacing: '-0.01em', lineHeight: '32px', margin: 0 }}>Edit Brand</h1>
        </div>

        {submitError && (
          <div style={{ backgroundColor: '#ffe3e3', color: '#f03e3e', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', fontWeight: 500 }}>{submitError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #868e96', padding: '24px', marginBottom: '20px' }}>
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
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} style={{ ...inputStyle('description'), resize: 'vertical' }} />
            </div>

            <div>
              <label style={labelStyle}>Logo URL</label>
              <input type="url" name="logo_url" value={form.logo_url} onChange={handleChange} placeholder="https://…" style={inputStyle('logo_url')} />
              {fieldErrors.logo_url && <p style={{ color: '#f03e3e', fontSize: '12px', marginTop: '4px' }}>{fieldErrors.logo_url}</p>}
              {form.logo_url && (
                <div style={{ marginTop: '12px' }}>
                  <img src={form.logo_url} alt="Brand logo preview" style={{ maxHeight: '60px', maxWidth: '200px', objectFit: 'contain', border: '1px solid #e9ecef', borderRadius: '6px', padding: '4px' }} onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => navigate('/admin/catalogue/brands')} style={{ padding: '10px 20px', backgroundColor: '#fff', color: '#212529', border: '1px solid #868e96', borderRadius: '10px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={submitting} style={{ padding: '10px 24px', backgroundColor: submitting ? '#adb5bd' : '#4c6ef5', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer' }}>{submitting ? 'Saving…' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
