import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE = '/api';

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
}

async function fetchCategory(categoryId) {
  const res = await fetch(`${API_BASE}/categories/${categoryId}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load category');
  return res.json();
}
async function fetchAllCategories() {
  const res = await fetch(`${API_BASE}/categories`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load categories');
  return res.json();
}
async function updateCategory(categoryId, payload) {
  const res = await fetch(`${API_BASE}/categories/${categoryId}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(payload) });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw e; }
  return res.json();
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminCategoryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', slug: '', parent_id: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingCat, setLoadingCat] = useState(true);
  const [catLoadError, setCatLoadError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const [allCategories, setAllCategories] = useState([]);
  const [allCatLoading, setAllCatLoading] = useState(true);
  const [allCatError, setAllCatError] = useState(false);

  useEffect(() => {
    if (successToast) {
      const t = setTimeout(() => setSuccessToast(''), 4000);
      return () => clearTimeout(t);
    }
  }, [successToast]);

  const loadCategory = useCallback(() => {
    setLoadingCat(true);
    setCatLoadError('');
    fetchCategory(id)
      .then((data) => {
        const c = data.category || data;
        setForm({ name: c.name || '', slug: c.slug || '', parent_id: c.parent_id || '' });
      })
      .catch(() => setCatLoadError('Could not load category.'))
      .finally(() => setLoadingCat(false));
  }, [id]);

  useEffect(() => { loadCategory(); }, [loadCategory]);

  useEffect(() => {
    setAllCatLoading(true);
    fetchAllCategories()
      .then((data) => setAllCategories(data.categories || data.data || data))
      .catch(() => setAllCatError(true))
      .finally(() => setAllCatLoading(false));
  }, []);

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
      await updateCategory(id, {
        name: form.name.trim(),
        slug: form.slug || slugify(form.name),
        parent_id: form.parent_id || undefined,
      });
      setSuccessToast('Category saved successfully.');
    } catch (err) {
      if (err?.errors) setFieldErrors(err.errors);
      setSubmitError('Category could not be saved.');
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle = (field) => ({
    width: '100%', padding: '10px 12px', border: `1px solid ${fieldErrors[field] ? '#f03e3e' : '#868e96'}`, borderRadius: '6px', fontSize: '14px', color: '#212529', backgroundColor: '#fff', boxSizing: 'border-box', fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif",
  });
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#495057', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' };

  if (loadingCat) return <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", padding: '64px', textAlign: 'center', color: '#495057' }}>Loading…</div>;
  if (catLoadError) return <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", padding: '64px', textAlign: 'center', color: '#f03e3e' }}>{catLoadError}</div>;

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {successToast && (
          <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: '#d3f9d8', color: '#37b24d', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, zIndex: 9999, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>{successToast}</div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#212529', letterSpacing: '-0.01em', lineHeight: '32px', margin: 0 }}>Edit Category</h1>
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

            <div>
              <label style={labelStyle}>Parent Category</label>
              {allCatLoading ? (
                <div style={{ height: '40px', backgroundColor: '#e9ecef', borderRadius: '6px' }} />
              ) : allCatError ? (
                <p style={{ color: '#f03e3e', fontSize: '13px' }}>Could not load options — <button type="button" onClick={() => { setAllCatError(false); setAllCatLoading(true); fetchAllCategories().then((d) => setAllCategories(d.categories || d.data || d)).catch(() => setAllCatError(true)).finally(() => setAllCatLoading(false)); }} style={{ background: 'none', border: 'none', color: '#4c6ef5', cursor: 'pointer', fontSize: '13px', padding: 0 }}>retry</button></p>
              ) : (
                <select name="parent_id" value={form.parent_id} onChange={handleChange} style={inputStyle('parent_id')}>
                  <option value="">None (top-level)</option>
                  {allCategories.filter((c) => c.id !== id && String(c.id) !== String(id)).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => navigate('/admin/catalogue/categories')} style={{ padding: '10px 20px', backgroundColor: '#fff', color: '#212529', border: '1px solid #868e96', borderRadius: '10px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={submitting} style={{ padding: '10px 24px', backgroundColor: submitting ? '#adb5bd' : '#4c6ef5', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer' }}>{submitting ? 'Saving…' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
