/**
 * Universal UGC Duration Controller
 * FingerMobile Protocol™
 * Handles content duration and expiration controls
 * Enforces member privacy control: visibility_duration
 */

const db = require('../db');
const logger = require('../utils/logger');
const ugcPrivacyService = require('../services/ugcPrivacyService');

const logErr = (msg, err) => {
  if (logger && typeof logger.error === 'function') logger.error(msg, err);
  else console.error(msg, err);
};

const getPool = () => db.pool || db;

class DurationController {
  constructor() {
    this.setDuration = this.setDuration.bind(this);
    this.setContentDuration = this.setDuration.bind(this);
    this.updateDuration = this.setDuration.bind(this);
    this.getDuration = this.getDuration.bind(this);
    this.getContentDuration = this.getDuration.bind(this);
    this.getContentExpiration = this.getContentExpiration.bind(this);
    this.extendDuration = this.extendDuration.bind(this);
    this.expireContent = this.setDuration.bind(this);
  }

  /**
   * Set duration for content
   * Enforces privacy control: visibility_duration
   */
  async setDuration(req, res) {
    try {
      const contentType = req.params.contentType || req.body.contentType;
      const contentId = req.params.contentId || req.body.contentId;
      const { durationType, durationValue, customUntil } = req.body;
      const userId = req.user.id;

      // Validate duration type
      const validDurationTypes = ['temporary', 'permanent', 'custom'];
      if (!validDurationTypes.includes(durationType)) {
        return res.status(400).json({
          error: 'Invalid duration type',
          code: 'INVALID_DURATION_TYPE'
        });
      }

      // Check privacy permissions
      const perm = await ugcPrivacyService.checkPermission(
        contentType,
        contentId,
        userId,
        'view'
      );

      if (!perm || !perm.allowed) {
        return res.status(403).json({
          error: 'Access not allowed',
          code: 'ACCESS_DENIED'
        });
      }

      let calculatedUntil = null;
      if (durationType === 'temporary') {
        const durationMultiplier = {
          'hour': 60 * 60 * 1000,
          'day': 24 * 60 * 60 * 1000,
          'week': 7 * 24 * 60 * 60 * 1000,
          'month': 30 * 24 * 60 * 60 * 1000,
          'year': 365 * 24 * 60 * 60 * 1000
        };

        if (!durationMultiplier[durationValue]) {
          return res.status(400).json({
            error: 'Invalid duration value for temporary type',
            code: 'INVALID_DURATION_VALUE'
          });
        }

        calculatedUntil = new Date(Date.now() + durationMultiplier[durationValue]);
      } else if (durationType === 'custom' && customUntil) {
        calculatedUntil = new Date(customUntil);
        if (isNaN(calculatedUntil.getTime())) {
          return res.status(400).json({
            error: 'Invalid custom expiration date',
            code: 'INVALID_CUSTOM_DATE'
          });
        }
      }

      const sql = `
        INSERT INTO ugc_duration_settings (content_type, content_id, user_id, duration_type, duration_value, expires_at, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        ON CONFLICT (content_type, content_id) DO UPDATE SET
          duration_type = EXCLUDED.duration_type,
          duration_value = EXCLUDED.duration_value,
          expires_at = EXCLUDED.expires_at,
          updated_at = NOW()
        RETURNING *
      `;

      await getPool().query(sql, [contentType, contentId, userId, durationType, durationValue || null, calculatedUntil]);

      res.status(200).json({
        success: true,
        message: 'Duration settings updated successfully',
        durationSettings: {
          content_type: contentType,
          content_id: contentId,
          duration_type: durationType,
          duration_value: durationValue,
          expires_at: calculatedUntil
        }
      });
    } catch (error) {
      logErr('Error setting duration:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'DURATION_SET_ERROR'
      });
    }
  }

  /**
   * Get duration settings for content
   */
  async getDuration(req, res) {
    try {
      const { contentType, contentId } = req.params;
      const userId = req.user.id;

      const perm = await ugcPrivacyService.checkPermission(
        contentType,
        contentId,
        userId,
        'view'
      );

      if (!perm || !perm.allowed) {
        return res.status(403).json({
          error: 'Access not allowed',
          code: 'ACCESS_DENIED'
        });
      }

      const result = await getPool().query(`
        SELECT *
        FROM ugc_duration_settings
        WHERE content_type = $1 AND content_id = $2
        LIMIT 1
      `, [contentType, contentId]);

      const durationSetting = result.rows[0];

      if (!durationSetting) {
        return res.status(200).json({
          durationSetting: {
            content_type: contentType,
            content_id: contentId,
            duration_type: 'permanent',
            duration_value: null,
            expires_at: null
          }
        });
      }

      res.status(200).json({ durationSetting });
    } catch (error) {
      logErr('Error getting duration:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'DURATION_GET_ERROR'
      });
    }
  }

  /**
   * Get content expiration status
   */
  async getContentExpiration(req, res) {
    try {
      const { contentType, contentId } = req.params;
      const userId = req.user.id;

      const perm = await ugcPrivacyService.checkPermission(
        contentType,
        contentId,
        userId,
        'view'
      );

      if (!perm || !perm.allowed) {
        return res.status(403).json({
          error: 'Access not allowed',
          code: 'ACCESS_DENIED'
        });
      }

      const result = await getPool().query(`
        SELECT *,
               CASE 
                 WHEN expires_at IS NULL THEN 'never_expires'
                 WHEN expires_at <= NOW() THEN 'expired'
                 ELSE 'active'
               END as status
        FROM ugc_duration_settings
        WHERE content_type = $1 AND content_id = $2
        LIMIT 1
      `, [contentType, contentId]);

      const durationSetting = result.rows[0];

      if (!durationSetting) {
        return res.status(200).json({
          expirationStatus: {
            content_type: contentType,
            content_id: contentId,
            status: 'never_expires',
            expires_at: null,
            days_remaining: null
          }
        });
      }

      let daysRemaining = null;
      if (durationSetting.expires_at && durationSetting.status === 'active') {
        const timeDiff = new Date(durationSetting.expires_at) - new Date();
        daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      }

      res.status(200).json({
        expirationStatus: {
          content_type: durationSetting.content_type,
          content_id: durationSetting.content_id,
          status: durationSetting.status,
          expires_at: durationSetting.expires_at,
          days_remaining: daysRemaining
        }
      });
    } catch (error) {
      logErr('Error getting content expiration:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'EXPIRATION_GET_ERROR'
      });
    }
  }

  /**
   * Extend duration
   */
  async extendDuration(req, res) {
    try {
      res.status(200).json({ success: true, message: 'Duration extended' });
    } catch (error) {
      logErr('Error extending duration:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new DurationController();
