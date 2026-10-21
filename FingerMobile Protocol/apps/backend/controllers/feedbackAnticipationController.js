/**
 * FingerMobile Protocol™ - Feedback Anticipation & Cognitive Optimization Controller
 * Handles haptic micro-interactions, Stochastic Reward Scheduling, Cognitive Load Sensing, and Peripheral Notifications
 */

const logger = require('../utils/logger');

/**
 * Record dynamic feedback interaction (Love/Dislike/Long-press burst)
 * Returns haptic pattern, updated metrics, and visual shimmer trigger
 */
const recordInteraction = async (req, res) => {
  try {
    const { targetId, targetType, interactionType, durationMs = 0 } = req.body;
    const userId = req.user ? req.user.id || req.user.userId : req.body.userId;

    if (!targetId || !interactionType) {
      return res.status(400).json({
        success: false,
        error: 'targetId and interactionType are required.'
      });
    }

    // Determine haptic intensity and haptic feedback pattern
    let hapticProfile = 'light';
    let feedbackMultiplier = 1.0;

    if (interactionType === 'burst' || durationMs > 1500) {
      hapticProfile = 'heavy_vibrate';
      feedbackMultiplier = 2.5;
    } else if (interactionType === 'love') {
      hapticProfile = 'double_click';
      feedbackMultiplier = 1.5;
    } else if (interactionType === 'dislike') {
      hapticProfile = 'soft_tap';
      feedbackMultiplier = 0.8;
    }

    return res.status(200).json({
      success: true,
      data: {
        targetId,
        targetType: targetType || 'post',
        interactionType,
        hapticProfile,
        feedbackMultiplier,
        shimmerActive: interactionType === 'love' || interactionType === 'burst',
        processedAt: new Date().toISOString(),
        userId
      }
    });
  } catch (error) {
    if (logger && typeof logger.error === 'function') {
      logger.error('Error in recordInteraction:', error);
    }
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * Variable Ratio Reinforcement Stochastic Reward Scheduler
 * Returns unpredictable Gems/Hallmarks burst on high-effort interaction
 */
const getStochasticReward = async (req, res) => {
  try {
    const userId = req.user ? req.user.id || req.user.userId : req.query.userId || 'a0000000-0000-0000-0000-000000000001';
    const streakCount = parseInt(req.query.streakCount || '1', 10);

    // Stochastic distribution: 25% chance of bonus reward, 5% jackpot
    const roll = Math.random();
    let rewardType = 'none';
    let rewardAmount = 0;
    let badge = null;

    if (roll > 0.95) {
      rewardType = 'hallmark_jackpot';
      rewardAmount = 1000;
      badge = 'Rare Anticipation Hallmark';
    } else if (roll > 0.75) {
      rewardType = 'gems_burst';
      rewardAmount = Math.floor(Math.random() * 20) + 5; // 5-25 Gems
    } else if (streakCount >= 5 && roll > 0.50) {
      rewardType = 'streak_multiplier';
      rewardAmount = 10;
    }

    return res.status(200).json({
      success: true,
      data: {
        userId,
        rewardType,
        rewardAmount,
        badge,
        rollMetric: roll.toFixed(4),
        nextRollAvailable: true
      }
    });
  } catch (error) {
    if (logger && typeof logger.error === 'function') {
      logger.error('Error in getStochasticReward:', error);
    }
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * Cognitive Load Sensing (Stroop-task pull-to-refresh & doomscrolling throttling)
 * Calculates consumption velocity and generates mindful break prompts
 */
const evaluateCognitiveLoad = async (req, res) => {
  try {
    const { refreshIntervalMs, scrollSpeedPxPerSec, sessionDurationMinutes } = req.body;

    // Normal browsing thresholds:
    // refreshIntervalMs < 2000 (rapid pull-to-refresh)
    // scrollSpeedPxPerSec > 2500 (furious doomscrolling)
    // sessionDurationMinutes > 45 (sustained cognitive immersion)
    const isRapidRefreshing = refreshIntervalMs && refreshIntervalMs < 2000;
    const isFuriousScrolling = scrollSpeedPxPerSec && scrollSpeedPxPerSec > 2500;
    const isProlongedSession = sessionDurationMinutes && sessionDurationMinutes > 45;

    const cognitiveOverload = isRapidRefreshing || isFuriousScrolling || isProlongedSession;
    let throttleAction = 'none';
    let promptMessage = null;

    if (cognitiveOverload) {
      throttleAction = 'recommend_break';
      promptMessage = 'You have been consuming content rapidly. Take a 60-second breathing moment to recharge.';
    }

    return res.status(200).json({
      success: true,
      data: {
        cognitiveOverload,
        throttleAction,
        throttleDelayMs: cognitiveOverload ? 1200 : 0,
        promptMessage,
        evaluatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    if (logger && typeof logger.error === 'function') {
      logger.error('Error in evaluateCognitiveLoad:', error);
    }
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * Peripheral Notification Shade (5-7s window, non-intrusive edge glow)
 */
const getPeripheralNotifications = async (req, res) => {
  try {
    const userId = req.user ? req.user.id || req.user.userId : req.query.userId || 'a0000000-0000-0000-0000-000000000001';

    // Mock/curate notifications formatted for non-intrusive edge glow display
    const notifications = [
      {
        id: 'notif_1',
        title: 'New Gem Drop',
        snippet: 'You earned 0.1 Gems on BeatwaveNG stream.',
        urgency: 'low',
        displayWindowSeconds: 5,
        edgeGlowColor: '#f59e0b',
        timestamp: new Date().toISOString()
      },
      {
        id: 'notif_2',
        title: 'Peer Connected',
        snippet: 'P2P mesh node established with low-latency hop.',
        urgency: 'info',
        displayWindowSeconds: 6,
        edgeGlowColor: '#10b981',
        timestamp: new Date().toISOString()
      }
    ];

    return res.status(200).json({
      success: true,
      data: {
        userId,
        notifications,
        queueCount: notifications.length
      }
    });
  } catch (error) {
    if (logger && typeof logger.error === 'function') {
      logger.error('Error in getPeripheralNotifications:', error);
    }
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

module.exports = {
  recordInteraction,
  getStochasticReward,
  evaluateCognitiveLoad,
  getPeripheralNotifications
};
