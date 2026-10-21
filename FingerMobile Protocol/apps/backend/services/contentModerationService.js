const logger = require('../utils/logger');
const { ContentRiskAssessment, ChildConsentLog, DataPortabilityRequest } = require('../models/ContentModeration');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

class ContentModerationService {
  // Calculate risk score using the formula from the document
  calculateRiskScore(contentText, authorId) {
    // Extract factors based on content analysis
    const factuality = this.analyzeFactuality(contentText);
    const harmPotential = this.analyzeHarmPotential(contentText);
    const maliceIndex = this.analyzeMaliceIndex(contentText, authorId);
    const contextualModifiers = this.analyzeContextualModifiers(contentText);

    // Apply the formula: S_risk = (w1 * Factuality) + (w2 * Harm Potential) + (w3 * Malice Index) - (w4 * Contextual Modifiers)
    const riskScore = (1.0 * factuality) + (1.2 * harmPotential) + (1.5 * maliceIndex) - (0.8 * contextualModifiers);

    // Ensure the score is between 0 and 100
    return Math.max(0, Math.min(100, Math.round(riskScore)));
  }

  // Analyze if content contains factual assertions vs opinions
  analyzeFactuality(content) {
    // Look for linguistic markers of factual vs opinion statements
    const factualMarkers = ['is', 'did', 'was', 'are', 'were', 'has', 'have', 'will', 'shall'];
    const opinionMarkers = ['think', 'feel', 'believe', 'seems', 'appears', 'maybe', 'perhaps', 'opinion', 'suggest'];

    const words = content.toLowerCase().split(/\W+/);
    let factualCount = 0;
    let opinionCount = 0;

    words.forEach(word => {
      if (factualMarkers.includes(word)) factualCount++;
      if (opinionMarkers.includes(word)) opinionCount++;
    });

    // Return a score from 0-100 based on the ratio of factual to opinion markers
    const totalMarkers = factualCount + opinionCount;
    if (totalMarkers === 0) return 50; // Neutral score if no markers found

    return Math.min(100, Math.round((factualCount / totalMarkers) * 100));
  }

  // Analyze potential harm in the content
  analyzeHarmPotential(content) {
    // Define harmful categories and their weights
    const harmCategories = [
      { keywords: ['fraud', 'thief', 'steal', 'rob'], weight: 90 },
      { keywords: ['sexual', 'harassment', 'abuse', 'assault'], weight: 95 },
      { keywords: ['liar', 'cheat', 'deceive'], weight: 70 },
      { keywords: ['bad', 'wrong', 'terrible', 'awful'], weight: 40 },
      { keywords: ['stupid', 'fool', 'idiot'], weight: 60 }
    ];

    let maxHarmScore = 0;
    const lowerContent = content.toLowerCase();

    harmCategories.forEach(category => {
      category.keywords.some(keyword => {
        if (lowerContent.includes(keyword)) {
          maxHarmScore = Math.max(maxHarmScore, category.weight);
          return true;
        }
        return false;
      });
    });

    return maxHarmScore;
  }

  // Analyze the author's malice index based on history
  async analyzeMaliceIndex(content, authorId) {
    try {
      // Get user's history of flagged/risk content
      const flaggedContentCount = await ContentRiskAssessment.countDocuments({
        authorId,
        riskCategory: { $in: ['high', 'critical'] }
      });

      // Get total content count by user
      const totalContentCount = await ContentRiskAssessment.countDocuments({ authorId });

      // Base malice index on proportion of flagged content
      let maliceIndex = flaggedContentCount > 0 && totalContentCount > 0
        ? (flaggedContentCount / totalContentCount) * 100
        : 0;

      // Increase malice index if content contains particularly malicious phrases
      const maliciousPhrases = [
        'definitely', 'always', 'never', 'without doubt', 'absolutely',
        'proven fact', 'known truth', 'clearly', 'obviously'
      ];

      const lowerContent = content.toLowerCase();
      maliciousPhrases.forEach(phrase => {
        if (lowerContent.includes(phrase)) {
          maliceIndex += 10; // Increase for absolute statements
        }
      });

      // Cap the malice index at 100
      return Math.min(100, Math.round(maliceIndex));
    } catch (error) {
      logger.error('Error analyzing malice index:', error);
      return 0;
    }
  }

  // Analyze contextual modifiers that might reduce risk
  analyzeContextualModifiers(content) {
    const protectivePhrases = [
      'in my opinion', 'i think', 'apparently', 'allegedly',
      'reportedly', 'seems like', 'possibly', 'potentially'
    ];

    let modifierScore = 0;
    const lowerContent = content.toLowerCase();

    protectivePhrases.forEach(phrase => {
      if (lowerContent.includes(phrase)) {
        modifierScore += 25; // Each phrase adds to the modifier score
      }
    });

    // Cap at 100
    return Math.min(100, modifierScore);
  }

