/*
 * FingerMobile Protocol™ - Content Manager Model
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

const db = require('../config/database'); // Assuming a database connection

class ContentManagerModel {
  static async getCommentsByUser(userId, respondedStatus, sortBy = 'created_at') {
    let statusCondition = '';
    if (respondedStatus === 'unresponded') {
      statusCondition = 'AND cm.response_status = \'pending\'';
    } else if (respondedStatus === 'responded') {
      statusCondition = 'AND cm.response_status = \'completed\'';
    }

    const query = `
      SELECT 
        cm.id,
        cm.comment_id,
        cm.content_id,
        cm.user_id,
        cm.comment_text,
        cm.response_text,
        cm.response_status,
        cm.created_at,
        u.username,
        c.title as content_title
      FROM content_manager cm
      JOIN users u ON cm.user_id = u.id
      JOIN content c ON cm.content_id = c.id
      WHERE cm.user_id = $1 ${statusCondition}
      ORDER BY cm.${sortBy} DESC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async getMentions(userId) {
    const query = `
      SELECT 
        m.id,
        m.mention_id,
        m.content_id,
        m.user_id,
        m.mentioned_user_id,
        m.mention_text,
        m.is_read,
        m.created_at,
        u.username,
        c.title as content_title
      FROM mentions m
      JOIN users u ON m.user_id = u.id
      JOIN content c ON m.content_id = c.id
      WHERE m.mentioned_user_id = $1
      ORDER BY m.created_at DESC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async getFollows(userId) {
    const query = `
      SELECT 
        f.id,
        f.follower_id,
        f.followed_id,
        f.status,
        f.created_at,
        u.username
      FROM follows f
      JOIN users u ON f.follower_id = u.id
      WHERE f.followed_id = $1
      ORDER BY f.created_at DESC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async respondToComment(commentId, responseText, moderatorId) {
    const query = `
      UPDATE content_manager
      SET 
        response_text = $1,
        response_status = 'completed',
        moderator_id = $2,
        updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;
    
    const result = await db.query(query, [responseText, moderatorId, commentId]);
    return result.rows[0];
  }

  static async getPendingItems(userId) {
    const query = `
      SELECT 
        cm.id,
        cm.content_id,
        cm.user_id,
        cm.comment_text,
        cm.moderation_status,
        c.title as content_title,
        u.username
      FROM content_manager cm
      JOIN content c ON cm.content_id = c.id
      JOIN users u ON cm.user_id = u.id
      WHERE cm.moderation_status = 'pending'
      AND cm.user_id = $1
      ORDER BY cm.created_at ASC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async getActivityLog(userId, timeRange = 'all', activityType = 'all', criteria = {}) {
    let timeCondition = '';
    if (timeRange !== 'all') {
      if (timeRange === 'today') {
        timeCondition = "AND DATE(created_at) = CURRENT_DATE";
      } else if (timeRange === 'week') {
        timeCondition = "AND created_at >= CURRENT_DATE - INTERVAL '7 days'";
      } else if (timeRange === 'month') {
        timeCondition = "AND created_at >= CURRENT_DATE - INTERVAL '30 days'";
      }
    }

    let typeCondition = '';
    if (activityType !== 'all') {
      typeCondition = `AND activity_type = '${activityType}'`;
    }

    const query = `
      SELECT 
        al.id,
        al.user_id,
        al.activity_type,
        al.description,
        al.metadata,
        al.created_at
      FROM activity_log al
      WHERE al.user_id = $1 ${timeCondition} ${typeCondition}
      ORDER BY al.created_at DESC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async updateModerationStatus(itemId, status, moderatorId) {
    const query = `
      UPDATE content_manager
      SET 
        moderation_status = $1,
        moderator_id = $2,
        updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;
    
    const result = await db.query(query, [status, moderatorId, itemId]);
    return result.rows[0];
  }
}

module.exports = ContentManagerModel;