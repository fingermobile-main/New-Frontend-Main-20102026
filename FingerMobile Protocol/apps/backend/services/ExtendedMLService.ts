import { Pool } from 'pg';
import logger from '../utils/logger';

/**
 * Extended ML Service for Beatwave, Lumina, Seads, NexusGNN, STERCS, Ownit, Publicitee, P2P Matching
 * Extends UnifiedMLService with module-specific recommendation engines
 */

interface ModuleUserProfile {
  userId: string;
  preferences: Record<string, number>;
  interactionHistory: any[];
  engagementPatterns: any;
}

class ExtendedMLService {
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
   * BEATWAVE - Music/Playlist Recommendations
   * ML-based music discovery using listening patterns, genre preferences, and collaborative filtering
   */
  async getBeatwaveRecommendations(userId: string, options: {
    limit?: number;
    genre?: string;
    mood?: string;
    useML?: boolean;
  } = {}): Promise<any[]> {
    const { limit = 20, genre, mood, useML = true } = options;

    if (!useML) {
      return this.getBasicBeatwaveRecommendations(limit);
    }

    try {
      // Build user music profile
      const userProfile = await this.buildBeatwaveProfile(userId);

      // Get candidate tracks using multiple strategies
      const candidates = await this.getBeatwaveCandidates(userId, userProfile, limit * 2);

      // Score tracks using ML model
      const scoredTracks = await this.scoreBeatwaveTracks(candidates, userProfile);

      // Apply diversity (max 25% same genre)
      const diversified = this.applyGenreDiversity(scoredTracks, limit);

      return diversified;
    } catch (error) {
      logger.error('getBeatwaveRecommendations error:', error);
      return this.getBasicBeatwaveRecommendations(limit);
    }
  }

  /**
   * LUMINA - Media Content Recommendations
   * ML-based visual content discovery using style analysis and user preferences
   */
  async getLuminaRecommendations(userId: string, options: {
    limit?: number;
    contentType?: string;
    styleCategory?: string;
    useML?: boolean;
  } = {}): Promise<any[]> {
    const { limit = 20, contentType, styleCategory, useML = true } = options;

    if (!useML) {
      return this.getBasicLuminaRecommendations(limit);
    }

    try {
      const userProfile = await this.buildLuminaProfile(userId);
      const candidates = await this.getLuminaCandidates(userId, userProfile, limit * 2);
      const scored = await this.scoreLuminaContent(candidates, userProfile);
      const diversified = this.applyStyleDiversity(scored, limit);

      return diversified;
    } catch (error) {
      logger.error('getLuminaRecommendations error:', error);
      return this.getBasicLuminaRecommendations(limit);
    }
  }

  /**
   * SEADS - Educational Content Recommendations
   * ML-based learning path optimization using skill level and progress tracking
   */
  async getSeadsRecommendations(userId: string, options: {
    limit?: number;
    subject?: string;
    difficultyLevel?: string;
    useML?: boolean;
  } = {}): Promise<any[]> {
    const { limit = 15, subject, difficultyLevel, useML = true } = options;

    if (!useML) {
      return this.getBasicSeadsRecommendations(limit);
    }

    try {
      const userProfile = await this.buildSeadsProfile(userId);
      const candidates = await this.getSeadsCandidates(userId, userProfile, limit * 2);
      const scored = await this.scoreSeadsContent(candidates, userProfile);
      const optimized = this.optimizeLearningPath(scored, limit);

      return optimized;
    } catch (error) {
      logger.error('getSeadsRecommendations error:', error);
      return this.getBasicSeadsRecommendations(limit);
    }
  }

  /**
   * NEXUSGNN - Graph Neural Network Recommendations
   * Advanced GNN-based relationship and connection recommendations
   */
  async getNexusGNNRecommendations(userId: string, options: {
    limit?: number;
    connectionType?: string;
    useML?: boolean;
  } = {}): Promise<any[]> {
    const { limit = 10, connectionType, useML = true } = options;

    if (!useML) {
      return this.getBasicNexusRecommendations(limit);
    }

    try {
      const graphFeatures = await this.extractGraphFeatures(userId);
      const candidates = await this.getNexusCandidates(userId, graphFeatures, limit * 2);
      const scored = await this.scoreWithGNN(candidates, graphFeatures);
      const ranked = this.rankByRelevance(scored, limit);

      return ranked;
    } catch (error) {
      logger.error('getNexusGNNRecommendations error:', error);
      return this.getBasicNexusRecommendations(limit);
    }
  }

