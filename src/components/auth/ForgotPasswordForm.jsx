import { useState } from 'react';
import { Link } from 'react-router-dom';

const initialState = { email: '' };
const initialErrors = { email: '' };

function validate(fields) {
  const errors = { email: '' };
  if (!fields.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  return errors;
}

export default function ForgotPasswordForm({ onSubmit, loading = false, serverError = '', success = false }) {
  const [fields, setFields] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [touched, setTouched] = useState({ email: false });

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const next = validate({ ...fields, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: next[name] }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const next = validate(fields);
    setErrors((prev) => ({ ...prev, [name]: next[name] }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({ email: true });
    const validationErrors = validate(fields);
    setErrors(validationErrors);
    const hasErrors = Object.values(validationErrors).some(Boolean);
    if (hasErrors) return;
    if (typeof onSubmit === 'function') {
      onSubmit({ email: fields.email });
    }
  }

  if (success) {
    return (
      <div className="auth-form forgot-password-form">
        <h2 className="auth-form__title">Check your inbox</h2>
        <p className="auth-form__message">
          If an account exists for <strong>{fields.email}</strong>, you will receive a password
          reset link shortly.
        </p>
        <Link to="/login" className="auth-form__link">
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <form className="auth-form forgot-password-form" onSubmit={handleSubmit} noValidate>
      <h2 className="auth-form__title">Forgot Password</h2>
      <p className="auth-form__description">
        Enter your email address and we&apos;ll send you a link to reset your password.
      </p>

      {serverError && (
        <div className="auth-form__server-error" role="alert">
          {serverError}
        </div>
      )}

      <div className="auth-form__field">
        <label htmlFor="forgot-email" className="auth-form__label">
          Email address
        </label>
        <input
          id="forgot-email"
          type="email"
          name="email"
          autoComplete="email"
          className={`auth-form__input${
            errors.email && touched.email ? ' auth-form__input--error' : ''
          }`}
          value={fields.email}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          aria-describedby={errors.email && touched.email ? 'forgot-email-error' : undefined}
          aria-invalid={!!(errors.email && touched.email)}
        />
        {errors.email && touched.email && (
          <span id="forgot-email-error" className="auth-form__error" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="auth-form__submit btn btn--primary"
        disabled={loading}
      >
        {loading ? 'Sending…' : 'Send Reset Link'}
      </button>

      <p className="auth-form__switch">
        <Link to="/login" className="auth-form__link">
          Back to Sign In
        </Link>
      </p>
    </form>
  );
}
