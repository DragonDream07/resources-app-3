import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

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
    maxWidth: '440px',
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
  inputFocus: {
    borderColor: '#4c6ef5',
    boxShadow: '0 0 0 2px rgba(76,110,245,0.20)',
  },
  inputError: {
    borderColor: '#f03e3e',
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
  successPanel: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  successIcon: {
    width: '64px',
    height: '64px',
    backgroundColor: '#d3f9d8',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    color: '#37b24d',
  },
  successTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    lineHeight: '28px',
    margin: 0,
  },
  successText: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
    margin: 0,
    maxWidth: '360px',
  },
  goSignInBtn: {
    display: 'inline-block',
    padding: '12px 32px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    cursor: 'pointer',
    minHeight: '44px',
    textDecoration: 'none',
    lineHeight: '20px',
  },
  invalidTokenPanel: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  invalidTokenText: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
    margin: 0,
  },
  signInLink: {
    color: '#4c6ef5',
    textDecoration: 'none',
    marginLeft: '4px',
    fontSize: '14px',
    lineHeight: '20px',
  },
};

function validatePassword(value) {
  if (!value || value.length < 8) return 'Password must be at least 8 characters.';
  return '';
}

function validateConfirm(value, password) {
  if (value !== password) return 'Passwords do not match.';
  return '';
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [bannerError, setBannerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const validate = () => {
    const newErrors = {};
    const pwErr = validatePassword(password);
    if (pwErr) newErrors.password = pwErr;
    const confirmErr = validateConfirm(confirm, password);
    if (confirmErr) newErrors.confirm = confirmErr;
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBannerError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      if (res.status === 400 || res.status === 422) {
        setBannerError('This reset link is invalid or has expired. Please request a new one.');
      } else if (!res.ok) {
        setBannerError('Something went wrong. Please try again.');
      } else {
        setSuccess(true);
      }
    } catch {
      setBannerError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.invalidTokenPanel}>
            <h1 style={styles.title}>Invalid reset link</h1>
            <p style={styles.invalidTokenText}>
              This password reset link is missing or invalid. Please request a new one.
            </p>
            <Link to="/forgot-password" style={styles.goSignInBtn}>Request new link</Link>
            <p style={{ margin: 0, fontSize: '14px', color: '#495057' }}>
              Or
              <Link to="/login" style={styles.signInLink}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.successPanel}>
            <div style={styles.successIcon}>✓</div>
            <h2 style={styles.successTitle}>Password reset successfully</h2>
            <p style={styles.successText}>
              Your password has been updated. Please sign in with your new password.
            </p>
            <Link to="/login" style={styles.goSignInBtn}>Go to sign in</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <img src="/src/assets/images/logo.svg" alt="Logo" style={{ height: '40px' }} />
        </div>
        <h1 style={styles.title}>Reset your password</h1>
        <p style={styles.subtitle}>Enter a new password for your account.</p>

        <form style={styles.form} onSubmit={handleSubmit} noValidate>
          <div style={styles.fieldGroup}>
            <label htmlFor="reset-password" style={styles.label}>New password</label>
            <input
              id="reset-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((prev) => ({ ...prev, password: '' })); }}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              style={{
                ...styles.input,
                ...(errors.password ? styles.inputError : {}),
                ...(focusedField === 'password' ? styles.inputFocus : {}),
              }}
              required
            />
            {errors.password && <span style={styles.fieldError} role="alert">{errors.password}</span>}
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="reset-confirm" style={styles.label}>Confirm new password</label>
            <input
              id="reset-confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); if (errors.confirm) setErrors((prev) => ({ ...prev, confirm: '' })); }}
              onFocus={() => setFocusedField('confirm')}
              onBlur={() => setFocusedField(null)}
              style={{
                ...styles.input,
                ...(errors.confirm ? styles.inputError : {}),
                ...(focusedField === 'confirm' ? styles.inputFocus : {}),
              }}
              required
            />
            {errors.confirm && <span style={styles.fieldError} role="alert">{errors.confirm}</span>}
          </div>

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
            {loading ? 'Resetting…' : 'Reset password'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#495057' }}>
          Remember your password?
          <Link to="/login" style={{ ...styles.signInLink, marginLeft: '4px' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
