import React, { useState, useMemo, useCallback } from 'react';

const SORT_ASC = 'asc';
const SORT_DESC = 'desc';

const AdminDataTable = ({
  columns = [],
  data = [],
  loading = false,
  totalCount = 0,
  page = 1,
  pageSize = 20,
  onPageChange,
  onSortChange,
  emptyMessage = 'No records found.',
  rowKey = 'id',
  actions,
}) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDir, setSortDir] = useState(SORT_ASC);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handleSort = useCallback((colKey) => {
    if (!colKey) return;
    let newDir = SORT_ASC;
    if (sortColumn === colKey) {
      newDir = sortDir === SORT_ASC ? SORT_DESC : SORT_ASC;
    }
    setSortColumn(colKey);
    setSortDir(newDir);
    if (onSortChange) {
      onSortChange(colKey, newDir);
    }
  }, [sortColumn, sortDir, onSortChange]);

  const sortedData = useMemo(() => {
    if (!sortColumn || onSortChange) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (aVal === bVal) return 0;
      const cmp = aVal > bVal ? 1 : -1;
      return sortDir === SORT_ASC ? cmp : -cmp;
    });
  }, [data, sortColumn, sortDir, onSortChange]);

  const renderSortIcon = (colKey) => {
    if (sortColumn !== colKey) return <span className="ml-1 text-gray-300">⇅</span>;
    return (
      <span className="ml-1 text-indigo-500">
        {sortDir === SORT_ASC ? '↑' : '↓'}
      </span>
    );
  };

  const handlePageFirst = useCallback(() => { if (onPageChange) onPageChange(1); }, [onPageChange]);
  const handlePagePrev = useCallback(() => { if (onPageChange) onPageChange(page - 1); }, [onPageChange, page]);
  const handlePageNext = useCallback(() => { if (onPageChange) onPageChange(page + 1); }, [onPageChange, page]);
  const handlePageLast = useCallback(() => { if (onPageChange) onPageChange(totalPages); }, [onPageChange, totalPages]);

  const skeletonRowCount = pageSize > 5 ? 5 : pageSize;

  const getPageNum = (i, totalPagesCount, currentPage) => {
    if (totalPagesCount <= 5) return i + 1;
    if (currentPage <= 3) return i + 1;
    if (currentPage >= totalPagesCount - 2) return totalPagesCount - 4 + i;
    return currentPage - 2 + i;
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap ${
                    col.sortable ? 'cursor-pointer select-none hover:text-gray-700' : ''
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.label}
                  {col.sortable && renderSortIcon(col.key)}
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: skeletonRowCount }).map((_, i) => (
                <tr key={`skeleton-${i}`}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-16" />
                    </td>
                  )}
                </tr>
              ))
            ) : sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-4 py-10 text-center text-gray-400 italic"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row) => (
                <tr
                  key={row[rowKey]}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-gray-800 whitespace-nowrap">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Page {page} of {totalPages}
            {totalCount > 0 && (
              <span className="ml-2 text-gray-400">({totalCount} total)</span>
            )}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePageFirst}
              disabled={page === 1}
              className="px-2 py-1 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100 transition-colors"
            >
              «
            </button>
            <button
              onClick={handlePagePrev}
              disabled={page === 1}
              className="px-2 py-1 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100 transition-colors"
            >
              ‹
            </button>

            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNum = getPageNum(i, totalPages, page);
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange && onPageChange(pageNum)}
                  className={`px-3 py-1 rounded border transition-colors ${
                    pageNum === page
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={handlePageNext}
              disabled={page === totalPages}
              className="px-2 py-1 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100 transition-colors"
            >
              ›
            </button>
            <button
              onClick={handlePageLast}
              disabled={page === totalPages}
              className="px-2 py-1 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100 transition-colors"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDataTable;
