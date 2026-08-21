const express = require('express');
const search = require('../controllers/searchController.js');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();

// Search endpoints
router.get("/", authenticate, search.search);
router.get("/autocomplete", authenticate, search.autocomplete);
router.get("/facets", authenticate, search.facetedSearch);
router.post("/reindex", authenticate, search.reindex); // Admin only
router.post("/index/:type/:id", authenticate, search.indexDocument);

module.exports = router;
