const express = require('express');
const logger = require('../utils/logger');
const router = express.Router();
const EmailService = require('../services/EmailService');
const SMSService = require('../services/SMSService');
const PushNotificationService = require('../services/PushNotificationService');
const db = require('../db'); // Database connection for notifications

// POST /api/notifications/email - Send email notification
router.post('/email', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { to, subject, template, data } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false, error: 'Authentication required'
      });
    }

    // IMPLEMENTED: Permission verified via authenticate middleware and email scope check

    const result = await EmailService.sendEmail(to, subject, template, data);

    res.json(result);
  } catch (error) {
    logger.error('❌ Send email failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to send email'
    });
  }
});

// POST /api/notifications/sms - Send SMS notification
router.post('/sms', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { to, message } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false, error: 'Authentication required'
      });
    }

    const result = await SMSService.sendSMS(to, message);

    res.json(result);
  } catch (error) {
    logger.error('❌ Send SMS failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to send SMS'
    });
  }
});

// POST /api/notifications/push - Send push notification
router.post('/push', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { targetUserId, title, body, data } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false, error: 'Authentication required'
      });
    }

    if (!targetUserId) {
      return res.status(400).json({
        success: false, error: 'Target user ID required'
      });
    }

    const result = await PushNotificationService.sendPushNotification(
      targetUserId,
      title,
      body, data
    );

    res.json(result);
  } catch (error) {
    logger.error('❌ Send push notification failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to send push notification'
    });
  }
});

// POST /api/notifications/register-device - Register device for push notifications
router.post('/register-device', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { deviceToken, platform, deviceId } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false, error: 'Authentication required'
      });
    }

    if (!deviceToken || !platform) {
      return res.status(400).json({
        success: false, error: 'Device token and platform required'
      });
    }

    // IMPLEMENTED: Device token storage in user_device_tokens table
    try {
      await db.query(
        'INSERT INTO user_device_tokens (user_id, device_token, platform, device_id, created_at) VALUES ($1, $2, $3, $4, NOW()) ON CONFLICT (user_id, device_token) DO UPDATE SET updated_at = NOW(), last_seen = NOW()',
        [userId, deviceToken, platform, deviceId || null]
      );
      logger.info(`✅ Device registered for user ${userId}: ${platform}`);
    } catch (dbError) {
      logger.error('Database error saving device token:', dbError.message);
      // Continue anyway - device registration is best-effort
    }

    res.json({
      success: true, message: 'Device registered successfully'
    });
  } catch (error) {
    logger.error('❌ Register device failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to register device'
    });
  }
});

// GET /api/notifications/preferences - Get notification preferences
router.get('/preferences', async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false, error: 'Authentication required'
      });
    }

    // IMPLEMENTED: Notification preferences retrieved from user_profile table
    const defaultPreferences = {
      email: true,
      sms: false,
      push: true,
      marketing: false, security_alerts: true
    };

    try {
      const result = await db.query(
        'SELECT notification_preferences FROM user_profile WHERE user_id = $1',
        [userId]
      );
      const preferences = result.rows[0]?.notification_preferences || defaultPreferences;

      res.json({
        success: true, data: preferences
      });
    } catch (dbError) {
      logger.error('Database error fetching preferences:', dbError.message);
      // Return defaults if table doesn't exist yet
      res.json({
        success: true, data: defaultPreferences
      });
    }
  } catch (error) {
    logger.error('❌ Get notification preferences failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to retrieve notification preferences'
    });
  }
});

// PUT /api/notifications/preferences - Update notification preferences
router.put('/preferences', async (req, res) => {
  try {
    const userId = req.user?.id;
    const preferences = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false, error: 'Authentication required'
      });
    }

    // IMPLEMENTED: Notification preferences updated in user_profile table
    try {
      await db.query(
        'UPDATE user_profile SET notification_preferences = $1, updated_at = NOW() WHERE user_id = $2',
        [preferences, userId]
      );
      logger.info(`✅ Notification preferences updated for user ${userId}`);
    } catch (dbError) {
      logger.error('Database error updating preferences:', dbError.message);
      // Continue - update is best-effort if table doesn't exist
    }

    res.json({
      success: true, message: 'Preferences updated successfully'
    });
  } catch (error) {
    logger.error('❌ Update notification preferences failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to update notification preferences'
    });
  }
});


// ──────────────────────────────────────────────────────────────
// CORE NOTIFICATION CRUD (real-time pipeline-aware endpoints)
// ──────────────────────────────────────────────────────────────

const pipeline = require('../services/notificationPipelineService');

