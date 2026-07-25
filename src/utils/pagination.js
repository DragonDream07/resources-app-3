/**
 * Parse pagination query parameters, applying defaults and caps.
 *
 * @param {object} query - Express req.query
 * @param {number} [defaultLimit=20]
 * @param {number} [maxLimit=100]
 * @returns {{ page: number, limit: number, offset: number }}
 */
const parsePagination = (query, defaultLimit = 20, maxLimit = 100) => {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (!Number.isFinite(page) || page < 1) page = 1;
  if (!Number.isFinite(limit) || limit < 1) limit = defaultLimit;
  if (limit > maxLimit) limit = maxLimit;

  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

/**
 * Build the offset from page and limit.
 *
 * @param {number} page  - 1-based page number
 * @param {number} limit - items per page
 * @returns {number} offset
 */
const buildOffset = (page, limit) => (page - 1) * limit;

/**
 * Format a standard paginated response envelope.
 *
 * @param {Array}  data      - Items for the current page
 * @param {number} total     - Total number of matching records
 * @param {number} page      - Current 1-based page number
 * @param {number} limit     - Items per page
 * @returns {object}
 */
const formatPaginatedResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

module.exports = {
  parsePagination,
  buildOffset,
  formatPaginatedResponse,
};
