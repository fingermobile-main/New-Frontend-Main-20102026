/* eslint-disable no-unused-vars */
/**
 * Activity Controller
 * Complete implementation for user activity feed and tracking
 * Date: June 10, 2026 - Phase 1 Week 2 Priority #1
 */

const { socialDb } = require('../db');
const logger = require('../utils/logger');
const User = require('../models/User');
const Post = require('../models/Post');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

class ActivityController {
  /**
   * GET /api/activity
   * Get user activity feed with pagination
   */
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 20, 100);
      const offset = (page - 1) * limit;

      const userId = req.user?.id;
      const { type, actor_id, date_from, date_to } = req.query;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      // Build activity query
      let query = ` SELECT 
          a.id,
          a.type,
          a.actor_id,
          a.target_type,
          a.target_id,
          a.metadata,
          a.created_at,
          u.username as actor_username,
          u.avatar_url as actor_avatar
        FROM activities a
        JOIN users u ON a.actor_id = u.id
        WHERE 1=1
      `;

      const params = [];
      let paramIndex = 0;

      // Filter by activity type
      if (type) {
        paramIndex++;
        query += ` AND a.type = $${paramIndex}`;
        params.push(type);
      }

      // Filter by actor
      if (actor_id) {
        paramIndex++;
        query += ` AND a.actor_id = $${paramIndex}`;
        params.push(actor_id);
      }

      // Date range filter
      if (date_from) {
        paramIndex++;
        query += ` AND a.created_at >= $${paramIndex}`;
        params.push(date_from);
      }

      if (date_to) {
        paramIndex++;
        query += ` AND a.created_at <= $${paramIndex}`;
        params.push(date_to);
      }

      // Order by most recent
      query += ' ORDER BY a.created_at DESC';

      // Add pagination
      paramIndex++;
      query += ` LIMIT $${paramIndex}`;
      params.push(limit);

      paramIndex++;
      query += ` OFFSET $${paramIndex}`;
      params.push(offset);

      const { rows: activities } = await socialDb.query(query, params);

      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM activities a WHERE 1=1';
      const countParams = [];
      let countParamIndex = 0;

      if (type) {
        countParamIndex++;
        countQuery += ` AND a.type = $${countParamIndex}`;
        countParams.push(type);
      }

      if (actor_id) {
        countParamIndex++;
        countQuery += ` AND a.actor_id = $${countParamIndex}`;
        countParams.push(actor_id);
      }

      if (date_from) {
        countParamIndex++;
        countQuery += ` AND a.created_at >= $${countParamIndex}`;
        countParams.push(date_from);
      }

      if (date_to) {
        countParamIndex++;
        countQuery += ` AND a.created_at <= $${countParamIndex}`;
        countParams.push(date_to);
      }

      const { rows: countResult } = await socialDb.query(countQuery, countParams);
      const total = parseInt(countResult[0]?.total || 0);
      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: activities.map(activity => ({
          id: activity.id,
          type: activity.type,
          actor: {
            id: activity.actor_id,
            username: activity.actor_username,
            avatarUrl: activity.actor_avatar
          },
          targetType: activity.target_type,
          targetId: activity.target_id,
          metadata: activity.metadata,
          createdAt: activity.created_at
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      logger.error('Error in ActivityController.getAll:', error);
      res.status(500).json({
        success: false, message: 'Failed to retrieve activity feed', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/activity
   * Create new activity record
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

      const { type, target_type, target_id, metadata } = req.body;
      const actorId = req.user?.id;

      if (!actorId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const result = await socialDb.query(
        `INSERT INTO activities (type, actor_id, target_type, target_id, metadata, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING *`,
        [type, actorId, target_type, target_id, JSON.stringify(metadata || {})]
      );

      const activity = result.rows[0];

      res.status(201).json({
        success: true, message: 'Activity recorded successfully',
        data: {
          id: activity.id,
          type: activity.type,
          targetType: activity.target_type,
          targetId: activity.target_id, createdAt: activity.created_at
        }
      });
    } catch (error) {
      logger.error('Error in ActivityController.create:', error);
      res.status(500).json({
        success: false, message: 'Failed to create activity', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/activity/stats
   * Get activity statistics
   */
  async getStats(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      // Get activity counts by type
      const { rows: typeStats } = await socialDb.query(
        `SELECT type, COUNT(*) as count
         FROM activities
         WHERE actor_id = $1
         GROUP BY type
         ORDER BY count DESC`,
        [userId]
      );

      // Get recent activity count (last 24 hours)
      const { rows: recentCount } = await socialDb.query(
        `SELECT COUNT(*) as count
         FROM activities
         WHERE actor_id = $1
         AND created_at >= NOW() - INTERVAL '24 hours'`,
        [userId]
      );

      // Get total activity count
      const { rows: totalCount } = await socialDb.query(
        `SELECT COUNT(*) as count
         FROM activities
         WHERE actor_id = $1`,
        [userId]
      );

      res.json({
        success: true,
        data: {
          total: parseInt(totalCount[0]?.count || 0),
          last24Hours: parseInt(recentCount[0]?.count || 0),
          byType: typeStats.reduce((acc, stat) => {
            acc[stat.type] = parseInt(stat.count);
            return acc;
          }, {})
        }
      });
    } catch (error) {
      logger.error('Error in ActivityController.getStats:', error);
      res.status(500).json({
        success: false, message: 'Failed to retrieve activity statistics', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new ActivityController();
