import React from 'react';

function formatPrice(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function PriceDisplay({
  price,
  originalPrice,
  currency = 'INR',
  size = 'md',
  className = '',
  showTaxLabel = false,
}) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  const mainSizeClass = sizeClasses[size] || sizeClasses.md;

  const hasDiscount =
    originalPrice != null &&
    Number(originalPrice) > 0 &&
    Number(originalPrice) > Number(price);

  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100
      )
    : null;

  if (price == null) return null;

  return (
    <div className={`flex flex-wrap items-baseline gap-2 ${className}`}>
      <span className={`font-bold text-gray-900 ${mainSizeClass}`}>
        {formatPrice(price, currency)}
      </span>
      {hasDiscount && (
        <span className="text-sm text-gray-400 line-through">
          {formatPrice(originalPrice, currency)}
        </span>
      )}
      {discountPercent != null && discountPercent > 0 && (
        <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
          -{discountPercent}%
        </span>
      )}
      {showTaxLabel && (
        <span className="text-xs text-gray-400">(incl. taxes)</span>
      )}
    </div>
  );
}
