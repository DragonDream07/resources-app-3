import React from 'react';
import PropTypes from 'prop-types';

const Skeleton = ({ variant = 'text', width, height, className = '', count = 1 }) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';

  const variantClasses = {
    text: 'h-4 w-full rounded',
    heading: 'h-6 w-3/4 rounded',
    avatar: 'h-10 w-10 rounded-full',
    thumbnail: 'h-40 w-full rounded-lg',
    button: 'h-9 w-24 rounded-md',
    card: 'h-48 w-full rounded-xl',
  };

  const resolvedClass = variantClasses[variant] ?? variantClasses.text;

  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  if (count === 1) {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Loading content"
        className={[baseClasses, resolvedClass, className].join(' ').trim()}
        style={style}
      >
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  return (
    <div role="status" aria-busy="true" aria-label="Loading content" className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={[baseClasses, resolvedClass, className].join(' ').trim()}
          style={style}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
};

Skeleton.propTypes = {
  variant: PropTypes.oneOf(['text', 'heading', 'avatar', 'thumbnail', 'button', 'card']),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  count: PropTypes.number,
};

export default Skeleton;
