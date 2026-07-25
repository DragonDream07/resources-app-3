const express = require('express');
const router = express.Router();
const searchController = require('./search.controller');
const { validateSearch, validateSuggest } = require('./search.validator');

// GET /search - full-text search with facets
router.get('/', validateSearch, searchController.search);

// GET /search/suggest - autocomplete suggestions
router.get('/suggest', validateSuggest, searchController.suggest);

module.exports = router;
