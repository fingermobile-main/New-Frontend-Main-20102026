import { Pool } from 'pg';
import logger from '../utils/logger';

/**
 * MLRecommendationService
 * Machine Learning-based video recommendation engine for Fingershorts
 * Implements collaborative filtering, content-based filtering, and engagement scoring
 */

interface UserPreferenceProfile {
  userId: string;
  preferredCategories: Map<string, number>;
  preferredCreators: Map<string, number>;
  avgWatchDuration: number;
  peakActivityHours: number[];
  engagementPatterns: {
    likeRate: number;
    commentRate: number;
    shareRate: number;
    skipRate: number;
  };
}

interface VideoScore {
  videoId: string;
  relevanceScore: number;
  diversityScore: number;
  freshnessScore: number;
  engagementPrediction: number;
  finalScore: number;
}

class MLRecommendationService {
  private db: Pool;
  private candidateVideosCache: any[] = [];
  private readonly COLLABORATIVE_WEIGHT = 0.35;
  private readonly CONTENT_WEIGHT = 0.30;
  private readonly ENGAGEMENT_WEIGHT = 0.25;
  private readonly FRESHNESS_WEIGHT = 0.10;
  private readonly DIVERSITY_THRESHOLD = 0.7;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  /**
   * Get personalized recommendations using ML-based hybrid approach
   */
  async getPersonalizedFeed(userId: string, limit: number = 20, offset: number = 0): Promise<any[]> {
    try {
      // Step 1: Build user preference profile
      const userProfile = await this.buildUserProfile(userId);
      
      // Step 2: Get candidate videos from multiple sources
      const candidates = await this.getCandidateVideos(userId, limit * 3);
      
      // Step 3: Score each candidate using ML model
      const scoredVideos = await this.scoreVideos(candidates, userProfile);
      
      // Step 4: Apply diversity and ranking
      const rankedVideos = this.rankAndDiversify(scoredVideos, userProfile, limit);
      
      // Step 5: Return paginated results
      return rankedVideos.slice(offset, offset + limit);
    } catch (error) {
      logger.error('MLRecommendationService.getPersonalizedFeed error:', error);
      throw error;
    }
  }

