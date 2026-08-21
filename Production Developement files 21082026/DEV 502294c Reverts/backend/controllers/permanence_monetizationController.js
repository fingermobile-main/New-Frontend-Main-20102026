/**
 * UpermanenceUmonetizationController
 * Auto-generated controller for permanence_monetization routes
 * Generated: 2026-06-08 13:55:23
 */

const UpermanenceUmonetizationControllerService = require('../services/permanence_monetization_service');
const logger = require('../utils/logger');

class UpermanenceUmonetizationController {
  /**
   * GET /api/permanence-monetization
   * Get all items
   */
  async getAll(req, res) {
    try {
      const filters = {
        limit: req.query.limit || 50,
        offset: req.query.offset || 0,
        ...req.query
      };

      const data = await UpermanenceUmonetizationControllerService.getAll(filters);

      res.json({
        success: true,
        data,
        count: data.length, 
        filters // Fixed: Added missing comma
      });
    } catch (error) {
      logger.error('Error in UpermanenceUmonetizationController.getAll:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/permanence-monetization/:id
   * Get item by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;

      const data = await UpermanenceUmonetizationControllerService.getById(id);

      if (!data) {
        return res.status(404).json({
          success: false, message: 'permanence_monetization not found'
        });
      }

      res.json({
        success: true, 
        data // Fixed: Added missing comma
      });
    } catch (error) {
      logger.error('Error in UpermanenceUmonetizationController.getById:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/permanence-monetization
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

      const result = await UpermanenceUmonetizationControllerService.create(data);

      res.status(201).json({
        success: true, message: 'permanence_monetization created successfully', data: result
      });
    } catch (error) {
      logger.error('Error in UpermanenceUmonetizationController.create:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * PUT /api/permanence-monetization/:id
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

      const result = await UpermanenceUmonetizationControllerService.update(id, data);

      if (!result) {
        return res.status(404).json({
          success: false, message: 'permanence_monetization not found'
        });
      }

      res.json({
        success: true, message: 'permanence_monetization updated successfully', data: result
      });
    } catch (error) {
      logger.error('Error in UpermanenceUmonetizationController.update:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * DELETE /api/permanence-monetization/:id
   * Delete item
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      const result = await UpermanenceUmonetizationControllerService.delete(id);

      if (!result) {
        return res.status(404).json({
          success: false, message: 'permanence_monetization not found'
        });
      }

      res.json({
        success: true, message: 'permanence_monetization deleted successfully'
      });
    } catch (error) {
      logger.error('Error in UpermanenceUmonetizationController.delete:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new UpermanenceUmonetizationController();