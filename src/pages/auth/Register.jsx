import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 16px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 2px 16px rgba(33,37,41,0.10)',
  },
  logo: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    color: '#212529',
    textAlign: 'center',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#495057',
    textAlign: 'center',
    margin: '0 0 32px 0',
    lineHeight: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#212529',
    lineHeight: '20px',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#343a40',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    minHeight: '44px',
    lineHeight: '24px',
    transition: 'border-color 0.15s',
  },
  inputError: {
    borderColor: '#f03e3e',
  },
  inputFocus: {
    borderColor: '#4c6ef5',
    boxShadow: '0 0 0 2px rgba(76,110,245,0.20)',
  },
  fieldError: {
    fontSize: '12px',
    color: '#f03e3e',
    lineHeight: '16px',
    marginTop: '2px',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    color: '#f03e3e',
    fontSize: '14px',
    lineHeight: '20px',
  },
  warningBanner: {
    backgroundColor: '#fff4e6',
    border: '1px solid #fd7e14',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    color: '#343a40',
    lineHeight: '20px',
  },
  submitBtn: {
    width: '100%',
    padding: '12px 24px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'background-color 0.15s',
  },
  submitBtnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
  },
  divider: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
    marginTop: '24px',
  },
  loginLink: {
    color: '#4c6ef5',
    fontWeight: '500',
    textDecoration: 'none',
  },
  optionalLabel: {
    fontSize: '12px',
    color: '#495057',
    marginLeft: '4px',
    fontWeight: '400',
  },
};

function validateEmail(value) {
  if (!value) return 'Enter a valid email address.';
  if (value.length > 320) return 'Enter a valid email address.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.';
  return '';
}

function validatePassword(value) {
  if (!value || value.length < 8) return 'Password must be at least 8 characters.';
  return '';
}

function validateConfirm(value, password) {
  if (value !== password) return 'Passwords do not match.';
  return '';
}

function validateFullName(value) {
  if (value && value.length > 255) return 'Full name must not exceed 255 characters.';
  return '';
}

function validatePhone(value) {
  if (value && value.length > 30) return 'Enter a valid phone number.';
  return '';
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [bannerError, setBannerError] = useState('');
  const [rateLimitWarning, setRateLimitWarning] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    if (field === 'email') { setEmailAlreadyExists(false); setBannerError(''); }
    if (rateLimitWarning) setRateLimitWarning('');
  };

  const validate = () => {
    const newErrors = {};
    const emailErr = validateEmail(form.email);
    if (emailErr) newErrors.email = emailErr;
    const pwErr = validatePassword(form.password);
    if (pwErr) newErrors.password = pwErr;
    const confirmErr = validateConfirm(form.confirm, form.password);
    if (confirmErr) newErrors.confirm = confirmErr;
    const nameErr = validateFullName(form.full_name);
    if (nameErr) newErrors.full_name = nameErr;
    const phoneErr = validatePhone(form.phone);
    if (phoneErr) newErrors.phone = phoneErr;
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBannerError('');
    setRateLimitWarning('');
    setEmailAlreadyExists(false);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (res.status === 409) {
        setEmailAlreadyExists(true);
      } else if (res.status === 429) {
        setRateLimitWarning('Too many attempts. Please wait before trying again.');
      } else if (!res.ok) {
        setBannerError('Something went wrong. Please try again.');
      } else {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        navigate('/');
      }
    } catch {
      setBannerError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (field) => ({
    ...styles.input,
    ...(errors[field] ? styles.inputError : {}),
    ...(focusedField === field ? styles.inputFocus : {}),
  });

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <img src="/src/assets/images/logo.svg" alt="Logo" style={{ height: '40px' }} />
        </div>
        <h1 style={styles.title}>Create your account</h1>
        <p style={styles.subtitle}>
          Already have an account?{' '}
          <Link to="/login" style={styles.loginLink}>Log in</Link>
        </p>

        <form style={styles.form} onSubmit={handleSubmit} noValidate>
          <div style={styles.fieldGroup}>
            <label htmlFor="register-full-name" style={styles.label}>
              Full name <span style={styles.optionalLabel}>(optional)</span>
            </label>
            <input
              id="register-full-name"
              type="text"
              autoComplete="name"
              value={form.full_name}
              onChange={handleChange('full_name')}
              onFocus={() => setFocusedField('full_name')}
              onBlur={() => setFocusedField(null)}
              style={getInputStyle('full_name')}
              maxLength={255}
              placeholder="Jane Smith"
            />
            {errors.full_name && <span style={styles.fieldError} role="alert">{errors.full_name}</span>}
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="register-email" style={styles.label}>Email address</label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange('email')}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              style={getInputStyle('email')}
              required
              maxLength={320}
              placeholder="you@example.com"
            />
            {errors.email && !emailAlreadyExists && (
              <span style={styles.fieldError} role="alert">{errors.email}</span>
            )}
            {emailAlreadyExists && (
              <span style={styles.fieldError} role="alert">
                An account with this email already exists.{' '}
                <Link to="/login" style={{ color: '#f03e3e', textDecoration: 'underline' }}>Log in instead?</Link>
              </span>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="register-phone" style={styles.label}>
              Phone <span style={styles.optionalLabel}>(optional)</span>
            </label>
            <input
              id="register-phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={handleChange('phone')}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
              style={getInputStyle('phone')}
              maxLength={30}
              placeholder="+1 555 000 0000"
            />
            {errors.phone && <span style={styles.fieldError} role="alert">{errors.phone}</span>}
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="register-password" style={styles.label}>Password</label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange('password')}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              style={getInputStyle('password')}
              required
            />
            {errors.password && <span style={styles.fieldError} role="alert">{errors.password}</span>}
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="register-confirm" style={styles.label}>Confirm password</label>
            <input
              id="register-confirm"
              type="password"
              autoComplete="new-password"
              value={form.confirm}
              onChange={handleChange('confirm')}
              onFocus={() => setFocusedField('confirm')}
              onBlur={() => setFocusedField(null)}
              style={getInputStyle('confirm')}
              required
            />
            {errors.confirm && <span style={styles.fieldError} role="alert">{errors.confirm}</span>}
          </div>

          {rateLimitWarning && (
            <div style={styles.warningBanner} role="alert">
              {rateLimitWarning}
            </div>
          )}

          {bannerError && (
            <div style={styles.errorBanner} role="alert">
              <span>⚠</span>
              <span>{bannerError}</span>
            </div>
          )}

          <button
            type="submit"
            style={{
              ...styles.submitBtn,
              ...(loading ? styles.submitBtnDisabled : {}),
            }}
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}
