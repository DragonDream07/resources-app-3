'use strict';

const { Client } = require('@elastic/elasticsearch');

const PRODUCTS_INDEX = 'products';
const SUGGESTIONS_INDEX = 'products_suggest';

// ---------------------------------------------------------------------------
// Client singleton
// ---------------------------------------------------------------------------

let _client = null;

function getClient() {
  if (!_client) {
    _client = new Client({
      node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
      auth:
        process.env.ELASTICSEARCH_USERNAME && process.env.ELASTICSEARCH_PASSWORD
          ? {
              username: process.env.ELASTICSEARCH_USERNAME,
              password: process.env.ELASTICSEARCH_PASSWORD,
            }
          : undefined,
      tls:
        process.env.ELASTICSEARCH_TLS_REJECT_UNAUTHORIZED === 'false'
          ? { rejectUnauthorized: false }
          : undefined,
      maxRetries: 3,
      requestTimeout: 10000,
    });
  }
  return _client;
}

// ---------------------------------------------------------------------------
// Index mapping helpers
// ---------------------------------------------------------------------------

const PRODUCTS_MAPPING = {
  mappings: {
    properties: {
      productId: { type: 'keyword' },
      name: {
        type: 'text',
        analyzer: 'standard',
        fields: {
          keyword: { type: 'keyword', ignore_above: 256 },
          suggest: { type: 'completion' },
        },
      },
      description: { type: 'text', analyzer: 'standard' },
      brandId: { type: 'keyword' },
      brandName: {
        type: 'text',
        fields: { keyword: { type: 'keyword', ignore_above: 256 } },
      },
      categoryId: { type: 'keyword' },
      categoryName: {
        type: 'text',
        fields: { keyword: { type: 'keyword', ignore_above: 256 } },
      },
      tags: { type: 'keyword' },
      price: { type: 'double' },
      salePrice: { type: 'double' },
      currency: { type: 'keyword' },
      inStock: { type: 'boolean' },
      stockQuantity: { type: 'integer' },
      rating: { type: 'float' },
      reviewCount: { type: 'integer' },
      images: {
        type: 'nested',
        properties: {
          url: { type: 'keyword', index: false },
          altText: { type: 'text', index: false },
        },
      },
      attributes: { type: 'object', dynamic: true },
      isActive: { type: 'boolean' },
      createdAt: { type: 'date' },
      updatedAt: { type: 'date' },
    },
  },
  settings: {
    number_of_shards: 1,
    number_of_replicas: 0,
    analysis: {
      analyzer: {
        standard: {
          type: 'standard',
          stopwords: '_english_',
        },
      },
    },
  },
};

async function createProductsIndex() {
  const client = getClient();
  const exists = await client.indices.exists({ index: PRODUCTS_INDEX });
  if (!exists) {
    await client.indices.create({
      index: PRODUCTS_INDEX,
      body: PRODUCTS_MAPPING,
    });
  }
  return PRODUCTS_INDEX;
}

async function deleteProductsIndex() {
  const client = getClient();
  const exists = await client.indices.exists({ index: PRODUCTS_INDEX });
  if (exists) {
    await client.indices.delete({ index: PRODUCTS_INDEX });
  }
}

async function reindexProducts() {
  await deleteProductsIndex();
  await createProductsIndex();
}

// ---------------------------------------------------------------------------
// Document helpers
// ---------------------------------------------------------------------------

async function indexProduct(product) {
  const client = getClient();
  return client.index({
    index: PRODUCTS_INDEX,
    id: String(product.productId),
    body: product,
    refresh: 'wait_for',
  });
}

async function updateProduct(productId, partialDoc) {
  const client = getClient();
  return client.update({
    index: PRODUCTS_INDEX,
    id: String(productId),
    body: { doc: partialDoc },
    refresh: 'wait_for',
  });
}

async function deleteProduct(productId) {
  const client = getClient();
  return client.delete({
    index: PRODUCTS_INDEX,
    id: String(productId),
    refresh: 'wait_for',
  });
}

async function bulkIndexProducts(products) {
  if (!products || products.length === 0) return null;
  const client = getClient();
  const body = products.flatMap((product) => [
    { index: { _index: PRODUCTS_INDEX, _id: String(product.productId) } },
    product,
  ]);
  return client.bulk({ body, refresh: 'wait_for' });
}

