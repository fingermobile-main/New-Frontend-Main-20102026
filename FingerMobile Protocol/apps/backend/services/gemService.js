const logger = require('../utils/logger');
const { identityDb } = require('../db');
const platformCompatibilityService = require('./platformCompatibilityService');

class GemService {
  // Calculate Gems for proof of play (BeatwaveNG integration) with platform adjustments
  async calculateProofOfPlayGems(userId, trackId, listenDurationSeconds, platform = 'web') {
    try {
      // Every 30 seconds of listening generates 0.1 Gems
      let baseGems = Math.floor(listenDurationSeconds / 30) * 0.1;

      if (baseGems <= 0) {
        return { success: false, message: 'Not enough listening time to earn gems' };
      }

      // Adjust gems based on platform to prevent abuse
      const adjustedGems = platformCompatibilityService.adjustGemsForPlatform(baseGems, platform);

      // Check platform-specific active sessions (simplified for now)
      const activeSessions = 1;

      // Check platform-specific limits
      const limitCheck = platformCompatibilityService.checkPlatformLimits(
        platform,
        {
          recentActivity: [], // Need to fetch recent activity from DB if we want full enforcement
          concurrentSessions: activeSessions
        }
      );

      if (!limitCheck.success) {
        return {
          success: false,
          message: `Gems earning limit exceeded: ${limitCheck.message}`,
          reason: limitCheck.limitType
        };
      }

      // Record in PostgreSQL
      await identityDb.query('BEGIN');

      const insertHistory = `
        INSERT INTO gems_history (member_id, amount, type, source_id, source_model, description)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      await identityDb.query(insertHistory, [
        userId,
        adjustedGems,
        'proof_of_play',
        trackId,
        'Track',
        `Listening to track for ${listenDurationSeconds} seconds on ${platform}`
      ]);

      const updateBalance = `
        INSERT INTO gems_balances (member_id, total_gems, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (member_id) DO UPDATE 
        SET total_gems = gems_balances.total_gems + $2, updated_at = NOW()
      `;
      await identityDb.query(updateBalance, [userId, adjustedGems]);

      await identityDb.query('COMMIT');

      return {
        success: true,
        gemsEarned: adjustedGems,
        platformAdjustmentApplied: baseGems !== adjustedGems,
        originalGems: baseGems
      };
    } catch (error) {
      await identityDb.query('ROLLBACK');
      logger.error('Error calculating proof of play gems:', error);
      return { success: false, error: error.message };
    }
  }

  // Calculate Gems for curation (creating popular playlists)
  async calculateCurationGems(userId, playlistId, uniqueListeners, platform = 'web') {
    try {
      // Base bonus for reaching 1000 unique listeners
      const baseThreshold = 1000;
      const bonusPerThreshold = 50; // 50 gems per threshold reached

      if (uniqueListeners < baseThreshold) {
        return { success: false, message: 'Not enough unique listeners to earn curation bonus' };
      }

      const thresholdsReached = Math.floor(uniqueListeners / baseThreshold);
      let baseGems = thresholdsReached * bonusPerThreshold;

      // Adjust based on platform
      const adjustedGems = platformCompatibilityService.adjustGemsForPlatform(baseGems, platform);

      await identityDb.query('BEGIN');

      const insertHistory = `
        INSERT INTO gems_history (member_id, amount, type, source_id, source_model, description)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      await identityDb.query(insertHistory, [
        userId,
        adjustedGems,
        'curation',
        playlistId,
        'Playlist',
        `Curated playlist reached ${uniqueListeners} unique listeners on ${platform}`
      ]);

      const updateBalance = `
        INSERT INTO gems_balances (member_id, total_gems, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (member_id) DO UPDATE 
        SET total_gems = gems_balances.total_gems + $2, updated_at = NOW()
      `;
      await identityDb.query(updateBalance, [userId, adjustedGems]);

      await identityDb.query('COMMIT');

      return {
        success: true,
        gemsEarned: adjustedGems,
        platformAdjustmentApplied: baseGems !== adjustedGems,
        originalGems: baseGems
      };
    } catch (error) {
      await identityDb.query('ROLLBACK');
      logger.error('Error calculating curation gems:', error);
      return { success: false, error: error.message };
    }
  }

  // Calculate Gems for social amplification (sharing content)
  async calculateSocialAmplificationGems(userId, sharedContentId, shareType, platform = 'web') {
    try {
      // Different amounts for different types of shares
      let baseGems = 0;
      let description = '';

      switch (shareType) {
      case 'trend':
        baseGems = 2.0;
        description = `Shared content to Trends on ${platform}`;
        break;
      case 'external_platform':
        baseGems = 5.0;
        description = `Shared content to external platform from ${platform}`;
        break;
      case 'fingermobile_module':
        baseGems = 1.5;
        description = `Shared content to another FingerMobile module from ${platform}`;
        break;
      default:
        baseGems = 1.0;
        description = `Shared content from ${platform}`;
      }

      // Adjust based on platform
      const adjustedGems = platformCompatibilityService.adjustGemsForPlatform(baseGems, platform);

      await identityDb.query('BEGIN');

      const insertHistory = `
        INSERT INTO gems_history (member_id, amount, type, source_id, source_model, description)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      await identityDb.query(insertHistory, [
        userId,
        adjustedGems,
        'social_amplification',
        sharedContentId,
        'Post',
        description
      ]);

      const updateBalance = `
        INSERT INTO gems_balances (member_id, total_gems, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (member_id) DO UPDATE 
        SET total_gems = gems_balances.total_gems + $2, updated_at = NOW()
      `;
      await identityDb.query(updateBalance, [userId, adjustedGems]);

      await identityDb.query('COMMIT');

      return {
        success: true,
        gemsAmount: adjustedGems,
        platformAdjustmentApplied: baseGems !== adjustedGems,
        originalGems: baseGems
      };
    } catch (error) {
      await identityDb.query('ROLLBACK');
      logger.error('Error calculating social amplification gems:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user's gem history
  async getUserGemsHistory(userId, limit = 20, offset = 0) {
    try {
      const query = `
        SELECT * FROM gems_history 
        WHERE member_id = $1 
        ORDER BY created_at DESC 
        LIMIT $2 OFFSET $3
      `;
      const result = await identityDb.query(query, [userId, limit, offset]);

      const countQuery = 'SELECT COUNT(*) FROM gems_history WHERE member_id = $1';
      const countResult = await identityDb.query(countQuery, [userId]);

      return {
        gems: result.rows,
        total: parseInt(countResult.rows[0].count),
        limit,
        offset
      };
    } catch (error) {
      logger.error('Error fetching user gems history:', error);
      throw error;
    }
  }

  // Get user's total gems
  async getUserTotalGems(userId) {
    try {
      const query = 'SELECT total_gems FROM gems_balances WHERE member_id = $1';
      const result = await identityDb.query(query, [userId]);
      return result.rows.length > 0 ? parseFloat(result.rows[0].total_gems) : 0;
    } catch (error) {
      logger.error('Error calculating user total gems:', error);
      throw error;
    }
  }
}

module.exports = new GemService();
