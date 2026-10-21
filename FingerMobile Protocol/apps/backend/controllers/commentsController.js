/**
 * Universal UGC Comments Controller
 * FingerMobile Protocol™
 * Handles comments & nested replies across all UGC types (posts, media, tracks, blogs, threads)
 * Enforces member privacy control: allow_comments
 */

const db = require('../db');
const logger = require('../utils/logger');
const ugcPrivacyService = require('../services/ugcPrivacyService');

const getPool = () => db.pool || db;

class CommentsController {
  constructor() {
    this.getAll = (req, res) => this.getComments(req, res);
    this.getById = (req, res) => this.getComments(req, res);
    this.create = (req, res) => this.createComment(req, res);
    this.update = (req, res) => this.createComment(req, res);
    this.delete = (req, res) => this.deleteComment(req, res);
    this.like = (req, res) => res.json({ success: true, message: 'Comment liked' });
    this.getComments = this.getComments.bind(this);
    this.createComment = this.createComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.getCommentReplies = this.getCommentReplies.bind(this);
  }

  /**
   * GET /api/ugc/:contentType/:contentId/comments
   */
  async getComments(req, res) {
    try {
      const contentType = req.params.contentType || req.query.contentType || 'post';
      const contentId = req.params.contentId || req.query.contentId;
      const { limit = 30, offset = 0 } = req.query;

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
          c.id, c.content_type, c.content_id, c.parent_comment_id, c.comment_text, c.created_at, c.updated_at,
          u.id as "userId", u.username, u.email
        FROM ugc_comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.content_type = $1 AND c.content_id = $2 AND c.is_deleted = false AND c.parent_comment_id IS NULL
        ORDER BY c.created_at DESC
        LIMIT $3 OFFSET $4
      `;

      const result = await getPool().query(sql, [contentType, String(contentId), parseInt(limit, 10), parseInt(offset, 10)]);

      const countResult = await getPool().query(
        'SELECT COUNT(*) as total FROM ugc_comments WHERE content_type = $1 AND content_id = $2 AND is_deleted = false',
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
      logger.error('Error in CommentsController.getComments:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve comments' });
    }
  }

  /**
   * POST /api/ugc/:contentType/:contentId/comments
   */
  async createComment(req, res) {
    try {
      const userId = req.user.id;
      const contentType = req.params.contentType || req.body.contentType || 'post';
      const contentId = req.params.contentId || req.body.contentId;
      const { commentText, parentCommentId } = req.body;

      if (!contentId || !commentText) {
        return res.status(400).json({ success: false, message: 'Content ID and comment text are required' });
      }

      // Enforce owner's privacy setting: allow_comments
      const perm = await ugcPrivacyService.checkPermission(contentType, contentId, userId, 'comment');
      if (!perm.allowed) {
        return res.status(403).json({ success: false, message: perm.reason });
      }

      const sql = `
        INSERT INTO ugc_comments (content_type, content_id, user_id, parent_comment_id, comment_text, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING *
      `;

      const parentId = parentCommentId ? String(parentCommentId) : null;
      const result = await getPool().query(sql, [contentType, String(contentId), userId, parentId, commentText]);

      res.status(201).json({
        success: true,
        message: 'Comment posted successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in CommentsController.createComment:', error);
      res.status(500).json({ success: false, message: 'Failed to post comment' });
    }
  }

  /**
   * DELETE /api/ugc/comments/:commentId
   */
  async deleteComment(req, res) {
    try {
      const userId = req.user.id;
      const { commentId } = req.params;

      const result = await getPool().query(
        'UPDATE ugc_comments SET is_deleted = true, updated_at = NOW() WHERE id = $1 AND user_id = $2 RETURNING *',
        [commentId, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Comment not found or unauthorized' });
      }

      res.json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
      logger.error('Error in CommentsController.deleteComment:', error);
      res.status(500).json({ success: false, message: 'Failed to delete comment' });
    }
  }

  /**
   * GET /api/ugc/comments/:commentId/replies
   */
  async getCommentReplies(req, res) {
    try {
      const { commentId } = req.params;
      const { limit = 20, offset = 0 } = req.query;

      const sql = `
        SELECT 
          c.id, c.content_type, c.content_id, c.parent_comment_id, c.comment_text, c.created_at,
          u.id as "userId", u.username, u.email
        FROM ugc_comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.parent_comment_id = $1 AND c.is_deleted = false
        ORDER BY c.created_at ASC
        LIMIT $2 OFFSET $3
      `;

      const result = await getPool().query(sql, [String(commentId), parseInt(limit, 10), parseInt(offset, 10)]);

      res.json({ success: true, data: result.rows });
    } catch (error) {
      logger.error('Error in CommentsController.getCommentReplies:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve comment replies' });
    }
  }
}

module.exports = new CommentsController();
