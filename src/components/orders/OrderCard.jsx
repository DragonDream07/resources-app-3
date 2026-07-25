import React from 'react';
import { Link } from 'react-router-dom';

const STATUS_BADGE_STYLES = {
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PACKED: 'bg-yellow-100 text-yellow-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  RETURN_REQUESTED: 'bg-orange-100 text-orange-800',
  RETURNED: 'bg-gray-100 text-gray-800',
};

const DEFAULT_BADGE_STYLE = 'bg-gray-100 text-gray-700';

function StatusBadge({ status }) {
  const style = STATUS_BADGE_STYLES[status] || DEFAULT_BADGE_STYLE;
  const label = status ? status.replace(/_/g, ' ') : 'Unknown';
  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold tracking-wide ${style}`}>
      {label}
    </span>
  );
}

function OrderCard({ order }) {
  const {
    id,
    orderId,
    created_at,
    createdAt,
    status,
    total,
    total_amount,
    items,
    item_count,
  } = order || {};

  const displayId = orderId || id;
  const displayDate = created_at || createdAt;
  const displayTotal = total ?? total_amount;
  const displayItemCount = item_count ?? (items ? items.length : undefined);

  const formattedDate = displayDate
    ? new Date(displayDate).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

  const formattedTotal =
    displayTotal !== undefined && displayTotal !== null
      ? `₹${Number(displayTotal).toFixed(2)}`
      : '—';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500">Order</span>
        <StatusBadge status={status} />
      </div>

      <div className="mb-1">
        <span className="text-xs text-gray-400 uppercase tracking-wide">ID</span>
        <p className="text-sm font-mono font-semibold text-gray-800 truncate">{displayId || '—'}</p>
      </div>

      <div className="mb-1">
        <span className="text-xs text-gray-400 uppercase tracking-wide">Date</span>
        <p className="text-sm text-gray-700">{formattedDate}</p>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div>
          {displayItemCount !== undefined && (
            <span className="text-xs text-gray-500">
              {displayItemCount} {displayItemCount === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="text-sm font-semibold text-gray-900">{formattedTotal}</span>
        </div>
      </div>

      {displayId && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <Link
            to={`/account/orders/${displayId}`}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            View Details →
          </Link>
        </div>
      )}
    </div>
  );
}

export default OrderCard;
