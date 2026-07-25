import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import searchIcon from '@/assets/icons/search.svg';
import closeIcon from '@/assets/icons/close.svg';
import AutocompleteSuggestions from './AutocompleteSuggestions';

const DEBOUNCE_DELAY = 300;

function SearchBar({ initialQuery = '', className = '' }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const debounceTimer = useRef(null);
  const abortControllerRef = useRef(null);

  const fetchSuggestions = useCallback(async (value) => {
    if (!value || value.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    try {
      const params = new URLSearchParams({ q: value.trim() });
      const response = await fetch(`/search/suggest?${params.toString()}`, {
        signal: abortControllerRef.current.signal,
      });
      if (!response.ok) throw new Error('Suggest request failed');
      const data = await response.json();
      const items = Array.isArray(data) ? data : (data.suggestions || data.data || []);
      setSuggestions(items);
      setIsOpen(items.length > 0);
      setActiveIndex(-1);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setSuggestions([]);
        setIsOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceTimer.current);
    if (query.trim().length >= 2) {
      debounceTimer.current = setTimeout(() => {
        fetchSuggestions(query);
      }, DEBOUNCE_DELAY);
    } else {
      setSuggestions([]);
      setIsOpen(false);
      setActiveIndex(-1);
    }
    return () => clearTimeout(debounceTimer.current);
  }, [query, fetchSuggestions]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const submitSearch = useCallback((searchQuery) => {
    const trimmed = (searchQuery || query).trim();
    if (!trimmed) return;
    setIsOpen(false);
    setActiveIndex(-1);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  }, [query, navigate]);

  function handleInputChange(e) {
    setQuery(e.target.value);
  }

  function handleKeyDown(e) {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          const selected = suggestions[activeIndex];
          const label = typeof selected === 'string' ? selected : (selected.label || selected.name || selected.query || '');
          setQuery(label);
          submitSearch(label);
        } else {
          submitSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current && inputRef.current.blur();
        break;
      default:
        break;
    }
  }

  function handleClear() {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current && inputRef.current.focus();
  }

  function handleSuggestionSelect(suggestion) {
    const label = typeof suggestion === 'string' ? suggestion : (suggestion.label || suggestion.name || suggestion.query || '');
    setQuery(label);
    submitSearch(label);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    submitSearch();
  }

  return (
    <div ref={containerRef} className={`search-bar-container ${className}`} style={{ position: 'relative', display: 'flex', flexDirection: 'column', width: '100%' }}>
      <form onSubmit={handleFormSubmit} role="search" aria-label="Site search">
        <div className="search-bar-input-wrapper" style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '0.5rem', backgroundColor: '#fff', overflow: 'hidden' }}>
          <label htmlFor="search-input" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
            Search
          </label>
          <img
            src={searchIcon}
            alt=""
            aria-hidden="true"
            style={{ width: '1.25rem', height: '1.25rem', margin: '0 0.5rem 0 0.75rem', flexShrink: 0, opacity: 0.5 }}
          />
          <input
            ref={inputRef}
            id="search-input"
            type="search"
            autoComplete="off"
            role="combobox"
            aria-expanded={isOpen}
            aria-autocomplete="list"
            aria-controls="search-suggestions-listbox"
            aria-activedescendant={activeIndex >= 0 ? `suggestion-item-${activeIndex}` : undefined}
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
            placeholder="Search for products, brands and more…"
            className="search-bar-input"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              padding: '0.625rem 0.5rem',
              fontSize: '0.9375rem',
              backgroundColor: 'transparent',
              minWidth: 0,
            }}
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="search-bar-clear-btn"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center' }}
            >
              <img src={closeIcon} alt="" aria-hidden="true" style={{ width: '1rem', height: '1rem', opacity: 0.5 }} />
            </button>
          )}
          <button
            type="submit"
            aria-label="Submit search"
            className="search-bar-submit-btn"
            style={{
              background: '#111827',
              border: 'none',
              cursor: 'pointer',
              padding: '0.625rem 1rem',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <img src={searchIcon} alt="" aria-hidden="true" style={{ width: '1.25rem', height: '1.25rem', filter: 'invert(1)' }} />
          </button>
        </div>
      </form>

      {isOpen && (
        <AutocompleteSuggestions
          suggestions={suggestions}
          activeIndex={activeIndex}
          isLoading={isLoading}
          query={query}
          onSelect={handleSuggestionSelect}
          onClose={() => { setIsOpen(false); setActiveIndex(-1); }}
        />
      )}
    </div>
  );
}

export default SearchBar;
