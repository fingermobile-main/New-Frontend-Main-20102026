import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import AIController from '../../controllers/AIController';
import AISubscription from '../../models/AISubscriptionModel';
import User from '../../models/UserModel';

// Mock dependencies
jest.mock('../../services/OpenAIService')
jest.mock('../../services/PaymentService')
jest.mock('../../models/AISubscriptionModel')
jest.mock('../../models/UserModel')
jest.mock('../../models/AICreditTransactionModel');
jest.mock('../../models/AIUsageLogModel');
jest.mock('../../models/AIFeatureConfigModel');

const app = express();
app.use(express.json());

// Mock authentication middleware
app.use((req, res, next) => {
  req.user = {
id: '123e4567-e89b-12d3-a456-426614174000' }
  next()
})

// AI routes
app.get('/api/ai/subscription/current', AIController.getCurrentSubscription.bind(AIController))
app.get('/api/ai/subscription/plans', AIController.getSubscriptionPlans.bind(AIController))
app.post('/api/ai/subscription/purchase', AIController.purchaseSubscription.bind(AIController))
app.get('/api/ai/credits/balance', AIController.getCreditBalance.bind(AIController))
app.post('/api/ai/credits/topup', AIController.topupCredits.bind(AIController));
app.post('/api/ai/chat', AIController.chatAssistant.bind(AIController));
app.post('/api/ai/generate/image', AIController.generateImage.bind(AIController));
app.post('/api/ai/translate', AIController.translateText.bind(AIController));
app.post('/api/ai/moderate', AIController.moderateContent.bind(AIController));
app.get('/api/ai/usage/logs', AIController.getUsageLogs.bind(AIController));
app.get('/api/ai/features', AIController.getAvailableFeatures.bind(AIController));

