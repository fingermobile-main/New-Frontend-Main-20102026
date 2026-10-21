/**
 * Members Controller
 * Complete implementation for member directory and profiles with pagination
 * Date: June 10, 2026 - Phase 1 Week 2 Days 3-4 Priority #1
 */

const User = require('../models/User');
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
          'id', 'username', 'email', 'firstName', 'lastName', 'avatarUrl', 'role', 'isVerified', 'createdAt'
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
          fullName: `${member.firstName || ''} ${member.lastName || ''}`.trim() || member.username,
          avatarUrl: member.avatarUrl,
          role: member.role,
          isVerified: Boolean(member.isVerified),
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
          'id', 'username', 'email', 'firstName', 'lastName', 'avatarUrl', 'bio', 'role', 'isVerified', 'createdAt', 'updatedAt'
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
          fullName: `${member.firstName || ''} ${member.lastName || ''}`.trim() || member.username,
          avatarUrl: member.avatarUrl,
          bio: member.bio,
          role: member.role,
          isVerified: Boolean(member.isVerified),
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

      const { id, memberId } = req.params;
      const targetId = id || memberId;
      const userId = req.user?.id;
      const isAdmin = req.user?.isAdmin || req.user?.role === 'admin' || req.user?.role === 'super_admin' || req.user?.role === 'SuperAdmin';

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      // Only allow users to update their own profile (or admins)
      if (String(targetId) !== String(userId) && !isAdmin) {
        return res.status(403).json({
          success: false, message: 'Not authorized to update this profile'
        });
      }

      const member = await User.findByPk(targetId);

      if (!member) {
        return res.status(404).json({
          success: false, message: 'Member not found'
        });
      }

      // Allowed fields for update
      const allowedFields = ['firstName', 'lastName', 'bio', 'avatarUrl', 'phone', 'phoneNumber'];
      if (isAdmin) {
        allowedFields.push('email', 'username', 'role', 'status', 'isVerified', 'department', 'kycTier');
      }

      const updates = {};
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      // Handle split name if fullName provided
      if (req.body.name || req.body.fullName) {
        const full = (req.body.name || req.body.fullName).trim();
        const parts = full.split(' ');
        updates.firstName = parts[0] || '';
        updates.lastName = parts.slice(1).join(' ') || '';
      }

      await member.update(updates);

      // If storeCreditBalance was passed by admin, update enhanced_wallets
      if (isAdmin && req.body.storeCreditBalance !== undefined) {
        try {
          const { pool } = require('../db');
          if (pool && typeof pool.query === 'function') {
            await pool.query(
              `UPDATE enhanced_wallets 
               SET store_credit_balance = $1, updated_at = NOW() 
               WHERE member_id = $2`,
              [parseFloat(req.body.storeCreditBalance), String(targetId)]
            );
          }
        } catch (_wErr) {
          // Continue if wallet update is non-blocking
        }
      }

      res.json({
        success: true,
        message: 'Member account details updated successfully',
        data: {
          id: member.id,
          username: member.username,
          email: member.email,
          firstName: member.firstName,
          lastName: member.lastName,
          fullName: `${member.firstName || ''} ${member.lastName || ''}`.trim() || member.username,
          phone: member.phone || member.phoneNumber,
          bio: member.bio,
          avatarUrl: member.avatarUrl,
          role: member.role,
          isVerified: Boolean(member.isVerified),
          updatedAt: member.updatedAt
        }
      });
    } catch (error) {
      logger.error('Error in MembersController.update:', error);
      res.status(500).json({
        success: false, message: 'Failed to update member account details', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * DELETE /api/members/:id
   * Delete member account details and information (GDPR erasure / admin purge)
   */
  async delete(req, res) {
    try {
      const { id, memberId } = req.params;
      const targetId = id || memberId;
      const userId = req.user?.id;
      const isAdmin = req.user?.isAdmin || req.user?.role === 'admin' || req.user?.role === 'super_admin' || req.user?.role === 'SuperAdmin';

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      // Authorization: Self-deletion or Admin
      if (String(targetId) !== String(userId) && !isAdmin) {
        return res.status(403).json({
          success: false, message: 'Not authorized to delete this member account'
        });
      }

      const member = await User.findByPk(targetId);

      if (!member) {
        return res.status(404).json({
          success: false, message: 'Member account not found'
        });
      }

      // Root SuperAdmin Protection
      if (String(targetId) === '1' || member.username === 'israel_protocol' || (member.role === 'SuperAdmin' && member.isRootSuperAdmin)) {
        return res.status(403).json({
          success: false,
          message: 'Root SuperAdmin account is strictly protected and cannot be deleted.'
        });
      }

      // Perform cascade cleanup in PostgreSQL
      try {
        const { pool } = require('../db');
        if (pool && typeof pool.query === 'function') {
          await pool.query('DELETE FROM member_role_assignments WHERE member_id::text = $1', [String(targetId)]);
          await pool.query('DELETE FROM enhanced_wallets WHERE member_id::text = $1', [String(targetId)]);
          await pool.query('DELETE FROM store_credit_transactions WHERE member_id::text = $1', [String(targetId)]);
        }
      } catch (dbErr) {
        logger.warn('Cascade cleanup warning:', dbErr.message);
      }

      // Delete member record
      await member.destroy();

      logger.info(`Member account ${targetId} permanently deleted by user ${userId}`);

      res.json({
        success: true,
        message: 'Member account details and information deleted successfully',
        deletedMemberId: targetId
      });
    } catch (error) {
      logger.error('Error in MembersController.delete:', error);
      res.status(500).json({
        success: false, message: 'Failed to delete member account', error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
      const verifiedCount = await User.count({ where: { isVerified: true } });
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
