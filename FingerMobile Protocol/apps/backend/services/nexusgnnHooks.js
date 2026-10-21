/**
 * NexusGNN Platform Event Hooks
 * Automatically updates graph nodes, edges, sentiment, and content lifecycle
 * whenever interactions occur across the FingerMobile platform.
 */

const { pool } = require('../db');
const logger = require('../utils/logger');
const nexusgnnService = require('./nexusgnn');

class NexusGNNHooks {
  /**
   * Hook called when new content is created (Post, Product, Pin, Course)
   */
  async onContentCreated({ contentId, contentType, authorId, metadata = {} }) {
    try {
      // 1. Ensure author node exists
      if (authorId) {
        await nexusgnnService.initializeGraphNode('user', authorId, { role: 'creator' });
      }

      // 2. Create content node
      const contentNode = await nexusgnnService.initializeGraphNode(contentType, contentId, metadata);

      // 3. Connect author to content with high-friction social edge
      if (authorId && contentNode) {
        await nexusgnnService.createGraphEdge(
          authorId,
          contentId,
          'high_friction_social',
          'collaborative_add',
          1.0
        );
      }

      // 4. Initialize content lifecycle at Phase 1: High-Intent Seed Audience
      await pool.query(`
        INSERT INTO nexusgnn_content_lifecycle (
          content_id,
          content_type,
          current_phase,
          seed_audience_metrics,
          total_impressions,
          total_saves,
          total_shares,
          value_sentiment_score,
          evergreen_score
        ) VALUES ($1, $2, 'seed_audience', '{"initialSeed": true}', 1, 0, 0, 0.5, 0.5)
        ON CONFLICT (content_id, content_type) DO NOTHING
      `, [contentId, contentType]);

      logger.info(`NexusGNN Hook: initialized node & lifecycle for ${contentType}:${contentId}`);
    } catch (error) {
      logger.error('Error in onContentCreated hook:', error);
    }
  }

  /**
   * Hook called on user interaction (save, share, click, checkout, like)
   */
  async onUserInteraction({ userId, contentId, contentType = 'post', actionType }) {
    try {
      if (!userId || !contentId) return;

      const isFunctional = ['save', 'click', 'checkout', 'like'].includes(actionType);
      const edgeType = isFunctional ? 'high_intent_functional' : 'high_friction_social';
      
      const weightMap = {
        save: 0.9,
        checkout: 1.0,
        click: 0.4,
        like: 0.3,
        share: 0.95,
        reply: 0.8
      };
      const weight = weightMap[actionType] || 0.5;

      // Ensure nodes and edge exist
      await nexusgnnService.createGraphEdge(userId, contentId, edgeType, actionType, weight);

      // Update lifecycle metrics
      const updateFields = [];
      const updateValues = [];
      let idx = 1;

      if (actionType === 'save') {
        updateFields.push(`total_saves = COALESCE(total_saves, 0) + 1`);
      } else if (actionType === 'share') {
        updateFields.push(`total_shares = COALESCE(total_shares, 0) + 1`);
      } else if (actionType === 'click' || actionType === 'view') {
        updateFields.push(`total_impressions = COALESCE(total_impressions, 0) + 1`);
      }

      if (updateFields.length > 0) {
        updateValues.push(contentId, contentType);
        await pool.query(`
          UPDATE nexusgnn_content_lifecycle
          SET ${updateFields.join(', ')}, updated_at = NOW()
          WHERE content_id = $1 AND content_type = $2
        `, updateValues);
      }

      logger.info(`NexusGNN Hook: recorded ${actionType} from user ${userId} to ${contentId}`);
    } catch (error) {
      logger.error('Error in onUserInteraction hook:', error);
    }
  }

  /**
   * Hook called on content comment
   */
  async onCommentAdded({ userId, contentId, contentType = 'post', commentText }) {
    try {
      if (!userId || !contentId) return;

      // 1. Calculate approximate sentiment from text (positive vs negative keyword score)
      const positiveWords = ['great', 'awesome', 'helpful', 'love', 'amazing', 'excellent', 'valuable', 'insightful', 'inspired', 'beautiful'];
      const negativeWords = ['terrible', 'bad', 'useless', 'clickbait', 'hate', 'boring', 'awful', 'waste', 'misleading', 'worst'];
      
      const lower = (commentText || '').toLowerCase();
      let posCount = 0;
      let negCount = 0;
      positiveWords.forEach(w => { if (lower.includes(w)) posCount++; });
      negativeWords.forEach(w => { if (lower.includes(w)) negCount++; });

      let sentimentScore = 0.5; // neutral baseline
      if (posCount + negCount > 0) {
        sentimentScore = Math.max(0, Math.min(1, 0.5 + (posCount - negCount) * 0.2));
      }

      // 2. High-friction social edge for long-form comments
      const isLongForm = (commentText || '').length > 50;
      await nexusgnnService.createGraphEdge(
        userId,
        contentId,
        'high_friction_social',
        isLongForm ? 'long_form_reply' : 'reply',
        isLongForm ? 0.85 : 0.6
      );

      // 3. Upsert sentiment score record
      await pool.query(`
        INSERT INTO nexusgnn_sentiment_scores (
          content_id,
          content_type,
          overall_sentiment,
          comment_count,
          long_form_insights,
          calculated_at
        ) VALUES ($1, $2, $3, 1, $4, NOW())
        ON CONFLICT (content_id, content_type, calculated_at) DO NOTHING
      `, [contentId, contentType, sentimentScore, isLongForm ? 1 : 0]);

      // 4. Update running sentiment score in content lifecycle
      await pool.query(`
        UPDATE nexusgnn_content_lifecycle
        SET value_sentiment_score = (COALESCE(value_sentiment_score, 0.5) * 0.7) + ($1 * 0.3),
            updated_at = NOW()
        WHERE content_id = $2 AND content_type = $3
      `, [sentimentScore, contentId, contentType]);

      logger.info(`NexusGNN Hook: processed comment for ${contentId}, sentiment: ${sentimentScore}`);
    } catch (error) {
      logger.error('Error in onCommentAdded hook:', error);
    }
  }
}

module.exports = new NexusGNNHooks();
