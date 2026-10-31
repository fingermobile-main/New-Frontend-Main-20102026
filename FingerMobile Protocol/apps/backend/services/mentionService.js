const { pool } = require('../db');
const logger = require('../utils/logger');

// In-memory cooldown tracker for global mention rate-limiting (15 minutes)
const globalMentionCooldowns = new Map();
const COOLDOWN_DURATION_MS = 15 * 60 * 1000;

class MentionService {
  /**
   * System keywords designated for mass notifications
   */
  static GLOBAL_MENTION_KEYWORDS = ['all', 'everyone', 'members', 'channel'];

  /**
   * Roles permitted to initiate mass group mentions
   */
  static PRIVILEGED_ROLES = ['admin', 'moderator', 'owner', 'founder', 'cfo', 'superadmin'];

  /**
   * Extract mentions from text content
   * @param {string} text
   * @returns {{ globalMentions: string[], userMentions: string[] }}
   */
  extractMentions(text) {
    if (!text || typeof text !== 'string') return { globalMentions: [], userMentions: [] };

    const matches = text.match(/@([a-zA-Z0-9_]+)/g);
    if (!matches) return { globalMentions: [], userMentions: [] };

    const globalMentions = [];
    const userMentions = [];

    for (const match of matches) {
      const handle = match.replace(/^@/, '').toLowerCase().trim();
      if (MentionService.GLOBAL_MENTION_KEYWORDS.includes(handle)) {
        if (!globalMentions.includes(handle)) globalMentions.push(handle);
      } else {
        if (!userMentions.includes(handle)) userMentions.push(handle);
      }
    }

    return { globalMentions, userMentions };
  }

  /**
   * Permission gate check: ensures user has rights to trigger @everyone / @all
   * @param {string} userRole
   * @returns {boolean}
   */
  canTriggerGlobalMention(userRole) {
    if (!userRole) return false;
    return MentionService.PRIVILEGED_ROLES.includes(userRole.toLowerCase().trim());
  }

  /**
   * Rate limit check: enforces 15-minute cooldown for mass pings
   * @param {string} userId
   * @returns {{ allowed: boolean, remainingMs: number }}
   */
  checkRateLimit(userId) {
    if (!userId) return { allowed: true, remainingMs: 0 };
    const lastTrigger = globalMentionCooldowns.get(userId);
    const now = Date.now();

    if (lastTrigger && now - lastTrigger < COOLDOWN_DURATION_MS) {
      return { allowed: false, remainingMs: COOLDOWN_DURATION_MS - (now - lastTrigger) };
    }

    return { allowed: true, remainingMs: 0 };
  }