  /**
   * Build comprehensive user preference profile
   */
  private async buildUserProfile(userId: string): Promise<UserPreferenceProfile> {
    const profile: UserPreferenceProfile = {
      userId,
      preferredCategories: new Map(),
      preferredCreators: new Map(),
      avgWatchDuration: 0,
      peakActivityHours: [],
      engagementPatterns: {
        likeRate: 0,
        commentRate: 0,
        shareRate: 0,
        skipRate: 0
      }
    };

    // Analyze watch history for category preferences
    const categoryQuery = `
      SELECT v.category, COUNT(*) as watch_count, AVG(vv.watch_duration / v.duration) as avg_completion
      FROM video_views vv
      JOIN fingershorts_videos v ON vv.video_id = v.id
      WHERE vv.user_id = $1 AND v.category IS NOT NULL
      GROUP BY v.category
      ORDER BY watch_count DESC
      LIMIT 10
    `;
    
    const categoryResult = await this.db.query(categoryQuery, [userId]);
    categoryResult.rows.forEach(row => {
      profile.preferredCategories.set(row.category, parseFloat(row.avg_completion));
    });

    // Analyze liked videos for creator preferences
    const creatorQuery = `
      SELECT v.creator_id, COUNT(*) as interaction_count
      FROM likes l
      JOIN fingershorts_videos v ON l.target_id = v.id
      WHERE l.user_id = $1 AND l.target_type = 'video'
      GROUP BY v.creator_id
      ORDER BY interaction_count DESC
      LIMIT 15
    `;
    
    const creatorResult = await this.db.query(creatorQuery, [userId]);
    creatorResult.rows.forEach(row => {
      profile.preferredCreators.set(row.creator_id, parseInt(row.interaction_count));
    });

    // Calculate average watch duration
    const avgDurationQuery = `
      SELECT AVG(watch_duration) as avg_duration
      FROM video_views
      WHERE user_id = $1 AND watch_duration IS NOT NULL
    `;
    
    const avgDurationResult = await this.db.query(avgDurationQuery, [userId]);
    profile.avgWatchDuration = parseFloat(avgDurationResult.rows[0]?.avg_duration || '0');

    // Determine peak activity hours
    const activityQuery = `
      SELECT EXTRACT(HOUR FROM viewed_at) as hour, COUNT(*) as view_count
      FROM video_views
      WHERE user_id = $1
      GROUP BY hour
      ORDER BY view_count DESC
      LIMIT 5
    `;
    
    const activityResult = await this.db.query(activityQuery, [userId]);
    profile.peakActivityHours = activityResult.rows.map(row => parseInt(row.hour));

    // Calculate engagement patterns
    const engagementQuery = `
      SELECT 
        COUNT(DISTINCT CASE WHEN l.id IS NOT NULL THEN v.id END) * 1.0 / NULLIF(COUNT(DISTINCT v.id), 0) as like_rate,
        COUNT(DISTINCT CASE WHEN c.id IS NOT NULL THEN v.id END) * 1.0 / NULLIF(COUNT(DISTINCT v.id), 0) as comment_rate,
        COUNT(DISTINCT CASE WHEN s.id IS NOT NULL THEN v.id END) * 1.0 / NULLIF(COUNT(DISTINCT v.id), 0) as share_rate
      FROM video_views vv
      JOIN fingershorts_videos v ON vv.video_id = v.id
      LEFT JOIN likes l ON l.target_id = v.id AND l.user_id = vv.user_id AND l.target_type = 'video'
      LEFT JOIN comments c ON c.post_id = v.id AND c.author_id = vv.user_id
      LEFT JOIN shares s ON s.video_id = v.id AND s.user_id = vv.user_id
      WHERE vv.user_id = $1
    `;
    
    const engagementResult = await this.db.query(engagementQuery, [userId]);
    if (engagementResult.rows[0]) {
      profile.engagementPatterns.likeRate = parseFloat(engagementResult.rows[0].like_rate || '0');
      profile.engagementPatterns.commentRate = parseFloat(engagementResult.rows[0].comment_rate || '0');
      profile.engagementPatterns.shareRate = parseFloat(engagementResult.rows[0].share_rate || '0');
    }

    return profile;
  }

