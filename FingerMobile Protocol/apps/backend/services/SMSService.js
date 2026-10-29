const logger = require('../utils/logger');
const phoneIntelligenceService = require('./PhoneIntelligenceService');
/**
 * SMSService
 * Twilio integration for SMS notifications and verification
 */

const twilio = require('twilio');
const pool = require('../database/connection');

class SMSService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
  }

  /**
   * Generate alphanumeric verification code
   */
  generateVerificationCode(length = 6) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Send verification SMS
   */
  async sendVerificationSMS(to, code, purpose = 'registration') {
    const message = `Your FingerMobile verification code is: ${code}. Valid for 10 minutes.`;
    try {
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
        return await this.sendSMS(to, message);
      }
      logger.info(`[DEV SMS] To: ${to} | Purpose: ${purpose} | Code: ${code}`);
      return { success: true, simulated: true, code };
    } catch (e) {
      logger.warn(`Failed to send SMS to ${to}, simulated in dev: ${e.message}`);
      return { success: true, simulated: true, code };
    }
  }

  /**
   * Send SMS message
   */
  async sendSMS(to, body, options = {}) {
    try {
      // Validate phone number format
      const formattedTo = this.formatPhoneNumber(to);

      const message = await this.client.messages.create({
        body,
        from: this.fromNumber,
        to: formattedTo,
        ...options
      });

      // Log SMS sent
      await this.logSMSSent(formattedTo, body, 'sent', message.sid);

      return {
        success: true,
        messageId: message.sid,
        status: message.status
      };
    } catch (error) {
      logger.error('Error in SMSService.sendSMS:', error);
      await this.logSMSSent(to, body, 'failed', null, error.message);
      throw error;
    }
  }

  /**
   * Send verification code
   */
  async sendVerificationCode(phoneNumber) {
    try {
      // Generate 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      const message = `Your FingerMobile verification code is: ${code}. This code expires in 10 minutes.`;

      const result = await this.sendSMS(phoneNumber, message);

      // Store verification code in database
      await this.storeVerificationCode(phoneNumber, code);

      return {
        success: true,
        messageId: result.messageId,
        codeExpiry: 600 // 10 minutes in seconds
      };
    } catch (error) {
      logger.error('Error in SMSService.sendVerificationCode:', error);
      throw error;
    }
  }

  /**
   * Verify code
   */
  async verifyCode(phoneNumber, code) {
    try {
      const query = `
        SELECT * FROM sms_verifications
        WHERE phone_number = $1 AND code = $2
          AND expires_at > NOW()
          AND verified = false
        ORDER BY created_at DESC
        LIMIT 1
      `;

      const result = await pool.query(query, [phoneNumber, code]);

      if (result.rows.length === 0) {
        return { valid: false, reason: 'invalid_or_expired_code' };
      }

      // Mark as verified
      await pool.query(
        'UPDATE sms_verifications SET verified = true, verified_at = NOW() WHERE id = $1',
        [result.rows[0].id]
      );

      return { valid: true };
    } catch (error) {
      logger.error('Error in SMSService.verifyCode:', error);
      throw error;
    }
  }

  /**
   * Send transactional SMS (order confirmation, payment alert, etc.)
   */
  async sendTransactionalSMS(phoneNumber, templateName, data) {
    const templates = {
      order_confirmation: `Your order #${data.orderId} has been confirmed. Total: ${data.currency} ${data.amount}. Track: ${data.trackingUrl}`,
      payment_received: `Payment of ${data.currency} ${data.amount} received. Transaction ID: ${data.transactionId}`,
      appointment_reminder: `Reminder: Your appointment is scheduled for ${data.date} at ${data.time}. Location: ${data.location}`,
      delivery_update: `Your package is ${data.status}. Expected delivery: ${data.expectedDate}`,
      account_alert: `Security alert: ${data.message}. If this wasn't you, contact support immediately.`
    };

    const body = templates[templateName];

    if (!body) {
      throw new Error(`SMS template not found: ${templateName}`);
    }

    return this.sendSMS(phoneNumber, body);
  }

  /**
   * Send marketing SMS (with opt-out)
   */
  async sendMarketingSMS(phoneNumber, message, campaignId) {
    const fullMessage = `${message}\n\nReply STOP to opt out. Msg&data rates may apply.`;

    const result = await this.sendSMS(phoneNumber, fullMessage);

    // Log marketing campaign
    await pool.query(
      `INSERT INTO sms_campaigns (campaign_id, phone_number, message, status, sent_at)
       VALUES ($1, $2, $3, 'sent', NOW())`,
      [campaignId, phoneNumber, message]
    );

    return result;
  }

  /**
   * Send bulk SMS
   */
  async sendBulkSMS(recipients, message, options = {}) {
    const results = [];

    for (const recipient of recipients) {
      try {
        const result = await this.sendSMS(recipient, message, options);

        results.push({
          to: recipient,
          success: true,
          messageId: result.messageId
        });

        // Rate limiting - Twilio allows 1 msg/sec for trial accounts
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        results.push({
          to: recipient,
          success: false,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Check delivery status
   */
  async checkDeliveryStatus(messageId) {
    try {
      const message = await this.client.messages(messageId).fetch();

      return {
        status: message.status,
        errorCode: message.errorCode,
        errorMessage: message.errorMessage
      };
    } catch (error) {
      logger.error('Error checking delivery status:', error);
      throw error;
    }
  }

  /**
   * Format phone number to E.164 format using PhoneIntelligenceService
   */
  formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return '';
    const intel = phoneIntelligenceService.analyzeFast(phoneNumber, 'NG');
    if (intel && intel.isValid && intel.e164) {
      return intel.e164;
    }

    // Fallback normalization
    let cleaned = phoneNumber.replace(/[^\d+]/g, '');
    if (!cleaned.startsWith('+')) {
      if (cleaned.startsWith('0')) {
        cleaned = '+234' + cleaned.substring(1);
      } else if (cleaned.startsWith('234')) {
        cleaned = '+' + cleaned;
      } else {
        cleaned = '+234' + cleaned;
      }
    }
    return cleaned;
  }

  /**
   * Store verification code
   */
  async storeVerificationCode(phoneNumber, code) {
    const query = `
      INSERT INTO sms_verifications (phone_number, code, expires_at, created_at)
      VALUES ($1, $2, NOW() + INTERVAL '10 minutes', NOW())
      RETURNING *
    `;

    await pool.query(query, [phoneNumber, code]);
  }

  /**
   * Log SMS sent
   */
  async logSMSSent(to, body, status, messageId, error = null) {
    try {
      const query = `
        INSERT INTO sms_logs (
          phone_number, message_body, status, 
          message_id, error_message, sent_at
        ) VALUES ($1, $2, $3, $4, $5, NOW())
      `;

      await pool.query(query, [to, body, status, messageId, error]);
    } catch (logError) {
      logger.error('Error logging SMS:', logError);
    }
  }

  /**
   * Get SMS statistics
   */
  async getSMSStats(startDate, endDate) {
    const query = `
      SELECT 
        COUNT(*) as total_sent,
        COUNT(CASE WHEN status = 'sent' THEN 1 END) as successful,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered
      FROM sms_logs
      WHERE sent_at BETWEEN $1 AND $2
    `;

    const result = await pool.query(query, [startDate, endDate]);

    return result.rows[0];
  }

  /**
   * Handle incoming SMS (webhook)
   */
  async handleIncomingSMS(from, body) {
    try {
      // Check for opt-out keywords
      const lowerBody = body.toLowerCase().trim();

      if (['stop', 'unsubscribe', 'opt-out', 'cancel'].includes(lowerBody)) {
        await this.handleOptOut(from);
        return { action: 'opt_out_processed' };
      }

      // Check for help keyword
      if (['help', 'info', 'support'].includes(lowerBody)) {
        await this.sendSMS(from, 'For support, visit: https://fingermobileprotocol.com/support or email support@fingermobileprotocol.com');
        return { action: 'help_response_sent' };
      }

      // Log incoming message
      await pool.query(
        `INSERT INTO sms_incoming (phone_number, message_body, received_at)
         VALUES ($1, $2, NOW())`,
        [from, body]
      );

      return { action: 'message_logged' };
    } catch (error) {
      logger.error('Error handling incoming SMS:', error);
      throw error;
    }
  }

  /**
   * Handle opt-out request
   */
  async handleOptOut(phoneNumber) {
    await pool.query(
      `INSERT INTO sms_opt_outs (phone_number, opted_out_at, reason)
       VALUES ($1, NOW(), 'user_request')
       ON CONFLICT (phone_number) DO UPDATE SET opted_out_at = NOW()`,
      [phoneNumber]
    );
  }

  /**
   * Check if number is opted out
   */
  async isOptedOut(phoneNumber) {
    const query = 'SELECT COUNT(*) as count FROM sms_opt_outs WHERE phone_number = $1';
    const result = await pool.query(query, [phoneNumber]);

    return result.rows[0].count > 0;
  }
}

module.exports = new SMSService();
