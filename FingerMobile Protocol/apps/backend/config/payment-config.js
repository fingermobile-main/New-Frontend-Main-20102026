/**
 * Payment Gateway Configuration
 * Centralized configuration for all payment providers
 */

const paymentConfig = {
  // Paystack Configuration
  paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY || '',
    publicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
    webhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET || '',
    baseUrl: 'https://api.paystack.co',
    currency: 'NGN',
    callbackUrl: process.env.PAYSTACK_CALLBACK_URL || 'http://localhost:3000/api/payment-webhooks/paystack'
  },

  // OPay Configuration
  opay: {
    merchantId: process.env.OPAY_MERCHANT_ID || '',
    publicKey: process.env.OPAY_PUBLIC_KEY || '',
    privateKey: process.env.OPAY_PRIVATE_KEY || '',
    webhookSecret: process.env.OPAY_WEBHOOK_SECRET || '',
    baseUrl: process.env.NODE_ENV === 'production'
      ? 'https://openapi.opayweb.com'
      : 'https://sandboxapi.opayweb.com',
    currency: 'NGN',
    callbackUrl: process.env.OPAY_CALLBACK_URL || 'http://localhost:3000/api/payment-webhooks/opay'
  },

  // Stripe Configuration (if needed)
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publicKey: process.env.STRIPE_PUBLIC_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    apiUrl: 'https://api.stripe.com'
  },

  // General Settings
  general: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    supportedCurrencies: ['NGN', 'USD', 'EUR', 'GBP'],
    minAmount: 100, // Minimum transaction amount in base currency
    maxAmount: 10000000 // Maximum transaction amount
  }
};

module.exports = paymentConfig;
