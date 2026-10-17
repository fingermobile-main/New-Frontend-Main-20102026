/**
 * Supervi Leaderboards Controller
 * Complete implementation for supervi leaderboards system
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class SuperviLeaderboardsController {
  /**
   * GET /api/supervi-leaderboards/leaderboards
   * Get all available leaderboards
   */
  async getLeaderboards(req, res) {
    try {
      const result = await pool.query(
        `SELECT * FROM supervi_leaderboards
         WHERE is_active = true
         ORDER BY category, name ASC`
      );

      res.json({
        success: true,
        data: result.rows.map(lb => ({
          ...lb, rules: typeof lb.rules === 'string' ? JSON.parse(lb.rules) : lb.rules
        })), count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in SuperviLeaderboardsController.getLeaderboards:', error);
      res.status(500).json({
        success: false, message: 'Failed to get leaderboards', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/supervi-leaderboards/:id/rankings
   * Get rankings for a specific leaderboard
   */
  async getRankings(req, res) {
    try {
      const { id } = req.params;
      const { limit = 100, offset = 0, timeframe = 'all' } = req.query;

      let timeFilter = '';
      if (timeframe === 'week') {
        timeFilter = 'AND r.created_at >= NOW() - INTERVAL \'7 days\'';
      } else if (timeframe === 'month') {
        timeFilter = 'AND r.created_at >= NOW() - INTERVAL \'30 days\'';
      }

      const result = await pool.query('SELECT u.id as user_id, u.username, u.avatar_url, r.score, r.rank r.created_at FROM supervi_leaderboard_records r JOIN users u ON r.user_id = u.id WHERE r.leaderboard_id = $1 $1 ORDER BY r.rank ASC LIMIT $2 OFFSET $3', [id, parseInt(limit), parseInt(offset), timeFilter]);

      res.json({
        success: true,
        data: result.rows.map(record => ({
          ...record,
          score: parseFloat(record.score)
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in SuperviLeaderboardsController.getRankings:', error);
      res.status(500).json({
        success: false, message: 'Failed to get rankings', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/supervi-leaderboards/:id/submit-score
   * Submit score to a leaderboard
   */
  async submitScore(req, res) {
    try {
      const userId = req.user?.id;
      const { id: leaderboardId } = req.params;
      const { score, metadata } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (score === undefined) {
        return res.status(400).json({
          success: false, message: 'Score is required'
        });
      }

      // Check if user already has a record
      const existing = await pool.query(
        'SELECT id, score FROM supervi_leaderboard_records WHERE leaderboard_id = $1 AND user_id = $2',
        [leaderboardId, userId]
      );

      if (existing.rows.length > 0) {
        // Update if new score is better
        const currentScore = parseFloat(existing.rows[0].score);
        const newScore = parseFloat(score);

        if (newScore > currentScore) {
          await pool.query(
            `UPDATE supervi_leaderboard_records 
             SET score = $1, metadata = $2, created_at = NOW()
             WHERE id = $3`,
            [newScore, JSON.stringify(metadata || {}), existing.rows[0].id]
          );

          // Recalculate ranks
          await this.recalculateRanks(leaderboardId);

          return res.json({
            success: true, message: 'Score updated successfully'
          });
        } else {
          return res.status(400).json({
            success: false, message: 'New score is not better than current score'
          });
        }
      } else {
        // Insert new record
        await pool.query(
          `INSERT INTO supervi_leaderboard_records (leaderboard_id, user_id, score, metadata, created_at)
           VALUES ($1, $2, $3, $4, NOW())`,
          [leaderboardId, userId, parseFloat(score), JSON.stringify(metadata || {})]
        );

        // Recalculate ranks
        await this.recalculateRanks(leaderboardId);

        return res.status(201).json({
          success: true, message: 'Score submitted successfully'
        });
      }
    } catch (error) {
      logger.error('Error in SuperviLeaderboardsController.submitScore:', error);
      res.status(500).json({
        success: false, message: 'Failed to submit score', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Helper method to recalculate ranks
   */
  async recalculateRanks(leaderboardId) {
    try {
      await pool.query(
        `UPDATE supervi_leaderboard_records r
         SET rank = subquery.new_rank
         FROM (
           SELECT id, ROW_NUMBER() OVER (ORDER BY score DESC) as new_rank
           FROM supervi_leaderboard_records
           WHERE leaderboard_id = $1
         ) subquery
         WHERE r.id = subquery.id` [leaderboardId]
      );
    } catch (error) {
      logger.error('Error recalculating ranks:', error);
    }
  }

  /**
   * GET /api/supervi-leaderboards/user/:userId/rank
   * Get user's rank in a specific leaderboard
   */
  async getUserRank(req, res) {
    try {
      const { userId } = req.params;
      const { leaderboardId } = req.query;

      if (!leaderboardId) {
        return res.status(400).json({
          success: false, message: 'Leaderboard ID is required'
        });
      }

      const result = await pool.query(
        `SELECT rank, score
         FROM supervi_leaderboard_records
         WHERE leaderboard_id = $1 AND user_id = $2`,
        [leaderboardId, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'User not ranked in this leaderboard'
        });
      }

      res.json({
        success: true,
        data: {
          userId,
          leaderboardId,
          rank: parseInt(result.rows[0].rank), score: parseFloat(result.rows[0].score)
        }
      });
    } catch (error) {
      logger.error('Error in SuperviLeaderboardsController.getUserRank:', error);
      res.status(500).json({
        success: false, message: 'Failed to get user rank', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new SuperviLeaderboardsController();
