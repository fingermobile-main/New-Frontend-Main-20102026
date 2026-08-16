/*
 * FingerMobile Protocol™ - Content Moderation Service
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

const ModerationModel = require('../models/ContentManagerModel');

class ModerationService {
  async moderateContent(content, rules = {}) {
    const results = {
      approved: true,
      reasons: [],
      confidence: 0,
    };

    // Check against predefined rules
    if (this.containsExplicitContent(content)) {
      results.approved = false;
      results.reasons.push('Explicit content detected');
      results.confidence += 0.8;
    }

    if (this.checkCopyright(content)) {
      results.approved = false;
      results.reasons.push('Copyright infringement detected');
      results.confidence += 0.7;
    }

    if (this.containsHarmfulContent(content)) {
      results.approved = false;
      results.reasons.push('Harmful content detected');
      results.confidence += 0.9;
    }

    if (this.hasSpamIndicators(content)) {
      results.approved = false;
      results.reasons.push('Spam indicators detected');
      results.confidence += 0.6;
    }

    return results;
  }

  containsExplicitContent(content) {
    // Simple keyword-based check - in production, use AI analysis
    const explicitKeywords = [
      'explicit', 'nudity', 'pornography', 'adult', 'sexually explicit'
    ];
    
    const textToCheck = (content.title || '') + ' ' + (content.description || '') + ' ' + (content.tags || []).join(' ');
    return explicitKeywords.some(keyword => 
      textToCheck.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  checkCopyright(content) {
    // Placeholder for copyright checking
    // In production, integrate with a copyright checking service
    return false;
  }

  containsHarmfulContent(content) {
    // Simple keyword-based check for harmful content
    const harmfulKeywords = [
      'hate speech', 'violence', 'threatening', 'harassment', 'discrimination'
    ];
    
    const textToCheck = (content.title || '') + ' ' + (content.description || '') + ' ' + (content.tags || []).join(' ');
    return harmfulKeywords.some(keyword => 
      textToCheck.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  hasSpamIndicators(content) {
    // Check for spam indicators like excessive caps, repeated chars, etc.
    const textToCheck = (content.title || '') + ' ' + (content.description || '');
    
    // Check for excessive capitalization
    const capsRatio = (textToCheck.match(/[A-Z]/g) || []).length / textToCheck.length;
    
    // Check for excessive repetition (more than 3 consecutive identical chars)
    const hasRepetition = /(.)\1{3,}/.test(textToCheck);
    
    return capsRatio > 0.7 || hasRepetition;
  }

  async getModerationRecommendations(contentId) {
    // Fetch content and analyze for recommendations
    const content = await ModerationModel.getContentById(contentId);
    
    const recommendations = [];
    
    if (content.description && content.description.length < 10) {
      recommendations.push('Add more descriptive text to your content');
    }
    
    if (!content.tags || content.tags.length < 2) {
      recommendations.push('Add relevant tags to improve discoverability');
    }
    
    if (content.title && content.title.length > 100) {
      recommendations.push('Consider shortening your title for better readability');
    }
    
    return recommendations;
  }
}

module.exports = new ModerationService();