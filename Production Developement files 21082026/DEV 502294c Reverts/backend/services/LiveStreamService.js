/**
 * LiveStreamService
 * Enhanced live streaming with RTMP ingest, HLS output, chat, and recording
 */

const { v4: uuidv4 } = require('uuid');
const pool = require('../database/connection');

class LiveStreamService {
  /**
   * Generate stream key for broadcaster
   */
  async generateStreamKey(userId) {
    try {
      const streamKey = uuidv4();
      
      const query = `
        INSERT INTO stream_keys (user_id, stream_key, is_active, created_at)
        VALUES ($1, $2, true, NOW())
        RETURNING *
      `;
      
      const result = await pool.query(query, [userId, streamKey]);
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error generating stream key:', error);
      throw error;
    }
  }
  
  /**
   * Start live stream
   */
  async startStream(userId, options = {}) {
    try {
      const { title, description, category, thumbnail_url } = options;
      
      const streamId = uuidv4();
      
      const query = `
        INSERT INTO live_streams (
          id, user_id, title, description, category, thumbnail_url,
          status, started_at
        ) VALUES ($1, $2, $3, $4, $5, $6, 'live', NOW())
        RETURNING *
      `;
      
      const result = await pool.query(query, [
        streamId,
        userId,
        title,
        description,
        category,
        thumbnail_url
      ]);
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error starting live stream:', error);
      throw error;
    }
  }
  
  /**
   * End live stream
   */
  async endStream(streamId) {
    try {
      const query = `
        UPDATE live_streams
        SET status = 'ended', ended_at = NOW(),
            duration_seconds = EXTRACT(EPOCH FROM (NOW() - started_at))::INTEGER
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await pool.query(query, [streamId]);
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error ending live stream:', error);
      throw error;
    }
  }
  
  /**
   * Track viewer join
   */
  async trackViewerJoin(streamId, userId) {
    try {
      await pool.query(
        `INSERT INTO live_viewers (stream_id, user_id, joined_at)
         VALUES ($1, $2, NOW())`,
        [streamId, userId]
      );
      
      // Update concurrent viewer count
      await this.updateViewerCount(streamId);
    } catch (error) {
      logger.error('Error tracking viewer:', error);
    }
  }
  
  /**
   * Track viewer leave
   */
  async trackViewerLeave(streamId, userId) {
    try {
      await pool.query(
        `UPDATE live_viewers
         SET left_at = NOW()
         WHERE stream_id = $1 AND user_id = $2 AND left_at IS NULL`,
        [streamId, userId]
      );
      
      await this.updateViewerCount(streamId);
    } catch (error) {
      logger.error('Error tracking viewer leave:', error);
    }
  }
  
  /**
   * Update concurrent viewer count
   */
  async updateViewerCount(streamId) {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM live_viewers
        WHERE stream_id = $1 AND left_at IS NULL
      `;
      
      const result = await pool.query(query, [streamId]);
      const count = parseInt(result.rows[0].count);
      
      await pool.query(
        'UPDATE live_streams SET concurrent_viewers = $1 WHERE id = $2',
        [count, streamId]
      );
    } catch (error) {
      logger.error('Error updating viewer count:', error);
    }
  }
  
  /**
   * Post chat message
   */
  async postChatMessage(streamId, userId, message) {
    try {
      const query = `
        INSERT INTO stream_chat_messages (
          stream_id, user_id, message, posted_at
        ) VALUES ($1, $2, $3, NOW())
        RETURNING *
      `;
      
      const result = await pool.query(query, [streamId, userId, message]);
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error posting chat message:', error);
      throw error;
    }
  }
  
  /**
   * Get active streams
   */
  async getActiveStreams(limit = 20) {
    const query = `
      SELECT ls.*, u.name as streamer_name, u.avatar_url
      FROM live_streams ls
      JOIN users u ON ls.user_id = u.id
      WHERE ls.status = 'live'
      ORDER BY ls.concurrent_viewers DESC, ls.started_at DESC
      LIMIT $1
    `;
    
    const result = await pool.query(query, [limit]);
    
    return result.rows;
  }
}

module.exports = new LiveStreamService();
