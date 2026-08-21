/**
 * Member Profiles Controller
 * Complete implementation for member profile management
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class MemberProfilesController {
  /**
   * GET /api/memberprofiles/:userId
   * Get member profile by user ID
   */
  async getProfile(req, res) {
    try {
      const { userId } = req.params;

      const result = await pool.query(
        `SELECT 
          u.id,
          u.username,
          u.email,
          u.avatar_url,
          u.bio,
          u.location,
          u.website,
          u.joined_at,
          u.is_verified,
          COUNT(DISTINCT p.id) as post_count,
          COUNT(DISTINCT f.follower_id) as followers_count,
          COUNT(DISTINCT ff.following_id) as following_count
         FROM users u
         LEFT JOIN posts p ON u.id = p.author_id AND p.is_published = true
         LEFT JOIN followers f ON u.id = f.following_id
         LEFT JOIN followers ff ON u.id = ff.follower_id
         WHERE u.id = $1
         GROUP BY u.id`,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Member not found'
        });
      }

      const profile = result.rows[0];

      res.json({
        success: true,
        data: {
          ...profile,
          postCount: parseInt(profile.post_count),
          followersCount: parseInt(profile.followers_count), followingCount: parseInt(profile.following_count)
        }
      });
    } catch (error) {
      logger.error('Error in MemberProfilesController.getProfile:', error);
      res.status(500).json({
        success: false, message: 'Failed to get profile', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * PUT /api/memberprofiles/me
   * Update current user's profile
   */
  async updateProfile(req, res) {
    try {
      const userId = req.user?.id;
      const updates = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const setClauses = [];
      const values = [];
      let paramCount = 1;

      Object.keys(updates).forEach(key => {
        if (['bio', 'location', 'website', 'avatar_url'].includes(key)) {
          setClauses.push(`${key} = $${paramCount}`);
          values.push(updates[key]);
          paramCount++;
        }
      });

      if (setClauses.length === 0) {
        return res.status(400).json({
          success: false, message: 'No valid fields to update'
        });
      }

      setClauses.push('updated_at = NOW()');
      values.push(userId);

      const result = await pool.query(
        `UPDATE users 
         SET ${setClauses.join(', ')}
         WHERE id = $${paramCount}
         RETURNING id, username, email, avatar_url, bio, location, website`,
        values
      );

      res.json({
        success: true, message: 'Profile updated successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in MemberProfilesController.updateProfile:', error);
      res.status(500).json({
        success: false, message: 'Failed to update profile', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/memberprofiles/:userId/follow
   * Follow a member
   */
  async follow(req, res) {
    try {
      const userId = req.user?.id;
      const { userId: targetUserId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (userId === targetUserId) {
        return res.status(400).json({
          success: false, message: 'Cannot follow yourself'
        });
      }

      // Check if already following
      const existing = await pool.query(
        'SELECT id FROM followers WHERE follower_id = $1 AND following_id = $2',
        [userId, targetUserId]
      );

      if (existing.rows.length > 0) {
        return res.status(400).json({
          success: false, message: 'Already following'
        });
      }

      await pool.query(
        `INSERT INTO followers (follower_id, following_id, created_at)
         VALUES ($1, $2, NOW())`,
        [userId, targetUserId]
      );

      res.status(201).json({
        success: true, message: 'Following successfully'
      });
    } catch (error) {
      logger.error('Error in MemberProfilesController.follow:', error);
      res.status(500).json({
        success: false, message: 'Failed to follow', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * DELETE /api/memberprofiles/:userId/unfollow
   * Unfollow a member
   */
  async unfollow(req, res) {
    try {
      const userId = req.user?.id;
      const { userId: targetUserId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const result = await pool.query(
        'DELETE FROM followers WHERE follower_id = $1 AND following_id = $2 RETURNING id',
        [userId, targetUserId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Not following this user'
        });
      }

      res.json({
        success: true, message: 'Unfollowed successfully'
      });
    } catch (error) {
      logger.error('Error in MemberProfilesController.unfollow:', error);
      res.status(500).json({
        success: false, message: 'Failed to unfollow', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/memberprofiles/:userId/followers
   * Get member's followers
   */
  async getFollowers(req, res) {
    try {
      const { userId } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      const result = await pool.query(
        `SELECT 
          u.id,
          u.username,
          u.avatar_url,
          u.bio,
          f.created_at as followed_at
         FROM followers f
         JOIN users u ON f.follower_id = u.id
         WHERE f.following_id = $1
         ORDER BY f.created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, parseInt(limit), parseInt(offset)]
      );

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset), total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in MemberProfilesController.getFollowers:', error);
      res.status(500).json({
        success: false, message: 'Failed to get followers', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/memberprofiles/:userId/following
   * Get who member is following
   */
  async getFollowing(req, res) {
    try {
      const { userId } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      const result = await pool.query(
        `SELECT 
          u.id,
          u.username,
          u.avatar_url,
          u.bio,
          f.created_at as followed_at
         FROM followers f
         JOIN users u ON f.following_id = u.id
         WHERE f.follower_id = $1
         ORDER BY f.created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, parseInt(limit), parseInt(offset)]
      );

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset), total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in MemberProfilesController.getFollowing:', error);
      res.status(500).json({
        success: false, message: 'Failed to get following', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new MemberProfilesController();
