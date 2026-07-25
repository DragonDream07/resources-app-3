import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = '/api';

async function createBrand(payload) {
  const res = await fetch(`${API_BASE}/brands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw e; }
  return res.json();
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminBrandNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', slug: '', description: '', logo_url: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === 'name') {
      setForm((prev) => ({ ...prev, name: value, slug: slugify(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
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
      await createBrand({
        name: form.name.trim(),
        slug: form.slug || slugify(form.name),
        description: form.description || undefined,
        logo_url: form.logo_url || undefined,
      });
      navigate('/admin/catalogue/brands');
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

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif", backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#212529', letterSpacing: '-0.01em', lineHeight: '32px', margin: 0 }}>New Brand</h1>
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
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => navigate('/admin/catalogue/brands')} style={{ padding: '10px 20px', backgroundColor: '#fff', color: '#212529', border: '1px solid #868e96', borderRadius: '10px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={submitting} style={{ padding: '10px 24px', backgroundColor: submitting ? '#adb5bd' : '#4c6ef5', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer' }}>{submitting ? 'Saving…' : 'Create Brand'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
