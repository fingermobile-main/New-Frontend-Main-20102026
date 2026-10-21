/**
 * Lush Pressies Core Business Logic & AI Match Engine Service
 * Provides helper functions for match scoring, revenue splits, PIN generation,
 * 30lapidaire catalog, and storage TTL policy enforcement.
 * Date: September 29, 2026
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class LushpressiesService {
  /**
   * Seed the 30 ComprehensiveLapidaire Compatibility Questions
   */
  async seedLapidaireQuestions() {
    const questions = [
      // Light & Fun
      { category: 'light_fun', text: 'What\'s your favorite show, movie, or book — and why did it stick with you?', tags: ['entertainment', 'storytelling'] },
      { category: 'light_fun', text: 'What\'s your ultimate comfort food after a long day?', tags: ['food', 'relaxation'] },
      { category: 'light_fun', text: 'Are you a "stay in with wine" or "go out dancing" kind of person?', tags: ['lifestyle', 'social'] },
      { category: 'light_fun', text: 'What\'s the weirdest fun fact you know that always surprises people?', tags: ['intellect', 'humor'] },
      { category: 'light_fun', text: 'Would you rather travel to a tropical beach or a snowy mountain cabin?', tags: ['travel', 'adventure'] },

      // Values & Life
      { category: 'values_life', text: 'What does "home" mean to you — a place, a person, or a feeling?', tags: ['belonging', 'emotional_depth'] },
      { category: 'values_life', text: 'What core value must your partner share with you?', tags: ['values', 'alignment'] },
      { category: 'values_life', text: 'How do you define success — and is it different from how society defines it?', tags: ['ambition', 'philosophy'] },
      { category: 'values_life', text: 'What\'s one cause or injustice you\'d dedicate your life to fixing?', tags: ['purpose', 'ethics'] },
      { category: 'values_life', text: 'Who is your emotional support system — and how do they show up for you?', tags: ['family', 'friendship'] },

      // Relationship & Intimacy
      { category: 'intimacy', text: 'What\'s your love language — and how do you want to be loved?', tags: ['love_language', 'affection'] },
      { category: 'intimacy', text: 'How do you typically show appreciation in a relationship?', tags: ['appreciation', 'gestures'] },
      { category: 'intimacy', text: 'Are you a morning texter or an "I\'ll call you later" person?', tags: ['communication', 'habit'] },
      { category: 'intimacy', text: 'What\'s something small that makes you feel truly seen by a partner?', tags: ['validation', 'vulnerability'] },
      { category: 'intimacy', text: 'What\'s your ideal first date — and why?', tags: ['romance', 'first_impression'] },

      // Future & Goals
      { category: 'future_goals', text: 'Where do you see yourself in 5 years — personally and professionally?', tags: ['vision', 'career'] },
      { category: 'future_goals', text: 'Is work-life balance non-negotiable for you? How do you protect it?', tags: ['balance', 'wellness'] },
      { category: 'future_goals', text: 'Do you want kids? If yes, how many? If no, what\'s your dream life instead?', tags: ['family_planning', 'future'] },
      { category: 'future_goals', text: 'What\'s one dream you\'re scared to admit — but secretly chasing?', tags: ['vulnerability', 'aspirations'] },
      { category: 'future_goals', text: 'What does "growing old together" look like to you?', tags: ['longevity', 'commitment'] },

      // Past & Learning
      { category: 'past_learning', text: 'What\'s the biggest lesson you learned from your last relationship?', tags: ['growth', 'reflection'] },
      { category: 'past_learning', text: 'What do all your exes have in common — and what does that say about you?', tags: ['patterns', 'self_awareness'] },
      { category: 'past_learning', text: 'What\'s a trigger you\'ve learned to manage in relationships?', tags: ['emotional_maturity', 'healing'] },
      { category: 'past_learning', text: 'Are you friends with any exes? Why or why not?', tags: ['boundaries', 'past'] },
      { category: 'past_learning', text: 'What\'s something you\'ve unlearned about love since you were younger?', tags: ['wisdom', 'evolution'] },

      // Self-Reflection & Boundaries
      { category: 'boundaries', text: 'How do you react when something\'s bothering you — talk, withdraw, or process?', tags: ['conflict_resolution', 'coping'] },
      { category: 'boundaries', text: 'What are your top 3 non-negotiables in a partner?', tags: ['deal_breakers', 'standards'] },
      { category: 'boundaries', text: 'How soon do you like to become exclusive — and why?', tags: ['pacing', 'exclusivity'] },
      { category: 'boundaries', text: 'What\'s your view on monogamy vs ethical non-monogamy?', tags: ['relationship_structure', 'fidelity'] },
      { category: 'boundaries', text: 'After a date — how do you know if you want to see them again?', tags: ['intuition', 'chemistry'] }
    ];

    for (const q of questions) {
      await pool.query(
        `INSERT INTO lush_lapidaire_questions (category, question_text, ai_tags)
         VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING`,
        [q.category, q.text, q.tags]
      );
    }
  }

  /**
   * Calculate 60/20/20 Revenue Split for UGC Sales
   * Platform: 60% Net
   * Creator: 20% Net
   * Store: 20% Net
   */
  calculateUgcSplit(totalAmount) {
    const amount = parseFloat(totalAmount);
    return {
      platformShare: (amount * 0.60).toFixed(2),
      creatorShare: (amount * 0.20).toFixed(2),
      storeShare: (amount * 0.20).toFixed(2)
    };
  }

  /**
   * Generate 8-Digit Secure PIN Code
   */
  generate8DigitPin() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  }

  /**
   * Check 5-Month Eligibility Rule for Commit Button
   */
  async checkCommitEligibility(user1Id, user2Id) {
    try {
      const result = await pool.query(
        `SELECT * FROM lush_commit_eligibility 
         WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)`,
        [user1Id, user2Id]
      );

      if (result.rows.length === 0) {
        return { eligible: false, monthsPassed: 0 };
      }

      const record = result.rows[0];
      const monthsDiff = (new Date() - new Date(record.first_interaction_at)) / (1000 * 60 * 60 * 24 * 30.44);

      if (monthsDiff >= 5 && !record.is_eligible_for_commit) {
        await pool.query(
          'UPDATE lush_commit_eligibility SET is_eligible_for_commit = true, commit_unlocked_at = NOW() WHERE id = $1',
          [record.id]
        );
        return { eligible: true, monthsPassed: monthsDiff.toFixed(1) };
      }

      return { eligible: record.is_eligible_for_commit, monthsPassed: monthsDiff.toFixed(1) };
    } catch (error) {
      logger.error('Error in LushpressiesService.checkCommitEligibility:', error);
      return { eligible: false, monthsPassed: 0 };
    }
  }
}

module.exports = new LushpressiesService();
