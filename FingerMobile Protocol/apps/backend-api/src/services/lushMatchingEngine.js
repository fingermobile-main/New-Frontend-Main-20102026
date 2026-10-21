/**
 * Lush Matching Engine
 * Core service for matching users based on preferences, behavior, and compatibility
 */

const db = require('../config/database');

class LushMatchingEngine {
  /**
   * Find potential matches for a user
   */
  static async findPotentialMatches(userId, options = {}) {
    try {
      // Validate inputs
      if (!userId) {
        throw new Error('User ID is required');
      }

      const {
        limit = 10,
        offset = 0,
        recencyFilter = 7, // Only include users active in last N days
        excludeSelf = true,
        excludeMatched = true,
        excludeBlocked = true,
        excludeReported = true
      } = options;

      // Get user's preferences
      const userPreferences = await db.getUserPreferences(userId);
      if (!userPreferences) {
        throw new Error('User preferences not found');
      }

      // Get user's profile
      const userProfile = await db.getUser(userId);
      if (!userProfile) {
        throw new Error('User profile not found');
      }

      // Build query conditions based on user preferences
      const conditions = this.buildMatchingConditions(userPreferences, userProfile);

      // Find potential matches
      const potentialMatches = await db.findPotentialMatches(
        userId,
        conditions,
        {
          limit,
          offset,
          recencyFilter,
          excludeSelf,
          excludeMatched,
          excludeBlocked,
          excludeReported
        }
      );

      // Calculate match scores for each potential match
      const matchesWithScores = await Promise.all(
        potentialMatches.map(async (match) => {
          const matchScore = await this.calculateMatchScore(userId, match.id, userPreferences, userProfile);
          return {
            ...match,
            matchScore
          };
        })
      );

      // Sort by match score (descending)
      matchesWithScores.sort((a, b) => b.matchScore - a.matchScore);

      return {
        success: true,
        matches: matchesWithScores,
        count: matchesWithScores.length
      };
    } catch (error) {
      console.error('Error finding potential matches:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Build matching conditions from user preferences
   */
  static buildMatchingConditions(userPreferences, userProfile) {
    const conditions = {};

    // Gender preferences
    if (userPreferences.genderPreference && userPreferences.genderPreference.length > 0) {
      conditions.gender = userPreferences.genderPreference;
    }

    // Age range preferences
    if (userPreferences.ageRange) {
      conditions.ageMin = userPreferences.ageRange.min || 18;
      conditions.ageMax = userPreferences.ageRange.max || 80;
    }

    // Location preferences
    if (userPreferences.distance && userProfile.location) {
      conditions.maxDistance = userPreferences.distance;
      conditions.userLocation = userProfile.location;
    }

    // Interests preferences
    if (userPreferences.interests && userPreferences.interests.length > 0) {
      conditions.interests = userPreferences.interests;
    }

    // Values preferences
    if (userPreferences.values && userPreferences.values.length > 0) {
      conditions.values = userPreferences.values;
    }

    // Lifestyle preferences
    if (userPreferences.lifestyle && userPreferences.lifestyle.length > 0) {
      conditions.lifestyle = userPreferences.lifestyle;
    }

    // Personality preferences
    if (userPreferences.personality && userPreferences.personality.length > 0) {
      conditions.personality = userPreferences.personality;
    }

    // Show me preferences
    if (userPreferences.showMe) {
      conditions.showMe = userPreferences.showMe;
    }

    // Incognito mode
    if (userPreferences.incognitoMode) {
      conditions.incognito = true;
    }

    return conditions;
  }

  /**
   * Calculate match score between two users
   */
  static async calculateMatchScore(userAId, userBId, userAPreferences = null, userAProfile = null) {
    try {
      // Get profiles if not provided
      const profileA = userAProfile || await db.getUser(userAId);
      const profileB = await db.getUser(userBId);

      if (!profileA || !profileB) {
        throw new Error('User profiles not found');
      }

      // Get preferences if not provided
      const preferencesA = userAPreferences || await db.getUserPreferences(userAId);

      let score = 0;
      const maxScore = 100;

      // 1. Age compatibility (15 points max)
      if (profileA.age && profileB.age) {
        const ageDiff = Math.abs(profileA.age - profileB.age);
        if (ageDiff <= 3) score += 15; // Very close ages
        else if (ageDiff <= 5) score += 12; // Close ages
        else if (ageDiff <= 10) score += 8; // Similar ages
        else if (ageDiff <= 15) score += 4; // Acceptable difference
      }

      // 2. Location compatibility (15 points max)
      if (profileA.location && profileB.location) {
        const distance = this.calculateDistance(
          profileA.location.latitude,
          profileA.location.longitude,
          profileB.location.latitude,
          profileB.location.longitude
        );

        if (distance < 5) score += 15; // Very close
        else if (distance < 10) score += 12; // Close
        else if (distance < 20) score += 8; // Reasonable distance
        else if (distance < 50) score += 4; // Acceptable distance
      }

      // 3. Interest compatibility (25 points max)
      if (profileA.interests && profileB.interests) {
        const commonInterests = profileA.interests.filter(interest => 
          profileB.interests.includes(interest)
        );
        const interestScore = Math.min(commonInterests.length * 5, 25); // Max 25 points
        score += interestScore;
      }

      // 4. Values compatibility (20 points max)
      if (profileA.values && profileB.values) {
        const commonValues = profileA.values.filter(value => 
          profileB.values.includes(value)
        );
        const valuesScore = Math.min(commonValues.length * 4, 20); // Max 20 points
        score += valuesScore;
      }

      // 5. Lifestyle compatibility (15 points max)
      if (profileA.lifestyle && profileB.lifestyle) {
        const commonLifestyles = profileA.lifestyle.filter(lifestyle => 
          profileB.lifestyle.includes(lifestyle)
        );
        const lifestyleScore = Math.min(commonLifestyles.length * 3, 15); // Max 15 points
        score += lifestyleScore;
      }

      // 6. Personality compatibility (10 points max)
      if (profileA.personality && profileB.personality) {
        const commonPersonalities = profileA.personality.filter(personality => 
          profileB.personality.includes(personality)
        );
        const personalityScore = Math.min(commonPersonalities.length * 2, 10); // Max 10 points
        score += personalityScore;
      }

      // Apply preference weights if available
      if (preferencesA && preferencesA.weights) {
        score = this.applyPreferenceWeights(score, preferencesA.weights, profileA, profileB);
      }

      // Ensure score doesn't exceed max
      return Math.min(score, maxScore);
    } catch (error) {
      console.error('Error calculating match score:', error);
      return 50; // Default score if calculation fails
    }
  }

  /**
   * Apply preference weights to the base score
   */
  static applyPreferenceWeights(baseScore, weights, profileA, profileB) {
    // This is a simplified implementation
    // In a real system, weights would be applied to specific compatibility factors
    let weightedScore = baseScore;

    // Apply multiplier based on importance of various factors
    if (weights.interestsWeight) {
      // Adjust interest-based portion of score
      const interestRatio = weights.interestsWeight / 100;
      const interestComponent = (baseScore * interestRatio);
      weightedScore = baseScore + (interestComponent * (weights.interestsWeight - 50) / 50);
    }

    if (weights.locationWeight) {
      // Adjust location-based portion of score
      const locationRatio = weights.locationWeight / 100;
      const locationComponent = (baseScore * locationRatio * 0.15); // Location is 15% of base score
      weightedScore = baseScore + (locationComponent * (weights.locationWeight - 50) / 50);
    }

    // Clamp between 0 and 100
    return Math.max(0, Math.min(100, weightedScore));
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
  }

  /**
   * Update user's match queue
   */
  static async updateMatchQueue(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Get new potential matches
      const potentialMatches = await this.findPotentialMatches(userId, { limit: 20 });

      if (potentialMatches.success) {
        // Update the user's discovery queue
        await db.updateDiscoveryQueue(userId, potentialMatches.matches);

        return {
          success: true,
          updated: potentialMatches.matches.length,
          userId
        };
      } else {
        return {
          success: false,
          error: potentialMatches.error
        };
      }
    } catch (error) {
      console.error('Error updating match queue:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get match recommendations based on behavior
   */
  static async getBehaviorBasedRecommendations(userId, limit = 10) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Get user's interaction history
      const interactionHistory = await db.getUserInteractionHistory(userId);

      // Find users with similar interaction patterns
      const similarUsers = await db.getUsersWithSimilarInteractions(userId, limit);

      // Calculate match scores for similar users
      const recommendations = await Promise.all(
        similarUsers.map(async (user) => {
          const matchScore = await this.calculateMatchScore(userId, user.id);
          return {
            ...user,
            matchScore,
            reason: 'Users with similar interaction patterns'
          };
        })
      );

      // Sort by match score
      recommendations.sort((a, b) => b.matchScore - a.matchScore);

      return {
        success: true,
        recommendations,
        count: recommendations.length
      };
    } catch (error) {
      console.error('Error getting behavior-based recommendations:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get match recommendations based on common connections
   */
  static async getConnectionsBasedRecommendations(userId, limit = 10) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Get user's connections/matches
      const userMatches = await db.getUserMatches(userId);

      // Find users that are connected to the same matches
      const connectionBasedUsers = await db.getUsersWithCommonConnections(userId, limit);

      // Calculate match scores for connection-based users
      const recommendations = await Promise.all(
        connectionBasedUsers.map(async (user) => {
          const matchScore = await this.calculateMatchScore(userId, user.id);
          return {
            ...user,
            matchScore,
            reason: 'Connected to common matches'
          };
        })
      );

      // Sort by match score
      recommendations.sort((a, b) => b.matchScore - a.matchScore);

      return {
        success: true,
        recommendations,
        count: recommendations.length
      };
    } catch (error) {
      console.error('Error getting connections-based recommendations:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get AI-powered match recommendations
   */
  static async getAIRecommendations(userId, limit = 10) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Get user's comprehensive profile
      const userProfile = await db.getUser(userId);
      const userPreferences = await db.getUserPreferences(userId);
      const userInteractions = await db.getUserInteractionHistory(userId);

      // In a real implementation, this would call an AI/ML service
      // For now, we'll simulate AI recommendations by combining multiple factors
      const aiRecommendations = await db.getAIRecommendations(userId, limit);

      // Calculate enhanced match scores using AI-like methodology
      const recommendations = await Promise.all(
        aiRecommendations.map(async (user) => {
          // Base score from standard algorithm
          const baseScore = await this.calculateMatchScore(userId, user.id);

          // Factor in additional AI considerations
          const aiScore = this.calculateAIScore(
            userProfile, 
            user, 
            userPreferences, 
            userInteractions
          );

          // Combine base score with AI score
          const finalScore = (baseScore * 0.6) + (aiScore * 0.4);

          return {
            ...user,
            matchScore: finalScore,
            reason: 'AI-powered recommendation'
          };
        })
      );

      // Sort by match score
      recommendations.sort((a, b) => b.matchScore - a.matchScore);

      return {
        success: true,
        recommendations,
        count: recommendations.length
      };
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Calculate AI-like score based on multiple factors
   */
  static calculateAIScore(userAProfile, userBProfile, userAPreferences, userAInteractions) {
    // This is a simplified simulation of an AI scoring mechanism
    // In a real implementation, this would use machine learning models

    let aiScore = 50; // Base score

    // Consider interaction patterns
    if (userAInteractions.length > 50) {
      // Active user gets better recommendations
      aiScore += 5;
    }

    // Consider profile completeness
    if (userAProfile.bio && userAProfile.bio.length > 100) {
      aiScore += 5;
    }

    if (userBProfile.bio && userBProfile.bio.length > 100) {
      aiScore += 5;
    }

    // Consider similar preferences
    if (userAPreferences.interests && userBProfile.interests) {
      const commonInterests = userAPreferences.interests.filter(interest => 
        userBProfile.interests.includes(interest)
      );
      aiScore += commonInterests.length * 2;
    }

    // Consider similar values
    if (userAPreferences.values && userBProfile.values) {
      const commonValues = userAPreferences.values.filter(value => 
        userBProfile.values.includes(value)
      );
      aiScore += commonValues.length * 3;
    }

    // Cap at 100
    return Math.min(aiScore, 100);
  }

  /**
   * Get match quality metrics
   */
  static async getMatchQualityMetrics(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Get user's matching statistics
      const matchStats = await db.getUserMatchStats(userId);

      // Calculate quality metrics
      const qualityMetrics = {
        acceptanceRate: matchStats.totalLikes > 0 ? 
          (matchStats.matchesReceived / matchStats.totalLikes) * 100 : 0,
        responseRate: matchStats.messagesSent > 0 ? 
          (matchStats.messagesReceived / matchStats.messagesSent) * 100 : 0,
        conversationRate: matchStats.matchesMade > 0 ? 
          (matchStats.conversationsStarted / matchStats.matchesMade) * 100 : 0,
        averageMatchScore: matchStats.averageMatchScore || 0,
        profileViews: matchStats.profileViews || 0,
        rightSwipes: matchStats.rightSwipes || 0,
        leftSwipes: matchStats.leftSwipes || 0
      };

      return {
        success: true,
        metrics: qualityMetrics
      };
    } catch (error) {
      console.error('Error getting match quality metrics:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Optimize matching algorithm based on feedback
   */
  static async optimizeMatchingAlgorithm(userId, feedback) {
    try {
      if (!userId || !feedback) {
        throw new Error('User ID and feedback are required');
      }

      // Store feedback for algorithm improvement
      await db.storeMatchingFeedback(userId, feedback);

      // In a real implementation, this would update ML models
      // For now, we'll just acknowledge the feedback
      console.log(`Received matching feedback from user ${userId}:`, feedback);

      return {
        success: true,
        message: 'Feedback received and will be used to improve matching'
      };
    } catch (error) {
      console.error('Error optimizing matching algorithm:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = LushMatchingEngine;