const { socialDb } = require('../db');

/**
 * Challenge-related service functions
 */
const permanenceService = {
  // Get all challenges with filters
  async getChallenges(filters = {}) {
    const {
      status,
      category,
      challenge_type,
      creator_id,
      search,
      limit = 20,
      offset = 0
    } = filters;

    let query = `SELECT c.*, 
                 cc.name as category_name,
                 u.username as creator_name,
                 COUNT(cp.id) as participant_count,
                 COALESCE(SUM(CASE WHEN ce.engagement_type = 'like' THEN 1 ELSE 0 END), 0) as likes,
                 COALESCE(SUM(CASE WHEN ce.engagement_type = 'share' THEN 1 ELSE 0 END), 0) as shares,
                 COALESCE(SUM(CASE WHEN ce.engagement_type = 'view' THEN 1 ELSE 0 END), 0) as views
                 FROM challenges c
                 LEFT JOIN challenge_categories cc ON c.category_id = cc.id
                 LEFT JOIN users u ON c.creator_id = u.id::text
                 LEFT JOIN challenge_participants cp ON c.id = cp.challenge_id
                 LEFT JOIN challenge_engagement ce ON c.id = ce.challenge_id`;

    query += ' WHERE c.moderation_status = \'active\'';
    const params = [];
    let paramIndex = 0;
    let conditionsAdded = true;

    // Build WHERE clause dynamically
    if (status) {
      paramIndex++;
      query += ` AND c.status = $${paramIndex}`;
      params.push(status);
      conditionsAdded = true;
    }

    if (category) {
      paramIndex++;
      query += conditionsAdded
        ? ` AND c.category_id = $${paramIndex}`
        : ` WHERE c.category_id = $${paramIndex}`;
      params.push(category);
      conditionsAdded = true;
    }

    if (challenge_type) {
      paramIndex++;
      query += conditionsAdded
        ? ` AND c.challenge_type = $${paramIndex}`
        : ` WHERE c.challenge_type = $${paramIndex}`;
      params.push(challenge_type);
      conditionsAdded = true;
    }

    if (creator_id) {
      paramIndex++;
      query += conditionsAdded
        ? ` AND c.creator_id = $${paramIndex}`
        : ` WHERE c.creator_id = $${paramIndex}`;
      params.push(creator_id);
      conditionsAdded = true;
    }

    if (search) {
      paramIndex++;
      query += conditionsAdded
        ? ` AND (c.title ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`
        : ` WHERE (c.title ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
    }

    query += ` GROUP BY c.id, cc.name, u.username ORDER BY c.created_at DESC LIMIT $${paramIndex + 1} OFFSET $${paramIndex + 2}`;
    params.push(limit, offset);

    const { rows } = await socialDb.query(query, params);
    return rows;
  },

  // Get a specific challenge by ID
  async getChallengeById(id) {
    const { rows } = await socialDb.query(
      `SELECT c.*, 
       cc.name as category_name,
       u.username as creator_name,
       COUNT(cp.id) as participant_count,
       COALESCE(SUM(CASE WHEN ce.engagement_type = 'like' THEN 1 ELSE 0 END), 0) as likes,
       COALESCE(SUM(CASE WHEN ce.engagement_type = 'share' THEN 1 ELSE 0 END), 0) as shares,
       COALESCE(SUM(CASE WHEN ce.engagement_type = 'view' THEN 1 ELSE 0 END), 0) as views
       FROM challenges c
       LEFT JOIN challenge_categories cc ON c.category_id = cc.id
       LEFT JOIN users u ON c.creator_id = u.id::text
       LEFT JOIN challenge_participants cp ON c.id = cp.challenge_id
       LEFT JOIN challenge_engagement ce ON c.id = ce.challenge_id
       WHERE c.id = $1
       GROUP BY c.id, cc.name, u.username`,
      [id],
    );

    return rows[0] || null;
  },

  // Create a new challenge
  async createChallenge(challengeData, creatorId) {
    const {
      title,
      description,
      category_id,
      challenge_type,
      mechanics,
      max_participants,
      duration_minutes,
      is_timed,
      difficulty_level,
      prize_pool,
      rules,
      requirements,
      tags,
      visibility,
      start_time,
      end_time
    } = challengeData;

    // Basic validation
    if (!title || !description) {
      throw new Error('Title and description are required');
    }

    // Validate times if provided
    if (start_time && end_time && new Date(start_time) >= new Date(end_time)) {
      throw new Error('End time must be after start time');
    }

    const { rows } = await socialDb.query(
      `INSERT INTO challenges 
       (title, description, creator_id, category_id, mechanics, challenge_type, 
        max_participants, duration_minutes, is_timed, difficulty_level, prize_pool, 
        rules, requirements, tags, visibility, start_time, end_time, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 'published') 
       RETURNING *`,
      [
        title,
        description,
        creatorId,
        category_id,
        JSON.stringify(mechanics || []),
        challenge_type || 'general',
        max_participants || null,
        duration_minutes || 0,
        is_timed || false,
        difficulty_level || 1,
        prize_pool || null,
        rules || null,
        requirements || null,
        tags || [],
        visibility || 'public',
        start_time || null,
        end_time || null
      ],
    );

    return rows[0];
  }
  ,
  // Update a challenge
  async updateChallenge(id, challengeData, creatorId) {
    // Check if challenge exists and belongs to member
    const challengeResult = await socialDb.query(
      'SELECT * FROM challenges WHERE id = $1 AND creator_id = $2',
      [id, creatorId],
    );

    if (challengeResult.rows.length === 0) {
      throw new Error('Challenge not found or unauthorized');
    }

    const challenge = challengeResult.rows[0];

    // Only allow updates if challenge is still in draft or published state
    if (!['draft', 'published'].includes(challenge.status)) {
      throw new Error(
        'Cannot update challenge that is already active or completed',
      );
    }

    const {
      title,
      description,
      category_id,
      challenge_type,
      mechanics,
      max_participants,
      duration_minutes,
      is_timed,
      difficulty_level,
      prize_pool,
      rules,
      requirements,
      tags,
      visibility,
      status,
      start_time,
      end_time
    } = challengeData;

    const { rows } = await socialDb.query(
      `UPDATE challenges 
       SET title = $1, description = $2, category_id = $3, mechanics = $4, 
           challenge_type = $5, max_participants = $6, duration_minutes = $7, 
           is_timed = $8, difficulty_level = $9, prize_pool = $10, rules = $11, 
           requirements = $12, tags = $13, visibility = $14, status = $15, 
           start_time = $16, end_time = $17, updated_at = NOW()
       WHERE id = $18 RETURNING *`,
      [
        title,
        description,
        category_id,
        JSON.stringify(mechanics || challenge.mechanics),
        challenge_type || challenge.challenge_type,
        max_participants || challenge.max_participants,
        duration_minutes || challenge.duration_minutes,
        is_timed || challenge.is_timed,
        difficulty_level || challenge.difficulty_level,
        prize_pool || challenge.prize_pool,
        rules || challenge.rules,
        requirements || challenge.requirements,
        tags || challenge.tags,
        visibility || challenge.visibility,
        status || challenge.status,
        start_time || challenge.start_time,
        end_time || challenge.end_time,
        id
      ],
    );

    return rows[0];
  }
  ,
  // Delete a challenge
  async deleteChallenge(id, creatorId) {
    // Check if challenge exists and belongs to member
    const challengeResult = await socialDb.query(
      'SELECT * FROM challenges WHERE id = $1 AND creator_id = $2',
      [id, creatorId],
    );

    if (challengeResult.rows.length === 0) {
      throw new Error('Challenge not found or unauthorized');
    }

    const challenge = challengeResult.rows[0];

    // Only allow deletion if challenge is still in draft or published state
    if (!['draft', 'published'].includes(challenge.status)) {
      throw new Error('Cannot delete challenge that is already active');
    }

    await socialDb.query('DELETE FROM challenges WHERE id = $1', [id]);
    return { msg: 'Challenge removed' };
  }
  ,
  // Stake on a challenge
  async stakeOnChallenge(challengeId, memberId, giftAmount) {
    // Validate stake amount
    if (!giftAmount || giftAmount <= 0) {
      throw new Error('Valid gift amount is required');
    }

    // Check if challenge exists and is viral
    const challengeResult = await socialDb.query(
      'SELECT * FROM challenges WHERE id = $1 AND challenge_type = $2',
      [challengeId, 'viral'],
    );

    if (challengeResult.rows.length === 0) {
      throw new Error('Viral challenge not found');
    }

    const challenge = challengeResult.rows[0];

    // Check if challenge is still active for staking
    if (challenge.status !== 'published') {
      throw new Error('Challenge is not available for staking');
    }

    // Create the stake
    const { rows } = await socialDb.query(
      `INSERT INTO challenge_stakes 
       (challenge_id, member_id, gift_amount)
       VALUES ($1, $2, $3) RETURNING *`,
      [challengeId, memberId, giftAmount],
    );

    return rows[0];
  }
  ,
  // Get all streaming sessions with filters
  async getStreamingSessions(filters = {}) {
    const {
      category,
      stream_type,
      is_live,
      creator_id,
      limit = 20,
      offset = 0
    } = filters;

    let query = `SELECT ss.*, 
                 COALESCE(u.username, 'Creator') as creator_name
                 FROM streaming_sessions ss
                 LEFT JOIN users u ON ss.creator_id = u.id::text`;

    query += ' WHERE ss.moderation_status = \'active\'';
    const params = [];
    let paramIndex = 0;
    let conditionsAdded = true;

    // Build WHERE clause dynamically
    if (typeof is_live !== 'undefined') {
      paramIndex++;
      query += ` WHERE ss.is_live = $${paramIndex}`;
      params.push(is_live === 'true');
      conditionsAdded = true;
    }

    if (category) {
      paramIndex++;
      query += conditionsAdded
        ? ` AND ss.stream_category = $${paramIndex}`
        : ` WHERE ss.stream_category = $${paramIndex}`;
      params.push(category);
      conditionsAdded = true;
    }

    if (stream_type) {
      paramIndex++;
      query += conditionsAdded
        ? ` AND ss.stream_type = $${paramIndex}`
        : ` WHERE ss.stream_type = $${paramIndex}`;
      params.push(stream_type);
      conditionsAdded = true;
    }

    if (creator_id) {
      paramIndex++;
      query += conditionsAdded
        ? ` AND ss.creator_id = $${paramIndex}`
        : ` WHERE ss.creator_id = $${paramIndex}`;
      params.push(creator_id);
    }

    query += ` ORDER BY ss.created_at DESC LIMIT $${paramIndex + 1} OFFSET $${paramIndex + 2}`;
    params.push(limit, offset);

    const { rows } = await socialDb.query(query, params);
    return rows;
  }
  ,
  // Create a new streaming session
  async createStreamingSession(streamData, creatorId) {
    const {
      title,
      description,
      stream_category,
      stream_type,
      thumbnail_url,
      tags,
      privacy_level
    } = streamData;

    // Basic validation
    if (!title) {
      throw new Error('Title is required');
    }

    // Generate a unique stream key
    const streamKey = `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const { rows } = await socialDb.query(
      `INSERT INTO streaming_sessions 
       (title, creator_id, stream_category, stream_type, stream_key, 
        description, thumbnail_url, tags, privacy_level, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'created') 
       RETURNING *`,
      [
        title,
        creatorId,
        stream_category,
        stream_type || 'general',
        streamKey,
        description || null,
        thumbnail_url || null,
        tags || [],
        privacy_level || 'public'
      ],
    );

    return {
      ...rows[0],
      msg: 'Streaming session created. Use the stream_key to start your stream.'
    };
  }
  ,
  // Start a streaming session
  async startStreamingSession(id, creatorId) {
    // Check if stream exists and belongs to member
    const streamResult = await socialDb.query(
      'SELECT * FROM streaming_sessions WHERE id = $1 AND creator_id = $2',
      [id, creatorId],
    );

    if (streamResult.rows.length === 0) {
      throw new Error('Stream not found or unauthorized');
    }

    const stream = streamResult.rows[0];

    // Only allow starting if stream is in created state
    if (stream.status !== 'created') {
      throw new Error('Stream cannot be started in current state');
    }

    const { rows } = await socialDb.query(
      `UPDATE streaming_sessions 
       SET is_active = true, is_live = true, started_at = NOW(), 
           actual_start_time = NOW(), status = 'live'
       WHERE id = $1 RETURNING *`,
      [id],
    );

    return rows[0];
  }
  ,
  // Stop a streaming session
  async stopStreamingSession(id, creatorId) {
    // Check if stream exists and belongs to member
    const streamResult = await socialDb.query(
      'SELECT * FROM streaming_sessions WHERE id = $1 AND creator_id = $2',
      [id, creatorId],
    );

    if (streamResult.rows.length === 0) {
      throw new Error('Stream not found or unauthorized');
    }

    const stream = streamResult.rows[0];

    // Only allow stopping if stream is live
    if (!stream.is_live) {
      throw new Error('Stream is not currently live');
    }

    const { rows } = await socialDb.query(
      `UPDATE streaming_sessions 
       SET is_active = false, is_live = false, ended_at = NOW(), 
           status = 'ended', updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id],
    );

    return rows[0];
  },

  async getStreams(filters = {}) {
    return this.getStreamingSessions(filters);
  },

  async getStreamById(id) {
    const { rows } = await socialDb.query(
      `SELECT ss.*, COALESCE(u.username, 'Creator') as creator_name
       FROM streaming_sessions ss
       LEFT JOIN users u ON ss.creator_id = u.id::text
       WHERE ss.id = $1`,
      [id]
    );
    return rows[0] || null;
  }
};

module.exports = permanenceService;
