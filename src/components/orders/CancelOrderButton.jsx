import React, { useState } from 'react';

function CancelOrderButton({ orderId, onCancel, disabled, loading: externalLoading }) {
  const [showDialog, setShowDialog] = useState(false);
  const [reason, setReason] = useState('');
  const [internalLoading, setInternalLoading] = useState(false);
  const [error, setError] = useState(null);

  const loading = externalLoading || internalLoading;

  function handleOpenDialog() {
    setError(null);
    setReason('');
    setShowDialog(true);
  }

  function handleCloseDialog() {
    if (loading) return;
    setShowDialog(false);
    setError(null);
    setReason('');
  }

  async function handleConfirmCancel() {
    if (loading) return;
    setError(null);
    setInternalLoading(true);
    try {
      if (onCancel) {
        await onCancel({ orderId, reason });
      }
      setShowDialog(false);
      setReason('');
    } catch (err) {
      setError(err?.message || 'Failed to cancel the order. Please try again.');
    } finally {
      setInternalLoading(false);
    }
  }

  if (disabled) return null;

  return (
    <>
      <button
        type="button"
        onClick={handleOpenDialog}
        className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        Cancel Order
      </button>

      {showDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-dialog-title"
        >
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={handleCloseDialog}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 z-10">
            <h2 id="cancel-dialog-title" className="text-lg font-semibold text-gray-900 mb-2">
              Cancel Order
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>

            <div className="mb-4">
              <label
                htmlFor="cancel-reason"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Reason <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="cancel-reason"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Let us know why you are cancelling..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                disabled={loading}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 mb-3" role="alert">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseDialog}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading && (
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                )}
                {loading ? 'Cancelling…' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CancelOrderButton;
