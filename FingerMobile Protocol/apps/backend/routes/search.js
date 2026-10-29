const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const SearchService = require('../services/SearchService');
const logger = require('../utils/logger');
const search = require('../controllers/searchController.js');
const visualSearchController = require('../controllers/visualSearchController');
const { authenticate, optionalAuthenticate, requireAdmin } = require('../middleware/authenticate');

// Visual Image Search Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `${Date.now()}_visual_search_${Math.random().toString(36).substring(2, 9)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }
});

// POST /api/search/image - Multimodal commerce visual image search
router.post('/image', optionalAuthenticate, upload.single('image'), (req, res) => {
  return visualSearchController.searchByImage(req, res);
});

// POST /api/search/visual - Visual commerce search alias
router.post('/visual', optionalAuthenticate, upload.single('image'), (req, res) => {
  return visualSearchController.searchByImage(req, res);
});

// GET /api/search/visual/recommendations - Visual recommendations
router.get('/visual/recommendations', optionalAuthenticate, (req, res) => {
  return visualSearchController.getVisualSearchRecommendations(req, res);
});

// GET /api/search - Full-text search with Elasticsearch
router.get('/', async (req, res) => {
  try {
    const { q, type, limit = 20, offset = 0 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false, error: 'Search query required'
      });
    }

    // Use Elasticsearch for full-text search
    if (process.env.ENABLE_ELASTICSEARCH === 'true') {
      const results = await SearchService.search(q, {
        type,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return res.json({
        success: true,
        results: results.hits,
        total: results.total, took: results.took
      });
    }

    // Fallback to basic database search
    search.getAll(req, res);
  } catch (error) {
    logger.error('❌ Search failed:', error.message);
    res.status(500).json({
      success: false, error: 'Search failed'
    });
  }
});

// GET /api/search/suggestions - Autocomplete suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        suggestions: []
      });
    }

    // Get autocomplete suggestions from Elasticsearch
    const suggestions = await SearchService.getSuggestions(q, parseInt(limit));

    res.json({
      success: true, suggestions
    });
  } catch (error) {
    logger.error('❌ Get suggestions failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to get suggestions'
    });
  }
});

// POST /api/search/index - Index content in Elasticsearch
router.post('/index', authenticate, requireAdmin, async (req, res) => {
  try {
    // Verify admin role
    if (!req.user?.isAdmin && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const { documentId, documentType, data } = req.body;

    if (!documentId || !documentType || !data) {
      return res.status(400).json({
        success: false, error: 'documentId, documentType, and data required'
      });
    }

    await SearchService.indexDocument(documentId, documentType, data);

    res.json({
      success: true, message: 'Document indexed successfully'
    });
  } catch (error) {
    logger.error('❌ Index document failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to index document'
    });
  }
});

// DELETE /api/search/index/:id - Remove document from Elasticsearch index
router.delete('/index/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify admin role
    if (!req.user?.isAdmin && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    await SearchService.removeDocument(id);

    res.json({
      success: true, message: 'Document removed from index'
    });
  } catch (error) {
    logger.error('❌ Remove document failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to remove document'
    });
  }
});

// Legacy routes (kept for backward compatibility)
router.post('/queries', search.create);
router.get('/queries', search.getAll);
router.post('/saved', search.create);
router.get('/saved', search.getAll);
router.put('/saved/:id', search.update);
router.delete('/saved/:id', search.delete);

module.exports = router;
