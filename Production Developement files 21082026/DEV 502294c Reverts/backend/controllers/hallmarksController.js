/**
 * HallmarksController
 * Manages user hallmarks, awards, and milestone tracking
 */

const hallmarkService = require('../services/hallmarkService');
const logger = require('../utils/logger');

class HallmarksController {
  /**
   * GET /api/hallmarks
   * Get all available hallmarks
   */
  async getAll(req, res) {
    try {
      const filters = req.query;
      
      const hallmarks = await hallmarkService.getAllHallmarks(filters);
      
      res.json({
        success: true, message: 'Hallmarks retrieved successfully',
        data: hallmarks, count: hallmarks.length
      });
    } catch (error) {
      logger.error('Error in HallmarksController.getAll:', error);
      res.status(500).json({
        success: false, error: 'Failed to retrieve hallmarks', details: error.message
      });
    }
  }

  /**
   * GET /api/hallmarks/user/:userId
   * Get user's hallmarks
   */
  async getById(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }
      
      const userHallmarks = await hallmarkService.getUserHallmarks(userId);
      
      res.json({
        success: true, message: 'User hallmarks retrieved successfully',
        data: userHallmarks, count: userHallmarks.length
      });
    } catch (error) {
      logger.error('Error in HallmarksController.getById:', error);
      res.status(500).json({
        success: false, error: 'Failed to retrieve user hallmarks',
        details: error.message
      });
    }
  }

  /**
   * POST /api/hallmarks
   * Create new hallmark definition
   */
  async create(req, res) {
    try {
      const hallmarkData = req.body;
      
      // Validation
      if (!hallmarkData.name) {
        return res.status(400).json({
          success: false, error: 'Hallmark name is required'
        });
      }
      
      const result = await hallmarkService.createHallmark(hallmarkData);
      
      if (!result.success) {
        return res.status(400).json(result);
      }
      
      res.status(201).json({
        success: true, message: 'Hallmark created successfully', data: result.hallmark
      });
    } catch (error) {
      logger.error('Error in HallmarksController.create:', error);
      res.status(500).json({
        success: false, error: 'Failed to create hallmark',
        details: error.message
      });
    }
  }

  /**
   * POST /api/hallmarks/award
   * Award hallmark to user
   */
  async award(req, res) {
    try {
      const { userId, hallmarkId, reason } = req.body;
      
      // Validation
      if (!userId || !hallmarkId) {
        return res.status(400).json({
          success: false, error: 'User ID and Hallmark ID are required'
        });
      }
      
      const result = await hallmarkService.awardHallmarkToUser(userId, hallmarkId, reason);
      
      if (!result.success) {
        return res.status(400).json(result);
      }
      
      res.status(201).json({
        success: true, message: 'Hallmark awarded successfully', data: result.userHallmark
      });
    } catch (error) {
      logger.error('Error in HallmarksController.award:', error);
      res.status(500).json({
        success: false, error: 'Failed to award hallmark',
        details: error.message
      });
    }
  }

  /**
   * POST /api/hallmarks/check-milestones
   * Check and award milestone hallmarks
   */
  async checkMilestones(req, res) {
    try {
      const { userId, metrics } = req.body;
      
      // Validation
      if (!userId || !metrics) {
        return res.status(400).json({
          success: false, error: 'User ID and metrics are required'
        });
      }
      
      const result = await hallmarkService.checkAndAwardMilestoneHallmarks(userId, metrics);
      
      if (!result.success) {
        return res.status(500).json(result);
      }
      
      res.json({
        success: true, message: 'Milestone check completed',
        data: {
          awarded: result.results, count: result.results.length
        }
      });
    } catch (error) {
      logger.error('Error in HallmarksController.checkMilestones:', error);
      res.status(500).json({
        success: false, error: 'Failed to check milestones',
        details: error.message
      });
    }
  }
}

module.exports = new HallmarksController();
