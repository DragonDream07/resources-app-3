import React from 'react';

const STAGES = [
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'PACKED', label: 'Packed' },
  { key: 'SHIPPED', label: 'Shipped' },
  { key: 'DELIVERED', label: 'Delivered' },
];

const STAGE_ORDER = STAGES.map((s) => s.key);

const CANCELLED_STATUSES = ['CANCELLED', 'RETURN_REQUESTED', 'RETURNED'];

function getStageIndex(status) {
  const idx = STAGE_ORDER.indexOf(status);
  return idx;
}

function StageIcon({ done, active, cancelled }) {
  if (cancelled) {
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 border-2 border-red-400">
        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>
    );
  }
  if (done) {
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 border-2 border-green-500">
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }
  if (active) {
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 border-2 border-indigo-600">
        <span className="w-3 h-3 rounded-full bg-white" />
      </span>
    );
  }
  return (
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 border-2 border-gray-300">
      <span className="w-3 h-3 rounded-full bg-gray-400" />
    </span>
  );
}

function StatusTimeline({ status, timeline }) {
  const isCancelled = CANCELLED_STATUSES.includes(status);
  const currentIndex = getStageIndex(status);

  return (
    <div className="w-full">
      <div className="flex items-center">
        {STAGES.map((stage, idx) => {
          const done = !isCancelled && currentIndex > idx;
          const active = !isCancelled && currentIndex === idx;
          const isLast = idx === STAGES.length - 1;

          const stageTimestamp = timeline
            ? timeline.find((t) => t.status === stage.key || t.stage === stage.key)
            : null;

          return (
            <React.Fragment key={stage.key}>
              <div className="flex flex-col items-center">
                <StageIcon done={done} active={active} cancelled={isCancelled && idx === 0} />
                <span
                  className={`mt-2 text-xs font-medium text-center ${
                    done || active ? 'text-gray-800' : 'text-gray-400'
                  }`}
                  style={{ minWidth: '60px' }}
                >
                  {stage.label}
                </span>
                {stageTimestamp && (
                  <span className="mt-1 text-xs text-gray-400 text-center">
                    {new Date(stageTimestamp.created_at || stageTimestamp.timestamp).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                )}
              </div>
              {!isLast && (
                <div
                  className={`flex-1 h-1 mx-1 rounded ${
                    !isCancelled && currentIndex > idx ? 'bg-green-400' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {isCancelled && (
        <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="text-sm text-red-700 font-medium">
            Order {status.replace(/_/g, ' ').toLowerCase()}
          </span>
        </div>
      )}
    </div>
  );
}

export default StatusTimeline;