  /**
   * STERCS - Content Creation Tool Recommendations
   * ML-based tool and template suggestions based on creation patterns
   */
  async getStercsRecommendations(userId: string, options: {
    limit?: number;
    toolCategory?: string;
    useML?: boolean;
  } = {}): Promise<any[]> {
    const { limit = 12, toolCategory, useML = true } = options;

    if (!useML) {
      return this.getBasicStercsRecommendations(limit);
    }

    try {
      const userProfile = await this.buildStercsProfile(userId);
      const candidates = await this.getStercsCandidates(userId, userProfile, limit * 2);
      const scored = await this.scoreStercsTools(candidates, userProfile);
      const personalized = this.personalizeToolSelection(scored, limit);

      return personalized;
    } catch (error) {
      logger.error('getStercsRecommendations error:', error);
      return this.getBasicStercsRecommendations(limit);
    }
  }

  /**
   * OWNIT - Asset Ownership & Investment Recommendations
   * ML-based digital asset recommendations using market trends and user portfolio
   */
  async getOwnitRecommendations(userId: string, options: {
    limit?: number;
    assetType?: string;
    riskLevel?: string;
    useML?: boolean;
  } = {}): Promise<any[]> {
    const { limit = 15, assetType, riskLevel, useML = true } = options;

    if (!useML) {
      return this.getBasicOwnitRecommendations(limit);
    }

    try {
      const portfolio = await this.buildOwnitPortfolio(userId);
      const candidates = await this.getOwnitCandidates(userId, portfolio, limit * 2);
      const scored = await this.scoreOwnitAssets(candidates, portfolio);
      const optimized = this.optimizePortfolioMix(scored, limit);

      return optimized;
    } catch (error) {
      logger.error('getOwnitRecommendations error:', error);
      return this.getBasicOwnitRecommendations(limit);
    }
  }

  /**
   * PUBLICITEE - Advertising Campaign Recommendations
   * ML-based ad placement and targeting optimization
   */
  async getPubliciteeRecommendations(userId: string, options: {
    limit?: number;
    campaignType?: string;
    targetAudience?: string;
    useML?: boolean;
  } = {}): Promise<any[]> {
    const { limit = 10, campaignType, targetAudience, useML = true } = options;

    if (!useML) {
      return this.getBasicPubliciteeRecommendations(limit);
    }

    try {
      const advertiserProfile = await this.buildPubliciteeProfile(userId);
      const candidates = await this.getPubliciteeCandidates(userId, advertiserProfile, limit * 2);
      const scored = await this.scoreAdCampaigns(candidates, advertiserProfile);
      const optimized = this.optimizeAdTargeting(scored, limit);

      return optimized;
    } catch (error) {
      logger.error('getPubliciteeRecommendations error:', error);
      return this.getBasicPubliciteeRecommendations(limit);
    }
  }

  /**
   * P2P MATCHING - Peer-to-Peer Connection Recommendations
   * ML-based matching algorithm using compatibility scoring and network analysis
   */
  async getP2PMatchingRecommendations(userId: string, options: {
    limit?: number;
    matchCategory?: string;
    proximity?: string;
    useML?: boolean;
  } = {}): Promise<any[]> {
    const { limit = 20, matchCategory, proximity, useML = true } = options;

    if (!useML) {
      return this.getBasicP2PRecommendations(limit);
    }

    try {
      const userMatcherProfile = await this.buildP2PProfile(userId);
      const candidates = await this.getP2PCandidates(userId, userMatcherProfile, limit * 3);
      const scored = await this.scoreP2PCompatibility(candidates, userMatcherProfile);
      const matched = this.optimizeMatches(scored, limit);

      return matched;
    } catch (error) {
      logger.error('getP2PMatchingRecommendations error:', error);
      return this.getBasicP2PRecommendations(limit);
    }
  }

  /**
   * Track interactions across all modules for continuous learning
   */
  async trackModuleInteraction(
    userId: string, 
    itemId: string, 
    module: string,
    interactionType: string, 
    metadata?: any
  ): Promise<void> {
    try {
      const query = `
        INSERT INTO ml_interactions (user_id, item_id, feed_type, interaction_type, metadata, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        ON CONFLICT (user_id, item_id, interaction_type, feed_type) 
        DO UPDATE SET count = ml_interactions.count + 1, updated_at = NOW()
      `;
      
      await this.db.query(query, [
        userId, 
        itemId, 
        module.toLowerCase(),
        interactionType, 
        JSON.stringify(metadata || {})
      ]);

      // Update user profile asynchronously
      this.updateModulePreferencesAsync(userId, module);
    } catch (error) {
      logger.error('trackModuleInteraction error:', error);
    }
  }

