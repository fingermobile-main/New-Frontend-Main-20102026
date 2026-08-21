/**
 * FingerWars Controller
 * Gaming/Battles Platform
 * Date: June 14, 2026 - Initial Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class FingerwarsController {
  /**
   * GET /api/fingerwars/games
   * Get all active games
   */
  async getAll(req, res) {
    try {
      const { limit = 50, offset = 0, category, status } = req.query;

      let whereClause = [];
      let queryParams = [];
      let paramCount = 1;

      if (category) {
        whereClause.push(`category = $${paramCount}`);
        queryParams.push(category);
        paramCount++;
      }

      if (status) {
        whereClause.push(`status = $${paramCount}`);
        queryParams.push(status);
        paramCount++;
      }

      const whereSQL = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

      const result = await pool.query(`SELECT 
          id,
          title,
          description,
          category,
          status,
          max_players,
          current_players,
          entry_fee,
          prize_pool,
          start_time,
          end_time,
          created_by, created_at
         FROM fingerwars_games
         $1
         ORDER BY created_at DESC
         LIMIT $${paramCount} OFFSET $${paramCount + 1}`, [...queryParams, parseInt(limit), parseInt(offset), whereSQL]);

      res.json({
        success: true,
        data: result.rows.map(game => ({
          ...game,
          entryFee: parseFloat(game.entry_fee) || 0,
          prizePool: parseFloat(game.prize_pool) || 0,
          maxPlayers: parseInt(game.max_players),
          currentPlayers: parseInt(game.current_players)
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in FingerwarsController.getAll:', error);
      res.status(500).json({
        success: false, message: 'Failed to get games', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/fingerwars/games/:gameId
   * Get specific game details
   */
  async getById(req, res) {
    try {
      const { gameId } = req.params;

      const result = await pool.query(
        `SELECT 
          g.*,
          u.username as creator_username,
          u.profile_image as creator_image
         FROM fingerwars_games g
         LEFT JOIN users u ON g.created_by = u.id
         WHERE g.id = $1`,
        [gameId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Game not found'
        });
      }

      const game = result.rows[0];

      // Get participants
      const participants = await pool.query(
        `SELECT 
          p.*,
          u.username,
          u.profile_image
         FROM fingerwars_participants p
         LEFT JOIN users u ON p.user_id = u.id
         WHERE p.game_id = $1
         ORDER BY p.joined_at ASC`,
        [gameId]
      );

      res.json({
        success: true,
        data: {
          ...game,
          entryFee: parseFloat(game.entry_fee) || 0,
          prizePool: parseFloat(game.prize_pool) || 0,
          maxPlayers: parseInt(game.max_players),
          currentPlayers: parseInt(game.current_players) participants: participants.rows
        }
      });
    } catch (error) {
      logger.error('Error in FingerwarsController.getById:', error);
      res.status(500).json({
        success: false, message: 'Failed to get game details', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/fingerwars/games
   * Create a new game
   */
  async create(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const {
        title,
        description,
        category,
        max_players = 100,
        entry_fee = 0,
        prize_pool = 0,
        start_time,
        end_time,
        rules
      } = req.body;

      // Validation
      if (!title || !category || !start_time) {
        return res.status(400).json({
          success: false, message: 'Title, category, and start_time are required'
        });
      }

      const result = await pool.query(
        `INSERT INTO fingerwars_games 
         (title, description, category, max_players, entry_fee, prize_pool start_time, end_time, rules, created_by, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending', NOW())
         RETURNING *`,
        [
          title,
          description || null,
          category,
          max_players,
          entry_fee,
          prize_pool,
          start_time,
          end_time || null,
          rules ? JSON.stringify(rules) : null,
          userId
        ]
      );

      const game = result.rows[0];

      res.status(201).json({
        success: true, message: 'Game created successfully',
        data: {
          ...game,
          entryFee: parseFloat(game.entry_fee),
          prizePool: parseFloat(game.prize_pool) maxPlayers: parseInt(game.max_players)
        }
      });
    } catch (error) {
      logger.error('Error in FingerwarsController.create:', error);
      res.status(500).json({
        success: false, message: 'Failed to create game', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/fingerwars/games/:gameId/join
   * Join a game
   */
  async joinGame(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const { gameId } = req.params;

      // Check if game exists and has space
      const gameCheck = await pool.query(
        `SELECT * FROM fingerwars_games WHERE id = $1`,
        [gameId]
      );

      if (gameCheck.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Game not found'
        });
      }

      const game = gameCheck.rows[0];

      if (parseInt(game.current_players) >= parseInt(game.max_players)) {
        return res.status(400).json({
          success: false, message: 'Game is full'
        });
      }

      if (game.status !== 'pending' && game.status !== 'active') {
        return res.status(400).json({
          success: false, message: 'Cannot join this game'
        });
      }

      // Check if already joined
      const existingParticipation = await pool.query(
        `SELECT * FROM fingerwars_participants WHERE game_id = $1 AND user_id = $2`,
        [gameId, userId]
      );

      if (existingParticipation.rows.length > 0) {
        return res.status(400).json({
          success: false, message: 'Already joined this game'
        });
      }

      // Add participant
      await pool.query(
        `INSERT INTO fingerwars_participants (game_id, user_id, joined_at)
         VALUES ($1, $2, NOW())`,
        [gameId, userId]
      );

      // Update player count
      await pool.query(
        `UPDATE fingerwars_games 
         SET current_players = current_players + 1
         WHERE id = $1`,
        [gameId]
      );

      res.status(201).json({
        success: true, message: 'Successfully joined game'
      });
    } catch (error) {
      logger.error('Error in FingerwarsController.joinGame:', error);
      res.status(500).json({
        success: false, message: 'Failed to join game', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/fingerwars/games/:gameId/leave
   * Leave a game
   */
  async leaveGame(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const { gameId } = req.params;

      // Remove participant
      const result = await pool.query(
        `DELETE FROM fingerwars_participants 
         WHERE game_id = $1 AND user_id = $2
         RETURNING *`,
        [gameId, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Not a participant of this game'
        });
      }

      // Update player count
      await pool.query(
        `UPDATE fingerwars_games 
         SET current_players = GREATEST(current_players - 1, 0)
         WHERE id = $1`,
        [gameId]
      );

      res.json({
        success: true, message: 'Successfully left game'
      });
    } catch (error) {
      logger.error('Error in FingerwarsController.leaveGame:', error);
      res.status(500).json({
        success: false, message: 'Failed to leave game', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/fingerwars/categories
   * Get game categories
   */
  async getCategories(req, res) {
    try {
      const categories = [
        'battle_royale' 'team_deathmatch' 'capture_the_flag' 'tournament' 'ranked_match' 'casual' 'custom'
      ];

      res.json({
        success: true,
        data: categories.map(cat => ({
          id: cat, name: cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) slug: cat
        }))
      });
    } catch (error) {
      logger.error('Error in FingerwarsController.getCategories:', error);
      res.status(500).json({
        success: false, message: 'Failed to get categories', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new FingerwarsController();
