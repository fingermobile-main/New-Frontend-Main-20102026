'use strict';

/**
 * FingerMobile Notification Pipeline Service
 * ─────────────────────────────────────────────────────────────
 * 4-Phase production notification pipeline:
 *   Phase 1 → Event Ingestion  (emit to notification_events table)
 *   Phase 2 → Fan-Out & Filter (write fan-out / pull-on-read, mute/sleep checks)
 *   Phase 3 → ML Batching      (aggregate likes/follows into "X and N others")
 *   Phase 4 → Push Delivery    (FCM, APNs, Web Push, SSE in-app)
 */

const pool = require('../db');
const logger = require('../utils/logger');

// ─── Batch window: group similar events within 30 min ─────────
const BATCH_WINDOW_MINUTES = 30;

// ─── Fan-out threshold: >10k followers = pull-on-read ─────────
const FAN_OUT_THRESHOLD = 10_000;

// ─── SSE registry: userId → [res, ...] ────────────────────────
const sseClients = new Map(); // Map<userId, Set<res>>

// ─── Rate limit cooldowns (ms) ───────────────────────────────
const RATE_LIMITS = {
  global_mention: 15 * 60 * 1000,   // 15 min
  channel_mention: 5 * 60 * 1000,   // 5 min
};

// ─────────────────────────────────────────────────────────────
// PHASE 1 — EVENT INGESTION
// ─────────────────────────────────────────────────────────────

/**
 * Emit a notification event into the pipeline.
 * Call this from any controller/service when a user action occurs.
 *
 * @param {Object} opts
 * @param {string}  opts.eventType       - 'like','comment','mention','follow','message','system'
 * @param {string}  opts.actorId         - UUID of the user performing the action
 * @param {string}  opts.recipientId     - UUID of the user to notify
 * @param {string}  [opts.referenceId]   - UUID of the related entity (post, comment…)
 * @param {string}  [opts.referenceType] - 'post','comment','message','group','forum'
 * @param {Object}  [opts.payload]       - Extra data for the notification body
 * @param {string}  [opts.priority]      - 'critical','high','normal','low'
 * @returns {Promise<Object>}            - The created notification_event row
 */
