/* eslint-disable no-unused-vars */
const logger = require('../utils/logger');
const { pool } = require('../db');
const gnnEngine = require('./gnnEngine');
const nexusgnnQueue = require('./nexusgnnQueue');
const nexusgnnLifecycle = require('./nexusgnnLifecycle');

/**
 * NexusGNN Algorithm Service
 * Enhanced P2P Matching with Graph Neural Networks
 * Implements H-BiSocial Graph with PinSage-MetaGNN Fusion
 */
class NexusGNNService {
  constructor() {
    // Default algorithm weights (R(u,i) formula components)
    this.DEFAULT_WEIGHTS = {
      alpha: 0.35, // Bipartite Interaction Matrix weight
      beta: 0.25,  // Exploration Preference Array weight
      gamma: 0.25, // Value Sentiment Score weight
      delta: 0.15  // Domain & Freshness Quality Metric weight
    };

    // Content lifecycle phase thresholds
    this.PHASE_THRESHOLDS = {
      SEED_TO_EXPANSION: {
        min_saves: 10,
        min_shares: 5,
        min_value_sentiment: 0.6
      },
      EXPANSION_TO_EVERGREEN: {
        min_value_sentiment: 0.75,
        min_engagement_rate: 0.15,
        stability_period_hours: 48
      }
    };

    // Serendipity injection configuration
    this.SERENDIPITY_CONFIG = {
      default_injection_percentage: 0.10, // 10% of feed
      exploration_categories_limit: 5,
      bandit_learning_rate: 0.1
    };

    // Auto-start periodic lifecycle worker
    nexusgnnLifecycle.startPeriodicLifecycleWorker();
  }

  /**
   * Initialize or update graph node for an entity
   * @param {string} entityType - Type of entity (user, product, post, etc.)
   * @param {string} entityId - UUID of the entity
   * @param {object} metadata - Additional node properties
   * @returns {object} Created/updated node
   */
  async initializeGraphNode(entityType, entityId, metadata = {}) {
    try {
      const nodeType = this.mapEntityTypeToNodeType(entityType);

      // Extract initial 256D embedding vector
      const initialFeatures = gnnEngine.extractInitialFeatures({
        node_type: nodeType,
        entity_id: entityId,
        metadata
      });

      const result = await pool.query(
        `INSERT INTO nexusgnn_graph_nodes (node_type, entity_id, entity_type, metadata, embedding_vector)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (node_type, entity_id) 
         DO UPDATE SET 
           metadata = EXCLUDED.metadata, 
           embedding_vector = COALESCE(nexusgnn_graph_nodes.embedding_vector, EXCLUDED.embedding_vector),
           updated_at = NOW()
         RETURNING *`,
        [nodeType, entityId, entityType, JSON.stringify(metadata), initialFeatures.fused]
      );

      const node = result.rows[0];

      // Also ensure embedding record exists
      await pool.query(`
        INSERT INTO nexusgnn_embeddings (
          node_id, embedding_version, vector_dimension, embedding_data, visual_features, semantic_features, calculated_at, is_active
        ) VALUES ($1, 1, 256, $2, $3, $4, NOW(), TRUE)
        ON CONFLICT (node_id, embedding_version) DO NOTHING
      `, [
        node.id,
        initialFeatures.fused,
        JSON.stringify(initialFeatures.visual),
        JSON.stringify(initialFeatures.semantic)
      ]);

      return node;
    } catch (error) {
      logger.error('Error initializing graph node:', error);
      throw error;
    }
  }

