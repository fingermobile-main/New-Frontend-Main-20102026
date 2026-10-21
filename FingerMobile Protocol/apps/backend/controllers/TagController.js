/**
 * Universal UGC Tag Controller
 * FingerMobile Protocol™
 * Handles user tagging in content
 * Enforces member privacy control: allow_tagging
 */

const db = require('../db');
const logger = require('../utils/logger');
const ugcPrivacyService = require('../services/ugcPrivacyService');

const getPool = () => db.pool || db;

class TagController {
  constructor() {
    this.tagUserInContent = this.tagUserInContent.bind(this);
    this.addTag = this.tagUserInContent.bind(this);
    this.getContentTags = this.getContentTags.bind(this);
    this.getTags = this.getContentTags.bind(this);
    this.getUserTags = this.getUserTags.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.approveTag = this.approveTag.bind(this);
  }

  /**
   * POST /api/ugc/:contentType/:contentId/tag
   */
  async tagUserInContent(req, res) {
    try {
      const userId = req.user.id;
      const contentType = req.params.contentType || req.body.contentType || 'post';
      const contentId = req.params.contentId || req.body.contentId;
      const { taggedUserId } = req.body;

      if (!contentId || !taggedUserId) {
        return res.status(400).json({ success: false, message: 'Content ID and tagged user ID are required' });
      }

      // Enforce owner's privacy setting: allow_tagging
      const perm = await ugcPrivacyService.checkPermission(contentType, contentId, userId, 'tag');
      if (!perm.allowed) {
        return res.status(403).json({ success: false, message: perm.reason });
      }

      // Check if user exists
      const userCheck = await getPool().query('SELECT id FROM users WHERE id = $1', [taggedUserId]);
      if (userCheck.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Tagged user not found' });
      }

      // Check if already tagged
      const existingTag = await getPool().query(
        'SELECT id FROM ugc_tags WHERE content_type = $1 AND content_id = $2 AND tagged_user_id = $3',
        [contentType, String(contentId), taggedUserId]
      );

      if (existingTag.rows.length > 0) {
        return res.status(409).json({ success: false, message: 'User already tagged in this content' });
      }

      const sql = `
        INSERT INTO ugc_tags (content_type, content_id, tagged_user_id, created_by_user_id, status, created_at)
        VALUES ($1, $2, $3, $4, 'approved', NOW())
        RETURNING *
      `;

      const result = await getPool().query(sql, [contentType, String(contentId), taggedUserId, userId]);

      res.status(201).json({
        success: true,
        message: 'User tagged successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in TagController.tagUserInContent:', error);
      res.status(500).json({ success: false, message: 'Failed to tag user in content' });
    }
  }

  /**
   * GET /api/ugc/:contentType/:contentId/tags
   */
  async getContentTags(req, res) {
    try {
      const contentType = req.params.contentType || req.query.contentType || 'post';
      const contentId = req.params.contentId || req.query.contentId;
      const { limit = 20, offset = 0 } = req.query;

      if (!contentId) {
        return res.status(400).json({ success: false, message: 'Content ID is required' });
      }

      // Check view permission
      const perm = await ugcPrivacyService.checkPermission(contentType, contentId, req.user?.id, 'view');
      if (!perm.allowed) {
        return res.status(403).json({ success: false, message: perm.reason });
      }

      const sql = `
        SELECT 
          t.id, t.content_type, t.content_id, t.status, t.created_at,
          tagged_user.id as "taggedUserId", tagged_user.username as "taggedUsername",
          creator.id as "createdByUserId", creator.username as "createdByUsername"
        FROM ugc_tags t
        LEFT JOIN users tagged_user ON t.tagged_user_id = tagged_user.id
        LEFT JOIN users creator ON t.created_by_user_id = creator.id
        WHERE t.content_type = $1 AND t.content_id = $2
        ORDER BY t.created_at DESC
        LIMIT $3 OFFSET $4
      `;

      const result = await getPool().query(sql, [contentType, String(contentId), parseInt(limit, 10), parseInt(offset, 10)]);

      const countResult = await getPool().query(
        'SELECT COUNT(*) as total FROM ugc_tags WHERE content_type = $1 AND content_id = $2',
        [contentType, String(contentId)]
      );

      res.json({
        success: true,
        data: result.rows,
        summary: {
          total: parseInt(countResult.rows[0]?.total || 0, 10)
        }
      });
    } catch (error) {
      logger.error('Error in TagController.getContentTags:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve content tags' });
    }
  }