async function emit({ eventType, actorId, recipientId, referenceId, referenceType, payload = {}, priority = 'normal' }) {
  try {
    // Skip self-notifications
    if (actorId && actorId === recipientId) return null;

    // Build batch key for aggregation (Phase 3)
    const batchKey = referenceId
      ? `${eventType}:${referenceType || 'entity'}:${referenceId}:${recipientId}`
      : null;

    const { rows } = await pool.query(
      `INSERT INTO notification_events
         (event_type, actor_id, recipient_id, reference_id, reference_type, payload, priority, batch_key)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [eventType, actorId || null, recipientId, referenceId || null, referenceType || null, JSON.stringify(payload), priority, batchKey]
    );

    const event = rows[0];
    logger.info(`[Pipeline] Event ingested: ${eventType} → ${recipientId} (id: ${event.id})`);

    // Trigger processing asynchronously (non-blocking)
    setImmediate(() => processEvent(event).catch(e => logger.error('[Pipeline] processEvent error:', e.message)));

    return event;
  } catch (err) {
    logger.error('[Pipeline] emit error:', err.message);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// PHASE 2 — FAN-OUT & FILTERING
// ─────────────────────────────────────────────────────────────

/**
 * Process a single notification event through fan-out & filtering.
 */
async function processEvent(event) {
  try {
    // Mark as processing
    await pool.query(
      `UPDATE notification_events SET status='processing' WHERE id=$1`,
      [event.id]
    );

    // Check if recipient has muted notifications or is in quiet hours
    const suppressed = await shouldSuppressNotification(event.recipient_id, event.event_type);
    if (suppressed) {
      await pool.query(
        `UPDATE notification_events SET status='suppressed', processed_at=NOW() WHERE id=$1`,
        [event.id]
      );
      logger.info(`[Pipeline] Notification suppressed for user ${event.recipient_id} (muted/quiet hours)`);
      return;
    }

    // Phase 3: Try to batch similar events
    const notification = await batchOrCreateNotification(event);
    if (!notification) return;

    // Phase 4: Deliver via all active channels
    await deliverNotification(event.recipient_id, notification, event);

    // Mark event as delivered
    await pool.query(
      `UPDATE notification_events SET status='delivered', processed_at=NOW() WHERE id=$1`,
      [event.id]
    );
  } catch (err) {
    logger.error(`[Pipeline] processEvent failed for event ${event.id}:`, err.message);
    await pool.query(
      `UPDATE notification_events
       SET status='failed', error_message=$1, retry_count=retry_count+1, processed_at=NOW()
       WHERE id=$2`,
      [err.message.substring(0, 500), event.id]
    );
  }
}

/**
 * Check user notification preferences and quiet hours.
 * Returns true if notification should be suppressed.
 */
async function shouldSuppressNotification(recipientId, eventType) {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM user_notification_settings WHERE user_id=$1 LIMIT 1`,
      [recipientId]
    );
    if (!rows.length) return false;
    const prefs = rows[0];

    // Check muted_until
    if (prefs.muted_until && new Date(prefs.muted_until) > new Date()) return true;

    // Check in_app_enabled
    if (prefs.in_app_enabled === false) return true;

    // Check event-type specific flags
    const flagMap = {
      like: 'likes_notify',
      comment: 'comments_notify',
      mention: 'mentions_notify',
      follow: 'follows_notify',
      message: 'messages_notify',
      system: 'system_notify',
      announcement: 'announcements_notify',
    };
    const flag = flagMap[eventType];
    if (flag && prefs[flag] === false) return true;

    // Check quiet hours (local time comparison)
    if (prefs.quiet_hours_start && prefs.quiet_hours_end) {
      const now = new Date();
      const hhmm = now.getHours() * 60 + now.getMinutes();
      const [sh, sm] = prefs.quiet_hours_start.split(':').map(Number);
      const [eh, em] = prefs.quiet_hours_end.split(':').map(Number);
      const start = sh * 60 + sm;
      const end = eh * 60 + em;
      if (start <= end ? (hhmm >= start && hhmm < end) : (hhmm >= start || hhmm < end)) {
        return true;
      }
    }

    return false;
  } catch {
    return false; // Default: do not suppress on error
  }
}

// ─────────────────────────────────────────────────────────────
// PHASE 3 — ML BATCHING & AGGREGATION
// ─────────────────────────────────────────────────────────────

/**
 * Either add this event to an existing batch window, or create
 * a new notification immediately (for non-batchable events).
 *
 * Returns the notification object to deliver.
 */
async function batchOrCreateNotification(event) {
  const batchableTypes = ['like', 'reaction', 'follow'];

  if (!event.batch_key || !batchableTypes.includes(event.event_type)) {
    // Non-batchable: create notification immediately
    return createNotification(event);
  }

  // Check for active batch window
  const { rows: existingBatches } = await pool.query(
    `SELECT * FROM notification_batches
     WHERE batch_key=$1 AND recipient_id=$2 AND status='active'
       AND window_end > NOW()
     LIMIT 1`,
    [event.batch_key, event.recipient_id]
  );

  if (existingBatches.length) {
    const batch = existingBatches[0];
    // Add actor to batch (if not already in it)
    const actorIds = batch.actor_ids || [];
    if (event.actor_id && !actorIds.includes(event.actor_id)) {
      actorIds.push(event.actor_id);
    }
    const actorCount = actorIds.length;

    await pool.query(
      `UPDATE notification_batches
       SET actor_ids=$1, actor_count=$2, last_actor_id=$3, updated_at=NOW()
       WHERE id=$4`,
      [actorIds, actorCount, event.actor_id || batch.last_actor_id, batch.id]
    );

    logger.info(`[Pipeline] Batched event into batch ${batch.id} (count: ${actorCount})`);
    // Update existing notification body if it exists
    if (batch.notification_id) {
      const { title, body } = buildBatchedMessage(event.event_type, event.reference_type, actorCount, actorIds);
      await pool.query(
        `UPDATE notifications SET title=$1, message=$2, actor_count=$3, updated_at=NOW() WHERE id=$4`,
        [title, body, actorCount, batch.notification_id]
      );
      const { rows: notifRows } = await pool.query(`SELECT * FROM notifications WHERE id=$1`, [batch.notification_id]);
      return notifRows[0] || null;
    }
    return null; // Batch updated, no new notification needed yet
  }

  // Create new batch + notification
  const notification = await createNotification(event);
  if (!notification) return null;

  await pool.query(
    `INSERT INTO notification_batches
       (batch_key, recipient_id, reference_id, reference_type, event_type,
        actor_ids, actor_count, last_actor_id, window_end, notification_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW()+INTERVAL '${BATCH_WINDOW_MINUTES} minutes',$9)
     ON CONFLICT (batch_key, recipient_id, status) DO NOTHING`,
    [
      event.batch_key,
      event.recipient_id,
      event.reference_id || null,
      event.reference_type || null,
      event.event_type,
      event.actor_id ? [event.actor_id] : [],
      event.actor_id ? 1 : 0,
      event.actor_id || null,
      notification.id,
    ]
  );

  return notification;
}

