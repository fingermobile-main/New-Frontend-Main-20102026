/**
 * FeatureFlagService
 * Dynamic feature flag management with A/B testing and gradual rollouts
 */

const pool = require('../database/connection');
const logger = require('../utils/logger');

class FeatureFlagService {
  /**
   * Check if feature is enabled for user
   */
  async isFeatureEnabled(featureKey, userId = null, context = {}) {
    try {
      const flag = await this.getFlagByKey(featureKey);

      if (!flag || !flag.is_active) {
        return false;
      }

      // Check if user has explicit assignment
      if (userId) {
        const userAssignment = await this.getUserFlagAssignment(userId, flag.id);
        if (userAssignment) {
          return userAssignment.enabled;
        }
      }

      // Check percentage rollout
      if (flag.rollout_percentage < 100) {
        if (!userId) {
          return false; // Anonymous users not in partial rollout
        }

        const userHash = this.hashUserForRollout(userId, featureKey);
        return userHash < flag.rollout_percentage;
      }

      // Check targeting rules
      if (flag.targeting_rules && Object.keys(flag.targeting_rules).length > 0) {
        return this.matchesTargetingRules(context, flag.targeting_rules);
      }

      return true;
    } catch (error) {
      logger.error('Error checking feature flag:', error);
      return false; // Fail safe - disable on error
    }
  }

  /**
   * Get all flags for user
   */
  async getAllFlags(userId = null, context = {}) {
    try {
      const query = `
        SELECT * FROM feature_flags
        WHERE is_active = true
        ORDER BY priority DESC, created_at DESC
      `;

      const result = await pool.query(query);

      const flags = {};
      for (const flag of result.rows) {
        const enabled = await this.isFeatureEnabled(flag.key, userId, context);
        flags[flag.key] = {
          enabled,
          variant: flag.variants ? this.selectVariant(flag.variants, userId) : null,
          metadata: flag.metadata
        };
      }

      return flags;
    } catch (error) {
      logger.error('Error getting all flags:', error);
      return {};
    }
  }

  /**
   * Create new feature flag
   */
  async createFlag(key, name, description, options = {}) {
    try {
      const {
        is_active = true,
        rollout_percentage = 100,
        variants = null,
        targeting_rules = {},
        metadata = {},
        priority = 0
      } = options;

      const query = `
        INSERT INTO feature_flags (
          key, name, description, is_active, rollout_percentage,
          variants, targeting_rules, metadata, priority, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        RETURNING *
      `;

      const result = await pool.query(query, [
        key,
        name,
        description,
        is_active,
        rollout_percentage,
        JSON.stringify(variants),
        JSON.stringify(targeting_rules),
        JSON.stringify(metadata),
        priority
      ]);

      await this.logFlagChange(result.rows[0].id, 'created', null, key);

      return result.rows[0];
    } catch (error) {
      logger.error('Error creating feature flag:', error);
      throw error;
    }
  }

  /**
   * Update feature flag
   */
  async updateFlag(flagId, updates) {
    try {
      const oldFlag = await this.getFlagById(flagId);

      const allowedFields = ['is_active', 'rollout_percentage', 'variants', 'targeting_rules', 'metadata', 'priority'];
      const updateFields = [];
      const values = [];
      let paramIndex = 1;

      for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
          updateFields.push(`${key} = $${paramIndex}`);
          values.push(typeof value === 'object' ? JSON.stringify(value) : value);
          paramIndex++;
        }
      }

      if (updateFields.length === 0) {
        throw new Error('No valid fields to update');
      }

      values.push(flagId);

