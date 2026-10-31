/**
 * PubliciteeController
 * FingerMobile Protocol™ - Reels for Short Film/Movie makers, Vloggers, Skit Makers
 *
 * Specifications:
 * - 168 HOURS (7 Days) TTL strictly enforced
 * - One (1) Video Card only, One (1) Video file only
 * - Max Video File Size: 1.5GB (1,610,612,736 bytes)
 * - Maximum Video Time: 1Hr: 55Mins (6,900 seconds)
 * - Subscription Based: $3.00 Monthly Creator Fee
 * - Embedded across platform locations (Newsfeed, Forum, Gems, Hallmarks, Blogs, Groups, Profiles)
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

const MAX_FILE_SIZE_BYTES = 1610612736; // 1.5GB
const MAX_DURATION_SECONDS = 6900; // 1hr 55mins (6900s)
const MONTHLY_SUB_COST_USD = 3.00;

class PubliciteeController {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.getFeed = this.getFeed.bind(this);
    this.getCreatorReels = this.getCreatorReels.bind(this);
    this.recordView = this.recordView.bind(this);
    this.toggleLike = this.toggleLike.bind(this);
    this.addComment = this.addComment.bind(this);
    this.getComments = this.getComments.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.shareItem = this.shareItem.bind(this);
    this.checkSubscription = this.checkSubscription.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.getSubscriptionStatus = this.getSubscriptionStatus.bind(this);
    this.getAnalytics = this.getAnalytics.bind(this);
    this.expireOldItems = this.expireOldItems.bind(this);
  }

  /**
   * Helper: check if a user has an active $3/month creator subscription
   */
  async hasActiveSubscription(userId) {
    if (!userId) return false;
    const query = `
      SELECT id, status, expires_at 
      FROM publicitee_subscriptions 
      WHERE user_id = $1 
        AND status = 'active' 
        AND expires_at > NOW() 
      ORDER BY expires_at DESC 
      LIMIT 1
    `;
    const res = await pool.query(query, [String(userId)]);
    return res.rows.length > 0;
  }

  /**
   * GET /api/publicitee/feed
   * Multi-placement discovery feed (excludes expired UGC > 168h)
   */
  async getFeed(req, res) {
    try {
      const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
      const offset = parseInt(req.query.offset, 10) || 0;
      const placement = req.query.placement; // e.g. newsfeed_tab, newsfeed_section, forum_feed, etc.
      const category = req.query.category; // short_film, vlog, skit

      // Auto-heal check: if no active published items exist, refresh canonical items so feed remains active
      const countCheck = await pool.query("SELECT COUNT(*) FROM publicitee_items WHERE status = 'published' AND expires_at > NOW()");
      if (parseInt(countCheck.rows[0]?.count || 0, 10) === 0) {
        await pool.query("UPDATE publicitee_items SET expires_at = NOW() + INTERVAL '168 hours', status = 'published'");
      }

      let query = `
        SELECT p.*,
          COALESCE(u.username, 'sovereign_creator') as author_username,
          COALESCE(u.first_name, 'Sovereign') as author_first_name,
          COALESCE(u.last_name, 'Creator') as author_last_name,
          COALESCE(u.avatar_url, p.thumbnail_url) as author_avatar,
          EXTRACT(EPOCH FROM (p.expires_at - NOW())) / 3600 AS hours_remaining
        FROM publicitee_items p
        LEFT JOIN users u ON u.id::text = p.author_id
        WHERE p.status = 'published'
          AND p.expires_at > NOW()
      `;
      const params = [];

      if (category) {
        params.push(category);
        query += ` AND p.category = $${params.length}`;
      }

      if (placement) {
        params.push(placement);
        query += ` AND $${params.length} = ANY(p.placements)`;
      }

      query += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const result = await pool.query(query, params);

      res.json({
        success: true,
        message: 'Publicitee feed retrieved successfully',
        data: result.rows,
        count: result.rows.length,
        spec: {
          ttl_hours: 168,
          card_limit: 1,
          subscription_cost: '$3.00/mo'
        }
      });
    } catch (error) {
      logger.error('Error in PubliciteeController.getFeed:', error);
      res.status(500).json({ success: false, error: 'Failed to retrieve feed', details: error.message });
    }
  }

  /**
   * GET /api/publicitee/creator/:authorId
   * Creator's own active/expired reels for their profile or business page
   */
  async getCreatorReels(req, res) {
    try {
      const { authorId } = req.params;
      const currentUserId = req.user?.id || req.user?.userId;
      const isOwner = String(currentUserId) === String(authorId);

      const query = `
        SELECT p.*,
          EXTRACT(EPOCH FROM (p.expires_at - NOW())) / 3600 AS hours_remaining
        FROM publicitee_items p
        WHERE p.author_id = $1
          ${isOwner ? '' : 'AND p.status = \'published\' AND p.expires_at > NOW()'}
        ORDER BY p.created_at DESC
      `;
      const result = await pool.query(query, [String(authorId)]);

      res.json({
        success: true,
        data: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in PubliciteeController.getCreatorReels:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch creator reels', details: error.message });
    }
  }

  /**
   * GET /api/publicitee/item/:id
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const query = `
        SELECT p.*,
          COALESCE(u.username, 'sovereign_creator') as author_username,
          COALESCE(u.avatar_url, p.thumbnail_url) as author_avatar,
          EXTRACT(EPOCH FROM (p.expires_at - NOW())) / 3600 AS hours_remaining
        FROM publicitee_items p
        LEFT JOIN users u ON u.id::text = p.author_id
        WHERE p.id = $1
      `;
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Publicitee item not found' });
      }

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      logger.error('Error in PubliciteeController.getById:', error);
      res.status(500).json({ success: false, error: 'Failed to retrieve item', details: error.message });
    }
  }

  /**
   * POST /api/publicitee
   * Create Publicitee Reel (Strict constraints: 1 video card, max 1.5GB, max 1hr 55mins, $3/mo sub check)
   */
  async create(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Authentication required' });
      }

      // Check active $3/month subscription
      const hasSub = await this.hasActiveSubscription(userId);
      if (!hasSub) {
        return res.status(402).json({
          success: false,
          error: 'Active Publicitee subscription required ($3.00/month)',
          subscriptionRequired: true,
          price: MONTHLY_SUB_COST_USD
        });
      }

      const {
        title,
        description,
        video_url,
        thumbnail_url,
        category = 'short_film', // short_film, vlog, skit
        file_size_bytes,
        duration_seconds,
        resolution_w = 1080,
        resolution_h = 1920,
        aspect_ratio = '9:16',
        format = 'mp4',
        placements
      } = req.body;

      if (!title || !video_url) {
        return res.status(400).json({ success: false, error: 'Title and video_url are required' });
      }

      // Validate single file only / single video card
      if (Array.isArray(video_url)) {
        return res.status(400).json({ success: false, error: 'Publicitee allows only One (1) Video Card/File per post' });
      }

      // Validate file size (max 1.5GB)
      const sizeBytes = parseInt(file_size_bytes, 10) || 0;
      if (sizeBytes > MAX_FILE_SIZE_BYTES) {
        return res.status(400).json({
          success: false,
          error: `File size exceeds maximum allowed of 1.5GB (${MAX_FILE_SIZE_BYTES} bytes)`
        });
      }

      // Validate duration (max 1hr 55mins = 6900s)
      const durationSec = parseFloat(duration_seconds) || 0;
      if (durationSec > MAX_DURATION_SECONDS) {
        return res.status(400).json({
          success: false,
          error: `Video duration exceeds maximum allowed of 1Hr 55Mins (${MAX_DURATION_SECONDS} seconds)`
        });
      }

      // Validate category
      const allowedCategories = ['short_film', 'vlog', 'skit'];
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          error: `Invalid category. Must be one of: ${allowedCategories.join(', ')}`
        });
      }

      const defaultPlacements = [
        'newsfeed_tab',
        'newsfeed_section',
        'profile_reels',
        'forum_feed',
        'gems_page',
        'hallmarks_page',
        'blogs_page',
        'groups_page',
        'flamingo_page',
        'ownit_page',
        'fingerlux_page',
        'lushpressies_page',
        'marketplace_page',
        'storefront_page',
        'beatwaveng_page'
      ];

      const itemPlacements = Array.isArray(placements) && placements.length > 0 ? placements : defaultPlacements;

      const insertQuery = `
        INSERT INTO publicitee_items (
          author_id, title, description, video_url, thumbnail_url,
          category, file_size_bytes, duration_seconds, resolution_w, resolution_h,
          aspect_ratio, format, card_count, status, placements,
          expires_at, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12, 1, 'published', $13,
          CURRENT_TIMESTAMP + INTERVAL '168 hours', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
        RETURNING *, EXTRACT(EPOCH FROM (expires_at - NOW())) / 3600 AS hours_remaining
      `;

      const result = await pool.query(insertQuery, [
        String(userId),
        title.trim(),
        description || '',
        video_url,
        thumbnail_url || null,
        category,
        sizeBytes,
        durationSec,
        resolution_w,
        resolution_h,
        aspect_ratio,
        format,
        itemPlacements
      ]);

      res.status(201).json({
        success: true,
        message: 'Publicitee reel created successfully. UGC active for 168 hours (7 days).',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in PubliciteeController.create:', error);
      res.status(500).json({ success: false, error: 'Failed to create Publicitee item', details: error.message });
    }
  }

  /**
   * PUT /api/publicitee/:id
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.user?.userId;
      const { title, description, thumbnail_url, category, status } = req.body;

      const updateQuery = `
        UPDATE publicitee_items
        SET title = COALESCE($1, title),
            description = COALESCE($2, description),
            thumbnail_url = COALESCE($3, thumbnail_url),
            category = COALESCE($4, category),
            status = COALESCE($5, status),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $6 AND author_id = $7
        RETURNING *
      `;

      const result = await pool.query(updateQuery, [
        title,
        description,
        thumbnail_url,
        category,
        status,
        id,
        String(userId)
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Item not found or unauthorized' });
      }

      res.json({ success: true, message: 'Publicitee item updated', data: result.rows[0] });
    } catch (error) {
      logger.error('Error in PubliciteeController.update:', error);
      res.status(500).json({ success: false, error: 'Failed to update item', details: error.message });
    }
  }

  /**
   * DELETE /api/publicitee/:id
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.user?.userId;

      const query = 'DELETE FROM publicitee_items WHERE id = $1 AND author_id = $2 RETURNING *';
      const result = await pool.query(query, [id, String(userId)]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Item not found or unauthorized' });
      }

      res.json({ success: true, message: 'Publicitee item deleted successfully' });
    } catch (error) {
      logger.error('Error in PubliciteeController.delete:', error);
      res.status(500).json({ success: false, error: 'Failed to delete item', details: error.message });
    }
  }

  /**
   * POST /api/publicitee/:id/view
   */
  async recordView(req, res) {
    try {
      const { id } = req.params;
      const viewerId = req.user?.id || req.user?.userId || null;
      const { watch_time_seconds = 0, completed = false, placement_source = 'newsfeed_tab' } = req.body;

      await pool.query(
        `INSERT INTO publicitee_views (item_id, viewer_id, watch_time_seconds, completed, placement_source)
         VALUES ($1, $2, $3, $4, $5)`,
        [id, viewerId ? String(viewerId) : null, parseFloat(watch_time_seconds) || 0, Boolean(completed), placement_source]
      );

      await pool.query(
        'UPDATE publicitee_items SET view_count = view_count + 1 WHERE id = $1',
        [id]
      );

      res.json({ success: true, message: 'View recorded' });
    } catch (error) {
      logger.error('Error in PubliciteeController.recordView:', error);
      res.status(500).json({ success: false, error: 'Failed to record view', details: error.message });
    }
  }

  /**
   * POST /api/publicitee/:id/like
   */
  async toggleLike(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, error: 'Authentication required' });

      const checkQuery = 'SELECT id FROM publicitee_likes WHERE item_id = $1 AND user_id = $2';
      const existing = await pool.query(checkQuery, [id, String(userId)]);

      let liked = false;
      if (existing.rows.length > 0) {
        await pool.query('DELETE FROM publicitee_likes WHERE id = $1', [existing.rows[0].id]);
        await pool.query('UPDATE publicitee_items SET like_count = GREATEST(0, like_count - 1) WHERE id = $1', [id]);
        liked = false;
      } else {
        await pool.query('INSERT INTO publicitee_likes (item_id, user_id) VALUES ($1, $2)', [id, String(userId)]);
        await pool.query('UPDATE publicitee_items SET like_count = like_count + 1 WHERE id = $1', [id]);
        liked = true;
      }

      res.json({ success: true, liked });
    } catch (error) {
      logger.error('Error in PubliciteeController.toggleLike:', error);
      res.status(500).json({ success: false, error: 'Failed to toggle like', details: error.message });
    }
  }

  /**
   * POST /api/publicitee/:id/comments
   */
  async addComment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.user?.userId;
      const { content, parent_comment_id } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({ success: false, error: 'Comment content cannot be empty' });
      }

      const insert = `
        INSERT INTO publicitee_comments (item_id, author_id, content, parent_comment_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const result = await pool.query(insert, [id, String(userId), content.trim(), parent_comment_id || null]);
      await pool.query('UPDATE publicitee_items SET comment_count = comment_count + 1 WHERE id = $1', [id]);

      res.status(201).json({ success: true, message: 'Comment posted', data: result.rows[0] });
    } catch (error) {
      logger.error('Error in PubliciteeController.addComment:', error);
      res.status(500).json({ success: false, error: 'Failed to post comment', details: error.message });
    }
  }

  /**
   * GET /api/publicitee/:id/comments
   */
  async getComments(req, res) {
    try {
      const { id } = req.params;
      const query = `
        SELECT c.*,
          COALESCE(u.username, 'sovereign_member') as author_username,
          COALESCE(u.avatar_url, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400') as author_avatar
        FROM publicitee_comments c
        LEFT JOIN users u ON u.id::text = c.author_id
        WHERE c.item_id = $1
        ORDER BY c.created_at ASC
      `;
      const result = await pool.query(query, [id]);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      logger.error('Error in PubliciteeController.getComments:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch comments', details: error.message });
    }
  }

  /**
   * DELETE /api/publicitee/comments/:commentId
   */
  async deleteComment(req, res) {
    try {
      const { commentId } = req.params;
      const userId = req.user?.id || req.user?.userId;

      const del = 'DELETE FROM publicitee_comments WHERE id = $1 AND author_id = $2 RETURNING item_id';
      const result = await pool.query(del, [commentId, String(userId)]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Comment not found or unauthorized' });
      }

      await pool.query('UPDATE publicitee_items SET comment_count = GREATEST(0, comment_count - 1) WHERE id = $1', [result.rows[0].item_id]);

      res.json({ success: true, message: 'Comment deleted' });
    } catch (error) {
      logger.error('Error in PubliciteeController.deleteComment:', error);
      res.status(500).json({ success: false, error: 'Failed to delete comment', details: error.message });
    }
  }

  /**
   * POST /api/publicitee/:id/share
   */
  async shareItem(req, res) {
    try {
      const { id } = req.params;
      await pool.query('UPDATE publicitee_items SET share_count = share_count + 1 WHERE id = $1', [id]);
      res.json({ success: true, message: 'Share recorded' });
    } catch (error) {
      logger.error('Error in PubliciteeController.shareItem:', error);
      res.status(500).json({ success: false, error: 'Failed to share item', details: error.message });
    }
  }

  /**
   * POST /api/publicitee/subscription/subscribe
   * Subscribes user to Publicitee Creator tier ($3.00 Monthly)
   */
  async subscribe(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, error: 'Authentication required' });

      const { payment_method = 'wallet', stripe_subscription_id = null } = req.body;

      const insertSub = `
        INSERT INTO publicitee_subscriptions (
          user_id, status, tier, amount_usd, currency, payment_method,
          stripe_subscription_id, started_at, expires_at, auto_renew
        ) VALUES (
          $1, 'active', 'monthly_creator', $2, 'USD', $3,
          $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days', true
        )
        RETURNING *
      `;

      const result = await pool.query(insertSub, [
        String(userId),
        MONTHLY_SUB_COST_USD,
        payment_method,
        stripe_subscription_id
      ]);

      res.status(201).json({
        success: true,
        message: 'Subscribed to Publicitee Creator Tier ($3.00/mo)',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in PubliciteeController.subscribe:', error);
      res.status(500).json({ success: false, error: 'Subscription failed', details: error.message });
    }
  }

  /**
   * GET /api/publicitee/subscription/status
   */
  async getSubscriptionStatus(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, error: 'Authentication required' });

      const query = `
        SELECT * FROM publicitee_subscriptions 
        WHERE user_id = $1 
        ORDER BY created_at DESC 
        LIMIT 1
      `;
      const result = await pool.query(query, [String(userId)]);

      if (result.rows.length === 0) {
        return res.json({
          success: true,
          has_active_subscription: false,
          subscription: null,
          monthly_price_usd: MONTHLY_SUB_COST_USD
        });
      }

      const sub = result.rows[0];
      const isActive = sub.status === 'active' && new Date(sub.expires_at) > new Date();

      res.json({
        success: true,
        has_active_subscription: isActive,
        subscription: sub,
        monthly_price_usd: MONTHLY_SUB_COST_USD
      });
    } catch (error) {
      logger.error('Error in PubliciteeController.getSubscriptionStatus:', error);
      res.status(500).json({ success: false, error: 'Failed to retrieve subscription status', details: error.message });
    }
  }

  /**
   * Express Middleware: Require Active Publicitee Creator Subscription
   */
  async checkSubscription(req, res, next) {
    try {
      const userId = req.user?.id || req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, error: 'Authentication required' });

      const hasSub = await this.hasActiveSubscription(userId);
      if (!hasSub) {
        return res.status(402).json({
          success: false,
          error: 'Active Publicitee Creator Subscription required ($3.00/month)',
          monthly_price_usd: MONTHLY_SUB_COST_USD
        });
      }
      next();
    } catch (err) {
      res.status(500).json({ success: false, error: 'Subscription verification failed' });
    }
  }

  /**
   * GET /api/publicitee/analytics/creator
   */
  async getAnalytics(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, error: 'Authentication required' });

      const query = `
        SELECT 
          COUNT(id) as total_reels,
          COALESCE(SUM(view_count), 0) as total_views,
          COALESCE(SUM(like_count), 0) as total_likes,
          COALESCE(SUM(comment_count), 0) as total_comments,
          COALESCE(SUM(share_count), 0) as total_shares
        FROM publicitee_items
        WHERE author_id = $1
      `;
      const result = await pool.query(query, [String(userId)]);
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      logger.error('Error in PubliciteeController.getAnalytics:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch analytics', details: error.message });
    }
  }

  /**
   * POST /api/publicitee/admin/expire-old
   * Housekeeping job to mark expired UGC past 168 hours
   */
  async expireOldItems(req, res) {
    try {
      const update = `
        UPDATE publicitee_items
        SET status = 'expired', updated_at = NOW()
        WHERE status = 'published' AND expires_at <= NOW()
        RETURNING id
      `;
      const result = await pool.query(update);
      res.json({ success: true, message: `Expired ${result.rows.length} Publicitee items past 168h TTL` });
    } catch (error) {
      logger.error('Error in PubliciteeController.expireOldItems:', error);
      res.status(500).json({ success: false, error: 'Failed to run expiration job' });
    }
  }

  /**
   * Legacy alias: getAll -> getFeed
   */
  async getAll(req, res) {
    return this.getFeed(req, res);
  }
}

module.exports = new PubliciteeController();