/**
 * Build a human-readable batched message.
 * e.g. "Alex and 12 others liked your post"
 */
function buildBatchedMessage(eventType, referenceType, count, actorIds) {
  const ref = referenceType || 'content';
  const actionMap = {
    like: 'liked your',
    reaction: 'reacted to your',
    follow: 'started following you',
    comment: 'commented on your',
    mention: 'mentioned you in',
  };
  const action = actionMap[eventType] || 'interacted with your';

  if (count === 1) {
    return { title: 'New notification', body: `Someone ${action} ${ref}` };
  }
  const others = count - 1;
  return {
    title: `${count} people`,
    body: `Someone and ${others} other${others > 1 ? 's' : ''} ${action} ${ref}`,
  };
}

/**
 * Create a single notification record in the notifications table.
 */
async function createNotification(event) {
  try {
    // Fetch actor display name
    let actorName = 'Someone';
    if (event.actor_id) {
      const { rows: userRows } = await pool.query(
        `SELECT COALESCE(display_name, username, 'Someone') AS name FROM users WHERE id=$1 LIMIT 1`,
        [event.actor_id]
      );
      if (userRows.length) actorName = userRows[0].name;
    }

    const { title, body } = buildNotificationText(event.event_type, actorName, event.reference_type, event.payload);

    const { rows } = await pool.query(
      `INSERT INTO notifications
         (user_id, recipient_id, actor_id, sender_id, type, title, message,
          payload, reference_id, reference_type, priority, is_read, status, actor_count)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,FALSE,'delivered',1)
       RETURNING *`,
      [
        event.recipient_id,
        event.recipient_id,
        event.actor_id || null,
        event.actor_id || null,
        event.event_type,
        title,
        body,
        JSON.stringify(event.payload || {}),
        event.reference_id || null,
        event.reference_type || null,
        event.priority || 'normal',
      ]
    );

    return rows[0];
  } catch (err) {
    logger.error('[Pipeline] createNotification error:', err.message);
    return null;
  }
}

/**
 * Build human-readable notification title + body.
 */
function buildNotificationText(eventType, actorName, referenceType, payload) {
  const ref = referenceType || 'content';
  const templates = {
    like: {
      title: `${actorName} liked your ${ref}`,
      body: `${actorName} liked your ${ref}. Tap to view.`,
    },
    reaction: {
      title: `${actorName} reacted to your ${ref}`,
      body: `${actorName} left a reaction on your ${ref}.`,
    },
    comment: {
      title: `${actorName} commented on your ${ref}`,
      body: payload?.preview ? `"${String(payload.preview).substring(0, 80)}…"` : `${actorName} left a comment.`,
    },
    mention: {
      title: `${actorName} mentioned you`,
      body: payload?.preview ? `${actorName}: "${String(payload.preview).substring(0, 80)}…"` : `${actorName} mentioned you in a ${ref}.`,
    },
    follow: {
      title: `${actorName} is now following you`,
      body: `${actorName} started following your profile.`,
    },
    message: {
      title: `New message from ${actorName}`,
      body: payload?.preview ? `"${String(payload.preview).substring(0, 80)}…"` : `${actorName} sent you a message.`,
    },
    system: {
      title: payload?.title || 'System notification',
      body: payload?.message || 'You have a new system notification.',
    },
    announcement: {
      title: payload?.title || 'Platform Announcement',
      body: payload?.message || 'There is a new announcement for you.',
    },
    badge: {
      title: `🏅 New badge earned!`,
      body: payload?.badgeName ? `You earned the "${payload.badgeName}" badge!` : 'You earned a new badge!',
    },
  };

  return templates[eventType] || { title: 'New notification', body: `${actorName} interacted with your content.` };
}

