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
    fontWeight: '400',
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
  passwordRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotLink: {
    fontSize: '14px',
    color: '#4c6ef5',
    textDecoration: 'none',
    lineHeight: '20px',
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
  errorIcon: {
    flexShrink: 0,
    fontSize: '16px',
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
  },
  registerLink: {
    color: '#4c6ef5',
    fontWeight: '500',
    textDecoration: 'none',
  },
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.status === 401 || res.status === 403) {
        setError('Incorrect email or password.');
      } else if (res.status === 429) {
        setError('Too many login attempts. Please try again later.');
      } else if (!res.ok) {
        setError('Something went wrong. Please try again.');
      } else {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        navigate('/');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <img src="/src/assets/images/logo.svg" alt="Logo" style={{ height: '40px' }} />
        </div>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>Sign in to your account to continue.</p>

        <form style={styles.form} onSubmit={handleSubmit} noValidate>
          <div style={styles.fieldGroup}>
            <label htmlFor="login-email" style={styles.label}>Email address</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              style={{
                ...styles.input,
                ...(focusedField === 'email' ? styles.inputFocus : {}),
              }}
              required
              maxLength={320}
              placeholder="you@example.com"
            />
          </div>

          <div style={styles.fieldGroup}>
            <div style={styles.passwordRow}>
              <label htmlFor="login-password" style={styles.label}>Password</label>
              <Link to="/forgot-password" style={styles.forgotLink} tabIndex={0}>
                Forgot password?
              </Link>
            </div>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              style={{
                ...styles.input,
                ...(focusedField === 'password' ? styles.inputFocus : {}),
              }}
              required
            />
          </div>

          {error && (
            <div style={styles.errorBanner} role="alert">
              <span style={styles.errorIcon}>⚠</span>
              <span>{error}</span>
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
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={{ ...styles.divider, marginTop: '24px' }}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={styles.registerLink}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