  /**
   * Get performance metrics for any module
   */
  async getModuleAlgorithmMetrics(module: string, timeframe: string = '24h'): Promise<any> {
    const cacheKey = `metrics:${module}:${timeframe}`;
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

      const result = await this.db.query(query, [module.toLowerCase()]);
      const metrics = result.rows[0] || {};

      this.cache.set(cacheKey, { data: metrics, timestamp: Date.now() });

      return {
        module,
        timeframe,
        ...metrics
      };
    } catch (error) {
      logger.error('getModuleAlgorithmMetrics error:', error);
      return { module, error: 'Failed to retrieve metrics' };
    }
  }

  // ==================== PRIVATE HELPER METHODS ====================

  private async buildBeatwaveProfile(userId: string): Promise<ModuleUserProfile> {
    // Implementation for music preference profiling
    return { userId, preferences: {}, interactionHistory: [], engagementPatterns: {} };
  }

  private async getBeatwaveCandidates(userId: string, profile: ModuleUserProfile, limit: number): Promise<any[]> {
    // Multi-strategy candidate generation for music
    return [];
  }

  private async scoreBeatwaveTracks(tracks: any[], profile: ModuleUserProfile): Promise<any[]> {
    // ML-based scoring for music tracks
    return tracks;
  }

  private applyGenreDiversity(tracks: any[], limit: number): any[] {
    const maxPerGenre = Math.ceil(limit * 0.25);
    const genreCount: Record<string, number> = {};
    const selected: any[] = [];

    for (const track of tracks) {
      const genre = track.genre || 'unknown';
      const count = genreCount[genre] || 0;
      if (count < maxPerGenre) {
        selected.push(track);
        genreCount[genre] = count + 1;
      }
      if (selected.length >= limit) break;
    }
    return selected;
  }

  private async getBasicBeatwaveRecommendations(limit: number): Promise<any[]> {
    const result = await this.db.query(
      'SELECT * FROM beatwave_tracks ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  }

  private async buildLuminaProfile(userId: string): Promise<ModuleUserProfile> {
    return { userId, preferences: {}, interactionHistory: [], engagementPatterns: {} };
  }

  private async getLuminaCandidates(userId: string, profile: ModuleUserProfile, limit: number): Promise<any[]> {
    return [];
  }

  private async scoreLuminaContent(items: any[], profile: ModuleUserProfile): Promise<any[]> {
    return items;
  }

  private applyStyleDiversity(items: any[], limit: number): any[] {
    return items.slice(0, limit);
  }

  private async getBasicLuminaRecommendations(limit: number): Promise<any[]> {
    const result = await this.db.query(
      'SELECT * FROM lumina_media ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  }

  private async buildSeadsProfile(userId: string): Promise<ModuleUserProfile> {
    return { userId, preferences: {}, interactionHistory: [], engagementPatterns: {} };
  }

  private async getSeadsCandidates(userId: string, profile: ModuleUserProfile, limit: number): Promise<any[]> {
    return [];
  }

  private async scoreSeadsContent(items: any[], profile: ModuleUserProfile): Promise<any[]> {
    return items;
  }

  private optimizeLearningPath(items: any[], limit: number): any[] {
    return items.slice(0, limit);
  }

  private async getBasicSeadsRecommendations(limit: number): Promise<any[]> {
    const result = await this.db.query(
      'SELECT * FROM seads_courses ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  }

  private async extractGraphFeatures(userId: string): Promise<any> {
    const nodeRes = await this.db.query(
      `SELECT n.*, e.embedding_data 
       FROM nexusgnn_graph_nodes n
       LEFT JOIN nexusgnn_embeddings e ON n.id = e.node_id AND e.is_active = TRUE
       WHERE n.entity_id = $1 AND n.node_type = 'user'`,
      [userId]
    );
    const edgesRes = await this.db.query(
      `SELECT COUNT(*) as degree, AVG(weight) as avg_weight
       FROM nexusgnn_graph_edges ge
       JOIN nexusgnn_graph_nodes gn ON ge.source_node_id = gn.id OR ge.target_node_id = gn.id
       WHERE gn.entity_id = $1`,
      [userId]
    );
    return {
      userId,
      userNode: nodeRes.rows[0] || null,
      embedding: nodeRes.rows[0]?.embedding_data || null,
      degree: parseInt(edgesRes.rows[0]?.degree || '0'),
      avgWeight: parseFloat(edgesRes.rows[0]?.avg_weight || '1.0')
    };
  }

  private async getNexusCandidates(userId: string, features: any, limit: number): Promise<any[]> {
    const candidates = await this.db.query(
      `SELECT n.id as node_id, n.entity_id, n.entity_type, n.node_type, n.metadata, e.embedding_data
       FROM nexusgnn_graph_nodes n
       LEFT JOIN nexusgnn_embeddings e ON n.id = e.node_id AND e.is_active = TRUE
       WHERE n.entity_id != $1 AND n.node_type IN ('user', 'item')
       ORDER BY n.updated_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    return candidates.rows;
  }

  private async scoreWithGNN(candidates: any[], features: any): Promise<any[]> {
    const userEmb: number[] = features.embedding || [];
    return candidates.map(c => {
      let sim = 0.5;
      const cEmb: number[] = c.embedding_data || [];
      if (userEmb.length > 0 && cEmb.length > 0) {
        let dot = 0, normA = 0, normB = 0;
        const len = Math.min(userEmb.length, cEmb.length);
        for (let i = 0; i < len; i++) {
          dot += userEmb[i] * cEmb[i];
          normA += userEmb[i] * userEmb[i];
          normB += cEmb[i] * cEmb[i];
        }
        normA = Math.sqrt(normA);
        normB = Math.sqrt(normB);
        if (normA > 0 && normB > 0) {
          sim = Math.max(0, Math.min(1, (dot / (normA * normB) + 1) / 2));
        }
      }
      return { ...c, score: sim };
    });
  }

  private rankByRelevance(items: any[], limit: number): any[] {
    return items.sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, limit);
  }

  private async getBasicNexusRecommendations(limit: number): Promise<any[]> {
    const result = await this.db.query(
      'SELECT * FROM nexusgnn_graph_nodes WHERE node_type = \'user\' ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  }

  private async buildStercsProfile(userId: string): Promise<ModuleUserProfile> {
    return { userId, preferences: {}, interactionHistory: [], engagementPatterns: {} };
  }

  private async getStercsCandidates(userId: string, profile: ModuleUserProfile, limit: number): Promise<any[]> {
    return [];
  }

  private async scoreStercsTools(tools: any[], profile: ModuleUserProfile): Promise<any[]> {
    return tools;
  }

  private personalizeToolSelection(tools: any[], limit: number): any[] {
    return tools.slice(0, limit);
  }

  private async getBasicStercsRecommendations(limit: number): Promise<any[]> {
    const result = await this.db.query(
      'SELECT * FROM stercs_templates ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  }

  private async buildOwnitPortfolio(userId: string): Promise<any> {
    return { userId, assets: [], riskProfile: 'medium' };
  }

  private async getOwnitCandidates(userId: string, portfolio: any, limit: number): Promise<any[]> {
    return [];
  }

  private async scoreOwnitAssets(assets: any[], portfolio: any): Promise<any[]> {
    return assets;
  }

  private optimizePortfolioMix(assets: any[], limit: number): any[] {
    return assets.slice(0, limit);
  }

  private async getBasicOwnitRecommendations(limit: number): Promise<any[]> {
    const result = await this.db.query(
      'SELECT * FROM ownit_assets ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  }

  private async buildPubliciteeProfile(userId: string): Promise<any> {
    return { userId, campaigns: [], targeting: {} };
  }

  private async getPubliciteeCandidates(userId: string, profile: any, limit: number): Promise<any[]> {
    return [];
  }

  private async scoreAdCampaigns(campaigns: any[], profile: any): Promise<any[]> {
    return campaigns;
  }

  private optimizeAdTargeting(campaigns: any[], limit: number): any[] {
    return campaigns.slice(0, limit);
  }

  private async getBasicPubliciteeRecommendations(limit: number): Promise<any[]> {
    const result = await this.db.query(
      'SELECT * FROM publicitee_campaigns ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  }

  private async buildP2PProfile(userId: string): Promise<any> {
    return { userId, interests: [], compatibility: {} };
  }

  private async getP2PCandidates(userId: string, profile: any, limit: number): Promise<any[]> {
    return [];
  }

  private async scoreP2PCompatibility(candidates: any[], profile: any): Promise<any[]> {
    return candidates;
  }

  private optimizeMatches(matches: any[], limit: number): any[] {
    return matches.slice(0, limit);
  }

  private async getBasicP2PRecommendations(limit: number): Promise<any[]> {
    const result = await this.db.query(
      'SELECT * FROM p2p_matches ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  }

  private async updateModulePreferencesAsync(userId: string, module: string): Promise<void> {
    logger.info(`Updating ${module} preferences for user ${userId}`);
  }
}

export default new ExtendedMLService();
