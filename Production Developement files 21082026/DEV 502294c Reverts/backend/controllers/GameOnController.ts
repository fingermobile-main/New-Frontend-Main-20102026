import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';

/**
 * GameOnController
 * Gaming platform - Games, scores, leaderboards, achievements
 */

class GameOnController {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  /**
   * GET /api/gameon/games
   * Get all available games
   */
  async getGames(req: Request, res: Response): Promise<void> {
    try {
      const { category, limit = 50, offset = 0 } = req.query;

      let whereClause = 'WHERE is_active = true';
      const params: any[] = [];
      let paramIndex = 1;

      if (category) {
        whereClause += ` AND category = $${paramIndex}`;
        params.push(category);
        paramIndex++;
      }

      const query = `
        SELECT g.*, 
               COUNT(gs.id) as total_plays,
               AVG(gs.score) as average_score
        FROM gameon_games g
        LEFT JOIN gameon_scores gs ON g.id = gs.game_id
        ${whereClause}
        GROUP BY g.id
        ORDER BY total_plays DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      params.push(parseInt(limit as string), parseInt(offset as string));
      const result = await this.db.query(query, params);

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('GameOnController.getGames error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve games',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/gameon/scores/submit
   * Submit game score
   */
  async submitScore(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { gameId, score, level, duration } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      if (!gameId || score === undefined) {
        res.status(400).json({
          success: false,
          message: 'Game ID and score are required'
        });
        return;
      }

      const insertQuery = `
        INSERT INTO gameon_scores (user_id, game_id, score, level, duration, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING *
      `;
      
      const result = await this.db.query(insertQuery, [userId, gameId, score, level || null, duration || null]);

      // Check for achievement unlocks
      await this.checkAchievements(userId, gameId, score);

      res.status(201).json({
        success: true,
        message: 'Score submitted successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('GameOnController.submitScore error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit score',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/gameon/leaderboard/:gameId
   * Get leaderboard for a game
   */
  async getLeaderboard(req: Request, res: Response): Promise<void> {
    try {
      const { gameId } = req.params;
      const { timeframe = 'all', limit = 50 } = req.query;

      let timeFilter = '';
      const params: any[] = [gameId];
      let paramIndex = 2;

      if (timeframe === 'daily') {
        timeFilter = 'AND gs.created_at >= NOW() - INTERVAL \'1 day\'';
      } else if (timeframe === 'weekly') {
        timeFilter = 'AND gs.created_at >= NOW() - INTERVAL \'7 days\'';
      } else if (timeframe === 'monthly') {
        timeFilter = 'AND gs.created_at >= NOW() - INTERVAL \'30 days\'';
      }

      const query = `
        SELECT gs.*, 
               u.name as player_name,
               u.avatar_url,
               RANK() OVER (ORDER BY gs.score DESC) as rank
        FROM gameon_scores gs
        JOIN users u ON gs.user_id = u.id
        WHERE gs.game_id = $1 ${timeFilter}
        ORDER BY gs.score DESC
        LIMIT $${paramIndex}
      `;
      
      params.push(parseInt(limit as string));
      const result = await this.db.query(query, params);

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      logger.error('GameOnController.getLeaderboard error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve leaderboard',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/gameon/user/stats
   * Get user's gaming statistics
   */
  async getUserStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const statsQuery = `
        SELECT 
          COUNT(DISTINCT gs.game_id) as games_played,
          COUNT(gs.id) as total_sessions,
          MAX(gs.score) as highest_score,
          AVG(gs.score) as average_score,
          SUM(gs.duration) FILTER (WHERE gs.duration IS NOT NULL) as total_play_time
        FROM gameon_scores gs
        WHERE gs.user_id = $1
      `;
      
      const result = await this.db.query(statsQuery, [userId]);

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('GameOnController.getUserStats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user stats',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * Helper: Check and unlock achievements
   */
  private async checkAchievements(userId: number, gameId: number, score: number): Promise<void> {
    try {
      // Check for score-based achievements
      const achievementQuery = `
        SELECT id, threshold, reward_type
        FROM gameon_achievements
        WHERE game_id = $1 AND type = 'score' AND threshold <= $2
      `;
      
      const achievements = await this.db.query(achievementQuery, [gameId, score]);

      for (const achievement of achievements.rows) {
        // Check if already unlocked
        const checkQuery = 'SELECT id FROM user_achievements WHERE user_id = $1 AND achievement_id = $2';
        const existing = await this.db.query(checkQuery, [userId, achievement.id]);

        if (existing.rows.length === 0) {
          // Unlock achievement
          await this.db.query(
            'INSERT INTO user_achievements (user_id, achievement_id, unlocked_at) VALUES ($1, $2, NOW())',
            [userId, achievement.id]
          );
        }
      }
    } catch (error) {
      logger.error('Failed to check achievements:', error);
    }
  }
}

export default new GameOnController();
