const stripe = require('stripe');
const paypal = require('@paypal/checkout-server-sdk');

class PaymentService {
  constructor() {
    // Initialize Stripe
    if (process.env.STRIPE_SECRET_KEY) {
      this.stripe = new stripe(process.env.STRIPE_SECRET_KEY);
      logger.info('✅ Stripe initialized');
    }
    
    // Initialize PayPal
    if (process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET) {
      this.paypalEnvironment = process.env.NODE_ENV === 'production'
        ? new paypal.core.LiveEnvironment(
            process.env.PAYPAL_CLIENT_ID,
            process.env.PAYPAL_CLIENT_SECRET
          )
        : new paypal.core.SandboxEnvironment(
            process.env.PAYPAL_CLIENT_ID,
            process.env.PAYPAL_CLIENT_SECRET
          );
      this.paypalClient = new paypal.core.PayPalHttpClient(this.paypalEnvironment);
      logger.info('✅ PayPal initialized');
    }
  }

  /**
   * Create Stripe payment intent
   */
  async createStripePaymentIntent(userId, amount, currency = 'usd', metadata = {}) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: {
          userId,
          ...metadata
        }
        automatic_payment_methods: {
          enabled: true
        }
      });

      logger.info(`✅ Stripe payment intent created: ${paymentIntent.id}`);
      
      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount,
        currency
      };
    } catch (error) {
      logger.error('❌ Stripe payment intent creation failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Confirm Stripe payment
   */
  async confirmStripePayment(paymentIntentId) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        logger.info(`✅ Stripe payment confirmed: ${paymentIntentId}`);
        return {
          success: true,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency
        };
      } else {
        return {
          success: false,
          error: `Payment status: ${paymentIntent.status}`
        };
      }
    } catch (error) {
      logger.error('❌ Stripe payment confirmation failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Process refund
   */
  async processRefund(paymentIntentId, amount = null, reason = 'requested_by_customer') {
    try {
      const refundParams = {
        payment_intent: paymentIntentId,
        reason
      };
      
      if (amount) {
        refundParams.amount = Math.round(amount * 100);
      }
      
      const refund = await this.stripe.refunds.create(refundParams);
      
      logger.info(`✅ Refund processed: ${refund.id}`);
      
      return {
        success: true,
        refundId: refund.id,
        status: refund.status,
        amount: refund.amount / 100
      };
    } catch (error) {
      logger.error('❌ Refund processing failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create PayPal order
   */
  async createPayPalOrder(userId, amount, currency = 'USD', description = 'FingerMobile Purchase') {
    try {
      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer("return=representation");
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: amount.toFixed(2)
          }
          description,
          custom_id: userId
        }]
      });

      const order = await this.paypalClient.execute(request);
      
      logger.info(`✅ PayPal order created: ${order.result.id}`);
      
      return {
        success: true,
        orderId: order.result.id,
        approvalUrl: order.result.links.find(link => link.rel === 'approve')?.href,
        amount,
        currency
      };
    } catch (error) {
      logger.error('❌ PayPal order creation failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Capture PayPal payment
   */
  async capturePayPalPayment(orderId) {
    try {
      const request = new paypal.orders.OrdersCaptureRequest(orderId);
      request.requestBody({});
      
      const capture = await this.paypalClient.execute(request);
      
      logger.info(`✅ PayPal payment captured: ${orderId}`);
      
      return {
        success: true,
        orderId: capture.result.id,
        status: capture.result.status,
        amount: capture.result.purchase_units[0]?.payments?.captures[0]?.amount?.value
      };
    } catch (error) {
      logger.error('❌ PayPal payment capture failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verify webhook signature (Stripe)
   */
  verifyStripeWebhook(payload, signature, endpointSecret) {
    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
      return { success: true, event };
    } catch (error) {
      logger.error('❌ Stripe webhook verification failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create subscription (Stripe)
   */
  async createSubscription(userId, priceId, paymentMethodId) {
    try {
      // Create customer
      const customer = await this.stripe.customers.create({
        metadata: { userId }
      });

      // Attach payment method
      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id
      });

      // Create subscription
      const subscription = await this.stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent']
      });

      logger.info(`✅ Subscription created: ${subscription.id}`);
      
      return {
        success: true,
        subscriptionId: subscription.id,
        customerId: customer.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret
      };
    } catch (error) {
      logger.error('❌ Subscription creation failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId, atPeriodEnd = true) {
    try {
      const subscription = await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: atPeriodEnd
      });

      logger.info(`✅ Subscription cancelled: ${subscriptionId}`);
      
      return {
        success: true,
        subscriptionId: subscription.id,
        status: subscription.status,
        cancelAt: subscription.cancel_at
      };
    } catch (error) {
      logger.error('❌ Subscription cancellation failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get invoices for a user from Stripe
   */
  async getInvoices(userId, limit = 50) {
    try {
      if (!this.stripe) {
        throw new Error('Stripe not configured');
      }

      // First, find customer by userId metadata
      const customers = await this.stripe.customers.list({
        limit: 100,
        email: null // We'll filter by metadata
      });

      // Find customer with matching userId in metadata
      let customerId = null;
      for (const customer of customers.data) {
        if (customer.metadata && customer.metadata.userId === userId.toString()) {
          customerId = customer.id;
          break;
        }
      }

      if (!customerId) {
        // No customer found, return empty array
        return {
          success: true,
          invoices: [],
          total: 0
        };
      }

      // Retrieve invoices for this customer
      const invoices = await this.stripe.invoices.list({
        customer: customerId,
        limit: Math.min(limit, 100), // Stripe max limit is 100
        status: 'paid' // Only return paid invoices
      });

      // Format invoices for frontend
      const formattedInvoices = invoices.data.map(invoice => ({
        id: invoice.id,
        number: invoice.number,
        status: invoice.status,
        amount: invoice.amount_due / 100, // Convert from cents
        currency: invoice.currency.toUpperCase(),
        created: new Date(invoice.created * 1000).toISOString(),
        dueDate: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
        paidAt: invoice.paid_at ? new Date(invoice.paid_at * 1000).toISOString() : null,
        description: invoice.description || 'FingerMobile Purchase',
        subscriptionId: invoice.subscription || null,
        paymentIntentId: invoice.payment_intent || null,
        hostedInvoiceUrl: invoice.hosted_invoice_url,
        invoicePdf: invoice.invoice_pdf,
        lines: invoice.lines?.data?.map(line => ({
          description: line.description,
          amount: line.amount / 100,
          quantity: line.quantity || 1
        })) || []
      }));

      logger.info(`✅ Retrieved ${formattedInvoices.length} invoices for user ${userId}`);

      return {
        success: true,
        invoices: formattedInvoices,
        total: invoices.data.length,
        hasMore: invoices.has_more
      };
    } catch (error) {
      logger.error('❌ Failed to retrieve invoices:', error.message);
      return {
        success: false,
        error: error.message,
        invoices: []
      };
    }
  }

  /**
   * Get single invoice by ID
   */
  async getInvoiceById(invoiceId) {
    try {
      if (!this.stripe) {
        throw new Error('Stripe not configured');
      }

      const invoice = await this.stripe.invoices.retrieve(invoiceId);

      return {
        success: true,
        invoice: {
          id: invoice.id,
          number: invoice.number,
          status: invoice.status,
          amount: invoice.amount_due / 100,
          currency: invoice.currency.toUpperCase(),
          created: new Date(invoice.created * 1000).toISOString(),
          dueDate: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
          paidAt: invoice.paid_at ? new Date(invoice.paid_at * 1000).toISOString() : null,
          description: invoice.description,
          subscriptionId: invoice.subscription,
          paymentIntentId: invoice.payment_intent,
          hostedInvoiceUrl: invoice.hosted_invoice_url,
          invoicePdf: invoice.invoice_pdf,
          customerEmail: invoice.customer_email,
          customerName: invoice.customer_name,
          lines: invoice.lines?.data?.map(line => ({
            description: line.description,
            amount: line.amount / 100,
            quantity: line.quantity || 1
          })) || []
        }
      };
    } catch (error) {
      logger.error('❌ Failed to retrieve invoice:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Download invoice as PDF
   */
  async downloadInvoice(invoiceId) {
    try {
      if (!this.stripe) {
        throw new Error('Stripe not configured');
      }

      const invoice = await this.stripe.invoices.retrieve(invoiceId);

      if (!invoice.invoice_pdf) {
        throw new Error('PDF not available for this invoice');
      }

      return {
        success: true,
        pdfUrl: invoice.invoice_pdf,
        filename: `invoice-${invoice.number || invoice.id}.pdf`
      };
    } catch (error) {
      logger.error('❌ Failed to download invoice:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new PaymentService();
