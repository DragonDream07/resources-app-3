import React from 'react';
import PropTypes from 'prop-types';
import emptyStateImage from '@/assets/images/empty-state.svg';
import Button from './Button';

const EmptyState = ({
  title = 'Nothing here yet',
  description,
  image,
  ctaLabel,
  onCtaClick,
  ctaHref,
  className = '',
}) => {
  const resolvedImage = image ?? emptyStateImage;

  return (
    <div
      className={[
        'flex flex-col items-center justify-center gap-4 py-16 px-4 text-center',
        className,
      ].join(' ').trim()}
    >
      <img
        src={resolvedImage}
        alt=""
        aria-hidden="true"
        className="h-40 w-40 object-contain opacity-80"
      />
      <div className="max-w-sm">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      {ctaLabel && (onCtaClick || ctaHref) && (
        ctaHref ? (
          <a
            href={ctaHref}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
          >
            {ctaLabel}
          </a>
        ) : (
          <Button variant="primary" size="md" onClick={onCtaClick}>
            {ctaLabel}
          </Button>
        )
      )}
    </div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  ctaLabel: PropTypes.string,
  onCtaClick: PropTypes.func,
  ctaHref: PropTypes.string,
  className: PropTypes.string,
};

export default EmptyState;
