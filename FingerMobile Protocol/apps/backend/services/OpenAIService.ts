import OpenAI from 'openai';
import AISubscription from '../models/AISubscriptionModel';
import AIUsageLog from '../models/AIUsageLogModel';
import AICreditTransaction from '../models/AICreditTransactionModel';
import AIFeatureConfig from '../models/AIFeatureConfigModel';
import { Op } from 'sequelize';
import logger from '../utils/logger';

interface ChatParams {
  userId: string;
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

interface ImageParams {
  userId: string;
  prompt: string;
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
}

interface TranslationParams {
  userId: string;
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

interface ModerationResult {
  flagged: boolean;
  categories: {
    hate: boolean;
    'hate/threatening': boolean;
    harassment: boolean;
    'harassment/threatening': boolean;
    'self-harm': boolean;
    sexual: boolean;
    'sexual/minors': boolean;
    violence: boolean;
    'violence/graphic': boolean;
  };
}

class OpenAIService {
  private openai: OpenAI;
  private readonly DEFAULT_MODEL = 'gpt-4o';
  private readonly CHEAP_MODEL = 'gpt-4o-mini';

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORGANIZATION
    });
  }

  /**
   * Generate chat completion with credit management
   */
  async generateChatCompletion(params: ChatParams): Promise<any> {
    const { userId, prompt, model = this.DEFAULT_MODEL, maxTokens = 1000, temperature = 0.7 } = params;

    // Get feature config
    const featureConfig = await AIFeatureConfig.findOne({
      where: { featureName: 'chat_assistant' }
    });

    if (!featureConfig || !featureConfig.isFeatureActive()) {
      throw new Error('Chat assistant feature is not available');
    }

    // Check user subscription and credits
    const subscription = await this.validateUserSubscription(userId, featureConfig.creditsPerUse);

    // Reserve credits
    await this.reserveCredits(subscription.id, featureConfig.creditsPerUse, userId);

    try {
      // Call OpenAI API
      const response = await this.openai.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature
      });

      const completion = response.choices[0]?.message?.content || '';
      const usage = response.usage;

      // Log successful usage
      await this.logUsage({
        userId,
        subscriptionId: subscription.id,
        featureType: 'chat',
        modelUsed: model,
        promptTokens: usage?.prompt_tokens,
        completionTokens: usage?.completion_tokens,
        totalTokens: usage?.total_tokens,
        creditsCharged: featureConfig.creditsPerUse,
        responseStatus: 'success',
        requestMetadata: { prompt_length: prompt.length, response_length: completion.length }
      });

      return {
        success: true,
        content: completion,
        tokensUsed: usage?.total_tokens,
        creditsCharged: featureConfig.creditsPerUse
      };
    } catch (error: any) {
      // Refund credits on failure
      const errorMessage = error instanceof Error ? error.message : String(error);
      await this.refundCredits(subscription.id, featureConfig.creditsPerUse, userId, errorMessage);

      throw error;
    }
  }

  /**
   * Generate image using DALL-E 3
   */
  async generateImage(params: ImageParams): Promise<any> {
    const { userId, prompt, size = '1024x1024', quality = 'standard' } = params;

    // Get feature config
    const featureConfig = await AIFeatureConfig.findOne({
      where: { featureName: 'image_generation' }
    });

    if (!featureConfig || !featureConfig.isFeatureActive()) {
      throw new Error('Image generation feature is not available');
    }

    // Check user subscription and credits
    const subscription = await this.validateUserSubscription(userId, featureConfig.creditsPerUse);

    // Reserve credits
    await this.reserveCredits(subscription.id, featureConfig.creditsPerUse, userId);

    try {
      // Call DALL-E 3 API
      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size,
        quality
      });

      const imageUrl = response.data?.[0]?.url;

      // Log successful usage
      await this.logUsage({
        userId,
        subscriptionId: subscription.id,
        featureType: 'image',
        modelUsed: 'dall-e-3',
        creditsCharged: featureConfig.creditsPerUse,
        responseStatus: 'success',
        requestMetadata: { image_size: size, quality }
      });

      return {
        success: true,
        imageUrl,
        creditsCharged: featureConfig.creditsPerUse
      };
    } catch (error: any) {
      // Refund credits on failure
      const errorMessage = error instanceof Error ? error.message : String(error);
      await this.refundCredits(subscription.id, featureConfig.creditsPerUse, userId, errorMessage);

      throw error;
    }
  }

  /**
   * Moderate content using OpenAI Moderation API (FREE)
   */
  async moderateContent(content: string): Promise<ModerationResult> {
    try {
      const response = await this.openai.moderations.create({
        input: content
      });

      const result = response.results[0];
      if (!result) {
        throw new Error('No moderation results returned');
      }

      return {
        flagged: result.flagged,
        categories: result.categories
      };
    } catch (error) {
      logger.error('Moderation API error:', error);
      // If moderation fails, allow content but log the error
      return {
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
      };
    }
  }

  /**
   * Translate text using GPT-4o-mini (cost-effective)
   */
  async translateText(params: TranslationParams): Promise<string> {
    const { userId, text, targetLanguage, sourceLanguage = 'auto' } = params;

    // Get feature config
    const featureConfig = await AIFeatureConfig.findOne({
      where: { featureName: 'translation' }
    });

    if (!featureConfig || !featureConfig.isFeatureActive()) {
      throw new Error('Translation feature is not available');
    }

    // Check user subscription and credits
    const subscription = await this.validateUserSubscription(userId, featureConfig.creditsPerUse);

    // Reserve credits
    await this.reserveCredits(subscription.id, featureConfig.creditsPerUse, userId);

    try {
      const systemPrompt = `You are a professional translator. Translate the following text from ${sourceLanguage === 'auto' ? 'detected language' : sourceLanguage} to ${targetLanguage}. Provide only the translation without any additional text or explanations.`;

      const response = await this.openai.chat.completions.create({
        model: this.CHEAP_MODEL, // Use cheaper model for translation
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0.3
      });

      const translation = response.choices[0]?.message?.content || '';
      const usage = response.usage;

      // Log successful usage
      await this.logUsage({
        userId,
        subscriptionId: subscription.id,
        featureType: 'translation',
        modelUsed: this.CHEAP_MODEL,
        promptTokens: usage?.prompt_tokens,
        completionTokens: usage?.completion_tokens,
        totalTokens: usage?.total_tokens,
        creditsCharged: featureConfig.creditsPerUse,
        responseStatus: 'success',
        requestMetadata: { source_language: sourceLanguage, target_language: targetLanguage, text_length: text.length }
      });

      return translation;
    } catch (error: any) {
      // Refund credits on failure
      const errorMessage = error instanceof Error ? error.message : String(error);
      await this.refundCredits(subscription.id, featureConfig.creditsPerUse, userId, errorMessage);

      throw error;
    }
  }

  /**
   * Validate user subscription and credits
   */
  private async validateUserSubscription(userId: string, requiredCredits: number): Promise<AISubscription> {
    const subscription = await AISubscription.findOne({
      where: {
        userId,
        status: 'active'
      }
    });

    if (!subscription) {
      throw new Error('No active AI subscription found. Please subscribe to use AI features.');
    }

    if (!subscription.isActive()) {
      throw new Error('Your AI subscription has expired. Please renew to continue.');
    }

    if (!subscription.hasEnoughCredits(requiredCredits)) {
      throw new Error(`Insufficient credits. You have ${subscription.creditsRemaining} credits, but need ${requiredCredits}.`);
    }

    return subscription;
  }

  /**
   * Reserve credits before processing request
   */
  private async reserveCredits(subscriptionId: string, credits: number, userId: string): Promise<void> {
    const subscription = await AISubscription.findByPk(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    await subscription.deductCredits(credits);

    // Log transaction
    await AICreditTransaction.create({
      userId,
      subscriptionId,
      transactionType: 'usage',
      creditsAmount: -credits,
      balanceBefore: subscription.creditsRemaining + credits,
      balanceAfter: subscription.creditsRemaining,
      description: `Reserved ${credits} credits for AI feature usage`
    });
  }

  /**
   * Refund credits if request fails
   */
  private async refundCredits(subscriptionId: string, credits: number, userId: string, reason: string): Promise<void> {
    const subscription = await AISubscription.findByPk(subscriptionId);
    if (!subscription) {
      return;
    }

    await subscription.addCredits(credits);

    // Log refund transaction
    await AICreditTransaction.create({
      userId,
      subscriptionId,
      transactionType: 'refund',
      creditsAmount: credits,
      balanceBefore: subscription.creditsRemaining - credits,
      balanceAfter: subscription.creditsRemaining,
      description: `Refunded ${credits} credits due to failed request: ${reason}`
    });
  }

  /**
   * Log AI usage
   */
  private async logUsage(params: {
    userId: string;
    subscriptionId?: string;
    featureType: string;
    modelUsed?: string;
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    creditsCharged: number;
    responseStatus: string;
    errorMessage?: string;
    ipAddress?: string;
    requestMetadata?: any;
  }): Promise<void> {
    await AIUsageLog.create({
      userId: params.userId,
      subscriptionId: params.subscriptionId,
      featureType: params.featureType,
      modelUsed: params.modelUsed,
      promptTokens: params.promptTokens,
      completionTokens: params.completionTokens,
      totalTokens: params.totalTokens,
      creditsCharged: params.creditsCharged,
      responseStatus: params.responseStatus,
      errorMessage: params.errorMessage,
      ipAddress: params.ipAddress,
      requestMetadata: params.requestMetadata
    });
  }

  /**
   * Get user's daily usage count for a feature
   */
  async getDailyUsageCount(userId: string, featureType: string): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const count = await AIUsageLog.count({
      where: {
        userId,
        featureType,
        createdAt: {
          [Op.gte]: startOfDay
        }
      }
    });

    return count;
  }

  /**
   * Get user's remaining daily limit for a feature
   */
  async getRemainingDailyLimit(userId: string, featureType: string): Promise<number> {
    const featureConfig = await AIFeatureConfig.findOne({
      where: { featureName: featureType }
    });

    if (!featureConfig || !featureConfig.maxRequestsPerDay) {
      return Infinity; // No limit
    }

    const usedToday = await this.getDailyUsageCount(userId, featureType);
    return Math.max(0, featureConfig.maxRequestsPerDay - usedToday);
  }
}

export default new OpenAIService();
