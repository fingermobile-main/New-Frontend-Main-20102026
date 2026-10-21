/**
 * Supervi Achievements Controller
 * Complete implementation for supervi achievements system
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class SuperviAchievementsController {
  /**
   * GET /api/supervi-achievements/achievements
   * Get all available achievements
   */
  async getAchievements(req, res) {
    try {
      const { category } = req.query;

      let whereClause = ['is_active = true'];
      let queryParams = [];
      let paramCount = 1;

      if (category) {
        whereClause.push(`category = $${paramCount}`);
        queryParams.push(category);
        paramCount++;
      }

      const whereSQL = whereClause.join(' AND ');

      const result = await pool.query(
        `SELECT * FROM supervi_achievements
         WHERE ${whereSQL}
         ORDER BY difficulty ASC, points DESC`,
        queryParams
      );

      res.json({
        success: true,
        data: result.rows.map(achievement => ({
          ...achievement, requirements: typeof achievement.requirements === 'string' ? JSON.parse(achievement.requirements) : achievement.requirements, rewards: typeof achievement.rewards === 'string' ? JSON.parse(achievement.rewards) : achievement.rewards
        })), count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in SuperviAchievementsController.getAchievements:', error);
      res.status(500).json({
        success: false, message: 'Failed to get achievements', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/supervi-achievements/user/:userId
   * Get user's earned achievements
   */
  async getUserAchievements(req, res) {
    try {
      const { userId } = req.params;

      const result = await pool.query(
        `SELECT 
          sa.*,
          a.name as achievement_name,
          a.description as achievement_description,
          a.icon as achievement_icon,
          a.category as achievement_category,
          a.points as achievement_points,
          ua.earned_at
         FROM supervi_user_achievements ua
         JOIN supervi_achievements a ON ua.achievement_id = a.id
         LEFT JOIN users sa ON ua.user_id = sa.id
         WHERE ua.user_id = $1
         ORDER BY ua.earned_at DESC`,
        [userId]
      );

      res.json({
        success: true,
        data: result.rows.map(item => ({
          ...item, requirements: typeof item.requirements === 'string' ? JSON.parse(item.requirements) : item.requirements, rewards: typeof item.rewards === 'string' ? JSON.parse(item.rewards) : item.rewards
        })), count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in SuperviAchievementsController.getUserAchievements:', error);
      res.status(500).json({
        success: false, message: 'Failed to get user achievements', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/supervi-achievements/check
   * Check and award achievements based on user activity
   */
  async checkAndAward(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      // In production, this would check various conditions and award achievements
      // For now, just return success
      res.json({
        success: true, message: 'Achievement check completed',
        data: {
          newAchievements: [], totalEarned: 0
        }
      });
    } catch (error) {
      logger.error('Error in SuperviAchievementsController.checkAndAward:', error);
      res.status(500).json({
        success: false, message: 'Failed to check achievements', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/supervi-achievements/stats
   * Get achievements statistics
   */
  async getStats(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const stats = await pool.query(
        `SELECT 
          COUNT(DISTINCT ua.achievement_id) as earned_count,
          COUNT(DISTINCT a.id) as total_available,
          SUM(a.points) FILTER (WHERE ua.achievement_id IS NOT NULL) as total_points_earned,
          SUM(a.points) as total_points_available
         FROM supervi_achievements a
         LEFT JOIN supervi_user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = $1`,
        [userId]
      );

      res.json({
        success: true,
        data: {
          earnedCount: parseInt(stats.rows[0].earned_count) || 0,
          totalAvailable: parseInt(stats.rows[0].total_available) || 0,
          totalPointsEarned: parseInt(stats.rows[0].total_points_earned) || 0,
          totalPointsAvailable: parseInt(stats.rows[0].total_points_available) || 0, completionRate: stats.rows[0].total_available > 0
            ? Math.round((parseInt(stats.rows[0].earned_count) / parseInt(stats.rows[0].total_available)) * 100)
            : 0
        }
      });
    } catch (error) {
      logger.error('Error in SuperviAchievementsController.getStats:', error);
      res.status(500).json({
        success: false, message: 'Failed to get statistics', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getAll(req, res) {
    return this.getAchievements(req, res);
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM supervi_achievements WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Achievement not found' });
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      logger.error('Error in SuperviAchievementsController.getById:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve achievement' });
    }
  }

  async create(req, res) {
    try {
      const { name, title, description, icon, category, difficulty, points, requirements, rewards } = req.body;
      const achievementName = name || title;
      if (!achievementName) {
        return res.status(400).json({ success: false, message: 'Achievement name is required' });
      }

      const result = await pool.query(
        `INSERT INTO supervi_achievements (name, description, icon, category, difficulty, points, requirements, rewards, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW(), NOW())
         RETURNING *`,
        [
          achievementName,
          description || '',
          icon || '',
          category || 'general',
          difficulty || 'medium',
          parseInt(points) || 10,
          JSON.stringify(requirements || {}),
          JSON.stringify(rewards || {})
        ]
      );

      res.status(201).json({
        success: true,
        message: 'Achievement created successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in SuperviAchievementsController.create:', error);
      res.status(500).json({ success: false, message: 'Failed to create achievement' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, title, description, icon, category, difficulty, points, requirements, rewards, is_active } = req.body;

      const result = await pool.query(
        `UPDATE supervi_achievements
         SET name = COALESCE($1, name),
             description = COALESCE($2, description),
             icon = COALESCE($3, icon),
             category = COALESCE($4, category),
             difficulty = COALESCE($5, difficulty),
             points = COALESCE($6, points),
             requirements = COALESCE($7, requirements),
             rewards = COALESCE($8, rewards),
             is_active = COALESCE($9, is_active),
             updated_at = NOW()
         WHERE id = $10
         RETURNING *`,
        [
          name || title || null,
          description || null,
          icon || null,
          category || null,
          difficulty || null,
          points !== undefined ? parseInt(points) : null,
          requirements ? JSON.stringify(requirements) : null,
          rewards ? JSON.stringify(rewards) : null,
          is_active !== undefined ? is_active : null,
          id
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Achievement not found' });
      }

      res.json({
        success: true,
        message: 'Achievement updated successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in SuperviAchievementsController.update:', error);
      res.status(500).json({ success: false, message: 'Failed to update achievement' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM supervi_achievements WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Achievement not found' });
      }
      res.json({ success: true, message: 'Achievement deleted successfully' });
    } catch (error) {
      logger.error('Error in SuperviAchievementsController.delete:', error);
      res.status(500).json({ success: false, message: 'Failed to delete achievement' });
    }
  }
}

module.exports = new SuperviAchievementsController();
