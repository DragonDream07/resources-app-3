const { Client } = require('@elastic/elasticsearch');

const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
});

const PRODUCTS_INDEX = process.env.ELASTICSEARCH_INDEX || 'products';

/**
 * Build Elasticsearch query DSL for full-text search with faceted aggregations.
 */
const buildSearchQuery = ({ q, filters, page, size, sort }) => {
  const from = (page - 1) * size;

  const mustClauses = [];

  if (q && q.trim()) {
    mustClauses.push({
      multi_match: {
        query: q.trim(),
        fields: ['name^3', 'description', 'brand', 'category', 'tags'],
        fuzziness: 'AUTO',
      },
    });
  } else {
    mustClauses.push({ match_all: {} });
  }

  const filterClauses = [];

  if (filters) {
    if (filters.category) {
      filterClauses.push({ term: { 'category.keyword': filters.category } });
    }
    if (filters.brand) {
      filterClauses.push({ term: { 'brand.keyword': filters.brand } });
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const rangeFilter = { range: { price: {} } };
      if (filters.minPrice !== undefined) rangeFilter.range.price.gte = parseFloat(filters.minPrice);
      if (filters.maxPrice !== undefined) rangeFilter.range.price.lte = parseFloat(filters.maxPrice);
      filterClauses.push(rangeFilter);
    }
    if (filters.inStock !== undefined) {
      filterClauses.push({ term: { inStock: filters.inStock === 'true' || filters.inStock === true } });
    }
    if (Array.isArray(filters.tags) && filters.tags.length > 0) {
      filterClauses.push({ terms: { 'tags.keyword': filters.tags } });
    }
  }

  const sortOptions = buildSortOptions(sort);

  return {
    index: PRODUCTS_INDEX,
    from,
    size,
    body: {
      query: {
        bool: {
          must: mustClauses,
          filter: filterClauses,
        },
      },
      aggs: {
        categories: {
          terms: { field: 'category.keyword', size: 50 },
        },
        brands: {
          terms: { field: 'brand.keyword', size: 50 },
        },
        price_stats: {
          stats: { field: 'price' },
        },
        in_stock: {
          terms: { field: 'inStock', size: 2 },
        },
      },
      sort: sortOptions,
      highlight: {
        fields: {
          name: {},
          description: {},
        },
      },
    },
  };
};

/**
 * Build sort options from sort query param.
 */
const buildSortOptions = (sort) => {
  switch (sort) {
    case 'price_asc':
      return [{ price: { order: 'asc' } }];
    case 'price_desc':
      return [{ price: { order: 'desc' } }];
    case 'newest':
      return [{ createdAt: { order: 'desc' } }];
    case 'relevance':
    default:
      return ['_score'];
  }
};

/**
 * Full-text search with faceted aggregations.
 */
const search = async ({ q, filters, page, size, sort }) => {
  const esQuery = buildSearchQuery({ q, filters, page, size, sort });

  const { body } = await esClient.search(esQuery);

  const hits = body.hits.hits.map((hit) => ({
    id: hit._id,
    score: hit._score,
    highlight: hit.highlight || {},
    ...hit._source,
  }));

  const total = body.hits.total.value !== undefined ? body.hits.total.value : body.hits.total;

  const facets = {
    categories: (body.aggregations.categories.buckets || []).map((b) => ({
      key: b.key,
      count: b.doc_count,
    })),
    brands: (body.aggregations.brands.buckets || []).map((b) => ({
      key: b.key,
      count: b.doc_count,
    })),
    priceStats: body.aggregations.price_stats,
    inStock: (body.aggregations.in_stock.buckets || []).map((b) => ({
      key: b.key,
      count: b.doc_count,
    })),
  };

  return {
    total,
    page,
    size,
    results: hits,
    facets,
  };
};

/**
 * Autocomplete suggestions using completion suggester and match_phrase_prefix.
 */
const suggest = async ({ q, size }) => {
  if (!q || !q.trim()) {
    return { suggestions: [] };
  }

  const { body } = await esClient.search({
    index: PRODUCTS_INDEX,
    body: {
      size: 0,
      suggest: {
        name_suggest: {
          prefix: q.trim(),
          completion: {
            field: 'nameSuggest',
            size,
            skip_duplicates: true,
            fuzzy: {
              fuzziness: 'AUTO',
            },
          },
        },
      },
      query: {
        multi_match: {
          query: q.trim(),
          type: 'phrase_prefix',
          fields: ['name^3', 'brand', 'category', 'tags'],
        },
      },
      highlight: {
        fields: {
          name: {},
        },
      },
    },
  });

  const completionSuggestions =
    (body.suggest &&
      body.suggest.name_suggest &&
      body.suggest.name_suggest[0] &&
      body.suggest.name_suggest[0].options) ||
    [];

  const suggestions = completionSuggestions.slice(0, size).map((option) => ({
    text: option.text,
    score: option._score,
    id: option._id,
    source: option._source || {},
  }));

  return { suggestions };
};

module.exports = { search, suggest };
