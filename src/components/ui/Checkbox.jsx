import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = React.forwardRef(function Checkbox(
  {
    id,
    label,
    error,
    className = '',
    disabled = false,
    ...rest
  },
  ref
) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          disabled={disabled}
          aria-describedby={errorId}
          aria-invalid={error ? 'true' : undefined}
          className={[
            'h-4 w-4 rounded border-gray-300 text-blue-600 transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          ]
            .join(' ')
            .trim()}
          {...rest}
        />
        {label && (
          <label
            htmlFor={id}
            className={[
              'text-sm text-gray-700 select-none',
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            ].join(' ')}
          >
            {label}
          </label>
        )}
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
  error: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Checkbox;
