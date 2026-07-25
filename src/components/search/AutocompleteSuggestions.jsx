import { useEffect, useRef } from 'react';
import searchIcon from '@/assets/icons/search.svg';

function AutocompleteSuggestions({
  suggestions = [],
  activeIndex = -1,
  isLoading = false,
  query = '',
  onSelect,
  onClose,
}) {
  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current || activeIndex < 0) return;
    const activeItem = listRef.current.querySelector(`#suggestion-item-${activeIndex}`);
    if (activeItem) {
      activeItem.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  if (isLoading) {
    return (
      <div
        className="autocomplete-dropdown"
        style={dropdownStyle}
        role="status"
        aria-live="polite"
        aria-label="Loading suggestions"
      >
        <div className="autocomplete-loading" style={loadingStyle}>
          <span style={{ opacity: 0.5, fontSize: '0.875rem' }}>Loading suggestions…</span>
        </div>
      </div>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  function getSuggestionLabel(suggestion) {
    if (typeof suggestion === 'string') return suggestion;
    return suggestion.label || suggestion.name || suggestion.query || suggestion.text || '';
  }

  function getSuggestionType(suggestion) {
    if (typeof suggestion === 'string') return null;
    return suggestion.type || null;
  }

  function highlightMatch(label, query) {
    if (!query || !query.trim()) return label;
    const trimmedQuery = query.trim();
    const index = label.toLowerCase().indexOf(trimmedQuery.toLowerCase());
    if (index === -1) return label;
    const before = label.slice(0, index);
    const match = label.slice(index, index + trimmedQuery.length);
    const after = label.slice(index + trimmedQuery.length);
    return (
      <>
        {before}
        <strong style={{ fontWeight: 700 }}>{match}</strong>
        {after}
      </>
    );
  }

  function handleItemClick(suggestion) {
    if (typeof onSelect === 'function') {
      onSelect(suggestion);
    }
  }

  function handleItemMouseDown(e) {
    // Prevent input blur before click registers
    e.preventDefault();
  }

  return (
    <ul
      ref={listRef}
      id="search-suggestions-listbox"
      role="listbox"
      aria-label="Search suggestions"
      className="autocomplete-dropdown"
      style={dropdownStyle}
    >
      {suggestions.map((suggestion, index) => {
        const label = getSuggestionLabel(suggestion);
        const type = getSuggestionType(suggestion);
        const isActive = index === activeIndex;

        return (
          <li
            key={`${label}-${index}`}
            id={`suggestion-item-${index}`}
            role="option"
            aria-selected={isActive}
            className={`autocomplete-item${isActive ? ' autocomplete-item--active' : ''}`}
            onClick={() => handleItemClick(suggestion)}
            onMouseDown={handleItemMouseDown}
            style={{
              ...itemStyle,
              backgroundColor: isActive ? '#f3f4f6' : 'transparent',
              cursor: 'pointer',
            }}
          >
            <img
              src={searchIcon}
              alt=""
              aria-hidden="true"
              style={{ width: '1rem', height: '1rem', opacity: 0.4, flexShrink: 0, marginRight: '0.625rem' }}
            />
            <span className="autocomplete-item-label" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.9375rem', color: '#111827' }}>
              {highlightMatch(label, query)}
            </span>
            {type && (
              <span className="autocomplete-item-type" style={{ fontSize: '0.75rem', color: '#6b7280', marginLeft: '0.5rem', flexShrink: 0, textTransform: 'capitalize' }}>
                {type}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

const dropdownStyle = {
  position: 'absolute',
  top: 'calc(100% + 4px)',
  left: 0,
  right: 0,
  zIndex: 1000,
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '0.5rem',
  boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
  listStyle: 'none',
  margin: 0,
  padding: '0.25rem 0',
  maxHeight: '24rem',
  overflowY: 'auto',
};

const loadingStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.875rem 1rem',
};

const itemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '0.625rem 1rem',
  transition: 'background-color 0.1s ease',
  userSelect: 'none',
};

export default AutocompleteSuggestions;
