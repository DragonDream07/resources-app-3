import { useState } from 'react';
import { Link } from 'react-router-dom';

const initialState = {
  email: '',
  password: '',
};

const initialErrors = {
  email: '',
  password: '',
};

function validate(fields) {
  const errors = { email: '', password: '' };
  if (!fields.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!fields.password) {
    errors.password = 'Password is required.';
  }
  return errors;
}

export default function LoginForm({ onSubmit, loading = false, serverError = '' }) {
  const [fields, setFields] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [touched, setTouched] = useState({ email: false, password: false });

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
    const allTouched = { email: true, password: true };
    setTouched(allTouched);
    const validationErrors = validate(fields);
    setErrors(validationErrors);
    const hasErrors = Object.values(validationErrors).some(Boolean);
    if (hasErrors) return;
    if (typeof onSubmit === 'function') {
      onSubmit({ email: fields.email, password: fields.password });
    }
  }

  return (
    <form className="auth-form login-form" onSubmit={handleSubmit} noValidate>
      <h2 className="auth-form__title">Sign In</h2>

      {serverError && (
        <div className="auth-form__server-error" role="alert">
          {serverError}
        </div>
      )}

      <div className="auth-form__field">
        <label htmlFor="login-email" className="auth-form__label">
          Email address
        </label>
        <input
          id="login-email"
          type="email"
          name="email"
          autoComplete="email"
          className={`auth-form__input${errors.email && touched.email ? ' auth-form__input--error' : ''}`}
          value={fields.email}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          aria-describedby={errors.email && touched.email ? 'login-email-error' : undefined}
          aria-invalid={!!(errors.email && touched.email)}
        />
        {errors.email && touched.email && (
          <span id="login-email-error" className="auth-form__error" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      <div className="auth-form__field">
        <label htmlFor="login-password" className="auth-form__label">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          name="password"
          autoComplete="current-password"
          className={`auth-form__input${errors.password && touched.password ? ' auth-form__input--error' : ''}`}
          value={fields.password}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          aria-describedby={errors.password && touched.password ? 'login-password-error' : undefined}
          aria-invalid={!!(errors.password && touched.password)}
        />
        {errors.password && touched.password && (
          <span id="login-password-error" className="auth-form__error" role="alert">
            {errors.password}
          </span>
        )}
      </div>

      <div className="auth-form__forgot">
        <Link to="/forgot-password" className="auth-form__link">
          Forgot your password?
        </Link>
      </div>

      <button
        type="submit"
        className="auth-form__submit btn btn--primary"
        disabled={loading}
      >
        {loading ? 'Signing in…' : 'Sign In'}
      </button>

      <p className="auth-form__switch">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="auth-form__link">
          Create one
        </Link>
      </p>
    </form>
  );
}
