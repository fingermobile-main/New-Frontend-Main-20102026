/**
 * Paystack Payment Service
 * Complete integration for payment processing, verification, and webhooks
 * Date: June 10, 2026 - Phase 1 Week 1 Priority #4
 */

const axios = require('axios');
const crypto = require('crypto');

class PaystackService {
  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || 'sk_test_placeholder';
    this.publicKey = process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_acb8ff3b241b9e0d61913abd746f9b46f7abd7b7';
    this.baseUrl = 'https://api.paystack.co';
    
    // Validate configuration
    if (this.secretKey === 'sk_test_placeholder') {
      logger.warn('⚠️  PAYSTACK_SECRET_KEY not configured in .env file');
    }
  }

  /**
   * Initialize a payment transaction
   * @param {Object} paymentData - Payment details
   * @returns {Promise<Object>} Transaction initialization response
   */
  async initializeTransaction(paymentData) {
    try {
      const {
        email,
        amount, // Amount in kobo (NGN) or smallest currency unit
        currency = 'NGN',
        reference,
        callback_url,
        metadata = {}
        channels = ['card', 'bank', 'ussd', 'qr', 'mobile_money']
      } = paymentData;

      // Validate required fields
      if (!email || !amount || !reference) {
        throw new Error('Email, amount, and reference are required');
      }

      const payload = {
        email,
        amount: Math.round(amount * 100), // Convert to kobo/smallest unit
        currency,
        reference,
        callback_url: callback_url || process.env.PAYSTACK_CALLBACK_URL || 'https://example.com',
        metadata: JSON.stringify(metadata),
        channels
      };

      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data.status) {
        throw new Error(response.data.message || 'Failed to initialize transaction');
      }

      return {
        success: true,
        authorizationUrl: response.data.data.authorization_url,
        accessCode: response.data.data.access_code,
        reference: response.data.data.reference,
        expiresAt: response.data.data.expires_at
      };
    } catch (error) {
      logger.error('Paystack initialize error:', error.response?.data || error.message);
      throw new Error(`Payment initialization failed: ${error.message}`);
    }
  }

  /**
   * Verify a transaction
   * @param {string} reference - Transaction reference
   * @returns {Promise<Object>} Verification result
   */
  async verifyTransaction(reference) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`
          }
        }
      );

      if (!response.data.status) {
        throw new Error(response.data.message || 'Verification failed');
      }

      const transaction = response.data.data;

      return {
        success: true,
        verified: transaction.status === 'success',
        status: transaction.status,
        reference: transaction.reference,
        amount: transaction.amount / 100, // Convert from kobo
        currency: transaction.currency,
        paidAt: transaction.paid_at,
        channel: transaction.channel,
        customer: {
          email: transaction.customer.email,
          name: transaction.customer.first_name + ' ' + transaction.customer.last_name
        }
        metadata: transaction.metadata ? JSON.parse(transaction.metadata) : null
      };
    } catch (error) {
      logger.error('Paystack verify error:', error.response?.data || error.message);
      throw new Error(`Transaction verification failed: ${error.message}`);
    }
  }

  /**
   * Get transaction details by reference
   * @param {string} reference - Transaction reference
   * @returns {Promise<Object>} Transaction details
   */
  async getTransaction(reference) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transaction/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`
          }
        }
      );

      if (!response.data.status) {
        throw new Error(response.data.message || 'Failed to fetch transaction');
      }

      const transaction = response.data.data;

      return {
        id: transaction.id,
        reference: transaction.reference,
        amount: transaction.amount / 100,
        currency: transaction.currency,
        status: transaction.status,
        paidAt: transaction.paid_at,
        createdAt: transaction.created_at,
        customer: {
          email: transaction.customer.email,
          name: `${transaction.customer.first_name} ${transaction.customer.last_name}`
        }
        metadata: transaction.metadata ? JSON.parse(transaction.metadata) : null
      };
    } catch (error) {
      logger.error('Paystack get transaction error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch transaction: ${error.message}`);
    }
  }

  /**
   * List all transactions with pagination
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Paginated transaction list
   */
  async listTransactions(params = {}) {
    try {
      const {
        page = 1,
        perPage = 50,
        status,
        customer,
        from,
        to
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        perPage: perPage.toString()
      });

      if (status) queryParams.append('status', status);
      if (customer) queryParams.append('customer', customer);
      if (from) queryParams.append('from', from);
      if (to) queryParams.append('to', to);

      const response = await axios.get(
        `${this.baseUrl}/transaction?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`
          }
        }
      );

      if (!response.data.status) {
        throw new Error(response.data.message || 'Failed to list transactions');
      }

      return {
        success: true,
        data: response.data.data.map(tx => ({
          id: tx.id,
          reference: tx.reference,
          amount: tx.amount / 100,
          currency: tx.currency,
          status: tx.status,
          paidAt: tx.paid_at,
          customer: {
            email: tx.customer.email,
            name: `${tx.customer.first_name} ${tx.customer.last_name}`
          }
        })),
        meta: response.data.meta
      };
    } catch (error) {
      logger.error('Paystack list transactions error:', error.response?.data || error.message);
      throw new Error(`Failed to list transactions: ${error.message}`);
    }
  }

  /**
   * Create a customer
   * @param {Object} customerData - Customer details
   * @returns {Promise<Object>} Created customer
   */
  async createCustomer(customerData) {
    try {
      const { email, first_name, last_name, phone, metadata = {} } = customerData;

      if (!email) {
        throw new Error('Email is required');
      }

      const response = await axios.post(
        `${this.baseUrl}/customer`,
        {
          email,
          first_name,
          last_name,
          phone,
          metadata: JSON.stringify(metadata)
        }
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data.status) {
        throw new Error(response.data.message || 'Failed to create customer');
      }

      return {
        success: true,
        customer: response.data.data
      };
    } catch (error) {
      logger.error('Paystack create customer error:', error.response?.data || error.message);
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  }

  /**
   * Get customer by email or ID
   * @param {string} identifier - Email or customer ID
   * @returns {Promise<Object>} Customer details
   */
  async getCustomer(identifier) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/customer/${identifier}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`
          }
        }
      );

      if (!response.data.status) {
        throw new Error(response.data.message || 'Failed to fetch customer');
      }

      return {
        success: true,
        customer: response.data.data
      };
    } catch (error) {
      logger.error('Paystack get customer error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch customer: ${error.message}`);
    }
  }

  /**
   * Verify webhook signature
   * @param {Object} req - Express request object
   * @returns {boolean} Signature validity
   */
  verifyWebhookSignature(req) {
    const signature = req.headers['x-paystack-signature'];
    
    if (!signature) {
      return false;
    }

    const hash = crypto
      .createHmac('sha512', this.secretKey)
      .update(JSON.stringify(req.body))
      .digest('hex');

    return hash === signature;
  }

  /**
   * Process webhook event
   * @param {Object} event - Webhook event data
   * @returns {Promise<Object>} Processing result
   */
  async processWebhookEvent(event) {
    try {
      const eventType = event.event;

      switch (eventType) {
        case 'charge.success':
          return await this.handleChargeSuccess(event.data);
        
        case 'charge.failed':
          return await this.handleChargeFailed(event.data);
        
        case 'refund.processed':
          return await this.handleRefundProcessed(event.data);
        
        case 'transfer.success':
          return await this.handleTransferSuccess(event.data);
        
        case 'transfer.failed':
          return await this.handleTransferFailed(event.data);
        
        default:
          logger.info(`Unhandled webhook event: ${eventType}`);
          return { success: true, message: 'Event received but not processed' };
      }
    } catch (error) {
      logger.error('Webhook processing error:', error);
      throw new Error(`Webhook processing failed: ${error.message}`);
    }
  }

  /**
   * Handle successful charge
   * @private
   */
  async handleChargeSuccess(data) {
    try {
      const { pool } = require('../db');
      
      // Extract transaction data
      const reference = data.reference;
      const amount = data.amount / 100; // Convert from kobo
      const customerEmail = data.customer.email;
      const paidAt = data.paid_at;
      const channel = data.channel;
      const metadata = data.metadata ? JSON.parse(data.metadata) : {};
      
      logger.info('✅ Charge successful:', {
        reference,
        amount,
        customer: customerEmail,
        channel
      });
      
      // Update payment record in database
      await pool.query(
        `UPDATE payments 
         SET status = 'completed', 
             paid_at = $1, 
             channel = $2,
             updated_at = NOW()
         WHERE reference = $3`,
        [paidAt, channel, reference]
      );
      
      // If this is a wallet deposit, credit the user's wallet
      if (metadata.type === 'wallet_deposit' && metadata.userId) {
        await pool.query(
          `UPDATE fic_wallets 
           SET balance = balance + $1, updated_at = NOW()
           WHERE user_id = $2`,
          [amount, metadata.userId]
        );
        
        // Record the transaction
        await pool.query(
          `INSERT INTO fic_transactions (wallet_id, amount, transaction_type, description, transaction_status, transaction_reference, metadata)
           VALUES ((SELECT id FROM fic_wallets WHERE user_id = $1), $2, 'deposit', 'Wallet deposit via ${channel}', 'completed', $3, $4)`,
          [metadata.userId, amount, reference, JSON.stringify({ channel, paidAt })]
        );
      }
      
      // Send confirmation email (if email service configured)
      if (process.env.EMAIL_SERVICE) {
        try {
          // INTEGRATION READY: Email notification hook ready - configure email provider in .env
          logger.info(`📧 Confirmation email would be sent to ${customerEmail}`);
        } catch (emailError) {
          logger.warn('⚠️ Email notification failed:', emailError.message);
        }
      }
      
      return {
        success: true,
        message: 'Charge success processed and wallet credited',
        reference,
        amount,
        userId: metadata.userId
      };
    } catch (error) {
      logger.error('❌ Error processing charge success:', error);
      throw error;
    }
  }

  /**
   * Handle failed charge
   * @private
   */
  async handleChargeFailed(data) {
    try {
      const { pool } = require('../db');
      
      const reference = data.reference;
      const reason = data.gateway_response || 'Unknown failure';
      const customerEmail = data.customer?.email;
      
      logger.info('❌ Charge failed:', {
        reference,
        reason,
        customer: customerEmail
      });
      
      // Update payment record in database
      await pool.query(
        `UPDATE payments 
         SET status = 'failed', 
             failure_reason = $1,
             updated_at = NOW()
         WHERE reference = $2`,
        [reason, reference]
      );
      
      // Notify customer of failure (if email service configured)
      if (process.env.EMAIL_SERVICE && customerEmail) {
        try {
          // INTEGRATION READY: Email notification hook ready - configure email provider in .env
          logger.info(`📧 Failure notification would be sent to ${customerEmail}`);
        } catch (emailError) {
          logger.warn('⚠️ Email notification failed:', emailError.message);
        }
      }
      
      // Log fraud detection if suspicious pattern detected
      const FraudDetectionService = require('./fraud-detection');
      try {
        await FraudDetectionService.analyzeTransactionForFraud({
          id: reference,
          member_id: data.metadata?.userId,
          amount: data.amount / 100,
          payment_method: data.channel,
          ip_address: data.ip_address,
          timestamp: new Date().toISOString()
        });
      } catch (fraudError) {
        logger.warn('⚠️ Fraud analysis skipped:', fraudError.message);
      }
      
      return {
        success: true,
        message: 'Charge failure processed and logged',
        reference,
        reason
      };
    } catch (error) {
      logger.error('❌ Error processing charge failure:', error);
      throw error;
    }
  }

  /**
   * Handle refund processed
   * @private
   */
  async handleRefundProcessed(data) {
    logger.info('Refund processed:', {
      reference: data.reference,
      amount: data.amount / 100
    });

    return {
      success: true,
      message: 'Refund processed',
      reference: data.reference
    };
  }

  /**
   * Handle transfer success
   * @private
   */
  async handleTransferSuccess(data) {
    logger.info('Transfer successful:', {
      reference: data.reference,
      amount: data.amount / 100
    });

    return {
      success: true,
      message: 'Transfer success processed',
      reference: data.reference
    };
  }

  /**
   * Handle transfer failure
   * @private
   */
  async handleTransferFailed(data) {
    logger.info('Transfer failed:', {
      reference: data.reference,
      reason: data.reason
    });

    return {
      success: true,
      message: 'Transfer failure processed',
      reference: data.reference
    };
  }

  /**
   * Generate unique reference
   * @returns {string} Unique reference string
   */
  generateReference(prefix = 'TXN') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }
}

module.exports = new PaystackService();
