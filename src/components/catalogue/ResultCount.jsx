import React from 'react';

function FacetOption({ label, count, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 text-sm rounded-full px-3 py-1 border transition-colors ${
        selected
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
      }`}
    >
      <span>{label}</span>
      <span
        className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
          selected ? 'bg-white text-blue-600' : 'bg-gray-100 text-gray-500'
        }`}
      >
        {count}
      </span>
    </button>
  );
}

export default function ResultCount({
  total = 0,
  loading = false,
  facets = [],
  selectedFacets = [],
  onFacetToggle,
  className = '',
}) {
  if (loading) {
    return (
      <div className={`flex items-center gap-3 animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-6 bg-gray-100 rounded-full w-20" />
        <div className="h-6 bg-gray-100 rounded-full w-24" />
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <span className="text-sm text-gray-600 whitespace-nowrap">
        <span className="font-semibold text-gray-900">{total.toLocaleString('en-IN')}</span>
        {' '}result{total !== 1 ? 's' : ''}
      </span>
      {facets && facets.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {facets.map((facet) => (
            <FacetOption
              key={facet.value}
              label={facet.label}
              count={facet.count}
              selected={selectedFacets.includes(facet.value)}
              onClick={() => onFacetToggle && onFacetToggle(facet.value)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
