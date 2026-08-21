/**
 * RecommendationController
 * ML-based recommendation endpoints
 */

const RecommendationService = require('../services/RecommendationService');
const logger = require('../utils/logger');

class RecommendationController {
  /**
   * GET /api/recommendations
   * Get personalized recommendations for authenticated user
   */
  async getRecommendations(req, res) {
    try {
      const userId = req.user.id;
      const { type = 'mixed', limit = 20 } = req.query;
      
      const recommendations = await RecommendationService.getPersonalizedRecommendations(userId, {
        type,
        limit: parseInt(limit)
      });
      
      res.json({
        success: true, message: 'Recommendations generated', data: recommendations
      });
    } catch (error) {
      logger.error('Error in RecommendationController.getRecommendations:', error);
      res.status(500).json({
        success: false, error: 'Failed to generate recommendations',
        details: error.message
      });
    }
  }
  
  /**
   * POST /api/recommendations/:itemId/interact
   * Record user interaction with recommended item
   */
  async recordInteraction(req, res) {
    try {
      const userId = req.user.id;
      const { itemId } = req.params;
      const { itemType, action } = req.body;
      
      if (!itemType || !action) {
        return res.status(400).json({
          success: false, error: 'itemType and action are required'
        });
      }
      
      await RecommendationService.recordInteraction(userId, itemId, itemType, action);
      
      res.json({
        success: true, message: 'Interaction recorded'
      });
    } catch (error) {
      logger.error('Error in RecommendationController.recordInteraction:', error);
      res.status(500).json({
        success: false, error: 'Failed to record interaction',
        details: error.message
      });
    }
  }
  
  /**
   * GET /api/recommendations/trending
   * Get trending content (cold start or general discovery)
   */
  async getTrending(req, res) {
    try {
      const { limit = 20 } = req.query;
      
      const trending = await RecommendationService.getTrendingContent(parseInt(limit));
      
      res.json({
        success: true, message: 'Trending content retrieved', data: trending
      });
    } catch (error) {
      logger.error('Error in RecommendationController.getTrending:', error);
      res.status(500).json({
        success: false, error: 'Failed to get trending content',
        details: error.message
      });
    }
  }
}

module.exports = new RecommendationController();
