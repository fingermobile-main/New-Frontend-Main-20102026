/**
 * Beatwave Controller
 * Complete implementation for music platform
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class BeatwaveController {
  /**
   * GET /api/beatwave/tracks
   * Get music tracks
   */
  async getTracks(req, res) {
    try {
      const { 
        limit = 50, 
        offset = 0, 
        genre, 
        mood,
        bpm, sortBy = 'created_at'
      } = req.query;

      let whereClause = ['is_published = true'];
      let queryParams = [];
      let paramCount = 1;

      if (genre) {
        whereClause.push(`genre = $${paramCount}`);
        queryParams.push(genre);
        paramCount++;
      }

      if (mood) {
        whereClause.push(`mood = $${paramCount}`);
        queryParams.push(mood);
        paramCount++;
      }

      if (bpm) {
        whereClause.push(`bpm = $${paramCount}`);
        queryParams.push(parseInt(bpm));
        paramCount++;
      }

      const whereSQL = whereClause.join(' AND ');

      const result = await pool.query(`SELECT 
          t.id,
          t.title,
          t.description,
          t.genre,
          t.mood,
          t.bpm,
          t.duration_seconds,
          t.audio_url,
          t.cover_art_url,
          t.artist_id,
          u.username as artist_name,
          u.avatar_url as artist_avatar,
          COUNT(DISTINCT l.id) as likes_count,
          COUNT(DISTINCT p.id) as plays_count, t.created_at
         FROM beatwave_tracks t
         JOIN users u ON t.artist_id = u.id
         LEFT JOIN likes l ON l.target_id = t.id AND l.target_type = 'track'
         LEFT JOIN beatwave_plays p ON p.track_id = t.id
         WHERE $1
         GROUP BY t.id, u.username, u.avatar_url
         ORDER BY t.${sortBy} DESC
         LIMIT $${paramCount} OFFSET $${paramCount + 1}`, [...queryParams, parseInt(limit), parseInt(offset), whereSQL]);

      res.json({
        success: true,
        data: result.rows.map(track => ({
          ...track,
          durationSeconds: parseInt(track.duration_seconds),
          bpm: parseInt(track.bpm),
          likesCount: parseInt(track.likes_count),
          playsCount: parseInt(track.plays_count)
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset), total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in BeatwaveController.getTracks:', error);
      res.status(500).json({
        success: false, message: 'Failed to get tracks', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/beatwave/tracks
   * Upload new track
   */
  async uploadTrack(req, res) {
    try {
      const userId = req.user?.id;
      const { 
        title, 
        description, 
        genre, 
        mood, 
        bpm, 
        durationSeconds,
        audioUrl,
        coverArtUrl,
        tags
      } = req.body;

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
        `INSERT INTO beatwave_tracks 
         (artist_id, title, description, genre, mood, bpm, duration_seconds, audio_url, cover_art_url, tags, is_published, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, NOW())
         RETURNING *`,
        [
          userId,
          title,
          description || null,
          genre || null,
          mood || null,
          bpm ? parseInt(bpm) : null,
          durationSeconds ? parseInt(durationSeconds) : null,
          audioUrl,
          coverArtUrl || null,
          JSON.stringify(tags || [])
        ]
      );

      res.status(201).json({
        success: true, message: 'Track uploaded successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in BeatwaveController.uploadTrack:', error);
      res.status(500).json({
        success: false, message: 'Failed to upload track', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/beatwave/tracks/:id/play
   * Record track play
   */
  async recordPlay(req, res) {
    try {
      const userId = req.user?.id;
      const { id: trackId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      await pool.query(
        `INSERT INTO beatwave_plays (user_id, track_id, played_at)
         VALUES ($1, $2, NOW())`,
        [userId, trackId]
      );

      res.json({
        success: true, message: 'Play recorded'
      });
    } catch (error) {
      logger.error('Error in BeatwaveController.recordPlay:', error);
      res.status(500).json({
        success: false, message: 'Failed to record play', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/beatwave/trending
   * Get trending tracks
   */
  async getTrending(req, res) {
    try {
      const { limit = 20, timeframe = '7d' } = req.query;

      let timeFilter = '';
      if (timeframe === '24h') {
        timeFilter = 'AND bp.played_at >= NOW() - INTERVAL \'24 hours\'';
      } else if (timeframe === '7d') {
        timeFilter = 'AND bp.played_at >= NOW() - INTERVAL \'7 days\'';
      } else if (timeframe === '30d') {
        timeFilter = 'AND bp.played_at >= NOW() - INTERVAL \'30 days\'';
      }

      const result = await pool.query(`SELECT 
          t.*,
          u.username as artist_name,
          u.avatar_url as artist_avatar,
          COUNT(DISTINCT bp.id) as plays_count, COUNT(DISTINCT l.id) as likes_count
         FROM beatwave_tracks t
         JOIN users u ON t.artist_id = u.id
         LEFT JOIN beatwave_plays bp ON t.id = bp.track_id ${timeFilter}
         LEFT JOIN likes l ON l.target_id = t.id AND l.target_type = 'track' WHERE t.is_published = true
         GROUP BY t.id, u.username, u.avatar_url
         ORDER BY plays_count DESC
         LIMIT $1`, [parseInt(limit)]);

      res.json({
        success: true,
        data: result.rows.map(track => ({
          ...track,
          durationSeconds: parseInt(track.duration_seconds),
          bpm: parseInt(track.bpm),
          playsCount: parseInt(track.plays_count), likesCount: parseInt(track.likes_count)
        }))
      });
    } catch (error) {
      logger.error('Error in BeatwaveController.getTrending:', error);
      res.status(500).json({
        success: false, message: 'Failed to get trending tracks', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/beatwave/genres
   * Get popular genres
   */
  async getGenres(req, res) {
    try {
      const result = await pool.query(
        `SELECT 
          genre,
          COUNT(*) as track_count
         FROM beatwave_tracks
         WHERE is_published = true AND genre IS NOT NULL
         GROUP BY genre
         ORDER BY track_count DESC`
      );

      res.json({
        success: true,
        data: result.rows.map(row => ({
          genre: row.genre, trackCount: parseInt(row.track_count)
        }))
      });
    } catch (error) {
      logger.error('Error in BeatwaveController.getGenres:', error);
      res.status(500).json({
        success: false, message: 'Failed to get genres', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new BeatwaveController();
