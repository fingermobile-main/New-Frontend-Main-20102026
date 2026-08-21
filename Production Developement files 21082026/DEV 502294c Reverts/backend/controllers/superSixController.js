const { v4: uuidv4 } = require("uuid");
const logger = require('../utils/logger');
const { socialDb } = require("../db");

class SuperSixController {
  constructor() {
    // Initialize any required services or configurations
  }

  /**
   * Create a new game session
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createGameSession(req, res) {
    try {
      const { memberId, gameMode } = req.body;

      // Create a new game session
      const sessionId = uuidv4();
      
      const result = await socialDb.query(
        `INSERT INTO super_six_game_sessions 
        (id, member_id, game_mode, session_start, level_reached, lives_remaining, multiplier, combo_count, final_score, is_active, created_at, updated_at) 
        VALUES ($1, $2, $3, NOW(), 1, 3, 1, 0, 0, true, NOW(), NOW()) RETURNING *` [sessionId, memberId, gameMode || "classic"]
      );

      res.status(201).json({
        success: true, message: "Game session created successfully",
        data: result.rows[0] });
    } catch (error) {
      logger.error("Error creating game session:", error);
      res.status(500).json({
        success: false, message: "Failed to create game session",
        error: error.message
      });
    }
  }

  /**
   * Update game session with current state
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateGameSession(req, res) {
    try {
      const { sessionId } = req.params;
      const { score, level, lives, multiplier, combo, gameState } = req.body;

      // Update database
      const result = await socialDb.query(
        `UPDATE super_six_game_sessions 
        SET final_score = COALESCE($1, final_score), 
            level_reached = COALESCE($2, level_reached), 
            lives_remaining = COALESCE($3, lives_remaining), 
            multiplier = COALESCE($4, multiplier), 
            combo_count = COALESCE($5, combo_count), 
            game_state = COALESCE($6, game_state), 
            updated_at = NOW() 
        WHERE id = $7 RETURNING *`,
        [score, level, lives, multiplier, combo, gameState ? JSON.stringify(gameState) : null, sessionId]
      );

      res.status(200).json({
        success: true, message: "Game session updated successfully",
        data: result.rows[0] });
    } catch (error) {
      logger.error("Error updating game session:", error);
      res.status(500).json({
        success: false, message: "Failed to update game session",
        error: error.message
      });
    }
  }

  /**
   * End a game session and calculate final results
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async endGameSession(req, res) {
    try {
      const { sessionId } = req.params;
      const {
        finalScore,
        levelReached,
        livesRemaining,
        achievementsUnlocked,
        timePlayed
      } = req.body;

      const sessionEnd = new Date();

      // Update database
      const result = await socialDb.query(
        `UPDATE super_six_game_sessions 
        SET session_end = NOW(), 
            final_score = COALESCE($1, final_score), 
            level_reached = COALESCE($2, level_reached), 
            lives_remaining = COALESCE($3, lives_remaining), 
            achievements_unlocked = $4, 
            duration = $5, 
            is_active = false, 
            updated_at = NOW() 
        WHERE id = $6 RETURNING *`,
        [finalScore, levelReached, livesRemaining, JSON.stringify(achievementsUnlocked || []), timePlayed, sessionId]
      );

      res.status(200).json({
        success: true, message: "Game session ended successfully",
        data: result.rows[0] });
    } catch (error) {
      logger.error("Error ending game session:", error);
      res.status(500).json({
        success: false, message: "Failed to end game session", error: error.message });
    }
  }

  /**
   * Get member's game statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getMemberStats(req, res) {
    try {
      const { memberId } = req.params;

      // Retrieve member stats from database
      const result = await socialDb.query(
        `SELECT 
          member_id as "memberId" COUNT(*) as "totalGames" SUM(final_score) as "totalScore" AVG(final_score) as "avgScore" MAX(final_score) as "highestScore" SUM(duration) as "totalPlayTime" FROM super_six_game_sessions
        WHERE member_id = $1
        GROUP BY member_id`,
        [memberId]
      );

      const memberStats = result.rows[0] || {
        memberId,
        totalGames: 0,
        totalScore: 0,
        avgScore: 0,
        highestScore: 0,
        totalPlayTime: 0
      };

      res.status(200).json({
        success: true, message: "Member stats retrieved successfully",
        data: memberStats });
    } catch (error) {
      logger.error("Error getting member stats:", error);
      res.status(500).json({
        success: false, message: "Failed to retrieve member stats",
        error: error.message });
    }
  }

  /**
   * Get global leaderboards
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getLeaderboards(req, res) {
    try {
      const { gameMode = "classic", limit = 50 } = req.query;

      // Get leaderboards from database
      const result = await socialDb.query(
        `SELECT 
          member_id as "memberId",
          MAX(final_score) as score MAX(level_reached) as "levelReached" MAX(created_at) as "dateAchieved" FROM super_six_game_sessions
        WHERE game_mode = $1
        GROUP BY member_id
        ORDER BY score DESC
        LIMIT $2`,
        [gameMode, parseInt(limit)]
      );

      res.status(200).json({
        success: true, message: "Leaderboard retrieved successfully",
        data: {
          gameMode,
          entries: result.rows
        } });
    } catch (error) {
      logger.error("Error getting leaderboards:", error);
      res.status(500).json({
        success: false, message: "Failed to retrieve leaderboards",
        error: error.message
      });
    }
  }

  /**
   * Get daily challenges for a member
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getDailyChallenges(req, res) {
    try {
      // Get daily challenges
      const result = await socialDb.query(
        `SELECT * FROM super_six_daily_challenges 
         WHERE start_date <= NOW() AND end_date >= NOW() AND is_active = true`
      );

      res.status(200).json({
        success: true, message: "Daily challenges retrieved successfully",
        data: result.rows });
    } catch (error) {
      logger.error("Error getting daily challenges:", error);
      res.status(500).json({
        success: false, message: "Failed to retrieve daily challenges",
        error: error.message
      });
    }
  }
}

module.exports = new SuperSixController();
