'use strict';

const express = require('express');
const router = express.Router();
const crossStoreSearchController = require('../controllers/crossStoreSearchController');

// GET /api/v1/stores/search or /api/stores/search
router.get('/search', (req, res) => crossStoreSearchController.searchStores(req, res));

module.exports = router;
