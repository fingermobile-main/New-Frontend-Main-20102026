const db = require('../database/connection');
const logger = require('../utils/logger');

class AIContentGenerationService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
    this.baseUrl = process.env.AI_API_URL || 'https://api.openai.com/v1';
  }

  /**
   * Generate content using AI
   */
  async generateContent(prompt, options = {}) {
    try {
      const {
        model = 'gpt-4',
        maxTokens = 500,
        temperature = 0.7,
        userId = null,
        contentType: _contentType = 'text'
      } = options;

      // Check user's AI credit balance
      if (userId) {
        const hasCredits = await this.checkAICredits(userId);
        if (!hasCredits) {
          throw new Error('Insufficient AI credits');
        }
      }

      // Log generation request
      const generationId = await this.logGenerationRequest(userId, prompt, options);

      // Call AI API
      const result = await this.callAIAPI(prompt, { model, maxTokens, temperature });

      // Deduct credits
      if (userId) {
        await this.deductAICredits(userId, result.tokensUsed);
      }

      // Update generation record
      await this.updateGenerationResult(generationId, result);

      return {
        success: true,
        content: result.content,
        tokensUsed: result.tokensUsed,
        generationId
      };
    } catch (error) {
      logger.error('Error generating AI content:', error);
      throw error;
    }
  }

  /**
   * Generate image description
   */
  async generateImageDescription(_imageUrl) {
    try {
      const prompt = 'Describe this image in detail, including objects, colors, mood, and context.';

      const result = await this.callAIAPI(prompt, {
        model: 'gpt-4-vision-preview',
        maxTokens: 300
      });

      return {
        success: true,
        description: result.content
      };
    } catch (error) {
      logger.error('Error generating image description:', error);
      throw error;
    }
  }

  /**
   * Generate playlist recommendations
   */
  async generatePlaylistRecommendations(userPreferences, limit = 10) {
    try {
      const prompt = `Based on these music preferences: ${JSON.stringify(userPreferences)} 
      recommend ${limit} songs with title, artist, genre, and mood.`;

      const result = await this.callAIAPI(prompt, {
        model: 'gpt-4',
        maxTokens: 800
      });

      // Parse recommendations from AI response
      const recommendations = this.parsePlaylistRecommendations(result.content);

      return {
        success: true,
        recommendations,
        count: recommendations.length
      };
    } catch (error) {
      logger.error('Error generating playlist recommendations:', error);
      throw error;
    }
  }

  /**
   * Generate content summary
   */
  async generateSummary(content, maxLength = 200) {
    try {
      const prompt = `Summarize the following content in ${maxLength} characters or less: ${content.substring(0, 2000)}`;

      const result = await this.callAIAPI(prompt, {
        model: 'gpt-3.5-turbo',
        maxTokens: 100,
        temperature: 0.3
      });

      return {
        success: true,
        summary: result.content
      };
    } catch (error) {
      logger.error('Error generating summary:', error);
      throw error;
    }
  }

  /**
   * Generate hashtags for content
   */
  async generateHashtags(content, count = 10) {
    try {
      const prompt = `Generate ${count} relevant hashtags for this content: ${content.substring(0, 500)}`;

      const result = await this.callAIAPI(prompt, {
        model: 'gpt-3.5-turbo',
        maxTokens: 100
      });

      const hashtags = this.extractHashtags(result.content);

      return {
        success: true,
        hashtags
      };
    } catch (error) {
      logger.error('Error generating hashtags:', error);
      throw error;
    }
  }

  /**
   * Check user's AI credit balance
   */
  async checkAICredits(userId) {
    try {
      const result = await db.query(
        'SELECT ai_credit_balance FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) return false;

      return result.rows[0].ai_credit_balance > 0;
    } catch (error) {
      logger.error('Error checking AI credits:', error);
      return false;
    }
  }

  /**
   * Deduct AI credits from user balance
   */
  async deductAICredits(userId, tokensUsed) {
    try {
      const costPerToken = 0.001; // $0.001 per token
      const cost = tokensUsed * costPerToken;

      await db.query(
        `UPDATE users 
        SET ai_credit_balance = ai_credit_balance - $1,
            updated_at = NOW()
        WHERE id = $2`,
        [cost, userId]
      );

      // Log transaction
      await db.query(
        `INSERT INTO ai_credit_transactions 
        (user_id, transaction_type, amount, description, created_at)
        VALUES ($1, 'debit', $2, 'AI content generation', NOW())`,
        [userId, cost]
      );
    } catch (error) {
      logger.error('Error deducting AI credits:', error);
    }
  }

  /**
   * Log AI generation request
   */
  async logGenerationRequest(userId, prompt, options) {
    try {
      const result = await db.query(
        `INSERT INTO ai_generations 
        (user_id, prompt, model, options, status, created_at)
        VALUES ($1, $2, $3, $4, 'pending', NOW())
        RETURNING id`,
        [userId, prompt, options.model, JSON.stringify(options)]
      );

      return result.rows[0].id;
    } catch (error) {
      logger.error('Error logging generation request:', error);
      return null;
    }
  }

  /**
   * Update generation result
   */
  async updateGenerationResult(generationId, result) {
    try {
      await db.query(
        `UPDATE ai_generations 
        SET content = $1, tokens_used = $2, status = 'completed', completed_at = NOW()
        WHERE id = $3`,
        [result.content, result.tokensUsed, generationId]
      );
    } catch (error) {
      logger.error('Error updating generation result:', error);
    }
  }

  /**
   * Call external AI API
   */
  async callAIAPI(prompt, _options) {
    try {
    // Simulate AI API call (replace with actual API integration)
    // In production, use fetch or axios to call OpenAI/Azure/Anthropic API

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            content: `Generated content for: ${prompt.substring(0, 50)}...`,
            tokensUsed: Math.floor(Math.random() * 100) + 50
          });
        }, 1000);
      });

    /* Production implementation:
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
      body: JSON.stringify({
        model: options.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: options.maxTokens,
        temperature: options.temperature
      })
    });

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      tokensUsed: data.usage.total_tokens
    };
    */
    } catch (error) {
      logger.error('callAIAPI error:', error);
      throw error;
    }
  }

  /**
   * Parse playlist recommendations from AI response
   */
  parsePlaylistRecommendations(text) {
    // Simple parsing logic - in production, use structured output format
    const lines = text.split('\n').filter(line => line.trim());
    return lines.slice(0, 10).map((line, index) => ({
      id: index + 1,
      title: line.replace(/^\d+[.\-)]\s*/, '').trim(),
      artist: 'Unknown',
      genre: 'Unknown'
    }));
  }

  /**
   * Extract hashtags from AI response
   */
  extractHashtags(text) {
    const matches = text.match(/#\w+/g);
    return matches ? matches.slice(0, 10) : [];
  }

  /**
   * Get generation history for user
   */
  async getGenerationHistory(userId, limit = 20) {
    try {
      const result = await db.query(
        `SELECT * FROM ai_generations 
        WHERE user_id = $1 
        ORDER BY created_at DESC 
        LIMIT $2`,
        [userId, limit]
      );

      return result.rows;
    } catch (error) {
      logger.error('Error getting generation history:', error);
      return [];
    }
  }
}

module.exports = new AIContentGenerationService();
