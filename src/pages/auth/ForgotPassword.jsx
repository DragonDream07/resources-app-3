import { useState } from 'react';
import { Link } from 'react-router-dom';

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
  backLink: {
    display: 'block',
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: '#4c6ef5',
    textDecoration: 'none',
    lineHeight: '20px',
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
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    marginTop: '32px',
  },
  footerLink: {
    fontSize: '14px',
    color: '#4c6ef5',
    textDecoration: 'none',
    lineHeight: '20px',
  },
};

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const validate = () => {
    if (!email) return 'Enter a valid email address.';
    if (email.length > 320) return 'Enter a valid email address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setEmailError(err);
      return;
    }
    setEmailError('');
    setLoading(true);
    try {
      await fetch('/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.successPanel}>
            <div style={styles.successIcon}>✓</div>
            <h2 style={styles.successTitle}>Check your email</h2>
            <p style={styles.successText}>
              If that address is registered, a reset link is on its way. Check your inbox and follow
              the instructions to reset your password.
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
        <h1 style={{ ...styles.title, marginTop: '40px' }}>Forgot password</h1>
        <p style={styles.subtitle}>
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>

        <form style={styles.form} onSubmit={handleSubmit} noValidate>
          <div style={styles.fieldGroup}>
            <label htmlFor="forgot-email" style={styles.label}>Email address</label>
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(''); }}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              style={{
                ...styles.input,
                ...(emailError ? styles.inputError : {}),
                ...(focusedField === 'email' ? styles.inputFocus : {}),
              }}
              required
              maxLength={320}
              placeholder="you@example.com"
            />
            {emailError && <span style={styles.fieldError} role="alert">{emailError}</span>}
          </div>

          <button
            type="submit"
            style={{
              ...styles.submitBtn,
              ...(loading ? styles.submitBtnDisabled : {}),
            }}
            disabled={loading}
          >
            {loading ? 'Sending…' : 'Reset password'}
          </button>
        </form>

        <Link to="/login" style={styles.backLink}>← Back to sign in</Link>

        <div style={styles.footerLinks}>
          <Link to="/login" style={styles.footerLink}>Sign in</Link>
          <Link to="/register" style={styles.footerLink}>Register</Link>
        </div>
      </div>
    </div>
  );
}
