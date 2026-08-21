/**
 * Members Controller
 * Complete implementation for member directory and profiles with pagination
 * Date: June 10, 2026 - Phase 1 Week 2 Days 3-4 Priority #1
 */

const User = require('../models/user');
const logger = require('../utils/logger');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

class MembersController {
  /**
   * GET /api/members
   * Get all members with pagination and filtering
   */
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 20, 100);
      const offset = (page - 1) * limit;
      
      // Build filters
      const where = {};
      
      // Search by username or email
      if (req.query.search) {
        where[Op.or] = [
          { username: { [Op.iLike]: `%${req.query.search}%` } },
          { email: { [Op.iLike]: `%${req.query.search}%` } }
        ];
      }
      
      // Filter by role
      if (req.query.role) {
        where.role = req.query.role;
      }
      
      // Filter by verification status
      if (req.query.verified !== undefined) {
        where.emailVerified = req.query.verified === 'true';
      }
      
      // Fetch members with pagination
      const { count, rows: members } = await User.findAndCountAll({
        where,
        attributes: [
          'id', 'username', 'email', 'firstName', 'lastName', 'avatarUrl', 'role', 'emailVerified', 'createdAt'
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });
      
      const totalPages = Math.ceil(count / limit);
      
      res.json({
        success: true,
        data: members.map(member => ({
          id: member.id,
          username: member.username,
          email: member.email,
          firstName: member.firstName,
          lastName: member.lastName,
          fullName: `${member.firstName || ''} ${member.lastName || ''}`.trim(),
          avatarUrl: member.avatarUrl,
          role: member.role,
          isVerified: member.emailVerified,
          createdAt: member.createdAt
        })),
        pagination: {
          page,
          limit,
          total: count,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      logger.error('Error in MembersController.getAll:', error);
      res.status(500).json({
        success: false, message: 'Failed to retrieve members', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/members/:id
   * Get member profile by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      
      const member = await User.findByPk(id, {
        attributes: [
          'id', 'username', 'email', 'firstName', 'lastName', 'avatarUrl', 'bio', 'role', 'emailVerified', 'phone', 'location', 'website', 'socialLinks', 'createdAt', 'updatedAt'
        ]
      });
      
      if (!member) {
        return res.status(404).json({
          success: false, message: 'Member not found'
        });
      }
      
      res.json({
        success: true,
        data: {
          id: member.id,
          username: member.username,
          email: member.email,
          firstName: member.firstName,
          lastName: member.lastName,
          fullName: `${member.firstName || ''} ${member.lastName || ''}`.trim(),
          avatarUrl: member.avatarUrl,
          bio: member.bio,
          role: member.role,
          isVerified: member.emailVerified,
          phone: member.phone,
          location: member.location,
          website: member.website,
          socialLinks: member.socialLinks,
          createdAt: member.createdAt,
          updatedAt: member.updatedAt
        }
      });
    } catch (error) {
      logger.error('Error in MembersController.getById:', error);
      res.status(500).json({
        success: false, message: 'Failed to retrieve member', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * PUT /api/members/:id
   * Update member profile
   */
  async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false, message: 'Validation failed',
          errors: errors.array()
        });
      }
      
      const { id } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }
      
      // Only allow users to update their own profile (or admins)
      if (id !== userId && !req.user?.isAdmin) {
        return res.status(403).json({
          success: false, message: 'Not authorized to update this profile'
        });
      }
      
      const member = await User.findByPk(id);
      
      if (!member) {
        return res.status(404).json({
          success: false, message: 'Member not found'
        });
      }
      
      // Allowed fields for update
      const allowedFields = ['firstName', 'lastName', 'bio', 'avatarUrl', 'phone', 'location', 'website', 'socialLinks'];
      const updates = {};
      
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });
      
      await member.update(updates);
      
      res.json({
        success: true, message: 'Profile updated successfully',
        data: {
          id: member.id,
          username: member.username,
          firstName: member.firstName,
          lastName: member.lastName,
          bio: member.bio,
          avatarUrl: member.avatarUrl,
          updatedAt: member.updatedAt
        }
      });
    } catch (error) {
      logger.error('Error in MembersController.update:', error);
      res.status(500).json({
        success: false, message: 'Failed to update profile', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/members/stats
   * Get member statistics
   */
  async getStats(req, res) {
    try {
      const totalCount = await User.count();
      const verifiedCount = await User.count({ where: { emailVerified: true } });
      const adminCount = await User.count({ where: { role: 'admin' } });
      
      const recentSignups = await User.count({
        where: {
          createdAt: {
            [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      });
      
      res.json({
        success: true,
        data: {
          total: totalCount,
          verified: verifiedCount,
          unverified: totalCount - verifiedCount,
          admins: adminCount,
          recentSignups,
          verificationRate: totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0
        }
      });
    } catch (error) {
      logger.error('Error in MembersController.getStats:', error);
      res.status(500).json({
        success: false, message: 'Failed to retrieve statistics', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new MembersController();