import React from 'react';
import { Link } from 'react-router-dom';
import starIcon from '@/assets/icons/star.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import PriceDisplay from './PriceDisplay';

function RatingBadge({ rating, reviewCount }) {
  if (rating == null) return null;
  return (
    <span className="inline-flex items-center gap-1 bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
      <img src={starIcon} alt="star" className="w-3 h-3 invert" />
      {Number(rating).toFixed(1)}
      {reviewCount != null && (
        <span className="font-normal opacity-80">({reviewCount})</span>
      )}
    </span>
  );
}

export default function ProductCard({ product }) {
  if (!product) return null;

  const {
    id,
    slug,
    name,
    price,
    originalPrice,
    taxInclusivePrice,
    images,
    rating,
    reviewCount,
  } = product;

  const imageUrl =
    (images && images.length > 0 ? images[0].url : null) || placeholderProduct;

  const linkTo = slug ? `/products/${slug}` : `/products/${id}`;

  return (
    <Link
      to={linkTo}
      className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = placeholderProduct;
          }}
        />
        {rating != null && (
          <div className="absolute bottom-2 left-2">
            <RatingBadge rating={rating} reviewCount={reviewCount} />
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col gap-1">
        <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">
          {name}
        </p>
        <PriceDisplay
          price={taxInclusivePrice ?? price}
          originalPrice={originalPrice}
          className="mt-1"
        />
      </div>
    </Link>
  );
}