  /**
   * Get candidate videos from multiple recommendation strategies
   */
  private async getCandidateVideos(userId: string, limit: number): Promise<any[]> {
    const candidates: any[] = [];

    // Strategy 1: Collaborative filtering - users with similar tastes
    const collaborativeQuery = `
      WITH similar_users AS (
        SELECT l2.user_id, COUNT(*) as common_likes
        FROM likes l1
        JOIN likes l2 ON l1.target_id = l2.target_id AND l1.target_type = l2.target_type
        WHERE l1.user_id = $1 AND l2.user_id != $1
        GROUP BY l2.user_id
        ORDER BY common_likes DESC
        LIMIT 50
      )
      SELECT DISTINCT v.*, u.name as creator_name, u.avatar_url as creator_avatar
      FROM similar_users su
      JOIN likes l ON l.user_id = su.user_id AND l.target_type = 'video'
      JOIN fingershorts_videos v ON l.target_id = v.id
      JOIN users u ON v.creator_id = u.id
      WHERE v.is_published = true AND v.status = 'approved'
        AND v.id NOT IN (SELECT video_id FROM video_views WHERE user_id = $1)
      ORDER BY RANDOM()
      LIMIT $2
    `;
    
    const collaborativeResult = await this.db.query(collaborativeQuery, [userId, Math.floor(limit * 0.4)]);
    candidates.push(...collaborativeResult.rows.map(r => ({ ...r, strategy: 'collaborative' })));

    // Strategy 2: Content-based filtering - based on user's watched categories
    const contentQuery = `
      SELECT v.*, u.name as creator_name, u.avatar_url as creator_avatar
      FROM fingershorts_videos v
      JOIN users u ON v.creator_id = u.id
      WHERE v.is_published = true AND v.status = 'approved'
        AND v.category IN (
          SELECT DISTINCT v2.category
          FROM video_views vv
          JOIN fingershorts_videos v2 ON vv.video_id = v2.id
          WHERE vv.user_id = $1 AND v2.category IS NOT NULL
          ORDER BY COUNT(*) DESC
          LIMIT 5
        )
        AND v.id NOT IN (SELECT video_id FROM video_views WHERE user_id = $1)
      ORDER BY v.created_at DESC
      LIMIT $2
    `;
    
    const contentResult = await this.db.query(contentQuery, [userId, Math.floor(limit * 0.3)]);
    candidates.push(...contentResult.rows.map(r => ({ ...r, strategy: 'content-based' })));

    // Strategy 3: Trending with recency boost
    const trendingQuery = `
      SELECT v.*, u.name as creator_name, u.avatar_url as creator_avatar,
             COUNT(DISTINCT l.id) as like_count,
             COUNT(DISTINCT vi.id) as recent_views
      FROM fingershorts_videos v
      JOIN users u ON v.creator_id = u.id
      LEFT JOIN likes l ON l.target_id = v.id AND l.target_type = 'video'
      LEFT JOIN video_views vi ON vi.video_id = v.id AND vi.viewed_at > NOW() - INTERVAL '24 hours'
      WHERE v.is_published = true AND v.status = 'approved'
        AND v.created_at > NOW() - INTERVAL '7 days'
        AND v.id NOT IN (SELECT video_id FROM video_views WHERE user_id = $1)
      GROUP BY v.id, u.name, u.avatar_url
      ORDER BY (like_count * 1.0 + recent_views * 2.0) DESC, v.created_at DESC
      LIMIT $2
    `;
    
    const trendingResult = await this.db.query(trendingQuery, [userId, Math.floor(limit * 0.2)]);
    candidates.push(...trendingResult.rows.map(r => ({ ...r, strategy: 'trending' })));

    // Strategy 4: Following feed
    const followingQuery = `
      SELECT v.*, u.name as creator_name, u.avatar_url as creator_avatar
      FROM fingershorts_videos v
      JOIN users u ON v.creator_id = u.id
      WHERE v.is_published = true AND v.status = 'approved'
        AND v.creator_id IN (
          SELECT receiver_id FROM connections WHERE sender_id = $1 AND status = 'accepted'
          UNION
          SELECT sender_id FROM connections WHERE receiver_id = $1 AND status = 'accepted'
        )
        AND v.id NOT IN (SELECT video_id FROM video_views WHERE user_id = $1 LIMIT 100)
      ORDER BY v.created_at DESC
      LIMIT $2
    `;
    
    const followingResult = await this.db.query(followingQuery, [userId, Math.floor(limit * 0.1)]);
    candidates.push(...followingResult.rows.map(r => ({ ...r, strategy: 'following' })));

    // Deduplicate and shuffle
    const uniqueCandidates = Array.from(
      new Map(candidates.map(c => [c.id, c])).values()
    );
    
    // Cache for diversity check
    this.candidateVideosCache = uniqueCandidates;
    
    return uniqueCandidates.slice(0, limit);
  }

