import React, { useState } from 'react';

const DECISIONS = [
  { value: 'approved', label: 'Approve' },
  { value: 'rejected', label: 'Reject' },
];

const ReturnApprovalPanel = ({
  returnRequest,
  onReview,
  submitting = false,
  error = null,
}) => {
  const [decision, setDecision] = useState('');
  const [refundNote, setRefundNote] = useState('');
  const [localError, setLocalError] = useState(null);

  const isResolved =
    returnRequest?.status === 'approved' ||
    returnRequest?.status === 'rejected';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!decision) {
      setLocalError('Please select a decision.');
      return;
    }
    setLocalError(null);
    if (onReview) {
      await onReview({
        decision,
        refund_note: refundNote,
      });
    }
  };

  if (!returnRequest) {
    return (
      <div className="text-sm text-gray-400 italic">No return request selected.</div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
      <h3 className="text-base font-semibold text-gray-800">Return Request Review</h3>

      {/* Return Request Summary */}
      <div className="bg-gray-50 rounded p-4 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-500">Return ID</span>
          <span className="font-medium text-gray-800">{returnRequest.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Order ID</span>
          <span className="font-medium text-gray-800">{returnRequest.order_id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Reason</span>
          <span className="font-medium text-gray-800 text-right max-w-xs">{returnRequest.reason}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Status</span>
          <span
            className={`inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase ${
              returnRequest.status === 'approved'
                ? 'bg-green-100 text-green-700'
                : returnRequest.status === 'rejected'
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {returnRequest.status}
          </span>
        </div>
      </div>

      {isResolved ? (
        <div className="text-sm text-gray-500 italic">
          This return request has already been resolved.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {(error || localError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm">
              {error || localError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Decision</label>
            <div className="flex gap-3">
              {DECISIONS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDecision(d.value)}
                  className={`px-4 py-2 rounded text-sm font-medium border transition-colors ${
                    decision === d.value
                      ? d.value === 'approved'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="refund-note"
            >
              Refund Note
            </label>
            <textarea
              id="refund-note"
              value={refundNote}
              onChange={(e) => setRefundNote(e.target.value)}
              rows={3}
              placeholder="Optional note for the customer regarding the refund…"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !decision}
              className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Submitting…' : 'Submit Decision'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReturnApprovalPanel;
