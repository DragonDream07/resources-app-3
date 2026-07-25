import React from 'react';
import PropTypes from 'prop-types';
import chevronDown from '@/assets/icons/chevron-down.svg';

const Select = React.forwardRef(function Select(
  {
    id,
    label,
    options = [],
    error,
    helpText,
    className = '',
    required = false,
    disabled = false,
    placeholder,
    ...rest
  },
  ref
) {
  const errorId = error ? `${id}-error` : undefined;
  const helpId = helpText ? `${id}-help` : undefined;
  const describedBy = [errorId, helpId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
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
      <div className="relative">
        <select
          ref={ref}
          id={id}
          disabled={disabled}
          required={required}
          aria-describedby={describedBy}
          aria-invalid={error ? 'true' : undefined}
          className={[
            'block w-full appearance-none rounded-md border px-3 py-2 pr-9 text-sm text-gray-900',
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
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
          <img src={chevronDown} alt="" aria-hidden="true" className="h-4 w-4 text-gray-400" />
        </span>
      </div>
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

Select.displayName = 'Select';

Select.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ),
  error: PropTypes.string,
  helpText: PropTypes.string,
  className: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default Select;
