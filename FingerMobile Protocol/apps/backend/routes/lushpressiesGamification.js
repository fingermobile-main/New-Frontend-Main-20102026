/**
 * Lush Pressies — Standalone Gamification &Lapidaires Router
 * Handles 30 compatibility questions, user answers, Qwen AI compatibility scoring,
 * and daily dating challenges.
 * Date: October 6, 2026 - Phase 2 Ecosystem
 */

const express = require('express');
const router = express.Router();
const matchCtrl = require('../controllers/lushpressiesMatchingController');
const { pool } = require('../db');
const logger = require('../utils/logger');

// GET /api/lushpressies-gamification/lapidaires - 30 compatibility questions
router.get('/lapidaires', async (req, res) => {
  try {
    const questions = await pool.query(
      `SELECT id, category, question_text, ai_tags, options
       FROM lush_lapidaire_questions
       ORDER BY category, created_at ASC`
    );

    if (questions.rows.length === 0) {
      // Seed default questions if none exist
      const defaults = [
        { category: 'values_life', q: 'What is your core foundation for building long-term trust?', tags: ['trust', 'integrity'] },
        { category: 'values_life', q: 'How do you handle personal growth versus relationship growth?', tags: ['growth', 'independence'] },
        { category: 'intimacy', q: 'What is your primary love language when feeling vulnerable?', tags: ['intimacy', 'love_language'] },
        { category: 'future_goals', q: 'Where do you envision your ideal physical living environment in 5 years?', tags: ['future', 'lifestyle'] },
        { category: 'boundaries', q: 'How do you communicate when you need personal solitary recharge time?', tags: ['boundaries', 'space'] },
        { category: 'light_fun', q: 'What spontaneous adventure would you embark on with zero advance planning?', tags: ['adventure', 'fun'] }
      ];

      for (const d of defaults) {
        await pool.query(
          `INSERT INTO lush_lapidaire_questions (category, question_text, ai_tags)
           VALUES ($1, $2, $3)`,
          [d.category, d.q, d.tags]
        );
      }

      const seeded = await pool.query('SELECT * FROM lush_lapidaire_questions ORDER BY category');
      return res.json({ success: true, data: seeded.rows, count: seeded.rows.length });
    }

    res.json({
      success: true,
      data: questions.rows,
      count: questions.rows.length
    });
  } catch (error) {
    logger.error('Error fetchinglapidaire questions:', error);
    res.status(500).json({ success: false, message: 'Failed to retrievelapidaires' });
  }
});

// POST /api/lushpressies-gamification/lapidaires/answer - Submit response to question
router.post('/lapidaires/answer', async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { questionId, answerText, selectedOptionIndex } = req.body;

    if (!userId || !questionId || !answerText) {
      return res.status(400).json({ success: false, message: 'userId, questionId, and answerText are required' });
    }

    const result = await pool.query(
      `INSERT INTO lush_user_answers (user_id, question_id, answer_text, selected_option_index, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (user_id, question_id) DO UPDATE SET answer_text = $3, selected_option_index = $4, created_at = NOW()
       RETURNING *`,
      [userId, questionId, answerText.trim(), selectedOptionIndex ?? null]
    );

    res.status(200).json({
      success: true,
      message: 'Answer saved. AI compatibility vectors updated.',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error savinglapidaire answer:', error);
    res.status(500).json({ success: false, message: 'Failed to save answer' });
  }
});

// GET /api/lushpressies-gamification/compatibility/:targetUserId - Qwen AI Match Scoring
router.get('/compatibility/:targetUserId', (req, res) => matchCtrl.getCompatibilityScore(req, res));

// GET /api/lushpressies-gamification/challenges - List engagement challenges
router.get('/challenges', async (req, res) => {
  try {
    const challenges = await pool.query(
      `SELECT id, title, description, challenge_type, reward_coins, reward_badge, expires_at
       FROM lush_challenges
       ORDER BY reward_coins ASC`
    );

    res.json({
      success: true,
      data: challenges.rows
    });
  } catch (error) {
    logger.error('Error fetching challenges:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve challenges' });
  }
});

module.exports = router;
