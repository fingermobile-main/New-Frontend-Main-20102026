const db = require('../database/connection');
const logger = require('../utils/logger');
const crypto = require('crypto');

class WebhookController {
  /**
   * POST /api/webhooks - Register webhook subscription
   */
  async registerWebhook(req, res) {
    try {
      const { url, events, secret, description } = req.body;
      const userId = req.user.id;

      // Validation
      if (!url || !events || !Array.isArray(events)) {
        return res.status(400).json({
          success: false, message: 'URL and events array are required'
        });
      }

      // Validate URL
      try {
        new URL(url);
      } catch (e) {
        return res.status(400).json({
          success: false, message: 'Invalid webhook URL'
        });
      }

      // Generate signing secret if not provided
      const webhookSecret = secret || crypto.randomBytes(32).toString('hex');

      const result = await db.query(
        `INSERT INTO webhook_subscriptions 
        (user_id, url, events, secret, description, is_active)
        VALUES ($1, $2, $3, $4, $5, true)
        RETURNING *`,
        [userId, url, JSON.stringify(events), webhookSecret, description]
      );

      res.status(201).json({
        success: true, message: 'Webhook registered successfully',
        data: {
          ...result.rows[0],
          secret: webhookSecret // Show only on creation
        }, warning: 'Store this secret securely. It will not be shown again.'
      });
    } catch (error) {
      logger.error('Error registering webhook:', error);
      res.status(500).json({
        success: false, message: 'Failed to register webhook',
        error: error.message
      });
    }
  }

  /**
   * GET /api/webhooks - List webhook subscriptions
   */
  async listWebhooks(req, res) {
    try {
      const userId = req.user.id;

      const result = await db.query(
        `SELECT id, url, events, description, is_active, created_at, updated_at
        FROM webhook_subscriptions
        WHERE user_id = $1
        ORDER BY created_at DESC`,
        [userId]
      );

      res.json({
        success: true, data: result.rows
      });
    } catch (error) {
      logger.error('Error listing webhooks:', error);
      res.status(500).json({
        success: false, message: 'Failed to list webhooks', error: error.message
      });
    }
  }

  /**
   * PUT /api/webhooks/:id - Update webhook subscription
   */
  async updateWebhook(req, res) {
    try {
      const { id } = req.params;
      const { url, events, description, is_active } = req.body;
      const userId = req.user.id;

      // Check ownership
      const existing = await db.query(
        'SELECT * FROM webhook_subscriptions WHERE id = $1 AND user_id = $2',
        [id, userId]
      );

      if (existing.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Webhook not found'
        });
      }

      // Build update query
      const updates = [];
      const values = [];
      let paramIndex = 1;

      if (url) {
        updates.push(`url = $${paramIndex}`);
        values.push(url);
        paramIndex++;
      }

      if (events) {
        updates.push(`events = $${paramIndex}`);
        values.push(JSON.stringify(events));
        paramIndex++;
      }

      if (description !== undefined) {
        updates.push(`description = $${paramIndex}`);
        values.push(description);
        paramIndex++;
      }

      if (is_active !== undefined) {
        updates.push(`is_active = $${paramIndex}`);
        values.push(is_active);
        paramIndex++;
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false, message: 'No fields to update'
        });
      }

      updates.push(`updated_at = NOW()`);
      values.push(id);

      const query = `UPDATE webhook_subscriptions SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

      const result = await db.query(query, values);

      res.json({
        success: true, message: 'Webhook updated successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error updating webhook:', error);
      res.status(500).json({
        success: false, message: 'Failed to update webhook', error: error.message
      });
    }
  }

  /**
   * DELETE /api/webhooks/:id - Delete webhook subscription
   */
  async deleteWebhook(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await db.query(
        'DELETE FROM webhook_subscriptions WHERE id = $1 AND user_id = $2 RETURNING *',
        [id, userId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false, message: 'Webhook not found'
        });
      }

      res.json({
        success: true, message: 'Webhook deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting webhook:', error);
      res.status(500).json({
        success: false, message: 'Failed to delete webhook', error: error.message
      });
    }
  }

  /**
   * GET /api/webhooks/:id/deliveries - Get webhook delivery history
   */
  async getDeliveries(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { limit = 50, page = 1 } = req.query;

      // Verify ownership
      const webhook = await db.query(
        'SELECT * FROM webhook_subscriptions WHERE id = $1 AND user_id = $2',
        [id, userId]
      );

      if (webhook.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Webhook not found'
        });
      }

      const offset = (page - 1) * limit;

      const result = await db.query(
        `SELECT * FROM webhook_deliveries
        WHERE webhook_subscription_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3` [id, parseInt(limit), offset]
      );

      const countResult = await db.query(
        'SELECT COUNT(*) FROM webhook_deliveries WHERE webhook_subscription_id = $1',
        [id]
      );

      const total = parseInt(countResult.rows[0].count);

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total, totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      logger.error('Error getting webhook deliveries:', error);
      res.status(500).json({
        success: false, message: 'Failed to get webhook deliveries', error: error.message
      });
    }
  }

  /**
   * POST /api/webhooks/:id/test - Test webhook delivery
   */
  async testWebhook(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Verify ownership
      const webhook = await db.query(
        'SELECT * FROM webhook_subscriptions WHERE id = $1 AND user_id = $2',
        [id, userId]
      );

      if (webhook.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Webhook not found'
        });
      }

      const webhookData = webhook.rows[0];

      // Create test payload
      const testPayload = {
        event: 'webhook.test',
        timestamp: new Date().toISOString(), data: {
          message: 'This is a test webhook delivery'
        }
      };

      // Simulate delivery (in production, actually send HTTP request)
      const deliveryId = await this.deliverWebhook(webhookData, testPayload);

      res.json({
        success: true, message: 'Test webhook sent',
        data: {
          deliveryId, payload: testPayload
        }
      });
    } catch (error) {
      logger.error('Error testing webhook:', error);
      res.status(500).json({
        success: false, message: 'Failed to test webhook', error: error.message
      });
    }
  }

  /**
   * Deliver webhook payload (internal method)
   */
  async deliverWebhook(webhook, payload) {
    try {
      // In production, use fetch/axios to send POST request to webhook URL
      // Include signature header for security
      
      const signature = this.generateSignature(webhook.secret, payload);

      /* Production implementation:
      const response = await fetch(webhook.url, {
        method: 'POST', headers: {
          'Content-Type': 'application/json' 'X-Webhook-Signature': signature
        } body: JSON.stringify(payload)
      });

      const statusCode = response.status;
      const responseBody = await response.text();
      */

      // Simulated delivery
      const statusCode = 200;
      const responseBody = 'OK';
      const deliveryTime = Date.now();

      // Log delivery
      const result = await db.query(
        `INSERT INTO webhook_deliveries 
        (webhook_subscription_id, event_type, payload, status_code, response_body, delivery_time_ms, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING id` [webhook.id, payload.event, JSON.stringify(payload), statusCode, responseBody, deliveryTime]
      );

      return result.rows[0].id;
    } catch (error) {
      logger.error('Error delivering webhook:', error);

      // Log failed delivery
      await db.query(
        `INSERT INTO webhook_deliveries 
        (webhook_subscription_id, event_type, payload, status_code, response_body, error_message, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())` [webhook.id, payload.event, JSON.stringify(payload), 500, null, error.message]
      );

      throw error;
    }
  }

  /**
   * Generate HMAC signature for webhook payload
   */
  generateSignature(secret, payload) {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(payload));
    return hmac.digest('hex');
  }
}

module.exports = new WebhookController();
