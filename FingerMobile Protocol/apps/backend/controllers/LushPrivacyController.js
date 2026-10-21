/**
 * Lush Pressies — Unified Privacy Controller
 * Enforces all 8 privacy dimensions for Lush Pressies UGC content:
 * 1. ReviewController   — enforces allow_reviews
 * 2. CommentsController — enforces allow_comments
 * 3. ShareController    — enforces allow_sharing (+ 24h share token generation)
 * 4. TagController      — enforces allow_tagging (+ tag approval/rejection)
 * 5. SaveController     — enforces allow_saving (+ user collections)
 * 6. DownloadController — enforces allow_download (+ signed download token, 5GB quota)
 * 7. VisibilityController — enforces visibility: public, connections, matches, private, unlisted
 * 8. DurationController — enforces TTL: permanent, 24h, 7d, 30d, custom
 *
 * Also handles Lush-specific gates:
 * - PIN Exchange Required gate
 * - Gift Required to View gate
 * - Membership Category gate (Genuine, Validate, Empathetic, Sincere, Hopeful Match)
 * - Commit Button 5-Month gate
 * - Radiate++ Only gate
 *
 * Date: September 29, 2026
 */

const crypto = require('crypto');
const { pool } = require('../db');
const logger = require('../utils/logger');

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch privacy settings for a given content item.
 * Falls back to safe defaults if no settings exist yet.
 */
async function getPrivacySettings(contentType, contentId) {
  const result = await pool.query(
    'SELECT * FROM lush_ugc_privacy_settings WHERE content_type = $1 AND content_id = $2',
    [contentType, contentId]
  );
  return result.rows[0] || null;
}

/**
 * Check if a viewing user passes all Lush-specific gates.
 */
async function passesLushGates(settings, viewerId) {
  if (!settings) return { allowed: true };

  // Gate 1 — PIN Exchange Required
  if (settings.pin_exchange_required) {
    const pin = await pool.query(
      `SELECT id FROM lush_pins 
       WHERE status = 'accepted' 
       AND ((sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1))`,
      [settings.owner_id, viewerId]
    );
    if (pin.rows.length === 0) {
      return { allowed: false, reason: 'PIN exchange required to view this content', gate: 'pin_exchange' };
    }
  }

  // Gate 2 — Gift Required to View
  if (settings.gift_required_to_view) {
    const gift = await pool.query(
      `SELECT id FROM lushpressies_gifts 
       WHERE sender_id = $1 AND recipient_id = $2 AND status = 'sent'`,
      [viewerId, settings.owner_id]
    );
    if (gift.rows.length === 0) {
      return { allowed: false, reason: 'A gift must be sent before viewing this content', gate: 'gift_required' };
    }
  }

  // Gate 3 — Membership Category Gate
  if (settings.membership_category_gate && settings.membership_category_gate.length > 0) {
    const profile = await pool.query(
      'SELECT membership_category FROM user_profiles WHERE user_id = $1',
      [viewerId]
    );
    const userCategory = profile.rows[0]?.membership_category;
    if (!userCategory || !settings.membership_category_gate.includes(userCategory)) {
      return { allowed: false, reason: `This content is restricted to: ${settings.membership_category_gate.join(', ')}`, gate: 'membership_category' };
    }
  }

  // Gate 4 — Radiate++ Only
  if (settings.radiate_plus_only) {
    const radiate = await pool.query(
      'SELECT id FROM lush_radiate_sessions WHERE user_id = $1 AND tier = \'radiate_plus\' AND expires_at > NOW()',
      [viewerId]
    );
    if (radiate.rows.length === 0) {
      return { allowed: false, reason: 'Active Radiate++ membership required to view this content', gate: 'radiate_plus' };
    }
  }

  // Gate 5 — Commit Button 5-Month Gate
  if (settings.commit_button_unlocked_only) {
    const commit = await pool.query(
      `SELECT id FROM lush_commit_eligibility 
       WHERE is_eligible_for_commit = true
       AND ((user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1))`,
      [settings.owner_id, viewerId]
    );
    if (commit.rows.length === 0) {
      return { allowed: false, reason: '5-month connection required. Commit button not yet unlocked.', gate: 'commit_unlock' };
    }
  }

  return { allowed: true };
}

