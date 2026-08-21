/**
 * UregistrationLockController
 * Auto-generated controller for registrationLock routes
 * Generated: 2026-06-08 13:55:23
 */

const UregistrationLockControllerService = require('../services/registrationLockService');
const logger = require('../utils/logger');

class UregistrationLockController {
  /**
   * GET /api/registrationLock
   * Get all items
   */
  async getAll(req, res) {
    try {
      const filters = {
        limit: req.query.limit || 50,
        offset: req.query.offset || 0,
        ...req.query
      };

      const data = await UregistrationLockControllerService.getAll(filters);

      res.json({
        success: true,
        data,
        count: data.length, 
        filters // Fixed: Added missing comma
      });
    } catch (error) {
      logger.error('Error in UregistrationLockController.getAll:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/registrationLock/:id
   * Get item by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;

      const data = await UregistrationLockControllerService.getById(id);

      if (!data) {
        return res.status(404).json({
          success: false, message: 'registrationLock not found'
        });
      }

      res.json({
        success: true, 
        data // Fixed: Added missing comma
      });
    } catch (error) {
      logger.error('Error in UregistrationLockController.getById:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/registrationLock
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

      const result = await UregistrationLockControllerService.create(data);

      res.status(201).json({
        success: true, message: 'registrationLock created successfully', data: result
      });
    } catch (error) {
      logger.error('Error in UregistrationLockController.create:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * PUT /api/registrationLock/:id
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

      const result = await UregistrationLockControllerService.update(id, data);

      if (!result) {
        return res.status(404).json({
          success: false, message: 'registrationLock not found'
        });
      }

      res.json({
        success: true, message: 'registrationLock updated successfully', data: result
      });
    } catch (error) {
      logger.error('Error in UregistrationLockController.update:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * DELETE /api/registrationLock/:id
   * Delete item
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      const result = await UregistrationLockControllerService.delete(id);

      if (!result) {
        return res.status(404).json({
          success: false, message: 'registrationLock not found'
        });
      }

      res.json({
        success: true, message: 'registrationLock deleted successfully'
      });
    } catch (error) {
      logger.error('Error in UregistrationLockController.delete:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new UregistrationLockController();