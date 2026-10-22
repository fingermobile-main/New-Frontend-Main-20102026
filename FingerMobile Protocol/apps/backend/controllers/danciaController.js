const { randomUUID } = require('crypto');
const pool = require('../db');
const logger = require('../utils/logger');

// Helper to format DB row to DanciaVideo object
function formatVideo(row) {
  const views = parseInt(row.views || 0, 10);
  const likes = parseInt(row.likes || 0, 10);
  return {
    videoID: row.id,
    title: row.title,
    description: row.description || '',
    genre: row.genre || 'General',
    streamURL: row.stream_url || '',
    thumbnailURL: row.thumbnail_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
    length: row.duration_seconds || 300,
    resolution: row.resolution || '1080p',
    uploadDate: row.created_at || new Date().toISOString(),
    uploaderID: 'system',
    engagementScore: views + (likes * 2),
    downloadCount: Math.floor(views / 5),
    shareCount: Math.floor(views / 10),
    saveCount: Math.floor(views / 8),
    likeCount: likes,
    mashupCount: 0,
    IARCClassification: {
      classificationID: 'iarc-1',
      rating: row.iarc_rating || 'PG-13'
    },
    monetizationModel: {
      modelID: 'model-1',
      name: 'Starter Pack',
      revenueShare: 70,
      currency: 'USD',
      thresholds: {
        likes: 100,
        shares: 50,
        comments: 25,
        watchTimeSeconds: 300
      }
    },
    uploadFee: 0,
    contentTags: [row.genre || 'General', 'FingerMobile', 'HD'],
    isFavorite: false,
    hasBeenPlayed: false
  };
}

