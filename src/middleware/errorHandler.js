'use strict';

/**
 * Centralised Express error handler.
 * Must be registered LAST among app.use() calls.
 *
 * Produces a consistent structured JSON error response:
 * {
 *   status : "error",
 *   code   : string,
 *   message: string,
 *   errors : array | undefined   (validation details when present)
 * }
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Determine HTTP status code
  const statusCode =
    typeof err.statusCode === 'number' && err.statusCode >= 100 && err.statusCode < 600
      ? err.statusCode
      : 500;

  // Determine a machine-readable code
  const code = err.code || (statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'ERROR');

  const body = {
    status: 'error',
    code,
    message: statusCode === 500 ? 'An unexpected internal server error occurred.' : err.message || 'An error occurred.',
  };

  // Attach validation details when present (e.g. Joi validation errors)
  if (err.details && Array.isArray(err.details)) {
    body.errors = err.details;
  } else if (err.errors && Array.isArray(err.errors)) {
    body.errors = err.errors;
  }

  // Log 5xx errors to stderr
  if (statusCode >= 500) {
    console.error('[ErrorHandler]', err);
  }

  return res.status(statusCode).json(body);
}

module.exports = errorHandler;
