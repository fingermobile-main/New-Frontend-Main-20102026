/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';
import mlRecommendationService from '../services/MLRecommendationService';
import { 
  AuthenticatedRequest, 
  VideoWithMetrics, 
  ViewMetadata, 
  QueryParams 
} from '../types/database.types';

/**
 * FingershortsController
 * FingerShorts platform - Short-form video content, feed, interactions
 * Enhanced with ML-based recommendation algorithms
 */

class FingershortsController {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  /**
   * GET /api/fingershorts/for-you
   * Get personalized video feed using ML-based recommendation engine
   * TODO #1: Implement ML-based collaborative filtering
   * TODO #2: Add content-based filtering using video metadata
   * TODO #3: Implement real-time engagement scoring
   */
  async getForYou(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { limit = 20, offset = 0, use_ml = true } = req.query;
      
      if (!userId) {
        // Return trending videos for non-authenticated users
        const query = `
          SELECT v.*, u.name as creator_name, u.avatar_url as creator_avatar,
                 COALESCE(vpm.engagement_score, 0) as engagement_score,
                 COALESCE(vpm.trending_score, 0) as trending_score
          FROM fingershorts_videos v
          JOIN users u ON v.creator_id = u.id
          LEFT JOIN video_performance_metrics vpm ON vpm.video_id = v.id
          WHERE v.is_published = true AND v.status = 'approved'
          ORDER BY COALESCE(vpm.trending_score, 0) DESC, v.created_at DESC
          LIMIT $1 OFFSET $2
        `;
        
        const result = await this.db.query<VideoWithMetrics>(query, [parseInt(limit as string), parseInt(offset as string)]);
        
        res.json({
          success: true,
          data: result.rows,
          algorithm: 'trending_fallback',
          pagination: {
            limit: parseInt(limit as string),
            offset: parseInt(offset as string)
          }
        });
        return;
      }
      
      // Use ML-based recommendations for authenticated users
      if (use_ml === 'true') {
        // Get A/B test variant
        const abVariant = await mlRecommendationService.getABTestVariant(userId);
        
        // Get personalized recommendations
        const recommendations = await mlRecommendationService.getPersonalizedFeed(
          userId, 
          parseInt(limit as string), 
          parseInt(offset as string)
        );
        
        // Enrich with full video data
        const enrichedVideos = await this.enrichVideoData(recommendations.map(r => r.videoId));
        
        res.json({
          success: true,
          data: enrichedVideos,
          algorithm: `ml_${abVariant}`,
          personalization: {
            variant: abVariant,
            totalCandidates: recommendations.length
          },
          pagination: {
            limit: parseInt(limit as string),
            offset: parseInt(offset as string)
          }
        });
      } else {
        // Fallback to SQL-based personalized feed
        await this.getPersonalizedFeedSQL(userId, parseInt(limit as string), parseInt(offset as string), res);
      }
    } catch (error) {
      logger.error('FingershortsController.getForYou error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve personalized feed',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * Legacy SQL-based personalized feed (fallback)
   */
  private async getPersonalizedFeedSQL(userId: string, limit: number, offset: number, res: Response): Promise<void> {
    const query = `
      WITH user_connections AS (
        SELECT receiver_id as connected_user FROM connections WHERE sender_id = $1 AND status = 'accepted',
        UNION
        SELECT sender_id as connected_user FROM connections WHERE receiver_id = $1 AND status = 'accepted'
      ),
      user_likes AS (
        SELECT DISTINCT target_id as liked_video FROM likes WHERE user_id = $1 AND target_type = 'video'
      ),
      user_categories AS (
        SELECT v.category, COUNT(*) as preference_score
        FROM video_views vv
        JOIN fingershorts_videos v ON vv.video_id = v.id
        WHERE vv.user_id = $1 AND v.category IS NOT NULL
        GROUP BY v.category
        ORDER BY preference_score DESC
        LIMIT 5
      )
      SELECT v.*, u.name as creator_name, u.avatar_url as creator_avatar,
             COALESCE(vpm.engagement_score, 0) as engagement_score,
             CASE 
               WHEN v.creator_id IN (SELECT connected_user FROM user_connections) THEN 3
               WHEN v.category IN (SELECT category FROM user_categories) THEN 2
               WHEN v.id IN (SELECT liked_video FROM user_likes) THEN 1
               ELSE 0
             END as relevance_score
      FROM fingershorts_videos v
      JOIN users u ON v.creator_id = u.id
      LEFT JOIN video_performance_metrics vpm ON vpm.video_id = v.id
      WHERE v.is_published = true AND v.status = 'approved'
      GROUP BY v.id, u.name, u.avatar_url, vpm.engagement_score
      ORDER BY relevance_score DESC, COALESCE(vpm.engagement_score, 0) DESC, v.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await this.db.query(query, [userId, limit, offset]);

    res.json({
      success: true,
      data: result.rows,
      algorithm: 'sql_personalized_fallback',
      pagination: {
        limit,
        offset
      }
    });
  }

  /**
   * Enrich video IDs with full data
   */
  private async enrichVideoData(videoIds: string[]): Promise<VideoWithMetrics[]> {
    if (videoIds.length === 0) return [];
    
    const query = `
      SELECT v.*, u.name as creator_name, u.avatar_url as creator_avatar,
             COALESCE(vpm.total_views, 0) as view_count,
             COALESCE(vpm.like_rate, 0) as like_rate,
             COALESCE(vpm.completion_rate, 0) as completion_rate
      FROM fingershorts_videos v
      JOIN users u ON v.creator_id = u.id
      LEFT JOIN video_performance_metrics vpm ON vpm.video_id = v.id
      WHERE v.id = ANY($1::uuid[])
      ORDER BY array_position($1::uuid[], v.id)
    `;
    
    const result = await this.db.query<VideoWithMetrics>(query, [videoIds]);
    return result.rows;
  }

  /**
   * GET /api/fingershorts/following
   * Get videos from users you follow
   * TODO #4: Optimize following feed with engagement prediction
   */
  async getFollowing(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }
      
      const { limit = 20, offset = 0 } = req.query;
      
      const query = `
        SELECT v.*, u.name as creator_name, u.avatar_url as creator_avatar,
               COALESCE(vpm.engagement_score, 0) as engagement_score,
               COALESCE(vpm.completion_rate, 0) as avg_completion_rate
        FROM fingershorts_videos v
        JOIN users u ON v.creator_id = u.id
        LEFT JOIN video_performance_metrics vpm ON vpm.video_id = v.id
        WHERE v.is_published = true 
          AND v.status = 'approved'
          AND v.creator_id IN (
            SELECT receiver_id FROM connections WHERE sender_id = $1 AND status = 'accepted',
            UNION
            SELECT sender_id FROM connections WHERE receiver_id = $1 AND status = 'accepted'
          )
        ORDER BY COALESCE(vpm.engagement_score, 0) DESC, v.created_at DESC
        LIMIT $2 OFFSET $3
      `;
      
      const result = await this.db.query<VideoWithMetrics>(query, [userId, parseInt(limit as string), parseInt(offset as string)]);

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string)
        }
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('FingershortsController.getFollowing error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve following feed',
        error: process.env.NODE_ENV === 'development' ? message : undefined
      });
    }
  }

  /**
   * GET /api/fingershorts/trending
   * Get trending videos based on recent engagement velocity
   * TODO #5: Implement trending algorithm with velocity tracking
   */
  async getTrending(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 20, hours = 24, category } = req.query;
      
      let query = `
        SELECT v.*, u.name as creator_name, u.avatar_url as creator_avatar,
               COALESCE(vpm.trending_score, 0) as trending_score,
               COALESCE(vpm.engagement_score, 0) as engagement_score,
               COALESCE(vpm.total_views, 0) as view_count
        FROM fingershorts_videos v
        JOIN users u ON v.creator_id = u.id
        LEFT JOIN video_performance_metrics vpm ON vpm.video_id = v.id
        WHERE v.is_published = true 
          AND v.status = 'approved'
          AND v.created_at > NOW() - INTERVAL '$2 hours'
      `;
      
      const params: QueryParams = [parseInt(limit as string), parseInt(hours as string)];
      let paramIndex = 3;
      
      if (category) {
        query += ` AND v.category = $${paramIndex}`;
        params.push(category as string);
        paramIndex++;
      }
      
      query += ` ORDER BY COALESCE(vpm.trending_score, 0) DESC, v.created_at DESC LIMIT $1`;
      
      const result = await this.db.query<VideoWithMetrics>(query, params);

      res.json({
        success: true,
        data: result.rows,
        algorithm: 'velocity_based_trending'
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('FingershortsController.getTrending error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve trending videos',
        error: process.env.NODE_ENV === 'development' ? message : undefined
      });
    }
  }

  /**
   * Custom method: getAll
   * Get all videos with advanced filtering and pagination
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { 
        page = 1, 
        limit = 20, 
        status, 
        creator_id, 
        category, 
        min_views, 
        max_views,
        sort_by = 'created_at',
        order = 'DESC',
        min_engagement_score
      } = req.query;
      
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      
      let query = `
        SELECT v.*, u.name as creator_name, u.avatar_url as creator_avatar,
               COALESCE(vpm.total_views, 0) as view_count,
               COALESCE(vpm.engagement_score, 0) as engagement_score,
               COALESCE(vpm.completion_rate, 0) as completion_rate
        FROM fingershorts_videos v
        JOIN users u ON v.creator_id = u.id
        LEFT JOIN video_performance_metrics vpm ON vpm.video_id = v.id
      `;
      
      const conditions: string[] = [];
      const params: QueryParams = [];
      let paramIndex = 1;
      
      if (status) {
        conditions.push(`v.status = $${paramIndex}`);
        params.push(status as string);
        paramIndex++;
      }
      
      if (creator_id) {
        conditions.push(`v.creator_id = $${paramIndex}`);
        params.push(creator_id as string);
        paramIndex++;
      }
      
      if (category) {
        conditions.push(`v.category = $${paramIndex}`);
        params.push(category as string);
        paramIndex++;
      }
      
      if (min_views) {
        conditions.push(`COALESCE(vpm.total_views, 0) >= $${paramIndex}`);
        params.push(parseInt(min_views as string));
        paramIndex++;
      }
      
      if (max_views) {
        conditions.push(`COALESCE(vpm.total_views, 0) <= $${paramIndex}`);
        params.push(parseInt(max_views as string));
        paramIndex++;
      }
      
      if (min_engagement_score) {
        conditions.push(`COALESCE(vpm.engagement_score, 0) >= $${paramIndex}`);
        params.push(parseFloat(min_engagement_score as string));
        paramIndex++;
      }
      
      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }
      
      // Dynamic sorting with engagement metrics
      const validSortFields = ['created_at', 'engagement_score', 'view_count', 'completion_rate'];
      const sortField = validSortFields.includes(sort_by as string) ? 
        (sort_by === 'view_count' ? 'vpm.total_views' : 
         sort_by === 'engagement_score' ? 'vpm.engagement_score' :
         sort_by === 'completion_rate' ? 'vpm.completion_rate' : 'v.created_at') : 
        'v.created_at';
      const sortOrder = order === 'ASC' ? 'ASC' : 'DESC';
      
      query += ` ORDER BY ${sortField} ${sortOrder}`;
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(parseInt(limit as string), offset);
      
      const result = await this.db.query<VideoWithMetrics>(query, params);
      
      // Get total count for pagination
      let countQuery = `SELECT COUNT(*) as total FROM fingershorts_videos v`;
      if (conditions.length > 0) {
        countQuery += ` WHERE ${conditions.join(' AND ').replace(/\$\d+/g, (match) => {
          const idx = parseInt(match.substring(1)) - 1;
          return `$${idx + 1}`;
        })}`;
      }
      
      const countResult = await this.db.query(countQuery, params.slice(0, paramIndex - 2));
      const total = parseInt(countResult.rows[0].total);
      
      res.json({
        success: true,
        data: result.rows,
        pagination: {
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(total / parseInt(limit as string)),
          totalItems: total,
          itemsPerPage: parseInt(limit as string)
        }
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('FingershortsController.getAll error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve videos',
        error: process.env.NODE_ENV === 'development' ? message : undefined
      });
    }
  }

  /**
   * Custom method: getById
   * Get single video with full engagement metrics and user context
   */
  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const query = `
        SELECT v.*, u.name as creator_name, u.avatar_url as creator_avatar, u.bio as creator_bio,
               u.followers_count, u.is_verified as creator_verified,
               COALESCE(vpm.total_views, 0) as view_count,
               COALESCE(vpm.engagement_score, 0) as engagement_score,
               COALESCE(vpm.completion_rate, 0) as completion_rate,
               COALESCE(vpm.like_rate, 0) as like_rate,
               COALESCE(vpm.share_rate, 0) as share_rate,
               CASE WHEN EXISTS (
                 SELECT 1 FROM likes WHERE user_id = $2 AND target_id = v.id AND target_type = 'video'
               ) THEN true ELSE false END as is_liked_by_user,
               CASE WHEN EXISTS (
                 SELECT 1 FROM connections 
                 WHERE (sender_id = $2 AND receiver_id = v.creator_id) 
                    OR (sender_id = v.creator_id AND receiver_id = $2)
                 AND status = 'accepted'
               ) THEN true ELSE false END as is_following_creator
        FROM fingershorts_videos v
        JOIN users u ON v.creator_id = u.id
        LEFT JOIN video_performance_metrics vpm ON vpm.video_id = v.id
        WHERE v.id = $1
      `;
      
      const userId = req.user?.id || null;
      const result = await this.db.query<VideoWithMetrics>(query, [id, userId]);

      if (!result.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'Video not found'
        });
        return;
      }

      // Record view if authenticated and not creator's own video
      if (userId && result.rows[0].creator_id !== userId) {
        await this.recordViewWithML(userId, id as string, req.body);
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('FingershortsController.getById error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve video',
        error: process.env.NODE_ENV === 'development' ? message : undefined
      });
    }
  }

  /**
   * Record view with ML tracking
   */
  private async recordViewWithML(userId: string, videoId: string, metadata: ViewMetadata): Promise<void> {

  }

  /**
   * Custom method: create
   * Create new short video with validation and metadata extraction
   */
  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const { 
        title, 
        description, 
        video_url, 
        thumbnail_url, 
        duration, 
        tags, 
        category,
        visibility = 'public',
        allow_comments = true,
        allow_duet = true
      } = req.body;
      
      if (!title || !video_url || !duration) {
        res.status(400).json({
          success: false,
          message: 'Title, video URL, and duration are required'
        });
        return;
      }

      // Validate duration (max 60 seconds for shorts)
      if (parseFloat(duration as string) > 60) {
        res.status(400).json({
          success: false,
          message: 'Video duration must be 60 seconds or less'
        });
        return;
      }

      const query = `
        INSERT INTO fingershorts_videos (
          creator_id, title, description, video_url, thumbnail_url, 
          duration, tags, category, visibility, allow_comments, 
          allow_duet, status, is_published, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending_review', true, NOW(), NOW())
        RETURNING *
      `;
      
      const result = await this.db.query<VideoWithMetrics>(query, [
        userId, 
        title, 
        description || '', 
        video_url, 
        thumbnail_url || null,
        parseFloat(duration as string), 
        JSON.stringify(tags || []), 
        category || null,
        visibility,
        allow_comments,
        allow_duet
      ]);

      res.status(201).json({
        success: true,
        message: 'Video created successfully and pending review',
        data: result.rows[0]
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('FingershortsController.create error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create video',
        error: process.env.NODE_ENV === 'development' ? message : undefined
      });
    }
  }

  /**
   * Custom method: update
   * Update video metadata with ownership verification
   */
  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const { id } = req.params;
      const updates = req.body;
      
      // Verify ownership
      const checkQuery = `SELECT creator_id, status FROM fingershorts_videos WHERE id = $1`;
      const checkResult = await this.db.query(checkQuery, [id]);
      
      if (!checkResult.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'Video not found'
        });
        return;
      }
      
      if (checkResult.rows[0].creator_id !== userId) {
        res.status(403).json({
          success: false,
          message: 'Not authorized to update this video'
        });
        return;
      }

      // Build dynamic update query
      const allowedFields = [
        'title', 'description', 'thumbnail_url', 'tags', 
        'category', 'visibility', 'allow_comments', 'allow_duet'
      ];
      
      const setClauses: string[] = [];
      const values: QueryParams = [];
      let paramIndex = 1;
      
      Object.keys(updates).forEach(key => {
        if (allowedFields.includes(key)) {
          setClauses.push(`${key} = $${paramIndex}`);
          values.push(key === 'tags' ? JSON.stringify(updates[key]) : updates[key]);
          paramIndex++;
        }
      });
      
      if (setClauses.length === 0) {
        res.status(400).json({
          success: false,
          message: 'No valid fields to update'
        });
        return;
      }
      
      setClauses.push(`updated_at = NOW()`);
      values.push(id as string);
      
      const query = `
        UPDATE fingershorts_videos 
        SET ${setClauses.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;
      
      const result = await this.db.query<VideoWithMetrics>(query, values);

      res.json({
        success: true,
        message: 'Video updated successfully',
        data: result.rows[0]
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('FingershortsController.update error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update video',
        error: process.env.NODE_ENV === 'development' ? message : undefined
      });
    }
  }

  /**
   * Custom method: delete
   * Soft delete video with cascade handling
   */
  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const { id } = req.params;
      
      // Verify ownership
      const checkQuery = `SELECT creator_id FROM fingershorts_videos WHERE id = $1`;
      const checkResult = await this.db.query(checkQuery, [id]);
      
      if (!checkResult.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'Video not found'
        });
        return;
      }
      
      if (checkResult.rows[0].creator_id !== userId) {
        res.status(403).json({
          success: false,
          message: 'Not authorized to delete this video'
        });
        return;
      }

      // Soft delete by setting status to deleted
      const query = `
        UPDATE fingershorts_videos 
        SET status = 'deleted', updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await this.db.query<VideoWithMetrics>(query, [id]);

      res.json({
        success: true,
        message: 'Video deleted successfully',
        data: result.rows[0]
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('FingershortsController.delete error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete video',
        error: process.env.NODE_ENV === 'development' ? message : undefined
      });
    }
  }

  /**
   * Custom method: recordView
   * Track video views with deduplication and ML analytics
   * TODO #6: Implement comprehensive view tracking with watch patterns
   */
  async recordView(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const { watch_duration, completion_rate } = req.body;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }
      
      await this.recordViewWithML(userId, id as string, { watch_duration, completion_rate });

      res.json({
        success: true,
        message: 'View recorded with ML tracking'
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('FingershortsController.recordView error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to record view',
        error: process.env.NODE_ENV === 'development' ? message : undefined
      });
    }
  }

  /**
   * Custom method: toggleLike
   * Toggle video like/unlike with ML engagement tracking
   * TODO #7: Track like patterns for preference learning
   */
  async toggleLike(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }
      
      // Check if already liked
      const checkQuery = `SELECT id FROM likes WHERE user_id = $1 AND target_id = $2 AND target_type = 'video'`;
      const checkResult = await this.db.query(checkQuery, [userId, id]);
      
      if (checkResult.rows[0]) {
        // Unlike
        await this.db.query(`DELETE FROM likes WHERE id = $1`, [checkResult.rows[0].id]);
        
        // Update like count cache
        await this.db.query(
          `UPDATE fingershorts_videos SET like_count = GREATEST(like_count - 1, 0) WHERE id = $1`,
          [id]
        );
        
        // Track unlike for ML
        await mlRecommendationService.trackInteraction(userId, id as string, 'unlike');
        
        res.json({
          success: true,
          message: 'Video unliked',
          isLiked: false
        });
      } else {
        // Like
        await this.db.query(
          `INSERT INTO likes (user_id, target_id, target_type, created_at)
           VALUES ($1, $2, 'video', NOW())`,
          [userId, id]
        );
        
        // Update like count cache
        await this.db.query(
          `UPDATE fingershorts_videos SET like_count = like_count + 1 WHERE id = $1`,
          [id]
        );
        
        // Track like for ML
        await mlRecommendationService.trackInteraction(userId, id as string, 'like');
        
        res.json({
          success: true,
          message: 'Video liked',
          isLiked: true
        });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('FingershortsController.toggleLike error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to toggle like',
        error: process.env.NODE_ENV === 'development' ? message : undefined
      });
    }
  }

  /**
   * Get ML algorithm performance metrics (admin endpoint)
   */
  async getAlgorithmMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { timeframe = '24 hours' } = req.query;
      
      const metrics = await mlRecommendationService.getPerformanceMetrics(timeframe as string);
      
      res.json({
        success: true,
        data: metrics
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('FingershortsController.getAlgorithmMetrics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve algorithm metrics',
        error: process.env.NODE_ENV === 'development' ? message : undefined
      });
    }
  }
}

export default new FingershortsController();