// ---------------------------------------------------------------------------
// Query builders
// ---------------------------------------------------------------------------

/**
 * Build an Elasticsearch query body for the /search endpoint.
 *
 * @param {object} params
 * @param {string}  [params.q]           - Full-text search term
 * @param {string}  [params.categoryId]  - Filter by category
 * @param {string}  [params.brandId]     - Filter by brand
 * @param {number}  [params.minPrice]    - Minimum price filter
 * @param {number}  [params.maxPrice]    - Maximum price filter
 * @param {boolean} [params.inStock]     - Filter by stock availability
 * @param {string}  [params.sortBy]      - Field to sort by
 * @param {string}  [params.sortOrder]   - 'asc' or 'desc'
 * @param {number}  [params.page]        - 1-based page number
 * @param {number}  [params.limit]       - Results per page
 * @returns {object} Elasticsearch request body
 */
function buildSearchQuery(params = {}) {
  const {
    q,
    categoryId,
    brandId,
    minPrice,
    maxPrice,
    inStock,
    sortBy = '_score',
    sortOrder = 'desc',
    page = 1,
    limit = 20,
  } = params;

  const mustClauses = [];
  const filterClauses = [{ term: { isActive: true } }];

  // Full-text query
  if (q && q.trim()) {
    mustClauses.push({
      multi_match: {
        query: q.trim(),
        fields: ['name^3', 'description^1', 'brandName^2', 'categoryName^1', 'tags^2'],
        type: 'best_fields',
        fuzziness: 'AUTO',
        operator: 'or',
      },
    });
  } else {
    mustClauses.push({ match_all: {} });
  }

  // Category filter
  if (categoryId) {
    filterClauses.push({ term: { categoryId: String(categoryId) } });
  }

  // Brand filter
  if (brandId) {
    filterClauses.push({ term: { brandId: String(brandId) } });
  }

  // Price range filter
  const priceRange = {};
  if (minPrice !== undefined && minPrice !== null) priceRange.gte = Number(minPrice);
  if (maxPrice !== undefined && maxPrice !== null) priceRange.lte = Number(maxPrice);
  if (Object.keys(priceRange).length > 0) {
    filterClauses.push({ range: { price: priceRange } });
  }

  // Stock filter
  if (inStock === true || inStock === 'true') {
    filterClauses.push({ term: { inStock: true } });
  }

  // Pagination
  const from = (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit));
  const size = Math.max(1, Number(limit));

  // Sort
  const allowedSortFields = ['price', 'rating', 'reviewCount', 'createdAt', 'name.keyword'];
  const resolvedSortBy = allowedSortFields.includes(sortBy) ? sortBy : '_score';
  const resolvedSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

  const sort = [
    { [resolvedSortBy]: { order: resolvedSortOrder } },
    { _score: { order: 'desc' } },
  ];

  return {
    from,
    size,
    body: {
      query: {
        bool: {
          must: mustClauses,
          filter: filterClauses,
        },
      },
      sort,
      aggs: {
        categories: {
          terms: { field: 'categoryId', size: 20 },
          aggs: {
            categoryName: { terms: { field: 'categoryName.keyword', size: 1 } },
          },
        },
        brands: {
          terms: { field: 'brandId', size: 20 },
          aggs: {
            brandName: { terms: { field: 'brandName.keyword', size: 1 } },
          },
        },
        priceStats: {
          stats: { field: 'price' },
        },
        inStock: {
          terms: { field: 'inStock' },
        },
      },
      highlight: {
        fields: {
          name: { number_of_fragments: 0 },
          description: { number_of_fragments: 2, fragment_size: 150 },
        },
        pre_tags: ['<mark>'],
        post_tags: ['</mark>'],
      },
    },
  };
}

/**
 * Build an Elasticsearch suggest query for the /search/suggest endpoint.
 *
 * @param {object} params
 * @param {string} params.q      - Prefix / partial query string
 * @param {number} [params.size] - Max number of suggestions to return
 * @returns {object} Elasticsearch request body
 */