  /**
   * Create graph edge between two nodes
   * @param {string} sourceEntityId - Source entity ID
   * @param {string} targetEntityId - Target entity ID
   * @param {string} edgeType - 'high_friction_social' or 'high_intent_functional'
   * @param {string} edgeSubtype - Specific interaction type
   * @param {number} weight - Edge weight (0-1)
   * @returns {object} Created edge
   */
  async createGraphEdge(sourceEntityId, targetEntityId, edgeType, edgeSubtype, weight = 1.0) {
    try {
      // Get or create nodes
      const sourceNode = await this.getOrCreateNode(sourceEntityId);
      const targetNode = await this.getOrCreateNode(targetEntityId, 'item');

      const result = await pool.query(
        `INSERT INTO nexusgnn_graph_edges (source_node_id, target_node_id, edge_type, edge_subtype, weight)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (source_node_id, target_node_id, edge_type, edge_subtype)
         DO UPDATE SET 
           interaction_count = nexusgnn_graph_edges.interaction_count + 1,
           last_interaction_at = NOW(),
           weight = GREATEST(nexusgnn_graph_edges.weight, $5),
           updated_at = NOW()
         RETURNING *`,
        [sourceNode.id, targetNode.id, edgeType, edgeSubtype, weight]
      );

      return result.rows[0];
    } catch (error) {
      logger.error('Error creating graph edge:', error);
      throw error;
    }
  }

  /**
   * Calculate NexusGNN match score R(u,i) for user and content
   * Formula: R(u,i) = α·I_bi(u,i) + β·[P_base(u,t) + S_vector] + γ·V_sent(i) + δ·Ω(d)
   */
  async calculateMatchScore(userId, contentId, contentType, weights = null) {
    try {
      const configWeights = weights || await this.getActiveAlgorithmWeights();

      // Calculate each component in parallel
      const [bipartiteInteraction, explorationPreference, valueSentiment, domainFreshness] = await Promise.all([
        this.calculateBipartiteInteraction(userId, contentId, contentType),
        this.calculateExplorationPreference(userId, contentType),
        this.calculateValueSentiment(contentId, contentType),
        this.calculateDomainFreshness(contentId, contentType)
      ]);

      // Apply formula: R(u,i) = α·I_bi + β·[P_base + S_vector] + γ·V_sent + δ·Ω(d)
      const finalScore =
        configWeights.alpha * bipartiteInteraction.score +
        configWeights.beta * explorationPreference.score +
        configWeights.gamma * valueSentiment.score +
        configWeights.delta * domainFreshness.score;

      const scoringResult = {
        userId,
        contentId,
        contentType,
        finalScore: Math.min(1.0, Math.max(0.0, finalScore)), // Clamp between 0-1
        components: {
          I_bi: bipartiteInteraction,
          P_base_plus_S: explorationPreference,
          V_sent: valueSentiment,
          Omega_d: domainFreshness
        },
        weights: configWeights,
        calculatedAt: new Date().toISOString()
      };

      // Cache the result
      await this.cacheMatchScore(scoringResult);

      return scoringResult;
    } catch (error) {
      logger.error('Error calculating match score:', error);
      throw error;
    }
  }

  /**
   * Find matches for a user using NexusGNN algorithm
   */
  async findMatches(userId, contentType = 'all', limit = 20, options = {}) {
    try {
      // 1. Get candidate content items
      const candidates = await this.getCandidateContent(userId, contentType, limit * 3);

      if (candidates.length === 0) {
        return [];
      }

      // 2. Calculate scores for all candidates
      const scoredCandidates = await Promise.all(
        candidates.map(async (candidate) => {
          const score = await this.calculateMatchScore(userId, candidate.id, candidate.type);
          return { ...candidate, score: score.finalScore, scoringDetails: score };
        })
      );

      // 3. Inject serendipity content
      const serendipitousContent = await this.injectSerendipity(userId, scoredCandidates, limit);

      // 4. Merge and sort by score
      const allContent = [...scoredCandidates, ...serendipitousContent];
      const rankedResults = allContent
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      // 5. Record analytics
      await this.recordMatchAnalytics(userId, rankedResults);

      return rankedResults;
    } catch (error) {
      logger.error('Error finding matches:', error);
      throw error;
    }
  }

