import { Pool } from 'pg';
import logger from '../utils/logger';

/**
 * PostService
 * Business logic for post management and interactions
 */

class PostService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Get posts feed with filtering
   */
  async getPosts(page: number = 1, limit: number = 20, type?: string, authorId?: number, hashtag?: string, currentUserId?: number): Promise<any[]> {
    try {
      let query = `
        SELECT p.*, u.name as author_name, u.avatar_url as author_avatar,
          (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
          (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
          (SELECT COUNT(*) FROM shares WHERE post_id = p.id) as shares_count,
          CASE WHEN $5 IS NOT NULL THEN 
            EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = $5)
          ELSE false END as is_liked,
          CASE WHEN $5 IS NOT NULL THEN 
            EXISTS(SELECT 1 FROM bookmarks WHERE post_id = p.id AND user_id = $5)
          ELSE false END as is_bookmarked
        FROM posts p
        JOIN users u ON p.author_id = u.id
        WHERE p.status = 'published'
      `;
      
      const values: any[] = [];
      let paramCount = 0;

      if (type) {
        paramCount++;
        query += ` AND p.type = $${paramCount}`;
        values.push(type);
      }

      if (authorId) {
        paramCount++;
        query += ` AND p.author_id = $${paramCount}`;
        values.push(authorId);
      }

      if (hashtag) {
        paramCount++;
        query += ` AND p.hashtags @> ARRAY[$${paramCount}]`;
        values.push(hashtag);
      }

      paramCount++;
      query += ` ORDER BY p.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
      values.push(limit, (page - 1) * limit);

      if (currentUserId) {
        values.unshift(currentUserId);
      } else {
        values.unshift(null);
      }

      const result = await this.pool.query(query, values);
      return result.rows;
    
    } catch (error) {
      logger.error(`Error in getPosts:`, error);
      throw error;
    }
  }

  /**
   * Get single post by ID
   */
  async getPostById(postId: number, currentUserId?: number): Promise<any> {
    try {
      const query = `
        SELECT p.*, u.name as author_name, u.avatar_url as author_avatar,
          (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
          (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
          (SELECT COUNT(*) FROM shares WHERE post_id = p.id) as shares_count,
          CASE WHEN $3 IS NOT NULL THEN 
            EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = $3)
          ELSE false END as is_liked
        FROM posts p
        JOIN users u ON p.author_id = u.id
        WHERE p.id = $1 AND p.status = 'published'
      `;
      
      const result = await this.pool.query(query, [postId, null, currentUserId || null]);
      return result.rows[0] || null;
    
    } catch (error) {
      logger.error(`Error in getPostById:`, error);
      throw error;
    }
  }

  /**
   * Create new post
   */
  async createPost(authorId: number, postData: any): Promise<any> {
    try {
      const query = `
        INSERT INTO posts (author_id, content, type, media_urls, hashtags, visibility, scheduled_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      
      const values = [
        authorId,
        postData.content,
        postData.type || 'text',
        postData.media_urls ? JSON.stringify(postData.media_urls) : null,
        postData.hashtags || [],
        postData.visibility || 'public',
        postData.scheduled_at || null
      ];

      const result = await this.pool.query(query, values);
      return result.rows[0];
    
    } catch (error) {
      logger.error(`Error in createPost:`, error);
      throw error;
    }
  }

  /**
   * Update post
   */
  async updatePost(postId: number, userId: number, updates: any): Promise<any> {
    try {
      // Verify ownership
      const verifyQuery = 'SELECT author_id FROM posts WHERE id = $1';
      const verifyResult = await this.pool.query(verifyQuery, [postId]);
      
      if (!verifyResult.rows[0] || verifyResult.rows[0].author_id !== userId) {
        throw new Error('Not authorized to update this post');
      }

      const allowedFields = ['content', 'media_urls', 'hashtags', 'visibility'];
      const setClauses: string[] = [];
      const values: any[] = [];
      let paramCount = 0;

      for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
          paramCount++;
          if (key === 'media_urls' || key === 'hashtags') {
            setClauses.push(`${key} = $${paramCount}`);
            values.push(JSON.stringify(value));
          } else {
            setClauses.push(`${key} = $${paramCount}`);
            values.push(value);
          }
        }
      }

      if (setClauses.length === 0) {
        throw new Error('No valid fields to update');
      }

      paramCount++;
      values.push(postId);
      
      const query = `UPDATE posts SET ${setClauses.join(', ')} , updated_at = NOW() WHERE id = $${paramCount} RETURNING *`;
      const result = await this.pool.query(query, values);
      return result.rows[0];
    
    } catch (error) {
      logger.error(`Error in updatePost:`, error);
      throw error;
    }
  }

  /**
   * Delete post
   */
  async deletePost(postId: number, userId: number): Promise<boolean> {
    try {
      // Verify ownership or admin
      const verifyQuery = 'SELECT author_id FROM posts WHERE id = $1';
      const verifyResult = await this.pool.query(verifyQuery, [postId]);
      
      if (!verifyResult.rows[0]) {
        return false;
      }

      const query = 'DELETE FROM posts WHERE id = $1 AND (author_id = $2 OR EXISTS(SELECT 1 FROM users WHERE id = $2 AND role = \'admin\'))';
      const result = await this.pool.query(query, [postId, userId]);
      return (result.rowCount ?? 0) > 0;
    
    } catch (error) {
      logger.error(`Error in deletePost:`, error);
      throw error;
    }
  }

  /**
   * Like post
   */
  async likePost(postId: number, userId: number): Promise<void> {
    try {
      const query = `
        INSERT INTO post_likes (post_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT (post_id, user_id) DO NOTHING
      `;
      await this.pool.query(query, [postId, userId]);
    
    } catch (error) {
      logger.error(`Error in likePost:`, error);
      throw error;
    }
  }

  /**
   * Unlike post
   */
  async unlikePost(postId: number, userId: number): Promise<void> {
    try {
      const query = 'DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2';
      await this.pool.query(query, [postId, userId]);
    
    } catch (error) {
      logger.error(`Error in unlikePost:`, error);
      throw error;
    }
  }

  /**
   * Share post
   */
  async sharePost(postId: number, userId: number): Promise<void> {
    try {
      const query = 'INSERT INTO shares (post_id, user_id) VALUES ($1, $2)';
      await this.pool.query(query, [postId, userId]);
    
    } catch (error) {
      logger.error(`Error in sharePost:`, error);
      throw error;
    }
  }

  /**
   * Bookmark post
   */
  async bookmarkPost(postId: number, userId: number): Promise<void> {
    try {
      const query = `
        INSERT INTO bookmarks (post_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT (post_id, user_id) DO NOTHING
      `;
      await this.pool.query(query, [postId, userId]);
    
    } catch (error) {
      logger.error(`Error in bookmarkPost:`, error);
      throw error;
    }
  }

  /**
   * Remove bookmark
   */
  async removeBookmark(postId: number, userId: number): Promise<void> {
    try {
      const query = 'DELETE FROM bookmarks WHERE post_id = $1 AND user_id = $2';
      await this.pool.query(query, [postId, userId]);
    
    } catch (error) {
      logger.error(`Error in removeBookmark:`, error);
      throw error;
    }
  }
}

export default new PostService(require('../db').default || require('../db'));