/* eslint-disable no-unused-vars */
const logger = require('../utils/logger');
/**
 * RecommendationService
 * ML-based recommendation engine using collaborative filtering, content-based approaches, and caching
 */

const pool = require('../database/connection');

class RecommendationService {
  constructor() {
    // In-memory stores for real-time recommendation logic
    this.userInteractions = new Map();
    this.itemSimilarities = new Map();
    this.recommendationCache = new Map();

    // Configuration
    this.config = {
      cacheTTL: 30 * 60 * 1000, // 30 minutes
      minInteractions: 5,
      similarityThreshold: 0.3,
      maxRecommendations: 20
    };
  }

  /**
   * Get personalized recommendations for user
   */
  async getRecommendations(userId, options = {}) {
    const { limit = 10, type = 'all', excludeSeen = true } = options;

    try {
      // Check cache first
      const cacheKey = `recommendations:${userId}:${type}`;
      if (this.recommendationCache.has(cacheKey)) {
        const cached = this.recommendationCache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.config.cacheTTL) {
          logger.info(`✅ Cache hit for user ${userId} recommendations`);
          return cached.data;
        }
      }

      // Get user interaction history
      const interactions = await this.getUserInteractions(userId);

      if (interactions.length < this.config.minInteractions) {
        // Cold start: return trending/popular content
        logger.info(`⚠️ Cold start for user ${userId} returning trending content`);
        const trending = await this.getTrendingContent(limit);
        this.cacheRecommendations(cacheKey, trending);
        return trending;
      }

      // Generate recommendations using collaborative filtering
      const recommendations = await this.generateCollaborativeRecommendations(
        userId,
        interactions,
        limit
      );

      // Filter out already seen content if requested
      let filteredRecommendations = recommendations;
      if (excludeSeen) {
        const seenIds = new Set(interactions.map(i => i.itemId));
        filteredRecommendations = recommendations.filter(r => !seenIds.has(r.id));
      }

      // Cache results
      this.cacheRecommendations(cacheKey, filteredRecommendations.slice(0, limit));

      logger.info(`✅ Generated ${filteredRecommendations.length} recommendations for user ${userId}`);
      return filteredRecommendations.slice(0, limit);
    } catch (error) {
      logger.error('❌ Get recommendations failed:', error.message);
      // Fallback to trending
      return await this.getTrendingContent(limit);
    }
  }

  /**
   * Record user interaction for recommendation engine
   */
  async recordInteraction(userId, itemId, interactionType, value = 1) {
    try {
      const key = `user:${userId}`;
      if (!this.userInteractions.has(key)) {
        this.userInteractions.set(key, []);
      }

      const interactions = this.userInteractions.get(key);
      interactions.push({
        itemId,
        type: interactionType, // 'view', 'like', 'share', 'comment', 'purchase'
        value,
        timestamp: Date.now()
      });

      // Keep only recent interactions (last 1000)
      if (interactions.length > 1000) {
        interactions.splice(0, interactions.length - 1000);
      }

      // Invalidate cache for this user
      this.invalidateUserCache(userId);

      // Persist to database asynchronously (fire and forget or await depending on requirements)
      this.persistInteractionToDB(userId, itemId, interactionType, value).catch(err => {
        logger.error('Failed to persist interaction to DB:', err);
      });

      logger.info(`📊 Recorded ${interactionType} interaction: user ${userId} -> item ${itemId}`);
    } catch (error) {
      logger.error('❌ Record interaction failed:', error.message);
    }
  }

  /**
   * Get similar items based on content/features
   */
  async getSimilarItems(itemId, limit = 10) {
    try {
      const cacheKey = `similar:${itemId}`;
      if (this.recommendationCache.has(cacheKey)) {
        return this.recommendationCache.get(cacheKey);
      }

      // Calculate item similarities using content-based filtering
      const similarities = await this.calculateItemSimilarities(itemId);

      // Filter by threshold and sort
      const similarItems = similarities
        .filter(s => s.score >= this.config.similarityThreshold)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      this.recommendationCache.set(cacheKey, similarItems);

      return similarItems;
    } catch (error) {
      logger.error('❌ Get similar items failed:', error.message);
      return [];
    }
  }

  /**
   * Get trending/popular content (cold start fallback)
   */
  async getTrendingContent(limit = 10) {
    try {
      const query = `
        SELECT p.*, 
               (p.like_count * 1 + p.comment_count * 2 + p.view_count * 0.1) as trending_score
        FROM posts p
        WHERE p.status = 'published'
          AND p.created_at > NOW() - INTERVAL '7 days'
        ORDER BY trending_score DESC
        LIMIT $1
      `;

      const result = await pool.query(query, [limit]);

      // Map DB rows to expected format if necessary
      const trending = result.rows.map(row => ({
        id: row.id,
        title: row.title,
        score: row.trending_score,
        type: 'post'
      }));

      logger.info(`🔥 Returning ${trending.length} trending items`);
      return trending;
    } catch (error) {
      logger.error('❌ Get trending failed:', error.message);
      return [];
    }
  }

  /**
   * Generate collaborative filtering recommendations
   */
  async generateCollaborativeRecommendations(userId, userInteractions, limit) {
    try {
      // Find users with similar tastes
      const similarUsers = await this.findSimilarUsers(userId, userInteractions);

      // Aggregate items liked by similar users
      const candidateItems = new Map();

      for (const similarUser of similarUsers) {
        const theirInteractions = await this.getUserInteractions(similarUser.userId);

        for (const interaction of theirInteractions) {
          if (!candidateItems.has(interaction.itemId)) {
            candidateItems.set(interaction.itemId, {
              itemId: interaction.itemId,
              score: 0,
              interactions: []
            });
          }

          const item = candidateItems.get(interaction.itemId);
          item.score += interaction.value * similarUser.similarity;
          item.interactions.push(interaction);
        }
      }

      // Sort by score and return top items
      const recommendations = Array.from(candidateItems.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      // Enrich with full item details from database if needed
      // For now, we return the structure expected by the frontend/cache
      return recommendations.map(r => ({
        id: r.itemId,
        score: r.score,
        type: 'recommended'
      }));
    } catch (error) {
      logger.error('❌ Collaborative recommendations failed:', error.message);
      return [];
    }
  }

  /**
   * Find users with similar interaction patterns
   */
  async findSimilarUsers(userId, userInteractions, limit = 20) {
    try {
      // Calculate similarity scores with other users
      const allUsers = Array.from(this.userInteractions.keys());
      const similarities = [];

      for (const otherUserKey of allUsers) {
        const otherUserId = otherUserKey.replace('user:', '');
        if (otherUserId === userId) continue;

        const otherInteractions = this.userInteractions.get(otherUserKey);
        const similarity = this.calculateUserSimilarity(userInteractions, otherInteractions);

        if (similarity > 0.1) {
          similarities.push({
            userId: otherUserId,
            similarity
          });
        }
      }

      // Sort by similarity and return top matches
      return similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
    } catch (error) {
      logger.error('❌ Find similar users failed:', error.message);
      return [];
    }
  }

  /**
   * Calculate similarity between two users using Jaccard index
   */
  calculateUserSimilarity(userAInteractions, userBInteractions) {
    if (!userAInteractions || !userBInteractions) return 0;

    const itemsA = new Set(userAInteractions.map(i => i.itemId));
    const itemsB = new Set(userBInteractions.map(i => i.itemId));

    // Intersection
    const intersection = new Set([...itemsA].filter(x => itemsB.has(x)));

    // Union
    const union = new Set([...itemsA, ...itemsB]);

    if (union.size === 0) return 0;

    return intersection.size / union.size;
  }

  /**
   * Calculate item similarities using collaborative filtering
   */
  async calculateItemSimilarities(itemId) {
    try {
      // Use collaborative filtering: items liked by same users are similar
      const query = `
        WITH target_item_users AS (
          SELECT DISTINCT user_id 
          FROM recommendation_interactions 
          WHERE item_id = $1 AND action IN ('like', 'purchase')
        ),
        similar_items AS (
          SELECT 
            ri.item_id,
            COUNT(DISTINCT ri.user_id) as co_occurrence_count,
            COUNT(DISTINCT ri.user_id)::float / NULLIF((SELECT COUNT(*) FROM target_item_users), 0) as jaccard_score
          FROM recommendation_interactions ri
          INNER JOIN target_item_users tiu ON ri.user_id = tiu.user_id
          WHERE ri.item_id != $1
            AND ri.action IN ('like', 'purchase')
          GROUP BY ri.item_id
          HAVING COUNT(DISTINCT ri.user_id) >= 2
          ORDER BY jaccard_score DESC
          LIMIT 20
        )
        SELECT 
          sa.item_id,
          sa.jaccard_score as score,
          p.title,
          p.category
        FROM similar_items sa
        LEFT JOIN posts p ON sa.item_id::uuid = p.id
        ORDER BY sa.jaccard_score DESC
      `;

      const result = await pool.query(query, [itemId]);

      const similarities = result.rows.map(row => ({
        itemId: row.item_id,
        score: parseFloat(row.score) || 0,
        title: row.title,
        category: row.category
      }));

      logger.info(`🔍 Calculated ${similarities.length} similar items for ${itemId}`);
      return similarities;
    } catch (error) {
      logger.error('❌ Item similarity calculation failed:', error.message);
      // Fallback to trending if calculation fails
      return [];
    }
  }

  /**
   * Get user interaction history
   * Combines in-memory recent interactions with DB history if needed
   */
  async getUserInteractions(userId) {
    const key = `user:${userId}`;
    const memoryInteractions = this.userInteractions.get(key) || [];

    // If we have enough recent interactions in memory, use them for speed
    // Otherwise, fetch from DB (and potentially populate memory)
    if (memoryInteractions.length > 0) {
      return memoryInteractions;
    }

    // Fallback to DB for cold start or initial load
    try {
      const query = `
        SELECT post_id as "itemId", 'like' as type, created_at as "timestamp"
        FROM likes
        WHERE user_id = $1
        
        UNION ALL
        
        SELECT post_id as "itemId", 'view' as type, viewed_at as "timestamp"
        FROM post_views
        WHERE user_id = $1
        
        UNION ALL
        
        SELECT post_id as "itemId", 'comment' as type, created_at as "timestamp"
        FROM comments
        WHERE user_id = $1
        
        ORDER BY "timestamp" DESC
        LIMIT 100
      `;

      const result = await pool.query(query, [userId]);

      // Normalize DB rows to match in-memory structure
      const dbInteractions = result.rows.map(row => ({
        itemId: row.itemId,
        type: row.type,
        value: 1,
        timestamp: new Date(row.timestamp).getTime()
      }));

      // Populate memory for next time
      if (dbInteractions.length > 0) {
        this.userInteractions.set(key, dbInteractions);
      }

      return dbInteractions;
    } catch (error) {
      logger.error('Error getting user interactions from DB:', error);
      return [];
    }
  }

  /**
   * Cache recommendations
   */
  cacheRecommendations(cacheKey, data) {
    this.recommendationCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Invalidate user's recommendation cache
   */
  invalidateUserCache(userId) {
    const keysToDelete = [];
    for (const key of this.recommendationCache.keys()) {
      if (key.startsWith(`recommendations:${userId}:`)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => this.recommendationCache.delete(key));
  }

  /**
   * Persist interaction to database
   */
  async persistInteractionToDB(userId, itemId, interactionType, value) {
    await pool.query(
      `INSERT INTO recommendation_interactions (user_id, item_id, item_type, action, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (user_id, item_id, item_type, action) DO NOTHING`,
      [userId, itemId, 'post', interactionType] // Assuming item_type is generic or needs mapping
    );
  }

  /**
   * Train recommendation model (periodic batch job)
   */
  async trainModel() {
    logger.info('🤖 Training recommendation model...');

    try {
      // Step 1: Load all user interactions from database
      const interactionsQuery = `
        SELECT user_id, item_id, action, created_at
        FROM recommendation_interactions
        WHERE created_at > NOW() - INTERVAL '30 days'
        ORDER BY created_at DESC
      `;

      const interactionsResult = await pool.query(interactionsQuery);
      const interactions = interactionsResult.rows;

      logger.info(`📊 Loaded ${interactions.length} interactions for training`);

      if (interactions.length === 0) {
        logger.info('⚠️ No interactions found for training');
        return;
      }

      // Step 2: Build user-item interaction matrix
      const userItemMatrix = new Map();
      const itemCounts = new Map();

      interactions.forEach(interaction => {
        const userId = interaction.user_id;
        const itemId = interaction.item_id;

        if (!userItemMatrix.has(userId)) {
          userItemMatrix.set(userId, new Set());
        }
        userItemMatrix.get(userId).add(itemId);

        itemCounts.set(itemId, (itemCounts.get(itemId) || 0) + 1);
      });

      logger.info(`📊 Built matrix: ${userItemMatrix.size} users, ${itemCounts.size} items`);

      // Step 3: Calculate item co-occurrence similarities
      const itemSimilarities = new Map();
      const items = Array.from(itemCounts.keys());

      // For each pair of items, calculate Jaccard similarity
      for (let i = 0; i < Math.min(items.length, 100); i++) { // Limit to top 100 items for performance
        const itemA = items[i];
        const usersA = new Set();

        // Find users who interacted with itemA
        interactions.forEach(interaction => {
          if (interaction.item_id === itemA) {
            usersA.add(interaction.user_id);
          }
        });

        if (usersA.size < 2) continue; // Skip items with too few interactions

        const similarities = [];

        for (let j = 0; j < Math.min(items.length, 100); j++) {
          if (i === j) continue;

          const itemB = items[j];
          const usersB = new Set();

          interactions.forEach(interaction => {
            if (interaction.item_id === itemB) {
              usersB.add(interaction.user_id);
            }
          });

          if (usersB.size < 2) continue;

          // Calculate Jaccard similarity
          const intersection = new Set([...usersA].filter(x => usersB.has(x)));
          const union = new Set([...usersA, ...usersB]);

          if (union.size > 0) {
            const similarity = intersection.size / union.size;

            if (similarity >= this.config.similarityThreshold) {
              similarities.push({
                itemId: itemB,
                score: similarity
              });
            }
          }
        }

        // Store top 10 similar items
        itemSimilarities.set(itemA, similarities
          .sort((a, b) => b.score - a.score)
          .slice(0, 10)
        );
      }

      // Step 4: Update in-memory caches
      this.itemSimilarities.clear();
      itemSimilarities.forEach((similarities, itemId) => {
        this.itemSimilarities.set(itemId, similarities);
      });

      logger.info(`✅ Model training completed: ${itemSimilarities.size} items with similarities`);

      // Step 5: Persist popular recommendations to cache
      await this.cachePopularItems();

    } catch (error) {
      logger.error('❌ Model training failed:', error.message);
      throw error;
    }
  }

  /**
   * Cache popular/trending items for cold start
   */
  async cachePopularItems() {
    try {
      const query = `
        SELECT 
          p.id,
          p.title,
          p.category,
          (p.like_count * 1 + p.comment_count * 2 + p.view_count * 0.1) as popularity_score
        FROM posts p
        WHERE p.status = 'published'
          AND p.created_at > NOW() - INTERVAL '7 days'
        ORDER BY popularity_score DESC
        LIMIT 50
      `;

      const result = await pool.query(query);

      const popularItems = result.rows.map(row => ({
        id: row.id,
        title: row.title,
        category: row.category,
        score: parseFloat(row.popularity_score),
        type: 'post'
      }));

      this.recommendationCache.set('trending:all', {
        data: popularItems,
        timestamp: Date.now()
      });

      logger.info(`🔥 Cached ${popularItems.length} popular items`);
    } catch (error) {
      logger.error('❌ Failed to cache popular items:', error.message);
    }
  }

  /**
   * Get recommendation statistics
   */
  getStats() {
    return {
      totalUsers: this.userInteractions.size,
      cacheSize: this.recommendationCache.size,
      avgInteractionsPerUser: Array.from(this.userInteractions.values())
        .reduce((sum, interactions) => sum + interactions.length, 0) /
        Math.max(this.userInteractions.size, 1)
    };
  }
}

module.exports = new RecommendationService();
