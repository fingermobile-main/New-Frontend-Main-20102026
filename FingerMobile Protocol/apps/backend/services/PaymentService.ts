import axios from 'axios';
import logger from '../utils/logger';

interface PaymentConfig {
  paystackSecretKey?: string;
  flutterwaveSecretKey?: string;
  stripeSecretKey?: string;
}

interface PaymentRequest {
  userId: string;
  amount: number; // in NGN
  email: string;
  currency?: string;
  metadata?: any;
}

interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  reference?: string;
  gateway?: string;
}

class PaymentService {
  private config: PaymentConfig;

  constructor() {
    this.config = {
      paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
      flutterwaveSecretKey: process.env.FLUTTERWAVE_SECRET_KEY,
      stripeSecretKey: process.env.STRIPE_SECRET_KEY
    };
  }

  /**
   * Process subscription payment via Paystack (Primary for Nigeria)
   */
  async processPaystackPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!this.config.paystackSecretKey) {
        throw new Error('Paystack secret key not configured');
      }

      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email: request.email,
          amount: request.amount * 100, // Paystack expects amount in kobo
          currency: request.currency || 'NGN',
          callback_url: `${process.env.APP_URL}/api/webhooks/paystack`,
          metadata: {
            user_id: request.userId,
            ...request.metadata
          }
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.paystackSecretKey}`,
            'Content-Type': 'application/json'
          }
        },
      );

      if (response.data.status) {
        return {
          success: true,
          transactionId: response.data.data.reference,
          message: 'Payment initialized successfully',
          reference: response.data.data.authorization_url,
          gateway: 'paystack'
        };
      } else {
        throw new Error(response.data.message || 'Payment initialization failed');
      }
    } catch (error: any) {
      logger.error('Paystack payment error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Paystack payment failed'
      };
    }
  }

  /**
   * Verify Paystack payment
   */
  async verifyPaystackPayment(reference: string): Promise<PaymentResponse> {
    try {
      if (!this.config.paystackSecretKey) {
        throw new Error('Paystack secret key not configured');
      }

      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.config.paystackSecretKey}`
          }
        },
      );

      if (response.data.status && response.data.data.status === 'success') {
        return {
          success: true,
          transactionId: response.data.data.reference,
          message: 'Payment verified successfully',
          gateway: 'paystack'
        };
      } else {
        return {
          success: false,
          message: 'Payment verification failed'
        };
      }
    } catch (error: any) {
      logger.error('Paystack verification error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Payment verification failed'
      };
    }
  }

  /**
   * Process payment via Flutterwave (Africa-wide)
   */
  async processFlutterwavePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!this.config.flutterwaveSecretKey) {
        throw new Error('Flutterwave secret key not configured');
      }

      const response = await axios.post(
        'https://api.flutterwave.com/v3/payments',
        {
          tx_ref: `FLW_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          amount: request.amount,
          currency: request.currency || 'NGN',
          redirect_url: `${process.env.APP_URL}/api/webhooks/flutterwave`,
          customer: {
            email: request.email
          },
          meta: {
            user_id: request.userId,
            ...request.metadata
          },
          customizations: {
            title: 'FingerMobile AI Subscription',
            description: 'AI Credits Purchase'
          }
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.flutterwaveSecretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        return {
          success: true,
          transactionId: response.data.data.tx_ref,
          message: 'Payment initialized successfully',
          reference: response.data.data.link,
          gateway: 'flutterwave'
        };
      } else {
        throw new Error(response.data.message || 'Payment initialization failed');
      }
    } catch (error: any) {
      logger.error('Flutterwave payment error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Flutterwave payment failed'
      };
    }
  }

  /**
   * Verify Flutterwave payment
   */
  async verifyFlutterwavePayment(transactionId: string): Promise<PaymentResponse> {
    try {
      if (!this.config.flutterwaveSecretKey) {
        throw new Error('Flutterwave secret key not configured');
      }

      const response = await axios.get(
        `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
        {
          headers: {
            Authorization: `Bearer ${this.config.flutterwaveSecretKey}`
          }
        }
      );

      if (response.data.status === 'success' && response.data.data.status === 'successful') {
        return {
          success: true,
          transactionId: response.data.data.tx_ref,
          message: 'Payment verified successfully',
          gateway: 'flutterwave'
        };
      } else {
        return {
          success: false,
          message: 'Payment verification failed'
        };
      }
    } catch (error: any) {
      logger.error('Flutterwave verification error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Payment verification failed'
      };
    }
  }

  /**
   * Process payment via Stripe (International)
   */
  async processStripePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!this.config.stripeSecretKey) {
        throw new Error('Stripe secret key not configured');
      }

      // For Stripe, we'll create a Payment Intent
      const stripe = require('stripe')(this.config.stripeSecretKey);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(request.amount * 100), // Stripe expects amount in cents
        currency: (request.currency || 'NGN').toLowerCase(),
        metadata: {
          user_id: request.userId,
          ...request.metadata
        },
        description: 'FingerMobile AI Subscription'
      });

      return {
        success: true,
        transactionId: paymentIntent.id,
        message: 'Payment intent created successfully',
        reference: paymentIntent.client_secret,
        gateway: 'stripe'
      };
    } catch (error: any) {
      logger.error('Stripe payment error:', error.message);
      return {
        success: false,
        message: error.message || 'Stripe payment failed'
      };
    }
  }

  /**
   * Verify Stripe payment
   */
  async verifyStripePayment(paymentIntentId: string): Promise<PaymentResponse> {
    try {
      if (!this.config.stripeSecretKey) {
        throw new Error('Stripe secret key not configured');
      }

      const stripe = require('stripe')(this.config.stripeSecretKey);

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        return {
          success: true,
          transactionId: paymentIntent.id,
          message: 'Payment verified successfully',
          gateway: 'stripe'
        };
      } else {
        return {
          success: false,
          message: `Payment status: ${paymentIntent.status}`
        };
      }
    } catch (error: any) {
      logger.error('Stripe verification error:', error.message);
      return {
        success: false,
        message: error.message || 'Payment verification failed'
      };
    }
  }

  /**
   * Process payment with automatic gateway selection
   */
  async processPayment(request: PaymentRequest, gateway?: string): Promise<PaymentResponse> {
    // If no gateway specified, use Paystack as default for NGN
    const selectedGateway = gateway || 'paystack';

    switch (selectedGateway.toLowerCase()) {
      case 'paystack':
        return await this.processPaystackPayment(request);
      case 'flutterwave':
        return await this.processFlutterwavePayment(request);
      case 'stripe':
        return await this.processStripePayment(request);
      default:
        return {
          success: false,
          message: `Unsupported payment gateway: ${selectedGateway}`
        };
    }
  }

  /**
   * Handle Paystack webhook
   */
  async handlePaystackWebhook(payload: any): Promise<PaymentResponse> {
    try {
      // Verify webhook signature (production should implement proper signature verification)
      if (payload.event === 'charge.success') {
        const reference = payload.data.reference;
        return await this.verifyPaystackPayment(reference);
      }

      return {
        success: false,
        message: 'Unhandled webhook event'
      };
    } catch (error: any) {
      logger.error('Paystack webhook error:', error.message);
      return {
        success: false,
        message: error.message || 'Webhook processing failed'
      };
    }
  }

  /**
   * Handle Flutterwave webhook
   */
  async handleFlutterwaveWebhook(payload: any): Promise<PaymentResponse> {
    try {
      if (payload.event === 'charge.completed' && payload.data.status === 'successful') {
        const transactionId = payload.data.id;
        return await this.verifyFlutterwavePayment(transactionId);
      }

      return {
        success: false,
        message: 'Unhandled webhook event'
      };
    } catch (error: any) {
      logger.error('Flutterwave webhook error:', error.message);
      return {
        success: false,
        message: error.message || 'Webhook processing failed'
      };
    }
  }

  /**
   * Handle Stripe webhook
   */
  async handleStripeWebhook(payload: any): Promise<PaymentResponse> {
    try {
      if (payload.type === 'payment_intent.succeeded') {
        const paymentIntentId = payload.data.object.id;
        return await this.verifyStripePayment(paymentIntentId);
      }

      return {
        success: false,
        message: 'Unhandled webhook event'
      };
    } catch (error: any) {
      logger.error('Stripe webhook error:', error.message);
      return {
        success: false,
        message: error.message || 'Webhook processing failed'
      };
    }
  }
}

export default new PaymentService();
