import React from 'react';

const TrendIndicator = ({ trend, value }) => {
  if (trend === undefined || trend === null) return null;
  const isPositive = trend >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-sm font-medium ${
        isPositive ? 'text-green-600' : 'text-red-600'
      }`}
    >
      <span>{isPositive ? '▲' : '▼'}</span>
      <span>{Math.abs(trend)}%</span>
      {value && <span className="text-gray-500 font-normal">{value}</span>}
    </span>
  );
};

const StatsCard = ({
  label,
  value,
  trend,
  trendLabel,
  icon,
  prefix,
  suffix,
  loading = false,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </span>
        {icon && (
          <span className="text-gray-400 text-xl">{icon}</span>
        )}
      </div>

      <div className="flex items-end gap-2">
        {loading ? (
          <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
        ) : (
          <span className="text-3xl font-bold text-gray-900">
            {prefix && <span className="text-xl font-semibold text-gray-600 mr-0.5">{prefix}</span>}
            {value}
            {suffix && <span className="text-xl font-semibold text-gray-600 ml-0.5">{suffix}</span>}
          </span>
        )}
      </div>

      {(trend !== undefined && trend !== null) && (
        <div className="flex items-center gap-1">
          <TrendIndicator trend={trend} />
          {trendLabel && (
            <span className="text-sm text-gray-400">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsCard;