  /**
   * Ingestion pipeline: processes mentions in post or message
   * @param {Object} params
   * @param {string} params.senderId
   * @param {string} params.senderName
   * @param {string} params.senderRole
   * @param {string} params.channelId
   * @param {string} params.messageId
   * @param {string} params.content
   * @param {string} [params.module='forum']
   */
  async processMentions({
    senderId,
    senderName,
    senderRole = 'user',
    channelId,
    messageId,
    content,
    module = 'forum'
  }) {
    const { globalMentions, userMentions } = this.extractMentions(content);
    if (!globalMentions.length && !userMentions.length) {
      return { processed: false, reason: 'no_mentions' };
    }

    const result = {
      processed: true,
      globalMentions: [],
      userMentions: [],
      fannedOutCount: 0
    };

    // 1. Process Global Mentions (@all, @everyone, @members)
    if (globalMentions.length > 0) {
      const isPermitted = this.canTriggerGlobalMention(senderRole);
      const rateLimit = this.checkRateLimit(senderId);

      if (!isPermitted) {
        logger.warn(`[MentionService] Unauthorized mass mention attempt by ${senderId} (Role: ${senderRole})`);
        result.globalMentions.push({
          type: globalMentions[0],
          status: 'rejected_unauthorized'
        });
      } else if (!rateLimit.allowed) {
        const minsLeft = Math.ceil(rateLimit.remainingMs / 60000);
        logger.warn(`[MentionService] Rate limit exceeded for mass mention by ${senderId} (${minsLeft}m left)`);
        result.globalMentions.push({
          type: globalMentions[0],
          status: 'rate_limited',
          cooldownRemainingMs: rateLimit.remainingMs
        });
      } else {
        // Record timestamp for rate-limit cooldown
        globalMentionCooldowns.set(senderId, Date.now());

        // Step A: Record single O(1) channel_mentions row (Hybrid Pull Storage)
        await pool.query(`
          INSERT INTO channel_mentions (channel_id, message_id, sender_id, mention_type, created_at)
          VALUES ($1, $2, $3, $4, NOW())
        `, [channelId, messageId, senderId, globalMentions[0]]).catch(err => {
          logger.error('[MentionService] Error writing channel_mentions:', err);
        });

        // Step B: Asynchronous Fan-Out to active channel members in batches
        const fanOutCount = await this.fanOutChannelMentions({
          channelId,
          messageId,
          senderId,
          senderName,
          mentionType: globalMentions[0],
          content,
          module
        });

        result.fannedOutCount += fanOutCount;
        result.globalMentions.push({
          type: globalMentions[0],
          status: 'delivered',
          recipientsCount: fanOutCount
        });
      }
    }

    // 2. Process Direct User Mentions (@username)
    for (const handle of userMentions) {
      try {
        // Resolve handle to user
        const userRes = await pool.query(`
          SELECT id, username, display_name FROM users
          WHERE LOWER(username) = $1 LIMIT 1
        `, [handle]);

        if (userRes.rows.length > 0) {
          const targetUser = userRes.rows[0];

          // Record in channel_mentions
          await pool.query(`
            INSERT INTO channel_mentions (channel_id, message_id, sender_id, mention_type, target_user_id, created_at)
            VALUES ($1, $2, $3, 'user', $4, NOW())
          `, [channelId, messageId, senderId, targetUser.id]).catch(() => {});

          // Insert into notifications
          await pool.query(`
            INSERT INTO notifications (user_id, recipient_id, sender_id, type, title, message, reference_id, is_read, created_at)
            VALUES ($1, $1, $2, 'mention', $3, $4, $5, FALSE, NOW())
          `, [
            targetUser.id,
            senderId,
            `Mentioned by ${senderName || 'a member'}`,
            content.slice(0, 200),
            messageId
          ]).catch(() => {});

          // Record in sovereign_module_interactions for analytics
          await pool.query(`
            INSERT INTO sovereign_module_interactions (
              module, interaction_type, item_id, item_title, actor_id, actor_name, actor_handle,
              recipient_id, content, responded, created_at
            ) VALUES ($1, 'mention', $2, 'Post Mention', $3, $4, $5, $6, $7, FALSE, NOW())
          `, [
            module,
            messageId,
            senderId,
            senderName || 'Member',
            `@${senderName || 'member'}`,
            targetUser.id,
            content
          ]).catch(() => {});

          result.userMentions.push({ handle, userId: targetUser.id, status: 'notified' });
        } else {
          result.userMentions.push({ handle, status: 'user_not_found' });
        }
      } catch (err) {
        logger.error(`[MentionService] Error processing direct mention for @${handle}:`, err);
      }
    }

    return result;
  }

  /**
   * Scalable Keyspace Chunking & Asynchronous Fan-Out
   * Chunks active channel members into batches of 500 to prevent event loop starvation
   */
  async fanOutChannelMentions({ channelId, messageId, senderId, senderName, mentionType, content, module }) {
    let totalNotified = 0;
    const CHUNK_SIZE = 500;
    let lastSeenId = '00000000-0000-0000-0000-000000000000';
    let hasMore = true;

    try {
      while (hasMore) {
        // Keyset pagination avoids costly OFFSET scans over millions of rows
        const query = `
          SELECT cm.user_id, cm.id as member_row_id
          FROM channel_members cm
          WHERE cm.channel_id = $1
            AND cm.notifications_muted = FALSE
            AND cm.user_id <> $2
            AND cm.id > $3
          ORDER BY cm.id ASC
          LIMIT $4;
        `;

        const res = await pool.query(query, [channelId, senderId, lastSeenId, CHUNK_SIZE]);
        if (!res.rows.length) {
          hasMore = false;
          break;
        }

        const userIds = res.rows.map(r => r.user_id);
        lastSeenId = res.rows[res.rows.length - 1].member_row_id;

        // Perform batch notification insert using unnest or parameterized values
        if (userIds.length > 0) {
          const title = `@${mentionType} announcement by ${senderName || 'Channel Admin'}`;
          const snippet = content.length > 150 ? content.slice(0, 150) + '...' : content;

          await pool.query(`
            INSERT INTO notifications (user_id, recipient_id, sender_id, type, title, message, reference_id, is_read, created_at)
            SELECT u_id, u_id, $1, 'channel_mention', $2, $3, $4, FALSE, NOW()
            FROM UNNEST($5::uuid[]) AS u_id
          `, [senderId, title, snippet, messageId, userIds]).catch(err => {
            logger.error('[MentionService] Batch insert notifications failed:', err);
          });

          totalNotified += userIds.length;
        }

        if (res.rows.length < CHUNK_SIZE) {
          hasMore = false;
        }
      }
    } catch (err) {
      logger.error('[MentionService] Error in fanOutChannelMentions:', err);
    }

    logger.info(`[MentionService] Fanned out @${mentionType} to ${totalNotified} channel members in channel ${channelId}`);
    return totalNotified;
  }
}

module.exports = new MentionService();