describe('AI Controller Integration Tests', () => {
  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/ai/subscription/current', () => {
    it('should return current subscription details', async () => {
      const mockSubscription = {
id: 'sub_123',
tier: 'plus',
status: 'active',
creditsRemaining: 5000,
creditsTotal: 6000,
monthlyPrice: 7000,
currency: 'NGN',
startDate: new Date(),
endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
autoRenew: true,
isActive: () => true
      };

      (AISubscription.findOne as jest.Mock).mockResolvedValue(mockSubscription);

      const response = await request(app).get('/api/ai/subscription/current');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.subscription.tier).toBe('plus');
      expect(response.body.subscription.creditsRemaining).toBe(5000);
    });

    it('should return 404 when no subscription exists', async () => {
      (AISubscription.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/api/ai/subscription/current');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('No subscription found');
    });
  });

  describe('GET /api/ai/subscription/plans', () => {
    it('should return all available subscription plans', async () => {
      const response = await request(app).get('/api/ai/subscription/plans');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.plans).toBeInstanceOf(Array);
      expect(response.body.plans.length).toBeGreaterThan(0);
      expect(response.body.plans[0]).toHaveProperty('tier');
      expect(response.body.plans[0]).toHaveProperty('price');
      expect(response.body.plans[0]).toHaveProperty('credits');
    });
  });

  describe('POST /api/ai/subscription/purchase', () => {
    it('should return 400 when tier or paymentMethod is missing', async () => {
      const response = await request(app)
        .post('/api/ai/subscription/purchase')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Tier and payment method are required');
    });

    it('should return 400 for invalid tier', async () => {
      const response = await request(app)
        .post('/api/ai/subscription/purchase')
        .send({
tier: 'invalid',
paymentMethod: 'paystack' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid subscription tier');
    });

    it('should handle free tier without payment', async () => {
      const mockUser = {
id: mockUserId,
email: 'test@example.com' };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (AISubscription.findOne as jest.Mock).mockResolvedValue(null);

      const mockSubscription = {
id: 'sub_free',
tier: 'free',
creditsRemaining: 20,
endDate: new Date()
      };
      (AISubscription.create as jest.Mock).mockResolvedValue(mockSubscription);

      const response = await request(app)
        .post('/api/ai/subscription/purchase')
        .send({
tier: 'free',
paymentMethod: 'none' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Free subscription');
    });

    it('should return 409 when active subscription already exists', async () => {
      const mockUser = {
id: mockUserId,
email: 'test@example.com' };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (AISubscription.findOne as jest.Mock).mockResolvedValue({
id: 'existing_sub' });

      const response = await request(app)
        .post('/api/ai/subscription/purchase')
        .send({
tier: 'starter',
paymentMethod: 'paystack' });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Active subscription already exists');
    });
  });

  describe('GET /api/ai/credits/balance', () => {
    it('should return credit balance', async () => {
      const mockSubscription = {
creditsRemaining: 1500,
creditsTotal: 1500,
tier: 'starter',
status: 'active'
      };
      (AISubscription.findOne as jest.Mock).mockResolvedValue(mockSubscription);

      const response = await request(app).get('/api/ai/credits/balance');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.creditsRemaining).toBe(1500);
    });

    it('should return 404 when no active subscription', async () => {
      (AISubscription.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/api/ai/credits/balance');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('No active subscription');
    });
  });

  describe('POST /api/ai/chat', () => {
    it('should return 400 when prompt is missing', async () => {
      const response = await request(app)
        .post('/api/ai/chat')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Prompt is required');
    });

    it('should successfully process chat request', async () => {
      const OpenAIService = require('../../services/OpenAIService');
      OpenAIService.generateChatCompletion = jest.fn().mockResolvedValue({
success: true,
content: 'Test response',
tokensUsed: 30,
creditsCharged: 1
      });
      OpenAIService.getRemainingDailyLimit = jest.fn().mockResolvedValue(100);

      const response = await request(app)
        .post('/api/ai/chat')
        .send({
prompt: 'Hello, how are you?' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.content).toBe('Test response');
    });

    it('should return 429 when daily limit reached', async () => {
      const OpenAIService = require('../../services/OpenAIService');
      OpenAIService.getRemainingDailyLimit = jest.fn().mockResolvedValue(0);

      const response = await request(app)
        .post('/api/ai/chat')
        .send({
prompt: 'Test' });

      expect(response.status).toBe(429);
      expect(response.body.error).toBe('Daily limit reached');
    });
  });

  describe('POST /api/ai/moderate', () => {
    it('should return 400 when content is missing', async () => {
      const response = await request(app)
        .post('/api/ai/moderate')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Content is required');
    });

    it('should successfully moderate content', async () => {
      const OpenAIService = require('../../services/OpenAIService');
      OpenAIService.moderateContent = jest.fn().mockResolvedValue({
flagged: false,
categories: {
hate: false }
      });

      const response = await request(app)
        .post('/api/ai/moderate')
        .send({
content: 'Safe content here' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.flagged).toBe(false);
    });
  });

  describe('GET /api/ai/usage/logs', () => {
    it('should return usage logs with pagination', async () => {
      const AIUsageLog = require('../../models/AIUsageLogModel');
      AIUsageLog.findAndCountAll = jest.fn().mockResolvedValue({
count: 10,
rows: [
          {
id: 'log1',
featureType: 'chat',
creditsCharged: 1 },
          {
id: 'log2',
featureType: 'image',
creditsCharged: 40 }
        ]
      });

      const response = await request(app).get('/api/ai/usage/logs?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.logs).toBeInstanceOf(Array);
      expect(response.body.pagination).toHaveProperty('total');
      expect(response.body.pagination).toHaveProperty('page');
    });
  });

  describe('GET /api/ai/features', () => {
    it('should return available features based on user tier', async () => {
      const AIFeatureConfig = require('../../models/AIFeatureConfigModel');
      AIFeatureConfig.findAll = jest.fn().mockResolvedValue([
        {
featureName: 'chat_assistant',
description: 'AI Chat',
creditsPerUse: 1,
maxRequestsPerDay: 100,
rateLimitPerMinute: 10,
isTierAllowed: jest.fn().mockReturnValue(true)
        }
      ]);

      (AISubscription.findOne as jest.Mock).mockResolvedValue({
tier: 'starter' });

      const response = await request(app).get('/api/ai/features');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.features).toBeInstanceOf(Array);
      expect(response.body.userTier).toBe('starter');
    });
  });
});
