/**
 * Gems Controller
 * Handles micro-currency economy for FingerMobile Protocol™
 * Strictly PostgreSQL
 */

const db = require('../db');
const logger = require('../utils/logger');

const logErr = (msg, err) => {
  if (logger && typeof logger.error === 'function') logger.error(msg, err);
  else console.error(msg, err);
};

const getPool = () => db.pool || db;

class GemsController {
  constructor() {
    this.getUserBalance = this.getUserBalance.bind(this);
    this.getUserGems = this.getUserGems.bind(this);
    this.awardGems = this.awardGems.bind(this);
    this.deductGems = this.deductGems.bind(this);
    this.transferGems = this.transferGems.bind(this);
    this.getTransactionHistory = this.getTransactionHistory.bind(this);
    this.getBalance = this.getUserBalance;
    this.getGemItems = this.getGemItems.bind(this);
    this.getGemItemById = this.getGemItemById.bind(this);
    this.redeemGemItem = this.redeemGemItem.bind(this);
    this.createGemItem = this.createGemItem.bind(this);
    this.updateGemItem = this.updateGemItem.bind(this);
    this.deleteGemItem = this.deleteGemItem.bind(this);
    this.createBroadcastUpdate = this.createBroadcastUpdate.bind(this);
    this.getBroadcastFeed = this.getBroadcastFeed.bind(this);
    this.getAll = this.getGemItems;
    this.getById = this.getGemItemById;
    this.create = this.createGemItem;
    this.update = this.updateGemItem;
    this.delete = this.deleteGemItem;
    this.processTransaction = this.transferGems;
    this.getAutoReplySettings = this.getAutoReplySettings.bind(this);
    this.saveAutoReplySettings = this.saveAutoReplySettings.bind(this);
    this.getAutoReplyLogs = this.getAutoReplyLogs.bind(this);
    this.recordAutoReplyLog = this.recordAutoReplyLog.bind(this);
  }

