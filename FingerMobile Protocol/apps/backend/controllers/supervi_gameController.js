/**
 * SuperVi Game Core Controller
 * Handles gameplay sessions, the Six Characters, powerups, daily challenges, and analytics
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class SuperViGameController {
  /**
   * GET /api/supervi/characters
   * Retrieve all 6 SuperVi heroes with their abilities and orbs
   */
  async getCharacters(req, res) {
    try {
      const result = await pool.query(
        'SELECT * FROM supervi_characters ORDER BY created_at ASC'
      );

      return res.json({
        success: true,
        data: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      if (logger && typeof logger.error === 'function') {
        logger.error('Error in SuperViGameController.getCharacters:', error);
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to load SuperVi characters',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/supervi/sessions/start
   * Start a new run session
   */
  async startSession(req, res) {
    try {
      const userId = req.user?.id || req.body?.userId || req.body?.memberId || 'guest_runner';
      const { gameMode = 'classic', characterId = 'zara_zephyr' } = req.body;

      const result = await pool.query(
        `INSERT INTO supervi_game_sessions 
         (player_id, user_id, game_title, game_mode, session_start, is_active, created_at, updated_at)
         VALUES ($1, $2, 'SuperVi: Orbs of Glory', $3, NOW(), true, NOW(), NOW())
         RETURNING *`,
        [String(userId), String(userId), gameMode]
      );

      return res.status(201).json({
        success: true,
        message: 'Game session initialized',
        data: result.rows[0]
      });
    } catch (error) {
      if (logger && typeof logger.error === 'function') {
        logger.error('Error in SuperViGameController.startSession:', error);
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to start game session',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/supervi/sessions/:id/end
   * Complete run session, submit score, calculate FIC token reward
   */
  async endSession(req, res) {
    try {
      const { id } = req.params;
      const {
        finalScore = 0,
        levelReached = 1,
        durationSeconds = 0,
        comboCount = 0,
        achievementsUnlocked = [],
        powerupsUsed = []
      } = req.body;

      // Base FIC token multiplier: 1 FIC per 500 points + combo bonus
      const earnedFic = Math.floor(finalScore / 500) + (comboCount * 2);

      const result = await pool.query(
        `UPDATE supervi_game_sessions
         SET final_score = $1, score = $1, level_reached = $2, duration = $3, duration_seconds = $3,
             combo_count = $4, achievements_unlocked = $5, powerups_used = $6,
             is_active = false, session_end = NOW(), updated_at = NOW()
         WHERE id = $7
         RETURNING *`,
        [
          parseInt(finalScore, 10),
          parseInt(levelReached, 10),
          parseInt(durationSeconds, 10),
          parseInt(comboCount, 10),
          achievementsUnlocked,
          powerupsUsed,
          id
        ]
      );

      return res.json({
        success: true,
        message: 'Session completed successfully',
        data: {
          session: result.rows[0] || null,
          rewards: {
            score: finalScore,
            ficTokensEarned: earnedFic,
            combos: comboCount
          }
        }
      });
    } catch (error) {
      if (logger && typeof logger.error === 'function') {
        logger.error('Error in SuperViGameController.endSession:', error);
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to end session',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/supervi/powerups
   * Get all active power-ups
   */
  async getPowerups(req, res) {
    try {
      const result = await pool.query('SELECT * FROM supervi_powerups ORDER BY cost ASC');
      return res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to load powerups' });
    }
  }

  /**
   * GET /api/supervi/challenges/daily
   * Get active daily challenges (e.g. spelling L-I-O-N)
   */
  async getDailyChallenges(req, res) {
    try {
      const result = await pool.query(
        'SELECT * FROM supervi_daily_challenges WHERE is_active = true ORDER BY created_at DESC'
      );
      return res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to load daily challenges' });
    }
  }

  /**
   * GET /api/supervi/voicelines
   * Get all African-accented voice lines & combos
   */
  async getVoiceLines(req, res) {
    try {
      const { category } = req.query;
      let query = 'SELECT * FROM supervi_voice_lines WHERE is_active = true';
      const params = [];
      if (category) {
        query += ' AND category = $1';
        params.push(category);
      }
      const result = await pool.query(query, params);
      return res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to load voice lines' });
    }
  }
}

module.exports = new SuperViGameController();
