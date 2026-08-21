/**
 * Forum Categories Controller
 * Complete implementation for forum categorization and management
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class ForumCategoriesController {
  /**
   * GET /api/forumcategories
   * Get all forum categories with statistics
   */
  async getAll(req, res) {
    try {
      const { limit = 50, offset = 0, includeStats = 'true' } = req.query;

      let query = ` SELECT 
          c.id,
          c.name,
          c.description,
          c.icon,
          c.color,
          c.is_active,
          c.display_order c.created_at
      `;

      if (includeStats === 'true') {
        query += `,
          COUNT(DISTINCT f.id) as forum_count,
          COUNT(DISTINCT p.id) as post_count
        `;
      }

      query += ` FROM forum_categories c
        LEFT JOIN forums f ON c.id = f.category_id AND f.is_active = true
        LEFT JOIN posts p ON f.id = p.forum_id AND p.is_published = true
        WHERE c.is_active = true
        GROUP BY c.id
        ORDER BY c.display_order ASC, c.name ASC
        LIMIT $1 OFFSET $2
      `;

      const result = await pool.query(query, [parseInt(limit), parseInt(offset)]);

      res.json({
        success: true,
        data: result.rows.map(cat => ({
          ...cat,
          forumCount: cat.forum_count ? parseInt(cat.forum_count) : 0,
          postCount: cat.post_count ? parseInt(cat.post_count) : 0
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset), total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in ForumCategoriesController.getAll:', error);
      res.status(500).json({
        success: false, message: 'Failed to get forum categories', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/forumcategories/:id
   * Get category by ID with forums
   */
  async getById(req, res) {
    try {
      const { id } = req.params;

      // Get category details
      const categoryResult = await pool.query(
        'SELECT * FROM forum_categories WHERE id = $1',
        [id]
      );

      if (categoryResult.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Forum category not found'
        });
      }

      const category = categoryResult.rows[0];

      // Get forums in this category
      const forumsResult = await pool.query(
        `SELECT 
          f.id,
          f.name,
          f.description,
          f.icon,
          COUNT(DISTINCT p.id) as post_count,
          MAX(p.created_at) as last_post_at
         FROM forums f
         LEFT JOIN posts p ON f.id = p.forum_id AND p.is_published = true
         WHERE f.category_id = $1 AND f.is_active = true
         GROUP BY f.id
         ORDER BY f.name ASC`,
        [id]
      );

      res.json({
        success: true,
        data: {
          ...category,
          forums: forumsResult.rows.map(forum => ({
            ...forum, postCount: parseInt(forum.post_count) || 0
          }))
        }
      });
    } catch (error) {
      logger.error('Error in ForumCategoriesController.getById:', error);
      res.status(500).json({
        success: false, message: 'Failed to get forum category', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/forumcategories
   * Create new forum category (admin only)
   */
  async create(req, res) {
    try {
      // Check admin permission
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false, message: 'Admin access required'
        });
      }

      const { name, description, icon, color, displayOrder } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false, message: 'Category name is required'
        });
      }

      const result = await pool.query(
        `INSERT INTO forum_categories 
         (name, description, icon, color, display_order, is_active, created_at)
         VALUES ($1, $2, $3, $4, $5, true, NOW())
         RETURNING *` [name, description || null, icon || null, color || '#000000', displayOrder || 0]
      );

      res.status(201).json({
        success: true, message: 'Forum category created successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in ForumCategoriesController.create:', error);
      res.status(500).json({
        success: false, message: 'Failed to create forum category', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * PUT /api/forumcategories/:id
   * Update forum category (admin only)
   */
  async update(req, res) {
    try {
      // Check admin permission
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false, message: 'Admin access required'
        });
      }

      const { id } = req.params;
      const updates = req.body;

      const setClauses = [];
      const values = [];
      let paramCount = 1;

      Object.keys(updates).forEach(key => {
        if (['name', 'description', 'icon', 'color', 'display_order', 'is_active'].includes(key)) {
          setClauses.push(`${key} = $${paramCount}`);
          values.push(updates[key]);
          paramCount++;
        }
      });

      if (setClauses.length === 0) {
        return res.status(400).json({
          success: false, message: 'No valid fields to update'
        });
      }

      setClauses.push('updated_at = NOW()');
      values.push(id);

      const result = await pool.query(
        `UPDATE forum_categories 
         SET ${setClauses.join(', ')}
         WHERE id = $${paramCount}
         RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Forum category not found'
        });
      }

      res.json({
        success: true, message: 'Forum category updated successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in ForumCategoriesController.update:', error);
      res.status(500).json({
        success: false, message: 'Failed to update forum category', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * DELETE /api/forumcategories/:id
   * Delete forum category (admin only)
   */
  async delete(req, res) {
    try {
      // Check admin permission
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false, message: 'Admin access required'
        });
      }

      const { id } = req.params;

      // Check if category has forums
      const forumsCheck = await pool.query(
        'SELECT COUNT(*) as count FROM forums WHERE category_id = $1 AND is_active = true',
        [id]
      );

      if (parseInt(forumsCheck.rows[0].count) > 0) {
        return res.status(400).json({
          success: false, message: 'Cannot delete category with active forums. Deactivate forums first.'
        });
      }

      const result = await pool.query(
        'DELETE FROM forum_categories WHERE id = $1 RETURNING id',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Forum category not found'
        });
      }

      res.json({
        success: true, message: 'Forum category deleted successfully'
      });
    } catch (error) {
      logger.error('Error in ForumCategoriesController.delete:', error);
      res.status(500).json({
        success: false, message: 'Failed to delete forum category', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/forumcategories/popular
   * Get most popular categories by activity
   */
  async getPopular(req, res) {
    try {
      const { limit = 10 } = req.query;

      const result = await pool.query(
        `SELECT 
          c.id,
          c.name,
          c.description,
          c.icon,
          c.color,
          COUNT(DISTINCT f.id) as forum_count,
          COUNT(DISTINCT p.id) as post_count,
          COUNT(DISTINCT p.author_id) as contributor_count
         FROM forum_categories c
         LEFT JOIN forums f ON c.id = f.category_id AND f.is_active = true
         LEFT JOIN posts p ON f.id = p.forum_id AND p.is_published = true
         WHERE c.is_active = true
         GROUP BY c.id
         ORDER BY post_count DESC
         LIMIT $1`,
        [parseInt(limit)]
      );

      res.json({
        success: true,
        data: result.rows.map(cat => ({
          ...cat,
          forumCount: parseInt(cat.forum_count) || 0,
          postCount: parseInt(cat.post_count) || 0, contributorCount: parseInt(cat.contributor_count) || 0
        }))
      });
    } catch (error) {
      logger.error('Error in ForumCategoriesController.getPopular:', error);
      res.status(500).json({
        success: false, message: 'Failed to get popular categories', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/forumcategories/:id/reorder
   * Reorder category display order (admin only)
   */
  async reorder(req, res) {
    try {
      // Check admin permission
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false, message: 'Admin access required'
        });
      }

      const { id } = req.params;
      const { displayOrder } = req.body;

      if (displayOrder === undefined || displayOrder < 0) {
        return res.status(400).json({
          success: false, message: 'Valid display order is required'
        });
      }

      const result = await pool.query(
        `UPDATE forum_categories 
         SET display_order = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [displayOrder, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Forum category not found'
        });
      }

      res.json({
        success: true, message: 'Category order updated successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in ForumCategoriesController.reorder:', error);
      res.status(500).json({
        success: false, message: 'Failed to reorder category', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new ForumCategoriesController();
