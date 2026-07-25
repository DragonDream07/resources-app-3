import React from 'react';
import PropTypes from 'prop-types';

const Input = React.forwardRef(function Input(
  {
    id,
    label,
    error,
    helpText,
    className = '',
    type = 'text',
    required = false,
    disabled = false,
    ...rest
  },
  ref
) {
  const inputId = id;
  const errorId = error ? `${inputId}-error` : undefined;
  const helpId = helpText ? `${inputId}-help` : undefined;

  const describedBy = [errorId, helpId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        disabled={disabled}
        required={required}
        aria-describedby={describedBy}
        aria-invalid={error ? 'true' : undefined}
        className={[
          'block w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder-gray-400',
          'transition-colors duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
          error
            ? 'border-red-500 bg-red-50 focus-visible:ring-red-500'
            : 'border-gray-300 bg-white',
          disabled ? 'cursor-not-allowed bg-gray-100 text-gray-400' : '',
        ]
          .join(' ')
          .trim()}
        {...rest}
      />
      {helpText && !error && (
        <p id={helpId} className="text-xs text-gray-500">
          {helpText}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  helpText: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default Input;