  /**
   * Score videos using ML-based multi-factor model
   */
  private async scoreVideos(videos: any[], userProfile: UserPreferenceProfile): Promise<VideoScore[]> {
    const scoredVideos: VideoScore[] = [];

    for (const video of videos) {
      // Collaborative filtering score
      const collaborativeScore = this.calculateCollaborativeScore(video, userProfile);
      
      // Content-based score
      const contentScore = this.calculateContentScore(video, userProfile);
      
      // Engagement prediction score
      const engagementScore = await this.predictEngagement(video, userProfile);
      
      // Freshness score (recency boost)
      const freshnessScore = this.calculateFreshnessScore(video);
      
      // Diversity score (prevent filter bubbles)
      const diversityScore = this.calculateDiversityScore(video, userProfile);

      // Weighted final score
      const finalScore = (
        collaborativeScore * this.COLLABORATIVE_WEIGHT +
        contentScore * this.CONTENT_WEIGHT +
        engagementScore * this.ENGAGEMENT_WEIGHT +
        freshnessScore * this.FRESHNESS_WEIGHT
      ) * diversityScore;

      scoredVideos.push({
        videoId: video.id,
        relevanceScore: (collaborativeScore + contentScore + engagementScore) / 3,
        diversityScore,
        freshnessScore,
        engagementPrediction: engagementScore,
        finalScore
      });
    }

    return scoredVideos;
  }

  /**
   * Calculate collaborative filtering score
   */
  private calculateCollaborativeScore(video: any, userProfile: UserPreferenceProfile): number {
    let score = 0.5; // Base score
    
    // Boost if creator is in preferred creators
    if (userProfile.preferredCreators.has(video.creator_id)) {
      score += 0.3;
    }
    
    // Strategy-based boost
    if (video.strategy === 'collaborative') {
      score += 0.2;
    }
    
    return Math.min(score, 1.0);
  }

  /**
   * Calculate content-based filtering score
   */
  private calculateContentScore(video: any, userProfile: UserPreferenceProfile): number {
    let score = 0.5; // Base score
    
    // Category preference match
    if (video.category && userProfile.preferredCategories.has(video.category)) {
      const categoryAffinity = userProfile.preferredCategories.get(video.category)!;
      score += categoryAffinity * 0.4;
    }
    
    // Strategy-based boost
    if (video.strategy === 'content-based') {
      score += 0.2;
    }
    
    return Math.min(score, 1.0);
  }

  /**
   * Predict engagement probability using historical patterns
   */
  private async predictEngagement(video: any, userProfile: UserPreferenceProfile): Promise<number> {
    let baseScore = 0.5;
    
    // Historical engagement rates
    baseScore += userProfile.engagementPatterns.likeRate * 0.2;
    baseScore += userProfile.engagementPatterns.commentRate * 0.15;
    baseScore += userProfile.engagementPatterns.shareRate * 0.15;
    
    // Time-based relevance
    const videoHour = new Date(video.created_at).getHours();
    if (userProfile.peakActivityHours.includes(videoHour)) {
      baseScore += 0.1;
    }
    
    // Duration match with user's watch pattern
    if (video.duration && userProfile.avgWatchDuration > 0) {
      const durationRatio = video.duration / userProfile.avgWatchDuration;
      if (durationRatio >= 0.8 && durationRatio <= 1.2) {
        baseScore += 0.1; // Prefer videos similar to user's typical watch duration
      }
    }
    
    return Math.min(baseScore, 1.0);
  }

  /**
   * Calculate freshness/recency score
   */
  private calculateFreshnessScore(video: any): number {
    const videoAge = Date.now() - new Date(video.created_at).getTime();
    const hoursOld = videoAge / (1000 * 60 * 60);
    
    // Exponential decay based on age
    if (hoursOld < 6) return 1.0;
    if (hoursOld < 24) return 0.8;
    if (hoursOld < 72) return 0.6;
    if (hoursOld < 168) return 0.4; // 1 week
    return 0.2;
  }

  /**
   * Calculate diversity score to prevent filter bubbles
   */
  private calculateDiversityScore(video: any, userProfile: UserPreferenceProfile): number {
    // If category is overrepresented, reduce score
    if (video.category && userProfile.preferredCategories.has(video.category)) {
      const categoryCount = Array.from(userProfile.preferredCategories.keys()).filter(
        cat => cat === video.category
      ).length;
      
      if (categoryCount > 3) {
        return this.DIVERSITY_THRESHOLD; // Reduce diversity score
      }
    }
    
    return 1.0;
  }

