/**
 * @typedef {Object} EmailService
 * @description SendGrid integration for transactional and marketing emails
 */

const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const pool = require('../database/connection');
const logger = require('../utils/logger');

// Initialize SendGrid only if API key is available
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('SendGrid API key not configured - email service will be disabled');
}

class EmailService {
  constructor() {
    this.templatesDir = path.join(__dirname, '../email-templates');
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@fingermobile.com';
    this.fromName = process.env.EMAIL_FROM_NAME || 'FingerMobile Protocol';
  }
  
  /**
   * Send transactional email
   */
  async sendTransactionalEmail(to, subject, templateName, data) {
    try {
      const html = await this.renderTemplate(templateName, data);
      const text = this.stripHtml(html);
      
      const msg = {
        to,
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject,
        html,
        text,
        tracking_settings: {
          click_tracking: { enable: true },
          open_tracking: { enable: true }
        }
      };
      
      const result = await sgMail.send(msg);
      
      // Log email sent
      await this.logEmailSent(to, subject, templateName, 'transactional', result[0].statusCode === 202);
      
      return {
        success: true,
        messageId: result[0].headers['x-message-id']
      };
    } catch (error) {
      logger.error('Error in EmailService.sendTransactionalEmail:', error);
      await this.logEmailSent(to, subject, templateName, 'transactional', false, error.message);
      throw error;
    }
  }
  
  /**
   * Send welcome email
   */
  async sendWelcomeEmail(userEmail, userName) {
    return this.sendTransactionalEmail(
      userEmail,
      'Welcome to FingerMobile Protocol!',
      'welcome',
      {
        userName,
        loginUrl: `${process.env.FRONTEND_URL}/login`,
        supportUrl: `${process.env.FRONTEND_URL}/support`
      }
    );
  }
  
  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(userEmail, userName, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    return this.sendTransactionalEmail(
      userEmail,
      'Password Reset Request',
      'password-reset',
      {
        userName,
        resetUrl,
        expiryHours: 24
      }
    );
  }
  
  /**
   * Send email verification
   */
  async sendVerificationEmail(userEmail, userName, verificationToken) {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    return this.sendTransactionalEmail(
      userEmail,
      'Verify Your Email Address',
      'email-verification',
      {
        userName,
        verifyUrl
      }
    );
  }
  
  /**
   * Send payment confirmation
   */
  async sendPaymentConfirmation(userEmail, userName, amount, currency, transactionId) {
    return this.sendTransactionalEmail(
      userEmail,
      `Payment Confirmation - ${currency} ${amount}`,
      'payment-confirmation',
      {
        userName,
        amount,
        currency,
        transactionId,
        date: new Date().toLocaleDateString(),
        receiptUrl: `${process.env.FRONTEND_URL}/payments/receipt/${transactionId}`
      }
    );
  }
  
  /**
   * Send subscription notification
   */
  async sendSubscriptionNotification(userEmail, userName, tier, amount, nextBillingDate) {
    return this.sendTransactionalEmail(
      userEmail,
      `Subscription Confirmed - ${tier}`,
      'subscription-confirmation',
      {
        userName,
        tier,
        amount,
        nextBillingDate: new Date(nextBillingDate).toLocaleDateString(),
        manageUrl: `${process.env.FRONTEND_URL}/settings/subscription`
      }
    );
  }
  
  /**
   * Send notification alert
   */
  async sendNotificationAlert(userEmail, userName, notificationTitle, notificationBody) {
    return this.sendTransactionalEmail(
      userEmail,
      notificationTitle,
      'notification-alert',
      {
        userName,
        notificationTitle,
        notificationBody,
        viewUrl: `${process.env.FRONTEND_URL}/notifications`
      }
    );
  }
  
  /**
   * Send marketing email (with unsubscribe link)
   */
  async sendMarketingEmail(to, subject, templateName, data, unsubscribeToken) {
    try {
      const html = await this.renderTemplate(templateName, {
        ...data,
        unsubscribeUrl: `${process.env.FRONTEND_URL}/unsubscribe?token=${unsubscribeToken}`
      });
      
      const text = this.stripHtml(html);
      
      const msg = {
        to,
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject,
        html,
        text,
        asm: {
          group_id: parseInt(process.env.SENDGRID_MARKETING_GROUP_ID) || 12345
        },
        tracking_settings: {
          click_tracking: { enable: true },
          open_tracking: { enable: true },
          subscription_tracking: {
            enable: true,
            substitution_tag: '[unsubscribe]'
          }
        }
      };
      
      const result = await sgMail.send(msg);
      
      await this.logEmailSent(to, subject, templateName, 'marketing', result[0].statusCode === 202);
      
      return {
        success: true,
        messageId: result[0].headers['x-message-id']
      };
    } catch (error) {
      logger.error('Error in EmailService.sendMarketingEmail:', error);
      await this.logEmailSent(to, subject, templateName, 'marketing', false, error.message);
      throw error;
    }
  }
  
  /**
   * Send bulk emails (batch processing)
   */
  async sendBulkEmails(emails) {
    const results = [];
    
    for (const email of emails) {
      try {
        const result = await this.sendTransactionalEmail(
          email.to,
          email.subject,
          email.template,
          email.data
        );
        
        results.push({
          to: email.to,
          success: true,
          messageId: result.messageId
        });
        
        // Rate limiting - small delay between emails
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        results.push({
          to: email.to,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }
  
  /**
   * Render email template with Handlebars
   */
  async renderTemplate(templateName, data) {
    const templatePath = path.join(this.templatesDir, `${templateName}.html`);
    
    // Check if template exists
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Email template not found: ${templateName}`);
    }
    
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateSource);
    
    return template({
      ...data,
      year: new Date().getFullYear(),
      companyName: this.fromName,
      supportEmail: process.env.EMAIL_SUPPORT || 'support@fingermobile.com'
    });
  }
  
  /**
   * Strip HTML tags for text version
   */
  stripHtml(html) {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  /**
   * Log email sent to database
   */
  async logEmailSent(to, subject, template, type, success, error = null) {
    try {
      const query = `
        INSERT INTO email_logs (
          recipient, subject, template_name, email_type, 
          status, error_message, sent_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `;
      
      await pool.query(query, [
        to,
        subject,
        template,
        type,
        success ? 'sent' : 'failed',
        error
      ]);
    } catch (logError) {
      logger.error('Error logging email:', logError);
    }
  }
  
  /**
   * Get email statistics
   */
  async getEmailStats(startDate, endDate) {
    const query = `
      SELECT 
        COUNT(*) as total_sent,
        COUNT(CASE WHEN status = 'sent' THEN 1 END) as successful,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
        email_type,
        template_name
      FROM email_logs
      WHERE sent_at BETWEEN $1 AND $2
      GROUP BY email_type, template_name
      ORDER BY total_sent DESC
    `;
    
    const result = await pool.query(query, [startDate, endDate]);
    
    return result.rows;
  }
  
  /**
   * Check bounce status
   */
  async checkBounceStatus(email) {
    try {
      // Query SendGrid bounces API (would need actual API call)
      // For now, check local bounce log
      const query = `
        SELECT COUNT(*) as bounce_count
        FROM email_bounces
        WHERE email = $1 AND created_at >= NOW() - INTERVAL '30 days'
      `;
      
      const result = await pool.query(query, [email]);
      
      return {
        isBounced: result.rows[0].bounce_count > 0,
        bounceCount: parseInt(result.rows[0].bounce_count)
      };
    } catch (error) {
      logger.error('Error checking bounce status:', error);
      return { isBounced: false, bounceCount: 0 };
    }
  }
}

module.exports = new EmailService();