  // Identify entities that might be targeted by the content
  identifyEntities(content) {
    // Simple regex-based entity extraction (in a real implementation, use NLP)
    const entityMatches = [];

    // Find capitalized words that might be names
    const namePattern = /\b[A-Z][a-z]{2,}\s+[A-Z][a-z]{2,}\b/g;
    const names = content.match(namePattern) || [];

    names.forEach(name => {
      entityMatches.push({
        entityType: 'private_individual',
        entityName: name.trim(),
        confidence: 70 // Medium confidence for name matching
      });
    });

    // Find corporate names
    const corpPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]*)*)\s+(?:Inc|Corp|Ltd|LLC|Company|Group)\b/g;
    const corps = content.match(corpPattern) || [];

    corps.forEach(corp => {
      entityMatches.push({
        entityType: 'corporate_entity',
        entityName: corp.trim(),
        confidence: 80
      });
    });

    return entityMatches;
  }

  // Assess content risk and decide action
  async assessContentRisk(contentText, authorId, contentType, contentId) {
    try {
      // Calculate risk factors
      const factuality = this.analyzeFactuality(contentText);
      const harmPotential = this.analyzeHarmPotential(contentText);
      const maliceIndex = await this.analyzeMaliceIndex(contentText, authorId);
      const contextualModifiers = this.analyzeContextualModifiers(contentText);

      // Calculate overall risk score
      const overallRiskScore = this.calculateRiskScore(contentText, authorId);

      // Identify entities
      const detectedTargets = this.identifyEntities(contentText);

      // Determine risk category based on score
      let riskCategory = 'low';
      if (overallRiskScore >= 70) riskCategory = 'critical';
      else if (overallRiskScore >= 40) riskCategory = 'high';
      else if (overallRiskScore >= 20) riskCategory = 'medium';

      // Determine action based on risk category
      let status = 'approved'; // Default to approved
      let flaggedReasons = [];

      if (overallRiskScore > 70) {
        status = 'quarantined'; // Hold for review
        flaggedReasons.push('High defamation risk');
      } else if (overallRiskScore > 40) {
        status = 'flagged'; // Flag for review
        flaggedReasons.push('Moderate defamation risk');
      }

      // Create risk assessment record
      const riskAssessment = new ContentRiskAssessment({
        contentId,
        contentType,
        authorId,
        originalContent: contentText,
        riskFactors: {
          factuality,
          harmPotential,
          maliceIndex,
          contextualModifiers
        },
        overallRiskScore,
        riskCategory,
        detectedTargets,
        status,
        flaggedReasons
      });

      await riskAssessment.save();

      // Update user's defamation risk score
      await User.findByIdAndUpdate(authorId, {
        defamationRiskScore: Math.min(100, Math.max(0, overallRiskScore))
      });

      return {
        riskAssessment,
        overallRiskScore,
        riskCategory,
        status,
        requiresReview: status !== 'approved'
      };
    } catch (error) {
      logger.error('Error assessing content risk:', error);
      throw error;
    }
  }

  // Pre-flight check for WebSockets (Synchronous Mode per Phase 3)
  async preFlightMessageCheck(authorId, contentText) {
    try {
      const overallRiskScore = this.calculateRiskScore(contentText, authorId);

      let isBlocked = false;
      let reason = null;

      if (overallRiskScore > 70) {
        isBlocked = true;
        reason = 'Message blocked due to critical defamation risk.';
      } else if (overallRiskScore > 40) {
        // We could block high as well, or just flag. Let's block > 70 for now.
        // Or if we want strict mode, block > 40.
        // The user asked to block toxic messages, we'll use 40 as the strict threshold for websockets.
        isBlocked = true;
        reason = 'Message blocked due to high toxicity or risk.';
      }

      return {
        allowed: !isBlocked,
        riskScore: overallRiskScore,
        reason: reason
      };
    } catch (error) {
      logger.error('Error in preFlightMessageCheck:', error);
      // Fail-open or fail-closed? Let's fail-open for stability, but log heavily.
      return { allowed: true, riskScore: 0, reason: null };
    }
  }

  // Handle child protection during registration
  async handleChildProtection(minorUserId, guardianContact) {
    try {
      // Create a unique consent ID
      const consentId = uuidv4();

      // Create a child consent log entry
      const consentLog = new ChildConsentLog({
        consentId,
        minorUserId,
        guardianContactHash: this.hashContact(guardianContact), // In a real system, properly encrypt this
        consentMethod: 'Email_OTP', // Default method
        consentTimestamp: new Date(),
        expirationDate: new Date(Date.now() + 18 * 365 * 24 * 60 * 60 * 1000) // Expires when child turns 18
      });

      await consentLog.save();

      // Update user to mark as minor with unverified status
      await User.findByIdAndUpdate(minorUserId, {
        isMinor: true,
        parentEmail: guardianContact,
        isParentVerified: false
      });

      return { success: true, consentLog };
    } catch (error) {
      logger.error('Error handling child protection:', error);
      throw error;
    }
  }

  // Create a data portability request
  async createDataPortabilityRequest(userId) {
    try {
      // Check if there's a recent request (within 30 days)
      const recentRequest = await DataPortabilityRequest.findOne({
        userId,
        requestedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        status: { $in: ['requested', 'processing', 'ready'] }
      });

      if (recentRequest) {
        return {
          success: false,
          message: 'A data export request is already in progress or was made recently'
        };
      }

      // Create a new request
      const requestId = uuidv4();
      const request = new DataPortabilityRequest({
        requestId,
        userId,
        status: 'requested'
      });

      await request.save();

      // In a real system, this would trigger a background job to prepare the data export
      // For now, we'll simulate the process
      setTimeout(async () => {
        try {
          // Simulate processing delay
          await DataPortabilityRequest.findOneAndUpdate(
            { requestId },
            {
              status: 'ready',
              processedAt: new Date(),
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
              downloadUrl: `/api/data-export/download/${requestId}`, // Placeholder URL
              dataSize: 1024 * 1024 * 5 // 5MB as example
            }
          );
        } catch (error) {
          logger.error(`Error updating data portability request ${requestId}:`, error);
        }
      }, 5000); // Simulate 5 seconds processing time

      return { success: true, request };
    } catch (error) {
      logger.error('Error creating data portability request:', error);
      throw error;
    }
  }

  // Helper to hash contact info (in a real system, use proper encryption)
  hashContact(contact) {
    // This is a simplified hash - in a real system use proper encryption
    return require('crypto').createHash('sha256').update(contact).digest('hex');
  }
}

module.exports = new ContentModerationService();
