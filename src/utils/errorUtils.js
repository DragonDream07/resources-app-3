/**
 * Parses an API error response into a user-facing message string.
 *
 * Handles Axios error objects, fetch Response objects, plain Error instances,
 * and raw API response bodies from the backend.
 *
 * @param {unknown} error - The error thrown by an API call.
 * @param {string} [fallback='Something went wrong. Please try again.'] - Fallback message.
 * @returns {string} A user-facing error message.
 */
export function parseApiError(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback;

  // Axios-style error with a response body
  if (error.response) {
    const data = error.response.data;
    if (data) {
      if (typeof data.message === 'string' && data.message) return data.message;
      if (typeof data.error === 'string' && data.error) return data.error;
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        return formatValidationErrors(data.errors);
      }
    }
    return getHttpStatusMessage(error.response.status) || fallback;
  }

  // Network / CORS errors (Axios)
  if (error.request && !error.response) {
    return 'Network error. Please check your connection and try again.';
  }

  // Plain Error instances
  if (error instanceof Error) {
    return error.message || fallback;
  }

  // Raw API response body object
  if (typeof error === 'object') {
    if (typeof error.message === 'string' && error.message) return error.message;
    if (typeof error.error === 'string' && error.error) return error.error;
    if (Array.isArray(error.errors) && error.errors.length > 0) {
      return formatValidationErrors(error.errors);
    }
  }

  // String errors
  if (typeof error === 'string' && error) return error;

  return fallback;
}

/**
 * Formats an array of validation error objects into a single readable string.
 *
 * Supports objects with `message`, `msg`, or `field`+`message` shape.
 *
 * @param {Array<{field?: string, message?: string, msg?: string}>} errors
 * @returns {string}
 */
export function formatValidationErrors(errors) {
  if (!Array.isArray(errors) || errors.length === 0) return '';

  return errors
    .map((e) => {
      if (typeof e === 'string') return e;
      const msg = e.message || e.msg || '';
      const field = e.field || e.param || '';
      if (field && msg) return `${field}: ${msg}`;
      return msg;
    })
    .filter(Boolean)
    .join('. ');
}

/**
 * Returns a generic user-facing message for common HTTP status codes.
 *
 * @param {number} status - HTTP status code.
 * @returns {string}
 */
export function getHttpStatusMessage(status) {
  const messages = {
    400: 'Invalid request. Please check your input and try again.',
    401: 'You are not authenticated. Please log in and try again.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'A conflict occurred. The resource may already exist.',
    422: 'The submitted data is invalid. Please correct the errors and try again.',
    429: 'Too many requests. Please slow down and try again shortly.',
    500: 'An internal server error occurred. Please try again later.',
    502: 'Service temporarily unavailable. Please try again later.',
    503: 'Service temporarily unavailable. Please try again later.',
  };
  return messages[status] || '';
}

/**
 * Extracts field-level validation errors from an API response into a
 * key-value map suitable for setting form errors (e.g. react-hook-form).
 *
 * @param {unknown} error - The error thrown by an API call.
 * @returns {Record<string, string>} Map of field name to error message.
 */
export function extractFieldErrors(error) {
  const fieldErrors = {};

  const errors =
    error?.response?.data?.errors ||
    error?.data?.errors ||
    error?.errors ||
    [];

  if (!Array.isArray(errors)) return fieldErrors;

  for (const e of errors) {
    const field = e.field || e.param;
    const message = e.message || e.msg;
    if (field && message) {
      fieldErrors[field] = message;
    }
  }

  return fieldErrors;
}
