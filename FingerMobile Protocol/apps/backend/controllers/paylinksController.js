/**
 * Paylinks Controller
 * FIC Paylinks and Direct Commerce Links Engine for FingerMobile Protocol™
 * Strictly PostgreSQL
 */

const db = require('../db');
const logger = require('../utils/logger');

const getPool = () => db.pool || db;

const logErr = (msg, err) => {
  if (logger && typeof logger.error === 'function') {
    logger.error(msg, err);
  }
};

class PaylinksController {
  constructor() {
    this.getPaylinks = this.getPaylinks.bind(this);
    this.createPaylink = this.createPaylink.bind(this);
    this.deletePaylink = this.deletePaylink.bind(this);
    this.sendGift = this.sendGift.bind(this);
    this.redeemPaylink = this.redeemPaylink.bind(this);
  }

  /**
   * GET /api/paylinks
   */
  async getPaylinks(req, res) {
    try {
      const result = await getPool().query(
        'SELECT * FROM fics_paylinks WHERE status = \'active\' ORDER BY created_at DESC'
      );

      const rows = (result.rows || []).map(r => ({
        id: String(r.id),
        title: r.title,
        description: r.description || '',
        amount: parseFloat(r.amount || 0),
        currency: r.currency || 'FIC',
        url: r.url || `https://fingermobileprotocol.com/paylink/${r.id}`,
        status: r.status,
        isRedeemable: r.is_redeemable,
        createdAt: r.created_at
      }));

      res.status(200).json({
        success: true,
        data: rows,
        paylinks: rows
      });
    } catch (error) {
      logErr('Error in PaylinksController.getPaylinks:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve paylinks', error: error.message });
    }
  }

  /**
   * POST /api/paylinks or /api/paylinks/create
   */
  async createPaylink(req, res) {
    try {
      const creatorId = req.user?.id || req.body.creator_id || 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e';
      const creatorName = req.user?.username || req.body.creator_name || 'Creator';
      const { title, description, amount, currency = 'FIC', expiryDays = 30 } = req.body;

      if (!title || amount === undefined) {
        return res.status(400).json({ success: false, message: 'Title and amount are required' });
      }

      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({ success: false, message: 'Valid positive amount required' });
      }

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + parseInt(expiryDays, 10));

      const sql = `
        INSERT INTO fics_paylinks (
          creator_id, creator_name, title, description, amount, 
          currency, status, is_redeemable, expiry_date, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, 'active', true, $7, NOW(), NOW())
        RETURNING *
      `;

      const result = await getPool().query(sql, [
        creatorId, creatorName, title, description || '', numAmount, currency, expiryDate
      ]);

      const newPaylink = result.rows[0];
      const linkUrl = `https://fingermobileprotocol.com/paylink/${newPaylink.id}`;

      // Update link URL in database
      await getPool().query('UPDATE fics_paylinks SET url = $1 WHERE id = $2', [linkUrl, newPaylink.id]);
      newPaylink.url = linkUrl;

      res.status(201).json({
        success: true,
        message: 'Paylink created successfully',
        data: {
          id: String(newPaylink.id),
          title: newPaylink.title,
          description: newPaylink.description,
          amount: parseFloat(newPaylink.amount),
          currency: newPaylink.currency,
          url: linkUrl,
          status: newPaylink.status
        },
        paylink: newPaylink
      });
    } catch (error) {
      logErr('Error in PaylinksController.createPaylink:', error);
      res.status(500).json({ success: false, message: 'Failed to create paylink', error: error.message });
    }
  }

  /**
   * DELETE /api/paylinks/:id
   */
  async deletePaylink(req, res) {
    try {
      const { id } = req.params;
      await getPool().query('UPDATE fics_paylinks SET status = \'cancelled\' WHERE id = $1', [id]);
      res.status(200).json({ success: true, message: 'Paylink deleted successfully' });
    } catch (error) {
      logErr('Error in PaylinksController.deletePaylink:', error);
      res.status(500).json({ success: false, message: 'Failed to delete paylink', error: error.message });
    }
  }

  /**
   * POST /api/paylinks/send-gift
   */
  async sendGift(req, res) {
    try {
      const senderId = req.user?.id || 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e';
      const { recipient_id, recipientId, amount, note, paylink_id, paylinkId } = req.body;

      const numAmount = parseFloat(amount || 0);
      if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({ success: false, message: 'Valid gift amount required' });
      }

      const targetPaylink = paylink_id || paylinkId;
      const targetRecipient = recipient_id || recipientId || 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e';

      // Log gift transaction in database
      await getPool().query(`
        INSERT INTO marketplace_transactions (
          type, platform, user_id, amount, currency, status, reference_id, metadata, created_at
        )
        VALUES ('gift', 'paylinks', $1, $2, 'FIC', 'completed', $3, $4::jsonb, NOW())
      `, [
        senderId,
        numAmount,
        targetPaylink ? String(targetPaylink) : null,
        JSON.stringify({ recipientId: targetRecipient, note: note || 'Community Gift' })
      ]);

      res.status(200).json({
        success: true,
        message: `Successfully sent ${numAmount} FIC gift!`,
        data: {
          amount: numAmount,
          currency: 'FIC',
          status: 'completed',
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logErr('Error in PaylinksController.sendGift:', error);
      res.status(500).json({ success: false, message: 'Failed to send gift', error: error.message });
    }
  }

  /**
   * POST /api/paylinks/redeem
   */
  async redeemPaylink(req, res) {
    try {
      const redeemerId = req.user?.id || 'd4e5f6a7-b8c9-4d5e-0f1a-2b3c4d5e6f7a';
      const { paylink_id, paylinkId } = req.body;
      const targetId = paylink_id || paylinkId;

      if (!targetId) {
        return res.status(400).json({ success: false, message: 'Paylink ID required' });
      }

      const result = await getPool().query(
        'SELECT * FROM fics_paylinks WHERE id = $1 AND status = \'active\' AND is_redeemable = true',
        [targetId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Paylink not found or already redeemed' });
      }

      const paylink = result.rows[0];

      // Mark redeemed
      await getPool().query(
        'UPDATE fics_paylinks SET is_redeemable = false, redeemed_by = $1, redeemed_at = NOW(), updated_at = NOW() WHERE id = $2',
        [redeemerId, targetId]
      );

      res.status(200).json({
        success: true,
        message: 'Paylink redeemed successfully',
        data: {
          amount: parseFloat(paylink.amount),
          currency: paylink.currency
        }
      });
    } catch (error) {
      logErr('Error in PaylinksController.redeemPaylink:', error);
      res.status(500).json({ success: false, message: 'Failed to redeem paylink', error: error.message });
    }
  }
}

module.exports = new PaylinksController();
