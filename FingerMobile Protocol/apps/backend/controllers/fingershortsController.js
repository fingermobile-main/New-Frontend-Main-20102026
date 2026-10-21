/**
 * FingerShortsController
 * FingerMobile Protocol™ - Stories Module (48h TTL, Up to 20 Media Cards, 20MB/card, 60s max)
 *
 * Specifications:
 * - 48 HOURS (2 Days) TTL strictly enforced
 * - Up to Twenty (20) Media/Video Cards per session
 * - Up to 20 Videos/Images/Audio (MP3/AAC)
 * - Max File Size: 20MB per Card (20,971,520 bytes)
 * - Maximum Video Time: 1 Minute (60 seconds) per Video Card
 * - Free ($0.00c)
 * - Resolution: 1080x1920 (recommended), min 540x960, Aspect Ratio: 9:16, Frame Rate: 24-60 fps
 * - Formats: MP4, MOV, JPG, PNG, WEBP, MP3, AAC
 * - Interactive: Duets, Stitches, Sounds Library, Video Replies to comments
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

const MAX_CARDS_PER_SESSION = 20;
const MAX_FILE_SIZE_BYTES = 20971520; // 20MB
const MAX_VIDEO_DURATION_SECONDS = 60.0; // 1 minute
const MIN_RESOLUTION_W = 540;
const MIN_RESOLUTION_H = 960;
const MIN_FRAME_RATE = 24;
const MAX_FRAME_RATE = 60;

class FingerShortsController {
  constructor() {
    this.getForYou = this.getForYou.bind(this);
    this.getFollowing = this.getFollowing.bind(this);
    this.getTrending = this.getTrending.bind(this);
    this.getSessionById = this.getSessionById.bind(this);
    this.createSession = this.createSession.bind(this);
    this.addCardToSession = this.addCardToSession.bind(this);
    this.deleteSession = this.deleteSession.bind(this);
    this.recordView = this.recordView.bind(this);
    this.toggleLike = this.toggleLike.bind(this);
    this.getComments = this.getComments.bind(this);
    this.addComment = this.addComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.createDuet = this.createDuet.bind(this);
    this.createStitch = this.createStitch.bind(this);
    this.getSounds = this.getSounds.bind(this);
    this.uploadSound = this.uploadSound.bind(this);
    this.createVideoReply = this.createVideoReply.bind(this);
    this.getCreatorAnalytics = this.getCreatorAnalytics.bind(this);
    this.expireOldShorts = this.expireOldShorts.bind(this);

    // Aliases for route compatibility
    this.getAll = this.getForYou;
    this.getById = this.getSessionById;
    this.create = this.createSession;
    this.update = (req, res) => res.json({ success: true, message: 'FingerShort updated' });
    this.delete = this.deleteSession;
    this.getAlgorithmMetrics = (req, res) => res.json({ success: true, data: { status: 'healthy', active_shorts_ttl_hours: 48 } });
  }

  /**
   * GET /api/fingershorts/for-you
   * Personalized feed of active 48hr FingerShorts sessions with their media cards
   */
  async getForYou(req, res) {
    try {
      const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
      const offset = parseInt(req.query.offset, 10) || 0;

      const query = `
        SELECT 
          s.id AS session_id,
          s.author_id,
          s.title AS session_title,
          s.card_count,
          s.created_at,
          s.expires_at,
          EXTRACT(EPOCH FROM (s.expires_at - NOW())) / 3600 AS hours_remaining,
          u.username AS author_name,
          u.avatar_url AS author_avatar,
          u.is_verified AS author_verified,
          json_agg(
            json_build_object(
              'id', c.id,
              'card_index', c.card_index,
              'media_type', c.media_type,
              'media_url', c.media_url,
              'thumbnail_url', c.thumbnail_url,
              'duration_seconds', c.duration_seconds,
              'file_size_bytes', c.file_size_bytes,
              'resolution_w', c.resolution_w,
              'resolution_h', c.resolution_h,
              'aspect_ratio', c.aspect_ratio,
              'frame_rate', c.frame_rate,
              'format', c.format,
              'sound_title', c.sound_title,
              'is_duet', c.is_duet,
              'is_stitch', c.is_stitch,
              'views_count', c.views_count,
              'likes_count', c.likes_count,
              'comments_count', c.comments_count
            ) ORDER BY c.card_index ASC
          ) AS cards
        FROM fingershorts_sessions s
        JOIN fingershorts_cards c ON s.id = c.session_id
        LEFT JOIN users u ON u.id::text = s.author_id OR u.uuid = s.author_id
        WHERE s.is_published = true 
          AND s.expires_at > NOW()
          AND c.expires_at > NOW()
        GROUP BY s.id, u.id, u.username, u.avatar_url, u.is_verified
        ORDER BY s.created_at DESC
        LIMIT $1 OFFSET $2
      `;

      const result = await pool.query(query, [limit, offset]);

      res.json({
        success: true,
        message: 'For You FingerShorts feed retrieved',
        data: result.rows,
        count: result.rows.length,
        spec: {
          ttl_hours: 48,
          max_cards: MAX_CARDS_PER_SESSION,
          max_size_mb: 20,
          max_duration_sec: 60,
          cost: '$0.00 (Free)'
        }
      });
    } catch (error) {
      logger.error('Error in FingerShortsController.getForYou:', error);
      res.status(500).json({ success: false, error: 'Failed to retrieve feed', details: error.message });
    }
  }

  /**
   * GET /api/fingershorts/following
   */
  async getFollowing(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, error: 'Authentication required' });

      const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);

      const query = `
        SELECT 
          s.id AS session_id,
          s.author_id,
          s.title AS session_title,
          s.card_count,
          s.created_at,
          s.expires_at,
          EXTRACT(EPOCH FROM (s.expires_at - NOW())) / 3600 AS hours_remaining,
          u.username AS author_name,
          u.avatar_url AS author_avatar,
          json_agg(
            json_build_object(
              'id', c.id,
              'card_index', c.card_index,
              'media_type', c.media_type,
              'media_url', c.media_url,
              'thumbnail_url', c.thumbnail_url,
              'duration_seconds', c.duration_seconds
            ) ORDER BY c.card_index ASC
          ) AS cards
        FROM fingershorts_sessions s
        JOIN fingershorts_cards c ON s.id = c.session_id
        JOIN follows f ON (f.following_id::text = s.author_id)
        LEFT JOIN users u ON u.id::text = s.author_id OR u.uuid = s.author_id
        WHERE f.follower_id::text = $1
          AND s.is_published = true 
          AND s.expires_at > NOW()
        GROUP BY s.id, u.id, u.username, u.avatar_url
        ORDER BY s.created_at DESC
        LIMIT $2
      `;

      const result = await pool.query(query, [String(userId), limit]);
      res.json({ success: true, data: result.rows, count: result.rows.length });
    } catch (error) {
      logger.error('Error in FingerShortsController.getFollowing:', error);
      res.status(500).json({ success: false, error: 'Failed to retrieve following feed', details: error.message });
    }
  }

  /**
   * GET /api/fingershorts/trending
   */
  async getTrending(req, res) {
    try {
      const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);

      const query = `
        SELECT 
          c.*,
          s.author_id,
          s.title AS session_title,
          u.username AS author_name,
          u.avatar_url AS author_avatar
        FROM fingershorts_cards c
        JOIN fingershorts_sessions s ON c.session_id = s.id
        LEFT JOIN users u ON u.id::text = s.author_id OR u.uuid = s.author_id
        WHERE c.expires_at > NOW()
        ORDER BY (c.views_count * 0.4 + c.likes_count * 0.4 + c.comments_count * 0.2) DESC, c.created_at DESC
        LIMIT $1
      `;
      const result = await pool.query(query, [limit]);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      logger.error('Error in FingerShortsController.getTrending:', error);
      res.status(500).json({ success: false, error: 'Failed to retrieve trending shorts', details: error.message });
    }
  }

  /**
   * GET /api/fingershorts/sessions/:id
   */
  async getSessionById(req, res) {
    try {
      const { id } = req.params;

      const sessionQuery = `
        SELECT s.*,
          EXTRACT(EPOCH FROM (s.expires_at - NOW())) / 3600 AS hours_remaining,
          u.username AS author_name,
          u.avatar_url AS author_avatar
        FROM fingershorts_sessions s
        LEFT JOIN users u ON u.id::text = s.author_id OR u.uuid = s.author_id
        WHERE s.id = $1
      `;
      const sessionRes = await pool.query(sessionQuery, [id]);

      if (sessionRes.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'FingerShorts session not found' });
      }

      const cardsQuery = `
        SELECT * FROM fingershorts_cards
        WHERE session_id = $1
        ORDER BY card_index ASC
      `;
      const cardsRes = await pool.query(cardsQuery, [id]);

      const sessionData = {
        ...sessionRes.rows[0],
        cards: cardsRes.rows
      };

      res.json({ success: true, data: sessionData });
    } catch (error) {
      logger.error('Error in FingerShortsController.getSessionById:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch session', details: error.message });
    }
  }

  /**
   * POST /api/fingershorts/sessions
   * Creates a FingerShorts session with 1 to 20 media cards (48hr TTL)
   */
  async createSession(req, res) {
    const client = await pool.connect();
    try {
      const userId = req.user?.id || req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, error: 'Authentication required' });

      const { title, cards = [] } = req.body;

      if (!Array.isArray(cards) || cards.length === 0) {
        return res.status(400).json({ success: false, error: 'At least one media card is required' });
      }

      if (cards.length > MAX_CARDS_PER_SESSION) {
        return res.status(400).json({
          success: false,
          error: `A FingerShorts session cannot exceed ${MAX_CARDS_PER_SESSION} media cards`
        });
      }

      // Validate each card against specifications
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const cardIndex = i + 1;

        if (!card.media_url) {
          return res.status(400).json({ success: false, error: `Card ${cardIndex}: media_url is required` });
        }

        const size = parseInt(card.file_size_bytes, 10) || 0;
        if (size > MAX_FILE_SIZE_BYTES) {
          return res.status(400).json({
            success: false,
            error: `Card ${cardIndex}: File size exceeds 20MB limit (${MAX_FILE_SIZE_BYTES} bytes)`
          });
        }

        const duration = parseFloat(card.duration_seconds) || 0;
        if (card.media_type === 'video' && duration > MAX_VIDEO_DURATION_SECONDS) {
          return res.status(400).json({
            success: false,
            error: `Card ${cardIndex}: Video duration exceeds 1 minute (${MAX_VIDEO_DURATION_SECONDS}s)`
          });
        }

        const width = parseInt(card.resolution_w, 10) || 1080;
        const height = parseInt(card.resolution_h, 10) || 1920;
        if (width < MIN_RESOLUTION_W || height < MIN_RESOLUTION_H) {
          return res.status(400).json({
            success: false,
            error: `Card ${cardIndex}: Resolution below minimum required 540x960 pixels`
          });
        }

        const fps = parseInt(card.frame_rate, 10) || 30;
        if (fps < MIN_FRAME_RATE || fps > MAX_FRAME_RATE) {
          return res.status(400).json({
            success: false,
            error: `Card ${cardIndex}: Frame rate must be between 24 and 60 fps`
          });
        }
      }

      await client.query('BEGIN');

      // 1. Insert session
      const sessionInsert = `
        INSERT INTO fingershorts_sessions (
          author_id, title, card_count, is_published,
          expires_at, created_at, updated_at
        ) VALUES (
          $1, $2, $3, true,
          CURRENT_TIMESTAMP + INTERVAL '48 hours', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
        RETURNING *
      `;
      const sessionResult = await client.query(sessionInsert, [String(userId), title || '', cards.length]);
      const session = sessionResult.rows[0];

      // 2. Insert cards
      const insertedCards = [];
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const cardInsert = `
          INSERT INTO fingershorts_cards (
            session_id, author_id, card_index, media_type, media_url,
            thumbnail_url, file_size_bytes, duration_seconds, resolution_w, resolution_h,
            aspect_ratio, frame_rate, format, sound_title, sound_id,
            expires_at, created_at
          ) VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15,
            CURRENT_TIMESTAMP + INTERVAL '48 hours', CURRENT_TIMESTAMP
          )
          RETURNING *
        `;
        const cardResult = await client.query(cardInsert, [
          session.id,
          String(userId),
          i + 1,
          card.media_type || 'video',
          card.media_url,
          card.thumbnail_url || null,
          parseInt(card.file_size_bytes, 10) || 1048576,
          parseFloat(card.duration_seconds) || 15.0,
          parseInt(card.resolution_w, 10) || 1080,
          parseInt(card.resolution_h, 10) || 1920,
          card.aspect_ratio || '9:16',
          parseInt(card.frame_rate, 10) || 30,
          card.format || 'mp4',
          card.sound_title || null,
          card.sound_id || null
        ]);
        insertedCards.push(cardResult.rows[0]);
      }

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'FingerShorts story published successfully. UGC active for 48 hours.',
        data: {
          ...session,
          cards: insertedCards
        }
      });
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error in FingerShortsController.createSession:', error);
      res.status(500).json({ success: false, error: 'Failed to create FingerShorts session', details: error.message });
    } finally {
      client.release();
    }
  }

  /**
   * POST /api/fingershorts/sessions/:sessionId/cards
   * Adds an additional card to an existing session (max 20)
   */
  async addCardToSession(req, res) {
    try {
      const { sessionId } = req.params;
      const userId = req.user?.id || req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, error: 'Authentication required' });

      const countCheck = await pool.query(
        'SELECT COUNT(id) as current_count FROM fingershorts_cards WHERE session_id = $1',
        [sessionId]
      );
      const currentCount = parseInt(countCheck.rows[0].current_count, 10);
      if (currentCount >= MAX_CARDS_PER_SESSION) {
        return res.status(400).json({
          success: false,
          error: `Cannot add more cards. Max ${MAX_CARDS_PER_SESSION} cards allowed.`
        });
      }

      const {
        media_type = 'video',
        media_url,
        thumbnail_url,
        file_size_bytes,
        duration_seconds = 15.0,
        resolution_w = 1080,
        resolution_h = 1920,
        aspect_ratio = '9:16',
        frame_rate = 30,
        format = 'mp4',
        sound_title
      } = req.body;

      if (!media_url) return res.status(400).json({ success: false, error: 'media_url is required' });

      const nextIndex = currentCount + 1;
      const insert = `
        INSERT INTO fingershorts_cards (
          session_id, author_id, card_index, media_type, media_url,
          thumbnail_url, file_size_bytes, duration_seconds, resolution_w, resolution_h,
          aspect_ratio, frame_rate, format, sound_title,
          expires_at, created_at
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12, $13, $14,
          CURRENT_TIMESTAMP + INTERVAL '48 hours', CURRENT_TIMESTAMP
        )
        RETURNING *
      `;

      const result = await pool.query(insert, [
        sessionId,
        String(userId),
        nextIndex,
        media_type,
        media_url,
        thumbnail_url || null,
        parseInt(file_size_bytes, 10) || 1048576,
        parseFloat(duration_seconds),
        resolution_w,
        resolution_h,
        aspect_ratio,
        frame_rate,
        format,
        sound_title || null
      ]);

      await pool.query('UPDATE fingershorts_sessions SET card_count = card_count + 1 WHERE id = $1', [sessionId]);

      res.status(201).json({ success: true, message: 'Card added', data: result.rows[0] });
    } catch (error) {
      logger.error('Error in FingerShortsController.addCardToSession:', error);
      res.status(500).json({ success: false, error: 'Failed to add card', details: error.message });
    }
  }

  /**
   * DELETE /api/fingershorts/sessions/:id
   */
  async deleteSession(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.user?.userId;

      const del = 'DELETE FROM fingershorts_sessions WHERE id = $1 AND author_id = $2 RETURNING *';
      const result = await pool.query(del, [id, String(userId)]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Session not found or unauthorized' });
      }

      res.json({ success: true, message: 'FingerShorts session deleted' });
    } catch (error) {
      logger.error('Error in FingerShortsController.deleteSession:', error);
      res.status(500).json({ success: false, error: 'Failed to delete session', details: error.message });
    }
  }

  /**
   * POST /api/fingershorts/cards/:cardId/view
   */
  async recordView(req, res) {
    try {
      const { cardId, id } = req.params;
      const targetId = cardId || id;
      await pool.query('UPDATE fingershorts_cards SET views_count = views_count + 1 WHERE id = $1', [targetId]);
      res.json({ success: true, message: 'View recorded' });
    } catch (error) {
      logger.error('Error in FingerShortsController.recordView:', error);
      res.status(500).json({ success: false, error: 'Failed to record view' });
    }
  }

  /**
   * POST /api/fingershorts/cards/:cardId/like
   */
  async toggleLike(req, res) {
    try {
      const { cardId, id } = req.params;
      const targetId = cardId || id;
      await pool.query('UPDATE fingershorts_cards SET likes_count = likes_count + 1 WHERE id = $1', [targetId]);
      res.json({ success: true, message: 'Like recorded' });
    } catch (error) {
      logger.error('Error in FingerShortsController.toggleLike:', error);
      res.status(500).json({ success: false, error: 'Failed to toggle like' });
    }
  }

  /**
   * GET /api/fingershorts/cards/:cardId/comments
   */
  async getComments(req, res) {
    try {
      const { cardId, id } = req.params;
      const targetId = cardId || id;
      const query = `
        SELECT c.*,
          u.username as author_name,
          u.avatar_url as author_avatar
        FROM comments c
        LEFT JOIN users u ON u.id::text = c.user_id::text
        WHERE c.video_id = $1 AND c.type = 'fingershort'
        ORDER BY c.created_at DESC
      `;
      const result = await pool.query(query, [targetId]);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      logger.error('Error in FingerShortsController.getComments:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch comments' });
    }
  }

  /**
   * POST /api/fingershorts/cards/:cardId/comments
   */
  async addComment(req, res) {
    try {
      const { cardId, id } = req.params;
      const targetId = cardId || id;
      const userId = req.user?.id || req.user?.userId;
      const { content } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({ success: false, error: 'Comment content cannot be empty' });
      }

      const insert = `
        INSERT INTO comments (user_id, video_id, type, content, created_at)
        VALUES ($1, $2, 'fingershort', $3, NOW())
        RETURNING *
      `;
      const result = await pool.query(insert, [userId, targetId, content.trim()]);
      await pool.query('UPDATE fingershorts_cards SET comments_count = comments_count + 1 WHERE id = $1', [targetId]);

      res.status(201).json({ success: true, message: 'Comment added', data: result.rows[0] });
    } catch (error) {
      logger.error('Error in FingerShortsController.addComment:', error);
      res.status(500).json({ success: false, error: 'Failed to add comment' });
    }
  }

  /**
   * DELETE /api/fingershorts/comments/:commentId
   */
  async deleteComment(req, res) {
    try {
      const { commentId, id } = req.params;
      const targetId = commentId || id;
      const userId = req.user?.id || req.user?.userId;

      const del = 'DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING video_id';
      const result = await pool.query(del, [targetId, userId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Comment not found or unauthorized' });
      }

      await pool.query('UPDATE fingershorts_cards SET comments_count = GREATEST(0, comments_count - 1) WHERE id = $1', [result.rows[0].video_id]);

      res.json({ success: true, message: 'Comment removed' });
    } catch (error) {
      logger.error('Error in FingerShortsController.deleteComment:', error);
      res.status(500).json({ success: false, error: 'Failed to delete comment' });
    }
  }

  /**
   * POST /api/fingershorts/duet
   * Create side-by-side duet linked to original card
   */
  async createDuet(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, error: 'Authentication required' });

      const { original_card_id, duet_media_url, layout = 'side_by_side', duration_seconds = 15.0 } = req.body;

      if (!original_card_id || !duet_media_url) {
        return res.status(400).json({ success: false, error: 'original_card_id and duet_media_url are required' });
      }

      // Check original card exists
      const origCheck = await pool.query('SELECT * FROM fingershorts_cards WHERE id = $1', [original_card_id]);
      if (origCheck.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Original card not found' });
      }

      // 1. Create a session for this duet
      const sessionRes = await pool.query(
        `INSERT INTO fingershorts_sessions (author_id, title, card_count, is_published, expires_at)
         VALUES ($1, $2, 1, true, CURRENT_TIMESTAMP + INTERVAL '48 hours')
         RETURNING *`,
        [String(userId), `Duet with @${origCheck.rows[0].author_id}`]
      );

      // 2. Insert duet card
      const cardRes = await pool.query(
        `INSERT INTO fingershorts_cards (
          session_id, author_id, card_index, media_type, media_url,
          file_size_bytes, duration_seconds, is_duet, duet_original_card_id,
          expires_at
        ) VALUES (
          $1, $2, 1, 'video', $3,
          10485760, $4, true, $5,
          CURRENT_TIMESTAMP + INTERVAL '48 hours'
        )
        RETURNING *`,
        [sessionRes.rows[0].id, String(userId), duet_media_url, parseFloat(duration_seconds), original_card_id]
      );

      // 3. Link duet record
      await pool.query(
        `INSERT INTO fingershorts_duets (original_card_id, duet_card_id, creator_id, layout)
         VALUES ($1, $2, $3, $4)`,
        [original_card_id, cardRes.rows[0].id, String(userId), layout]
      );

      res.status(201).json({
        success: true,
        message: 'Duet published successfully',
        data: {
          session: sessionRes.rows[0],
          card: cardRes.rows[0],
          original_card: origCheck.rows[0]
        }
      });
    } catch (error) {
      logger.error('Error in FingerShortsController.createDuet:', error);
      res.status(500).json({ success: false, error: 'Failed to create duet', details: error.message });
    }
  }

  /**
   * POST /api/fingershorts/stitch
   * Stitch / Collage from another member's video clip
   */
  async createStitch(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, error: 'Authentication required' });

      const {
        original_card_id,
        stitch_media_url,
        stitch_start_seconds = 0,
        stitch_duration_seconds = 5.0,
        total_duration_seconds = 15.0
      } = req.body;

      if (!original_card_id || !stitch_media_url) {
        return res.status(400).json({ success: false, error: 'original_card_id and stitch_media_url are required' });
      }

      const origCheck = await pool.query('SELECT * FROM fingershorts_cards WHERE id = $1', [original_card_id]);
      if (origCheck.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Original card not found' });
      }

      const sessionRes = await pool.query(
        `INSERT INTO fingershorts_sessions (author_id, title, card_count, is_published, expires_at)
         VALUES ($1, $2, 1, true, CURRENT_TIMESTAMP + INTERVAL '48 hours')
         RETURNING *`,
        [String(userId), `Stitch with @${origCheck.rows[0].author_id}`]
      );

      const cardRes = await pool.query(
        `INSERT INTO fingershorts_cards (
          session_id, author_id, card_index, media_type, media_url,
          file_size_bytes, duration_seconds, is_stitch, stitch_original_card_id,
          expires_at
        ) VALUES (
          $1, $2, 1, 'video', $3,
          10485760, $4, true, $5,
          CURRENT_TIMESTAMP + INTERVAL '48 hours'
        )
        RETURNING *`,
        [sessionRes.rows[0].id, String(userId), stitch_media_url, parseFloat(total_duration_seconds), original_card_id]
      );

      await pool.query(
        `INSERT INTO fingershorts_stitches (original_card_id, stitch_card_id, creator_id, stitch_start_seconds, stitch_duration_seconds)
         VALUES ($1, $2, $3, $4, $5)`,
        [original_card_id, cardRes.rows[0].id, String(userId), parseFloat(stitch_start_seconds), parseFloat(stitch_duration_seconds)]
      );

      res.status(201).json({
        success: true,
        message: 'Stitch published successfully',
        data: {
          session: sessionRes.rows[0],
          card: cardRes.rows[0]
        }
      });
    } catch (error) {
      logger.error('Error in FingerShortsController.createStitch:', error);
      res.status(500).json({ success: false, error: 'Failed to create stitch', details: error.message });
    }
  }

  /**
   * GET /api/fingershorts/sounds
   * Sound and music library lookup
   */
  async getSounds(req, res) {
    try {
      const query = req.query.q;
      let sql = 'SELECT * FROM fingershorts_sounds';
      const params = [];

      if (query) {
        sql += ' WHERE title ILIKE $1 OR artist ILIKE $1';
        params.push(`%${query}%`);
      }

      sql += ' ORDER BY use_count DESC LIMIT 50';
      const result = await pool.query(sql, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      logger.error('Error in FingerShortsController.getSounds:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch sound library' });
    }
  }

  /**
   * POST /api/fingershorts/sounds
   * Upload custom sound / audio
   */
  async uploadSound(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const { title, artist, audio_url, duration_seconds } = req.body;

      if (!title || !audio_url) {
        return res.status(400).json({ success: false, error: 'title and audio_url are required' });
      }

      const insert = `
        INSERT INTO fingershorts_sounds (title, artist, audio_url, duration_seconds, is_original, creator_id)
        VALUES ($1, $2, $3, $4, true, $5)
        RETURNING *
      `;
      const result = await pool.query(insert, [
        title,
        artist || 'Original Audio',
        audio_url,
        Math.min(parseFloat(duration_seconds) || 15.0, 60.0),
        userId ? String(userId) : null
      ]);

      res.status(201).json({ success: true, message: 'Custom sound added', data: result.rows[0] });
    } catch (error) {
      logger.error('Error in FingerShortsController.uploadSound:', error);
      res.status(500).json({ success: false, error: 'Failed to upload sound' });
    }
  }

  /**
   * POST /api/fingershorts/video-replies
   * Respond to a comment with a video/GIF/image
   */
  async createVideoReply(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, error: 'Authentication required' });

      const { parent_comment_id, reply_media_url, media_type = 'video' } = req.body;
      if (!parent_comment_id || !reply_media_url) {
        return res.status(400).json({ success: false, error: 'parent_comment_id and reply_media_url are required' });
      }

      // Create a short card for this reply
      const sessionRes = await pool.query(
        `INSERT INTO fingershorts_sessions (author_id, title, card_count, is_published, expires_at)
         VALUES ($1, 'Video Reply', 1, true, CURRENT_TIMESTAMP + INTERVAL '48 hours')
         RETURNING id`,
        [String(userId)]
      );

      const cardRes = await pool.query(
        `INSERT INTO fingershorts_cards (
          session_id, author_id, card_index, media_type, media_url,
          file_size_bytes, duration_seconds, expires_at
        ) VALUES ($1, $2, 1, $3, $4, 10485760, 15.0, CURRENT_TIMESTAMP + INTERVAL '48 hours')
        RETURNING id`,
        [sessionRes.rows[0].id, String(userId), media_type, reply_media_url]
      );

      const replyRes = await pool.query(
        `INSERT INTO fingershorts_video_replies (parent_comment_id, reply_card_id, replier_id, media_type)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [String(parent_comment_id), cardRes.rows[0].id, String(userId), media_type]
      );

      res.status(201).json({ success: true, message: 'Video reply posted', data: replyRes.rows[0] });
    } catch (error) {
      logger.error('Error in FingerShortsController.createVideoReply:', error);
      res.status(500).json({ success: false, error: 'Failed to post video reply' });
    }
  }

  /**
   * GET /api/fingershorts/analytics/creator
   */
  async getCreatorAnalytics(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, error: 'Authentication required' });

      const query = `
        SELECT 
          COUNT(DISTINCT s.id) AS total_sessions,
          COUNT(c.id) AS total_cards,
          COALESCE(SUM(c.views_count), 0) AS total_views,
          COALESCE(SUM(c.likes_count), 0) AS total_likes,
          COALESCE(SUM(c.comments_count), 0) AS total_comments
        FROM fingershorts_sessions s
        LEFT JOIN fingershorts_cards c ON s.id = c.session_id
        WHERE s.author_id = $1
      `;
      const result = await pool.query(query, [String(userId)]);
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      logger.error('Error in FingerShortsController.getCreatorAnalytics:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch creator analytics' });
    }
  }

  /**
   * POST /api/fingershorts/admin/expire-old
   * Housekeeping job to mark expired UGC past 48 hours
   */
  async expireOldShorts(req, res) {
    try {
      const update = `
        UPDATE fingershorts_sessions
        SET is_published = false, updated_at = NOW()
        WHERE is_published = true AND expires_at <= NOW()
        RETURNING id
      `;
      const result = await pool.query(update);
      res.json({ success: true, message: `Expired ${result.rows.length} FingerShorts sessions past 48h TTL` });
    } catch (error) {
      logger.error('Error in FingerShortsController.expireOldShorts:', error);
      res.status(500).json({ success: false, error: 'Failed to run expiration job' });
    }
  }
}

module.exports = new FingerShortsController();
