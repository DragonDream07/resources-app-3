import React, { useState } from 'react';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';
import starIcon from '@/assets/icons/star.svg';

const RATING_OPTIONS = [4, 3, 2, 1];

function CollapsibleSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 py-4">
      <button
        type="button"
        className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 hover:text-gray-900"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <img
          src={chevronDownIcon}
          alt=""
          className={`w-4 h-4 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default function FilterPanel({
  brands = [],
  selectedBrands = [],
  onBrandChange,
  priceRange = { min: 0, max: 10000 },
  selectedPriceRange = { min: 0, max: 10000 },
  onPriceRangeChange,
  selectedRating = null,
  onRatingChange,
  facetCounts = {},
  className = '',
}) {
  const handleBrandToggle = (brandId) => {
    if (!onBrandChange) return;
    if (selectedBrands.includes(brandId)) {
      onBrandChange(selectedBrands.filter((b) => b !== brandId));
    } else {
      onBrandChange([...selectedBrands, brandId]);
    }
  };

  const handleMinPrice = (e) => {
    if (!onPriceRangeChange) return;
    const val = Number(e.target.value);
    onPriceRangeChange({ ...selectedPriceRange, min: val });
  };

  const handleMaxPrice = (e) => {
    if (!onPriceRangeChange) return;
    const val = Number(e.target.value);
    onPriceRangeChange({ ...selectedPriceRange, max: val });
  };

  const handleRatingClick = (rating) => {
    if (!onRatingChange) return;
    onRatingChange(selectedRating === rating ? null : rating);
  };

  return (
    <aside className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4 ${className}`}>
      <h2 className="text-base font-bold text-gray-800 mb-2">Filters</h2>

      {/* Brand Filter */}
      {brands.length > 0 && (
        <CollapsibleSection title="Brand">
          <ul className="flex flex-col gap-2">
            {brands.map((brand) => {
              const count = facetCounts?.brands?.[brand.id];
              const checked = selectedBrands.includes(brand.id);
              return (
                <li key={brand.id}>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-blue-600 rounded"
                      checked={checked}
                      onChange={() => handleBrandToggle(brand.id)}
                    />
                    <span className="flex-1">{brand.name}</span>
                    {count != null && (
                      <span className="text-xs text-gray-400">({count})</span>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
        </CollapsibleSection>
      )}

      {/* Price Range Filter */}
      <CollapsibleSection title="Price Range">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Min (₹)</label>
              <input
                type="number"
                min={priceRange.min}
                max={selectedPriceRange.max}
                value={selectedPriceRange.min}
                onChange={handleMinPrice}
                className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-gray-400 pt-5">–</span>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Max (₹)</label>
              <input
                type="number"
                min={selectedPriceRange.min}
                max={priceRange.max}
                value={selectedPriceRange.max}
                onChange={handleMaxPrice}
                className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={selectedPriceRange.min}
              onChange={handleMinPrice}
              className="w-full accent-blue-600"
            />
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={selectedPriceRange.max}
              onChange={handleMaxPrice}
              className="w-full accent-blue-600"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Rating Filter */}
      <CollapsibleSection title="Customer Rating">
        <ul className="flex flex-col gap-2">
          {RATING_OPTIONS.map((rating) => {
            const count = facetCounts?.ratings?.[rating];
            const selected = selectedRating === rating;
            return (
              <li key={rating}>
                <button
                  type="button"
                  onClick={() => handleRatingClick(rating)}
                  className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-sm transition-colors ${
                    selected
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <img
                        key={i}
                        src={starIcon}
                        alt=""
                        className={`w-3.5 h-3.5 ${
                          i < rating ? 'opacity-100' : 'opacity-25'
                        }`}
                      />
                    ))}
                  </span>
                  <span className="flex-1 text-left">{rating}+ Stars</span>
                  {count != null && (
                    <span className="text-xs text-gray-400">({count})</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </CollapsibleSection>
    </aside>
  );
}
