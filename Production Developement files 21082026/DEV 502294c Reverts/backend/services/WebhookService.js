/**
 * WebhookService
 * General webhook system for external integrations with retry logic and signature verification
 */

const crypto = require('crypto');
const axios = require('axios');
const pool = require('../database/connection');

class WebhookService {
  constructor() {
    this.maxRetries = 3;
    this.retryDelay = 5000; // 5 seconds
  }
  
  /**
   * Register webhook subscription
   */
  async registerWebhook(userId, url, events, secret) {
    try {
      const query = `
        INSERT INTO webhook_subscriptions (
          user_id, url, events, secret, is_active, created_at
        ) VALUES ($1, $2, $3, $4, true, NOW())
        RETURNING *
      `;
      
      const result = await pool.query(query, [
        userId,
        url,
        JSON.stringify(events),
        secret || this.generateSecret()
      ]);
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error registering webhook:', error);
      throw error;
    }
  }
  
  /**
   * Publish event to matching webhooks
   */
  async publishEvent(eventName, payload) {
    try {
      // Find active subscriptions for this event
      const query = `
        SELECT * FROM webhook_subscriptions
        WHERE is_active = true AND events @> $1::jsonb
      `;
      
      const result = await pool.query(query, [JSON.stringify([eventName])]);
      
      // Deliver to each subscriber
      const deliveries = [];
      for (const subscription of result.rows) {
        const delivery = await this.deliverWebhook(subscription, eventName, payload);
        deliveries.push(delivery);
      }
      
      return deliveries;
    } catch (error) {
      logger.error('Error publishing event:', error);
      throw error;
    }
  }
  
  /**
   * Deliver webhook to single subscriber
   */
  async deliverWebhook(subscription, eventName, payload, attempt = 1) {
    try {
      const eventId = await this.createWebhookEvent(eventName, payload);
      
      // Generate signature
      const signature = this.generateSignature(subscription.secret, payload);
      
      // Send POST request
      const response = await axios.post(subscription.url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Event': eventName,
          'X-Webhook-ID': eventId,
          'User-Agent': 'FingerMobile-Webhook/1.0'
        },
        timeout: 10000 // 10 second timeout
      });
      
      // Log successful delivery
      await this.logDelivery(eventId, subscription.id, 'delivered', response.status);
      
      return {
        success: true,
        eventId,
        status: response.status
      };
    } catch (error) {
      logger.error(`Webhook delivery failed (attempt ${attempt}):`, error.message);
      
      // Log failed delivery
      await this.logDelivery(
        null,
        subscription.id,
        'failed',
        null,
        error.message
      );
      
      // Retry if attempts remaining
      if (attempt < this.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
        return this.deliverWebhook(subscription, eventName, payload, attempt + 1);
      }
      
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Generate HMAC-SHA256 signature
   */
  generateSignature(secret, payload) {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(payload));
    return `sha256=${hmac.digest('hex')}`;
  }
  
  /**
   * Verify webhook signature
   */
  verifySignature(secret, payload, signature) {
    const expectedSignature = this.generateSignature(secret, payload);
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }
  
  /**
   * Generate random secret
   */
  generateSecret() {
    return crypto.randomBytes(32).toString('hex');
  }
  
  /**
   * Create webhook event record
   */
  async createWebhookEvent(eventName, payload) {
    const query = `
      INSERT INTO webhook_events (event_name, payload, created_at)
      VALUES ($1, $2, NOW())
      RETURNING id
    `;
    
    const result = await pool.query(query, [eventName, JSON.stringify(payload)]);
    
    return result.rows[0].id;
  }
  
  /**
   * Log webhook delivery
   */
  async logDelivery(eventId, subscriptionId, status, statusCode, errorMessage = null) {
    const query = `
      INSERT INTO webhook_deliveries (
        event_id, subscription_id, status, status_code, 
        error_message, delivered_at
      ) VALUES ($1, $2, $3, $4, $5, NOW())
    `;
    
    await pool.query(query, [eventId, subscriptionId, status, statusCode, errorMessage]);
  }
  
  /**
   * Get webhook delivery history
   */
  async getDeliveryHistory(subscriptionId, limit = 50) {
    const query = `
      SELECT wd.*, we.event_name
      FROM webhook_deliveries wd
      JOIN webhook_events we ON wd.event_id = we.id
      WHERE wd.subscription_id = $1
      ORDER BY wd.delivered_at DESC
      LIMIT $2
    `;
    
    const result = await pool.query(query, [subscriptionId, limit]);
    
    return result.rows;
  }
  
  /**
   * Deactivate webhook
   */
  async deactivateWebhook(subscriptionId) {
    const query = `
      UPDATE webhook_subscriptions
      SET is_active = false, deactivated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [subscriptionId]);
    
    return result.rows[0];
  }
}

module.exports = new WebhookService();
