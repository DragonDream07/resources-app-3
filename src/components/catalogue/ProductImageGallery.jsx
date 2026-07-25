import React, { useState } from 'react';
import chevronLeftIcon from '@/assets/icons/chevron-left.svg';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

export default function ProductImageGallery({ images = [], productName = '' }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const resolvedImages =
    images && images.length > 0
      ? images
      : [{ url: placeholderProduct, altText: productName }];

  const activeImage = resolvedImages[activeIndex];

  const goToPrev = () =>
    setActiveIndex((i) =>
      i === 0 ? resolvedImages.length - 1 : i - 1
    );

  const goToNext = () =>
    setActiveIndex((i) =>
      i === resolvedImages.length - 1 ? 0 : i + 1
    );

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
        <img
          src={activeImage.url || placeholderProduct}
          alt={activeImage.altText || productName}
          className="w-full h-full object-contain object-center"
          onError={(e) => {
            e.currentTarget.src = placeholderProduct;
          }}
        />
        {resolvedImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow p-1.5 transition"
            >
              <img src={chevronLeftIcon} alt="Previous" className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow p-1.5 transition"
            >
              <img src={chevronRightIcon} alt="Next" className="w-5 h-5" />
            </button>
          </>
        )}
        {resolvedImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {resolvedImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to image ${idx + 1}`}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === activeIndex
                    ? 'bg-blue-600 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {resolvedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {resolvedImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`View image ${idx + 1}`}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                idx === activeIndex
                  ? 'border-blue-500 shadow-sm'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={img.url || placeholderProduct}
                alt={img.altText || `${productName} ${idx + 1}`}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.currentTarget.src = placeholderProduct;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