  /**
   * Update content lifecycle phase based on engagement metrics
   */
  async updateContentLifecycle(contentId, contentType, metrics) {
    try {
      const lifecycle = await this.getContentLifecycle(contentId, contentType);

      if (!lifecycle) {
        return await this.initializeContentLifecycle(contentId, contentType);
      }

      let newPhase = lifecycle.current_phase;
      const phaseHistory = lifecycle.phase_history || [];

      // Phase transition logic
      switch (lifecycle.current_phase) {
      case 'seed_audience':
        if (this.shouldTransitionToExpansion(metrics)) {
          newPhase = 'lookalike_expansion';
          phaseHistory.push({
            phase: 'lookalike_expansion',
            timestamp: new Date().toISOString(),
            metrics
          });
        }
        break;

      case 'lookalike_expansion':
        if (this.shouldTransitionToEvergreen(lifecycle, metrics)) {
          newPhase = 'evergreen_discovery';
          phaseHistory.push({
            phase: 'evergreen_discovery',
            timestamp: new Date().toISOString(),
            metrics
          });
        }
        break;

      case 'evergreen_discovery':
        if (this.shouldArchiveContent(lifecycle, metrics)) {
          newPhase = 'archived';
          phaseHistory.push({
            phase: 'archived',
            timestamp: new Date().toISOString(),
            metrics
          });
        }
        break;
      }

      const result = await pool.query(
        `UPDATE nexusgnn_content_lifecycle 
         SET current_phase = $1,
             phase_history = $2,
             seed_audience_metrics = CASE WHEN $1 = 'seed_audience' THEN $3 ELSE seed_audience_metrics END,
             expansion_metrics = CASE WHEN $1 = 'lookalike_expansion' THEN $3 ELSE expansion_metrics END,
             evergreen_score = CASE WHEN $1 = 'evergreen_discovery' THEN $4 ELSE evergreen_score END,
             value_sentiment_score = $5,
             negative_scroll_velocity = $6,
             total_impressions = COALESCE(total_impressions, 0) + $7,
             total_saves = COALESCE(total_saves, 0) + $8,
             total_shares = COALESCE(total_shares, 0) + $9,
             entered_current_phase_at = CASE WHEN current_phase != $1 THEN NOW() ELSE entered_current_phase_at END,
             updated_at = NOW()
         WHERE content_id = $10 AND content_type = $11
         RETURNING *`,
        [
          newPhase,
          JSON.stringify(phaseHistory),
          JSON.stringify(metrics),
          metrics.evergreen_score || lifecycle.evergreen_score,
          metrics.value_sentiment_score || lifecycle.value_sentiment_score,
          metrics.negative_scroll_velocity || lifecycle.negative_scroll_velocity,
          metrics.impressions || 0,
          metrics.saves || 0,
          metrics.shares || 0,
          contentId,
          contentType
        ]
      );

      return result.rows[0];
    } catch (error) {
      logger.error('Error updating content lifecycle:', error);
      throw error;
    }
  }

  /**
   * Calculate Bipartite Interaction Matrix I_bi(u,i)
   * Fuses 256D PinSage GNN node embedding cosine similarity with historical graph edge proximity
   */
  async calculateBipartiteInteraction(userId, contentId, contentType) {
    try {
      // 1. Fetch historical graph edge interaction
      const edgeRes = await pool.query(
        `SELECT 
          COUNT(DISTINCT e.id) as interaction_count,
          AVG(e.weight) as avg_weight,
          MAX(e.last_interaction_at) as last_interaction
         FROM nexusgnn_graph_edges e
         JOIN nexusgnn_graph_nodes source ON e.source_node_id = source.id
         JOIN nexusgnn_graph_nodes target ON e.target_node_id = target.id
         WHERE (source.entity_id = $1 AND target.entity_id = $2)
            OR (target.entity_id = $1 AND source.entity_id = $2)`,
        [userId, contentId]
      );

      const row = edgeRes.rows[0] || {};
      const interactionCount = parseInt(row.interaction_count) || 0;
      const avgWeight = parseFloat(row.avg_weight) || 0;
      const graphEdgeScore = interactionCount > 0
        ? Math.min(1.0, (interactionCount * avgWeight) / 10)
        : 0.1;

      // 2. Fetch GNN 256D embeddings for user and content
      const [userEmb, contentEmb] = await Promise.all([
        gnnEngine.getEntityEmbedding(userId, 'user'),
        gnnEngine.getEntityEmbedding(contentId, contentType || 'post')
      ]);

      // 3. Compute PinSage Cosine Similarity in latent embedding space
      const embeddingSimilarity = gnnEngine.cosineSimilarity(userEmb, contentEmb);

      // 4. Fuse embedding vector similarity (60%) with collaborative interaction score (40%)
      const fusedScore = (0.6 * embeddingSimilarity) + (0.4 * graphEdgeScore);

      return {
        score: Math.min(1.0, Math.max(0.0, fusedScore)),
        embeddingSimilarity: Math.round(embeddingSimilarity * 1000) / 1000,
        interactionCount,
        averageWeight: avgWeight,
        lastInteraction: row.last_interaction
      };
    } catch (error) {
      logger.error('Error calculating bipartite interaction:', error);
      return { score: 0.5, embeddingSimilarity: 0.5, interactionCount: 0, averageWeight: 0 };
    }
  }

