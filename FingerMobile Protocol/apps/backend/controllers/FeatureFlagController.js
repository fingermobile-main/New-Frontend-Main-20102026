/**
 * FeatureFlagController
 * Feature flag management endpoints
 */

const FeatureFlagService = require('../services/FeatureFlagService');
const logger = require('../utils/logger');

class FeatureFlagController {
  /**
   * GET /api/feature-flags/check/:key
   * Check if feature is enabled
   */
  async checkFlag(req, res) {
    try {
      const { key } = req.params;
      const userId = req.user?.id || null;
      const context = req.query;

      const enabled = await FeatureFlagService.isFeatureEnabled(key, userId, context);

      res.json({
        success: true,
        data: {
          key,
          enabled, timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error in FeatureFlagController.checkFlag:', error);
      res.status(500).json({
        success: false, error: 'Failed to check feature flag',
        details: error.message
      });
    }
  }

  /**
   * GET /api/feature-flags/all
   * Get all flags for user
   */
  async getAllFlags(req, res) {
    try {
      const userId = req.user?.id || null;
      const context = req.query;

      const flags = await FeatureFlagService.getAllFlags(userId, context);

      res.json({
        success: true, data: flags
      });
    } catch (error) {
      logger.error('Error in FeatureFlagController.getAllFlags:', error);
      res.status(500).json({
        success: false, error: 'Failed to get feature flags',
        details: error.message
      });
    }
  }

  /**
   * POST /api/feature-flags
   * Create new feature flag (admin only)
   */
  async createFlag(req, res) {
    try {
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false, error: 'Admin access required'
        });
      }

      const { key, name, description, ...options } = req.body;

      if (!key || !name) {
        return res.status(400).json({
          success: false, error: 'key and name are required'
        });
      }

      const flag = await FeatureFlagService.createFlag(key, name, description, options);

      res.status(201).json({
        success: true, message: 'Feature flag created', data: flag
      });
    } catch (error) {
      logger.error('Error in FeatureFlagController.createFlag:', error);
      res.status(500).json({
        success: false, error: 'Failed to create feature flag',
        details: error.message
      });
    }
  }

  /**
   * PUT /api/feature-flags/:id
   * Update feature flag (admin only)
   */
  async updateFlag(req, res) {
    try {
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false, error: 'Admin access required'
        });
      }

      const { id } = req.params;
      const updates = req.body;

      const flag = await FeatureFlagService.updateFlag(id, updates);

      res.json({
        success: true, message: 'Feature flag updated', data: flag
      });
    } catch (error) {
      logger.error('Error in FeatureFlagController.updateFlag:', error);
      res.status(500).json({
        success: false, error: 'Failed to update feature flag',
        details: error.message
      });
    }
  }

  /**
   * DELETE /api/feature-flags/:id
   * Delete feature flag (admin only)
   */
  async deleteFlag(req, res) {
    try {
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false, error: 'Admin access required'
        });
      }

      const { id } = req.params;

      await FeatureFlagService.deleteFlag(id);

      res.json({
        success: true, message: 'Feature flag deleted'
      });
    } catch (error) {
      logger.error('Error in FeatureFlagController.deleteFlag:', error);
      res.status(500).json({
        success: false, error: 'Failed to delete feature flag',
        details: error.message
      });
    }
  }
}

module.exports = new FeatureFlagController();
