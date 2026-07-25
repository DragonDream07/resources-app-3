import { useState, useCallback, useMemo } from 'react';

const INITIAL_FILTERS = {
  category: '',
  brand: '',
  minPrice: '',
  maxPrice: '',
  sort: '',
  inStock: false,
};

export function useFilters(overrides = {}) {
  const [filters, setFilters] = useState({ ...INITIAL_FILTERS, ...overrides });

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleFilter = useCallback((key, value) => {
    setFilters((prev) => {
      const current = prev[key];
      if (Array.isArray(current)) {
        return {
          ...prev,
          [key]: current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value],
        };
      }
      return { ...prev, [key]: current === value ? '' : value };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ ...INITIAL_FILTERS, ...overrides });
  }, [overrides]);

  const queryParams = useMemo(() => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value === '' || value === false || value === null || value === undefined) return;
      if (Array.isArray(value) && value.length === 0) return;
      params[key] = Array.isArray(value) ? value.join(',') : value;
    });
    return params;
  }, [filters]);

  return { filters, setFilter, toggleFilter, resetFilters, queryParams };
}
