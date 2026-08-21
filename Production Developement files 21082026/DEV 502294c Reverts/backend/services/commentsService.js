/**
 * CommentsService
 * Service for comments and discussions
 * Created: June 8, 2026
 */

const db = require('../database/connection');

class CommentsService {
  async getComments(entityId, entityType, filters = {}) {
    try {
      const { limit = 50, offset = 0, sortBy = 'created_at', order = 'DESC' } = filters;
      
      const comments = await db('comments')
        .where({ entity_id: entityId, entity_type: entityType })
        .orderBy(sortBy, order)
        .limit(limit)
        .offset(offset);
      
      // Get user info for each comment
      for (let comment of comments) {
        const user = await db('users')
          .select('id', 'username', 'avatar_url')
          .where({ id: comment.user_id })
          .first();
        comment.user = user;
        
        // Get reply count
        const [{ count }] = await db('comments')
          .where({ parent_id: comment.id })
          .count('* as count');
        comment.replyCount = parseInt(count);
      }
      
      return comments;
    } catch (error) {
      logger.error('Error in CommentsService.getComments:', error);
      throw new Error(`Failed to fetch comments: ${error.message}`);
    }
  }

  async createComment(data) {
    try {
      const now = new Date();
      const [comment] = await db('comments').insert({
        ...data,
        likes_count: 0,
        created_at: now,
        updated_at: now
      }).returning('*');
      
      const user = await db('users')
        .select('id', 'username', 'avatar_url')
        .where({ id: data.user_id })
        .first();
      
      return { ...comment, user };
    } catch (error) {
      logger.error('Error in CommentsService.createComment:', error);
      throw new Error(`Failed to create comment: ${error.message}`);
    }
  }

  async likeComment(commentId, userId) {
    try {
      // Check if already liked
      const existing = await db('comment_likes')
        .where({ comment_id: commentId, user_id: userId })
        .first();
      
      if (existing) {
        // Unlike
        await db('comment_likes')
          .where({ comment_id: commentId, user_id: userId })
          .del();
        
        await db('comments')
          .where({ id: commentId })
          .decrement('likes_count', 1);
        
        return { liked: false };
      } else {
        // Like
        await db('comment_likes').insert({
          comment_id: commentId,
          user_id: userId,
          created_at: new Date()
        });
        
        await db('comments')
          .where({ id: commentId })
          .increment('likes_count', 1);
        
        return { liked: true };
      }
    } catch (error) {
      logger.error('Error in CommentsService.likeComment:', error);
      throw new Error(`Failed to toggle like: ${error.message}`);
    }
  }

  async deleteComment(commentId, userId) {
    try {
      const comment = await db('comments').where({ id: commentId }).first();
      
      if (!comment || comment.user_id !== userId) {
        throw new Error('Unauthorized or comment not found');
      }
      
      await db('comments').where({ id: commentId }).del();
      
      return { success: true };
    } catch (error) {
      logger.error('Error in CommentsService.deleteComment:', error);
      throw error;
    }
  }
}

module.exports = new CommentsService();
