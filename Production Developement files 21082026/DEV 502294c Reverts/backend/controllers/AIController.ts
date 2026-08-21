import { Request, Response } from 'express';
import logger from '../utils/logger';
import OpenAIService from '../services/OpenAIService';
import PaymentService from '../services/PaymentService';
import AISubscription from '../models/AISubscriptionModel';
import AICreditTransaction from '../models/AICreditTransactionModel';
import AIUsageLog from '../models/AIUsageLogModel';
import AIFeatureConfig from '../models/AIFeatureConfigModel';
import User from '../models/UserModel';
import { Op } from 'sequelize';

class AIController {
  /**
   * Get current user's AI subscription status
   */
  async getCurrentSubscription(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const subscription = await AISubscription.findOne({
        where: { userId },
        order: [['createdAt', 'DESC']]
      });

      if (!subscription) {
        res.status(404).json({
          error: 'No subscription found',
          message: 'You have not subscribed to any AI plan yet.'
        });
        return;
      }

      res.json({
        success: true,
        subscription: {
          id: subscription.id,
          tier: subscription.tier,
          status: subscription.status,
          creditsRemaining: subscription.creditsRemaining,
          creditsTotal: subscription.creditsTotal,
          monthlyPrice: subscription.monthlyPrice,
          currency: subscription.currency,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          autoRenew: subscription.autoRenew,
          isActive: subscription.isActive()
        }
      });
    } catch (error) {
      logger.error('Error fetching subscription:', error);
      res.status(500).json({ error: 'Failed to fetch subscription' });
    }
  }

  /**
   * Get available AI subscription plans
   */
  async getSubscriptionPlans(req: Request, res: Response): Promise<void> {
    try {
      const plans = [
        {
          tier: 'free',
          name: 'Free Trial',
          price: 0,
          currency: 'NGN',
          credits: 20,
          features: ['20 credits/month', 'Basic chat assistant', 'Content moderation'],
          popular: false
        },
        {
          tier: 'starter',
          name: 'Starter',
          price: 2000,
          currency: 'NGN',
          credits: 1500,
          features: ['1,500 credits/month', 'Chat assistant', 'Translation', 'Grammar check', 'Speech-to-text'],
          popular: false
        },
        {
          tier: 'plus',
          name: 'Plus',
          price: 7000,
          currency: 'NGN',
          credits: 6000,
          features: ['6,000 credits/month', 'All Starter features', 'Image generation (10/month)', 'Content creation'],
          popular: true
        },
        {
          tier: 'creator',
          name: 'Creator',
          price: 15000,
          currency: 'NGN',
          credits: 15000,
          features: ['15,000 credits/month', 'All Plus features', 'Video generation (3/month)', 'Priority support'],
          popular: false
        },
        {
          tier: 'pro',
          name: 'Pro',
          price: 30000,
          currency: 'NGN',
          credits: 35000,
          features: ['35,000 credits/month', 'All Creator features', 'Unlimited chat', 'API access'],
          popular: false
        },
        {
          tier: 'enterprise',
          name: 'Enterprise',
          price: null,
          currency: 'NGN',
          credits: null,
          features: ['Custom credits', 'Dedicated support', 'SLA guarantee', 'Custom models'],
          popular: false
        }
      ];

      res.json({
        success: true,
        plans
      });
    } catch (error) {
      logger.error('Error fetching plans:', error);
      res.status(500).json({ error: 'Failed to fetch subscription plans' });
    }
  }

  /**
   * Purchase AI subscription with payment integration
   */
  async purchaseSubscription(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { tier, paymentMethod } = req.body;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      if (!tier || !paymentMethod) {
        res.status(400).json({ error: 'Tier and payment method are required' });
        return;
      }

      // Get user email for payment processing
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Define plan details
      const planDetails: any = {
        free: { credits: 20, price: 0 },
        starter: { credits: 1500, price: 2000 },
        plus: { credits: 6000, price: 7000 },
        creator: { credits: 15000, price: 15000 },
        pro: { credits: 35000, price: 30000 }
      };

      const plan = planDetails[tier];
      if (!plan) {
        res.status(400).json({ error: 'Invalid subscription tier' });
        return;
      }

      // Check for existing active subscription
      const existingSubscription = await AISubscription.findOne({
        where: { userId, status: 'active' }
      });

      if (existingSubscription) {
        res.status(409).json({
          error: 'Active subscription already exists',
          message: 'Please cancel your current subscription before purchasing a new one.'
        });
        return;
      }

      // For free tier, skip payment
      if (plan.price === 0) {
        const now = new Date();
        const endDate = new Date(now);
        endDate.setMonth(endDate.getMonth() + 1);

        const subscription = await AISubscription.create({
          userId,
          tier,
          status: 'active',
          creditsRemaining: plan.credits,
          creditsTotal: plan.credits,
          monthlyPrice: 0,
          currency: 'NGN',
          startDate: now,
          endDate,
          autoRenew: false
        });

        await AICreditTransaction.create({
          userId,
          subscriptionId: subscription.id,
          transactionType: 'bonus',
          creditsAmount: plan.credits,
          balanceBefore: 0,
          balanceAfter: plan.credits,
          description: `Free trial subscription - ${plan.credits} credits`
        });

        res.status(201).json({
          success: true,
          message: 'Free subscription activated successfully',
          subscription: {
            id: subscription.id,
            tier: subscription.tier,
            creditsRemaining: subscription.creditsRemaining,
            endDate: subscription.endDate
          }
        });
        return;
      }

      // Process payment
      const paymentResult = await PaymentService.processPayment(
        {
          userId,
          amount: plan.price,
          email: user.email,
          currency: 'NGN',
          metadata: {
            tier,
            credits: plan.credits,
            subscription_type: 'monthly'
          }
        },
        paymentMethod
      );

      if (!paymentResult.success) {
        res.status(402).json({
          error: 'Payment initialization failed',
          message: paymentResult.message,
          gateway: paymentResult.gateway
        });
        return;
      }

      // For Paystack/Flutterwave, return authorization URL for user to complete payment
      if (paymentResult.reference && paymentResult.gateway !== 'stripe') {
        res.json({
          success: true,
          message: 'Payment initialized. Please complete payment.',
          paymentUrl: paymentResult.reference,
          transactionId: paymentResult.transactionId,
          gateway: paymentResult.gateway,
          nextStep: 'redirect_to_payment_url'
        });
        return;
      }

      // For Stripe or direct payment, create subscription immediately
      const now = new Date();
      const endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + 1);

      const subscription = await AISubscription.create({
        userId,
        tier,
        status: 'active',
        creditsRemaining: plan.credits,
        creditsTotal: plan.credits,
        monthlyPrice: plan.price,
        currency: 'NGN',
        startDate: now,
        endDate,
        autoRenew: tier !== 'free'
      });

      await AICreditTransaction.create({
        userId,
        subscriptionId: subscription.id,
        transactionType: 'purchase',
        creditsAmount: plan.credits,
        balanceBefore: 0,
        balanceAfter: plan.credits,
        description: `Purchased ${tier} subscription`,
        referenceId: paymentResult.transactionId,
        metadata: { 
          payment_method: paymentMethod, 
          amount_paid: plan.price,
          gateway: paymentResult.gateway 
        }
      });

      res.status(201).json({
        success: true,
        message: 'Subscription purchased successfully',
        subscription: {
          id: subscription.id,
          tier: subscription.tier,
          creditsRemaining: subscription.creditsRemaining,
          endDate: subscription.endDate
        },
        payment: {
          transactionId: paymentResult.transactionId,
          gateway: paymentResult.gateway
        }
      });
    } catch (error) {
      logger.error('Error purchasing subscription:', error);
      res.status(500).json({ error: 'Failed to purchase subscription' });
    }
  }

  /**
   * Get credit balance
   */
  async getCreditBalance(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const subscription = await AISubscription.findOne({
        where: { userId, status: 'active' }
      });

      if (!subscription) {
        res.status(404).json({
          error: 'No active subscription',
          creditsRemaining: 0
        });
        return;
      }

      res.json({
        success: true,
        creditsRemaining: subscription.creditsRemaining,
        creditsTotal: subscription.creditsTotal,
        tier: subscription.tier,
        status: subscription.status
      });
    } catch (error) {
      logger.error('Error fetching credit balance:', error);
      res.status(500).json({ error: 'Failed to fetch credit balance' });
    }
  }

  /**
   * Top-up credits with payment integration
   */
  async topupCredits(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { amount, paymentMethod } = req.body;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      if (!amount || amount < 100) {
        res.status(400).json({ error: 'Minimum top-up amount is 100 credits' });
        return;
      }

      // Get user email
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Get active subscription
      const subscription = await AISubscription.findOne({
        where: { userId, status: 'active' }
      });

      if (!subscription) {
        res.status(404).json({ error: 'No active subscription found' });
        return;
      }

      const creditCost = amount * 1.6; // ₦1.60 per credit

      // Process payment
      const paymentResult = await PaymentService.processPayment(
        {
          userId,
          amount: creditCost,
          email: user.email,
          currency: 'NGN',
          metadata: {
            credits: amount,
            topup_type: 'additional_credits'
          }
        },
        paymentMethod
      );

      if (!paymentResult.success) {
        res.status(402).json({
          error: 'Payment initialization failed',
          message: paymentResult.message,
          gateway: paymentResult.gateway
        });
        return;
      }

      // For redirect-based payments
      if (paymentResult.reference && paymentResult.gateway !== 'stripe') {
        res.json({
          success: true,
          message: 'Payment initialized. Please complete payment to add credits.',
          paymentUrl: paymentResult.reference,
          transactionId: paymentResult.transactionId,
          gateway: paymentResult.gateway,
          creditsToReceive: amount,
          nextStep: 'redirect_to_payment_url'
        });
        return;
      }

      // Add credits immediately for direct payments
      const balanceBefore = subscription.creditsRemaining;
      await subscription.addCredits(amount);

      await AICreditTransaction.create({
        userId,
        subscriptionId: subscription.id,
        transactionType: 'purchase',
        creditsAmount: amount,
        balanceBefore,
        balanceAfter: balanceBefore + amount,
        description: `Purchased ${amount} additional credits`,
        referenceId: paymentResult.transactionId,
        metadata: { 
          payment_method: paymentMethod, 
          amount_paid: creditCost,
          gateway: paymentResult.gateway 
        }
      });

      res.json({
        success: true,
        message: 'Credits added successfully',
        creditsAdded: amount,
        newBalance: balanceBefore + amount,
        payment: {
          transactionId: paymentResult.transactionId,
          gateway: paymentResult.gateway
        }
      });
    } catch (error) {
      logger.error('Error topping up credits:', error);
      res.status(500).json({ error: 'Failed to top-up credits' });
    }
  }

  /**
   * Chat with AI assistant
   */
  async chatAssistant(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { prompt, model, maxTokens, temperature } = req.body;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      if (!prompt) {
        res.status(400).json({ error: 'Prompt is required' });
        return;
      }

      // Check daily limit
      const remainingLimit = await OpenAIService.getRemainingDailyLimit(userId, 'chat_assistant');
      if (remainingLimit <= 0) {
        res.status(429).json({
          error: 'Daily limit reached',
          message: 'You have reached your daily limit for chat assistant. Try again tomorrow.'
        });
        return;
      }

      const result = await OpenAIService.generateChatCompletion({
        userId,
        prompt,
        model,
        maxTokens,
        temperature
      });

      res.json({
        success: true,
        ...result
      });
    } catch (error: any) {
      logger.error('Error in chat assistant:', error);

      if ((error as Error).message.includes('Insufficient credits')) {
        res.status(402).json({
          error: 'Insufficient credits',
          message: (error as Error).message
        });
        return;
      }

      res.status(500).json({
        error: 'Failed to process chat request',
        message: (error as Error).message
      });
    }
  }

  /**
   * Generate image
   */
  async generateImage(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { prompt, size, quality } = req.body;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      if (!prompt) {
        res.status(400).json({ error: 'Prompt is required' });
        return;
      }

      // Check daily limit
      const remainingLimit = await OpenAIService.getRemainingDailyLimit(userId, 'image_generation');
      if (remainingLimit <= 0) {
        res.status(429).json({
          error: 'Daily limit reached',
          message: 'You have reached your daily limit for image generation. Try again tomorrow.'
        });
        return;
      }

      const result = await OpenAIService.generateImage({
        userId,
        prompt,
        size,
        quality
      });

      res.json({
        success: true,
        ...result
      });
    } catch (error: any) {
      logger.error('Error generating image:', error);

      if ((error as Error).message.includes('Insufficient credits')) {
        res.status(402).json({
          error: 'Insufficient credits',
          message: (error as Error).message
        });
        return;
      }

      res.status(500).json({
        error: 'Failed to generate image',
        message: (error as Error).message
      });
    }
  }

  /**
   * Translate text
   */
  async translateText(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { text, targetLanguage, sourceLanguage } = req.body;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      if (!text || !targetLanguage) {
        res.status(400).json({ error: 'Text and target language are required' });
        return;
      }

      const translation = await OpenAIService.translateText({
        userId,
        text,
        targetLanguage,
        sourceLanguage
      });

      res.json({
        success: true,
        translation
      });
    } catch (error: any) {
      logger.error('Error translating text:', error);

      if ((error as Error).message.includes('Insufficient credits')) {
        res.status(402).json({
          error: 'Insufficient credits',
          message: (error as Error).message
        });
        return;
      }

      res.status(500).json({
        error: 'Failed to translate text',
        message: (error as Error).message
      });
    }
  }

  /**
   * Moderate content
   */
  async moderateContent(req: Request, res: Response): Promise<void> {
    try {
      const { content } = req.body;

      if (!content) {
        res.status(400).json({ error: 'Content is required' });
        return;
      }

      const result = await OpenAIService.moderateContent(content);

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      logger.error('Error moderating content:', error);
      res.status(500).json({ error: 'Failed to moderate content' });
    }
  }

  /**
   * Get usage logs
   */
  async getUsageLogs(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { page = 1, limit = 20, featureType } = req.query;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const where: any = { userId };
      if (featureType) {
        where.featureType = featureType;
      }

      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows } = await AIUsageLog.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        logs: rows,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit))
        }
      });
    } catch (error) {
      logger.error('Error fetching usage logs:', error);
      res.status(500).json({ error: 'Failed to fetch usage logs' });
    }
  }

  /**
   * Get available AI features
   */
  async getAvailableFeatures(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      // Get user's subscription tier
      const subscription = await AISubscription.findOne({
        where: { userId, status: 'active' }
      });

      const userTier = subscription?.tier || 'free';

      // Get all active features
      const features = await AIFeatureConfig.findAll({
        where: { isActive: true }
      });

      // Filter features based on user's tier
      const availableFeatures = features.map((feature: any) => ({
        name: feature.featureName,
        description: feature.description,
        creditsPerUse: feature.creditsPerUse,
        maxRequestsPerDay: feature.maxRequestsPerDay,
        rateLimitPerMinute: feature.rateLimitPerMinute,
        isAvailable: feature.isTierAllowed(userTier),
        remainingToday: null, // Will be calculated if needed
      }));

      res.json({
        success: true,
        features: availableFeatures,
        userTier
      });
    } catch (error) {
      logger.error('Error fetching available features:', error);
      res.status(500).json({ error: 'Failed to fetch available features' });
    }
  }

}

export default new AIController();