import React from 'react';
import PropTypes from 'prop-types';
import checkIcon from '@/assets/icons/check.svg';
import closeIcon from '@/assets/icons/close.svg';
import starIcon from '@/assets/icons/star.svg';
import packageIcon from '@/assets/icons/package.svg';

const variantConfig = {
  success: {
    container: 'bg-green-100 text-green-800',
    defaultIcon: checkIcon,
    defaultIconAlt: 'success',
  },
  error: {
    container: 'bg-red-100 text-red-800',
    defaultIcon: closeIcon,
    defaultIconAlt: 'error',
  },
  warning: {
    container: 'bg-yellow-100 text-yellow-800',
    defaultIcon: starIcon,
    defaultIconAlt: 'warning',
  },
  info: {
    container: 'bg-blue-100 text-blue-800',
    defaultIcon: packageIcon,
    defaultIconAlt: 'info',
  },
  neutral: {
    container: 'bg-gray-100 text-gray-700',
    defaultIcon: packageIcon,
    defaultIconAlt: 'neutral',
  },
};

const Badge = ({ variant = 'neutral', label, icon, iconAlt, className = '' }) => {
  const config = variantConfig[variant] ?? variantConfig.neutral;
  const resolvedIcon = icon ?? config.defaultIcon;
  const resolvedAlt = iconAlt ?? config.defaultIconAlt;

  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.container,
        className,
      ]
        .join(' ')
        .trim()}
    >
      <img src={resolvedIcon} alt={resolvedAlt} className="h-3 w-3 flex-shrink-0" />
      <span>{label}</span>
    </span>
  );
};

Badge.propTypes = {
  variant: PropTypes.oneOf(['success', 'error', 'warning', 'info', 'neutral']),
  label: PropTypes.string.isRequired,
  icon: PropTypes.string,
  iconAlt: PropTypes.string,
  className: PropTypes.string,
};

export default Badge;
