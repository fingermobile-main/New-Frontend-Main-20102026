/**
 * AI Controller
 * Complete implementation for AI feature management and usage tracking
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');
const OpenAI = require('openai');

// Initialize OpenAI client (if API key configured)
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

class AIController {
  /**
   * GET /api/ai/features
   * Get available AI features
   */
  async getFeatures(req, res) {
    try {
      const result = await pool.query(
        `SELECT 
          id,
          name,
          description,
          category,
          is_enabled,
          pricing_per_request,
          max_tokens,
          created_at
         FROM ai_features
         WHERE is_enabled = true
         ORDER BY category, name`
      );

      res.json({
        success: true,
        data: result.rows, 
        count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in AIController.getFeatures:', error);
      res.status(500).json({
        success: false, 
        message: 'Failed to get AI features', 
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/ai/chat
   * Send chat completion request
   */
  async chatCompletion(req, res) {
    try {
      const userId = req.user?.id;
      const { messages, model = 'gpt-3.5-turbo', maxTokens = 500 } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({
          success: false, message: 'Messages array is required'
        });
      }

      // Check user's AI credit balance
      const balanceResult = await pool.query(
        'SELECT COALESCE(SUM(credit_change), 0) as balance FROM ai_credit_transactions WHERE user_id = $1',
        [userId]
      );

      const balance = parseFloat(balanceResult.rows[0].balance);

      if (balance <= 0) {
        return res.status(402).json({
          success: false, message: 'Insufficient AI credits',
          data: { currentBalance: balance }
        });
      }

      if (!openai) {
        return res.status(503).json({
          success: false, message: 'AI service not configured'
        });
      }

      // Make OpenAI API call
      const completion = await openai.chat.completions.create({
        model: model,
        messages: messages, 
        max_tokens: maxTokens
      });

      const responseText = completion.choices[0]?.message?.content || '';
      const tokensUsed = completion.usage?.total_tokens || 0;

      // Calculate cost (simplified: 1 credit per 1000 tokens)
      const cost = -(tokensUsed / 1000);

      // Record transaction
      await pool.query(
        `INSERT INTO ai_credit_transactions 
         (user_id, credit_change, reason, metadata, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [
          userId,
          cost,
          `Chat completion using ${model}`,
          JSON.stringify({ tokensUsed, model })
        ]
      );

      res.json({
        success: true,
        data: {
          response: responseText,
          model: model,
          tokensUsed: tokensUsed,
          cost: cost, 
          remainingBalance: balance + cost
        }
      });
    } catch (error) {
      logger.error('Error in AIController.chatCompletion:', error);
      res.status(500).json({
        success: false, 
        message: 'Failed to complete chat request', 
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/ai/image/generate
   * Generate image using AI
   */
  async generateImage(req, res) {
    try {
      const userId = req.user?.id;
      const { prompt, size = '1024x1024', n = 1 } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (!prompt) {
        return res.status(400).json({
          success: false, message: 'Prompt is required'
        });
      }

      // Check balance
      const balanceResult = await pool.query(
        'SELECT COALESCE(SUM(credit_change), 0) as balance FROM ai_credit_transactions WHERE user_id = $1',
        [userId]
      );

      const balance = parseFloat(balanceResult.rows[0].balance);

      if (balance < 10) { // Image generation costs more
        return res.status(402).json({
          success: false, message: 'Insufficient AI credits for image generation',
          data: { currentBalance: balance, required: 10 }
        });
      }

      if (!openai) {
        return res.status(503).json({
          success: false, message: 'AI service not configured'
        });
      }

      // Generate image
      const response = await openai.images.generate({
        prompt: prompt,
        n: n,
        size: size
      });

      const imageUrl = response.data[0]?.url;

      // Record transaction (10 credits per image)
      await pool.query(
        `INSERT INTO ai_credit_transactions 
         (user_id, credit_change, reason, metadata, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [
          userId,
          -10, // Fixed: Added missing comma
          'Image generation',
          JSON.stringify({ prompt, size })
        ]
      );

      res.json({
        success: true,
        data: {
          imageUrl: imageUrl,
          cost: -10, // Fixed: Added missing comma
          remainingBalance: balance - 10
        }
      });
    } catch (error) {
      logger.error('Error in AIController.generateImage:', error);
      res.status(500).json({
        success: false, 
        message: 'Failed to generate image', 
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/ai/usage
   * Get AI usage statistics
   */
  async getUsage(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const { timeframe = '30d' } = req.query;

      let interval;
      switch (timeframe) {
        case '7d': interval = '7 days'; break;
        case '30d': interval = '30 days'; break;
        case '90d': interval = '90 days'; break;
        default: interval = '30 days';
      }

      // Fixed: Added missing commas between SELECT items and repaired the parameter interval placeholder
      const result = await pool.query(
        `SELECT 
          COUNT(*) as total_requests,
          SUM(CASE WHEN reason LIKE '%Chat%' THEN 1 ELSE 0 END) as chat_requests, 
          SUM(CASE WHEN reason LIKE '%Image%' THEN 1 ELSE 0 END) as image_requests,
          SUM(credit_change) as total_credits_spent, 
          AVG(ABS(credit_change)) as avg_cost_per_request
         FROM ai_credit_transactions
         WHERE user_id = $1
         AND created_at >= NOW() - CAST($2 AS INTERVAL)`, 
        [userId, interval]
      );

      const stats = result.rows[0];

      res.json({
        success: true,
        data: {
          timeframe: timeframe,
          totalRequests: parseInt(stats.total_requests) || 0,
          chatRequests: parseInt(stats.chat_requests) || 0,
          imageRequests: parseInt(stats.image_requests) || 0,
          totalCreditsSpent: parseFloat(stats.total_credits_spent) || 0, // Fixed: Added missing comma
          avgCostPerRequest: parseFloat(stats.avg_cost_per_request) || 0
        }
      });
    } catch (error) {
      logger.error('Error in AIController.getUsage:', error);
      res.status(500).json({
        success: false, 
        message: 'Failed to get AI usage statistics', 
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/ai/balance
   * Get AI credit balance
   */
  async getBalance(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const balance = await this.getUserBalance(userId);

      res.json({
        success: true,
        data: {
          userId,
          balance: balance, 
          currency: 'credits'
        }
      });
    } catch (error) {
      logger.error('Error in AIController.getBalance:', error);
      res.status(500).json({
        success: false, 
        message: 'Failed to get AI balance', 
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/ai/purchase-credits
   * Purchase AI credits
   */
  async purchaseCredits(req, res) {
    try {
      const userId = req.user?.id;
      const { amount, paymentMethod } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false, message: 'Valid amount is required'
        });
      }

      // In production, integrate with payment gateway here
      // For now, just add credits
      await pool.query(
        `INSERT INTO ai_credit_transactions 
         (user_id, credit_change, reason, metadata, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [
          userId,
          amount, // Fixed: Added missing comma
          'Credit purchase',
          JSON.stringify({ paymentMethod })
        ]
      );

      const newBalance = await this.getUserBalance(userId);

      res.json({
        success: true,
        message: `Successfully purchased ${amount} AI credits`,
        data: {
          creditsAdded: amount, 
          newBalance: newBalance
        }
      });
    } catch (error) {
      logger.error('Error in AIController.purchaseCredits:', error);
      res.status(500).json({
        success: false, 
        message: 'Failed to purchase credits', 
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Helper: Get user balance
   */
  async getUserBalance(userId) { // Fixed parameters formatting
    try {
      const result = await pool.query(
        'SELECT COALESCE(SUM(credit_change), 0) as balance FROM ai_credit_transactions WHERE user_id = $1',
        [userId]
      );
      return parseFloat(result.rows[0].balance);
    } catch (error) {
      logger.error('Error in AIController.getUserBalance:', error); // Fixed undefined variable
      throw error;
    }
  }
}

// Recommend ensuring context binding if referenced inside router handlers like: 
// router.get('/balance', (req, res) => AIController.getBalance(req, res));
module.exports = new AIController();