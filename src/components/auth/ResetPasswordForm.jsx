import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const initialState = { password: '', confirmPassword: '' };
const initialErrors = { password: '', confirmPassword: '' };

function validate(fields) {
  const errors = { password: '', confirmPassword: '' };
  if (!fields.password) {
    errors.password = 'Password is required.';
  } else if (fields.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }
  if (!fields.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (fields.confirmPassword !== fields.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  return errors;
}

export default function ResetPasswordForm({ onSubmit, loading = false, serverError = '', success = false }) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [fields, setFields] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [touched, setTouched] = useState({ password: false, confirmPassword: false });

  function handleChange(e) {
    const { name, value } = e.target;
    const next = { ...fields, [name]: value };
    setFields(next);
    if (touched[name]) {
      const nextErrors = validate(next);
      setErrors((prev) => ({ ...prev, [name]: nextErrors[name] }));
    }
    // Re-validate confirmPassword when password changes
    if (name === 'password' && touched.confirmPassword) {
      const nextErrors = validate(next);
      setErrors((prev) => ({ ...prev, confirmPassword: nextErrors.confirmPassword }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const nextErrors = validate(fields);
    setErrors((prev) => ({ ...prev, [name]: nextErrors[name] }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });
    const validationErrors = validate(fields);
    setErrors(validationErrors);
    const hasErrors = Object.values(validationErrors).some(Boolean);
    if (hasErrors) return;
    if (typeof onSubmit === 'function') {
      onSubmit({ token, password: fields.password });
    }
  }

  if (!token) {
    return (
      <div className="auth-form reset-password-form">
        <h2 className="auth-form__title">Invalid Link</h2>
        <p className="auth-form__message">
          The password reset link is missing or invalid. Please request a new one.
        </p>
        <Link to="/forgot-password" className="auth-form__link">
          Request new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-form reset-password-form">
        <h2 className="auth-form__title">Password Reset</h2>
        <p className="auth-form__message">
          Your password has been reset successfully. You can now sign in with your new password.
        </p>
        <Link to="/login" className="auth-form__link">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <form className="auth-form reset-password-form" onSubmit={handleSubmit} noValidate>
      <h2 className="auth-form__title">Reset Password</h2>
      <p className="auth-form__description">
        Enter your new password below.
      </p>

      {serverError && (
        <div className="auth-form__server-error" role="alert">
          {serverError}
        </div>
      )}

      <div className="auth-form__field">
        <label htmlFor="reset-password" className="auth-form__label">
          New password
        </label>
        <input
          id="reset-password"
          type="password"
          name="password"
          autoComplete="new-password"
          className={`auth-form__input${
            errors.password && touched.password ? ' auth-form__input--error' : ''
          }`}
          value={fields.password}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          aria-describedby={errors.password && touched.password ? 'reset-password-error' : undefined}
          aria-invalid={!!(errors.password && touched.password)}
        />
        {errors.password && touched.password && (
          <span id="reset-password-error" className="auth-form__error" role="alert">
            {errors.password}
          </span>
        )}
      </div>

      <div className="auth-form__field">
        <label htmlFor="reset-confirm-password" className="auth-form__label">
          Confirm new password
        </label>
        <input
          id="reset-confirm-password"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          className={`auth-form__input${
            errors.confirmPassword && touched.confirmPassword ? ' auth-form__input--error' : ''
          }`}
          value={fields.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          aria-describedby={
            errors.confirmPassword && touched.confirmPassword
              ? 'reset-confirm-password-error'
              : undefined
          }
          aria-invalid={!!(errors.confirmPassword && touched.confirmPassword)}
        />
        {errors.confirmPassword && touched.confirmPassword && (
          <span id="reset-confirm-password-error" className="auth-form__error" role="alert">
            {errors.confirmPassword}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="auth-form__submit btn btn--primary"
        disabled={loading}
      >
        {loading ? 'Resetting…' : 'Reset Password'}
      </button>
    </form>
  );
}
