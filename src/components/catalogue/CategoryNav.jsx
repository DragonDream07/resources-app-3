import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';

function CategoryNavItem({ category, depth = 0 }) {
  const { categoryId } = useParams();
  const hasChildren = category.children && category.children.length > 0;
  const isActive = String(categoryId) === String(category.id);
  const [expanded, setExpanded] = useState(isActive || depth === 0);

  const paddingLeft = depth * 12;

  return (
    <li>
      <div
        className={`flex items-center justify-between rounded-lg transition-colors ${
          isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
        }`}
        style={{ paddingLeft: `${8 + paddingLeft}px` }}
      >
        <Link
          to={`/categories/${category.id}`}
          className={`flex-1 py-2 text-sm font-medium ${
            isActive ? 'text-blue-700' : 'text-gray-700'
          }`}
        >
          {category.name}
        </Link>
        {hasChildren && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse' : 'Expand'}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <img
              src={expanded ? chevronDownIcon : chevronRightIcon}
              alt=""
              className="w-3.5 h-3.5"
            />
          </button>
        )}
      </div>
      {hasChildren && expanded && (
        <ul className="mt-0.5">
          {category.children.map((child) => (
            <CategoryNavItem key={child.id} category={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function CategoryNav({
  categories = [],
  title = 'Categories',
  className = '',
  loading = false,
}) {
  if (loading) {
    return (
      <nav
        className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4 animate-pulse ${className}`}
      >
        <div className="h-5 bg-gray-200 rounded w-1/2 mb-3" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-100 rounded mb-2" />
        ))}
      </nav>
    );
  }

  return (
    <nav
      className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4 ${className}`}
      aria-label={title}
    >
      {title && (
        <p className="text-base font-bold text-gray-800 mb-3">{title}</p>
      )}
      {categories.length === 0 ? (
        <p className="text-sm text-gray-400">No categories available.</p>
      ) : (
        <ul className="flex flex-col gap-0.5">
          {categories.map((category) => (
            <CategoryNavItem key={category.id} category={category} depth={0} />
          ))}
        </ul>
      )}
    </nav>
  );
}