  /**
   * Rank and diversify final video list
   */
  private rankAndDiversify(scoredVideos: VideoScore[], userProfile: UserPreferenceProfile, limit: number): VideoScore[] {
    // Sort by final score
    const sorted = scoredVideos.sort((a, b) => b.finalScore - a.finalScore);
    
    // Apply diversity constraints
    const diversified: VideoScore[] = [];
    const categoryCounts = new Map<string, number>();
    const maxPerCategory = Math.ceil(limit * 0.3); // Max 30% from same category
    
    for (const scored of sorted) {
      if (diversified.length >= limit) break;
      
      // Find original video data to check category
      const originalVideo = this.candidateVideosCache?.find(v => v.id === scored.videoId);
      if (originalVideo?.category) {
        const currentCount = categoryCounts.get(originalVideo.category) || 0;
        if (currentCount >= maxPerCategory) {
          continue; // Skip if category quota exceeded
        }
        categoryCounts.set(originalVideo.category, currentCount + 1);
      }
      
      diversified.push(scored);
    }
    
    return diversified;
  }

  /**
   * Track user interaction for continuous learning
   */
  async trackInteraction(userId: string, videoId: string, interactionType: string, metadata?: any): Promise<void> {
    try {
      await this.db.query(
        `INSERT INTO user_video_interactions (user_id, video_id, interaction_type, metadata, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [userId, videoId, interactionType, JSON.stringify(metadata || {})]
      );
      
      // Update user preference profile asynchronously
      this.updateUserPreferences(userId).catch(err => {
        logger.error('Failed to update user preferences:', err);
      });
    } catch (error) {
      logger.error('MLRecommendationService.trackInteraction error:', error);
    }
  }

  /**
   * Update user preference profile based on recent interactions
   */
  private async updateUserPreferences(userId: string): Promise<void> {
    // This would typically update a cached/precomputed user profile
    // For now, we'll just ensure the data is available for next query
    await this.db.query(
      `UPDATE user_preference_cache 
       SET last_updated = NOW(), needs_refresh = true
       WHERE user_id = $1`,
      [userId]
    );
  }

  /**
   * Get A/B test variant for algorithm
   */
  async getABTestVariant(userId: string): Promise<string> {
    const result = await this.db.query(
      `SELECT ab_test_variantant FROM user_ab_tests WHERE user_id = $1`,
      [userId]
    );
    
    if (result.rows[0]) {
      return result.rows[0].ab_test_variantant;
    }
    
    // Assign random variant if not exists
    const variants = ['control', 'ml_v1', 'ml_v2', 'hybrid'];
    const variant = variants[Math.floor(Math.random() * variants.length)] || 'control';
    
    await this.db.query(
      `INSERT INTO user_ab_tests (user_id, ab_test_variantant, assigned_at)
       VALUES ($1, $2, NOW())`,
      [userId, variant]
    );
    
    return variant;
  }

  /**
   * Get algorithm performance metrics
   */
  async getPerformanceMetrics(timeframe: string = '24 hours'): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total_recommendations,
        AVG(CASE WHEN interaction_type IN ('like', 'comment', 'share') THEN 1 ELSE 0 END) as engagement_rate,
        AVG(CASE WHEN interaction_type = 'watch_complete' THEN 1 ELSE 0 END) as completion_rate,
        AVG(CASE WHEN interaction_type = 'skip' THEN 1 ELSE 0 END) as skip_rate
      FROM user_video_interactions
      WHERE created_at > NOW() - INTERVAL '${timeframe}'
    `;
    
    const result = await this.db.query(query);
    return result.rows[0];
  }
}

export default new MLRecommendationService();
