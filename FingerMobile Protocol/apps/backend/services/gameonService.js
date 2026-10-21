const logger = require('../utils/logger');
/**
 * GameOnService
 * Service for GameOn gaming platform features
 * Created: June 8, 2026
 */

const db = require('../database/connection');

class GameOnService {
  async getGames(filters = {}) {
    try {
      const { limit = 50, offset = 0, category, status } = filters;

      let query = db('gameon_games').select('*');

      if (category) query = query.where({ category });
      if (status) query = query.where({ status });

      query = query.orderBy('created_at', 'DESC').limit(limit).offset(offset);

      const results = await query;
      const [{ total }] = await db('gameon_games').count('* as total');

      return { data: results, total: parseInt(total), limit, offset };
    } catch (error) {
      logger.error('Error in GameOnService.getGames:', error);
      throw new Error(`Failed to fetch games: ${error.message}`);
    }
  }

  async getGameById(id) {
    try {
      const game = await db('gameon_games').where({ id }).first();
      if (!game) return null;

      const leaderboards = await db('gameon_leaderboards')
        .where({ game_id: id })
        .orderBy('score', 'DESC')
        .limit(10);

      return { ...game, leaderboards };
    } catch (error) {
      logger.error('Error in GameOnService.getGameById:', error);
      throw new Error(`Failed to fetch game: ${error.message}`);
    }
  }

  async submitScore(data) {
    try {
      const now = new Date();
      const [score] = await db('gameon_scores').insert({
        ...data,
        created_at: now
      }).returning('*');

      // Update leaderboard
      await db('gameon_leaderboards').insert({
        game_id: data.game_id,
        user_id: data.user_id,
        score: data.score,
        created_at: now
      });

      return score;
    } catch (error) {
      logger.error('Error in GameOnService.submitScore:', error);
      throw new Error(`Failed to submit score: ${error.message}`);
    }
  }
}

module.exports = new GameOnService();
