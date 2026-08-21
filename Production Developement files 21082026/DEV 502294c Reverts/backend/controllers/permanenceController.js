/**
 * UpermanenceController
 * Auto-generated controller for permanence routes
 * Generated: 2026-06-08 13:55:23
 */

const UpermanenceControllerService = require('../services/permanenceService');
const logger = require('../utils/logger');

class UpermanenceController {
  /**
   * GET /api/permanence
   * Get all items
   */
  async getAll(req, res) {
    try {
      const filters = {
        limit: req.query.limit || 50,
        offset: req.query.offset || 0,
        ...req.query
      };

      const data = await UpermanenceControllerService.getAll(filters);

      res.json({
        success: true,
        data,
        count: data.length
      });
    } catch (error) {
      logger.error('Error in UpermanenceController.getAll:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/permanence/:id
   * Get item by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;

      const data = await UpermanenceControllerService.getById(id);

      if (!data) {
        return res.status(404).json({
          success: false, message: 'permanence not found'
        });
      }

      res.json({
        success: true, data
      });
    } catch (error) {
      logger.error('Error in UpermanenceController.getById:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/permanence
   * Create new item
   */
  async create(req, res) {
    try {
      const data = req.body;

      // Basic validation
      if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({
          success: false, message: 'Request body is required'
        });
      }

      const result = await UpermanenceControllerService.create(data);

      res.status(201).json({
        success: true, message: 'permanence created successfully', data: result
      });
    } catch (error) {
      logger.error('Error in UpermanenceController.create:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * PUT /api/permanence/:id
   * Update existing item
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({
          success: false, message: 'Request body is required'
        });
      }

      const result = await UpermanenceControllerService.update(id, data);

      if (!result) {
        return res.status(404).json({
          success: false, message: 'permanence not found'
        });
      }

      res.json({
        success: true, message: 'permanence updated successfully', data: result
      });
    } catch (error) {
      logger.error('Error in UpermanenceController.update:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * DELETE /api/permanence/:id
   * Delete item
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      const result = await UpermanenceControllerService.delete(id);

      if (!result) {
        return res.status(404).json({
          success: false, message: 'permanence not found'
        });
      }

      res.json({
        success: true, message: 'permanence deleted successfully'
      });
    } catch (error) {
      logger.error('Error in UpermanenceController.delete:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Additional custom methods can be added here
   */
  
  // Example: Custom endpoint
  // async customAction(req, res) {
  //   try {
  //     // Implementation
  //     res.json({ success: true });
  //   } catch (error) {
  //     res.status(500).json({ success: false, error: error.message });
  //   }
  // }
}

module.exports = new UpermanenceController();