  /**
   * Calculate Exploration Preference Array P_base(u,t) + S_vector
   */
  async calculateExplorationPreference(userId, contentType) {
    try {
      const userPrefs = await pool.query(
        'SELECT preferences FROM users WHERE id = $1',
        [userId]
      );

      const serendipity = await pool.query(
        'SELECT * FROM nexusgnn_serendipity_vectors WHERE user_id = $1',
        [userId]
      );

      const basePreference = userPrefs.rows[0]?.preferences?.[contentType] || 0.5;
      const serendipityVector = serendipity.rows[0] || null;

      const serendipityBoost = serendipityVector
        ? this.calculateSerendipityBoost(serendipityVector, contentType)
        : 0;

      const score = Math.min(1.0, basePreference + serendipityBoost);

      return {
        score,
        basePreference,
        serendipityBoost,
        hasSerendipityVector: !!serendipityVector
      };
    } catch (error) {
      logger.error('Error calculating exploration preference:', error);
      return { score: 0.5, basePreference: 0.5, serendipityBoost: 0 };
    }
  }

  /**
   * Calculate Value Sentiment Score V_sent(i)
   */
  async calculateValueSentiment(contentId, contentType) {
    try {
      const result = await pool.query(
        `SELECT * FROM nexusgnn_sentiment_scores 
         WHERE content_id = $1 AND content_type = $2 
         ORDER BY calculated_at DESC 
         LIMIT 1`,
        [contentId, contentType]
      );

      if (result.rows.length === 0) {
        // Fallback to content lifecycle sentiment if available
        const lc = await this.getContentLifecycle(contentId, contentType);
        const base = lc ? parseFloat(lc.value_sentiment_score) || 0.6 : 0.6;
        return { score: base, sentiment: base, commentCount: 0 };
      }

      const sentiment = result.rows[0];
      const negativeVelocity = parseFloat(sentiment.negative_scroll_velocity) || 0;
      const overallSentiment = parseFloat(sentiment.overall_sentiment) || 0.6;

      const score = Math.max(0, overallSentiment * (1 - negativeVelocity));

      return {
        score: Math.min(1.0, score),
        sentiment: overallSentiment,
        commentCount: sentiment.comment_count,
        longFormInsights: sentiment.long_form_insights,
        socialFrictionScore: parseFloat(sentiment.social_friction_score) || 0,
        negativeScrollVelocity: negativeVelocity
      };
    } catch (error) {
      logger.error('Error calculating value sentiment:', error);
      return { score: 0.6, sentiment: 0.6, commentCount: 0 };
    }
  }

  /**
   * Calculate Domain & Freshness Quality Metric Ω(d)
   */
  async calculateDomainFreshness(contentId, contentType) {
    try {
      const content = await this.getContentMetadata(contentId, contentType);

      if (!content) {
        return { score: 0.5, domainAuthority: 0.5, freshness: 0.5 };
      }

      const domainAuthority = content.domain_authority || 0.7;
      const createdAt = new Date(content.created_at || Date.now());
      const ageInHours = Math.max(0, (Date.now() - createdAt.getTime()) / (1000 * 60 * 60));
      const freshness = Math.exp(-ageInHours / 168); // Half-life of 1 week

      const score = (domainAuthority * 0.6) + (freshness * 0.4);

      return {
        score: Math.min(1.0, score),
        domainAuthority,
        freshness,
        ageInHours
      };
    } catch (error) {
      logger.error('Error calculating domain freshness:', error);
      return { score: 0.5, domainAuthority: 0.5, freshness: 0.5 };
    }
  }

