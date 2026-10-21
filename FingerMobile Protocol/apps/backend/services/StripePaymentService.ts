import Stripe from 'stripe';
import logger from '../utils/logger';
import pool from '../db';
import AICreditBalanceService from './AICreditBalanceService';

class StripePaymentService {
  private stripe: Stripe;

  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  /**
   * Create a Stripe payment intent for one-time payments
   */
  async createPaymentIntent(
    userId: string, 
    amount: number, 
    currency: string = 'usd',
    description?: string,
    metadata?: Record<string, string>
  ): Promise<{ success: boolean; paymentIntentId?: string; clientSecret?: string; error?: string }> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: {
          userId,
          ...metadata
        },
        description: description || `Payment for FingerMobile services`,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      logger.info(`Stripe payment intent created: ${paymentIntent.id} for user ${userId}`);

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error: any) {
      logger.error('Error creating Stripe payment intent:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Create a Stripe checkout session for subscriptions
   */
  async createCheckoutSession(
    userId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, string>
  ): Promise<{ success: boolean; sessionId?: string; url?: string; error?: string }> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [{
          price: priceId,
          quantity: 1,
        }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId,
          ...metadata
        },
        customer_email: await this.getUserEmail(userId), // Fetch user email
      });

      logger.info(`Stripe checkout session created: ${session.id} for user ${userId}`);

      return {
        success: true,
        sessionId: session.id,
        url: session.url || undefined,
      };
    } catch (error: any) {
      logger.error('Error creating Stripe checkout session:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Create a one-time payment checkout session
   */
  async createOneTimeCheckoutSession(
    userId: string,
    amount: number,
    currency: string = 'usd',
    successUrl: string,
    cancelUrl: string,
    description?: string
  ): Promise<{ success: boolean; sessionId?: string; url?: string; error?: string }> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [{
          price_data: {
            currency,
            product_data: {
              name: description || 'FingerMobile Service',
              description: 'Payment for FingerMobile platform services',
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId,
        },
        customer_email: await this.getUserEmail(userId),
      });

      logger.info(`Stripe one-time checkout session created: ${session.id} for user ${userId}`);

      return {
        success: true,
        sessionId: session.id,
        url: session.url || undefined,
      };
    } catch (error: any) {
      logger.error('Error creating Stripe one-time checkout session:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Process successful payment webhook
   */
  async handlePaymentSuccess(paymentIntentId: string): Promise<boolean> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        logger.warn(`Payment intent ${paymentIntentId} is not succeeded, status: ${paymentIntent.status}`);
        return false;
      }

      const userId = paymentIntent.metadata?.userId;
      if (!userId) {
        logger.error(`No userId found in payment intent ${paymentIntentId} metadata`);
        return false;
      }

      // Extract metadata to determine what to do with the payment
      const metadata = paymentIntent.metadata || {};
      const credits = metadata.credits;
      const amount = paymentIntent.amount / 100; // Convert from cents
      
      // If credits are specified, add them to the user's balance
      if (credits) {
        await AICreditBalanceService.addCredits(userId, parseInt(credits), `Stripe payment - ${paymentIntentId}`);
        logger.info(`Added ${credits} credits to user ${userId} from payment ${paymentIntentId}`);
      }

      // Record the transaction in the database
      await this.recordTransaction(
        userId,
        paymentIntentId,
        amount,
        'PAYMENT',
        'STRIPE',
        'COMPLETED',
        `Payment via Stripe: ${paymentIntent.description}`
      );

      logger.info(`Successfully processed Stripe payment ${paymentIntentId} for user ${userId}`);
      return true;
    } catch (error: any) {
      logger.error('Error processing Stripe payment success:', error);
      return false;
    }
  }

  /**
   * Create a customer portal session for managing subscriptions
   */
  async createCustomerPortalSession(userId: string, returnUrl: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // First, get the customer ID from our records or create a new customer
      const customerId = await this.getOrCreateCustomerId(userId);
      
      if (!customerId) {
        throw new Error(`Could not create or retrieve customer for user ${userId}`);
      }

      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      logger.info(`Customer portal session created for user ${userId}`);

      return {
        success: true,
        url: session.url,
      };
    } catch (error: any) {
      logger.error('Error creating customer portal session:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get or create a Stripe customer for the given user
   */
  private async getOrCreateCustomerId(userId: string): Promise<string | null> {
    try {
      // Try to find existing customer ID in our database
      const result = await pool.query(
        'SELECT stripe_customer_id FROM user_stripe_customers WHERE user_id = $1',
        [userId]
      );

      if (result.rows.length > 0 && result.rows[0]) {
        return (result.rows[0] as unknown as { stripe_customer_id: string }).stripe_customer_id;
      }

      // Create a new customer in Stripe
      const userResult = await pool.query(
        'SELECT email, username FROM users WHERE id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        throw new Error(`User ${userId} not found`);
      }

      const user = userResult.rows[0] as unknown as { email: string; username: string };
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: user.username,
        metadata: {
          userId,
        },
      });

      // Save the customer ID to our database
      await pool.query(
        'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
        [customer.id, userId]
      );

      logger.info(`Created Stripe customer ${customer.id} for user ${userId}`);

      return customer.id;
    } catch (error: any) {
      logger.error('Error getting or creating Stripe customer:', error);
      return null;
    }
  }

  /**
   * Get user email from database
   */
  private async getUserEmail(userId: string): Promise<string> {
    try {
      const result = await pool.query(
        'SELECT email FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length > 0) {
        return (result.rows[0] as unknown as { email: string }).email;
      }

      throw new Error(`User ${userId} not found`);
    } catch (error: any) {
      logger.error('Error retrieving user email:', error);
      throw error;
    }
  }

  /**
   * Record payment transaction in the database
   */
  private async recordTransaction(
    userId: string,
    referenceId: string,
    amount: number,
    type: string,
    paymentGateway: string,
    status: string,
    description: string
  ): Promise<void> {
    try {
      // Get user wallet ID
      const walletResult = await pool.query(
        'SELECT wallet_id FROM user_wallets WHERE user_id = $1',
        [userId]
      );

      if (walletResult.rows.length === 0) {
        // Create a wallet if one doesn't exist
        const newWalletResult = await pool.query(
          'INSERT INTO user_wallets (user_id) VALUES ($1) RETURNING wallet_id',
          [userId]
        );
        const walletId = (newWalletResult.rows[0] as unknown as { wallet_id: string }).wallet_id;
        
        // Record the transaction
        await pool.query(`
          INSERT INTO transactions (wallet_id, user_id, type, amount, currency, reference_id, payment_gateway, status, description)
          VALUES ($1, $2, $3, $4, 'USD', $5, $6, $7, $8)
        `, [walletId, userId, type, amount, referenceId, paymentGateway, status, description]);
      } else {
        const walletId = (walletResult.rows[0] as unknown as { wallet_id: string }).wallet_id;
        
        // Record the transaction
        await pool.query(`
          INSERT INTO transactions (wallet_id, user_id, type, amount, currency, reference_id, payment_gateway, status, description)
          VALUES ($1, $2, $3, $4, 'USD', $5, $6, $7, $8)
        `, [walletId, userId, type, amount, referenceId, paymentGateway, status, description]);
      }

      logger.info(`Recorded transaction for user ${userId}, reference: ${referenceId}`);
    } catch (error: any) {
      logger.error('Error recording transaction:', error);
      throw error;
    }
  }

  /**
   * Validate webhook signature
   */
  async verifyWebhookSignature(payload: Buffer, signature: string, endpointSecret: string): Promise<any> {
    try {
      return this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    } catch (error: any) {
      logger.error('Webhook signature verification failed:', error);
      throw error;
    }
  }

  static async getCustomerId(userId: string): Promise<string> {
    try {
      const result = await pool.query(
        'SELECT stripe_customer_id FROM user_stripe_customers WHERE user_id = $1',
        [userId]
      );

      if (result.rows.length > 0 && result.rows[0]) {
        return (result.rows[0] as unknown as { stripe_customer_id: string }).stripe_customer_id;
      } else {
        throw new Error(`User ${userId} not found`);
      }
    } catch (error: any) {
      logger.error('Error fetching customer ID:', error);
      throw error;
    }
  }

  static async getCustomerEmail(userId: string): Promise<string> {
    try {
      const result = await pool.query(
        'SELECT email FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length > 0) {
        return (result.rows[0] as unknown as { email: string }).email;
      } else {
        throw new Error(`User ${userId} not found`);
      }
    } catch (error: any) {
      logger.error('Error fetching customer email:', error);
      throw error;
    }
  }

  private async getOrCreateWallet(userId: string, currency: string = 'usd'): Promise<string> {
    try {
      // Check if wallet already exists
      const walletResult = await pool.query(
        'SELECT wallet_id FROM user_wallets WHERE user_id = $1',
        [userId]
      );

      let walletId: string;

      if (walletResult.rows.length === 0) {
        // Create a new wallet
        const newWalletResult = await pool.query(
          'INSERT INTO user_wallets (user_id, balance, currency) VALUES ($1, $2, $3) RETURNING wallet_id',
          [userId, 0, currency]
        );
        walletId = (newWalletResult.rows[0] as unknown as { wallet_id: string }).wallet_id;
      } else {
        walletId = (walletResult.rows[0] as unknown as { wallet_id: string }).wallet_id;
      }

      return walletId;
    } catch (error: any) {
      logger.error('Error getting/creating wallet:', error);
      throw error;
    }
  }
}

export default new StripePaymentService();