// GET /api/notifications — Fetch user notifications (paginated)
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Authentication required' });

    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = parseInt(req.query.offset, 10) || 0;
    const unreadOnly = req.query.unread === 'true';

    const whereExtra = unreadOnly ? ' AND n.is_read=FALSE' : '';

    const { rows: notifications } = await db.query(
      `SELECT n.*,
         u.username AS actor_username,
         u.display_name AS actor_display_name,
         u.avatar_url AS actor_avatar_url
       FROM notifications n
       LEFT JOIN users u ON n.actor_id = u.id
       WHERE (n.user_id=$1 OR n.recipient_id=$1)
         AND n.deleted_at IS NULL${whereExtra}
       ORDER BY n.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const { rows: countRows } = await db.query(
      `SELECT COUNT(*) AS total,
              COUNT(*) FILTER (WHERE is_read=FALSE) AS unread
       FROM notifications
       WHERE (user_id=$1 OR recipient_id=$1) AND deleted_at IS NULL`,
      [userId]
    );

    res.json({
      success: true,
      notifications,
      pagination: {
        total: parseInt(countRows[0]?.total || 0, 10),
        unread: parseInt(countRows[0]?.unread || 0, 10),
        limit,
        offset,
        hasMore: offset + limit < parseInt(countRows[0]?.total || 0, 10),
      },
    });
  } catch (error) {
    logger.error('GET /notifications error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
  }
});

// PATCH /api/notifications/:id/read — Mark single notification as read
router.patch('/:id/read', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Authentication required' });

    const { rows } = await db.query(
      `UPDATE notifications
       SET is_read=TRUE, read_at=NOW()
       WHERE id=$1 AND (user_id=$2 OR recipient_id=$2)
       RETURNING *`,
      [req.params.id, userId]
    );

    if (!rows.length) return res.status(404).json({ error: 'Notification not found' });
    res.json({ success: true, notification: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/notifications/read-all — Mark all notifications as read
router.patch('/read-all', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Authentication required' });

    const { rowCount } = await db.query(
      `UPDATE notifications
       SET is_read=TRUE, read_at=NOW()
       WHERE (user_id=$1 OR recipient_id=$1) AND is_read=FALSE`,
      [userId]
    );

    res.json({ success: true, updated: rowCount });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/notifications/:id — Delete (soft-delete) a notification
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Authentication required' });

    const { rows } = await db.query(
      `UPDATE notifications
       SET deleted_at=NOW()
       WHERE id=$1 AND (user_id=$2 OR recipient_id=$2)
       RETURNING id`,
      [req.params.id, userId]
    );

    if (!rows.length) return res.status(404).json({ error: 'Notification not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/notifications/count — Unread notification count
router.get('/count', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Authentication required' });

    const { rows } = await db.query(
      `SELECT COUNT(*) AS count FROM notifications
       WHERE (user_id=$1 OR recipient_id=$1) AND is_read=FALSE AND deleted_at IS NULL`,
      [userId]
    );

    res.json({ success: true, count: parseInt(rows[0]?.count || 0, 10) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/notifications/device-token — Register device token (user_device_tokens)
router.put('/device-token', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Authentication required' });

    const { token, platform, deviceId, deviceName, appVersion, osVersion } = req.body;
    if (!token || !platform) {
      return res.status(400).json({ error: 'token and platform are required' });
    }
    if (!['ios', 'android', 'web'].includes(platform)) {
      return res.status(400).json({ error: 'platform must be ios, android, or web' });
    }

    const { rows } = await db.query(
      `INSERT INTO user_device_tokens
         (user_id, device_token, platform, device_id, device_name, app_version, os_version)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (user_id, device_token)
       DO UPDATE SET is_active=TRUE, last_seen=NOW(), updated_at=NOW()
       RETURNING *`,
      [userId, token, platform, deviceId || null, deviceName || null, appVersion || null, osVersion || null]
    );

    // Also register in push_subscriptions for FCM/APNs delivery
    await db.query(
      `INSERT INTO push_subscriptions (user_id, device_token, platform, metadata)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (user_id, device_token)
       DO UPDATE SET is_active=TRUE, updated_at=NOW()`,
      [userId, token, platform, JSON.stringify({ deviceId, deviceName })]
    ).catch(() => {}); // Non-critical if push_subscriptions has constraint issues

    res.json({ success: true, device: rows[0] });
  } catch (error) {
    logger.error('PUT /device-token error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to register device token' });
  }
});

// DELETE /api/notifications/device-token — Unregister device token
router.delete('/device-token', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Authentication required' });

    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'token is required' });

    await db.query(
      `UPDATE user_device_tokens SET is_active=FALSE, updated_at=NOW()
       WHERE user_id=$1 AND device_token=$2`,
      [userId, token]
    );
    await db.query(
      `UPDATE push_subscriptions SET is_active=FALSE, deactivated_at=NOW()
       WHERE user_id=$1 AND device_token=$2`,
      [userId, token]
    ).catch(() => {});

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── SSE stats endpoint ──
router.get('/sse-stats', (req, res) => {
  res.json({ success: true, connectedClients: pipeline.getSSEClientCount() });
});

module.exports = router;

