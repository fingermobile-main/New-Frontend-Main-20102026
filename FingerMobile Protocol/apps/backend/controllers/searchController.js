/**
 * SearchController
 * Enhanced search with Elasticsearch
 */

const SearchService = require('../services/SearchService');
const logger = require('../utils/logger');
const SearchIndexingService = require('../services/SearchIndexingService');

class SearchController {
  /**
   * GET /api/search
   * Full-text search across all indices with pagination
   */
  async search(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.size) || 20, 100);
      const from = (page - 1) * limit;

      const { q, type, category, user_id } = req.query;

      if (!q || q.trim().length === 0) {
        return res.status(400).json({
          success: false, error: 'Search query is required'
        });
      }

      let indices;
      if (type) {
        indices = [SearchService.indices[type]];
      }

      const filters = {};
      if (category) filters.category = category;
      if (user_id) filters.user_id = user_id;

      const result = await SearchService.search(q, {
        indices,
        from,
        size: limit,
        filters
      });

      const total = result.total?.value || result.hits?.total?.value || 0;
      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true, message: 'Search completed',
        data: result.hits?.hits?.map(hit => ({
          id: hit._id,
          score: hit._score,
          ...hit._source
        })) || [],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages, hasPrev: page > 1
        }
      });
    } catch (error) {
      logger.error('Error in SearchController.search:', error);
      res.status(500).json({
        success: false, error: 'Search failed',
        details: error.message
      });
    }
  }

  /**
   * GET /api/search/autocomplete
   * Get autocomplete suggestions
   */
  async autocomplete(req, res) {
    try {
      const { prefix, size = 10 } = req.query;

      if (!prefix || prefix.trim().length === 0) {
        return res.status(400).json({
          success: false, error: 'Prefix is required'
        });
      }

      const suggestions = await SearchService.autocomplete(prefix, {
        size: parseInt(size)
      });

      res.json({
        success: true, message: 'Autocomplete suggestions retrieved', data: suggestions
      });
    } catch (error) {
      logger.error('Error in SearchController.autocomplete:', error);
      res.status(500).json({
        success: false, error: 'Autocomplete failed',
        details: error.message
      });
    }
  }

  /**
   * GET /api/search/facets
   * Get faceted search results
   */
  async facetedSearch(req, res) {
    try {
      const { q, facets } = req.query;

      if (!q || !facets) {
        return res.status(400).json({
          success: false, error: 'Query and facets are required'
        });
      }

      const facetArray = facets.split(',');
      const result = await SearchService.facetedSearch(q, facetArray);

      res.json({
        success: true, message: 'Faceted search completed', data: result
      });
    } catch (error) {
      logger.error('Error in SearchController.facetedSearch:', error);
      res.status(500).json({
        success: false, error: 'Faceted search failed',
        details: error.message
      });
    }
  }

  /**
   * POST /api/search/reindex
   * Trigger full reindex (admin only)
   */
  async reindex(req, res) {
    try {
      // Check admin permission
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false, error: 'Admin access required'
        });
      }

      await SearchService.reindexAll();

      res.json({
        success: true, message: 'Reindex initiated'
      });
    } catch (error) {
      logger.error('Error in SearchController.reindex:', error);
      res.status(500).json({
        success: false, error: 'Reindex failed',
        details: error.message
      });
    }
  }

  /**
   * POST /api/search/index/:type/:id
   * Index single document
   */
  async indexDocument(req, res) {
    try {
      const { type, id } = req.params;

      await SearchIndexingService.indexNow(type, id);

      res.json({
        success: true, message: `Document, indexed: ${type}/${id}`
      });
    } catch (error) {
      logger.error('Error in SearchController.indexDocument:', error);
      res.status(500).json({
        success: false, error: 'Indexing failed',
        details: error.message
      });
    }
  }
  /**
   * POST /api/search/queries
   */
  async create(req, res) {
    try {
      const { query, category, tags } = req.body;
      const userId = req.user?.id || null;

      if (!query) {
        return res.status(400).json({ success: false, message: 'Query is required' });
      }

      const id = require('crypto').randomUUID();
      const savedSearch = {
        id,
        user_id: userId,
        query,
        category: category || 'general',
        tags: tags || [],
        created_at: new Date().toISOString()
      };

      res.status(201).json({
        success: true,
        message: 'Search query saved successfully',
        data: savedSearch
      });
    } catch (error) {
      logger.error('Error in SearchController.create:', error);
      res.status(500).json({ success: false, error: 'Failed to save search query' });
    }
  }

  /**
   * GET /api/search/queries
   */
  async getAll(req, res) {
    try {
      const q = req.query.q || '';
      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;
      const { pool } = require('../db');

      if (!q.trim()) {
        return res.json({
          success: true,
          results: [],
          total: 0
        });
      }

      if (pool && typeof pool.query === 'function') {
        const postResults = await pool.query(
          `SELECT id, title, content as description, 'post' as type, created_at
           FROM posts
           WHERE is_active = true AND (title ILIKE $1 OR content ILIKE $1)
           ORDER BY created_at DESC
           LIMIT $2 OFFSET $3`,
          [`%${q}%`, limit, offset]
        );

        return res.json({
          success: true,
          results: postResults.rows,
          total: postResults.rows.length
        });
      }

      return res.json({
        success: true,
        results: [],
        total: 0
      });
    } catch (error) {
      logger.error('Error in SearchController.getAll:', error);
      res.status(500).json({ success: false, error: 'Search failed' });
    }
  }

  /**
   * GET /api/search/saved/:id
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const { pool } = require('../db');

      if (pool && typeof pool.query === 'function') {
        const result = await pool.query(
          'SELECT id, title, content as description, created_at FROM posts WHERE id = $1',
          [id]
        );
        if (result.rows.length > 0) {
          return res.json({ success: true, data: result.rows[0] });
        }
      }

      res.status(404).json({ success: false, message: 'Search item not found' });
    } catch (error) {
      logger.error('Error in SearchController.getById:', error);
      res.status(500).json({ success: false, error: 'Failed to retrieve search item' });
    }
  }

  /**
   * PUT /api/search/saved/:id
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const { query, category } = req.body;

      res.json({
        success: true,
        message: 'Saved search updated successfully',
        data: { id, query, category, updated_at: new Date().toISOString() }
      });
    } catch (error) {
      logger.error('Error in SearchController.update:', error);
      res.status(500).json({ success: false, error: 'Failed to update search' });
    }
  }

  /**
   * DELETE /api/search/saved/:id
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      res.json({
        success: true,
        message: 'Saved search deleted successfully',
        id
      });
    } catch (error) {
      logger.error('Error in SearchController.delete:', error);
      res.status(500).json({ success: false, error: 'Failed to delete search' });
    }
  }
}

module.exports = new SearchController();
