/**
 * Supervi Leaderboards Controller
 * Robust implementation for SuperVi: Orbs of Glory - Rise of the Six
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class SuperviLeaderboardsController {
  /**
   * GET /api/supervi-leaderboards/leaderboards or /api/supervi-leaderboards
   * Get all active leaderboards
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
          ...lb,
          rules: typeof lb.rules === 'string' ? JSON.parse(lb.rules) : lb.rules
        })),
        count: result.rows.length
      });
    } catch (error) {
      if (logger && typeof logger.error === 'function') {
        logger.error('Error in SuperviLeaderboardsController.getLeaderboards:', error);
      }
      res.status(500).json({
        success: false,
        message: 'Failed to get leaderboards',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
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

      const parsedLimit = Math.max(1, Math.min(200, parseInt(limit, 10) || 50));
      const parsedOffset = Math.max(0, parseInt(offset, 10) || 0);

      const queryText = `
        SELECT 
          r.id,
          r.user_id,
          COALESCE(u.username, r.username, 'SuperVi Runner') AS username,
          COALESCE(u.avatar_url, r.avatar_url, '') AS avatar_url,
          r.score,
          r.rank,
          r.level,
          r.character_id,
          r.created_at
        FROM supervi_leaderboard_records r
        LEFT JOIN users u ON r.user_id = u.id::text
        WHERE r.leaderboard_id = $1 ${timeFilter}
        ORDER BY r.rank ASC, r.score DESC
        LIMIT $2 OFFSET $3
      `;

      const result = await pool.query(queryText, [id, parsedLimit, parsedOffset]);

      const countResult = await pool.query(
        `SELECT COUNT(*) FROM supervi_leaderboard_records r WHERE r.leaderboard_id = $1 ${timeFilter}`,
        [id]
      );
      const total = parseInt(countResult.rows[0]?.count, 10) || result.rows.length;

      res.json({
        success: true,
        data: result.rows.map(record => ({
          ...record,
          score: parseFloat(record.score)
        })),
        pagination: {
          limit: parsedLimit,
          offset: parsedOffset,
          total
        }
      });
    } catch (error) {
      if (logger && typeof logger.error === 'function') {
        logger.error('Error in SuperviLeaderboardsController.getRankings:', error);
      }
      res.status(500).json({
        success: false,
        message: 'Failed to get rankings',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/supervi-leaderboards/:id/submit-score
   * Submit score to a leaderboard
   */
  async submitScore(req, res) {
    try {
      const userId = req.user?.id || req.body?.userId || req.body?.memberId || 'guest_runner';
      const username = req.user?.username || req.body?.username || 'Runner';
      const avatarUrl = req.user?.avatar_url || req.body?.avatar_url || '';
      const { id: leaderboardId } = req.params;
      const { score, level = 1, characterId = 'zara_zephyr', metadata = {} } = req.body;

      if (score === undefined || score === null) {
        return res.status(400).json({
          success: false,
          message: 'Score is required'
        });
      }

      // Check if user already has a record on this board
      const existing = await pool.query(
        'SELECT id, score FROM supervi_leaderboard_records WHERE leaderboard_id = $1 AND user_id = $2',
        [leaderboardId, String(userId)]
      );

      const numericScore = parseFloat(score);

      if (existing.rows.length > 0) {
        const currentScore = parseFloat(existing.rows[0].score);

        if (numericScore > currentScore) {
          await pool.query(
            `UPDATE supervi_leaderboard_records 
             SET score = $1, level = $2, character_id = $3, metadata = $4, updated_at = NOW()
             WHERE id = $5`,
            [numericScore, parseInt(level, 10) || 1, characterId, JSON.stringify(metadata), existing.rows[0].id]
          );

          await this.recalculateRanks(leaderboardId);

          return res.json({
            success: true,
            message: 'Score updated successfully with new high score',
            data: { score: numericScore, newRecord: true }
          });
        } else {
          return res.json({
            success: true,
            message: 'Run recorded, but current high score remains higher',
            data: { score: currentScore, newRecord: false }
          });
        }
      } else {
        await pool.query(
          `INSERT INTO supervi_leaderboard_records 
           (leaderboard_id, user_id, username, avatar_url, score, level, character_id, metadata, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
          [leaderboardId, String(userId), username, avatarUrl, numericScore, parseInt(level, 10) || 1, characterId, JSON.stringify(metadata)]
        );

        await this.recalculateRanks(leaderboardId);

        return res.status(201).json({
          success: true,
          message: 'Score submitted successfully',
          data: { score: numericScore, newRecord: true }
        });
      }
    } catch (error) {
      if (logger && typeof logger.error === 'function') {
        logger.error('Error in SuperviLeaderboardsController.submitScore:', error);
      }
      res.status(500).json({
        success: false,
        message: 'Failed to submit score',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Helper method to recalculate ranks cleanly
   */
  async recalculateRanks(leaderboardId) {
    try {
      await pool.query(
        `UPDATE supervi_leaderboard_records r
         SET rank = subquery.new_rank
         FROM (
           SELECT id, ROW_NUMBER() OVER (ORDER BY score DESC) AS new_rank
           FROM supervi_leaderboard_records
           WHERE leaderboard_id = $1
         ) subquery
         WHERE r.id = subquery.id`,
        [leaderboardId]
      );
    } catch (error) {
      if (logger && typeof logger.error === 'function') {
        logger.error('Error recalculating ranks:', error);
      }
    }
  }

  /**
   * GET /api/supervi-leaderboards/user/:userId/rank
   * Get user's rank in a specific leaderboard
   */
  async getUserRank(req, res) {
    try {
      const { userId } = req.params;
      const { leaderboardId = 'global_classic' } = req.query;

      const result = await pool.query(
        `SELECT rank, score, level, character_id, updated_at
         FROM supervi_leaderboard_records
         WHERE leaderboard_id = $1 AND user_id = $2`,
        [leaderboardId, String(userId)]
      );

      if (result.rows.length === 0) {
        return res.json({
          success: true,
          data: {
            userId,
            leaderboardId,
            rank: null,
            score: 0,
            hasPlayed: false
          }
        });
      }

      res.json({
        success: true,
        data: {
          userId,
          leaderboardId,
          rank: parseInt(result.rows[0].rank, 10),
          score: parseFloat(result.rows[0].score),
          level: parseInt(result.rows[0].level, 10),
          characterId: result.rows[0].character_id,
          hasPlayed: true
        }
      });
    } catch (error) {
      if (logger && typeof logger.error === 'function') {
        logger.error('Error in SuperviLeaderboardsController.getUserRank:', error);
      }
      res.status(500).json({
        success: false,
        message: 'Failed to get user rank',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getAll(req, res) {
    return this.getLeaderboards(req, res);
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM supervi_leaderboards WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Leaderboard not found' });
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      if (logger && typeof logger.error === 'function') {
        logger.error('Error in SuperviLeaderboardsController.getById:', error);
      }
      res.status(500).json({ success: false, message: 'Failed to get leaderboard' });
    }
  }

  async create(req, res) {
    try {
      const { id, name, category = 'General', game_mode = 'classic', region = 'global', rules = {} } = req.body;
      const boardId = id || `lb_${Date.now()}`;
      const result = await pool.query(
        `INSERT INTO supervi_leaderboards (id, name, category, game_mode, region, rules, is_active, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, true, NOW())
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
         RETURNING *`,
        [boardId, name || 'New Leaderboard', category, game_mode, region, JSON.stringify(rules)]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      if (logger && typeof logger.error === 'function') {
        logger.error('Error in SuperviLeaderboardsController.create:', error);
      }
      res.status(500).json({ success: false, message: 'Failed to create leaderboard' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, category, is_active } = req.body;
      const result = await pool.query(
        `UPDATE supervi_leaderboards 
         SET name = COALESCE($1, name), category = COALESCE($2, category), is_active = COALESCE($3, is_active)
         WHERE id = $4 RETURNING *`,
        [name, category, is_active, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Leaderboard not found' });
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      if (logger && typeof logger.error === 'function') {
        logger.error('Error in SuperviLeaderboardsController.update:', error);
      }
      res.status(500).json({ success: false, message: 'Failed to update leaderboard' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM supervi_leaderboards WHERE id = $1', [id]);
      res.json({ success: true, message: 'Leaderboard deleted successfully' });
    } catch (error) {
      if (logger && typeof logger.error === 'function') {
        logger.error('Error in SuperviLeaderboardsController.delete:', error);
      }
      res.status(500).json({ success: false, message: 'Failed to delete leaderboard' });
    }
  }
}

module.exports = new SuperviLeaderboardsController();
