import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import checkIcon from '@/assets/icons/check.svg';
import closeIcon from '@/assets/icons/close.svg';
import packageIcon from '@/assets/icons/package.svg';

const variantConfig = {
  success: {
    container: 'bg-green-50 border-green-400 text-green-800',
    icon: checkIcon,
    iconAlt: 'Success',
    iconClass: 'text-green-500',
  },
  error: {
    container: 'bg-red-50 border-red-400 text-red-800',
    icon: closeIcon,
    iconAlt: 'Error',
    iconClass: 'text-red-500',
  },
  info: {
    container: 'bg-blue-50 border-blue-400 text-blue-800',
    icon: packageIcon,
    iconAlt: 'Info',
    iconClass: 'text-blue-500',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    icon: packageIcon,
    iconAlt: 'Warning',
    iconClass: 'text-yellow-500',
  },
};

const Toast = ({ id, message, variant = 'info', duration = 4000, onDismiss }) => {
  const timerRef = useRef(null);
  const config = variantConfig[variant] ?? variantConfig.info;

  useEffect(() => {
    if (duration > 0) {
      timerRef.current = setTimeout(() => {
        onDismiss(id);
      }, duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [id, duration, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={[
        'flex items-start gap-3 rounded-lg border px-4 py-3 shadow-md',
        'w-full max-w-sm text-sm',
        'animate-[fadeInUp_0.2s_ease-out]',
        config.container,
      ].join(' ')}
    >
      <img
        src={config.icon}
        alt={config.iconAlt}
        className={`mt-0.5 h-4 w-4 flex-shrink-0 ${config.iconClass}`}
      />
      <p className="flex-1">{message}</p>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        className="ml-auto flex-shrink-0 rounded p-0.5 opacity-60 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
      >
        <img src={closeIcon} alt="" aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
};

Toast.propTypes = {
  id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['success', 'error', 'info', 'warning']),
  duration: PropTypes.number,
  onDismiss: PropTypes.func.isRequired,
};

export default Toast;
