import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import logoSrc from '@/assets/images/logo.svg';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 16px',
  },
  container: {
    maxWidth: '440px',
    width: '100%',
  },
  logoWrap: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  logo: {
    height: '36px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '36px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    color: '#212529',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subheading: {
    fontSize: '14px',
    color: '#495057',
    textAlign: 'center',
    marginBottom: '28px',
    lineHeight: '1.5',
  },
  benefitList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '24px',
    backgroundColor: '#e8ecfd',
    borderRadius: '8px',
    padding: '14px 18px',
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#343a40',
  },
  benefitDot: {
    width: '6px',
    height: '6px',
    borderRadius: '9999px',
    backgroundColor: '#4c6ef5',
    flexShrink: 0,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '16px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
  },
  input: {
    height: '44px',
    padding: '0 12px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    fontSize: '16px',
    color: '#212529',
    backgroundColor: '#ffffff',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  inputError: {
    borderColor: '#f03e3e',
  },
  errorText: {
    fontSize: '12px',
    color: '#f03e3e',
    marginTop: '2px',
  },
  passwordHint: {
    fontSize: '12px',
    color: '#495057',
    marginTop: '4px',
  },
  primaryBtn: {
    width: '100%',
    height: '48px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
  },
  primaryBtnDisabled: {
    backgroundColor: '#adb5bd',
    cursor: 'not-allowed',
  },
  skipRow: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '14px',
    color: '#495057',
  },
  skipLink: {
    color: '#4c6ef5',
    fontWeight: '600',
    textDecoration: 'none',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontSize: '14px',
    padding: '0',
  },
  successCard: {
    backgroundColor: '#d3f9d8',
    borderRadius: '10px',
    padding: '24px',
    textAlign: 'center',
  },
  successIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  successTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#212529',
    marginBottom: '8px',
  },
  successDesc: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '20px',
  },
  successBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    height: '44px',
    padding: '0 28px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  globalError: {
    backgroundColor: '#ffe3e3',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '13px',
    color: '#f03e3e',
    marginBottom: '16px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e9ecef',
    margin: '20px 0',
  },
  loginRow: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#495057',
    marginTop: '16px',
  },
  loginLink: {
    color: '#4c6ef5',
    fontWeight: '600',
    textDecoration: 'none',
  },
};

const BENEFITS = [
  'Track your order status in real time',
  'Faster checkout with saved addresses',
  'Easy returns and order history',
  'Exclusive member deals and offers',
];

export default function GuestPostCheckoutRegister() {
  const navigate = useNavigate();
  const location = useLocation();

  const orderId = location.state?.orderId;

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: '' }));
    if (globalError) setGlobalError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errs.email = 'Enter a valid email address.';
    if (form.password.length < 8)
      errs.password = 'Password must be at least 8 characters.';
    if (form.confirmPassword !== form.password)
      errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/guest-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          orderId: orderId || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        setRegistered(true);
      } else {
        setGlobalError(data.message || 'Registration failed. Please try again.');
      }
    } catch {
      setGlobalError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (registered) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.logoWrap}>
            <img src={logoSrc} alt="Logo" style={styles.logo} />
          </div>
          <div style={styles.successCard}>
            <div style={styles.successIcon}>🎉</div>
            <div style={styles.successTitle}>Account Created!</div>
            <div style={styles.successDesc}>
              Welcome aboard! You can now track your order and enjoy faster checkouts.
            </div>
            {orderId ? (
              <Link to={`/orders/${orderId}`} style={styles.successBtn}>
                Track My Order
              </Link>
            ) : (
              <Link to="/" style={styles.successBtn}>
                Continue Shopping
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.logoWrap}>
          <img src={logoSrc} alt="Logo" style={styles.logo} />
        </div>

        <div style={styles.card}>
          <div style={styles.heading}>Create Your Account</div>
          <div style={styles.subheading}>
            Your order is confirmed! Create an account to enjoy these benefits:
          </div>

          <div style={styles.benefitList}>
            {BENEFITS.map((b) => (
              <div key={b} style={styles.benefitItem}>
                <div style={styles.benefitDot} />
                {b}
              </div>
            ))}
          </div>

          {globalError && <div style={styles.globalError}>{globalError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="reg-name">Full Name *</label>
              <input
                id="reg-name"
                style={{
                  ...styles.input,
                  ...(formErrors.name ? styles.inputError : {}),
                }}
                value={form.name}
                onChange={(e) => handleField('name', e.target.value)}
                placeholder="Jane Doe"
                autoComplete="name"
                type="text"
              />
              {formErrors.name && <span style={styles.errorText}>{formErrors.name}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="reg-email">Email Address *</label>
              <input
                id="reg-email"
                style={{
                  ...styles.input,
                  ...(formErrors.email ? styles.inputError : {}),
                }}
                value={form.email}
                onChange={(e) => handleField('email', e.target.value)}
                placeholder="jane@example.com"
                autoComplete="email"
                type="email"
              />
              {formErrors.email && <span style={styles.errorText}>{formErrors.email}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="reg-password">Password *</label>
              <input
                id="reg-password"
                style={{
                  ...styles.input,
                  ...(formErrors.password ? styles.inputError : {}),
                }}
                value={form.password}
                onChange={(e) => handleField('password', e.target.value)}
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
              />
              {formErrors.password ? (
                <span style={styles.errorText}>{formErrors.password}</span>
              ) : (
                <span style={styles.passwordHint}>Minimum 8 characters.</span>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="reg-confirm-password">Confirm Password *</label>
              <input
                id="reg-confirm-password"
                style={{
                  ...styles.input,
                  ...(formErrors.confirmPassword ? styles.inputError : {}),
                }}
                value={form.confirmPassword}
                onChange={(e) => handleField('confirmPassword', e.target.value)}
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter password"
              />
              {formErrors.confirmPassword && (
                <span style={styles.errorText}>{formErrors.confirmPassword}</span>
              )}
            </div>

            <button
              type="submit"
              style={{
                ...styles.primaryBtn,
                ...(submitting ? styles.primaryBtnDisabled : {}),
              }}
              disabled={submitting}
            >
              {submitting ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <hr style={styles.divider} />

          <div style={styles.skipRow}>
            <button
              style={styles.skipLink}
              type="button"
              onClick={() =>
                orderId ? navigate(`/orders/${orderId}`) : navigate('/')
              }
            >
              Skip for now
            </button>
          </div>

          <div style={styles.loginRow}>
            Already have an account?{' '}
            <Link to="/login" style={styles.loginLink}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