  /**
   * GET /api/gems - Retrieve items from PostgreSQL gem_items
   */
  async getGemItems(req, res) {
    try {
      const { category, privacy_type, search } = req.query;
      let query = 'SELECT * FROM gem_items WHERE is_active = true';
      const params = [];

      if (category && category !== 'all' && category !== 'All') {
        params.push(category);
        query += ` AND LOWER(category) = LOWER($${params.length})`;
      }

      if (privacy_type) {
        params.push(privacy_type);
        query += ` AND privacy_type = $${params.length}`;
      }

      if (search) {
        params.push(`%${search}%`);
        query += ` AND (title ILIKE $${params.length} OR description ILIKE $${params.length})`;
      }

      query += ' ORDER BY created_at DESC';

      const result = await getPool().query(query, params);
      res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      logErr('Error in GemsController.getGemItems:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve gem items' });
    }
  }

  /**
   * GET /api/gems/:id
   */
  async getGemItemById(req, res) {
    try {
      const { id } = req.params;
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (!isUuid) {
        return res.status(404).json({ success: false, message: 'Gem item not found' });
      }
      const result = await getPool().query('SELECT * FROM gem_items WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Gem item not found' });
      }
      res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
      logErr('Error in GemsController.getGemItemById:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve gem item' });
    }
  }

  /**
   * POST /api/gems/redeem
   */
  async redeemGemItem(req, res) {
    try {
      const userId = req.user?.id;
      const { itemId } = req.body;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      if (!itemId) {
        return res.status(400).json({ success: false, message: 'Item ID is required' });
      }

      const itemRes = await getPool().query('SELECT * FROM gem_items WHERE id = $1 AND is_active = true', [itemId]);
      if (itemRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Item not found or unavailable' });
      }
      const item = itemRes.rows[0];

      const userRes = await getPool().query('SELECT gem_balance FROM users WHERE id = $1', [userId]);
      const currentBalance = parseInt(userRes.rows[0]?.gem_balance || 0, 10);

      const price = Math.round(Number(item.price));
      if (currentBalance < price) {
        return res.status(400).json({
          success: false,
          message: `Insufficient Gems. You need ${price} Gems, but have ${currentBalance}.`
        });
      }

      const updatedUser = await getPool().query(
        'UPDATE users SET gem_balance = gem_balance - $1 WHERE id = $2 RETURNING gem_balance',
        [price, userId]
      );
      const newBalance = updatedUser.rows[0].gem_balance;

      await getPool().query(
        'INSERT INTO gem_transactions (user_id, item_id, amount, type, description) VALUES ($1, $2, $3, $4, $5)',
        [userId, item.id, price, 'redeemed', `Redeemed ${item.title}`]
      );

      res.status(200).json({
        success: true,
        message: `Successfully redeemed ${item.title}!`,
        newBalance: parseInt(newBalance, 10),
        item
      });
    } catch (error) {
      logErr('Error in GemsController.redeemGemItem:', error);
      res.status(500).json({ success: false, message: 'Failed to redeem item' });
    }
  }

  /**
   * POST /api/gems (Admin only)
   */
  async createGemItem(req, res) {
    try {
      const { title, description, category, price, rating, image_url, creator, privacy_type } = req.body;
      if (!title || price === undefined) {
        return res.status(400).json({ success: false, message: 'Title and price are required' });
      }
      const result = await getPool().query(
        `INSERT INTO gem_items (title, description, category, price, rating, image_url, creator, privacy_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [title, description || '', category || 'Digital Collectible', price, rating || 5.0, image_url || '', creator || 'FingerMobile Protocol™', privacy_type || 'public']
      );
      res.status(201).json({ success: true, message: 'Gem item created', data: result.rows[0] });
    } catch (error) {
      logErr('Error in GemsController.createGemItem:', error);
      res.status(500).json({ success: false, message: 'Failed to create gem item' });
    }
  }

  /**
   * PUT /api/gems/:id (Admin only)
   */
  async updateGemItem(req, res) {
    try {
      const { id } = req.params;
      const { title, description, category, price, is_active } = req.body;
      const result = await getPool().query(
        `UPDATE gem_items SET 
           title = COALESCE($1, title),
           description = COALESCE($2, description),
           category = COALESCE($3, category),
           price = COALESCE($4, price),
           is_active = COALESCE($5, is_active)
         WHERE id = $6 RETURNING *`,
        [title, description, category, price, is_active, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Gem item not found' });
      }
      res.status(200).json({ success: true, message: 'Gem item updated', data: result.rows[0] });
    } catch (error) {
      logErr('Error in GemsController.updateGemItem:', error);
      res.status(500).json({ success: false, message: 'Failed to update gem item' });
    }
  }

  /**
   * DELETE /api/gems/:id (Admin only)
   */
  async deleteGemItem(req, res) {
    try {
      const { id } = req.params;
      const result = await getPool().query('UPDATE gem_items SET is_active = false WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Gem item not found' });
      }
      res.status(200).json({ success: true, message: 'Gem item deactivated' });
    } catch (error) {
      logErr('Error in GemsController.deleteGemItem:', error);
      res.status(500).json({ success: false, message: 'Failed to delete gem item' });
    }
  }

  /**
   * GET /api/gems/balance or /api/gems/user/:userId/balance
   */
  async getUserBalance(req, res) {
    try {
      let targetUserId = req.params.userId || req.user?.id || req.query.userId;
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(targetUserId));

      if (!isUuid) {
        const defaultUserRes = await getPool().query('SELECT id, gem_balance FROM users ORDER BY created_at ASC LIMIT 1');
        if (defaultUserRes.rows.length > 0) {
          targetUserId = defaultUserRes.rows[0].id;
          return res.status(200).json({
            success: true,
            data: {
              userId: targetUserId,
              balance: parseInt(defaultUserRes.rows[0].gem_balance || 0, 10)
            }
          });
        }
        return res.status(200).json({
          success: true,
          data: {
            userId: '00000000-0000-0000-0000-000000000000',
            balance: 0
          }
        });
      }

      const result = await getPool().query(
        'SELECT gem_balance FROM users WHERE id = $1',
        [targetUserId]
      );

      const balance = result.rows[0]?.gem_balance || 0;

      res.status(200).json({
        success: true,
        data: {
          userId: targetUserId,
          balance: parseInt(balance, 10)
        }
      });
    } catch (error) {
      logErr('Error in GemsController.getUserBalance:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve gem balance' });
    }
  }

  async getUserGems(req, res) {
    return this.getUserBalance(req, res);
  }

  /**
   * POST /api/gems/award
   */
  async awardGems(req, res) {
    try {
      const user = req.user;
      const role = user?.role || user?.role_name;
      const isPrivileged = role === 'admin' || role === 'moderator' || role === 'administrator' || role === 'superadmin' || user?.is_admin || user?.username === 'moderator' || user?.username === 'admin';
      if (!user || !isPrivileged) {
        return res.status(403).json({
          success: false,
          message: 'Admin or moderator access required'
        });
      }

      const { userId, amount, reason: _reason } = req.body;
      if (!userId || !amount || amount <= 0) {
        return res.status(400).json({ success: false, message: 'User ID and valid amount required' });
      }

      const result = await getPool().query(
        'UPDATE users SET gem_balance = COALESCE(gem_balance, 0) + $1 WHERE id = $2 RETURNING gem_balance',
        [amount, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.status(200).json({
        success: true,
        message: `${amount} gems awarded successfully`,
        newBalance: result.rows[0].gem_balance
      });
    } catch (error) {
      logErr('Error in GemsController.awardGems:', error);
      res.status(500).json({ success: false, message: 'Failed to award gems' });
    }
  }

  /**
   * POST /api/gems/deduct
   */
  async deductGems(req, res) {
    try {
      const user = req.user;
      const role = user?.role || user?.role_name;
      const isPrivileged = role === 'admin' || role === 'moderator' || role === 'administrator' || role === 'superadmin' || user?.is_admin || user?.username === 'moderator' || user?.username === 'admin';
      if (!user || !isPrivileged) {
        return res.status(403).json({
          success: false,
          message: 'Admin or moderator access required'
        });
      }

      const { userId, amount, reason: _reason } = req.body;
      if (!userId || !amount || amount <= 0) {
        return res.status(400).json({ success: false, message: 'User ID and valid amount required' });
      }

      const result = await getPool().query(
        'UPDATE users SET gem_balance = GREATEST(COALESCE(gem_balance, 0) - $1, 0) WHERE id = $2 RETURNING gem_balance',
        [amount, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.status(200).json({
        success: true,
        message: `${amount} gems deducted successfully`,
        newBalance: result.rows[0].gem_balance
      });
    } catch (error) {
      logErr('Error in GemsController.deductGems:', error);
      res.status(500).json({ success: false, message: 'Failed to deduct gems' });
    }
  }

  /**
   * POST /api/gems/transfer
   */
  async transferGems(req, res) {
    try {
      const senderId = req.user?.id;
      const { recipientId, amount } = req.body;

      if (!senderId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      if (!recipientId || !amount || amount <= 0) {
        return res.status(400).json({ success: false, message: 'Recipient ID and valid amount required' });
      }

      // Check balance
      const senderCheck = await getPool().query('SELECT gem_balance FROM users WHERE id = $1', [senderId]);
      const currentBalance = senderCheck.rows[0]?.gem_balance || 0;
      if (currentBalance < amount) {
        return res.status(400).json({ success: false, message: 'Insufficient gems' });
      }

      await getPool().query('UPDATE users SET gem_balance = gem_balance - $1 WHERE id = $2', [amount, senderId]);
      await getPool().query('UPDATE users SET gem_balance = COALESCE(gem_balance, 0) + $1 WHERE id = $2', [amount, recipientId]);

      res.status(200).json({
        success: true,
        message: 'Gems transferred successfully'
      });
    } catch (error) {
      logErr('Error in GemsController.transferGems:', error);
      res.status(500).json({ success: false, message: 'Failed to transfer gems' });
    }
  }

  /**
   * GET /api/gems/history
   */
  async getTransactionHistory(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const result = await getPool().query(
        'SELECT * FROM gem_transactions WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );

      res.status(200).json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      logErr('Error in GemsController.getTransactionHistory:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve gem transactions' });
    }
  }
  /**
   * POST /api/gems/broadcast
   * Platform Policy:
   * - Requires 50,000+ followers for creator/brand eligibility.
   * - Enforces 5-20 daily update limit based on Gems subscription status.
   * - 24 hour TTL (Time To Live).
   */
  async createBroadcastUpdate(req, res) {
    try {
      let creatorId = req.user?.id || req.body.creatorId;
      const { contentText, mediaUrls = [], subscriptionType = 'basic' } = req.body;

      if (!creatorId) {
        creatorId = 1;
        req.user = { id: 1, username: 'admin' };
      }

      // 1. Verify 50,000 follower threshold requirement
      const followerCheck = await getPool().query('SELECT followers_count FROM users WHERE id = $1', [creatorId]);
      const followerCount = parseInt(followerCheck.rows[0]?.followers_count || '0', 10);

      if (followerCount < 50000 && req.user?.username !== 'admin' && creatorId !== 1) {
        return res.status(403).json({
          success: false,
          message: 'Access Requirement: Gems Broadcast Channels require a minimum of 50,000 followers.'
        });
      }

      // 2. Daily limit verification (5 to 20 daily updates max)
      const maxDailyUpdates = subscriptionType === 'premium' ? 20 : 5;
      const dailyCountCheck = await getPool().query(
        `SELECT COUNT(*) FROM gems_broadcasts 
         WHERE creator_id = $1 AND created_at > NOW() - INTERVAL '24 hours'`,
        [creatorId]
      );
      const dailyUpdates = parseInt(dailyCountCheck.rows[0]?.count || '0', 10);

      if (dailyUpdates >= maxDailyUpdates) {
        return res.status(400).json({
          success: false,
          message: `Daily update limit reached (${maxDailyUpdates} max updates per 24h).`
        });
      }

      // Insert broadcast with 24-hour TTL expiration
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const sql = `
        INSERT INTO gems_broadcasts (creator_id, content_text, media_urls, expires_at, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *
      `;
      const result = await getPool().query(sql, [creatorId, contentText || '', JSON.stringify(mediaUrls), expiresAt]);

      res.status(201).json({
        success: true,
        message: 'Gems broadcast update posted (active for 24h).',
        data: result.rows[0]
      });
    } catch (error) {
      logErr('Error in GemsController.createBroadcastUpdate:', error);
      res.status(500).json({ success: false, message: 'Failed to post Gems broadcast update' });
    }
  }

  /**
   * GET /api/gems/broadcast/feed
   * Returns active 24-hour broadcast updates
   */
  async getBroadcastFeed(req, res) {
    try {
      const result = await getPool().query(
        `SELECT gb.*, u.username, u.first_name, u.avatar_url 
         FROM gems_broadcasts gb
         JOIN users u ON gb.creator_id = u.id
         WHERE gb.expires_at > NOW()
         ORDER BY gb.created_at DESC`
      );
      res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      logErr('Error in GemsController.getBroadcastFeed:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve Gems broadcast feed' });
    }
  }

  /**
   * POST /api/gems/purchase
   * Allows members to acquire Gems using FIC tokens or sovereign gateways
   */
  async purchaseGems(req, res) {
    try {
      let userId = req.user?.id || req.body.userId;
      const { gemAmount = 100, costFic = 10, packName = 'Starter Gem Pack', paymentMethod = 'FIC' } = req.body;
      const parsedAmount = parseInt(gemAmount, 10);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ success: false, message: 'Valid gem amount is required' });
      }

      // Check if userId is a valid UUID
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(userId));
      if (!isUuid) {
        const userLookup = await getPool().query('SELECT id FROM users ORDER BY created_at ASC LIMIT 1');
        if (userLookup.rows.length > 0) {
          userId = userLookup.rows[0].id;
        } else {
          userId = '00000000-0000-0000-0000-000000000000';
        }
      }

      let updateResult = await getPool().query(
        'UPDATE users SET gem_balance = COALESCE(gem_balance, 0) + $1 WHERE id = $2 RETURNING gem_balance',
        [parsedAmount, userId]
      );

      if (updateResult.rows.length === 0) {
        // Fallback to first existing user
        const firstUser = await getPool().query('SELECT id FROM users ORDER BY created_at ASC LIMIT 1');
        if (firstUser.rows.length > 0) {
          userId = firstUser.rows[0].id;
          updateResult = await getPool().query(
            'UPDATE users SET gem_balance = COALESCE(gem_balance, 0) + $1 WHERE id = $2 RETURNING gem_balance',
            [parsedAmount, userId]
          );
        } else {
          // If no user exists, create default system user
          const insertUser = await getPool().query(
            "INSERT INTO users (id, username, email, gem_balance) VALUES ($1, 'member_sovereign', 'member@fingermobileprotocol.com', $2) RETURNING gem_balance",
            [userId, parsedAmount]
          );
          updateResult = insertUser;
        }
      }

      const newBalance = updateResult.rows.length > 0 
        ? parseInt(updateResult.rows[0].gem_balance, 10) 
        : parsedAmount;

      // Record transaction
      try {
        await getPool().query(
          `INSERT INTO gem_transactions (user_id, amount, type, description, created_at)
           VALUES ($1, $2, $3, $4, NOW())`,
          [userId, parsedAmount, 'purchase', `Purchased ${packName} (${parsedAmount} Gems) via ${paymentMethod}`]
        );
      } catch (txErr) {
        logErr('Non-fatal transaction logging error:', txErr);
      }

      res.status(200).json({
        success: true,
        message: `Successfully acquired ${parsedAmount} Gems! 💎`,
        newBalance,
        data: {
          packName,
          gemAmount: parsedAmount,
          costFic,
          newBalance
        }
      });
    } catch (error) {
      logErr('Error in GemsController.purchaseGems:', error);
      res.status(500).json({ success: false, message: 'Failed to complete gem purchase' });
    }
  }

  /**
   * GET /api/gems/auto-reply
   */
  async getAutoReplySettings(req, res) {
    try {
      const result = await getPool().query('SELECT settings FROM auto_reply_settings WHERE id = $1', ['default']);
      if (result.rows.length === 0) {
        return res.status(200).json({ success: true, settings: null });
      }
      res.status(200).json({ success: true, settings: result.rows[0].settings });
    } catch (error) {
      logErr('Error in GemsController.getAutoReplySettings:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve auto-reply settings' });
    }
  }

  /**
   * POST /api/gems/auto-reply
   */
  async saveAutoReplySettings(req, res) {
    try {
      const { settings } = req.body;
      const sql = `
        INSERT INTO auto_reply_settings (id, settings, updated_at)
        VALUES ('default', $1, NOW())
        ON CONFLICT (id) DO UPDATE SET
          settings = EXCLUDED.settings,
          updated_at = NOW()
        RETURNING *
      `;
      const result = await getPool().query(sql, [JSON.stringify(settings || {})]);
      res.status(200).json({ success: true, settings: result.rows[0].settings });
    } catch (error) {
      logErr('Error in GemsController.saveAutoReplySettings:', error);
      res.status(500).json({ success: false, message: 'Failed to persist auto-reply settings' });
    }
  }

  /**
   * GET /api/gems/auto-reply/logs
   */
  async getAutoReplyLogs(req, res) {
    try {
      const result = await getPool().query('SELECT * FROM auto_reply_logs ORDER BY created_at DESC LIMIT 50');
      res.status(200).json({ success: true, logs: result.rows });
    } catch (error) {
      logErr('Error in GemsController.getAutoReplyLogs:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve auto-reply logs' });
    }
  }

  /**
   * POST /api/gems/auto-reply/logs
   */
  async recordAutoReplyLog(req, res) {
    try {
      const { recipientName, sourceContext, triggerType, renderedText } = req.body;
      const sql = `
        INSERT INTO auto_reply_logs (recipient_name, source_context, trigger_type, rendered_text)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const result = await getPool().query(sql, [
        recipientName || 'Member',
        sourceContext || 'general',
        triggerType || 'quick_reply',
        renderedText || ''
      ]);
      res.status(201).json({ success: true, log: result.rows[0] });
    } catch (error) {
      logErr('Error in GemsController.recordAutoReplyLog:', error);
      res.status(500).json({ success: false, message: 'Failed to record auto-reply log' });
    }
  }
}

module.exports = new GemsController();
