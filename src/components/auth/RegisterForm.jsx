import { useState } from 'react';
import { Link } from 'react-router-dom';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const initialErrors = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function validate(fields) {
  const errors = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

  if (!fields.firstName.trim()) {
    errors.firstName = 'First name is required.';
  }

  if (!fields.lastName.trim()) {
    errors.lastName = 'Last name is required.';
  }

  if (!fields.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Please enter a valid email address.';
  }

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

export default function RegisterForm({ onSubmit, loading = false, serverError = '' }) {
  const [fields, setFields] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

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
    const allTouched = {
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    };
    setTouched(allTouched);
    const validationErrors = validate(fields);
    setErrors(validationErrors);
    const hasErrors = Object.values(validationErrors).some(Boolean);
    if (hasErrors) return;
    if (typeof onSubmit === 'function') {
      onSubmit({
        firstName: fields.firstName,
        lastName: fields.lastName,
        email: fields.email,
        password: fields.password,
      });
    }
  }

  const fieldMeta = [
    { name: 'firstName', label: 'First name', type: 'text', autoComplete: 'given-name' },
    { name: 'lastName', label: 'Last name', type: 'text', autoComplete: 'family-name' },
    { name: 'email', label: 'Email address', type: 'email', autoComplete: 'email' },
    { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
    { name: 'confirmPassword', label: 'Confirm password', type: 'password', autoComplete: 'new-password' },
  ];

  return (
    <form className="auth-form register-form" onSubmit={handleSubmit} noValidate>
      <h2 className="auth-form__title">Create Account</h2>

      {serverError && (
        <div className="auth-form__server-error" role="alert">
          {serverError}
        </div>
      )}

      {fieldMeta.map(({ name, label, type, autoComplete }) => {
        const errorId = `register-${name}-error`;
        const inputId = `register-${name}`;
        const hasError = !!(errors[name] && touched[name]);
        return (
          <div key={name} className="auth-form__field">
            <label htmlFor={inputId} className="auth-form__label">
              {label}
            </label>
            <input
              id={inputId}
              type={type}
              name={name}
              autoComplete={autoComplete}
              className={`auth-form__input${hasError ? ' auth-form__input--error' : ''}`}
              value={fields[name]}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              aria-describedby={hasError ? errorId : undefined}
              aria-invalid={hasError}
            />
            {hasError && (
              <span id={errorId} className="auth-form__error" role="alert">
                {errors[name]}
              </span>
            )}
          </div>
        );
      })}

      <button
        type="submit"
        className="auth-form__submit btn btn--primary"
        disabled={loading}
      >
        {loading ? 'Creating account…' : 'Create Account'}
      </button>

      <p className="auth-form__switch">
        Already have an account?{' '}
        <Link to="/login" className="auth-form__link">
          Sign in
        </Link>
      </p>
    </form>
  );
}
