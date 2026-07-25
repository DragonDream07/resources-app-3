import React, { useState } from 'react';

const ORDER_STATUS_FLOW = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
];

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const OrderStatusAdvancer = ({
  orderId,
  currentStatus,
  allowedRoles = ['admin', 'superadmin'],
  userRole,
  onAdvance,
  loading = false,
}) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isAuthorized = allowedRoles.includes(userRole);

  const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus);
  const nextStatuses = currentIndex >= 0
    ? ORDER_STATUS_FLOW.slice(currentIndex + 1)
    : [];

  const isFinalStatus = currentStatus === 'delivered' || currentStatus === 'cancelled';

  const handleAdvance = async () => {
    if (!selectedStatus) return;
    setError(null);
    setSubmitting(true);
    try {
      if (onAdvance) {
        await onAdvance(orderId, selectedStatus);
      }
      setSelectedStatus('');
    } catch (err) {
      setError(err?.message || 'Failed to advance order status.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="text-sm text-gray-400 italic">
        You do not have permission to advance order status.
      </div>
    );
  }

  if (isFinalStatus) {
    return (
      <div className="text-sm text-gray-500">
        Order is in a final state:{' '}
        <span className="font-semibold">{STATUS_LABELS[currentStatus] || currentStatus}</span>.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <span className="text-sm text-gray-500">Current Status: </span>
        <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 uppercase">
          {STATUS_LABELS[currentStatus] || currentStatus}
        </span>
      </div>

      {nextStatuses.length > 0 ? (
        <div className="flex items-center gap-3 flex-wrap">
          <select
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            disabled={submitting || loading}
          >
            <option value="">Select next status…</option>
            {nextStatuses.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s] || s}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleAdvance}
            disabled={!selectedStatus || submitting || loading}
            className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Advancing…' : 'Advance Status'}
          </button>
        </div>
      ) : (
        <div className="text-sm text-gray-500">No further statuses available.</div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default OrderStatusAdvancer;