      const query = `
        UPDATE feature_flags
        SET ${updateFields.join(', ')} updated_at = NOW()
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await pool.query(query, values);

      await this.logFlagChange(flagId, 'updated', oldFlag, result.rows[0]);

      return result.rows[0];
    } catch (error) {
      logger.error('Error updating feature flag:', error);
      throw error;
    }
  }

  /**
   * Delete feature flag
   */
  async deleteFlag(flagId) {
    try {
      const flag = await this.getFlagById(flagId);

      await pool.query('DELETE FROM feature_flags WHERE id = $1', [flagId]);

      await this.logFlagChange(flagId, 'deleted', flag, null);

      return { success: true };
    } catch (error) {
      logger.error('Error deleting feature flag:', error);
      throw error;
    }
  }

  /**
   * Assign flag to specific user
   */
  async assignFlagToUser(userId, flagKey, enabled) {
    try {
      const flag = await this.getFlagByKey(flagKey);

      if (!flag) {
        throw new Error(`Feature flag not found: ${flagKey}`);
      }

      const query = `
        INSERT INTO user_flag_assignments (user_id, flag_id, enabled, assigned_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (user_id, flag_id)
        DO UPDATE SET enabled = $3, assigned_at = NOW()
        RETURNING *
      `;

      const result = await pool.query(query, [userId, flag.id, enabled]);

      return result.rows[0];
    } catch (error) {
      logger.error('Error assigning flag to user:', error);
      throw error;
    }
  }

  /**
   * Get flag analytics
   */
  async getFlagAnalytics(flagId, startDate, endDate) {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_checks,
          COUNT(CASE WHEN enabled = true THEN 1 END) as enabled_count,
          COUNT(CASE WHEN enabled = false THEN 1 END) as disabled_count
        FROM flag_analytics
        WHERE flag_id = $1
          AND checked_at BETWEEN $2 AND $3
      `;

      const result = await pool.query(query, [flagId, startDate, endDate]);

      return result.rows[0];
    } catch (error) {
      logger.error('Error getting flag analytics:', error);
      throw error;
    }
  }

  /**
   * Track flag check for analytics
   */
  async trackFlagCheck(flagId, userId, enabled) {
    try {
      await pool.query(
        `INSERT INTO flag_analytics (flag_id, user_id, enabled, checked_at)
         VALUES ($1, $2, $3, NOW())`,
        [flagId, userId, enabled]
      );
    } catch (error) {
      logger.error('Error tracking flag check:', error);
    }
  }

  /**
   * Get flag by key
   */
  async getFlagByKey(key) {
    const query = 'SELECT * FROM feature_flags WHERE key = $1';
    const result = await pool.query(query, [key]);
    return result.rows[0] || null;
  }

  /**
   * Get flag by ID
   */
  async getFlagById(id) {
    const query = 'SELECT * FROM feature_flags WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Get user flag assignment
   */
  async getUserFlagAssignment(userId, flagId) {
    const query = `
      SELECT * FROM user_flag_assignments
      WHERE user_id = $1 AND flag_id = $2
    `;
    const result = await pool.query(query, [userId, flagId]);
    return result.rows[0] || null;
  }

  /**
   * Hash user for consistent rollout
   */
  hashUserForRollout(userId, featureKey) {
    const crypto = require('crypto');
    const hash = crypto.createHash('md5')
      .update(`${userId}:${featureKey}`)
      .digest('hex');

    return parseInt(hash.substring(0, 8), 16) % 100;
  }

  /**
   * Select variant based on weights
   */
  selectVariant(variants, userId) {
    if (!variants || variants.length === 0) {
      return null;
    }

    const hash = this.hashUserForRollout(userId, 'variant');
    let cumulativeWeight = 0;

    for (const variant of variants) {
      cumulativeWeight += variant.weight || 0;
      if (hash < cumulativeWeight) {
        return variant.name;
      }
    }

    return variants[0].name; // Fallback to first variant
  }

  /**
   * Check if context matches targeting rules
   */
  matchesTargetingRules(context, rules) {
    for (const [key, expectedValue] of Object.entries(rules)) {
      const actualValue = context[key];

      if (Array.isArray(expectedValue)) {
        if (!expectedValue.includes(actualValue)) {
          return false;
        }
      } else if (actualValue !== expectedValue) {
        return false;
      }
    }

    return true;
  }

  /**
   * Log flag change for audit trail
   */
  async logFlagChange(flagId, action, oldValue, newValue) {
    try {
      await pool.query(
        `INSERT INTO flag_audit_log (flag_id, action, old_value, new_value, changed_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [flagId, action, JSON.stringify(oldValue), JSON.stringify(newValue)]
      );
    } catch (error) {
      logger.error('Error logging flag change:', error);
    }
  }
}

module.exports = new FeatureFlagService();