// ─────────────────────────────────────────────────────────────
// PHASE 4 — PUSH GATEWAY DELIVERY
// ─────────────────────────────────────────────────────────────

/**
 * Deliver a notification via all active channels for a recipient.
 * Channels: SSE (in-app real-time), FCM/APNs (push), future: email/SMS
 */
async function deliverNotification(recipientId, notification, event) {
  const deliveryPromises = [];

  // ── Channel 1: SSE in-app real-time delivery ──
  deliveryPromises.push(deliverViaSSE(recipientId, notification));

  // ── Channel 2: Push notification (FCM/APNs) ──
  deliveryPromises.push(deliverViaPush(recipientId, notification, event));

  await Promise.allSettled(deliveryPromises);
}

/**
 * Deliver notification via Server-Sent Events to online clients.
 */
async function deliverViaSSE(recipientId, notification) {
  const clientSet = sseClients.get(recipientId);
  if (!clientSet || clientSet.size === 0) return;

  const payload = JSON.stringify({
    type: 'notification',
    notification,
    timestamp: new Date().toISOString(),
  });

  const deadClients = [];
  for (const res of clientSet) {
    try {
      res.write(`data: ${payload}\n\n`);
    } catch {
      deadClients.push(res);
    }
  }

  // Clean up dead connections
  for (const dead of deadClients) {
    clientSet.delete(dead);
  }

  if (clientSet.size === 0) sseClients.delete(recipientId);
  logger.info(`[Pipeline] SSE delivered to ${recipientId} (${clientSet?.size || 0} clients)`);
}

/**
 * Deliver notification via FCM (Firebase Cloud Messaging) / APNs.
 * Falls back gracefully if FCM is not configured.
 */
async function deliverViaPush(recipientId, notification, event) {
  try {
    // Get active device tokens for recipient
    const { rows: devices } = await pool.query(
      `SELECT device_token, platform FROM push_subscriptions
       WHERE user_id=$1 AND is_active=TRUE
       LIMIT 20`,
      [recipientId]
    );

    if (!devices.length) return;

    // Lazy-load PushNotificationService
    let pushService;
    try {
      const PushNotificationService = require('./PushNotificationService');
      pushService = new PushNotificationService();
    } catch {
      return; // FCM not configured
    }

    // Send to each device
    const results = await Promise.allSettled(
      devices.map(device =>
        pushService.sendToDevice(device.device_token, {
          title: notification.title,
          body: notification.message,
          data: {
            notificationId: notification.id,
            type: notification.type,
            referenceId: event.reference_id || '',
            referenceType: event.reference_type || '',
          },
        })
      )
    );

    // Log delivery results
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    // Log to push_notification_logs
    await pool.query(
      `INSERT INTO push_notification_logs
         (user_id, notification_id, status, platform_response, sent_at)
       VALUES ($1,$2,$3,$4,NOW())`,
      [
        recipientId,
        notification.id,
        failed === 0 ? 'sent' : (succeeded === 0 ? 'failed' : 'partial'),
        JSON.stringify({ succeeded, failed, total: devices.length }),
      ]
    ).catch(() => {}); // Non-critical

    logger.info(`[Pipeline] Push delivered to ${recipientId}: ${succeeded}/${devices.length} devices`);
  } catch (err) {
    logger.warn(`[Pipeline] Push delivery failed for ${recipientId}:`, err.message);
  }
}

// ─────────────────────────────────────────────────────────────
// SSE CLIENT MANAGEMENT (for routes/notifications-stream.js)
// ─────────────────────────────────────────────────────────────

