/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';
import unifiedMLService from '../services/UnifiedMLService';

/**
 * MiiController
 * Mii system - Avatar creation, customization, AI-powered recommendations
 * ML-Optimized: Style preference learning, collaborative avatar suggestions, trend analysis with hybrid recommendation engine
 */

class MiiController {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  /**
   * GET /api/mii/recommendations
   * Get personalized avatar recommendations using ML-based hybrid algorithm
   * Combines style similarity, collaborative filtering, and popularity signals
   */
  async getRecommendations(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { limit = 12, offset = 0, style_category, use_ml = true } = req.query;
      
      if (!userId) {
        // Return trending/popular avatars for non-authenticated users
        const trendingQuery = `
          SELECT m.*,
                 COUNT(DISTINCT mu.id) as usage_count,
                 COUNT(DISTINCT ml.id) as like_count,
                 COUNT(DISTINCT ms.id) as save_count,
                 (COUNT(DISTINCT mu.id) * 1.0 + COUNT(DISTINCT ml.id) * 2.0 + COUNT(DISTINCT ms.id) * 3.0) as popularity_score
          FROM mii_avatars m
          LEFT JOIN mii_usage mu ON mu.avatar_id = m.id AND mu.created_at > NOW() - INTERVAL '7 days'
          LEFT JOIN mii_likes ml ON ml.avatar_id = m.id
          LEFT JOIN mii_saves ms ON ms.avatar_id = m.id
          WHERE m.is_public = true AND m.is_active = true
          GROUP BY m.id
          ORDER BY popularity_score DESC, m.created_at DESC
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
        const recommendations = await unifiedMLService.getMiiRecommendations(userId, {
          limit: parseInt(limit as string),
          styleCategory: style_category as string,
          includeMembers: false,
          useML: true
        });
        
        res.json({
          success: true,
          data: recommendations,
          algorithm: 'ml_hybrid_mii_recommendation',
          metadata: {
            strategies_used: ['style_similarity', 'collaborative_filtering', 'popularity_signals'],
            personalization_level: 'high',
            diversity_applied: true,
            style_diversity_threshold: 0.25
          },
          pagination: {
            limit: parseInt(limit as string),
            offset: parseInt(offset as string)
          }
        });
        return;
      }
      
      // Personalized recommendations using ML-ready approach
      const personalizedQuery = `
        WITH user_preferences AS (
          -- Analyze user's avatar interaction history,
          SELECT 
            m.style_category,
            m.color_scheme,
            m.complexity_level,
            COUNT(*) as interaction_count,
            AVG(CASE WHEN mu.interaction_type = 'like' THEN 1 ELSE 0 END) as like_rate
          FROM mii_interactions mi
          JOIN mii_avatars m ON m.id = mi.avatar_id
          LEFT JOIN mii_usage mu ON mu.user_id = mi.user_id AND mu.avatar_id = mi.avatar_id
          WHERE mi.user_id = $1
          GROUP BY m.style_category, m.color_scheme, m.complexity_level
          ORDER BY interaction_count DESC
          LIMIT 5
        ),
        similar_users AS (
          -- Find users with similar avatar preferences (collaborative filtering)
          SELECT DISTINCT mi2.user_id,
                 COUNT(*) as similarity_score
          FROM mii_interactions mi1
          JOIN mii_interactions mi2 ON mi1.avatar_id = mi2.avatar_id
          WHERE mi1.user_id = $1
            AND mi2.user_id != $1
            AND mi2.created_at > NOW() - INTERVAL '30 days'
          GROUP BY mi2.user_id
          ORDER BY similarity_score DESC
          LIMIT 30
        ),
        candidate_avatars AS (
          -- Get avatars used by similar users but not by current user
          SELECT DISTINCT m.*,
                 COUNT(DISTINCT mi.avatar_id) as recommendation_score
          FROM mii_avatars m
          JOIN mii_interactions mi ON mi.avatar_id = m.id
          WHERE mi.user_id IN (SELECT user_id FROM similar_users)
            AND m.id NOT IN (SELECT avatar_id FROM mii_interactions WHERE user_id = $1)
            AND m.is_public = true
            AND m.is_active = true
          GROUP BY m.id
        )
        SELECT ca.*,
               CASE 
                 WHEN ca.style_category IN (SELECT style_category FROM user_preferences) THEN 2.0
                 ELSE 1.0
               END as style_match_multiplier,
               CASE 
                 WHEN ca.color_scheme IN (SELECT color_scheme FROM user_preferences) THEN 1.5
                 ELSE 1.0
               END as color_match_multiplier
        FROM candidate_avatars ca
        ${style_category ? 'WHERE ca.style_category = $2' : ''}
        ORDER BY (recommendation_score * style_match_multiplier * color_match_multiplier) DESC,
                 ca.popularity_score DESC
        LIMIT $${style_category ? 3 : 2} OFFSET $${style_category ? 4 : 3}
      `;
      
      const params: any[] = [userId, parseInt(limit as string), parseInt(offset as string)];
      if (style_category) {
        params.splice(1, 0, style_category);
      }
      
      const result = await this.db.query(personalizedQuery, params);

      // Track recommendation impressions
      if (result.rows.length > 0) {
        await this.trackImpressions(userId, result.rows.map(r => r.id));
      }

      res.json({
        success: true,
        data: result.rows,
        algorithm: 'hybrid_collaborative_style',
        metadata: {
          personalization_factors: [
            'style_category_preference',
            'color_scheme_preference',
            'collaborative_filtering',
            'popularity_boost'
          ],
          similar_users_analyzed: 30,
          user_preferences_considered: 5
        },
        pagination: {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string)
        }
      });
    } catch (error) {
      logger.error('MiiController.getRecommendations error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve avatar recommendations',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/mii/trending-styles
   * Get trending avatar styles and customization trends
   */
  async getTrendingStyles(req: Request, res: Response): Promise<void> {
    try {
      const { hours = 168, limit = 10 } = req.query; // Default 7 days
      
      // Validate and sanitize inputs
      const parsedHours = Math.max(1, Math.min(2160, parseInt(hours as string) || 168)); // Max 90 days
      const parsedLimit = Math.max(1, Math.min(50, parseInt(limit as string) || 10));
      
      const query = `
        SELECT 
          m.style_category,
          m.color_scheme,
          m.complexity_level,
          COUNT(DISTINCT mi.id) as total_interactions,
          COUNT(DISTINCT mu.id) as recent_usage,
          COUNT(DISTINCT CASE WHEN mi.interaction_type = 'like' THEN mi.id END) as likes,
          COUNT(DISTINCT CASE WHEN mi.interaction_type = 'save' THEN mi.id END) as saves,
          -- Trending score with time decay
          SUM(
            CASE 
              WHEN mi.created_at > NOW() - INTERVAL '1 day' THEN 5.0
              WHEN mi.created_at > NOW() - INTERVAL '3 days' THEN 3.0
              WHEN mi.created_at > NOW() - INTERVAL '7 days' THEN 2.0
              ELSE 1.0
            END
          ) as trending_score
        FROM mii_avatars m
        JOIN mii_interactions mi ON mi.avatar_id = m.id
          AND mi.created_at > NOW() - INTERVAL $1 || ' hours'
        LEFT JOIN mii_usage mu ON mu.avatar_id = m.id
          AND mu.created_at > NOW() - INTERVAL $1 || ' hours'
        WHERE m.is_active = true
        GROUP BY m.style_category, m.color_scheme, m.complexity_level
        HAVING COUNT(DISTINCT mi.id) >= 5
        ORDER BY trending_score DESC
        LIMIT $2
      `;
      
      const result = await this.db.query(query, [parsedHours.toString(), parsedLimit]);

      // Get emerging trends (fastest growing)
      const emergingTrendsQuery = `
        SELECT 
          m.style_category,
          COUNT(DISTINCT mi.id) as recent_count,
          COUNT(DISTINCT mi_old.id) as previous_count,
          CASE 
            WHEN COUNT(DISTINCT mi_old.id) > 0 
            THEN ((COUNT(DISTINCT mi.id)::float - COUNT(DISTINCT mi_old.id)) / COUNT(DISTINCT mi_old.id)) * 100
            ELSE 100
          END as growth_percentage
        FROM mii_avatars m
        JOIN mii_interactions mi ON mi.avatar_id = m.id
          AND mi.created_at > NOW() - INTERVAL '3 days'
        LEFT JOIN mii_interactions mi_old ON mi_old.avatar_id = m.id
          AND mi_old.created_at BETWEEN NOW() - INTERVAL '6 days' AND NOW() - INTERVAL '3 days'
        WHERE m.is_active = true
        GROUP BY m.style_category
        HAVING COUNT(DISTINCT mi.id) >= 3
        ORDER BY growth_percentage DESC
        LIMIT 5
      `;
      
      const emergingResult = await this.db.query(emergingTrendsQuery);

      res.json({
        success: true,
        trending_styles: result.rows,
        emerging_trends: emergingResult.rows,
        algorithm: 'time_decay_growth_analysis',
        metadata: {
          time_window_hours: parsedHours,
          minimum_interactions: 5,
          scoring_weights: {
            'last_24h': 5.0,
            'last_3d': 3.0,
            'last_7d': 2.0,
            'older': 1.0
          }
        }
      });
    } catch (error) {
      logger.error('MiiController.getTrendingStyles error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve trending styles',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/mii/style-categories
   * Get available style categories with popularity metrics
   */
  async getStyleCategories(req: Request, res: Response): Promise<void> {
    try {
      const query = `
        SELECT ,
          style_category,
          COUNT(*) as avatar_count,
          COUNT(DISTINCT creator_id) as creator_count,
          AVG(popularity_score) as avg_popularity,
          MAX(created_at) as latest_addition
        FROM mii_avatars
        WHERE is_active = true
        GROUP BY style_category
        ORDER BY avatar_count DESC
      `;
      
      const result = await this.db.query(query);

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      logger.error('MiiController.getStyleCategories error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve style categories',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/mii/metrics/algorithm
   * Get algorithm performance metrics for Mii recommendations
   */
  async getAlgorithmMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { timeframe = '24h' } = req.query;
      
      const metrics = await unifiedMLService.getAlgorithmMetrics('mii', timeframe as string);
      
      res.json({
        success: true,
        data: metrics,
        feed_type: 'mii'
      });
    } catch (error) {
      logger.error('MiiController.getAlgorithmMetrics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve algorithm metrics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/mii/track-interaction
   * Track user interaction for ML training
   */
  async trackInteraction(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { item_id, interaction_type, metadata } = req.body;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }
      
      await unifiedMLService.trackInteraction(userId, item_id, interaction_type, {
        ...metadata,
        feed_type: 'mii'
      });
      
      res.json({
        success: true,
        message: 'Interaction tracked successfully'
      });
    } catch (error) {
      logger.error('MiiController.trackInteraction error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to track interaction',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * Custom method: getAll
   * Get all avatars with advanced filtering
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { 
        page = 1, 
        limit = 20, 
        style_category, 
        color_scheme,
        complexity_level,
        creator_id,
        is_public,
        sort_by = 'popularity',
        order = 'DESC'
      } = req.query;
      
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      
      let query = `
        SELECT m.*,
               u.name as creator_name,
               u.avatar_url as creator_avatar,
               COUNT(DISTINCT mu.id) as usage_count,
               COUNT(DISTINCT ml.id) as like_count
        FROM mii_avatars m
        LEFT JOIN users u ON u.id = m.creator_id
        LEFT JOIN mii_usage mu ON mu.avatar_id = m.id
        LEFT JOIN mii_likes ml ON ml.avatar_id = m.id
      `;
      
      const conditions: string[] = ['m.is_active = true'];
      const params: any[] = [];
      let paramIndex = 1;
      
      if (style_category) {
        conditions.push(`m.style_category = $${paramIndex}`);
        params.push(style_category);
        paramIndex++;
      }
      
      if (color_scheme) {
        conditions.push(`m.color_scheme = $${paramIndex}`);
        params.push(color_scheme);
        paramIndex++;
      }
      
      if (complexity_level) {
        conditions.push(`m.complexity_level = $${paramIndex}`);
        params.push(complexity_level);
        paramIndex++;
      }
      
      if (creator_id) {
        conditions.push(`m.creator_id = $${paramIndex}`);
        params.push(creator_id);
        paramIndex++;
      }
      
      if (is_public !== undefined) {
        conditions.push(`m.is_public = $${paramIndex}`);
        params.push(is_public === 'true');
        paramIndex++;
      }
      
      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }
      
      query += ` GROUP BY m.id, u.name, u.avatar_url`;
      
      // Dynamic sorting
      const validSortFields = ['created_at', 'usage_count', 'like_count', 'popularity_score'];
      const sortField = validSortFields.includes(sort_by as string) ? sort_by : 'popularity_score';
      const sortOrder = order === 'ASC' ? 'ASC' : 'DESC';
      
      query += ` ORDER BY ${sortField} ${sortOrder}`;
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(parseInt(limit as string), offset);
      
      const result = await this.db.query(query, params);
      
      // Get total count
      let countQuery = `SELECT COUNT(*) as total FROM mii_avatars m WHERE m.is_active = true`;
      const countParams: any[] = [];
      let countParamIndex = 1;
      
      if (style_category) {
        countQuery += ` AND m.style_category = $${countParamIndex}`;
        countParams.push(style_category);
        countParamIndex++;
      }
      
      if (color_scheme) {
        countQuery += ` AND m.color_scheme = $${countParamIndex}`;
        countParams.push(color_scheme);
        countParamIndex++;
      }
      
      if (creator_id) {
        countQuery += ` AND m.creator_id = $${countParamIndex}`;
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
      logger.error('MiiController.getAll error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve avatars',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * Custom method: getById
   * Get single avatar with full details and engagement metrics
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      
      const query = `
        SELECT m.*,
               u.name as creator_name,
               u.avatar_url as creator_avatar,
               u.bio as creator_bio,
               COUNT(DISTINCT mu.id) as usage_count,
               COUNT(DISTINCT ml.id) as like_count,
               COUNT(DISTINCT ms.id) as save_count,
               CASE WHEN EXISTS (
                 SELECT 1 FROM mii_likes WHERE user_id = $2 AND avatar_id = m.id
               ) THEN true ELSE false END as is_liked_by_user,
               CASE WHEN EXISTS (
                 SELECT 1 FROM mii_saves WHERE user_id = $2 AND avatar_id = m.id
               ) THEN true ELSE false END as is_saved_by_user
        FROM mii_avatars m
        LEFT JOIN users u ON u.id = m.creator_id
        LEFT JOIN mii_usage mu ON mu.avatar_id = m.id
        LEFT JOIN mii_likes ml ON ml.avatar_id = m.id
        LEFT JOIN mii_saves ms ON ms.avatar_id = m.id
        WHERE m.id = $1
        GROUP BY m.id, u.name, u.avatar_url, u.bio
      `;
      
      const result = await this.db.query(query, [id, userId || null]);

      if (!result.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'Avatar not found'
        });
        return;
      }

      // Track view if authenticated
      if (userId) {
        await this.db.query(
          `INSERT INTO mii_interactions (user_id, avatar_id, interaction_type, created_at)
           VALUES ($1, $2, 'view', NOW())`,
          [userId, id]
        );
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('MiiController.getById error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve avatar',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/mii/create
   * Create new avatar with validation
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const {
        name,
        style_category,
        color_scheme,
        complexity_level,
        components,
        is_public = true,
        tags
      } = req.body;
      
      if (!name || !style_category || !components) {
        res.status(400).json({
          success: false,
          message: 'Name, style_category, and components are required'
        });
        return;
      }

      const query = `
        INSERT INTO mii_avatars (
          creator_id, name, style_category, color_scheme, complexity_level,
          components_data, tags, is_public, is_active, popularity_score,
          created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, 0, NOW(), NOW())
        RETURNING *
      `;
      
      const result = await this.db.query(query, [
        userId,
        name,
        style_category,
        color_scheme || 'default',
        complexity_level || 'medium',
        JSON.stringify(components),
        JSON.stringify(tags || []),
        is_public
      ]);

      res.status(201).json({
        success: true,
        message: 'Avatar created successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('MiiController.create error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create avatar',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * PUT /api/mii/:id
   * Update avatar with ownership verification
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
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
      const checkQuery = `SELECT creator_id FROM mii_avatars WHERE id = $1`;
      const checkResult = await this.db.query(checkQuery, [id]);
      
      if (!checkResult.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'Avatar not found'
        });
        return;
      }
      
      if (checkResult.rows[0].creator_id !== userId) {
        res.status(403).json({
          success: false,
          message: 'Not authorized to update this avatar'
        });
        return;
      }

      // Build dynamic update query
      const allowedFields = [
        'name', 'style_category', 'color_scheme', 'complexity_level',
        'components_data', 'tags', 'is_public'
      ];
      
      const setClauses: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;
      
      Object.keys(updates).forEach(key => {
        if (allowedFields.includes(key)) {
          setClauses.push(`${key} = $${paramIndex}`);
          values.push(
            ['components_data', 'tags'].includes(key) 
              ? JSON.stringify(updates[key]) 
              : updates[key]
          );
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
      values.push(id);
      
      const query = `
        UPDATE mii_avatars 
        SET ${setClauses.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;
      
      const result = await this.db.query(query, values);

      res.json({
        success: true,
        message: 'Avatar updated successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('MiiController.update error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update avatar',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * Helper: Track recommendation impressions
   */
  private async trackImpressions(userId: string, avatarIds: string[]): Promise<void> {
    try {
      const values = avatarIds.map((avatarId, index) => 
        `($1, $${index + 2} 'impression', NOW())`
      ).join(', ');
      
      const params = [userId, ...avatarIds];
      
      await this.db.query(
        `INSERT INTO mii_interactions (user_id, avatar_id, interaction_type, created_at)
         VALUES ${values}`,
        params
      );
    } catch (error) {
      logger.error('trackImpressions error:', error);
    }
  }
}

export default new MiiController();
