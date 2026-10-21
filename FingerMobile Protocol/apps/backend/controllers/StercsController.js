/* eslint-disable no-unused-vars */
/**
 * StercsController
 * TV streaming platform - shows, episodes, watch history
 */

const pool = require('../database/connection');
const logger = require('../utils/logger');

class StercsController {
  /**
   * GET /api/stercs/shows
   * Get all shows with filtering
   */
  async getShows(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;
      const genre = req.query.genre;
      const isPremium = req.query.premium === 'true';

      let query = 'SELECT s.*, array_agg(g.name) as genres FROM stercs_shows s LEFT JOIN stercs_show_genres sg ON s.id = sg.show_id LEFT JOIN stercs_genres g ON sg.genre_id = g.id WHERE s.status = $1';
      const params = ['published'];

      if (isPremium) {
        query += ' AND s.is_premium = true';
      }

      query += ' GROUP BY s.id ORDER BY s.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(limit, offset);

      const result = await pool.query(query, params);

      res.json({
        success: true, message: 'Shows retrieved',
        data: result.rows, count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in StercsController.getShows:', error);
      res.status(500).json({
        success: false, error: 'Failed to retrieve shows', details: error.message
      });
    }
  }

  /**
   * GET /api/stercs/shows/:id
   * Get show details with seasons
   */
  async getShowById(req, res) {
    try {
      const { id } = req.params;

      // Get show details
      const showQuery = 'SELECT * FROM stercs_shows WHERE id = $1';
      const showResult = await pool.query(showQuery, [id]);

      if (showResult.rows.length === 0) {
        return res.status(404).json({
          success: false, error: 'Show not found'
        });
      }

      // Get seasons
      const seasonsQuery = ` SELECT se.*, 
               COUNT(e.id) as episode_count
        FROM stercs_seasons se
        LEFT JOIN stercs_episodes e ON se.id = e.season_id
        WHERE se.show_id = $1
        GROUP BY se.id
        ORDER BY se.season_number
      `;

      const seasonsResult = await pool.query(seasonsQuery, [id]);

      res.json({
        success: true, message: 'Show details retrieved',
        data: {
          show: showResult.rows[0], seasons: seasonsResult.rows
        }
      });
    } catch (error) {
      logger.error('Error in StercsController.getShowById:', error);
      res.status(500).json({
        success: false, error: 'Failed to retrieve show details',
        details: error.message
      });
    }
  }

  /**
   * GET /api/stercs/episodes/:id
   * Get episode details
   */
  async getEpisodeById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.user?.userId;

      const query = ` SELECT e.*, 
               s.title as season_title,
               sh.title as show_title,
               sh.is_premium as show_is_premium
        FROM stercs_episodes e
        JOIN stercs_seasons s ON e.season_id = s.id
        JOIN stercs_shows sh ON s.show_id = sh.id
        WHERE e.id = $1
      `;

      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, error: 'Episode not found'
        });
      }

      // Check subscription if premium
      const episode = result.rows[0];
      if (episode.is_premium || episode.show_is_premium) {
        const subQuery = ` SELECT * FROM stercs_subscriptions
          WHERE user_id = $1 AND status = 'active' AND (expires_at IS NULL OR expires_at > NOW())
        `;

        const subResult = await pool.query(subQuery, [userId]);

        if (subResult.rows.length === 0) {
          return res.status(403).json({
            success: false, error: 'Premium subscription required',
            requiresSubscription: true
          });
        }
      }

      res.json({
        success: true, message: 'Episode retrieved', data: episode
      });
    } catch (error) {
      logger.error('Error in StercsController.getEpisodeById:', error);
      res.status(500).json({
        success: false, error: 'Failed to retrieve episode', details: error.message
      });
    }
  }

  /**
   * POST /api/stercs/watch/:episodeId
   * Start watching episode / update progress
   */
  async startWatching(req, res) {
    try {
      const { episodeId } = req.params;
      const userId = req.user?.id || req.user?.userId;
      const { position = 0, device_type = 'web' } = req.body;

      // Create or update watch history
      const query = ` INSERT INTO stercs_watch_history (user_id, episode_id, last_position, watched_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        ON CONFLICT (user_id, episode_id)
        DO UPDATE SET last_position = EXCLUDED.last_position, updated_at = NOW()
        RETURNING *
      `;

      const result = await pool.query(query, [userId, episodeId, position]);

      // Create streaming session
      const sessionQuery = ` INSERT INTO stercs_streaming_sessions (
          user_id, episode_id, device_type, started_at, current_position
        ) VALUES ($1, $2, $3, NOW(), $4)
        RETURNING *
      `;

      const sessionResult = await pool.query(sessionQuery, [userId, episodeId, device_type, position]);

      res.json({
        success: true, message: 'Watching started',
        data: {
          watchHistory: result.rows[0], session: sessionResult.rows[0]
        }
      });
    } catch (error) {
      logger.error('Error in StercsController.startWatching:', error);
      res.status(500).json({
        success: false, error: 'Failed to start watching',
        details: error.message
      });
    }
  }

  /**
   * PUT /api/stercs/watch/:episodeId/progress
   * Update watch progress
   */
  async updateProgress(req, res) {
    try {
      const { episodeId } = req.params;
      const userId = req.user?.id || req.user?.userId;
      const { position, completion_percentage } = req.body;

      const query = ` UPDATE stercs_watch_history
        SET last_position = $1, updated_at = NOW()
        WHERE user_id = $2 AND episode_id = $3
        RETURNING *
      `;

      const result = await pool.query(query, [position, userId, episodeId]);

      // Update streaming session
      await pool.query(` UPDATE stercs_streaming_sessions
        SET current_position = $1, total_watch_time = total_watch_time + $2,
            completion_percentage = $3, last_updated = NOW()
        WHERE user_id = $4 AND episode_id = $5 AND ended_at IS NULL
      `, [position, req.body.watch_time_increment || 0, completion_percentage, userId, episodeId]);

      res.json({
        success: true, message: 'Progress updated', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in StercsController.updateProgress:', error);
      res.status(500).json({
        success: false, error: 'Failed to update progress', details: error.message
      });
    }
  }

  /**
   * GET /api/stercs/watch-history
   * Get user's watch history
   */
  async getWatchHistory(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const limit = parseInt(req.query.limit) || 20;

      const query = ` SELECT wh.*, 
               e.title as episode_title,
               e.thumbnail_url,
               e.duration_seconds,
               s.title as season_title,
               sh.title as show_title,
               sh.poster_url as show_poster
        FROM stercs_watch_history wh
        JOIN stercs_episodes e ON wh.episode_id = e.id
        JOIN stercs_seasons s ON e.season_id = s.id
        JOIN stercs_shows sh ON s.show_id = sh.id
        WHERE wh.user_id = $1
        ORDER BY wh.updated_at DESC
        LIMIT $2
      `;

      const result = await pool.query(query, [userId, limit]);

      res.json({
        success: true,
        message: 'Watch history retrieved', data: result.rows
      });
    } catch (error) {
      logger.error('Error in StercsController.getWatchHistory:', error);
      res.status(500).json({
        success: false, error: 'Failed to retrieve watch history',
        details: error.message
      });
    }
  }

  /**
   * GET /api/stercs/subscriptions/status
   * Get subscription status
   */
  async getSubscriptionStatus(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;

      const query = ` SELECT * FROM stercs_subscriptions
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 1
      `;

      const result = await pool.query(query, [userId]);

      res.json({
        success: true, message: 'Subscription status retrieved', data: result.rows[0] || null
      });
    } catch (error) {
      logger.error('Error in StercsController.getSubscriptionStatus:', error);
      res.status(500).json({
        success: false, error: 'Failed to retrieve subscription status',
        details: error.message
      });
    }
  }
}

module.exports = new StercsController();
