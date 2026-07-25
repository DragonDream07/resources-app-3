import React from 'react';
import PropTypes from 'prop-types';
import chevronLeft from '@/assets/icons/chevron-left.svg';
import chevronRight from '@/assets/icons/chevron-right.svg';

const SIBLING_COUNT = 1;
const DOTS = '...';

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function buildPageRange(currentPage, totalPages) {
  const totalPageNumbers = SIBLING_COUNT * 2 + 5;
  if (totalPageNumbers >= totalPages) {
    return range(1, totalPages);
  }
  const leftSiblingIndex = Math.max(currentPage - SIBLING_COUNT, 1);
  const rightSiblingIndex = Math.min(currentPage + SIBLING_COUNT, totalPages);
  const showLeftDots = leftSiblingIndex > 2;
  const showRightDots = rightSiblingIndex < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const leftItemCount = 3 + 2 * SIBLING_COUNT;
    return [...range(1, leftItemCount), DOTS, totalPages];
  }
  if (showLeftDots && !showRightDots) {
    const rightItemCount = 3 + 2 * SIBLING_COUNT;
    return [1, DOTS, ...range(totalPages - rightItemCount + 1, totalPages)];
  }
  return [1, DOTS, ...range(leftSiblingIndex, rightSiblingIndex), DOTS, totalPages];
}

const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }) => {
  if (totalPages <= 1) return null;

  const pages = buildPageRange(currentPage, totalPages);

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center justify-center gap-1 ${className}`}
    >
      <button
        type="button"
        onClick={handlePrev}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <img src={chevronLeft} alt="" aria-hidden="true" className="h-4 w-4" />
      </button>

      {pages.map((page, index) =>
        page === DOTS ? (
          <span
            key={`dots-${index}`}
            className="inline-flex h-8 w-8 items-center justify-center text-sm text-gray-400"
            aria-hidden="true"
          >
            &hellip;
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={[
              'inline-flex h-8 w-8 items-center justify-center rounded text-sm font-medium transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              page === currentPage
                ? 'bg-blue-600 text-white border border-blue-600'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
            ].join(' ')}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <img src={chevronRight} alt="" aria-hidden="true" className="h-4 w-4" />
      </button>
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Pagination;