  /**
   * Inject serendipitous content into results using multi-armed bandit
   */
  async injectSerendipity(userId, currentResults, limit) {
    try {
      let serendipityConfig = await pool.query(
        'SELECT * FROM nexusgnn_serendipity_vectors WHERE user_id = $1',
        [userId]
      );

      if (serendipityConfig.rows.length === 0) {
        await this.initializeSerendipityVector(userId);
        serendipityConfig = await pool.query(
          'SELECT * FROM nexusgnn_serendipity_vectors WHERE user_id = $1',
          [userId]
        );
      }

      const config = serendipityConfig.rows[0];
      const injectionCount = Math.max(1, Math.ceil(limit * (config?.injection_percentage || 0.1)));
      const activeCats = Array.isArray(config?.active_categories)
        ? config.active_categories
        : ['technology', 'design', 'lifestyle'];

      const serendipitousContent = await pool.query(
        `SELECT p.*, ncl.current_phase, ncl.value_sentiment_score
         FROM posts p
         JOIN nexusgnn_content_lifecycle ncl ON p.id::text = ncl.content_id::text AND ncl.content_type = 'post'
         WHERE ncl.current_phase IN ('evergreen_discovery', 'lookalike_expansion')
           AND p.category = ANY($1::text[])
           AND p.author_id != $2
         ORDER BY ncl.value_sentiment_score DESC
         LIMIT $3`,
        [activeCats, userId, injectionCount]
      );

      await this.updateBanditState(userId, serendipitousContent.rows);

      return serendipitousContent.rows.map(item => ({
        ...item,
        isSerendipitous: true,
        score: 0.75
      }));
    } catch (error) {
      logger.error('Error injecting serendipity:', error);
      return [];
    }
  }

  async initializeSerendipityVector(userId) {
    try {
      await pool.query(
        `INSERT INTO nexusgnn_serendipity_vectors (user_id, vector_data, injection_percentage, active_categories)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id) DO NOTHING`,
        [
          userId,
          JSON.stringify(this.SERENDIPITY_CONFIG),
          this.SERENDIPITY_CONFIG.default_injection_percentage,
          JSON.stringify(['technology', 'design', 'lifestyle', 'education'])
        ]
      );
    } catch (error) {
      logger.error('Error initializing serendipity vector:', error);
    }
  }

  async updateBanditState(userId, serendipitousContent) {
    try {
      await pool.query(
        `UPDATE nexusgnn_serendipity_vectors 
         SET total_injections = total_injections + $1,
             updated_at = NOW()
         WHERE user_id = $2`,
        [serendipitousContent.length, userId]
      );
    } catch (error) {
      logger.error('Error updating bandit state:', error);
    }
  }

  calculateSerendipityBoost(serendipityVector, contentType) {
    const activeCategories = serendipityVector.active_categories || [];
    const isInActiveCategory = activeCategories.includes(contentType);
    return isInActiveCategory ? 0.15 : 0;
  }

  shouldTransitionToExpansion(metrics) {
    return (
      (metrics.saves || 0) >= this.PHASE_THRESHOLDS.SEED_TO_EXPANSION.min_saves &&
      (metrics.shares || 0) >= this.PHASE_THRESHOLDS.SEED_TO_EXPANSION.min_shares &&
      (metrics.value_sentiment_score || 0) >= this.PHASE_THRESHOLDS.SEED_TO_EXPANSION.min_value_sentiment
    );
  }

  shouldTransitionToEvergreen(lifecycle, metrics) {
    const hoursInPhase = lifecycle.entered_current_phase_at
      ? (Date.now() - new Date(lifecycle.entered_current_phase_at).getTime()) / (1000 * 60 * 60)
      : 0;

    return (
      (metrics.value_sentiment_score || 0) >= this.PHASE_THRESHOLDS.EXPANSION_TO_EVERGREEN.min_value_sentiment &&
      hoursInPhase >= this.PHASE_THRESHOLDS.EXPANSION_TO_EVERGREEN.stability_period_hours
    );
  }