function buildSuggestQuery(params = {}) {
  const { q = '', size = 10 } = params;
  return {
    body: {
      suggest: {
        productSuggest: {
          prefix: q.trim(),
          completion: {
            field: 'name.suggest',
            size: Math.max(1, Number(size)),
            skip_duplicates: true,
            fuzzy: { fuzziness: 'AUTO' },
          },
        },
        phraseSuggest: {
          text: q.trim(),
          phrase: {
            field: 'name',
            size: Math.max(1, Number(size)),
            gram_size: 3,
            highlight: {
              pre_tag: '<em>',
              post_tag: '</em>',
            },
          },
        },
      },
      _source: false,
    },
  };
}

/**
 * Execute a search request against the products index.
 *
 * @param {object} queryBody - Output of buildSearchQuery()
 * @returns {Promise<object>} Raw Elasticsearch response
 */
async function search(queryBody) {
  const client = getClient();
  const { from, size, body } = queryBody;
  return client.search({
    index: PRODUCTS_INDEX,
    from,
    size,
    body,
  });
}

/**
 * Execute a suggest request against the products index.
 *
 * @param {object} suggestBody - Output of buildSuggestQuery()
 * @returns {Promise<object>} Raw Elasticsearch response
 */
async function suggest(suggestBody) {
  const client = getClient();
  return client.search({
    index: PRODUCTS_INDEX,
    body: suggestBody.body,
  });
}

// ---------------------------------------------------------------------------
// Result parsers
// ---------------------------------------------------------------------------

/**
 * Parse a raw Elasticsearch search response into a structured result.
 *
 * @param {object} esResponse - Raw Elasticsearch response
 * @param {object} params     - Original search params (for pagination metadata)
 * @returns {object} Parsed result with hits, total, aggregations
 */
function parseSearchResponse(esResponse, params = {}) {
  const { page = 1, limit = 20 } = params;
  const hitsData = esResponse.hits || {};
  const total = typeof hitsData.total === 'object' ? hitsData.total.value : hitsData.total || 0;
  const hits = (hitsData.hits || []).map((hit) => ({
    ...hit._source,
    _score: hit._score,
    _highlight: hit.highlight || null,
  }));

  const aggregations = esResponse.aggregations || {};
  const facets = {
    categories: _parseBucketAgg(aggregations.categories),
    brands: _parseBucketAgg(aggregations.brands),
    priceStats: aggregations.priceStats || null,
    inStock: _parseBucketAgg(aggregations.inStock),
  };

  return {
    hits,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Math.max(1, Number(limit))),
    facets,
  };
}

/**
 * Parse a raw Elasticsearch suggest response into a flat suggestions array.
 *
 * @param {object} esResponse - Raw Elasticsearch response
 * @returns {string[]} Suggested terms
 */
function parseSuggestResponse(esResponse) {
  const suggestions = new Set();

  const suggestData = esResponse.suggest || {};

  // Completion suggestions
  const completionOptions = (suggestData.productSuggest || []).flatMap(
    (s) => s.options || []
  );
  completionOptions.forEach((opt) => {
    if (opt.text) suggestions.add(opt.text);
  });

  // Phrase suggestions
  const phraseOptions = (suggestData.phraseSuggest || []).flatMap(
    (s) => s.options || []
  );
  phraseOptions.forEach((opt) => {
    if (opt.text) suggestions.add(opt.text);
  });

  return Array.from(suggestions);
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function _parseBucketAgg(agg) {
  if (!agg || !agg.buckets) return [];
  return agg.buckets.map((bucket) => ({
    key: bucket.key,
    count: bucket.doc_count,
  }));
}

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

async function ping() {
  const client = getClient();
  return client.ping();
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  // Constants
  PRODUCTS_INDEX,
  SUGGESTIONS_INDEX,

  // Client
  getClient,

  // Index management
  createProductsIndex,
  deleteProductsIndex,
  reindexProducts,

  // Document operations
  indexProduct,
  updateProduct,
  deleteProduct,
  bulkIndexProducts,

  // Query builders
  buildSearchQuery,
  buildSuggestQuery,

  // Execution
  search,
  suggest,

  // Response parsers
  parseSearchResponse,
  parseSuggestResponse,

  // Health
  ping,
};
