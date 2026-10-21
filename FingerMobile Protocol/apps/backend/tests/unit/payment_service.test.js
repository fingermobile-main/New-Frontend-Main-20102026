/**
 * Payment Service Unit Tests
 * Tests Stripe integration, PayPal orders, subscriptions, and invoice retrieval
 */

const { describe, it, beforeEach } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const PaymentService = require('../services/PaymentService');

describe('PaymentService', () => {
  let mockStripe;
  let mockPayPalClient;
  
  beforeEach(() => {
    // Mock Stripe
    mockStripe = {paymentIntents: { create: sinon.stub(),
  retrieve: sinon.stub()
      },
refunds: {create: sinon.stub()
      },
customers: {list: sinon.stub()
      },
invoices: {list: sinon.stub(),
  retrieve: sinon.stub()
      },
subscriptions: {create: sinon.stub(),
  retrieve: sinon.stub(),
  cancel: sinon.stub()
      }
    }
    
    // Replace stripe instance
    PaymentService.stripe = mockStripe
    
    // Mock PayPal
    mockPayPalClient = {execute: sinon.stub()
    }
    
    PaymentService.paypalClient = mockPayPalClient
  })
  
  afterEach(() => {
    sinon.restore()
  });
  
  describe('createStripePaymentIntent()', () => {
    it('should create payment intent successfully', async () => {
      mockStripe.paymentIntents.create.resolves({id: 'pi_test123',
  client_secret: process.env.JWT_SECRET || 'default-secret-for-development',
  amount: 10000, // $100 in cents,
  currency: 'usd'
      })
      
      const result = await PaymentService.createStripePaymentIntent(
        'user-456',
        100,
        'usd',
        {orderId: 'order-789' }
      )
      
      expect(result.success).to.be.true
      expect(result.paymentIntentId).to.equal('pi_test123')
      expect(result.clientSecret).to.equal('secret_xyz');
      expect(result.amount).to.equal(100);
    });
    
    it('should convert dollars to cents correctly', async () => {
      mockStripe.paymentIntents.create.resolves({id: 'pi_test',
  client_secret: 'secret',
  amount: 4999, // $49.99,
  currency: 'usd'
      })
      
      await PaymentService.createStripePaymentIntent('user-123', 49.99)
      
      const callArgs = mockStripe.paymentIntents.create.getCall(0).args[0]
      expect(callArgs.amount).to.equal(4999); // Rounded to cents
    })
    
    it('should include metadata in payment intent', async () => {
      mockStripe.paymentIntents.create.resolves({id: 'pi_test',
  client_secret: 'secret',
  amount: 10000,
  currency: 'usd'
      })
      
      await PaymentService.createStripePaymentIntent('user-123', 100, 'usd', {productId: 'prod-456',
  planType: 'premium'
      })
      
      const callArgs = mockStripe.paymentIntents.create.getCall(0).args[0]
      expect(callArgs.metadata.userId).to.equal('user-123');
      expect(callArgs.metadata.productId).to.equal('prod-456');
    });
    
    it('should handle Stripe API errors gracefully', async () => {
      mockStripe.paymentIntents.create.rejects(new Error('Card declined'));
      
      const result = await PaymentService.createStripePaymentIntent('user-123', 100);
      
      expect(result.success).to.be.false;
      expect(result.error).to.equal('Card declined');
    });
  });
  
  describe('confirmStripePayment()', () => {
    it('should confirm successful payment', async () => {
      mockStripe.paymentIntents.retrieve.resolves({id: 'pi_test123',
  status: 'succeeded',
  amount: 10000,
  currency: 'usd'
      });
      
      const result = await PaymentService.confirmStripePayment('pi_test123');
      
      expect(result.success).to.be.true;
      expect(result.status).to.equal('succeeded');
      expect(result.amount).to.equal(100);
    });
    
    it('should reject incomplete payments', async () => {
      mockStripe.paymentIntents.retrieve.resolves({id: 'pi_test123',
  status: 'requires_payment_method'
      });
      
      const result = await PaymentService.confirmStripePayment('pi_test123');
      
      expect(result.success).to.be.false;
      expect(result.error).to.include('requires_payment_method');
    });
    
    it('should handle retrieval errors', async () => {
      mockStripe.paymentIntents.retrieve.rejects(new Error('Invalid payment intent'));
      
      const result = await PaymentService.confirmStripePayment('invalid_id');
      
      expect(result.success).to.be.false;
      expect(result.error).to.equal('Invalid payment intent');
    });
  });
  
  describe('processRefund()', () => {
    it('should process full refund', async () => {
      mockStripe.refunds.create.resolves({id: 're_test123',
  status: 'succeeded',
  amount: 10000
      });
      
      const result = await PaymentService.processRefund('pi_test123');
      
      expect(result.success).to.be.true;
      expect(result.refundId).to.equal('re_test123');
      expect(result.amount).to.equal(100);
    });
    
    it('should process partial refund', async () => {
      mockStripe.refunds.create.resolves({id: 're_test123',
  status: 'succeeded',
  amount: 5000 // $50
      })
      
      const result = await PaymentService.processRefund('pi_test123', 50)
      
      expect(result.success).to.be.true
      expect(result.amount).to.equal(50)
      
      const callArgs = mockStripe.refunds.create.getCall(0).args[0];
      expect(callArgs.amount).to.equal(5000);
    });
    
    it('should handle refund errors', async () => {
      mockStripe.refunds.create.rejects(new Error('Already refunded'));
      
      const result = await PaymentService.processRefund('pi_test123');
      
      expect(result.success).to.be.false;
      expect(result.error).to.equal('Already refunded');
    });
  });
  
  describe('createPayPalOrder()', () => {
    it('should create PayPal order successfully', async () => {
      mockPayPalClient.execute.resolves({result: { id: 'ORDER-123',
  status: 'CREATED',
  links: [
            { rel: 'approve',
  href: 'https://paypal.com/approve' }
          ]
        }
      })
      
      const result = await PaymentService.createPayPalOrder(
        'user-456',
        99.99,
        'USD',
        'Premium Course'
      )
      
      expect(result.success).to.be.true
      expect(result.orderId).to.equal('ORDER-123')
      expect(result.approvalUrl).to.equal('https://paypal.com/approve')
    })
    
    it('should format amount correctly', async () => {
      mockPayPalClient.execute.resolves({result: { id: 'ORDER-123',
  status: 'CREATED',
  links: [] }
      })
      
      await PaymentService.createPayPalOrder('user-123', 49.99)
      
      const requestArg = mockPayPalClient.execute.getCall(0).args[0];
      expect(requestArg.requestBody.purchase_units[0].amount.value).to.equal('49.99');
    });
    
    it('should handle PayPal API errors', async () => {
      mockPayPalClient.execute.rejects(new Error('PayPal API error'));
      
      try {
        await PaymentService.createPayPalOrder('user-123', 100);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('PayPal');
      }
    });
  });
  
  describe('getInvoices()', () => {
    it('should retrieve invoices for user', async () => {
      // Mock customer lookup
      mockStripe.customers.list.resolves({data: [
          { id: 'cus_test123',
  metadata: { userId: 'user-456' }
          }
        ]
      })
      
      // Mock invoice list
      mockStripe.invoices.list.resolves({data: [
          { id: 'in_test1',
  number: 'INV-001',
  status: 'paid',
  amount_due: 9999,
  currency: 'usd',
  created: 1718236800, // Unix timestamp,
  paid_at: 1718237000,
  description: 'Course Purchase',
  lines: { data: [
                { description: 'Premium Course',
  amount: 9999,
  quantity: 1
                }
              ]
            }
          }
        ],
has_more: false
      })
      
      const result = await PaymentService.getInvoices('user-456', 10)
      
      expect(result.success).to.be.true
      expect(result.invoices).to.have.length(1)
      expect(result.invoices[0].id).to.equal('in_test1');
      expect(result.invoices[0].amount).to.equal(99.99);
      expect(result.invoices[0].lines).to.have.length(1);
    });
    
    it('should return empty array if no customer found', async () => {
      mockStripe.customers.list.resolves({data: []
      });
      
      const result = await PaymentService.getInvoices('nonexistent-user');
      
      expect(result.success).to.be.true;
      expect(result.invoices).to.be.an('array').that.is.empty;
      expect(result.total).to.equal(0);
    });
    
    it('should handle Stripe not configured', async () => {
      PaymentService.stripe = null;
      
      try {
        await PaymentService.getInvoices('user-123');
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.equal('Stripe not configured');
      }
      
      // Restore
      PaymentService.stripe = mockStripe
    })
    
    it('should format dates correctly', async () => {
      mockStripe.customers.list.resolves({data: [{ id: 'cus_123',
  metadata: { userId: 'user-456' } }]
      })
      
      mockStripe.invoices.list.resolves({data: [{ id: 'in_test',
  number: 'INV-001',
  status: 'paid',
  amount_due: 5000,
  currency: 'usd',
  created: 1718236800,
  due_date: 1718323200,
  paid_at: 1718237000,
  lines: { data: [] }
        }],
has_more: false
      })
      
      const result = await PaymentService.getInvoices('user-456');
      
      expect(result.invoices[0].created).to.match(/\d{4}-\d{2}-\d{2}/); // ISO date format
      expect(result.invoices[0].dueDate).to.match(/\d{4}-\d{2}-\d{2}/)
    })
  })
  
  describe('getInvoiceById()', () => {
    it('should retrieve single invoice by ID', async () => {
      mockStripe.invoices.retrieve.resolves({id: 'in_test123',
  number: 'INV-002',
  status: 'paid',
  amount_due: 15000,
  currency: 'usd',
  created: 1718236800,
  paid_at: 1718237000,
  description: 'Subscription Payment',
  customer_email: 'user@example.com',
  customer_name: 'John Doe',
  lines: { data: [
            { description: 'Monthly Subscription',
  amount: 15000,
  quantity: 1
            }
          ]
        }
      })
      
      const result = await PaymentService.getInvoiceById('in_test123');
      
      expect(result.success).to.be.true;
      expect(result.invoice.id).to.equal('in_test123');
      expect(result.invoice.amount).to.equal(150);
      expect(result.invoice.customerEmail).to.equal('user@example.com');
    });
    
    it('should handle invoice retrieval errors', async () => {
      mockStripe.invoices.retrieve.rejects(new Error('Invoice not found'));
      
      const result = await PaymentService.getInvoiceById('invalid_id');
      
      expect(result.success).to.be.false;
      expect(result.error).to.equal('Invoice not found');
    });
  });
  
  describe('downloadInvoice()', () => {
    it('should get PDF download URL', async () => {
      mockStripe.invoices.retrieve.resolves({id: 'in_test123',
  number: 'INV-003',
  invoice_pdf: 'https://invoices.stripe.com/pdf/test.pdf'
      })
      
      const result = await PaymentService.downloadInvoice('in_test123')
      
      expect(result.success).to.be.true
      expect(result.pdfUrl).to.equal('https://invoices.stripe.com/pdf/test.pdf')
      expect(result.filename).to.include('INV-003')
    })
    
    it('should reject if PDF not available', async () => {
      mockStripe.invoices.retrieve.resolves({id: 'in_test123',
  number: 'INV-003',
  invoice_pdf: null
      })
      
      try {
        await PaymentService.downloadInvoice('in_test123');
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.equal('PDF not available for this invoice');
      }
    });
  });
});

module.exports = PaymentService;
