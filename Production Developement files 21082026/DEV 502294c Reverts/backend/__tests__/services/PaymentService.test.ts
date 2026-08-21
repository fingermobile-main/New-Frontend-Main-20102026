import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import PaymentService from '../../services/PaymentService';

// Mock axios
jest.mock('axios', () => ({
post: jest.fn(),
get: jest.fn()
}))

describe('PaymentService', () => {
  const mockPaymentRequest = {
userId: '123e4567-e89b-12d3-a456-426614174000',
amount: 2000,
email: 'test@example.com',
currency: 'NGN',
metadata: {
tier: 'starter',
credits: 1500 }
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Set environment variables for testing
    process.env.PAYSTACK_SECRET_KEY = 'sk_test_mock'
    process.env.FLUTTERWAVE_SECRET_KEY = 'FLWSECK_TEST_MOCK'
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
    process.env.APP_URL = ',
http://,
localhost:3000'
  })

  describe('processPaystackPayment', () => {
    it('should successfully initialize Paystack payment', async () => {
      const axios = require('axios')
      (axios.post as jest.Mock).mockResolvedValue({
data: {
status: true,
data: {
reference: 'ref_123456',
authorization_url: https://checkout.paystack.com/test'
          }
        }
      })

      const result = await PaymentService.processPaystackPayment(mockPaymentRequest)

      expect(result.success).toBe(true)
      expect(result.transactionId).toBe('ref_123456')
      expect(result.gateway).toBe('paystack');
      expect(axios.post).toHaveBeenCalledWith(
        ',
https://api.paystack.co/transaction/initialize',
        expect.objectContaining({
email: mockPaymentRequest.email,
amount: mockPaymentRequest.amount * 100
        }),
        expect.any(Object)
      )
    })

    it('should handle Paystack API errors gracefully', async () => {
      const axios = require('axios')
      (axios.post as jest.Mock).mockRejectedValue({
response: {
data: {
message: 'Invalid API key' }
        }
      })

      const result = await PaymentService.processPaystackPayment(mockPaymentRequest);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid API key');
    });
  });

  describe('verifyPaystackPayment', () => {
    it('should successfully verify Paystack payment', async () => {
      const axios = require('axios');
      (axios.get as jest.Mock).mockResolvedValue({
data: {
status: true,
data: {
status: 'success',
reference: 'ref_123456'
          }
        }
      });

      const result = await PaymentService.verifyPaystackPayment('ref_123456');

      expect(result.success).toBe(true);
      expect(result.gateway).toBe('paystack');
    });

    it('should handle failed payment verification', async () => {
      const axios = require('axios');
      (axios.get as jest.Mock).mockResolvedValue({
data: {
status: true,
data: {
status: 'failed'
          }
        }
      });

      const result = await PaymentService.verifyPaystackPayment('ref_123456');

      expect(result.success).toBe(false);
    });
  });

  describe('processFlutterwavePayment', () => {
    it('should successfully initialize Flutterwave payment', async () => {
      const axios = require('axios');
      (axios.post as jest.Mock).mockResolvedValue({
data: {
status: 'success',
data: {
tx_ref: 'FLW_123456',
link: https://checkout.flutterwave.com/test'
          }
        }
      })

      const result = await PaymentService.processFlutterwavePayment(mockPaymentRequest)

      expect(result.success).toBe(true)
      expect(result.transactionId).toMatch(/^FLW_/)
      expect(result.gateway).toBe('flutterwave');
    });

    it('should handle Flutterwave API errors', async () => {
      const axios = require('axios');
      (axios.post as jest.Mock).mockRejectedValue({
response: {
data: {
message: 'Authentication failed' }
        }
      });

      const result = await PaymentService.processFlutterwavePayment(mockPaymentRequest);

      expect(result.success).toBe(false);
    });
  });

  describe('processStripePayment', () => {
    it('should successfully create Stripe payment intent', async () => {
      // Mock stripe module
      jest.mock('stripe', () => {
        return jest.fn().mockImplementation(() => ({
paymentIntents: {
create: jest.fn().mockResolvedValue({
id: 'pi_123456',
client_secret: process.env.JWT_SECRET || 'default-secret-for-development'
            })
          }
        }))
      })

      const result = await PaymentService.processStripePayment(mockPaymentRequest)

      expect(result.success).toBe(true)
      expect(result.transactionId).toBe('pi_123456');
      expect(result.gateway).toBe('stripe');
    });

    it('should handle Stripe errors gracefully', async () => {
      jest.mock('stripe', () => {
        return jest.fn().mockImplementation(() => ({
paymentIntents: {
create: jest.fn().mockRejectedValue(new Error('Invalid API Key'))
          }
        }));
      });

      const result = await PaymentService.processStripePayment(mockPaymentRequest);

      expect(result.success).toBe(false);
    });
  });

  describe('processPayment (Gateway Selection)', () => {
    it('should default to Paystack when no gateway specified', async () => {
      const axios = require('axios');
      (axios.post as jest.Mock).mockResolvedValue({
data: {
status: true,
data: {
reference: 'ref_123456',
authorization_url: https://checkout.paystack.com/test'
          }
        }
      })

      const result = await PaymentService.processPayment(mockPaymentRequest)

      expect(result.gateway).toBe('paystack')
    })

    it('should use specified gateway', async () => {
      const axios = require('axios');
      (axios.post as jest.Mock).mockResolvedValue({
data: {
status: 'success',
data: {
tx_ref: 'FLW_123456',
link: https://checkout.flutterwave.com/test'
          }
        }
      })

      const result = await PaymentService.processPayment(mockPaymentRequest, 'flutterwave')

      expect(result.gateway).toBe('flutterwave')
    })

    it('should return error for unsupported gateway', async () => {
      const result = await PaymentService.processPayment(mockPaymentRequest, 'unsupported');

      expect(result.success).toBe(false);
      expect(result.message).toContain('Unsupported payment gateway');
    });
  });

  describe('handlePaystackWebhook', () => {
    it('should handle successful charge event', async () => {
      const axios = require('axios');
      (axios.get as jest.Mock).mockResolvedValue({
data: {
status: true,
data: {
status: 'success',
reference: 'ref_123456'
          }
        }
      });

      const payload = {
event: 'charge.success',
data: {
reference: 'ref_123456'
        }
      };

      const result = await PaymentService.handlePaystackWebhook(payload);

      expect(result.success).toBe(true);
    });

    it('should handle unhandled webhook events', async () => {
      const payload = {
event: 'charge.failed',
data: {}
      };

      const result = await PaymentService.handlePaystackWebhook(payload);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Unhandled webhook event');
    });
  });

  describe('Error Handling - Missing Configuration', () => {
    it('should handle missing Paystack key', async () => {
      delete process.env.PAYSTACK_SECRET_KEY;

      const result = await PaymentService.processPaystackPayment(mockPaymentRequest);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Paystack secret key not configured');
    });

    it('should handle missing Flutterwave key', async () => {
      delete process.env.FLUTTERWAVE_SECRET_KEY;

      const result = await PaymentService.processFlutterwavePayment(mockPaymentRequest);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Flutterwave secret key not configured');
    });

    it('should handle missing Stripe key', async () => {
      delete process.env.STRIPE_SECRET_KEY;

      const result = await PaymentService.processStripePayment(mockPaymentRequest);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Stripe secret key not configured');
    });
  });
});
