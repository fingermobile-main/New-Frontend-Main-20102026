import { Pool } from 'pg';
import logger from '../utils/logger';

/**
 * Unified ML Recommendation Service
 * Provides ML-based optimization for Discover, Mii, and Canary feeds
 * Implements hybrid recommendation engines with real-time learning
 */

interface UserProfile {
  userId: string;
  preferences: Record<string, number>;
  interactionHistory: InteractionRecord[];
  engagementPatterns: EngagementMetrics;
}

interface InteractionRecord {
  itemId: string;
  interactionType: string;
  timestamp: Date;
  duration?: number;
  metadata?: any;
}

interface EngagementMetrics {
  likeRate: number;
  shareRate: number;
  commentRate: number;
  skipRate: number;
  avgWatchTime: number;
}

interface RecommendationCandidate {
  id: string;
  score: number;
  strategy: string;
  metadata?: any;
}

class UnifiedMLService {
  private db: Pool;
  private cache: Map<string, any>;
  private cacheTTL: number = 300000; // 5 minutes

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });
    this.cache = new Map();
  }

  /**
   * DISCOVER FEED OPTIMIZATION
   * Get personalized content recommendations using hybrid ML approach
   */
  async getDiscoverRecommendations(userId: string, options: {
    limit?: number;
    category?: string;
    contentType?: string;
    useML?: boolean;
  } = {}): Promise<any[]> {
    const { limit = 20, category, contentType, useML = true } = options;

    if (!useML) {
      return this.getBasicRecommendations(userId, limit);
    }

    try {
      // Step 1: Build user profile from interaction history
      const userProfile = await this.buildUserProfile(userId);

      // Step 2: Get candidate items from multiple strategies
      const candidates = await this.getDiscoverCandidates(userId, userProfile, limit * 3);

      // Step 3: Score candidates using ML model
      const scoredItems = await this.scoreDiscoverItems(candidates, userProfile);

      // Step 4: Apply diversity constraints
      const diversifiedItems = this.applyDiversity(scoredItems, limit);

      // Step 5: Track impressions for ML training
      await this.trackImpressions(userId, diversifiedItems.map(i => i.id));

      return diversifiedItems;
    } catch (error) {
      logger.error('getDiscoverRecommendations error:', error);
      return this.getBasicRecommendations(userId, limit);
    }
  }

  /**
   * MII FEED OPTIMIZATION
   * Get personalized avatar/member recommendations
   */
  async getMiiRecommendations(userId: string, options: {
    limit?: number;
    styleCategory?: string;
    includeMembers?: boolean;
    useML?: boolean;
  } = {}): Promise<any[]> {
    const { limit = 12, styleCategory, includeMembers = false, useML = true } = options;

    if (!useML) {
      return this.getBasicMiiRecommendations(userId, limit);
    }

    try {
      // Step 1: Analyze user's avatar preferences
      const miiProfile = await this.buildMiiUserProfile(userId);

      // Step 2: Find similar users (collaborative filtering)
      const similarUsers = await this.findSimilarMiiUsers(userId, 20);

      // Step 3: Get candidate avatars/members
      const candidates = await this.getMiiCandidates(userId, miiProfile, similarUsers, limit * 2);

      // Step 4: Score using style similarity + collaborative signals
      const scoredItems = await this.scoreMiiItems(candidates, miiProfile);

      // Step 5: Apply diversity and freshness
      const diversifiedItems = this.applyMiiDiversity(scoredItems, limit);

      return diversifiedItems;
    } catch (error) {
      logger.error('getMiiRecommendations error:', error);
      return this.getBasicMiiRecommendations(userId, limit);
    }
  }

  /**
   * CANARY FEED OPTIMIZATION
   * Get trending/viral content with velocity-based scoring
   */
  async getCanaryRecommendations(options: {
    limit?: number;
    timeframe?: string;
    category?: string;
    minVelocity?: number;
    useML?: boolean;
  } = {}): Promise<any[]> {
    const { limit = 20, timeframe = '24h', category, minVelocity = 0, useML = true } = options;

    if (!useML) {
      return this.getBasicTrendingContent(limit, timeframe);
    }

    try {
      // Step 1: Calculate engagement velocity for all recent content
      const velocityData = await this.calculateEngagementVelocity(timeframe, category);

      // Step 2: Predict viral potential using ML model
      const viralPredictions = await this.predictViralPotential(velocityData);

      // Step 3: Rank by predicted virality + recency
      const rankedItems = this.rankByVirality(viralPredictions, limit);

      // Step 4: Apply category diversity
      const diversifiedItems = this.applyCategoryDiversity(rankedItems, limit);

      return diversifiedItems;
    } catch (error) {
      logger.error('getCanaryRecommendations error:', error);
      return this.getBasicTrendingContent(limit, timeframe);
    }
  }

  /**
   * Track user interactions for continuous learning
   */
  async trackInteraction(userId: string, itemId: string, interactionType: string, metadata?: any): Promise<void> {
    try {
      const query = `
        INSERT INTO ml_interactions (user_id, item_id, interaction_type, metadata, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (user_id, item_id, interaction_type) 
        DO UPDATE SET count = ml_interactions.count + 1, updated_at = NOW()
      `;
      
      await this.db.query(query, [userId, itemId, interactionType, JSON.stringify(metadata || {})]);

      // Update user preference profile asynchronously
      this.updateUserPreferencesAsync(userId);
    } catch (error) {
      logger.error('trackInteraction error:', error);
    }
  }

  /**
   * Get performance metrics for algorithm optimization
   */
  async getAlgorithmMetrics(feedType: string, timeframe: string = '24h'): Promise<any> {
    const cacheKey = `metrics:${feedType}:${timeframe}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    try {
      const query = `
        SELECT 
          COUNT(*) as total_recommendations,
          COUNT(DISTINCT user_id) as unique_users,
          AVG(CASE WHEN interaction_type IN ('click', 'view') THEN 1 ELSE 0 END) as ctr,
          AVG(CASE WHEN interaction_type = 'like' THEN 1 ELSE 0 END) as like_rate,
          AVG(CASE WHEN interaction_type = 'share' THEN 1 ELSE 0 END) as share_rate
        FROM ml_interactions
        WHERE feed_type = $1
          AND created_at > NOW() - INTERVAL '${timeframe}'
      `;

      const result = await this.db.query(query, [feedType]);
      const metrics = result.rows[0] || {};

      this.cache.set(cacheKey, { data: metrics, timestamp: Date.now() });

      return {
        feed_type: feedType,
        timeframe,
        ...metrics
      };
    } catch (error) {
      logger.error('getAlgorithmMetrics error:', error);
      return { feed_type: feedType, error: 'Failed to retrieve metrics' };
    }
  }

  // ==================== PRIVATE HELPER METHODS ====================

  /**
   * Build user preference profile from interaction history
   */
  private async buildUserProfile(userId: string): Promise<UserProfile> {
    const query = `
      WITH user_interactions AS (
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
        LIMIT 200
      )
      SELECT 
        category,
        content_type,
        COUNT(*) as interaction_count,
        AVG(CASE WHEN interaction_type = 'like' THEN 1 ELSE 0 END) as like_rate,
        AVG(CASE WHEN interaction_type = 'view' AND duration > 30 THEN 1 ELSE 0 END) as completion_rate
      FROM user_interactions
      GROUP BY category, content_type
      ORDER BY interaction_count DESC
    `;

    const result = await this.db.query(query, [userId]);
    
    const preferences: Record<string, number> = {};
    const history: InteractionRecord[] = [];
    
    result.rows.forEach(row => {
      preferences[row.category] = parseFloat(row.like_rate) * 0.6 + parseFloat(row.completion_rate) * 0.4;
    });

    return {
      userId,
      preferences,
      interactionHistory: history,
      engagementPatterns: await this.calculateEngagementPatterns(userId)
    };
  }

  /**
   * Get candidate items using multiple discovery strategies
   */
  private async getDiscoverCandidates(userId: string, profile: UserProfile, limit: number): Promise<any[]> {
    const candidates: any[] = [];

    // Strategy 1: Collaborative filtering - items liked by similar users
    const collabQuery = `
      SELECT DISTINCT d.*, COUNT(*) as similarity_score
      FROM discover_items d
      JOIN discover_interactions di ON di.item_id = d.id
      WHERE di.user_id IN (
        SELECT di2.user_id
        FROM discover_interactions di1
        JOIN discover_interactions di2 ON di1.item_id = di2.item_id
        WHERE di1.user_id = $1
          AND di2.user_id != $1
        LIMIT 30
      )
      AND d.id NOT IN (SELECT item_id FROM discover_interactions WHERE user_id = $1)
      AND d.is_active = true
      GROUP BY d.id
      ORDER BY similarity_score DESC
      LIMIT $2
    `;
    
    const collabResult = await this.db.query(collabQuery, [userId, Math.floor(limit * 0.4)]);
    candidates.push(...collabResult.rows.map(r => ({ ...r, strategy: 'collaborative' })));

    // Strategy 2: Content-based - match user preferences
    const contentQuery = `
      SELECT d.*, 
             CASE 
               WHEN d.category = ANY($2::text[]) THEN 2
               ELSE 1
             END as relevance_score
      FROM discover_items d
      WHERE d.is_active = true
        AND d.id NOT IN (SELECT item_id FROM discover_interactions WHERE user_id = $1)
      ORDER BY relevance_score DESC, d.created_at DESC
      LIMIT $3
    `;
    
    const preferredCategories = Object.entries(profile.preferences)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat]) => cat);
    
    const contentResult = await this.db.query(contentQuery, [userId, preferredCategories, Math.floor(limit * 0.4)]);
    candidates.push(...contentResult.rows.map(r => ({ ...r, strategy: 'content_based' })));

    // Strategy 3: Trending with recency boost
    const trendingQuery = `
      SELECT d.*,
             (COUNT(di.id) * 1.0 / EXTRACT(EPOCH FROM (NOW() - d.created_at)) / 3600) as velocity_score
      FROM discover_items d
      LEFT JOIN discover_interactions di ON di.item_id = d.id 
        AND di.created_at > NOW() - INTERVAL '24 hours'
      WHERE d.is_active = true
        AND d.id NOT IN (SELECT item_id FROM discover_interactions WHERE user_id = $1)
      GROUP BY d.id
      HAVING COUNT(di.id) > 0
      ORDER BY velocity_score DESC
      LIMIT $2
    `;
    
    const trendingResult = await this.db.query(trendingQuery, [userId, Math.floor(limit * 0.2)]);
    candidates.push(...trendingResult.rows.map(r => ({ ...r, strategy: 'trending' })));

    // Deduplicate
    const uniqueCandidates = Array.from(
      new Map(candidates.map(c => [c.id, c])).values()
    );

    return uniqueCandidates.slice(0, limit);
  }

  /**
   * Score discover items using multi-factor ML model
   */
  private async scoreDiscoverItems(items: any[], profile: UserProfile): Promise<any[]> {
    const scored = items.map(item => {
      // Collaborative filtering score (35%)
      const collabScore = item.similarity_score ? Math.min(item.similarity_score / 10, 1) : 0.5;

      // Content-based score (30%)
      const contentScore = profile.preferences[item.category] || 0.5;

      // Engagement prediction (25%)
      const engagementScore = this.predictEngagementProbability(item, profile);

      // Freshness score (10%)
      const ageHours = (Date.now() - new Date(item.created_at).getTime()) / (1000 * 60 * 60);
      const freshnessScore = Math.max(0, 1 - ageHours / 168); // Decay over 7 days

      // Weighted final score
      const finalScore = 
        collabScore * 0.35 +
        contentScore * 0.30 +
        engagementScore * 0.25 +
        freshnessScore * 0.10;

      return {
        ...item,
        final_score: finalScore,
        scores: {
          collaborative: collabScore,
          content_based: contentScore,
          engagement: engagementScore,
          freshness: freshnessScore
        }
      };
    });

    return scored.sort((a, b) => b.final_score - a.final_score);
  }

  /**
   * Apply diversity constraints to prevent filter bubbles
   */
  private applyDiversity(items: any[], limit: number): any[] {
    const maxPerCategory = Math.ceil(limit * 0.3); // Max 30% from same category
    const categoryCount: Record<string, number> = {};
    const selected: any[] = [];

    for (const item of items) {
      const category = item.category || 'uncategorized';
      const count = categoryCount[category] || 0;

      if (count < maxPerCategory) {
        selected.push(item);
        categoryCount[category] = count + 1;
      }

      if (selected.length >= limit) break;
    }

    return selected;
  }

  /**
   * Build Mii user profile from avatar interactions
   */
  private async buildMiiUserProfile(userId: string): Promise<any> {
    const query = `
      SELECT 
        ma.style_category,
        ma.color_scheme,
        ma.complexity_level,
        COUNT(*) as interaction_count,
        AVG(CASE WHEN mi.interaction_type = 'like' THEN 1 ELSE 0 END) as like_rate
      FROM mii_interactions mi
      JOIN mii_avatars ma ON ma.id = mi.avatar_id
      WHERE mi.user_id = $1
      GROUP BY ma.style_category, ma.color_scheme, ma.complexity_level
      ORDER BY interaction_count DESC
      LIMIT 10
    `;

    const result = await this.db.query(query, [userId]);
    
    return {
      userId,
      preferredStyles: result.rows.reduce((acc, row) => {
        acc[row.style_category] = parseFloat(row.like_rate);
        return acc;
      }, {}),
      preferredColors: {},
      interactionHistory: []
    };
  }

  /**
   * Find users with similar avatar preferences
   */
  private async findSimilarMiiUsers(userId: string, limit: number): Promise<string[]> {
    const query = `
      SELECT DISTINCT mi2.user_id,
             COUNT(*) as similarity_score
      FROM mii_interactions mi1
      JOIN mii_interactions mi2 ON mi1.avatar_id = mi2.avatar_id
      WHERE mi1.user_id = $1
        AND mi2.user_id != $1
        AND mi2.created_at > NOW() - INTERVAL '30 days'
      GROUP BY mi2.user_id
      ORDER BY similarity_score DESC
      LIMIT $2
    `;

    const result = await this.db.query(query, [userId, limit]);
    return result.rows.map(r => r.user_id);
  }

  /**
   * Get Mii candidate avatars/members
   */
  private async getMiiCandidates(userId: string, profile: any, similarUsers: string[], limit: number): Promise<any[]> {
    const candidates: any[] = [];

    // Strategy 1: Avatars liked by similar users
    const collabQuery = `
      SELECT DISTINCT ma.*, COUNT(*) as collaborative_score
      FROM mii_avatars ma
      JOIN mii_interactions mi ON mi.avatar_id = ma.id
      WHERE mi.user_id = ANY($1::uuid[])
        AND ma.id NOT IN (SELECT avatar_id FROM mii_interactions WHERE user_id = $2)
        AND ma.is_public = true
      GROUP BY ma.id
      ORDER BY collaborative_score DESC
      LIMIT $3
    `;

    const collabResult = await this.db.query(collabQuery, [similarUsers, userId, Math.floor(limit * 0.5)]);
    candidates.push(...collabResult.rows.map(r => ({ ...r, strategy: 'collaborative' })));

    // Strategy 2: Style-based matching
    const styleQuery = `
      SELECT ma.*,
             CASE 
               WHEN ma.style_category = ANY($2::text[]) THEN 2
               ELSE 1
             END as style_relevance
      FROM mii_avatars ma
      WHERE ma.is_public = true
        AND ma.id NOT IN (SELECT avatar_id FROM mii_interactions WHERE user_id = $1)
      ORDER BY style_relevance DESC, ma.created_at DESC
      LIMIT $3
    `;

    const preferredStyles = Object.keys(profile.preferredStyles || {});
    const styleResult = await this.db.query(styleQuery, [userId, preferredStyles, Math.floor(limit * 0.5)]);
    candidates.push(...styleResult.rows.map(r => ({ ...r, strategy: 'style_based' })));

    return Array.from(new Map(candidates.map(c => [c.id, c])).values()).slice(0, limit);
  }

  /**
   * Score Mii items using style similarity
   */
  private async scoreMiiItems(items: any[], profile: any): Promise<any[]> {
    return items.map(item => {
      const styleScore = profile.preferredStyles?.[item.style_category] || 0.5;
      const collabScore = item.collaborative_score ? Math.min(item.collaborative_score / 5, 1) : 0.5;
      const popularityScore = Math.min((item.usage_count || 0) / 100, 1);

      const finalScore = styleScore * 0.4 + collabScore * 0.35 + popularityScore * 0.25;

      return {
        ...item,
        final_score: finalScore,
        scores: { style: styleScore, collaborative: collabScore, popularity: popularityScore }
      };
    }).sort((a, b) => b.final_score - a.final_score);
  }

  /**
   * Apply Mii-specific diversity
   */
  private applyMiiDiversity(items: any[], limit: number): any[] {
    const maxPerStyle = Math.ceil(limit * 0.25); // Max 25% from same style
    const styleCount: Record<string, number> = {};
    const selected: any[] = [];

    for (const item of items) {
      const style = item.style_category || 'default';
      const count = styleCount[style] || 0;

      if (count < maxPerStyle) {
        selected.push(item);
        styleCount[style] = count + 1;
      }

      if (selected.length >= limit) break;
    }

    return selected;
  }

  /**
   * Calculate engagement velocity for canary/trending content
   */
  private async calculateEngagementVelocity(timeframe: string, category?: string): Promise<any[]> {
    const timeInterval = this.parseTimeframe(timeframe);

    const query = `
      SELECT 
        c.id,
        c.title,
        c.category,
        c.created_at,
        COUNT(DISTINCT l.id) as likes,
        COUNT(DISTINCT cm.id) as comments,
        COUNT(DISTINCT s.id) as shares,
        COUNT(DISTINCT v.id) as views,
        EXTRACT(EPOCH FROM (NOW() - c.created_at)) / 3600 as age_hours,
        (
          COUNT(DISTINCT l.id) * 1.0 +
          COUNT(DISTINCT cm.id) * 2.0 +
          COUNT(DISTINCT s.id) * 3.0
        ) / NULLIF(EXTRACT(EPOCH FROM (NOW() - c.created_at)) / 3600, 0) as velocity_score
      FROM content c
      LEFT JOIN likes l ON l.target_id = c.id AND l.target_type = 'content'
      LEFT JOIN comments cm ON cm.content_id = c.id
      LEFT JOIN shares s ON s.target_id = c.id AND s.target_type = 'content'
      LEFT JOIN views v ON v.content_id = c.id AND v.created_at > NOW() - INTERVAL '${timeInterval}'
      WHERE c.created_at > NOW() - INTERVAL '7 days'
      ${category ? 'AND c.category = $1' : ''}
      GROUP BY c.id
      HAVING COUNT(DISTINCT v.id) > 0
      ORDER BY velocity_score DESC
    `;

    const result = category 
      ? await this.db.query(query, [category])
      : await this.db.query(query);

    return result.rows;
  }

  /**
   * Predict viral potential using ML model
   */
  private async predictViralPotential(velocityData: any[]): Promise<any[]> {
    return velocityData.map(item => {
      // Viral prediction factors
      const velocityFactor = Math.min(item.velocity_score / 10, 1); // Normalize
      const engagementRatio = (parseInt(item.likes) + parseInt(item.comments) * 2 + parseInt(item.shares) * 3) / Math.max(parseInt(item.views), 1);
      const recencyFactor = Math.max(0, 1 - parseFloat(item.age_hours) / 168); // 7-day decay

      // ML-inspired viral score
      const viralScore = 
        velocityFactor * 0.4 +
        Math.min(engagementRatio, 1) * 0.35 +
        recencyFactor * 0.25;

      return {
        ...item,
        viral_score: viralScore,
        predicted_views: Math.round(parseInt(item.views) * (1 + viralScore)),
        is_trending: viralScore > 0.7
      };
    });
  }

  /**
   * Rank items by predicted virality
   */
  private rankByVirality(items: any[], limit: number): any[] {
    return items
      .sort((a, b) => b.viral_score - a.viral_score)
      .slice(0, limit);
  }

  /**
   * Apply category diversity for trending content
   */
  private applyCategoryDiversity(items: any[], limit: number): any[] {
    const maxPerCategory = Math.ceil(limit * 0.2); // Max 20% from same category
    const categoryCount: Record<string, number> = {};
    const selected: any[] = [];

    for (const item of items) {
      const category = item.category || 'general';
      const count = categoryCount[category] || 0;

      if (count < maxPerCategory) {
        selected.push(item);
        categoryCount[category] = count + 1;
      }

      if (selected.length >= limit) break;
    }

    return selected;
  }

  /**
   * Calculate user engagement patterns
   */
  private async calculateEngagementPatterns(userId: string): Promise<EngagementMetrics> {
    const query = `
      SELECT 
        COUNT(*) FILTER (WHERE interaction_type = 'like') * 1.0 / NULLIF(COUNT(*), 0) as like_rate,
        COUNT(*) FILTER (WHERE interaction_type = 'share') * 1.0 / NULLIF(COUNT(*), 0) as share_rate,
        COUNT(*) FILTER (WHERE interaction_type = 'comment') * 1.0 / NULLIF(COUNT(*), 0) as comment_rate,
        COUNT(*) FILTER (WHERE interaction_type = 'skip') * 1.0 / NULLIF(COUNT(*), 0) as skip_rate,
        AVG(duration) FILTER (WHERE duration IS NOT NULL) as avg_watch_time
      FROM discover_interactions
      WHERE user_id = $1
        AND created_at > NOW() - INTERVAL '30 days'
    `;

    const result = await this.db.query(query, [userId]);
    const row = result.rows[0] || {};

    return {
      likeRate: parseFloat(row.like_rate) || 0.1,
      shareRate: parseFloat(row.share_rate) || 0.05,
      commentRate: parseFloat(row.comment_rate) || 0.08,
      skipRate: parseFloat(row.skip_rate) || 0.3,
      avgWatchTime: parseFloat(row.avg_watch_time) || 0
    };
  }

  /**
   * Predict engagement probability for an item
   */
  private predictEngagementProbability(item: any, profile: UserProfile): number {
    const categoryPreference = profile.preferences[item.category] || 0.5;
    const historicalEngagement = profile.engagementPatterns;

    // Simple logistic regression-inspired prediction
    const baseProbability = categoryPreference * 0.6 + historicalEngagement.likeRate * 0.4;
    
    return Math.min(Math.max(baseProbability, 0.1), 0.9);
  }

  /**
   * Track recommendation impressions
   */
  private async trackImpressions(userId: string, itemIds: string[]): Promise<void> {
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
      logger.error('trackImpressions error:', error);
    }
  }

  /**
   * Update user preferences asynchronously
   */
  private async updateUserPreferencesAsync(userId: string): Promise<void> {
    // This would trigger background job to update user preference vectors
    // For now, just log
    logger.info(`Updating preferences for user ${userId}`);
  }

  /**
   * Parse timeframe string to SQL interval
   */
  private parseTimeframe(timeframe: string): string {
    const mapping: Record<string, string> = {
      '1h': '1 hour',
      '6h': '6 hours',
      '24h': '24 hours',
      '7d': '7 days',
      '30d': '30 days'
    };
    return mapping[timeframe] || '24 hours';
  }

  /**
   * Fallback: Basic recommendations without ML
   */
  private async getBasicRecommendations(userId: string, limit: number): Promise<any[]> {
    const query = `
      SELECT d.*
      FROM discover_items d
      WHERE d.is_active = true
      ORDER BY d.created_at DESC
      LIMIT $1
    `;
    
    const result = await this.db.query(query, [limit]);
    return result.rows;
  }

  /**
   * Fallback: Basic Mii recommendations
   */
  private async getBasicMiiRecommendations(userId: string, limit: number): Promise<any[]> {
    const query = `
      SELECT ma.*
      FROM mii_avatars ma
      WHERE ma.is_public = true
      ORDER BY ma.created_at DESC
      LIMIT $1
    `;
    
    const result = await this.db.query(query, [limit]);
    return result.rows;
  }

  /**
   * Fallback: Basic trending content
   */
  private async getBasicTrendingContent(limit: number, timeframe: string): Promise<any[]> {
    const interval = this.parseTimeframe(timeframe);
    
    const query = `
      SELECT c.*
      FROM content c
      WHERE c.created_at > NOW() - INTERVAL '${interval}'
      ORDER BY c.views DESC
      LIMIT $1
    `;
    
    const result = await this.db.query(query, [limit]);
    return result.rows;
  }
}

export default new UnifiedMLService();
