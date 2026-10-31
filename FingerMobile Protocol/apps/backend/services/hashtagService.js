const { pool } = require('../db');
const logger = require('../utils/logger');

class HashtagService {
  /**
   * Extract unique lowercase hashtags from text content
   * @param {string} text
   * @returns {string[]}
   */
  extractHashtags(text) {
    if (!text || typeof text !== 'string') return [];
    // Match #tag while avoiding trailing punctuation
    const matches = text.match(/#([a-zA-Z0-9_]+)/g);
    if (!matches) return [];

    const uniqueTags = new Set(
      matches.map(tag => tag.replace(/^#/, '').toLowerCase().trim()).filter(Boolean)
    );
    return Array.from(uniqueTags);
  }

  /**
   * Ingestion pipeline: parses hashtags, upserts into hashtags table,
   * maps them to post_hashtags, and tracks usage velocity.
   * @param {string} postId
   * @param {string} text
   * @param {string} [category='general']
   */
  async associatePostWithHashtags(postId, text, category = 'general') {
    const tags = this.extractHashtags(text);
    if (!tags.length || !postId) return [];

    const client = await pool.connect();
    const recordedTags = [];

    try {
      await client.query('BEGIN');

      for (const tag of tags) {
        // 1. Upsert into hashtags table
        const upsertTagQuery = `
          INSERT INTO hashtags (name, category, usage_count, updated_at)
          VALUES ($1, $2, 1, NOW())
          ON CONFLICT (name)
          DO UPDATE SET
            usage_count = hashtags.usage_count + 1,
            updated_at = NOW()
          RETURNING id, name, usage_count;
        `;
        const tagResult = await client.query(upsertTagQuery, [tag, category]);
        const hashtagRow = tagResult.rows[0];

        // 2. Link in post_hashtags junction table
        const linkQuery = `
          INSERT INTO post_hashtags (post_id, hashtag_id, created_at)
          VALUES ($1, $2, NOW())
          ON CONFLICT (post_id, hashtag_id) DO NOTHING;
        `;
        await client.query(linkQuery, [postId, hashtagRow.id]);

        // 3. Update legacy hashtag_usage if table exists
        await client.query(`
          INSERT INTO hashtag_usage (hashtag, usage_count, last_used_at)
          VALUES ($1, 1, NOW())
          ON CONFLICT (hashtag)
          DO UPDATE SET
            usage_count = hashtag_usage.usage_count + 1,
            last_used_at = NOW();
        `).catch(() => {}); // non-blocking for optional compatibility table

        recordedTags.push({
          id: hashtagRow.id,
          name: hashtagRow.name,
          usageCount: hashtagRow.usage_count
        });
      }

      await client.query('COMMIT');
      logger.info(`[HashtagService] Successfully indexed ${recordedTags.length} hashtags for post ${postId}`);
      return recordedTags;
    } catch (err) {
      await client.query('ROLLBACK');
      logger.error(`[HashtagService] Error indexing hashtags for post ${postId}:`, err);
      return [];
    } finally {
      client.release();
    }
  }

  /**
   * Get top trending hashtags across the platform
   * @param {number} [limit=10]
   * @param {string} [category]
   */
  async getTrendingHashtags(limit = 10, category = null) {
    try {
      let query = `
        SELECT id, name, category, usage_count, updated_at
        FROM hashtags
      `;
      const params = [];

      if (category && category !== 'all') {
        params.push(category);
        query += ` WHERE category = $1`;
      }

      params.push(limit);
      query += ` ORDER BY usage_count DESC LIMIT $${params.length}`;

      const res = await pool.query(query, params);
      return res.rows.map(r => ({
        id: r.id,
        tag: `#${r.name}`,
        rawTag: r.name,
        category: r.category,
        usageCount: r.usage_count,
        updatedAt: r.updated_at
      }));
    } catch (err) {
      logger.error('[HashtagService] Failed to retrieve trending hashtags:', err);
      return [];
    }
  }

  /**
   * Fast indexed search of posts by hashtag using composite index (hashtag_id, post_id)
   * @param {string} tag
   * @param {number} [limit=20]
   * @param {number} [offset=0]
   */
  async getPostsByHashtag(tag, limit = 20, offset = 0) {
    const cleanTag = tag.replace(/^#/, '').toLowerCase().trim();
    try {
      const query = `
        SELECT
          p.*,
          h.name AS matched_hashtag,
          h.id AS hashtag_id
        FROM posts p
        JOIN post_hashtags ph ON p.id = ph.post_id
        JOIN hashtags h ON ph.hashtag_id = h.id
        WHERE LOWER(h.name) = $1
        ORDER BY p.created_at DESC
        LIMIT $2 OFFSET $3;
      `;
      const res = await pool.query(query, [cleanTag, limit, offset]);
      return res.rows;
    } catch (err) {
      logger.error(`[HashtagService] Failed to search posts for #${cleanTag}:`, err);
      return [];
    }
  }
}

module.exports = new HashtagService();

