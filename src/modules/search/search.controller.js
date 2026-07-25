const searchService = require('./search.service');

/**
 * GET /search
 * Full-text search with faceted filters
 */
const search = async (req, res, next) => {
  try {
    const { q, filters, page, size, sort } = req.query;

    const parsedFilters = filters ? JSON.parse(filters) : {};
    const parsedPage = parseInt(page, 10) || 1;
    const parsedSize = parseInt(size, 10) || 20;

    const result = await searchService.search({
      q,
      filters: parsedFilters,
      page: parsedPage,
      size: parsedSize,
      sort,
    });

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /search/suggest
 * Autocomplete suggestions
 */
const suggest = async (req, res, next) => {
  try {
    const { q, size } = req.query;
    const parsedSize = parseInt(size, 10) || 10;

    const result = await searchService.suggest({ q, size: parsedSize });

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { search, suggest };
