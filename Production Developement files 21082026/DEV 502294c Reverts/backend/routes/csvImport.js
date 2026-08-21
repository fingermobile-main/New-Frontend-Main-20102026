const express = require('express');
const csvimport = require('../controllers/csvImportController.js');
const CsvImportService = require('../services/csvImportService');
const router = express.Router();

router.post("/import-all", csvimport.create);
router.post("/import-members", csvimport.create);
router.post("/import-blog-posts", csvimport.create);
router.post("/import-forum-categories", csvimport.create);

module.exports = router;