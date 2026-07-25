import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    marginBottom: '24px',
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
    marginRight: '12px',
  },
  successBanner: {
    backgroundColor: '#d3f9d8',
    border: '1px solid #37b24d',
    borderRadius: '6px',
    padding: '12px 16px',
    color: '#37b24d',
    fontSize: '14px',
    marginBottom: '16px',
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
  skeleton: {
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
  },
};

export default function AccountProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [pwFieldErrors, setPwFieldErrors] = useState({});

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  const [pwForm, setPwForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load profile');
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone: data.phone || '',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [navigate]);

  const handleProfileChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!form.first_name.trim()) errors.first_name = 'First name is required.';
    if (!form.last_name.trim()) errors.last_name = 'Last name is required.';
    if (!form.email.trim()) errors.email = 'Email is required.';
    if (Object.keys(errors).length) { setFieldErrors(errors); return; }
    setSaving(true);
    setProfileError(null);
    setProfileSuccess(false);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ first_name: form.first_name, last_name: form.last_name, email: form.email, phone: form.phone }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update profile');
      }
      setProfileSuccess(true);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePwChange = (e) => {
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });
    setPwFieldErrors({ ...pwFieldErrors, [e.target.name]: undefined });
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!pwForm.current_password) errors.current_password = 'Current password is required.';
    if (!pwForm.new_password) errors.new_password = 'New password is required.';
    if (pwForm.new_password !== pwForm.confirm_password) errors.confirm_password = 'Passwords do not match.';
    if (Object.keys(errors).length) { setPwFieldErrors(errors); return; }
    setSaving(true);
    setPwError(null);
    setPwSuccess(false);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/me/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ current_password: pwForm.current_password, new_password: pwForm.new_password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to change password');
      }
      setPwSuccess(true);
      setPwForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setPwError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ ...styles.skeleton, height: '40px', width: '220px', marginBottom: '24px' }} />
          <div style={{ ...styles.skeleton, height: '280px', marginBottom: '24px' }} />
          <div style={{ ...styles.skeleton, height: '220px' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>Account profile</h1>

        {/* Profile form */}
        <div style={styles.card}>
          <div style={styles.sectionLabel}>Personal Information</div>
          {profileSuccess && <div style={styles.successBanner}>Profile updated successfully.</div>}
          {profileError && <div style={styles.errorBanner}>{profileError}</div>}
          <form onSubmit={handleProfileSubmit} noValidate>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="first_name">First name</label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                style={{ ...styles.input, ...(fieldErrors.first_name ? styles.inputError : {}) }}
                value={form.first_name}
                onChange={handleProfileChange}
                autoComplete="given-name"
              />
              {fieldErrors.first_name && <p style={styles.errorText}>{fieldErrors.first_name}</p>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="last_name">Last name</label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                style={{ ...styles.input, ...(fieldErrors.last_name ? styles.inputError : {}) }}
                value={form.last_name}
                onChange={handleProfileChange}
                autoComplete="family-name"
              />
              {fieldErrors.last_name && <p style={styles.errorText}>{fieldErrors.last_name}</p>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                style={{ ...styles.input, ...(fieldErrors.email ? styles.inputError : {}) }}
                value={form.email}
                onChange={handleProfileChange}
                autoComplete="email"
              />
              {fieldErrors.email && <p style={styles.errorText}>{fieldErrors.email}</p>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="phone">Phone (optional)</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                style={styles.input}
                value={form.phone}
                onChange={handleProfileChange}
                autoComplete="tel"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" style={styles.btnPrimary} disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Password form */}
        <div style={styles.card}>
          <div style={styles.sectionLabel}>Change Password</div>
          {pwSuccess && <div style={styles.successBanner}>Password changed successfully.</div>}
          {pwError && <div style={styles.errorBanner}>{pwError}</div>}
          <form onSubmit={handlePwSubmit} noValidate>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="current_password">Current password</label>
              <input
                id="current_password"
                name="current_password"
                type="password"
                style={{ ...styles.input, ...(pwFieldErrors.current_password ? styles.inputError : {}) }}
                value={pwForm.current_password}
                onChange={handlePwChange}
                autoComplete="current-password"
              />
              {pwFieldErrors.current_password && <p style={styles.errorText}>{pwFieldErrors.current_password}</p>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="new_password">New password</label>
              <input
                id="new_password"
                name="new_password"
                type="password"
                style={{ ...styles.input, ...(pwFieldErrors.new_password ? styles.inputError : {}) }}
                value={pwForm.new_password}
                onChange={handlePwChange}
                autoComplete="new-password"
              />
              {pwFieldErrors.new_password && <p style={styles.errorText}>{pwFieldErrors.new_password}</p>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="confirm_password">Confirm new password</label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                style={{ ...styles.input, ...(pwFieldErrors.confirm_password ? styles.inputError : {}) }}
                value={pwForm.confirm_password}
                onChange={handlePwChange}
                autoComplete="new-password"
              />
              {pwFieldErrors.confirm_password && <p style={styles.errorText}>{pwFieldErrors.confirm_password}</p>}
            </div>
            <button type="submit" style={styles.btnPrimary} disabled={saving}>
              {saving ? 'Saving…' : 'Change password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
