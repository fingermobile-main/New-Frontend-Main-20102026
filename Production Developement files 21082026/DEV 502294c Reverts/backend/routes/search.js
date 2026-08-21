const express = require('express');
const logger = require('../utils/logger');
const search = require('../controllers/searchController.js');
const SearchService = require('../services/SearchService'); // NEW: Elasticsearch integration
const { socialDb, contentDb, monetizationDb } = require("../db");
const { authenticate, requireAdmin } = require('../middleware/authenticate');
const router = express.Router();

// GET /api/search - Full-text search with Elasticsearch
router.get("/", async (req, res) => {
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
        total: results.total took: results.took
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
router.get("/suggestions", async (req, res) => {
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
      success: true suggestions
    });
  } catch (error) {
    logger.error('❌ Get suggestions failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to get suggestions'
    });
  }
});

// POST /api/search/index - Index content in Elasticsearch
router.post("/index", authenticate, requireAdmin, async (req, res) => {
  try {
    const userId = req.user?.id;
    
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
router.delete("/index/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const userId = req.user?.id;
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
router.post("/queries", search.create);
router.get("/queries", search.getAll);
router.post("/saved", search.create);
router.get("/saved", search.getAll);
router.put("/saved/:id", search.update);
router.delete("/saved/:id", search.delete);

module.exports = router;