  /**
   * GET /api/tags/user/:userId
   */
  async getUserTags(req, res) {
    try {
      const userId = req.params.userId || req.user.id;
      const { limit = 20, offset = 0 } = req.query;

      // Check if user can view others' tags
      if (userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Insufficient permissions to view other user\'s tags' });
      }

      const sql = `
        SELECT 
          t.id, t.content_type, t.content_id, t.status, t.created_at,
          content_user.id as "createdByUserId", content_user.username as "createdByUsername"
        FROM ugc_tags t
        LEFT JOIN users content_user ON t.created_by_user_id = content_user.id
        WHERE t.tagged_user_id = $1
        ORDER BY t.created_at DESC
        LIMIT $2 OFFSET $3
      `;

      const result = await getPool().query(sql, [userId, parseInt(limit, 10), parseInt(offset, 10)]);

      const countResult = await getPool().query(
        'SELECT COUNT(*) as total FROM ugc_tags WHERE tagged_user_id = $1',
        [userId]
      );

      res.json({
        success: true,
        data: result.rows,
        summary: {
          total: parseInt(countResult.rows[0]?.total || 0, 10)
        }
      });
    } catch (error) {
      logger.error('Error in TagController.getUserTags:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve user tags' });
    }
  }

  /**
   * DELETE /api/ugc/:contentType/:contentId/tag/:taggedUserId
   */
  async removeTag(req, res) {
    try {
      const userId = req.user.id;
      const contentType = req.params.contentType;
      const contentId = req.params.contentId;
      const taggedUserId = req.params.taggedUserId;

      if (!contentType || !contentId || !taggedUserId) {
        return res.status(400).json({ success: false, message: 'Content type, content ID, and tagged user ID are required' });
      }

      // Check if current user is the content owner or the tagged user
      const privacySettings = await ugcPrivacyService.getPrivacySettings(contentType, contentId);
      const isContentOwner = privacySettings.owner_id && Number(privacySettings.owner_id) === Number(userId);
      const isTaggedUser = Number(taggedUserId) === Number(userId);

      if (!isContentOwner && !isTaggedUser) {
        return res.status(403).json({ success: false, message: 'Only content owner or tagged user can remove tag' });
      }

      const result = await getPool().query(
        'DELETE FROM ugc_tags WHERE content_type = $1 AND content_id = $2 AND tagged_user_id = $3 RETURNING *',
        [contentType, String(contentId), taggedUserId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Tag not found' });
      }

      res.json({
        success: true,
        message: 'Tag removed successfully'
      });
    } catch (error) {
      logger.error('Error in TagController.removeTag:', error);
      res.status(500).json({ success: false, message: 'Failed to remove tag' });
    }
  }

  /**
   * PUT /api/ugc/:contentType/:contentId/tag/:taggedUserId/approve
   */
  async approveTag(req, res) {
    try {
      const userId = req.user.id;
      const contentType = req.params.contentType;
      const contentId = req.params.contentId;
      const taggedUserId = req.params.taggedUserId;

      if (!contentType || !contentId || !taggedUserId) {
        return res.status(400).json({ success: false, message: 'Content type, content ID, and tagged user ID are required' });
      }

      // Check if current user is the content owner
      const privacySettings = await ugcPrivacyService.getPrivacySettings(contentType, contentId);
      const isContentOwner = privacySettings.owner_id && Number(privacySettings.owner_id) === Number(userId);

      if (!isContentOwner) {
        return res.status(403).json({ success: false, message: 'Only content owner can approve tags' });
      }

      const result = await getPool().query(
        'UPDATE ugc_tags SET status = \'approved\', updated_at = NOW() WHERE content_type = $1 AND content_id = $2 AND tagged_user_id = $3 RETURNING *',
        [contentType, String(contentId), taggedUserId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Tag not found' });
      }

      res.json({
        success: true,
        message: 'Tag approved successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in TagController.approveTag:', error);
      res.status(500).json({ success: false, message: 'Failed to approve tag' });
    }
  }
}

module.exports = new TagController();