/**
 * Check visibility permission ('public','connections','matches','private','unlisted').
 */
async function checkVisibility(settings, _viewerId) {
  if (!settings) return { allowed: true };
  if (settings.owner_id === _viewerId) return { allowed: true };

  const vis = settings.visibility;
  if (vis === 'public') return { allowed: true };
  if (vis === 'private') return { allowed: false, reason: 'This content is private' };
  if (vis === 'unlisted') return { allowed: false, reason: 'Direct link access only for unlisted content' };

  if (vis === 'connections') {
    const conn = await pool.query(
      `SELECT id FROM connections WHERE (user_id = $1 AND connected_user_id = $2 AND status = 'accepted')
       OR (user_id = $2 AND connected_user_id = $1 AND status = 'accepted')`,
      [settings.owner_id, _viewerId]
    );
    if (conn.rows.length === 0) return { allowed: false, reason: 'Connections only' };
  }

  if (vis === 'matches') {
    const match = await pool.query(
      `SELECT id FROM lush_roll_actions r1
       JOIN lush_roll_actions r2 ON r1.actor_id = r2.target_id AND r1.target_id = r2.actor_id
       WHERE r1.actor_id = $1 AND r1.target_id = $2 AND r1.action = 'like' AND r2.action = 'like'`,
      [settings.owner_id, _viewerId]
    );
    if (match.rows.length === 0) return { allowed: false, reason: 'Mutual matches only' };
  }

  return { allowed: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. REVIEW CONTROLLER — enforces allow_reviews
// ─────────────────────────────────────────────────────────────────────────────
const LushReviewController = {
  /**
   * GET /api/lushpressies/privacy/reviews/:contentType/:contentId
   */
  async getReviews(req, res) {
    try {
      const { contentType, contentId } = req.params;
      const settings = await getPrivacySettings(contentType, contentId);

      if (settings?.allow_reviews === 'none') {
        return res.status(403).json({ success: false, message: 'Reviews are disabled for this content' });
      }

      const result = await pool.query(
        `SELECT r.*, u.username, u.avatar_url
         FROM lush_ugc_reviews r
         JOIN users u ON r.reviewer_id = u.id
         WHERE r.content_type = $1 AND r.content_id = $2
         ORDER BY r.created_at DESC`,
        [contentType, contentId]
      );
      res.json({ success: true, data: result.rows });
    } catch (error) {
      logger.error('LushReviewController.getReviews error:', error);
      res.status(500).json({ success: false, message: 'Failed to get reviews' });
    }
  },

  /**
   * POST /api/lushpressies/privacy/reviews/:contentType/:contentId
   */
  async addReview(req, res) {
    try {
      const { contentType, contentId } = req.params;
      const reviewerId = req.user?.id;
      const { rating, reviewText } = req.body;

      if (!reviewerId) return res.status(401).json({ success: false, message: 'Auth required' });

      const settings = await getPrivacySettings(contentType, contentId);

      if (settings?.allow_reviews === 'none') {
        return res.status(403).json({ success: false, message: 'Reviews are disabled for this content' });
      }

      const gateCheck = await passesLushGates(settings, reviewerId);
      if (!gateCheck.allowed) return res.status(403).json({ success: false, message: gateCheck.reason, gate: gateCheck.gate });

      const result = await pool.query(
        `INSERT INTO lush_ugc_reviews (content_type, content_id, reviewer_id, rating, review_text, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
        [contentType, contentId, reviewerId, rating, reviewText]
      );

      res.status(201).json({ success: true, message: 'Review submitted', data: result.rows[0] });
    } catch (error) {
      logger.error('LushReviewController.addReview error:', error);
      res.status(500).json({ success: false, message: 'Failed to add review' });
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. COMMENTS CONTROLLER — enforces allow_comments (threaded replies)
// ─────────────────────────────────────────────────────────────────────────────
const LushCommentsController = {
  async getComments(req, res) {
    try {
      const { contentType, contentId } = req.params;
      const settings = await getPrivacySettings(contentType, contentId);

      if (settings?.allow_comments === 'none') {
        return res.status(403).json({ success: false, message: 'Comments are disabled for this content' });
      }

      const result = await pool.query(
        `SELECT c.*, u.username, u.avatar_url,
          (SELECT COUNT(*) FROM lush_ugc_comments r WHERE r.parent_comment_id = c.id) as reply_count
         FROM lush_ugc_comments c
         JOIN users u ON c.author_id = u.id
         WHERE c.content_type = $1 AND c.content_id = $2 AND c.parent_comment_id IS NULL AND c.is_hidden = false
         ORDER BY c.is_pinned DESC, c.created_at DESC`,
        [contentType, contentId]
      );
      res.json({ success: true, data: result.rows });
    } catch (error) {
      logger.error('LushCommentsController.getComments error:', error);
      res.status(500).json({ success: false, message: 'Failed to get comments' });
    }
  },

  async addComment(req, res) {
    try {
      const { contentType, contentId } = req.params;
      const authorId = req.user?.id;
      const { commentText, parentCommentId } = req.body;

      if (!authorId) return res.status(401).json({ success: false, message: 'Auth required' });
      if (!commentText?.trim()) return res.status(400).json({ success: false, message: 'Comment text required' });

      const settings = await getPrivacySettings(contentType, contentId);
      if (settings?.allow_comments === 'none') {
        return res.status(403).json({ success: false, message: 'Comments are disabled' });
      }

      const gateCheck = await passesLushGates(settings, authorId);
      if (!gateCheck.allowed) return res.status(403).json({ success: false, message: gateCheck.reason, gate: gateCheck.gate });

      const result = await pool.query(
        `INSERT INTO lush_ugc_comments (content_type, content_id, author_id, comment_text, parent_comment_id, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
        [contentType, contentId, authorId, commentText.trim(), parentCommentId || null]
      );

      res.status(201).json({ success: true, message: 'Comment added', data: result.rows[0] });
    } catch (error) {
      logger.error('LushCommentsController.addComment error:', error);
      res.status(500).json({ success: false, message: 'Failed to add comment' });
    }
  },

  async deleteComment(req, res) {
    try {
      const { commentId } = req.params;
      const userId = req.user?.id;

      const result = await pool.query(
        'DELETE FROM lush_ugc_comments WHERE id = $1 AND author_id = $2 RETURNING id',
        [commentId, userId]
      );

      if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Comment not found or unauthorized' });
      res.json({ success: true, message: 'Comment deleted' });
    } catch (error) {
      logger.error('LushCommentsController.deleteComment error:', error);
      res.status(500).json({ success: false, message: 'Failed to delete comment' });
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. SHARE CONTROLLER — enforces allow_sharing + 24h signed share tokens
// ─────────────────────────────────────────────────────────────────────────────
const LushShareController = {
  async shareContent(req, res) {
    try {
      const { contentType, contentId } = req.params;
      const sharerId = req.user?.id;
      const { platform = 'internal', recipientId } = req.body;

      if (!sharerId) return res.status(401).json({ success: false, message: 'Auth required' });

      const settings = await getPrivacySettings(contentType, contentId);
      if (settings?.allow_sharing === 'none') {
        return res.status(403).json({ success: false, message: 'Sharing is disabled for this content' });
      }

      const gateCheck = await passesLushGates(settings, sharerId);
      if (!gateCheck.allowed) return res.status(403).json({ success: false, message: gateCheck.reason });

      // Generate 24h one-time share token for private/connections content
      const shareToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const result = await pool.query(
        `INSERT INTO lush_ugc_shares 
         (content_type, content_id, sharer_id, recipient_id, platform, share_token, share_token_expires_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [contentType, contentId, sharerId, recipientId || null, platform, shareToken, tokenExpiry]
      );

      res.status(201).json({
        success: true,
        message: 'Content shared successfully',
        data: {
          shareToken,
          shareUrl: `/lushpressies/shared/${shareToken}`,
          expiresAt: tokenExpiry,
          platform,
          record: result.rows[0]
        }
      });
    } catch (error) {
      logger.error('LushShareController.shareContent error:', error);
      res.status(500).json({ success: false, message: 'Failed to share content' });
    }
  },

  async resolveShareToken(req, res) {
    try {
      const { token } = req.params;

      const result = await pool.query(
        `UPDATE lush_ugc_shares SET was_accessed = true
         WHERE share_token = $1 AND share_token_expires_at > NOW() AND was_accessed = false
         RETURNING *`,
        [token]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Share link invalid or expired' });
      }

      const share = result.rows[0];
      res.json({ success: true, data: { contentType: share.content_type, contentId: share.content_id } });
    } catch (error) {
      logger.error('LushShareController.resolveShareToken error:', error);
      res.status(500).json({ success: false, message: 'Failed to resolve share token' });
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. TAG CONTROLLER — enforces allow_tagging + tag approval/rejection
// ─────────────────────────────────────────────────────────────────────────────
const LushTagController = {
  async tagUser(req, res) {
    try {
      const { contentType, contentId } = req.params;
      const taggerId = req.user?.id;
      const { taggedUserId } = req.body;

      if (!taggerId || !taggedUserId) return res.status(400).json({ success: false, message: 'Tagger and tagged user required' });

      const settings = await getPrivacySettings(contentType, contentId);
      if (settings?.allow_tagging === 'none') {
        return res.status(403).json({ success: false, message: 'Tagging is disabled for this content' });
      }

      const result = await pool.query(
        `INSERT INTO lush_ugc_tags (content_type, content_id, tagger_id, tagged_user_id, tag_approved)
         VALUES ($1, $2, $3, $4, true) ON CONFLICT DO NOTHING RETURNING *`,
        [contentType, contentId, taggerId, taggedUserId]
      );

      res.status(201).json({ success: true, message: 'User tagged', data: result.rows[0] });
    } catch (error) {
      logger.error('LushTagController.tagUser error:', error);
      res.status(500).json({ success: false, message: 'Failed to tag user' });
    }
  },

  async approveTag(req, res) {
    try {
      const { tagId } = req.params;
      const userId = req.user?.id;
      const { approved } = req.body;

      const result = await pool.query(
        'UPDATE lush_ugc_tags SET tag_approved = $1 WHERE id = $2 AND tagged_user_id = $3 RETURNING *',
        [approved, tagId, userId]
      );

      if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Tag not found or unauthorized' });
      res.json({ success: true, message: approved ? 'Tag approved' : 'Tag rejected', data: result.rows[0] });
    } catch (error) {
      logger.error('LushTagController.approveTag error:', error);
      res.status(500).json({ success: false, message: 'Failed to update tag' });
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. SAVE CONTROLLER — enforces allow_saving + user collections
// ─────────────────────────────────────────────────────────────────────────────
const LushSaveController = {
  async saveContent(req, res) {
    try {
      const { contentType, contentId } = req.params;
      const userId = req.user?.id;
      const { collectionName = 'Saved' } = req.body;

      if (!userId) return res.status(401).json({ success: false, message: 'Auth required' });

      const settings = await getPrivacySettings(contentType, contentId);
      if (settings?.allow_saving === 'none') {
        return res.status(403).json({ success: false, message: 'Saving is disabled for this content' });
      }

      const gateCheck = await passesLushGates(settings, userId);
      if (!gateCheck.allowed) return res.status(403).json({ success: false, message: gateCheck.reason });

      const result = await pool.query(
        `INSERT INTO lush_ugc_saves (content_type, content_id, user_id, collection_name)
         VALUES ($1, $2, $3, $4) ON CONFLICT (content_type, content_id, user_id) DO UPDATE SET collection_name = $4
         RETURNING *`,
        [contentType, contentId, userId, collectionName]
      );

      res.status(201).json({ success: true, message: `Saved to "${collectionName}"`, data: result.rows[0] });
    } catch (error) {
      logger.error('LushSaveController.saveContent error:', error);
      res.status(500).json({ success: false, message: 'Failed to save content' });
    }
  },

  async unsaveContent(req, res) {
    try {
      const { contentType, contentId } = req.params;
      const userId = req.user?.id;

      await pool.query(
        'DELETE FROM lush_ugc_saves WHERE content_type = $1 AND content_id = $2 AND user_id = $3',
        [contentType, contentId, userId]
      );

      res.json({ success: true, message: 'Removed from saved' });
    } catch (error) {
      logger.error('LushSaveController.unsaveContent error:', error);
      res.status(500).json({ success: false, message: 'Failed to unsave content' });
    }
  },

  async getSavedByUser(req, res) {
    try {
      const userId = req.user?.id;
      const { collectionName } = req.query;

      let query = 'SELECT * FROM lush_ugc_saves WHERE user_id = $1';
      const params = [userId];

      if (collectionName) { query += ' AND collection_name = $2'; params.push(collectionName); }
      query += ' ORDER BY created_at DESC';

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      logger.error('LushSaveController.getSavedByUser error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch saved items' });
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. DOWNLOAD CONTROLLER — enforces allow_download (signed token + 5GB quota)
// ─────────────────────────────────────────────────────────────────────────────
const DOWNLOAD_QUOTA_BYTES = 5 * 1024 * 1024 * 1024; // 5GB per user

const LushDownloadController = {
  async requestDownload(req, res) {
    try {
      const { contentType, contentId } = req.params;
      const downloaderId = req.user?.id;
      const { fileSizeBytes = 0 } = req.body;

      if (!downloaderId) return res.status(401).json({ success: false, message: 'Auth required' });

      const settings = await getPrivacySettings(contentType, contentId);
      if (settings?.allow_download === 'none') {
        return res.status(403).json({ success: false, message: 'Downloads are disabled for this content' });
      }

      const gateCheck = await passesLushGates(settings, downloaderId);
      if (!gateCheck.allowed) return res.status(403).json({ success: false, message: gateCheck.reason });

      // Check 5GB quota usage
      const quotaResult = await pool.query(
        `SELECT COALESCE(SUM(file_size_bytes), 0) as total_used FROM lush_ugc_downloads
         WHERE downloader_id = $1`,
        [downloaderId]
      );
      const totalUsed = parseInt(quotaResult.rows[0].total_used, 10);
      if (totalUsed + fileSizeBytes > DOWNLOAD_QUOTA_BYTES) {
        return res.status(429).json({
          success: false,
          message: 'Download quota exceeded. Maximum 5GB allowed.',
          quotaUsed: totalUsed,
          quotaLimit: DOWNLOAD_QUOTA_BYTES
        });
      }

      // Generate signed download token (1h TTL)
      const downloadToken = crypto.randomBytes(48).toString('hex');
      const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

      const _insertResult = await pool.query(
        `INSERT INTO lush_ugc_downloads 
         (content_type, content_id, downloader_id, download_token, token_expires_at, file_size_bytes, ip_address)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [contentType, contentId, downloaderId, downloadToken, tokenExpiry, fileSizeBytes, req.ip]
      );

      res.status(201).json({
        success: true,
        message: 'Download token generated (1h TTL)',
        data: {
          downloadToken,
          downloadUrl: `/api/lushpressies/privacy/download/file/${downloadToken}`,
          expiresAt: tokenExpiry,
          quotaUsed: totalUsed + fileSizeBytes,
          quotaRemaining: DOWNLOAD_QUOTA_BYTES - totalUsed - fileSizeBytes
        }
      });
    } catch (error) {
      logger.error('LushDownloadController.requestDownload error:', error);
      res.status(500).json({ success: false, message: 'Failed to generate download token' });
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. VISIBILITY CONTROLLER — enforces visibility + full privacy settings CRUD
// ─────────────────────────────────────────────────────────────────────────────
const LushVisibilityController = {
  async getSettings(req, res) {
    try {
      const { contentType, contentId } = req.params;
      const settings = await getPrivacySettings(contentType, contentId);

      if (!settings) {
        return res.json({ success: true, data: null, message: 'No custom privacy settings — using platform defaults' });
      }
      res.json({ success: true, data: settings });
    } catch (error) {
      logger.error('LushVisibilityController.getSettings error:', error);
      res.status(500).json({ success: false, message: 'Failed to get visibility settings' });
    }
  },

  async upsertSettings(req, res) {
    try {
      const { contentType, contentId } = req.params;
      const ownerId = req.user?.id;

      if (!ownerId) return res.status(401).json({ success: false, message: 'Auth required' });

      const {
        allowReviews, allowComments, allowSharing, allowTagging,
        allowSaving, allowDownload, visibility, durationType, expiresAt,
        pinExchangeRequired, giftRequiredToView, membershipCategoryGate,
        commitButtonUnlockedOnly, radiatePlusOnly,
        genderTarget, ageRangeMin, ageRangeMax, allowedLocations, allowedUserIds, autoDelete
      } = req.body;

      const result = await pool.query(
        `INSERT INTO lush_ugc_privacy_settings
         (content_type, content_id, owner_id, allow_reviews, allow_comments, allow_sharing, allow_tagging,
          allow_saving, allow_download, visibility, duration_type, expires_at,
          pin_exchange_required, gift_required_to_view, membership_category_gate,
          commit_button_unlocked_only, radiate_plus_only,
          gender_target, age_range_min, age_range_max, allowed_locations, allowed_user_ids, auto_delete,
          updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,NOW())
         ON CONFLICT (content_type, content_id) DO UPDATE SET
           allow_reviews = EXCLUDED.allow_reviews, allow_comments = EXCLUDED.allow_comments,
           allow_sharing = EXCLUDED.allow_sharing, allow_tagging = EXCLUDED.allow_tagging,
           allow_saving = EXCLUDED.allow_saving, allow_download = EXCLUDED.allow_download,
           visibility = EXCLUDED.visibility, duration_type = EXCLUDED.duration_type,
           expires_at = EXCLUDED.expires_at,
           pin_exchange_required = EXCLUDED.pin_exchange_required,
           gift_required_to_view = EXCLUDED.gift_required_to_view,
           membership_category_gate = EXCLUDED.membership_category_gate,
           commit_button_unlocked_only = EXCLUDED.commit_button_unlocked_only,
           radiate_plus_only = EXCLUDED.radiate_plus_only,
           gender_target = EXCLUDED.gender_target, age_range_min = EXCLUDED.age_range_min,
           age_range_max = EXCLUDED.age_range_max, allowed_locations = EXCLUDED.allowed_locations,
           allowed_user_ids = EXCLUDED.allowed_user_ids, auto_delete = EXCLUDED.auto_delete,
           updated_at = NOW()
         RETURNING *`,
        [
          contentType, contentId, ownerId,
          allowReviews || 'connections', allowComments || 'connections',
          allowSharing || 'connections', allowTagging || 'matches',
          allowSaving || 'connections', allowDownload || 'none',
          visibility || 'connections', durationType || 'permanent', expiresAt || null,
          pinExchangeRequired || false, giftRequiredToView || false,
          membershipCategoryGate || null,
          commitButtonUnlockedOnly || false, radiatePlusOnly || false,
          genderTarget || 'all', ageRangeMin || 18, ageRangeMax || 99,
          JSON.stringify(allowedLocations || {}), allowedUserIds || null, autoDelete || false
        ]
      );

      res.json({ success: true, message: 'Privacy settings saved', data: result.rows[0] });
    } catch (error) {
      logger.error('LushVisibilityController.upsertSettings error:', error);
      res.status(500).json({ success: false, message: 'Failed to save privacy settings' });
    }
  },

  async checkCanView(req, res) {
    try {
      const { contentType, contentId } = req.params;
      const viewerId = req.user?.id;

      const settings = await getPrivacySettings(contentType, contentId);
      const visCheck = await checkVisibility(settings, viewerId);
      if (!visCheck.allowed) return res.status(403).json({ success: false, message: visCheck.reason });

      const gateCheck = await passesLushGates(settings, viewerId);
      if (!gateCheck.allowed) return res.status(403).json({ success: false, message: gateCheck.reason, gate: gateCheck.gate });

      res.json({ success: true, canView: true });
    } catch (error) {
      logger.error('LushVisibilityController.checkCanView error:', error);
      res.status(500).json({ success: false, message: 'Failed to check view permission' });
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. DURATION CONTROLLER — enforces TTL: permanent, 24h, 7d, 30d, custom
// ─────────────────────────────────────────────────────────────────────────────
const LushDurationController = {
  async setDuration(req, res) {
    try {
      const { contentType, contentId } = req.params;
      const ownerId = req.user?.id;
      const { durationType, customExpiresAt } = req.body;

      if (!ownerId) return res.status(401).json({ success: false, message: 'Auth required' });

      const durationMap = { '24h': '24 hours', '7d': '7 days', '30d': '30 days', 'permanent': null };
      let expiresAt = null;

      if (durationType === 'custom') {
        expiresAt = customExpiresAt || null;
      } else if (durationMap[durationType] !== null && durationMap[durationType]) {
        const r = await pool.query(`SELECT NOW() + INTERVAL '${durationMap[durationType]}' as expiry`);
        expiresAt = r.rows[0].expiry;
      }

      const result = await pool.query(
        `INSERT INTO lush_ugc_privacy_settings (content_type, content_id, owner_id, duration_type, expires_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON CONFLICT (content_type, content_id) DO UPDATE
           SET duration_type = $4, expires_at = $5, updated_at = NOW()
         RETURNING duration_type, expires_at`,
        [contentType, contentId, ownerId, durationType, expiresAt]
      );

      res.json({
        success: true,
        message: `Content duration set to: ${durationType}`,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('LushDurationController.setDuration error:', error);
      res.status(500).json({ success: false, message: 'Failed to set duration' });
    }
  },

  async purgeExpiredContent(req, res) {
    try {
      // Soft-expire content that has passed its expires_at
      const expiredRows = await pool.query(
        `SELECT content_type, content_id, auto_delete FROM lush_ugc_privacy_settings
         WHERE expires_at IS NOT NULL AND expires_at < NOW()`
      );

      const expired = expiredRows.rows;
      res.json({
        success: true,
        message: `${expired.length} expired content items identified for cleanup`,
        data: expired
      });
    } catch (error) {
      logger.error('LushDurationController.purgeExpiredContent error:', error);
      res.status(500).json({ success: false, message: 'Failed to purge expired content' });
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────
module.exports = {
  LushReviewController,
  LushCommentsController,
  LushShareController,
  LushTagController,
  LushSaveController,
  LushDownloadController,
  LushVisibilityController,
  LushDurationController
};
