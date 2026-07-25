import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  backLink: {
    color: '#4c6ef5',
    fontSize: '14px',
    textDecoration: 'none',
    display: 'inline-block',
    marginBottom: '16px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
    margin: '0 0 24px 0',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  sectionLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '16px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
  },
  formRowItem: {
    flex: 1,
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '400',
    letterSpacing: '0.02em',
    color: '#495057',
    marginBottom: '4px',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  inputError: {
    borderColor: '#f03e3e',
  },
  errorText: {
    color: '#f03e3e',
    fontSize: '12px',
    marginTop: '4px',
  },
  btnPrimary: {
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '44px',
    marginRight: '12px',
  },
  btnGhost: {
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '44px',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    color: '#f03e3e',
    fontSize: '14px',
    marginBottom: '16px',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
  },
};

const EMPTY_FORM = {
  full_name: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  phone: '',
  is_default: false,
};

export default function AddressNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    setFieldErrors({ ...fieldErrors, [name]: undefined });
  };

  const validate = () => {
    const errors = {};
    if (!form.full_name.trim()) errors.full_name = 'Full name is required.';
    if (!form.line1.trim()) errors.line1 = 'Address line 1 is required.';
    if (!form.city.trim()) errors.city = 'City is required.';
    if (!form.state.trim()) errors.state = 'State is required.';
    if (!form.postal_code.trim()) errors.postal_code = 'Postal code is required.';
    if (!form.country.trim()) errors.country = 'Country is required.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) { setFieldErrors(errors); return; }
    setSaving(true);
    setServerError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/me/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to save address');
      }
      navigate('/account/addresses');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/account/addresses" style={styles.backLink}>← Back to addresses</Link>
        <h1 style={styles.pageTitle}>Add New Address</h1>
        <div style={styles.card}>
          <div style={styles.sectionLabel}>Address Details</div>
          {serverError && <div style={styles.errorBanner}>{serverError}</div>}
          <form onSubmit={handleSubmit} noValidate>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="full_name">Full name</label>
              <input
                id="full_name" name="full_name" type="text"
                style={{ ...styles.input, ...(fieldErrors.full_name ? styles.inputError : {}) }}
                value={form.full_name} onChange={handleChange} autoComplete="name"
              />
              {fieldErrors.full_name && <p style={styles.errorText}>{fieldErrors.full_name}</p>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="line1">Address line 1</label>
              <input
                id="line1" name="line1" type="text"
                style={{ ...styles.input, ...(fieldErrors.line1 ? styles.inputError : {}) }}
                value={form.line1} onChange={handleChange} autoComplete="address-line1"
              />
              {fieldErrors.line1 && <p style={styles.errorText}>{fieldErrors.line1}</p>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="line2">Address line 2 (optional)</label>
              <input
                id="line2" name="line2" type="text"
                style={styles.input}
                value={form.line2} onChange={handleChange} autoComplete="address-line2"
              />
            </div>
            <div style={styles.formRow}>
              <div style={styles.formRowItem}>
                <label style={styles.label} htmlFor="city">City</label>
                <input
                  id="city" name="city" type="text"
                  style={{ ...styles.input, ...(fieldErrors.city ? styles.inputError : {}) }}
                  value={form.city} onChange={handleChange} autoComplete="address-level2"
                />
                {fieldErrors.city && <p style={styles.errorText}>{fieldErrors.city}</p>}
              </div>
              <div style={styles.formRowItem}>
                <label style={styles.label} htmlFor="state">State / Province</label>
                <input
                  id="state" name="state" type="text"
                  style={{ ...styles.input, ...(fieldErrors.state ? styles.inputError : {}) }}
                  value={form.state} onChange={handleChange} autoComplete="address-level1"
                />
                {fieldErrors.state && <p style={styles.errorText}>{fieldErrors.state}</p>}
              </div>
            </div>
            <div style={styles.formRow}>
              <div style={styles.formRowItem}>
                <label style={styles.label} htmlFor="postal_code">Postal code</label>
                <input
                  id="postal_code" name="postal_code" type="text"
                  style={{ ...styles.input, ...(fieldErrors.postal_code ? styles.inputError : {}) }}
                  value={form.postal_code} onChange={handleChange} autoComplete="postal-code"
                />
                {fieldErrors.postal_code && <p style={styles.errorText}>{fieldErrors.postal_code}</p>}
              </div>
              <div style={styles.formRowItem}>
                <label style={styles.label} htmlFor="country">Country</label>
                <input
                  id="country" name="country" type="text"
                  style={{ ...styles.input, ...(fieldErrors.country ? styles.inputError : {}) }}
                  value={form.country} onChange={handleChange} autoComplete="country-name"
                />
                {fieldErrors.country && <p style={styles.errorText}>{fieldErrors.country}</p>}
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="phone">Phone (optional)</label>
              <input
                id="phone" name="phone" type="tel"
                style={styles.input}
                value={form.phone} onChange={handleChange} autoComplete="tel"
              />
            </div>
            <div style={styles.checkboxRow}>
              <input
                id="is_default" name="is_default" type="checkbox"
                checked={form.is_default} onChange={handleChange}
                style={{ width: '16px', height: '16px' }}
              />
              <label htmlFor="is_default" style={{ fontSize: '14px', color: '#212529' }}>Set as default address</label>
            </div>
            <div>
              <button type="submit" style={styles.btnPrimary} disabled={saving}>
                {saving ? 'Saving…' : 'Save address'}
              </button>
              <button type="button" style={styles.btnGhost} onClick={() => navigate('/account/addresses')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
