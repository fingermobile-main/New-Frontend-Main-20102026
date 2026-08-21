/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';
import unifiedMLService from '../services/UnifiedMLService';

/**
 * DiscoverController
 * Discovery engine - Content recommendations, trending items, personalized suggestions
 * ML-Optimized: Hybrid recommendation engine with collaborative filtering, content-based matching, and engagement prediction
 */

class DiscoverController {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  /**
   * GET /api/discover/personalized
   * Get personalized recommendations using ML-based hybrid algorithm
   * Combines collaborative filtering, content-based matching, and engagement prediction
   */
  async getPersonalized(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { limit = 20, offset = 0, category, content_type, use_ml = true } = req.query;
      
      if (!userId) {
        // Return trending/popular content for non-authenticated users
        const trendingQuery = `
          SELECT d.*, 
                 COUNT(DISTINCT di.item_id) as interaction_count,
                 COUNT(DISTINCT CASE WHEN di.interaction_type = 'view' THEN di.id END) as view_count,
                 COUNT(DISTINCT CASE WHEN di.interaction_type = 'like' THEN di.id END) as like_count,
                 COUNT(DISTINCT CASE WHEN di.interaction_type = 'share' THEN di.id END) as share_count
          FROM discover_items d
          LEFT JOIN discover_interactions di ON di.item_id = d.id 
            AND di.created_at > NOW() - INTERVAL '7 days'
          WHERE d.is_active = true
          GROUP BY d.id
          ORDER BY (interaction_count * 1.0 + view_count * 0.3 + like_count * 1.5 + share_count * 2.0) DESC,
                   d.created_at DESC
          LIMIT $1 OFFSET $2
        `;
        
        const result = await this.db.query(trendingQuery, [parseInt(limit as string), parseInt(offset as string)]);
        
        res.json({
          success: true,
          data: result.rows,
          algorithm: 'trending_popular',
          pagination: {
            limit: parseInt(limit as string),
            offset: parseInt(offset as string)
          }
        });
        return;
      }
      
      // Use ML-based personalized recommendations
      if (use_ml === 'true') {
        const recommendations = await unifiedMLService.getDiscoverRecommendations(userId, {
          limit: parseInt(limit as string),
          category: category as string,
          contentType: content_type as string,
          useML: true
        });
        
        res.json({
          success: true,
          data: recommendations,
          algorithm: 'ml_hybrid_recommendation',
          metadata: {
            strategies_used: ['collaborative_filtering', 'content_based', 'engagement_prediction', 'trending'],
            personalization_level: 'high',
            diversity_applied: true
          },
          pagination: {
            limit: parseInt(limit as string),
            offset: parseInt(offset as string)
          }
        });
        return;
      }
      
      // Personalized recommendations for authenticated users
      const personalizedQuery = `
        WITH user_history AS (
          -- Get user's interaction history,
          SELECT 
            di.item_id,
            di.interaction_type,
            di.created_at,
            d.category,
            d.content_type,
            d.tags
          FROM discover_interactions di
          JOIN discover_items d ON d.id = di.item_id
          WHERE di.user_id = $1
          ORDER BY di.created_at DESC
          LIMIT 100
        ),
        similar_users AS (
          -- Find users with similar interaction patterns (collaborative filtering)
          SELECT DISTINCT di2.user_id
          FROM discover_interactions di1
          JOIN discover_interactions di2 ON di1.item_id = di2.item_id
          WHERE di1.user_id = $1
            AND di2.user_id != $1
            AND di2.created_at > NOW() - INTERVAL '30 days'
          LIMIT 50
        ),
        candidate_items AS (
          -- Get items interacted by similar users but not by current user
          SELECT DISTINCT d.*,
                 COUNT(DISTINCT di.item_id) as similarity_score
          FROM discover_items d
          JOIN discover_interactions di ON di.item_id = d.id
          WHERE di.user_id IN (SELECT user_id FROM similar_users)
            AND d.id NOT IN (SELECT item_id FROM user_history)
            AND d.is_active = true
          GROUP BY d.id
        )
        SELECT ci.*,
               CASE 
                 WHEN ci.category IN (SELECT DISTINCT category FROM user_history) THEN 2
                 ELSE 1
               END as category_match_score,
               CASE 
                 WHEN ci.content_type IN (SELECT DISTINCT content_type FROM user_history) THEN 1.5
                 ELSE 1
               END as type_match_score
        FROM candidate_items ci
        ORDER BY (similarity_score * 1.0 * category_match_score * type_match_score) DESC,
                 ci.created_at DESC
        LIMIT $2 OFFSET $3
      `;
      
      const result = await this.db.query(personalizedQuery, [
        userId, 
        parseInt(limit as string), 
        parseInt(offset as string)
      ]);

      // Track recommendation impression for ML training
      if (result.rows.length > 0) {
        await this.trackRecommendationImpressions(userId, result.rows.map(r => r.id));
      }

      res.json({
        success: true,
        data: result.rows,
        algorithm: 'hybrid_collaborative_content',
        metadata: {
          user_interactions_analyzed: 100,
          similar_users_count: 50,
          personalization_factors: ['collaborative_filtering', 'category_preference', 'content_type_preference']
        },
        pagination: {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string)
        }
      });
    } catch (error) {
      logger.error('DiscoverController.getPersonalized error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve personalized recommendations',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/discover/trending
   * Get trending content with time-decay scoring
   */
  async getTrending(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 20, hours = 24, category, min_score = 10 } = req.query;
      
      // Validate and sanitize inputs
      const parsedHours = Math.max(1, Math.min(720, parseInt(hours as string) || 24)); // Max 30 days
      const parsedLimit = Math.max(1, Math.min(100, parseInt(limit as string) || 20));
      const parsedMinScore = Math.max(0, parseInt(min_score as string) || 10);
      
      const query = `
        SELECT d.*,
               COUNT(DISTINCT di.id) as total_interactions,
               COUNT(DISTINCT CASE WHEN di.interaction_type = 'view' THEN di.id END) as views,
               COUNT(DISTINCT CASE WHEN di.interaction_type = 'like' THEN di.id END) as likes,
               COUNT(DISTINCT CASE WHEN di.interaction_type = 'share' THEN di.id END) as shares,
               COUNT(DISTINCT CASE WHEN di.interaction_type = 'comment' THEN di.id END) as comments,
               -- Time-decay weighted score (recent interactions weighted higher)
               SUM(
                 CASE 
                   WHEN di.created_at > NOW() - INTERVAL '1 hour' THEN 4.0
                   WHEN di.created_at > NOW() - INTERVAL '6 hours' THEN 3.0
                   WHEN di.created_at > NOW() - INTERVAL '12 hours' THEN 2.0
                   WHEN di.created_at > NOW() - INTERVAL '24 hours' THEN 1.5
                   ELSE 1.0
                 END
               ) as time_weighted_score
        FROM discover_items d
        LEFT JOIN discover_interactions di ON di.item_id = d.id 
          AND di.created_at > NOW() - INTERVAL $2 || ' hours'
        WHERE d.is_active = true
        ${category ? 'AND d.category = $3' : ''}
        GROUP BY d.id
        HAVING COUNT(DISTINCT di.id) >= $4
        ORDER BY time_weighted_score DESC, total_interactions DESC
        LIMIT $1
      `;
      
      const params: any[] = [parsedLimit, parsedHours.toString(), parsedMinScore];
      if (category) {
        params.splice(2, 0, category);
      }
      
      const result = await this.db.query(query, params);

      res.json({
        success: true,
        data: result.rows,
        algorithm: 'time_decay_trending',
        metadata: {
          time_window_hours: parsedHours,
          minimum_interactions: parsedMinScore,
          scoring_weights: {
            'last_1_hour': 4.0,
            'last_6_hours': 3.0,
            'last_12_hours': 2.0,
            'last_24_hours': 1.5,
            'older': 1.0
          }
        }
      });
    } catch (error) {
      logger.error('DiscoverController.getTrending error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve trending content',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/discover/categories/:category
   * Get content filtered by category with sub-category exploration
   */
  async getByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const { limit = 20, offset = 0, sort_by = 'popularity', user_id } = req.query;
      
      let orderByClause = 'd.created_at DESC';
      
      switch (sort_by) {
        case 'popularity':
          orderByClause = `(
            SELECT COUNT(*) FROM discover_interactions WHERE item_id = d.id
          ) DESC`;
          break;
        case 'recent':
          orderByClause = 'd.created_at DESC';
          break;
        case 'engagement_rate':
          orderByClause = `(
            SELECT COUNT(*)::float / NULLIF(EXTRACT(EPOCH FROM (NOW() - d.created_at)) / 3600, 0)
            FROM discover_interactions WHERE item_id = d.id
          ) DESC`;
          break;
      }
      
      const query = `
        SELECT d.*,
               u.name as creator_name,
               u.avatar_url as creator_avatar,
               COUNT(DISTINCT di.id) as interaction_count,
               AVG(CASE WHEN di.interaction_type = 'view' THEN 1 ELSE 0 END) as view_rate
        FROM discover_items d
        LEFT JOIN users u ON u.id = d.creator_id
        LEFT JOIN discover_interactions di ON di.item_id = d.id
        WHERE d.is_active = true
          AND d.category = $1
        GROUP BY d.id, u.name, u.avatar_url
        ORDER BY ${orderByClause}
        LIMIT $2 OFFSET $3
      `;
      
      const result = await this.db.query(query, [
        category,
        parseInt(limit as string),
        parseInt(offset as string)
      ]);

      // Get related categories for exploration
      const relatedCategoriesQuery = `
        SELECT DISTINCT category, COUNT(*) as item_count
        FROM discover_items
        WHERE is_active = true
          AND category != $1
        GROUP BY category
        ORDER BY item_count DESC
        LIMIT 5
      `;
      
      const relatedResult = await this.db.query(relatedCategoriesQuery, [category]);

      res.json({
        success: true,
        data: result.rows,
        related_categories: relatedResult.rows,
        metadata: {
          category,
          sort_by,
          total_results: result.rows.length
        },
        pagination: {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string)
        }
      });
    } catch (error) {
      logger.error('DiscoverController.getByCategory error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve category content',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/discover/metrics/algorithm
   * Get algorithm performance metrics for Discover feed
   */
  async getAlgorithmMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { timeframe = '24h' } = req.query;
      
      const metrics = await unifiedMLService.getAlgorithmMetrics('discover', timeframe as string);
      
      res.json({
        success: true,
        data: metrics,
        feed_type: 'discover'
      });
    } catch (error) {
      logger.error('DiscoverController.getAlgorithmMetrics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve algorithm metrics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/discover/track-interaction
   * Track user interaction for ML training
   */
  async trackInteraction(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { item_id, interaction_type, duration, metadata } = req.body;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }
      
      await unifiedMLService.trackInteraction(userId, item_id, interaction_type, {
        duration,
        ...metadata,
        feed_type: 'discover'
      });
      
      res.json({
        success: true,
        message: 'Interaction tracked successfully'
      });
    } catch (error) {
      logger.error('DiscoverController.trackInteraction error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to track interaction',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * Custom method: getAll
   * Get all discoverable items with advanced filtering
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { 
        page = 1, 
        limit = 20, 
        category, 
        content_type, 
        creator_id,
        min_interactions,
        sort_by = 'created_at',
        order = 'DESC'
      } = req.query;
      
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      
      let query = `
        SELECT d.*,
               u.name as creator_name,
               u.avatar_url as creator_avatar,
               COUNT(DISTINCT di.id) as interaction_count
        FROM discover_items d
        LEFT JOIN users u ON u.id = d.creator_id
        LEFT JOIN discover_interactions di ON di.item_id = d.id
      `;
      
      const conditions: string[] = ['d.is_active = true'];
      const params: any[] = [];
      let paramIndex = 1;
      
      if (category) {
        conditions.push(`d.category = $${paramIndex}`);
        params.push(category);
        paramIndex++;
      }
      
      if (content_type) {
        conditions.push(`d.content_type = $${paramIndex}`);
        params.push(content_type);
        paramIndex++;
      }
      
      if (creator_id) {
        conditions.push(`d.creator_id = $${paramIndex}`);
        params.push(creator_id);
        paramIndex++;
      }
      
      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }
      
      query += ` GROUP BY d.id, u.name, u.avatar_url`;
      
      // Dynamic sorting
      const validSortFields = ['created_at', 'interaction_count', 'title'];
      const sortField = validSortFields.includes(sort_by as string) ? sort_by : 'created_at';
      const sortOrder = order === 'ASC' ? 'ASC' : 'DESC';
      
      if (min_interactions) {
        query += ` HAVING COUNT(DISTINCT di.id) >= $${paramIndex}`;
        params.push(parseInt(min_interactions as string));
        paramIndex++;
      }
      
      query += ` ORDER BY ${sortField} ${sortOrder}`;
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(parseInt(limit as string), offset);
      
      const result = await this.db.query(query, params);
      
      // Get total count
      let countQuery = `SELECT COUNT(*) as total FROM discover_items d WHERE d.is_active = true`;
      const countParams: any[] = [];
      let countParamIndex = 1;
      
      if (category) {
        countQuery += ` AND d.category = $${countParamIndex}`;
        countParams.push(category);
        countParamIndex++;
      }
      
      if (content_type) {
        countQuery += ` AND d.content_type = $${countParamIndex}`;
        countParams.push(content_type);
        countParamIndex++;
      }
      
      if (creator_id) {
        countQuery += ` AND d.creator_id = $${countParamIndex}`;
        countParams.push(creator_id);
        countParamIndex++;
      }
      
      const countResult = await this.db.query(countQuery, countParams);
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
    } catch (error) {
      logger.error('DiscoverController.getAll error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve discover items',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * Custom method: getById
   * Get single discover item with engagement metrics
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      
      const query = `
        SELECT d.*,
               u.name as creator_name,
               u.avatar_url as creator_avatar,
               u.bio as creator_bio,
               COUNT(DISTINCT di.id) as total_interactions,
               COUNT(DISTINCT CASE WHEN di.interaction_type = 'view' THEN di.id END) as views,
               COUNT(DISTINCT CASE WHEN di.interaction_type = 'like' THEN di.id END) as likes,
               COUNT(DISTINCT CASE WHEN di.interaction_type = 'share' THEN di.id END) as shares,
               CASE WHEN EXISTS (
                 SELECT 1 FROM discover_interactions 
                 WHERE user_id = $2 AND item_id = d.id AND interaction_type = 'like'
               ) THEN true ELSE false END as is_liked_by_user
        FROM discover_items d
        LEFT JOIN users u ON u.id = d.creator_id
        LEFT JOIN discover_interactions di ON di.item_id = d.id
        WHERE d.id = $1
        GROUP BY d.id, u.name, u.avatar_url, u.bio
      `;
      
      const result = await this.db.query(query, [id, userId || null]);

      if (!result.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'Discover item not found'
        });
        return;
      }

      // Track view if authenticated
      if (userId) {
        await this.db.query(
          `INSERT INTO discover_interactions (user_id, item_id, interaction_type, created_at)
           VALUES ($1, $2, 'view', NOW())`,
          [userId, id]
        );
        
        // Also track in unified ML system
        await unifiedMLService.trackInteraction(userId, id as string, 'view', { feed_type: 'discover' });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('DiscoverController.getById error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve discover item',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * Helper: Track recommendation impressions for ML training
   */
  private async trackRecommendationImpressions(userId: string, itemIds: string[]): Promise<void> {
    try {
      const values = itemIds.map((itemId, index) => 
        `($1, $${index + 2} 'impression', NOW())`
      ).join(', ');
      
      const params = [userId, ...itemIds];
      
      await this.db.query(
        `INSERT INTO discover_interactions (user_id, item_id, interaction_type, created_at)
         VALUES ${values}`,
        params
      );
    } catch (error) {
      logger.error('trackRecommendationImpressions error:', error);
      // Don't fail the request if tracking fails
    }
  }
}

export default new DiscoverController();
