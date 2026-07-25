import React, { useEffect, useRef } from 'react';

/**
 * ReportChart — a wrapper around Chart.js for admin consolidated reports.
 * Falls back gracefully if Chart.js is not installed.
 *
 * Props:
 *   type         — 'bar' | 'line' | 'pie' | 'doughnut' (default: 'bar')
 *   data         — Chart.js data object { labels, datasets }
 *   options      — Chart.js options object (optional)
 *   title        — chart title string (optional)
 *   height       — canvas height in px (default: 320)
 *   loading      — boolean
 *   emptyMessage — string shown when data has no labels
 */
const CHART_COLORS = [
  '#6366f1',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
];

const DEFAULT_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: { size: 12 },
        color: '#374151',
      },
    },
    tooltip: {
      backgroundColor: '#1f2937',
      titleColor: '#f9fafb',
      bodyColor: '#d1d5db',
      cornerRadius: 6,
    },
  },
  scales: {
    x: {
      grid: { color: '#f3f4f6' },
      ticks: { color: '#6b7280', font: { size: 11 } },
    },
    y: {
      grid: { color: '#f3f4f6' },
      ticks: { color: '#6b7280', font: { size: 11 } },
      beginAtZero: true,
    },
  },
};

const mergeOptions = (base, overrides) => {
  if (!overrides) return base;
  return {
    ...base,
    ...overrides,
    plugins: { ...(base.plugins || {}), ...(overrides.plugins || {}) },
    scales: { ...(base.scales || {}), ...(overrides.scales || {}) },
  };
};

const ReportChart = ({
  type = 'bar',
  data,
  options,
  title,
  height = 320,
  loading = false,
  emptyMessage = 'No data available for this period.',
}) => {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const hasData =
    data &&
    data.labels &&
    data.labels.length > 0 &&
    data.datasets &&
    data.datasets.length > 0;

  useEffect(() => {
    if (!hasData || loading) return;

    let cancelled = false;

    const initChart = async () => {
      let Chart;
      try {
        const mod = await import('chart.js/auto');
        Chart = mod.default || mod;
      } catch {
        return;
      }

      if (cancelled || !canvasRef.current) return;

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }

      const enrichedData = {
        ...data,
        datasets: data.datasets.map((ds, i) => ({
          backgroundColor:
            type === 'line' ? `${CHART_COLORS[i % CHART_COLORS.length]}33` : CHART_COLORS[i % CHART_COLORS.length],
          borderColor: CHART_COLORS[i % CHART_COLORS.length],
          borderWidth: type === 'line' ? 2 : 1,
          pointRadius: type === 'line' ? 4 : undefined,
          tension: type === 'line' ? 0.3 : undefined,
          ...ds,
        })),
      };

      const mergedOptions = mergeOptions(DEFAULT_OPTIONS, options);

      // Pie/doughnut don't use scales
      if (type === 'pie' || type === 'doughnut') {
        delete mergedOptions.scales;
      }

      chartInstanceRef.current = new Chart(canvasRef.current, {
        type,
        data: enrichedData,
        options: mergedOptions,
      });
    };

    initChart();

    return () => {
      cancelled = true;
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [type, data, options, hasData, loading]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col gap-4">
      {title && (
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      )}

      {loading ? (
        <div
          className="flex items-center justify-center bg-gray-50 rounded animate-pulse"
          style={{ height }}
        >
          <span className="text-sm text-gray-400">Loading chart…</span>
        </div>
      ) : !hasData ? (
        <div
          className="flex items-center justify-center bg-gray-50 rounded"
          style={{ height }}
        >
          <span className="text-sm text-gray-400 italic">{emptyMessage}</span>
        </div>
      ) : (
        <div style={{ height, position: 'relative' }}>
          <canvas ref={canvasRef} />
        </div>
      )}
    </div>
  );
};

export default ReportChart;
