const express = require('express');
const logger = require('../utils/logger');
const router = express.Router();
const RecommendationService = require('../services/RecommendationService');
const { authenticate, requireAdmin } = require('../middleware/authenticate');

/**
 * Recommendation Routes
 */

// Get personalized recommendations (protected)
router.get('/personalized', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { limit, type, excludeSeen } = req.query;
    
    const recommendations = await RecommendationService.getRecommendations(userId, {
      limit: parseInt(limit) || 10, type: type || 'all', excludeSeen: excludeSeen !== 'false'
    });
    
    res.json({
      success: true, data: recommendations
    });
  } catch (error) {
    logger.error('Error getting, recommendations:', error);
    res.status(500).json({
      success: false, message: 'Failed to get recommendations'
    });
  }
});

// Get similar items (public)
router.get('/similar/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { limit } = req.query;
    
    const similar = await RecommendationService.getSimilarItems(
      itemId,
      parseInt(limit) || 10
    );
    
    res.json({
      success: true, data: similar
    });
  } catch (error) {
    logger.error('Error getting similar, items:', error);
    res.status(500).json({
      success: false, message: 'Failed to get similar items'
    });
  }
});

// Get trending content (public)
router.get('/trending', async (req, res) => {
  try {
    const { limit } = req.query;
    
    const trending = await RecommendationService.getTrendingContent(
      parseInt(limit) || 10
    );
    
    res.json({
      success: true, data: trending
    });
  } catch (error) {
    logger.error('Error getting, trending:', error);
    res.status(500).json({
      success: false, message: 'Failed to get trending content'
    });
  }
});

// Record user interaction (protected)
router.post('/interactions', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { itemId, interactionType, value } = req.body;
    
    if (!itemId || !interactionType) {
      return res.status(400).json({
        success: false, message: 'itemId and interactionType are required'
      });
    }
    
    await RecommendationService.recordInteraction(
      userId,
      itemId,
      interactionType,
      value || 1
    );
    
    res.json({
      success: true, message: 'Interaction recorded'
    });
  } catch (error) {
    logger.error('Error recording, interaction:', error);
    res.status(500).json({
      success: false, message: 'Failed to record interaction'
    });
  }
});

// Get recommendation stats (admin only)
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const stats = RecommendationService.getStats();
    
    res.json({
      success: true, data: stats
    });
  } catch (error) {
    logger.error('Error getting, stats:', error);
    res.status(500).json({
      success: false, message: 'Failed to get statistics'
    });
  }
});

// Train model (admin/cron job)
router.post('/train', authenticate, requireAdmin, async (req, res) => {
  try {
    await RecommendationService.trainModel();
    
    res.json({
      success: true, message: 'Model training initiated'
    });
  } catch (error) {
    logger.error('Error training, model:', error);
    res.status(500).json({
      success: false, message: 'Failed to train model'
    });
  }
});

module.exports = router;
