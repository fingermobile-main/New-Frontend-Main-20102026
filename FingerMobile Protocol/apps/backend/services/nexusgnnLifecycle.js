/**
 * NexusGNN Content Lifecycle Automation Engine
 * Manages 3-phase progression:
 * Phase 1: High-Intent Seed Audience ->
 * Phase 2: Lookalike Social Node Expansion ->
 * Phase 3: Evergreen Discovery Engine ->
 * Archived
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class NexusGNNLifecycle {
  constructor() {
    this.intervalId = null;
  }

  /**
   * Evaluate and transition all eligible content across lifecycle phases
   * @returns {Promise<{ evaluated: number, transitioned: number, details: object[] }>}
   */
  async evaluateAllContentLifecycle() {
    logger.info('Evaluating NexusGNN content lifecycle transitions...');
    let transitionedCount = 0;
    const transitionDetails = [];

    try {
      const records = await pool.query(`
        SELECT * FROM nexusgnn_content_lifecycle
        WHERE current_phase != 'archived'
      `);

      for (const item of records.rows) {
        let newPhase = null;
        const currentPhase = item.current_phase;
        const saves = item.total_saves || 0;
        const shares = item.total_shares || 0;
        const sentiment = parseFloat(item.value_sentiment_score) || 0;
        const impressions = item.total_impressions || 0;
        const evergreenScore = parseFloat(item.evergreen_score) || 0;

        const hoursInPhase = item.entered_current_phase_at
          ? (Date.now() - new Date(item.entered_current_phase_at).getTime()) / (1000 * 60 * 60)
          : 0;

        // Transition Rules from NEXUSGNN_IMPLEMENTATION_GUIDE.md
        if (currentPhase === 'seed_audience') {
          // Transition: >=10 saves, >=5 shares, >=0.6 value sentiment
          if (saves >= 10 && shares >= 5 && sentiment >= 0.6) {
            newPhase = 'lookalike_expansion';
          }
        } else if (currentPhase === 'lookalike_expansion') {
          // Transition: >=0.75 value sentiment, 48-hour stability period
          if (sentiment >= 0.75 && hoursInPhase >= 48) {
            newPhase = 'evergreen_discovery';
          }
        } else if (currentPhase === 'evergreen_discovery') {
          // Archive: <0.3 evergreen score after 1000+ impressions
          if (evergreenScore < 0.3 && impressions > 1000) {
            newPhase = 'archived';
          }
        }

        if (newPhase && newPhase !== currentPhase) {
          const phaseHistory = item.phase_history || [];
          phaseHistory.push({
            from: currentPhase,
            to: newPhase,
            timestamp: new Date().toISOString(),
            metricsAtTransition: { saves, shares, sentiment, impressions, hoursInPhase }
          });

          await pool.query(`
            UPDATE nexusgnn_content_lifecycle
            SET current_phase = $1,
                phase_history = $2,
                entered_current_phase_at = NOW(),
                updated_at = NOW()
            WHERE id = $3
          `, [newPhase, JSON.stringify(phaseHistory), item.id]);

          transitionedCount++;
          transitionDetails.push({
            contentId: item.content_id,
            from: currentPhase,
            to: newPhase
          });
          logger.info(`Content ${item.content_id} transitioned from ${currentPhase} to ${newPhase}`);
        }
      }

      return {
        evaluated: records.rows.length,
        transitioned: transitionedCount,
        details: transitionDetails
      };
    } catch (error) {
      logger.error('Error in evaluateAllContentLifecycle:', error);
      throw error;
    }
  }

  /**
   * Start 5-minute periodic automated lifecycle batch job
   */
  startPeriodicLifecycleWorker(intervalMs = 300000) {
    if (this.intervalId || process.env.NODE_ENV === 'test') return;
    this.intervalId = setInterval(() => {
      this.evaluateAllContentLifecycle().catch(err => {
        logger.error('Error in automated lifecycle batch worker:', err);
      });
    }, intervalMs);
    if (this.intervalId && typeof this.intervalId.unref === 'function') {
      this.intervalId.unref();
    }
    logger.info(`NexusGNN automated lifecycle worker started (interval: ${intervalMs}ms)`);
  }

  /**
   * Stop automated worker
   */
  stopPeriodicLifecycleWorker() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

module.exports = new NexusGNNLifecycle();
