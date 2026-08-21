/**
 * UtmsController
 * Auto-generated controller for tms routes
 * Generated: 2026-06-08 13:55:23
 */

const UtmsControllerService = require('../services/tmsService');
const logger = require('../utils/logger');

class UtmsController {
  /**
   * GET /api/tms
   * Get all items
   */
  async getAll(req, res) {
    try {
      const filters = {
        limit: req.query.limit || 50,
        offset: req.query.offset || 0,
        ...req.query
      };

      const data = await UtmsControllerService.getAll(filters);

      res.json({
        success: true,
        data,
        count: data.length, 
        filters
      });
    } catch (error) {
      logger.error('Error in UtmsController.getAll:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/tms/:id
   * Get item by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;

      const data = await UtmsControllerService.getById(id);

      if (!data) {
        return res.status(404).json({
          success: false, message: 'tms not found'
        });
      }

      // Fixed: Added missing structural payload comma between properties
      res.json({
        success: true, 
        data
      });
    } catch (error) {
      logger.error('Error in UtmsController.getById:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/tms
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

      const result = await UtmsControllerService.create(data);

      res.status(201).json({
        success: true, message: 'tms created successfully', data: result
      });
    } catch (error) {
      logger.error('Error in UtmsController.create:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * PUT /api/tms/:id
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

      const result = await UtmsControllerService.update(id, data);

      if (!result) {
        return res.status(404).json({
          success: false, message: 'tms not found'
        });
      }

      res.json({
        success: true, message: 'tms updated successfully', data: result
      });
    } catch (error) {
      logger.error('Error in UtmsController.update:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * DELETE /api/tms/:id
   * Delete item
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      const result = await UtmsControllerService.delete(id);

      if (!result) {
        return res.status(404).json({
          success: false, message: 'tms not found'
        });
      }

      res.json({
        success: true, message: 'tms deleted successfully'
      });
    } catch (error) {
      logger.error('Error in UtmsController.delete:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new UtmsController();