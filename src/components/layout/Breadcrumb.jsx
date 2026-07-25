import { Link } from 'react-router-dom';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';

/**
 * Breadcrumb component.
 *
 * Props:
 *   items: Array<{ label: string, to?: string }>
 *     - The last item is treated as the current page (no link rendered).
 *     - Any item with a `to` prop renders as a link.
 */
function Breadcrumb({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 && (
                <img
                  src={chevronRightIcon}
                  alt=""
                  className="h-3 w-3 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
              )}
              {isLast || !item.to ? (
                <span
                  className={isLast ? 'text-gray-900 font-medium' : 'text-gray-500'}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
