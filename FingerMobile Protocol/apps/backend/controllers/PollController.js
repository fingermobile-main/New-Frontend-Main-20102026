/**
 * PollController.js
 * Interactive Polling & Community Voting Engine
 * Date: September 29, 2026
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class PollController {
  /**
   * POST /api/polls
   * Create a new poll with options
   */
  async createPoll(req, res) {
    try {
      const userId = req.user?.id || req.body.user_id || 4;
      const {
        question,
        options = [],
        expires_at,
        is_active = true
      } = req.body;

      if (!question || !Array.isArray(options) || options.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Question and at least 2 voting options are required'
        });
      }

      const formattedOptions = options.map((opt) => ({
        text: typeof opt === 'string' ? opt : (opt.text || opt.option_text || String(opt)),
        votes: 0
      }));

      const expiry = expires_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const result = await pool.query(
        `INSERT INTO polls (question, options, total_votes, is_active, expires_at, created_by)
         VALUES ($1, $2, 0, $3, $4, $5)
         RETURNING *`,
        [question, JSON.stringify(formattedOptions), is_active, expiry, userId]
      );

      return res.status(201).json({
        success: true,
        message: 'Poll created successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in createPoll:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create poll',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/polls
   * List polls with pagination
   */
  async getPolls(req, res) {
    try {
      const { limit = 20, offset = 0, is_active } = req.query;
      let query = `
        SELECT p.*, u.username as creator_username, u.avatar_url as creator_avatar
        FROM polls p
        LEFT JOIN users u ON p.created_by = u.id
      `;
      const params = [];

      if (is_active !== undefined) {
        params.push(is_active === 'true');
        query += ` WHERE p.is_active = $${params.length}`;
      }

      query += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(parseInt(limit, 10), parseInt(offset, 10));

      const result = await pool.query(query, params);

      return res.json({
        success: true,
        data: result.rows,
        pagination: {
          limit: parseInt(limit, 10),
          offset: parseInt(offset, 10),
          total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in getPolls:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch polls',
        error: error.message
      });
    }
  }

  /**
   * GET /api/polls/:id
   * Get poll details by ID
   */
  async getPollById(req, res) {
    try {
      const { id } = req.params;
      const result = await pool.query(
        `SELECT p.*, u.username as creator_username, u.avatar_url as creator_avatar
         FROM polls p
         LEFT JOIN users u ON p.created_by = u.id
         WHERE p.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Poll not found' });
      }

      return res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in getPollById:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch poll'
      });
    }
  }

  /**
   * POST /api/polls/:id/vote
   * Submit vote for a poll option
   */
  async votePoll(req, res) {
    const client = await pool.connect();
    try {
      const userId = req.user?.id || req.body.user_id || 4;
      const { id: pollId } = req.params;
      const optionIndex = req.body.optionIndex !== undefined
        ? parseInt(req.body.optionIndex, 10)
        : (req.body.optionId !== undefined ? parseInt(req.body.optionId, 10) : 0);

      await client.query('BEGIN');

      const pollRes = await client.query('SELECT * FROM polls WHERE id = $1 FOR UPDATE', [pollId]);
      if (pollRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ success: false, message: 'Poll not found' });
      }

      const poll = pollRes.rows[0];
      const options = typeof poll.options === 'string' ? JSON.parse(poll.options) : poll.options;

      if (!options[optionIndex]) {
        await client.query('ROLLBACK');
        return res.status(400).json({ success: false, message: 'Invalid option index' });
      }

      // Check if user already voted
      const existingVote = await client.query(
        'SELECT * FROM poll_votes WHERE poll_id = $1 AND user_id = $2',
        [pollId, userId]
      );

      if (existingVote.rows.length > 0) {
        // Update vote or ignore
        const oldIndex = existingVote.rows[0].option_index;
        if (oldIndex !== optionIndex && options[oldIndex]) {
          options[oldIndex].votes = Math.max(0, (options[oldIndex].votes || 0) - 1);
          options[optionIndex].votes = (options[optionIndex].votes || 0) + 1;
          await client.query(
            'UPDATE poll_votes SET option_index = $1, voted_at = CURRENT_TIMESTAMP WHERE id = $2',
            [optionIndex, existingVote.rows[0].id]
          );
        }
      } else {
        // Record new vote
        options[optionIndex].votes = (options[optionIndex].votes || 0) + 1;
        await client.query(
          'INSERT INTO poll_votes (poll_id, user_id, option_index) VALUES ($1, $2, $3)',
          [pollId, userId, optionIndex]
        );
      }

      const totalVotes = options.reduce((sum, opt) => sum + (opt.votes || 0), 0);

      const updateRes = await client.query(
        'UPDATE polls SET options = $1, total_votes = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
        [JSON.stringify(options), totalVotes, pollId]
      );

      await client.query('COMMIT');

      return res.json({
        success: true,
        message: 'Vote recorded successfully',
        data: updateRes.rows[0]
      });
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error in votePoll:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to record vote',
        error: error.message
      });
    } finally {
      client.release();
    }
  }

  /**
   * PUT /api/polls/:id
   * Update poll status or question
   */
  async updatePoll(req, res) {
    try {
      const { id } = req.params;
      const { question, is_active } = req.body;

      const result = await pool.query(
        `UPDATE polls 
         SET question = COALESCE($1, question),
             is_active = COALESCE($2, is_active),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [question, is_active, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Poll not found' });
      }

      return res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * DELETE /api/polls/:id
   * Delete poll
   */
  async deletePoll(req, res) {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM polls WHERE id = $1', [id]);
      return res.json({ success: true, message: 'Poll deleted successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * GET /api/polls/:id/analytics
   */
  async getPollAnalytics(req, res) {
    try {
      const { id } = req.params;
      const pollRes = await pool.query('SELECT * FROM polls WHERE id = $1', [id]);
      if (pollRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Poll not found' });
      }

      const poll = pollRes.rows[0];
      const options = typeof poll.options === 'string' ? JSON.parse(poll.options) : poll.options;

      return res.json({
        success: true,
        data: {
          poll_id: poll.id,
          question: poll.question,
          total_votes: poll.total_votes,
          breakdown: options.map((opt, idx) => ({
            index: idx,
            text: opt.text,
            votes: opt.votes || 0,
            percentage: poll.total_votes > 0 ? (((opt.votes || 0) / poll.total_votes) * 100).toFixed(1) : '0.0'
          }))
        }
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new PollController();
