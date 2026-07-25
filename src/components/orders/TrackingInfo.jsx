import React from 'react';
import packageIcon from '@/assets/icons/package.svg';
import mapPinIcon from '@/assets/icons/map-pin.svg';

const DEFAULT_EVENTS = [];

function TrackingInfo({ tracking }) {
  if (!tracking) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-400">
        <img src={packageIcon} alt="Package" className="w-10 h-10 mb-3 opacity-40" />
        <p className="text-sm">Tracking information not yet available.</p>
      </div>
    );
  }

  const {
    carrier,
    tracking_number,
    trackingNumber,
    estimated_delivery,
    estimatedDelivery,
    current_location,
    currentLocation,
    events,
    status,
  } = tracking;

  const displayTrackingNumber = tracking_number || trackingNumber;
  const displayEstimated = estimated_delivery || estimatedDelivery;
  const displayLocation = current_location || currentLocation;
  const displayEvents = events || DEFAULT_EVENTS;

  const formattedEstimated = displayEstimated
    ? new Date(displayEstimated).toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <img src={packageIcon} alt="" className="w-5 h-5" />
        Shipment Tracking
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {carrier && (
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wide">Carrier</span>
            <p className="text-sm font-medium text-gray-800 mt-0.5">{carrier}</p>
          </div>
        )}
        {displayTrackingNumber && (
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wide">Tracking Number</span>
            <p className="text-sm font-mono font-medium text-gray-800 mt-0.5">{displayTrackingNumber}</p>
          </div>
        )}
        {formattedEstimated && (
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wide">Estimated Delivery</span>
            <p className="text-sm font-medium text-gray-800 mt-0.5">{formattedEstimated}</p>
          </div>
        )}
        {status && (
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wide">Status</span>
            <p className="text-sm font-medium text-gray-800 mt-0.5">{status}</p>
          </div>
        )}
        {displayLocation && (
          <div className="flex items-start gap-1.5 sm:col-span-2">
            <img src={mapPinIcon} alt="" className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wide">Current Location</span>
              <p className="text-sm font-medium text-gray-800 mt-0.5">{displayLocation}</p>
            </div>
          </div>
        )}
      </div>

      {displayEvents.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Tracking History</h4>
          <ol className="relative border-l border-gray-200 ml-2">
            {displayEvents.map((event, idx) => {
              const eventTime = event.timestamp || event.created_at || event.date;
              const formattedTime = eventTime
                ? new Date(eventTime).toLocaleString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : null;
              return (
                <li key={idx} className="mb-4 ml-4 last:mb-0">
                  <span className="absolute -left-1.5 flex items-center justify-center w-3 h-3 rounded-full bg-indigo-400 ring-2 ring-white" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {event.description || event.message || event.status}
                    </p>
                    {event.location && (
                      <p className="text-xs text-gray-500 mt-0.5">{event.location}</p>
                    )}
                    {formattedTime && (
                      <time className="text-xs text-gray-400 mt-0.5 block">{formattedTime}</time>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}

export default TrackingInfo;
