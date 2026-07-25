import React from 'react';
import closeIcon from '@/assets/icons/close.svg';

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-sm font-medium px-3 py-1 rounded-full">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter: ${label}`}
        className="ml-0.5 text-blue-400 hover:text-blue-700 transition-colors"
      >
        <img src={closeIcon} alt="Remove" className="w-3.5 h-3.5" />
      </button>
    </span>
  );
}

export default function ActiveFilterBar({
  activeFilters = [],
  onRemoveFilter,
  onClearAll,
}) {
  if (!activeFilters || activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-1">
        Active:
      </span>
      {activeFilters.map((filter) => (
        <FilterChip
          key={filter.key}
          label={filter.label}
          onRemove={() => onRemoveFilter && onRemoveFilter(filter.key)}
        />
      ))}
      {activeFilters.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-red-500 hover:text-red-700 font-medium ml-1 underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
