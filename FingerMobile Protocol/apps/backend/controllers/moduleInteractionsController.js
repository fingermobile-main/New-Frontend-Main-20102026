/*
 * FingerMobile Protocol™ - Sovereign Module Interactions & Activity Logs Controller
 * Powers Forum, Groups, Blogs, Hallmarks, Gems, Mii, and Publicitee
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

// 1. Get Summary Metrics (Comments, Mentions, Connect/Follows, All Comments, Responded, Haven't Responded)
exports.getModuleSummary = async (req, res) => {
  try {
    const { module = 'all' } = req.query;
    const params = [];
    let moduleFilter = '';

    if (module !== 'all') {
      params.push(module.toLowerCase());
      moduleFilter = `WHERE module = $1`;
    }

    const query = `
      SELECT
        COUNT(*) FILTER (WHERE interaction_type = 'comment') AS comments_count,
        COUNT(*) FILTER (WHERE interaction_type = 'mention') AS mentions_count,
        COUNT(*) FILTER (WHERE interaction_type = 'connect_follow') AS connect_and_follows_count,
        COUNT(*) FILTER (WHERE interaction_type IN ('comment', 'mention')) AS all_comments_count,
        COUNT(*) FILTER (WHERE responded = TRUE) AS responded_count,
        COUNT(*) FILTER (WHERE responded = FALSE) AS havent_responded_count,
        COUNT(*) AS total_interactions
      FROM sovereign_module_interactions
      ${moduleFilter};
    `;

    const result = await pool.query(query, params);
    const row = result.rows[0] || {};

    return res.status(200).json({
      success: true,
      data: {
        module,
        comments_count: parseInt(row.comments_count || 0, 10),
        mentions_count: parseInt(row.mentions_count || 0, 10),
        connect_and_follows_count: parseInt(row.connect_and_follows_count || 0, 10),
        all_comments_count: parseInt(row.all_comments_count || 0, 10),
        responded_count: parseInt(row.responded_count || 0, 10),
        havent_responded_count: parseInt(row.havent_responded_count || 0, 10),
        total_interactions: parseInt(row.total_interactions || 0, 10)
      }
    });
  } catch (error) {
    logger.error('Error fetching module summary:', error);
    return res.status(500).json({ success: false, error: 'Failed to retrieve module summary' });
  }
};

// 2. Get Filtered Interactions List
exports.getModuleInteractions = async (req, res) => {
  try {
    const {
      module = 'all',
      type = 'all',
      response_status = 'all',
      search = '',
      limit = 50,
      offset = 0
    } = req.query;

    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (module !== 'all') {
      conditions.push(`module = $${paramIndex++}`);
      params.push(module.toLowerCase());
    }

    if (type === 'comment') {
      conditions.push(`interaction_type = 'comment'`);
    } else if (type === 'mention') {
      conditions.push(`interaction_type = 'mention'`);
    } else if (type === 'connect_follow') {
      conditions.push(`interaction_type = 'connect_follow'`);
    } else if (type === 'all_comments') {
      conditions.push(`interaction_type IN ('comment', 'mention')`);
    }

    if (response_status === 'responded') {
      conditions.push(`responded = TRUE`);
    } else if (response_status === 'havent_responded') {
      conditions.push(`responded = FALSE`);
    }

    if (search && search.trim()) {
      conditions.push(`(actor_name ILIKE $${paramIndex} OR actor_handle ILIKE $${paramIndex} OR content ILIKE $${paramIndex} OR item_title ILIKE $${paramIndex})`);
      params.push(`%${search.trim()}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `
      SELECT *
      FROM sovereign_module_interactions
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++};
    `;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const countQuery = `
      SELECT COUNT(*) as total
      FROM sovereign_module_interactions
      ${whereClause};
    `;
    const countParams = params.slice(0, paramIndex - 3);

    const [itemsResult, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, countParams)
    ]);

    return res.status(200).json({
      success: true,
      data: itemsResult.rows,
      total: parseInt(countResult.rows[0]?.total || 0, 10),
      count: itemsResult.rows.length
    });
  } catch (error) {
    logger.error('Error fetching module interactions:', error);
    return res.status(500).json({ success: false, error: 'Failed to retrieve module interactions' });
  }
};

// 3. Respond to an Interaction
exports.respondToInteraction = async (req, res) => {
  try {
    const { id } = req.params;
    const { response_content } = req.body;

    if (!response_content || !response_content.trim()) {
      return res.status(400).json({ success: false, error: 'Response content is required' });
    }

    const updateQuery = `
      UPDATE sovereign_module_interactions
      SET
        responded = TRUE,
        responded_at = CURRENT_TIMESTAMP,
        response_content = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const result = await pool.query(updateQuery, [response_content.trim(), id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Interaction not found' });
    }

    const updatedItem = result.rows[0];

    // Log the response to activity logs
    await pool.query(`
      INSERT INTO sovereign_module_activity_logs (
        module, actor_name, actor_handle, actor_avatar, activity_type, title, description, target_id, target_type, criteria
      ) VALUES (
        $1, 'Israel Obinna Mbah', '@ObinnaMbah', '/assets/branding/mbah_israel_obinna.jpeg',
        'creator_responded', $2, $3, $4, 'interaction', 'verified_sovereign'
      );
    `, [
      updatedItem.module,
      `Responded to ${updatedItem.actor_name}`,
      response_content.trim(),
      updatedItem.id
    ]);

    return res.status(200).json({
      success: true,
      message: 'Response recorded and marked responded!',
      data: updatedItem
    });
  } catch (error) {
    logger.error('Error responding to interaction:', error);
    return res.status(500).json({ success: false, error: 'Failed to record response' });
  }
};

// 4. Get Activity Logs (All Time, All Activities, All Criteria)
exports.getModuleActivityLogs = async (req, res) => {
  try {
    const {
      module = 'all',
      time_range = 'all_time',
      activity_type = 'all',
      criteria = 'all',
      search = '',
      limit = 50,
      offset = 0
    } = req.query;

    const conditions = [];
    const params = [];
    let paramIndex = 1;

    // Module Filter
    if (module !== 'all') {
      conditions.push(`module = $${paramIndex++}`);
      params.push(module.toLowerCase());
    }

    // Time Range Filter (All Time, 24h, 7d, 30d, 90d)
    if (time_range === '24h') {
      conditions.push(`created_at >= NOW() - INTERVAL '24 hours'`);
    } else if (time_range === '7d') {
      conditions.push(`created_at >= NOW() - INTERVAL '7 days'`);
    } else if (time_range === '30d') {
      conditions.push(`created_at >= NOW() - INTERVAL '30 days'`);
    } else if (time_range === '90d') {
      conditions.push(`created_at >= NOW() - INTERVAL '90 days'`);
    }

    // Activity Type Filter (All Activities, Comments, Mentions, Connect/Follows, Responds, etc.)
    if (activity_type === 'comments') {
      conditions.push(`activity_type IN ('comment_posted', 'comment')`);
    } else if (activity_type === 'mentions') {
      conditions.push(`activity_type IN ('peer_mentioned', 'mention')`);
    } else if (activity_type === 'connect_and_follows') {
      conditions.push(`activity_type IN ('peer_connected', 'peer_followed', 'connect_follow')`);
    } else if (activity_type === 'responds') {
      conditions.push(`activity_type = 'creator_responded'`);
    } else if (activity_type === 'security') {
      conditions.push(`activity_type IN ('pin_exchanged', 'gem_staked')`);
    }

    // Criteria Filter (All Criteria, Verified Sovereign, Urgent, Patron VIP)
    if (criteria !== 'all') {
      conditions.push(`criteria = $${paramIndex++}`);
      params.push(criteria);
    }

    // Text Search Filter
    if (search && search.trim()) {
      conditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR actor_name ILIKE $${paramIndex} OR actor_handle ILIKE $${paramIndex})`);
      params.push(`%${search.trim()}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `
      SELECT *
      FROM sovereign_module_activity_logs
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++};
    `;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const countQuery = `
      SELECT COUNT(*) as total
      FROM sovereign_module_activity_logs
      ${whereClause};
    `;
    const countParams = params.slice(0, paramIndex - 3);

    const [logsResult, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, countParams)
    ]);

    return res.status(200).json({
      success: true,
      data: logsResult.rows,
      total: parseInt(countResult.rows[0]?.total || 0, 10),
      count: logsResult.rows.length
    });
  } catch (error) {
    logger.error('Error fetching module activity logs:', error);
    return res.status(500).json({ success: false, error: 'Failed to retrieve activity logs' });
  }
};

