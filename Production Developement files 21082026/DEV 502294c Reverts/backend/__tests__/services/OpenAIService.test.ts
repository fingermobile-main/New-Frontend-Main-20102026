import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import OpenAIService from '../../services/OpenAIService';
import AISubscription from '../../models/AISubscriptionModel';
import AIUsageLog from '../../models/AIUsageLogModel';
import AICreditTransaction from '../../models/AICreditTransactionModel';
import AIFeatureConfig from '../../models/AIFeatureConfigModel';

// Mock external dependencies
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
chat: {
completions: {
create: jest.fn()
      }
    },
images: {
generate: jest.fn()
    },
moderations: {
create: jest.fn()
    }
  }))
})

jest.mock('../../models/AISubscriptionModel')
jest.mock('../../models/AIUsageLogModel')
jest.mock('../../models/AICreditTransactionModel');
jest.mock('../../models/AIFeatureConfigModel');

describe('OpenAIService', () => {
  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
  const mockSubscriptionId = '223e4567-e89b-12d3-a456-426614174001';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateChatCompletion', () => {
    it('should successfully generate chat completion and deduct credits', async () => {
      // Mock feature config
      (AIFeatureConfig.findOne as jest.Mock).mockResolvedValue({
featureName: 'chat_assistant',
creditsPerUse: 1,
isFeatureActive: () => true,
maxRequestsPerDay: 100,
rateLimitPerMinute: 10
      })

      // Mock subscription
      const mockSubscription = {
id: mockSubscriptionId,
userId: mockUserId,
creditsRemaining: 100,
isActive: () => true,
hasEnoughCredits: jest.fn().mockReturnValue(true),
deductCredits: jest.fn().mockResolvedValue(undefined)
      }
      (AISubscription.findOne as jest.Mock).mockResolvedValue(mockSubscription)

      // Mock OpenAI response
      const mockOpenAIResponse = {
choices: [{
message: {
content: 'Test response' } }],
usage: {
prompt_tokens: 10,
completion_tokens: 20,
total_tokens: 30
        }
      }

      // Mock usage logging
      (AIUsageLog.create as jest.Mock).mockResolvedValue({})
      (AICreditTransaction.create as jest.Mock).mockResolvedValue({})

      const result = await OpenAIService.generateChatCompletion({
userId: mockUserId,
prompt: 'Test prompt'
      })

      expect(result.success).toBe(true)
      expect(result.content).toBe('Test response');
      expect(result.creditsCharged).toBe(1);
      expect(mockSubscription.deductCredits).toHaveBeenCalledWith(1);
      expect(AIUsageLog.create).toHaveBeenCalled();
    });

    it('should throw error when user has insufficient credits', async () => {
      // Mock feature config
      (AIFeatureConfig.findOne as jest.Mock).mockResolvedValue({
featureName: 'chat_assistant',
creditsPerUse: 1,
isFeatureActive: () => true
      })

      // Mock subscription with insufficient credits
      const mockSubscription = {
id: mockSubscriptionId,
userId: mockUserId,
creditsRemaining: 0,
isActive: () => true,
hasEnoughCredits: jest.fn().mockReturnValue(false)
      }
      (AISubscription.findOne as jest.Mock).mockResolvedValue(mockSubscription)

      await expect(
        OpenAIService.generateChatCompletion({
userId: mockUserId,
prompt: 'Test prompt'
        })
      ).rejects.toThrow('Insufficient credits')
    })

    it('should refund credits when OpenAI API call fails', async () => {
      // Mock feature config
      (AIFeatureConfig.findOne as jest.Mock).mockResolvedValue({
featureName: 'chat_assistant',
creditsPerUse: 1,
isFeatureActive: () => true
      })

      // Mock subscription
      const mockSubscription = {
id: mockSubscriptionId,
userId: mockUserId,
creditsRemaining: 100,
isActive: () => true,
hasEnoughCredits: jest.fn().mockReturnValue(true),
deductCredits: jest.fn().mockResolvedValue(undefined),
addCredits: jest.fn().mockResolvedValue(undefined)
      }
      (AISubscription.findOne as jest.Mock).mockResolvedValue(mockSubscription)
      (AISubscription.findByPk as jest.Mock).mockResolvedValue(mockSubscription)

      // Mock OpenAI to throw error
      const OpenAI = require('openai')
      const mockOpenAIInstance = new OpenAI()
      mockOpenAIInstance.chat.completions.create.mockRejectedValue(new Error('API Error'))

      await expect(
        OpenAIService.generateChatCompletion({
userId: mockUserId,
prompt: 'Test prompt'
        })
      ).rejects.toThrow('API Error')

      expect(mockSubscription.addCredits).toHaveBeenCalledWith(1);
      expect(AICreditTransaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
transactionType: 'refund',
creditsAmount: 1
        })
      );
    });
  });

  describe('moderateContent', () => {
    it('should successfully moderate content', async () => {
      const mockModerationResponse = {
results: [
          {
flagged: false,
categories: {
hate: false,
              'hate/threatening': false,
harassment: false,
              'harassment/threatening': false,
              'self-harm': false,
sexual: false,
              'sexual/minors': false,
violence: false,
              'violence/graphic': false
            }
          }
        ]
      };

      const OpenAI = require('openai');
      const mockOpenAIInstance = new OpenAI();
      mockOpenAIInstance.moderations.create.mockResolvedValue(mockModerationResponse);

      const result = await OpenAIService.moderateContent('Safe content');

      expect(result.flagged).toBe(false);
      expect(result.categories.hate).toBe(false);
    });

    it('should handle moderation API errors gracefully', async () => {
      const OpenAI = require('openai');
      const mockOpenAIInstance = new OpenAI();
      mockOpenAIInstance.moderations.create.mockRejectedValue(new Error('API Error'));

      const result = await OpenAIService.moderateContent('Test content');

      // Should return safe defaults on error
      expect(result.flagged).toBe(false)
    })
  })

  describe('getDailyUsageCount', () => {
    it('should return correct daily usage count', async () => {
      const mockCount = 5
      (AIUsageLog.count as jest.Mock).mockResolvedValue(mockCount);

      const count = await OpenAIService.getDailyUsageCount(mockUserId, 'chat');

      expect(count).toBe(mockCount);
      expect(AIUsageLog.count).toHaveBeenCalledWith(
        expect.objectContaining({
where: expect.objectContaining({
userId: mockUserId,
featureType: 'chat'
          })
        })
      );
    });
  });

  describe('getRemainingDailyLimit', () => {
    it('should return remaining daily limit', async () => {
      (AIFeatureConfig.findOne as jest.Mock).mockResolvedValue({
featureName: 'chat_assistant',
maxRequestsPerDay: 100
      });

      (AIUsageLog.count as jest.Mock).mockResolvedValue(10);

      const remaining = await OpenAIService.getRemainingDailyLimit(mockUserId, 'chat_assistant');

      expect(remaining).toBe(90); // 100 - 10
    })

    it('should return Infinity when no limit is set', async () => {
      (AIFeatureConfig.findOne as jest.Mock).mockResolvedValue({
featureName: 'chat_assistant',
maxRequestsPerDay: null
      })

      const remaining = await OpenAIService.getRemainingDailyLimit(mockUserId, 'chat_assistant')

      expect(remaining).toBe(Infinity)
    });
  });
});
