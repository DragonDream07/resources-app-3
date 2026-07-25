/**
 * Formats an ISO 8601 date string to a human-readable display string.
 *
 * @param {string} isoString - ISO 8601 date string, e.g. "2024-03-15T10:30:00.000Z"
 * @param {object} [options] - Optional Intl.DateTimeFormat options overrides.
 * @returns {string} Formatted date string, e.g. "15 Mar 2024"
 */
export function formatDate(isoString, options = {}) {
  if (!isoString) return '';

  const defaultOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return new Intl.DateTimeFormat('en-IN', mergedOptions).format(new Date(isoString));
}

/**
 * Formats an ISO 8601 date string to a date and time display string.
 *
 * @param {string} isoString - ISO 8601 date string.
 * @returns {string} Formatted date-time string, e.g. "15 Mar 2024, 10:30 AM"
 */
export function formatDateTime(isoString) {
  if (!isoString) return '';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(isoString));
}

/**
 * Formats an ISO 8601 date string to a short numeric date.
 *
 * @param {string} isoString - ISO 8601 date string.
 * @returns {string} Formatted date string, e.g. "15/03/2024"
 */
export function formatDateShort(isoString) {
  if (!isoString) return '';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(isoString));
}

/**
 * Returns a relative time string for a given ISO date.
 *
 * @param {string} isoString - ISO 8601 date string.
 * @returns {string} Relative time string, e.g. "2 days ago"
 */
export function formatRelativeDate(isoString) {
  if (!isoString) return '';

  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  const rtf = new Intl.RelativeTimeFormat('en-IN', { numeric: 'auto' });

  if (Math.abs(diffDays) >= 1) return rtf.format(-diffDays, 'day');
  if (Math.abs(diffHours) >= 1) return rtf.format(-diffHours, 'hour');
  if (Math.abs(diffMinutes) >= 1) return rtf.format(-diffMinutes, 'minute');
  return rtf.format(-diffSeconds, 'second');
}
