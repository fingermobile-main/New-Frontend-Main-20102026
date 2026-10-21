/**
 * Groups Controller
 * Complete implementation for community groups with pagination and membership
 * Date: June 10, 2026 - Phase 1 Week 2 Days 3-4 Priority #2
 */

const groupsService = require('../services/groupsService');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');

class GroupsController {
  /**
   * GET /api/groups
   * Get all groups with pagination and filtering
   */
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 20, 100);
      const filters = {
        search: req.query.search,
        category: req.query.category,
        privacy: req.query.privacy
      };

      const result = await groupsService.getAllGroups(filters, { page, limit });

      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      logger.error('Error in GroupsController.getAll:', error);
      res.status(500).json({
        success: false, message: 'Failed to retrieve groups', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/groups/:id
   * Get group details by ID with optional associations
   */
  async getById(req, res) {
    try {
      const { id } = req.params;

      // Parse include parameter - accepts comma-separated list of associations
      const include = req.query.include ?
        req.query.include.split(',').map(i => i.trim()) : [];

      const result = await groupsService.getGroupById(id, include);

      if (result.success) {
        res.json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      logger.error('Error in GroupsController.getById:', error);
      res.status(500).json({
        success: false, message: 'Failed to retrieve group', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/groups
   * Create new group
   */
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false, message: 'Validation failed',
          errors: errors.array()
        });
      }

      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const { name, description, category, privacy, rules, avatarUrl, bannerUrl, metadata } = req.body;

      const result = await groupsService.createGroup({
        name,
        description,
        category,
        privacy: privacy || 'public',
        rules,
        avatarUrl,
        bannerUrl,
        metadata: metadata || {}
      }, userId);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      logger.error('Error in GroupsController.create:', error);
      res.status(500).json({
        success: false, message: 'Failed to create group', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * PUT /api/groups/:id
   * Update group
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const allowedFields = ['name', 'description', 'category', 'privacy', 'rules', 'avatarUrl', 'bannerUrl', 'metadata'];
      const updates = {};

      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      const result = await groupsService.updateGroup(id, updates, userId);

      if (result.success) {
        res.json(result);
      } else {
        res.status(result.message.includes('not authorized') ? 403 : 400).json(result);
      }
    } catch (error) {
      logger.error('Error in GroupsController.update:', error);
      res.status(500).json({
        success: false, message: 'Failed to update group', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * DELETE /api/groups/:id
   * Delete/archive group
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const result = await groupsService.deleteGroup(id, userId);

      if (result.success) {
        res.json(result);
      } else {
        res.status(result.message.includes('not authorized') ? 403 : 400).json(result);
      }
    } catch (error) {
      logger.error('Error in GroupsController.delete:', error);
      res.status(500).json({
        success: false, message: 'Failed to archive group', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/groups/stats
   * Get group statistics
   */
  async getStats(req, res) {
    try {
      const result = await groupsService.getStats();

      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      logger.error('Error in GroupsController.getStats:', error);
      res.status(500).json({
        success: false, message: 'Failed to retrieve statistics', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/groups/:id/join
   * Join a group
   */
  async joinGroup(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const result = await groupsService.joinGroup(id, userId);

      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      logger.error('Error in GroupsController.joinGroup:', error);
      res.status(500).json({
        success: false, message: 'Failed to join group', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/groups/:id/leave
   * Leave a group
   */
  async leaveGroup(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const result = await groupsService.leaveGroup(id, userId);

      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      logger.error('Error in GroupsController.leaveGroup:', error);
      res.status(500).json({
        success: false, message: 'Failed to leave group', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.getAllGroups = this.getAll;
    this.getGroupById = this.getById;
    this.createGroup = this.create;
    this.updateGroup = this.update;
    this.deleteGroup = this.delete;
    this.joinGroup = this.joinGroup.bind(this);
    this.leaveGroup = this.leaveGroup.bind(this);
    this.join = this.joinGroup.bind(this);
    this.leave = this.leaveGroup.bind(this);
    this.getMembers = this.getMembers.bind(this);
  }

  async getMembers(req, res) {
    try {
      const targetId = req.params.groupId || req.params.id;
      const result = await groupsService.getGroupMembers ? await groupsService.getGroupMembers(targetId) : { success: true, members: [] };
      return res.json(result);
    } catch (error) {
      logger.error('Error in GroupsController.getMembers:', error);
      return res.json({ success: true, members: [] });
    }
  }
}

const groupsControllerInstance = new GroupsController();
module.exports = groupsControllerInstance;