  shouldArchiveContent(lifecycle, metrics) {
    const evergreenScore = parseFloat(lifecycle.evergreen_score) || 0;
    return evergreenScore < 0.3 && (metrics.impressions || 0) > 1000;
  }

  mapEntityTypeToNodeType(entityType) {
    const mapping = {
      user: 'user',
      product: 'item',
      post: 'item',
      pin: 'item',
      collection: 'board',
      board: 'board',
      group: 'group',
      community: 'group'
    };
    return mapping[entityType] || 'item';
  }

  async getOrCreateNode(entityId, entityType = 'user') {
    const existing = await pool.query(
      'SELECT * FROM nexusgnn_graph_nodes WHERE entity_id = $1 AND entity_type = $2',
      [entityId, entityType]
    );

    if (existing.rows.length > 0) {
      return existing.rows[0];
    }

    return await this.initializeGraphNode(entityType, entityId);
  }

  async getCandidateContent(userId, contentType, limit) {
    const query = contentType === 'all'
      ? 'SELECT id, \'post\' as type, title, content, created_at FROM posts WHERE author_id != $1 ORDER BY created_at DESC LIMIT $2'
      : 'SELECT id, $2 as type, title, content, created_at FROM posts WHERE category = $2 AND author_id != $1 ORDER BY created_at DESC LIMIT $3';

    const params = contentType === 'all' ? [userId, limit] : [userId, contentType, limit];
    const result = await pool.query(query, params);

    return result.rows;
  }

  async getContentLifecycle(contentId, contentType) {
    const result = await pool.query(
      'SELECT * FROM nexusgnn_content_lifecycle WHERE content_id = $1 AND content_type = $2',
      [contentId, contentType]
    );
    return result.rows[0] || null;
  }

  async initializeContentLifecycle(contentId, contentType) {
    const result = await pool.query(
      `INSERT INTO nexusgnn_content_lifecycle (content_id, content_type, current_phase, value_sentiment_score, evergreen_score)
       VALUES ($1, $2, 'seed_audience', 0.6, 0.5)
       ON CONFLICT (content_id, content_type) DO UPDATE SET updated_at = NOW()
       RETURNING *`,
      [contentId, contentType]
    );
    return result.rows[0];
  }

  async cacheMatchScore(scoringResult) {
    try {
      await pool.query(
        `INSERT INTO nexusgnn_match_scores (user_id, content_id, content_type, final_score, component_scores, scoring_weights, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW() + INTERVAL '1 hour')
         ON CONFLICT (user_id, content_id, content_type)
         DO UPDATE SET 
           final_score = EXCLUDED.final_score,
           component_scores = EXCLUDED.component_scores,
           scoring_weights = EXCLUDED.scoring_weights,
           calculated_at = NOW(),
           expires_at = NOW() + INTERVAL '1 hour'`,
        [
          scoringResult.userId,
          scoringResult.contentId,
          scoringResult.contentType,
          scoringResult.finalScore,
          JSON.stringify(scoringResult.components),
          JSON.stringify(scoringResult.weights)
        ]
      );
    } catch (error) {
      logger.error('Error caching match score:', error);
    }
  }

  async getActiveAlgorithmWeights() {
    const result = await pool.query(
      'SELECT weights FROM nexusgnn_algorithm_config WHERE is_active = TRUE ORDER BY version DESC LIMIT 1'
    );

    return result.rows[0]?.weights || this.DEFAULT_WEIGHTS;
  }

  async getContentMetadata(contentId, contentType) {
    const result = await pool.query(
      'SELECT *, created_at FROM posts WHERE id = $1',
      [contentId]
    );
    return result.rows[0] || null;
  }

  async recordMatchAnalytics(userId, results) {
    try {
      await pool.query(
        `INSERT INTO nexusgnn_performance_analytics (metric_type, metric_value, metadata)
         VALUES ('matches_generated', $1, $2)`,
        [results.length, JSON.stringify({ userId, resultCount: results.length })]
      );
    } catch (error) {
      logger.error('Error recording analytics:', error);
    }
  }
}

module.exports = new NexusGNNService();
