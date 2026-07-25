import { useState, useEffect, useRef, useCallback } from 'react';

const DEBOUNCE_DELAY_MS = 300;

async function callSearch(query, params) {
  const url = new URL('/search', window.location.origin);
  if (query) url.searchParams.set('q', query);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  });
  const token = localStorage.getItem('token');
  const res = await fetch(url.toString(), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Search request failed');
  return res.json();
}

async function callSuggest(query) {
  const url = new URL('/search/suggest', window.location.origin);
  url.searchParams.set('q', query);
  const token = localStorage.getItem('token');
  const res = await fetch(url.toString(), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Suggest request failed');
  return res.json();
}

export function useSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  const search = useCallback(async (q, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await callSearch(q, params);
      setResults(data.products ?? data.results ?? data.data ?? data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const debounceSuggest = useCallback((q) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q || q.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSuggestLoading(true);
      try {
        const data = await callSuggest(q);
        setSuggestions(data.suggestions ?? data.data ?? data);
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestLoading(false);
      }
    }, DEBOUNCE_DELAY_MS);
  }, []);

  const handleQueryChange = useCallback(
    (q) => {
      setQuery(q);
      debounceSuggest(q);
    },
    [debounceSuggest]
  );

  const clearSuggestions = useCallback(() => setSuggestions([]), []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    query,
    setQuery: handleQueryChange,
    results,
    suggestions,
    loading,
    suggestLoading,
    error,
    search,
    clearSuggestions,
  };
}