exports.getTvChannels = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, description, stream_url, is_active
       FROM dancia_channels
       WHERE is_active = true AND moderation_status = 'active' AND archived_at IS NULL
       ORDER BY name ASC`
    );

    res.json({
      success: true,
      message: 'TV channels retrieved successfully',
      data: result.rows
    });
  } catch (error) {
    logger.error('Error fetching TV channels:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getSchedule = async (req, res) => {
  try {
    const { channel_id, date } = req.query;

    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    let query = `
      SELECT s.id, s.start_time, s.end_time, s.is_live, 
             p.title, p.description, p.genre, p.thumbnail_url,
             c.name as channel_name, c.id as channel_id
      FROM dancia_schedules s
      JOIN dancia_programs p ON s.program_id = p.id
      JOIN dancia_channels c ON p.channel_id = c.id
      WHERE s.start_time >= $1 AND s.start_time < $2
        AND s.moderation_status = 'active'
        AND p.moderation_status = 'active'
        AND c.moderation_status = 'active'
    `;
    const queryParams = [targetDate.toISOString(), nextDate.toISOString()];

    if (channel_id) {
      query += ' AND p.channel_id = $3';
      queryParams.push(channel_id);
    }

    query += ' ORDER BY s.start_time ASC';

    const result = await pool.query(query, queryParams);

    res.json({
      success: true,
      message: 'TV schedule retrieved successfully',
      data: result.rows
    });
  } catch (error) {
    logger.error('Error fetching TV schedule:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getVideos = async (req, res) => {
  try {
    const { genre } = req.query;
    let query = `SELECT * FROM dancia_videos
      WHERE is_active = true AND moderation_status = 'active' AND archived_at IS NULL
        AND (expires_at IS NULL OR expires_at > NOW())`;
    const params = [];

    if (genre) {
      query += ' AND genre = $1';
      params.push(genre);
    }

    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    const videos = result.rows.map(formatVideo);

    res.json(videos);
  } catch (error) {
    logger.error('Error fetching Dancia-4Tv videos:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.searchVideos = async (req, res) => {
  try {
    const queryTerm = req.query.q || '';
    const result = await pool.query(
      `SELECT * FROM dancia_videos 
       WHERE is_active = true
         AND moderation_status = 'active'
         AND archived_at IS NULL
         AND (expires_at IS NULL OR expires_at > NOW())
         AND (title ILIKE $1 OR description ILIKE $1 OR genre ILIKE $1)
       ORDER BY views DESC`,
      [`%${queryTerm}%`]
    );
    const videos = result.rows.map(formatVideo);
    res.json(videos);
  } catch (error) {
    logger.error('Error searching Dancia-4Tv videos:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getPlans = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id as "planID", name, description, price, features
       FROM dancia_subscription_plans
       WHERE is_active = true AND moderation_status = 'active' AND archived_at IS NULL
       ORDER BY price ASC`
    );
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching Dancia-4Tv subscription plans:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getGenres = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT genre FROM dancia_videos
       WHERE is_active = true
         AND moderation_status = 'active'
         AND archived_at IS NULL
         AND (expires_at IS NULL OR expires_at > NOW())
       ORDER BY genre ASC`
    );
    const genres = result.rows.map((r) => r.genre).filter(Boolean);
    // Curated Video-Only categories from Dancia-4Tv video library & broadcast standards
    const defaultVideoGenres = [
      'Action', 'Comedy', 'Drama', 'Thriller', 'Nollywood',
      'Documentary', 'Science Fiction', 'Adventure', 'Dance',
      'Animation', 'Series & Dramas', 'Cultural'
    ];
    const merged = Array.from(new Set([...genres, ...defaultVideoGenres]));
    res.json(merged);
  } catch (error) {
    logger.error('Error fetching Dancia-4Tv genres:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getTrending = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM dancia_videos
       WHERE is_active = true AND moderation_status = 'active' AND archived_at IS NULL
         AND (expires_at IS NULL OR expires_at > NOW())
       ORDER BY views DESC LIMIT 10`
    );
    res.json(result.rows.map(formatVideo));
  } catch (error) {
    logger.error('Error fetching trending videos:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getRecommended = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM dancia_videos
       WHERE is_active = true AND moderation_status = 'active' AND archived_at IS NULL
         AND (expires_at IS NULL OR expires_at > NOW())
       ORDER BY likes DESC LIMIT 10`
    );
    res.json(result.rows.map(formatVideo));
  } catch (error) {
    logger.error('Error fetching recommended videos:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM dancia_videos
       WHERE is_active = true AND moderation_status = 'active' AND archived_at IS NULL
         AND (expires_at IS NULL OR expires_at > NOW())
       ORDER BY created_at DESC LIMIT 6`
    );
    res.json(result.rows.map(formatVideo));
  } catch (error) {
    logger.error('Error fetching history:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getWatchlist = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 0;
    const result = await pool.query(
      `SELECT v.* FROM dancia_videos v
       JOIN dancia_watchlist w ON v.id = w.video_id
       WHERE w.user_id = $1
         AND v.is_active = true
         AND v.moderation_status = 'active'
         AND v.archived_at IS NULL
         AND (v.expires_at IS NULL OR v.expires_at > NOW())
       ORDER BY w.created_at DESC`,
      [userId]
    );
    res.json(result.rows.map(formatVideo));
  } catch (error) {
    logger.error('Error fetching watchlist:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.addToWatchlist = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 0;
    const { videoId } = req.params;
    await pool.query(
      `INSERT INTO dancia_watchlist (user_id, video_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, video_id) DO NOTHING`,
      [userId, videoId]
    );
    res.json({ success: true, message: 'Added to watchlist' });
  } catch (error) {
    logger.error('Error adding to watchlist:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 0;
    const { videoId } = req.params;
    await pool.query(
      'DELETE FROM dancia_watchlist WHERE user_id = $1 AND video_id = $2',
      [userId, videoId]
    );
    res.json({ success: true, message: 'Removed from watchlist' });
  } catch (error) {
    logger.error('Error removing from watchlist:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.subscribe = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 0;
    const { planID } = req.params;
    await pool.query(
      `INSERT INTO dancia_member_subscriptions (user_id, plan_id, status)
       VALUES ($1, $2, 'active')
       ON CONFLICT (user_id) DO UPDATE SET plan_id = $2, status = 'active', updated_at = NOW()`,
      [userId, planID]
    );
    res.json({ success: true, message: `Subscribed to plan ${planID}` });
  } catch (error) {
    logger.error('Error subscribing to plan:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 0;
    const { planID } = req.params;
    await pool.query(
      'UPDATE dancia_member_subscriptions SET status = \'cancelled\', updated_at = NOW() WHERE user_id = $1 AND plan_id = $2',
      [userId, planID]
    );
    res.json({ success: true, message: `Unsubscribed from plan ${planID}` });
  } catch (error) {
    logger.error('Error unsubscribing from plan:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.createVideo = async (req, res) => {
  try {
    const {
      title,
      description = '',
      genre = 'General',
      streamURL,
      stream_url,
      thumbnailURL,
      thumbnail_url,
      duration_seconds,
      length,
      resolution = '1080p',
      iarc_rating = 'PG-13'
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Video title is required' });
    }

    const finalStreamUrl = streamURL || stream_url || '';
    const finalThumbUrl = thumbnailURL || thumbnail_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600';
    const finalDuration = parseInt(duration_seconds || length || 300, 10);
    if (!finalStreamUrl) return res.status(400).json({ success: false, message: 'Video media URL is required' });
    const actorId = req.user?.id || req.user?.userId || req.user?.sub || null;
    const client = await pool.pool.connect();
    let result;
    try {
      await client.query('BEGIN');
      result = await client.query(`
        INSERT INTO dancia_videos
          (id, title, description, genre, stream_url, thumbnail_url, duration_seconds,
           resolution, iarc_rating, views, likes, is_active, moderation_status, created_by, updated_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0, 0, FALSE, 'draft', $10, $10)
        RETURNING *
      `, [
        randomUUID(),
        title,
        description,
        genre,
        finalStreamUrl,
        finalThumbUrl,
        finalDuration,
        resolution,
        iarc_rating,
        actorId == null ? null : String(actorId)
      ]);
      await client.query(`
        INSERT INTO media_management_audit
          (ecosystem, entity_type, entity_id, action, actor_id, previous_state, new_state)
        VALUES ('dancia', 'videos', $1, 'CREATE', $2, NULL, $3::jsonb)
      `, [result.rows[0].id, actorId == null ? null : String(actorId), JSON.stringify(result.rows[0])]);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    const formatted = formatVideo(result.rows[0]);
    res.status(201).json({
      success: true,
      message: 'Video created as a draft; publish it from Master Dashboard after review',
      data: formatted
    });
  } catch (error) {
    logger.error('Error creating Dancia video:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

exports.deleteVideo = async (req, res) => {
  const client = await pool.pool.connect();
  try {
    const { videoId } = req.params;
    const actorId = req.user?.id || req.user?.userId || req.user?.sub || null;
    await client.query('BEGIN');
    const current = await client.query(
      'SELECT * FROM dancia_videos WHERE id = $1 FOR UPDATE',
      [videoId]
    );
    if (!current.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    if (current.rows[0].archived_at) {
      await client.query('ROLLBACK');
      return res.status(409).json({ success: false, message: 'Video is already archived' });
    }
    const archived = await client.query(`
      UPDATE dancia_videos
      SET status_before_hold = moderation_status,
          moderation_status = 'archived',
          archived_at = NOW(),
          archived_by = $2,
          updated_by = $2,
          updated_at = NOW(),
          is_active = FALSE
      WHERE id = $1
      RETURNING *
    `, [videoId, actorId == null ? null : String(actorId)]);
    await client.query(`
      INSERT INTO media_management_audit
        (ecosystem, entity_type, entity_id, action, actor_id, previous_state, new_state)
      VALUES ('dancia', 'videos', $1, 'ARCHIVE', $2, $3::jsonb, $4::jsonb)
    `, [
      videoId,
      actorId == null ? null : String(actorId),
      JSON.stringify(current.rows[0]),
      JSON.stringify(archived.rows[0])
    ]);
    await client.query('COMMIT');
    return res.json({ success: true, message: 'Video archived; its catalog record and audit history are retained' });
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Error deleting Dancia video:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
};
