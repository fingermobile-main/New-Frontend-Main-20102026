import { Router, Request, Response } from 'express';
import logger from '../utils/logger';
import PaymentService from '../services/PaymentService';
import AISubscription from '../models/AISubscriptionModel';
import AICreditTransaction from '../models/AICreditTransactionModel';

const router = Router();

/**
 * Paystack Webhook Handler
 */
router.post('/paystack', async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body;

    // Verify webhook signature in production
    // const signature = req.headers['x-paystack-signature'];
    // if (!verifyPaystackSignature(payload, signature)) {
    //   res.status(401).json({ error: 'Invalid signature' });
    //   return;
    // }

    const result = await PaymentService.handlePaystackWebhook(payload);

    if (result.success && payload.event === 'charge.success') {
      // Extract metadata from payment
      const metadata = payload.data.metadata || {};
      const userId = metadata.user_id;
      const tier = metadata.tier;
      const credits = metadata.credits;

      if (userId && tier && credits) {
        // Check if subscription already exists (to avoid duplicates)
        const existingSub = await AISubscription.findOne({
          where: { 
            userId, 
            status: 'active',
            tier 
          }
        });

        if (!existingSub) {
          // Create subscription
          const now = new Date();
          const endDate = new Date(now);
          endDate.setMonth(endDate.getMonth() + 1);

          const subscription = await AISubscription.create({
            userId,
            tier,
            status: 'active',
            creditsRemaining: parseInt(credits),
            creditsTotal: parseInt(credits),
            monthlyPrice: payload.data.amount / 100, // Convert from kobo
            currency: 'NGN',
            startDate: now,
            endDate,
            autoRenew: tier !== 'free'
          });

          await AICreditTransaction.create({
            userId,
            subscriptionId: subscription.id,
            transactionType: 'purchase',
            creditsAmount: parseInt(credits),
            balanceBefore: 0,
            balanceAfter: parseInt(credits),
            description: `Purchased ${tier} subscription via Paystack`,
            referenceId: payload.data.reference,
            metadata: {
              gateway: 'paystack',
              amount_paid: payload.data.amount / 100
            }
          });

          logger.info(`Subscription created for user ${userId}: ${tier} tier`);
        }
      }
    }

    res.json({ status: 'success' });
  } catch (error) {
    logger.error('Paystack webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * Flutterwave Webhook Handler
 */
router.post('/flutterwave', async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body;

    // Verify webhook signature in production
    // const signature = req.headers['verif-hash'];
    // if (!verifyFlutterwaveSignature(payload, signature)) {
    //   res.status(401).json({ error: 'Invalid signature' });
    //   return;
    // }

    const result = await PaymentService.handleFlutterwaveWebhook(payload);

    if (result.success && payload.event === 'charge.completed') {
      const metadata = payload.data.meta || {};
      const userId = metadata.user_id;
      const credits = metadata.credits;
      const tier = metadata.tier;

      if (userId && credits) {
        // Check if this is a subscription or top-up
        if (tier) {
          // Subscription purchase
          const existingSub = await AISubscription.findOne({
            where: { 
              userId, 
              status: 'active',
              tier 
            }
          });

          if (!existingSub) {
            const now = new Date();
            const endDate = new Date(now);
            endDate.setMonth(endDate.getMonth() + 1);

            const subscription = await AISubscription.create({
              userId,
              tier,
              status: 'active',
              creditsRemaining: parseInt(credits),
              creditsTotal: parseInt(credits),
              monthlyPrice: payload.data.amount,
              currency: payload.data.currency || 'NGN',
              startDate: now,
              endDate,
              autoRenew: true
            });

            await AICreditTransaction.create({
              userId,
              subscriptionId: subscription.id,
              transactionType: 'purchase',
              creditsAmount: parseInt(credits),
              balanceBefore: 0,
              balanceAfter: parseInt(credits),
              description: `Purchased ${tier} subscription via Flutterwave`,
              referenceId: payload.data.tx_ref,
              metadata: {
                gateway: 'flutterwave',
                amount_paid: payload.data.amount
              }
            });

            logger.info(`Subscription created for user ${userId}: ${tier} tier`);
          }
        } else {
          // Credit top-up
          const subscription = await AISubscription.findOne({
            where: { userId, status: 'active' }
          });

          if (subscription) {
            const balanceBefore = subscription.creditsRemaining;
            await subscription.addCredits(parseInt(credits));

            await AICreditTransaction.create({
              userId,
              subscriptionId: subscription.id,
              transactionType: 'purchase',
              creditsAmount: parseInt(credits),
              balanceBefore,
              balanceAfter: balanceBefore + parseInt(credits),
              description: `Purchased ${credits} additional credits via Flutterwave`,
              referenceId: payload.data.tx_ref,
              metadata: {
                gateway: 'flutterwave',
                amount_paid: payload.data.amount
              }
            });

            logger.info(`Credits added for user ${userId}: ${credits} credits`);
          }
        }
      }
    }

    res.json({ status: 'success' });
  } catch (error) {
    logger.error('Flutterwave webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * Stripe Webhook Handler
 */
router.post('/stripe', async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body;

    // Verify webhook signature in production
    // const sig = req.headers['stripe-signature'];
    // const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    // const event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);

    const result = await PaymentService.handleStripeWebhook(payload);

    if (result.success && payload.type === 'payment_intent.succeeded') {
      const paymentIntent = payload.data.object;
      const metadata = paymentIntent.metadata || {};
      const userId = metadata.user_id;
      const credits = metadata.credits;
      const tier = metadata.tier;

      if (userId && credits) {
        if (tier) {
          // Subscription purchase
          const existingSub = await AISubscription.findOne({
            where: { 
              userId, 
              status: 'active',
              tier 
            }
          });

          if (!existingSub) {
            const now = new Date();
            const endDate = new Date(now);
            endDate.setMonth(endDate.getMonth() + 1);

            const subscription = await AISubscription.create({
              userId,
              tier,
              status: 'active',
              creditsRemaining: parseInt(credits),
              creditsTotal: parseInt(credits),
              monthlyPrice: paymentIntent.amount / 100, // Convert from cents
              currency: paymentIntent.currency.toUpperCase(),
              startDate: now,
              endDate,
              autoRenew: true
            });

            await AICreditTransaction.create({
              userId,
              subscriptionId: subscription.id,
              transactionType: 'purchase',
              creditsAmount: parseInt(credits),
              balanceBefore: 0,
              balanceAfter: parseInt(credits),
              description: `Purchased ${tier} subscription via Stripe`,
              referenceId: paymentIntent.id,
              metadata: {
                gateway: 'stripe',
                amount_paid: paymentIntent.amount / 100
              }
            });

            logger.info(`Subscription created for user ${userId}: ${tier} tier`);
          }
        } else {
          // Credit top-up
          const subscription = await AISubscription.findOne({
            where: { userId, status: 'active' }
          });

          if (subscription) {
            const balanceBefore = subscription.creditsRemaining;
            await subscription.addCredits(parseInt(credits));

            await AICreditTransaction.create({
              userId,
              subscriptionId: subscription.id,
              transactionType: 'purchase',
              creditsAmount: parseInt(credits),
              balanceBefore,
              balanceAfter: balanceBefore + parseInt(credits),
              description: `Purchased ${credits} additional credits via Stripe`,
              referenceId: paymentIntent.id,
              metadata: {
                gateway: 'stripe',
                amount_paid: paymentIntent.amount / 100
              }
            });

            logger.info(`Credits added for user ${userId}: ${credits} credits`);
          }
        }
      }
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Stripe webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
