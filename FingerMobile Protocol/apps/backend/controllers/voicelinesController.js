/**
 * Voicelines Controller
 * Complete implementation for voice lines/audio clips platform
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class VoicelinesController {
  /**
   * GET /api/voicelines/clips
   * Get voice clips
   */
  async getClips(req, res) {
    try {
      const { limit = 50, offset = 0, category, mood, language } = req.query;

      let whereClause = ['is_published = true'];
      let queryParams = [];
      let paramCount = 1;

      if (category) {
        whereClause.push(`category = $${paramCount}`);
        queryParams.push(category);
        paramCount++;
      }

      if (mood) {
        whereClause.push(`mood = $${paramCount}`);
        queryParams.push(mood);
        paramCount++;
      }

      if (language) {
        whereClause.push(`language = $${paramCount}`);
        queryParams.push(language);
        paramCount++;
      }

      const whereSQL = whereClause.join(' AND ');

      // Fixed: Converted string to backticks, moved whereSQL to safe inline string template, and added missing comma selection delimiter
      const result = await pool.query(`
        SELECT 
          v.*,
          u.username as creator_username,
          u.avatar_url as creator_avatar,
          COUNT(DISTINCT l.id) as likes_count, 
          COUNT(DISTINCT d.id) as downloads_count
         FROM voicelines_clips v
         LEFT JOIN users u ON v.creator_id = u.id
         LEFT JOIN likes l ON l.target_id = v.id AND l.target_type = 'voice_clip'
         LEFT JOIN voicelines_downloads d ON d.clip_id = v.id
         WHERE ${whereSQL}
         GROUP BY v.id, u.username, u.avatar_url
         ORDER BY v.created_at DESC
         LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `, [...queryParams, parseInt(limit), parseInt(offset)]);

      res.json({
        success: true,
        data: result.rows.map(clip => ({
          ...clip,
          text: clip.title,
          category: clip.category,
          audioUrl: clip.audio_url,
          keywords: Array.isArray(clip.keywords) ? clip.keywords : [],
          durationSeconds: parseInt(clip.duration_seconds || 3),
          likesCount: parseInt(clip.likes_count || 0),
          downloadsCount: parseInt(clip.downloads_count || 0)
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in VoicelinesController.getClips:', error);
      res.status(500).json({
        success: false, message: 'Failed to get voice clips', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/voicelines/clips
   * Upload voice clip
   */
  async uploadClip(req, res) {
    try {
      const userId = req.user?.id;
      const { title, audioUrl, durationSeconds, category, mood, language, tags, keywords } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (!title || !audioUrl) {
        return res.status(400).json({
          success: false, message: 'Title and audio URL are required'
        });
      }

      const result = await pool.query(
        `INSERT INTO voicelines_clips 
         (creator_id, title, audio_url, duration_seconds, category, mood, language, tags, keywords, is_published, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, NOW())
         RETURNING *`,
        [
          userId,
          title,
          audioUrl,
          durationSeconds ? parseInt(durationSeconds) : 3,
          category || 'general',
          mood || null,
          language || 'en-NG',
          JSON.stringify(tags || []),
          JSON.stringify(keywords || [])
        ]
      );

      res.status(201).json({
        success: true, message: 'Voice clip uploaded successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in VoicelinesController.uploadClip:', error);
      res.status(500).json({
        success: false, message: 'Failed to upload clip', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/voicelines/clips/:id/download
   * Download voice clip
   */
  async downloadClip(req, res) {
    try {
      const userId = req.user?.id;
      const { id: clipId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      await pool.query(
        `INSERT INTO voicelines_downloads (user_id, clip_id, downloaded_at)
         VALUES ($1, $2, NOW())`,
        [userId, clipId]
      );

      const clip = await pool.query(
        'SELECT audio_url FROM voicelines_clips WHERE id = $1',
        [clipId]
      );

      res.json({
        success: true, data: {
          downloadUrl: clip.rows[0]?.audio_url
        }
      });
    } catch (error) {
      logger.error('Error in VoicelinesController.downloadClip:', error);
      res.status(500).json({
        success: false, message: 'Failed to download clip', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/voicelines/categories
   * Get clip categories
   */
  async getCategories(req, res) {
    try {
      const result = await pool.query(
        `SELECT 
          category,
          COUNT(*) as clip_count
         FROM voicelines_clips
         WHERE is_published = true AND category IS NOT NULL
         GROUP BY category
         ORDER BY clip_count DESC`
      );

      res.json({
        success: true,
        data: result.rows.map(row => ({
          category: row.category,
          clipCount: parseInt(row.clip_count)
        }))
      });
    } catch (error) {
      logger.error('Error in VoicelinesController.getCategories:', error);
      res.status(500).json({
        success: false, message: 'Failed to get categories', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/voice-lines/categories/:category/random
   * Get random voice line by category
   */
  async getRandomClip(req, res) {
    try {
      const { category } = req.params;
      let query = 'SELECT * FROM voicelines_clips WHERE is_published = true';
      const params = [];

      if (category && category !== 'all' && category !== 'general') {
        query += ' AND category = $1';
        params.push(category);
      }

      query += ' ORDER BY RANDOM() LIMIT 1';
      const result = await pool.query(query, params);

      if (result.rows.length === 0) {
        // Fallback to any published clip
        const fallback = await pool.query('SELECT * FROM voicelines_clips WHERE is_published = true ORDER BY RANDOM() LIMIT 1');
        const clip = fallback.rows[0];
        if (!clip) {
          return res.json({ success: true, data: null });
        }
        return res.json({
          success: true,
          data: {
            id: clip.id,
            text: clip.title,
            category: clip.category,
            audioUrl: clip.audio_url,
            keywords: Array.isArray(clip.keywords) ? clip.keywords : []
          }
        });
      }

      const clip = result.rows[0];
      res.json({
        success: true,
        data: {
          id: clip.id,
          text: clip.title,
          category: clip.category,
          audioUrl: clip.audio_url,
          keywords: Array.isArray(clip.keywords) ? clip.keywords : []
        }
      });
    } catch (error) {
      logger.error('Error in VoicelinesController.getRandomClip:', error);
      res.status(500).json({
        success: false, message: 'Failed to get random voice clip', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/voice-lines/search
   * Search voice lines by text or keyword
   */
  async searchClips(req, res) {
    try {
      const q = req.query.q || req.query.query || '';
      const queryPattern = `%${q.toLowerCase()}%`;

      const result = await pool.query(
        `SELECT * FROM voicelines_clips 
         WHERE is_published = true 
           AND (LOWER(title) LIKE $1 OR LOWER(category) LIKE $1 OR tags::text ILIKE $1 OR keywords::text ILIKE $1)
         ORDER BY created_at DESC LIMIT 50`,
        [queryPattern]
      );

      res.json({
        success: true,
        data: result.rows.map(clip => ({
          id: clip.id,
          text: clip.title,
          category: clip.category,
          audioUrl: clip.audio_url,
          keywords: Array.isArray(clip.keywords) ? clip.keywords : []
        }))
      });
    } catch (error) {
      logger.error('Error in VoicelinesController.searchClips:', error);
      res.status(500).json({
        success: false, message: 'Failed to search voice clips', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/voice-lines/log
   * Log playback trigger
   */
  async logPlayback(req, res) {
    try {
      const { voiceLineId, eventType, memberId, microservice } = req.body;
      await pool.query(
        `INSERT INTO voicelines_playback_logs (voice_line_id, event_type, microservice, member_id, played_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [
          voiceLineId || null,
          eventType || 'commentary',
          microservice || 'general',
          memberId ? parseInt(memberId) : null
        ]
      );

      res.json({ success: true, message: 'Voice line playback logged' });
    } catch (error) {
      logger.error('Error in VoicelinesController.logPlayback:', error);
      res.status(500).json({
        success: false, message: 'Failed to log voice line playback', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/voice-lines/settings
   * Retrieve platform-wide VoiceLine settings directly from PostgreSQL
   */
  async getSettings(req, res) {
    try {
      const result = await pool.query('SELECT * FROM voiceline_system_settings WHERE id = $1 LIMIT 1', ['default']);
      if (result.rows.length === 0) {
        return res.json({
          success: true,
          data: {
            volume: 0.35,
            audioPlaybackRate: 0.88,
            utteranceRate: 0.46,
            bassBoostDb: 6.0,
            pitch: 0.80,
            enabled: true,
            microservices: {
              forum: true,
              hallmarks: true,
              mii: true,
              groups: true,
              lushpressies: true,
              blogs: true,
              gems: true,
              tribut: true
            }
          }
        });
      }

      const row = result.rows[0];
      res.json({
        success: true,
        data: {
          id: row.id,
          volume: parseFloat(row.volume || 0.35),
          audioPlaybackRate: parseFloat(row.audio_playback_rate || 0.88),
          utteranceRate: parseFloat(row.utterance_rate || 0.46),
          bassBoostDb: parseFloat(row.bass_boost_db || 6.0),
          pitch: parseFloat(row.pitch || 0.80),
          enabled: Boolean(row.enabled !== false),
          microservices: typeof row.microservices === 'object' && row.microservices !== null
            ? { gems: true, tribut: true, ...row.microservices }
            : { forum: true, hallmarks: true, mii: true, groups: true, lushpressies: true, blogs: true, gems: true, tribut: true },
          updatedAt: row.updated_at,
          updatedBy: row.updated_by
        }
      });
    } catch (error) {
      logger.error('Error in VoicelinesController.getSettings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve VoiceLine settings from PostgreSQL',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST/PUT /api/voice-lines/settings
   * Persist platform-wide VoiceLine settings directly to PostgreSQL
   */
  async saveSettings(req, res) {
    try {
      const {
        volume = 0.35,
        audioPlaybackRate = 0.88,
        utteranceRate = 0.46,
        bassBoostDb = 6.0,
        pitch = 0.80,
        enabled = true,
        microservices = {}
      } = req.body;

      const userIdentifier = req.user?.username || req.user?.email || 'admin';

      const upsertResult = await pool.query(
        `INSERT INTO voiceline_system_settings 
          (id, utterance_rate, audio_playback_rate, volume, bass_boost_db, pitch, enabled, microservices, updated_at, updated_by)
         VALUES ('default', $1, $2, $3, $4, $5, $6, $7, NOW(), $8)
         ON CONFLICT (id) DO UPDATE SET
          utterance_rate = EXCLUDED.utterance_rate,
          audio_playback_rate = EXCLUDED.audio_playback_rate,
          volume = EXCLUDED.volume,
          bass_boost_db = EXCLUDED.bass_boost_db,
          pitch = EXCLUDED.pitch,
          enabled = EXCLUDED.enabled,
          microservices = EXCLUDED.microservices,
          updated_at = NOW(),
          updated_by = EXCLUDED.updated_by
         RETURNING *`,
        [
          parseFloat(utteranceRate),
          parseFloat(audioPlaybackRate),
          parseFloat(volume),
          parseFloat(bassBoostDb),
          parseFloat(pitch),
          Boolean(enabled),
          JSON.stringify(microservices),
          userIdentifier
        ]
      );

      const row = upsertResult.rows[0];
      res.json({
        success: true,
        message: 'VoiceLine preferences successfully saved to PostgreSQL database.',
        data: {
          id: row.id,
          volume: parseFloat(row.volume),
          audioPlaybackRate: parseFloat(row.audio_playback_rate),
          utteranceRate: parseFloat(row.utterance_rate),
          bassBoostDb: parseFloat(row.bass_boost_db),
          pitch: parseFloat(row.pitch),
          enabled: Boolean(row.enabled),
          microservices: row.microservices,
          updatedAt: row.updated_at,
          updatedBy: row.updated_by
        }
      });
    } catch (error) {
      logger.error('Error in VoicelinesController.saveSettings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save VoiceLine preferences to PostgreSQL database',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/voice-lines/all
   * Return full collection of all active VoiceLines for non-repeating rotating usage
   */
  async getAllClips(req, res) {
    try {
      const result = await pool.query(
        `SELECT id, title, audio_url, category, tags, keywords, duration_seconds 
         FROM voicelines_clips 
         WHERE is_published = true 
         ORDER BY created_at DESC LIMIT 500`
      );

      res.json({
        success: true,
        total: result.rows.length,
        data: result.rows.map(clip => ({
          id: clip.id,
          text: clip.title,
          category: clip.category,
          audioUrl: clip.audio_url,
          keywords: Array.isArray(clip.keywords) ? clip.keywords : [],
          tags: Array.isArray(clip.tags) ? clip.tags : []
        }))
      });
    } catch (error) {
      logger.error('Error in VoicelinesController.getAllClips:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve voice lines from PostgreSQL',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/voice/pipecat/config
   * Pipecat Voice SDK configuration
   */
  async getPipecatConfig(req, res) {
    res.json({
      success: true,
      service: 'FingerMobile Pipecat Voice Engine',
      version: '1.13.1',
      supportedTransports: ['webrtc', 'websocket', 'webaudio'],
      voiceSettings: {
        defaultVolume: 0.35,
        defaultVoice: 'african-cultured',
        supportedMicroservices: ['forum', 'hallmarks', 'mii', 'groups', 'lushpressies', 'blogs']
      }
    });
  }
}

module.exports = new VoicelinesController();
