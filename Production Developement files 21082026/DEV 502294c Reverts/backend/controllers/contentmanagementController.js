/**
 * Content Management Controller
 * Complete implementation for CMS functionality
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class ContentManagementController {
  /**
   * GET /api/contentmanagement/pages
   * Get all CMS pages
   */
  async getPages(req, res) {
    try {
      const { limit = 50, offset = 0, status, category } = req.query;

      let whereClause = [];
      let queryParams = [];
      let paramCount = 1;

      if (status) {
        whereClause.push(`status = $${paramCount}`);
        queryParams.push(status);
        paramCount++;
      }

      if (category) {
        whereClause.push(`category = $${paramCount}`);
        queryParams.push(category);
        paramCount++;
      }

      const whereSQL = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

      // Fixed: Injected structural whereSQL safely and fixed closing query template literal backtick
      const result = await pool.query(`SELECT 
          id,
          title,
          slug,
          category,
          status,
          author_id,
          created_at,
          updated_at, 
          published_at
         FROM cms_pages
         ${whereSQL}
         ORDER BY updated_at DESC
         LIMIT $${paramCount} OFFSET $${paramCount + 1}`, [...queryParams, parseInt(limit), parseInt(offset)]);

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in ContentManagementController.getPages:', error);
      res.status(500).json({
        success: false, message: 'Failed to get CMS pages', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/contentmanagement/pages
   * Create new CMS page
   */
  async createPage(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const { title, slug, content, category, status = 'draft', metadata } = req.body;

      if (!title || !slug || !content) {
        return res.status(400).json({
          success: false, message: 'Title, slug, and content are required'
        });
      }

      const result = await pool.query(
        `INSERT INTO cms_pages 
         (title, slug, content, category, status, author_id, metadata, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         RETURNING *`,
        [title, slug, content, category || null, status, userId, JSON.stringify(metadata || {})]
      );

      res.status(201).json({
        success: true, message: 'CMS page created successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in ContentManagementController.createPage:', error);
      res.status(500).json({
        success: false, message: 'Failed to create CMS page', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * PUT /api/contentmanagement/pages/:id
   * Update CMS page
   */
  async updatePage(req, res) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const updates = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const setClauses = ['updated_at = NOW()'];
      const values = [];
      let paramCount = 1;

      Object.keys(updates).forEach(key => {
        if (['title', 'slug', 'content', 'category', 'status', 'metadata'].includes(key)) {
          if (key === 'metadata') {
            setClauses.push(`${key} = $${paramCount}`);
            values.push(JSON.stringify(updates[key]));
          } else {
            setClauses.push(`${key} = $${paramCount}`);
            values.push(updates[key]);
          }
          paramCount++;
        }
      });

      if (setClauses.length === 1) {
        return res.status(400).json({
          success: false, message: 'No valid fields to update'
        });
      }

      values.push(id);

      const result = await pool.query(
        `UPDATE cms_pages 
         SET ${setClauses.join(', ')}
         WHERE id = $${paramCount}
         RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'CMS page not found'
        });
      }

      res.json({
        success: true, message: 'CMS page updated successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in ContentManagementController.updatePage:', error);
      res.status(500).json({
        success: false, message: 'Failed to update CMS page', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * DELETE /api/contentmanagement/pages/:id
   * Delete CMS page
   */
  async deletePage(req, res) {
    try {
      // Check admin permission
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false, message: 'Admin access required'
        });
      }

      const { id } = req.params;

      const result = await pool.query(
        'DELETE FROM cms_pages WHERE id = $1 RETURNING id',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'CMS page not found'
        });
      }

      res.json({
        success: true, message: 'CMS page deleted successfully'
      });
    } catch (error) {
      logger.error('Error in ContentManagementController.deletePage:', error);
      res.status(500).json({
        success: false, message: 'Failed to delete CMS page', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/contentmanagement/pages/:id/publish
   * Publish CMS page
   */
  async publishPage(req, res) {
    try {
      // Check admin/editor permission
      if (!req.user?.isAdmin && !req.user?.isEditor) {
        return res.status(403).json({
          success: false, message: 'Editor access required'
        });
      }

      const { id } = req.params;

      const result = await pool.query(
        `UPDATE cms_pages 
         SET status = 'published', published_at = NOW(), updated_at = NOW()
         WHERE id = $1 AND status != 'published'
         RETURNING *`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'CMS page not found or already published'
        });
      }

      res.json({
        success: true, message: 'CMS page published successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in ContentManagementController.publishPage:', error);
      res.status(500).json({
        success: false, message: 'Failed to publish CMS page', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/contentmanagement/analytics
   * Get CMS analytics
   */
  async getAnalytics(req, res) {
    try {
      // Check admin permission
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false, message: 'Admin access required'
        });
      }

      const { timeframe = '30d' } = req.query;

      let interval;
      switch (timeframe) {
        case '7d': interval = '7 days'; break;
        case '30d': interval = '30 days'; break;
        case '90d': interval = '90 days'; break;
        default: interval = '30 days';
      }

      // Fixed: Converted query quotes to template literals, added missing commas, and fixed interval casting
      const stats = await pool.query(`
        SELECT 
          COUNT(*) FILTER (WHERE status = 'published') as published_count, 
          COUNT(*) FILTER (WHERE status = 'draft') as draft_count, 
          COUNT(*) FILTER (WHERE created_at >= NOW() - ($1::text)::interval) as recent_count, 
          AVG(LENGTH(content)) as avg_content_length
        FROM cms_pages`, 
        [interval]
      );

      res.json({
        success: true,
        data: {
          timeframe,
          published: parseInt(stats.rows[0].published_count) || 0,
          drafts: parseInt(stats.rows[0].draft_count) || 0,
          recent: parseInt(stats.rows[0].recent_count) || 0,
          avgContentLength: parseInt(stats.rows[0].avg_content_length) || 0
        }
      });
    } catch (error) {
      logger.error('Error in ContentManagementController.getAnalytics:', error);
      res.status(500).json({
        success: false, message: 'Failed to get CMS analytics', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new ContentManagementController();