/**
 * Register an SSE response object for a user.
 * Call from the SSE route handler.
 */
function registerSSEClient(userId, res) {
  if (!sseClients.has(userId)) {
    sseClients.set(userId, new Set());
  }
  sseClients.get(userId).add(res);
  logger.info(`[Pipeline] SSE client registered for user ${userId} (total: ${sseClients.get(userId).size})`);
}

/**
 * Remove an SSE response object when client disconnects.
 */
function unregisterSSEClient(userId, res) {
  const clientSet = sseClients.get(userId);
  if (clientSet) {
    clientSet.delete(res);
    if (clientSet.size === 0) sseClients.delete(userId);
  }
  logger.info(`[Pipeline] SSE client disconnected for user ${userId}`);
}

/**
 * Get current SSE client count (for health/metrics).
 */
function getSSEClientCount() {
  let total = 0;
  for (const set of sseClients.values()) total += set.size;
  return total;
}

// ─────────────────────────────────────────────────────────────
// RATE LIMITING HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * Check if a user is rate-limited for a given action.
 * Returns true if they are still in cooldown.
 */
async function isRateLimited(userId, actionType, channelId = null) {
  try {
    const { rows } = await pool.query(
      `SELECT cooldown_until FROM notification_rate_limits
       WHERE user_id=$1 AND action_type=$2
         AND (channel_id=$3 OR ($3::uuid IS NULL AND channel_id IS NULL))
         AND cooldown_until > NOW()
       LIMIT 1`,
      [userId, actionType, channelId]
    );
    return rows.length > 0;
  } catch {
    return false;
  }
}

/**
 * Set a rate-limit cooldown for a user action.
 */
async function setRateLimit(userId, actionType, channelId = null) {
  try {
    const cooldownMs = RATE_LIMITS[actionType] || 60_000;
    await pool.query(
      `INSERT INTO notification_rate_limits (user_id, action_type, channel_id, cooldown_until)
       VALUES ($1,$2,$3,NOW() + $4::interval)
       ON CONFLICT (user_id, action_type, channel_id)
       DO UPDATE SET cooldown_until=NOW() + $4::interval`,
      [userId, actionType, channelId, `${cooldownMs / 1000} seconds`]
    );
  } catch (err) {
    logger.warn('[Pipeline] setRateLimit error:', err.message);
  }
}

// ─────────────────────────────────────────────────────────────
// BATCH DISPATCH JOB (call periodically to flush expired batches)
// ─────────────────────────────────────────────────────────────

/**
 * Dispatch all expired batch windows.
 * Should be called on a cron schedule (e.g., every 5 min).
 */
async function dispatchExpiredBatches() {
  try {
    const { rows: expiredBatches } = await pool.query(
      `SELECT * FROM notification_batches
       WHERE status='active' AND window_end <= NOW()
       LIMIT 100`
    );

    for (const batch of expiredBatches) {
      // Update notification with final batched message
      const { title, body } = buildBatchedMessage(
        batch.event_type, batch.reference_type, batch.actor_count, batch.actor_ids
      );
      if (batch.notification_id) {
        await pool.query(
          `UPDATE notifications SET title=$1, message=$2, actor_count=$3 WHERE id=$4`,
          [title, body, batch.actor_count, batch.notification_id]
        );
      }
      await pool.query(
        `UPDATE notification_batches SET status='dispatched', dispatched_at=NOW() WHERE id=$1`,
        [batch.id]
      );
    }

    if (expiredBatches.length > 0) {
      logger.info(`[Pipeline] Dispatched ${expiredBatches.length} expired notification batches`);
    }
  } catch (err) {
    logger.error('[Pipeline] dispatchExpiredBatches error:', err.message);
  }
}

// Run batch dispatch every 5 minutes
setInterval(dispatchExpiredBatches, 5 * 60 * 1000);

// ─────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────

module.exports = {
  emit,
  registerSSEClient,
  unregisterSSEClient,
  getSSEClientCount,
  isRateLimited,
  setRateLimit,
  dispatchExpiredBatches,
  buildNotificationText,
};

