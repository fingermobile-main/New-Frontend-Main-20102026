/**
 * Lush Personality AI Service
 * Analyzes user personality traits and provides insights for matching
 */

const db = require('../config/database');

class LushPersonalityAI {
  /**
   * Analyze user's personality based on profile and behavior
   */
  static async analyzePersonality(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Get user's profile data
      const userProfile = await db.getUser(userId);
      if (!userProfile) {
        throw new Error('User profile not found');
      }

      // Get user's interactions and behavior data
      const userBehavior = await db.getUserBehaviorData(userId);

      // Analyze bio for personality indicators
      const bioAnalysis = this.analyzeBio(userProfile.bio);

      // Analyze interests for personality traits
      const interestAnalysis = this.analyzeInterests(userProfile.interests);

      // Analyze interaction patterns
      const interactionAnalysis = this.analyzeInteractions(userBehavior);

      // Combine all analyses into a personality profile
      const personalityProfile = this.combineAnalyses(
        bioAnalysis, 
        interestAnalysis, 
        interactionAnalysis
      );

      // Save personality analysis to database
      const savedProfile = await db.savePersonalityProfile(userId, {
        ...personalityProfile,
        analyzedAt: new Date()
      });

      return {
        success: true,
        personality: savedProfile
      };
    } catch (error) {
      console.error('Error analyzing personality:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Analyze user's bio for personality indicators
   */
  static analyzeBio(bio) {
    if (!bio) {
      return { traits: [], keywords: [], sentiment: 'neutral' };
    }

    // Convert to lowercase for analysis
    const lowerBio = bio.toLowerCase();

    // Define personality trait indicators
    const traitIndicators = {
      extraversion: [
        'social', 'party', 'meet people', 'outgoing', 'extroverted', 'energetic', 
        'adventurous', 'spontaneous', 'talkative', 'friendly', 'sociable'
      ],
      agreeableness: [
        'kind', 'empathetic', 'compassionate', 'helpful', 'caring', 'supportive',
        'understanding', 'generous', 'thoughtful', 'considerate', 'tolerant'
      ],
      conscientiousness: [
        'organized', 'planner', 'disciplined', 'reliable', 'responsible',
        'goal-oriented', 'hardworking', 'efficient', 'methodical', 'careful'
      ],
      neuroticism: [
        'anxious', 'worried', 'sensitive', 'emotional', 'moody', 'nervous',
        'insecure', 'stressed', 'overthinking', 'overthinker', 'emotional'
      ],
      openness: [
        'creative', 'curious', 'adventurous', 'open-minded', 'artistic',
        'intellectual', 'imaginative', 'experimental', 'exploring', 'learning'
      ]
    };

    // Analyze bio for trait indicators
    const traits = {};
    let totalMatches = 0;

    for (const [trait, indicators] of Object.entries(traitIndicators)) {
      let matchCount = 0;
      for (const indicator of indicators) {
        if (lowerBio.includes(indicator)) {
          matchCount++;
        }
      }
      traits[trait] = matchCount;
      totalMatches += matchCount;
    }

    // Normalize scores to 0-100 range
    const normalizedTraits = {};
    for (const [trait, count] of Object.entries(traits)) {
      normalizedTraits[trait] = totalMatches > 0 ? Math.min(100, (count / totalMatches) * 100) : 0;
    }

    // Extract keywords
    const keywords = this.extractKeywords(bio);

    // Determine sentiment
    const sentiment = this.analyzeSentiment(bio);

    return {
      traits: normalizedTraits,
      keywords,
      sentiment,
      wordCount: bio.split(/\s+/).length
    };
  }

  /**
   * Analyze user's interests for personality traits
   */
  static analyzeInterests(interests) {
    if (!interests || !Array.isArray(interests)) {
      return { traits: {}, dominantTraits: [] };
    }

    // Define interest categories and associated traits
    const interestCategories = {
      'adventure': {
        traits: { extraversion: 80, openness: 70 },
        interests: ['adventure', 'travel', 'hiking', 'camping', 'exploring']
      },
      'creativity': {
        traits: { openness: 90, agreeableness: 60 },
        interests: ['art', 'music', 'writing', 'photography', 'crafts', 'design']
      },
      'sports': {
        traits: { extraversion: 70, conscientiousness: 60 },
        interests: ['soccer', 'basketball', 'tennis', 'running', 'gym', 'football']
      },
      'intellectual': {
        traits: { openness: 85, conscientiousness: 75 },
        interests: ['reading', 'books', 'science', 'philosophy', 'learning', 'education']
      },
      'social': {
        traits: { extraversion: 90, agreeableness: 80 },
        interests: ['parties', 'socializing', 'networking', 'events', 'clubs']
      },
      'relaxation': {
        traits: { neuroticism: 30, agreeableness: 70 },
        interests: ['meditation', 'yoga', 'spa', 'nature', 'peace', 'calm']
      }
    };

    // Tally trait scores based on interests
    const traitScores = {
      extraversion: 0,
      agreeableness: 0,
      conscientiousness: 0,
      neuroticism: 0,
      openness: 0
    };

    const matchedCategories = [];
    for (const interest of interests) {
      for (const [category, data] of Object.entries(interestCategories)) {
        if (data.interests.some(catInterest => 
          interest.toLowerCase().includes(catInterest))) {
          if (!matchedCategories.includes(category)) {
            matchedCategories.push(category);
          }
          for (const [trait, score] of Object.entries(data.traits)) {
            traitScores[trait] += score;
          }
        }
      }
    }

    // Normalize scores
    const normalizedScores = {};
    for (const [trait, score] of Object.entries(traitScores)) {
      normalizedScores[trait] = Math.min(100, score / Math.max(1, matchedCategories.length));
    }

    return {
      traits: normalizedScores,
      categories: matchedCategories,
      count: interests.length
    };
  }

  /**
   * Analyze user's interaction patterns for personality
   */
  static analyzeInteractions(behaviorData) {
    if (!behaviorData) {
      return { traits: {}, patterns: {} };
    }

    const patterns = {};

    // Analyze response time patterns
    if (behaviorData.avgResponseTime) {
      // Quick responders tend to be more extraverted and conscientious
      patterns.responseTimeTrait = behaviorData.avgResponseTime < 10 ? 
        { extraversion: 70, conscientiousness: 60 } : 
        { neuroticism: 40, conscientiousness: 30 };
    }

    // Analyze messaging patterns
    if (behaviorData.messageFrequency) {
      patterns.communicationStyle = behaviorData.messageFrequency > 5 ? 
        { extraversion: 80, openness: 60 } : 
        { introversion: 70, neuroticism: 30 };
    }

    // Analyze content patterns
    if (behaviorData.contentSentiment) {
      patterns.sentimentTrait = behaviorData.contentSentiment > 0.5 ? 
        { agreeableness: 80, extraversion: 60 } : 
        { neuroticism: 60, openness: 40 };
    }

    // Aggregate pattern traits
    const aggregatedTraits = {
      extraversion: 0,
      agreeableness: 0,
      conscientiousness: 0,
      neuroticism: 0,
      openness: 0
    };

    let patternCount = 0;
    for (const [patternName, traits] of Object.entries(patterns)) {
      if (typeof traits === 'object') {
        for (const [trait, score] of Object.entries(traits)) {
          aggregatedTraits[trait] += score;
        }
        patternCount++;
      }
    }

    // Normalize scores
    for (const [trait, score] of Object.entries(aggregatedTraits)) {
      aggregatedTraits[trait] = patternCount > 0 ? score / patternCount : 0;
    }

    return {
      traits: aggregatedTraits,
      patterns,
      patternCount
    };
  }

  /**
   * Combine multiple analyses into a single personality profile
   */
  static combineAnalyses(bioAnalysis, interestAnalysis, interactionAnalysis) {
    // Weight different sources of information
    const bioWeight = 0.3;
    const interestWeight = 0.5;
    const interactionWeight = 0.2;

    const combinedTraits = {
      extraversion: 0,
      agreeableness: 0,
      conscientiousness: 0,
      neuroticism: 0,
      openness: 0
    };

    // Combine traits with weights
    for (const trait of Object.keys(combinedTraits)) {
      const bioScore = bioAnalysis.traits[trait] || 0;
      const interestScore = interestAnalysis.traits[trait] || 0;
      const interactionScore = interactionAnalysis.traits[trait] || 0;

      combinedTraits[trait] = 
        (bioScore * bioWeight) + 
        (interestScore * interestWeight) + 
        (interactionScore * interactionWeight);
    }

    // Determine dominant personality dimensions
    const sortedTraits = Object.entries(combinedTraits)
      .sort(([,a], [,b]) => b - a);
    
    const dominantTraits = sortedTraits.slice(0, 3).map(([trait]) => trait);

    return {
      traits: combinedTraits,
      dominantTraits,
      bioAnalysis,
      interestAnalysis,
      interactionAnalysis,
      confidence: this.calculateConfidence([
        bioAnalysis.wordCount,
        interestAnalysis.count,
        interactionAnalysis.patternCount
      ])
    };
  }

  /**
   * Calculate confidence in personality analysis
   */
  static calculateConfidence(dataPoints) {
    // Confidence increases with more data points
    const totalPoints = dataPoints.reduce((sum, val) => sum + (val || 0), 0);
    // Scale to 0-100 with diminishing returns
    return Math.min(100, (totalPoints / 10) * 20);
  }

  /**
   * Extract keywords from text
   */
  static extractKeywords(text) {
    if (!text) return [];

    // Remove punctuation and convert to lowercase
    const cleanedText = text.toLowerCase().replace(/[^\w\s]/gi, ' ');

    // Split into words and filter out common stop words
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
      'of', 'with', 'by', 'about', 'as', 'into', 'through', 'during', 'before',
      'after', 'above', 'below', 'from', 'up', 'down', 'out', 'off', 'over',
      'under', 'again', 'further', 'then', 'once', 'i', 'me', 'my', 'myself',
      'we', 'our', 'ours', 'ourselves', 'you', "you're", 'your', 'yours',
      'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's",
      'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them',
      'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this',
      'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were',
      'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does',
      'did', 'doing', 'a', 'will', 'would', 'should', 'can', 'could', 'ought',
      'i\'m', 'you\'ve', 'he\'s', 'she\'s', 'we\'ve', 'they\'ve', 'i\'ve',
      'i\'d', 'you\'d', 'he\'d', 'she\'d', 'we\'d', 'they\'d', 'i\'ll',
      'you\'ll', 'he\'ll', 'she\'ll', 'we\'ll', 'they\'ll', 'isn\'t',
      'aren\'t', 'wasn\'t', 'weren\'t', 'haven\'t', 'hasn\'t', 'hadn\'t',
      'doesn\'t', 'don\'t', 'didn\'t', 'won\'t', 'wouldn\'t', 'shan\'t',
      'shouldn\'t', 'can\'t', 'cannot', 'couldn\'t', 'mustn\'t', 'let\'s',
      'that\'s', 'who\'s', 'what\'s', 'here\'s', 'there\'s', 'when\'s',
      'where\'s', 'why\'s', 'how\'s', 'a\'s', 'o\'clock', 'ma\'am', 'y\'all',
      'y\'all\'d', 'you\'re', 'y\'all\'re', 'kinda', 'y\'know', 'gonna',
      'gotta', 'wan\'na', 'ha\'ta', 'yes', 'no', 'not', 'own', 'same', 'so',
      'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should',
      'now'
    ]);

    const words = cleanedText.split(/\s+/).filter(word => 
      word.length > 2 && !stopWords.has(word)
    );

    // Count word frequencies
    const wordFreq = {};
    for (const word of words) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }

    // Get top 10 keywords by frequency
    const sortedWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);

    return sortedWords;
  }

  /**
   * Analyze sentiment of text
   */
  static analyzeSentiment(text) {
    if (!text) return 'neutral';

    // Positive sentiment words
    const positiveWords = [
      'happy', 'joy', 'love', 'excited', 'amazing', 'wonderful', 'great',
      'fantastic', 'awesome', 'incredible', 'perfect', 'beautiful', 'lovely',
      'delighted', 'pleased', 'satisfied', 'grateful', 'thankful', 'blessed',
      'optimistic', 'positive', 'bright', 'cheerful', 'upbeat', 'hopeful'
    ];

    // Negative sentiment words
    const negativeWords = [
      'sad', 'angry', 'frustrated', 'disappointed', 'hate', 'terrible',
      'awful', 'horrible', 'annoying', 'disgusting', 'worst', 'unhappy',
      'depressed', 'anxious', 'worried', 'stressed', 'negative', 'pessimistic',
      'concerned', 'upset', 'mad', 'furious', 'irritated', 'distressed'
    ];

    const lowerText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;

    for (const word of positiveWords) {
      if (lowerText.includes(word)) positiveCount++;
    }

    for (const word of negativeWords) {
      if (lowerText.includes(word)) negativeCount++;
    }

    if (positiveCount > negativeCount * 1.5) return 'positive';
    if (negativeCount > positiveCount * 1.5) return 'negative';
    return 'neutral';
  }

  /**
   * Get personality compatibility between two users
   */
  static async getCompatibility(userAId, userBId) {
    try {
      if (!userAId || !userBId) {
        throw new Error('Both user IDs are required');
      }

      // Get personality profiles for both users
      const profileA = await db.getPersonalityProfile(userAId);
      const profileB = await db.getPersonalityProfile(userBId);

      if (!profileA || !profileB) {
        throw new Error('Personality profiles not found for one or both users');
      }

      // Calculate compatibility scores
      const compatibility = this.calculateCompatibility(profileA.traits, profileB.traits);

      // Get additional compatibility factors
      const additionalFactors = await this.getAdditionalCompatibilityFactors(userAId, userBId);

      return {
        success: true,
        compatibility: {
          ...compatibility,
          additionalFactors,
          overallScore: this.calculateOverallCompatibility(compatibility, additionalFactors)
        }
      };
    } catch (error) {
      console.error('Error calculating compatibility:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Calculate compatibility between two sets of traits
   */
  static calculateCompatibility(traitsA, traitsB) {
    const compatibility = {};

    for (const trait of Object.keys(traitsA)) {
      const scoreA = traitsA[trait] || 0;
      const scoreB = traitsB[trait] || 0;

      // Calculate similarity (higher is more compatible)
      const similarity = 100 - Math.abs(scoreA - scoreB);
      compatibility[trait] = similarity;
    }

    return compatibility;
  }

  /**
   * Get additional compatibility factors beyond personality
   */
  static async getAdditionalCompatibilityFactors(userAId, userBId) {
    // Get shared interests
    const sharedInterests = await db.getSharedInterests(userAId, userBId);

    // Get similar values
    const similarValues = await db.getSimilarValues(userAId, userBId);

    // Get location compatibility
    const locationComp = await db.getLocationCompatibility(userAId, userBId);

    return {
      sharedInterests: sharedInterests.length,
      similarValues: similarValues.length,
      locationCompatibility: locationComp,
      communicationStyle: this.getCommunicationStyleCompatibility(userAId, userBId)
    };
  }

  /**
   * Get communication style compatibility
   */
  static async getCommunicationStyleCompatibility(userAId, userBId) {
    const behaviorA = await db.getUserBehaviorData(userAId);
    const behaviorB = await db.getUserBehaviorData(userBId);

    if (!behaviorA || !behaviorB) {
      return 50; // Default compatibility if no data
    }

    // Compare response time preferences
    const responseTimeDiff = Math.abs(
      behaviorA.preferredResponseTime || 24 * 60, // Default to 24 hours
      behaviorB.preferredResponseTime || 24 * 60
    );

    // Compare communication frequency preferences
    const freqDiff = Math.abs(
      behaviorA.preferredCommunicationFreq || 1,
      behaviorB.preferredCommunicationFreq || 1
    );

    // Higher compatibility if preferences are similar
    const compScore = Math.max(0, 100 - (responseTimeDiff / 60) - (freqDiff * 20));

    return Math.min(100, compScore);
  }

  /**
   * Calculate overall compatibility score
   */
  static calculateOverallCompatibility(compatibility, additionalFactors) {
    // Weight different compatibility factors
    const traitWeight = 0.6; // Personality traits
    const interestWeight = 0.2; // Shared interests
    const valueWeight = 0.15; // Similar values
    const commWeight = 0.05; // Communication style

    // Calculate average trait compatibility
    const avgTraitComp = Object.values(compatibility).reduce((sum, val) => sum + val, 0) / 
                         Object.keys(compatibility).length;

    // Calculate overall score
    const overall = 
      (avgTraitComp * traitWeight) +
      (additionalFactors.sharedInterests > 0 ? 100 : 0) * interestWeight +
      (additionalFactors.similarValues > 0 ? 100 : 0) * valueWeight +
      (additionalFactors.communicationStyle * commWeight);

    return Math.min(100, Math.round(overall));
  }

  /**
   * Get personality-based conversation starters
   */
  static async getConversationStarters(userId, targetUserId) {
    try {
      if (!userId || !targetUserId) {
        throw new Error('Both user IDs are required');
      }

      // Get personality profiles
      const userProfile = await db.getPersonalityProfile(userId);
      const targetProfile = await db.getPersonalityProfile(targetUserId);

      if (!userProfile || !targetProfile) {
        throw new Error('Personality profiles not found');
      }

      // Get shared interests
      const sharedInterests = await db.getSharedInterests(userId, targetUserId);

      // Generate conversation starters based on personality and interests
      const starters = this.generateConversationStarters(
        userProfile, 
        targetProfile, 
        sharedInterests
      );

      return {
        success: true,
        starters
      };
    } catch (error) {
      console.error('Error generating conversation starters:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate conversation starters based on personality profiles
   */
  static generateConversationStarters(userProfile, targetProfile, sharedInterests) {
    const starters = [];

    // Based on openness trait
    if (targetProfile.traits.openness > 70) {
      starters.push("I noticed you're interested in trying new things - what's the most adventurous thing you've done recently?");
    }

    // Based on agreeableness trait
    if (targetProfile.traits.agreeableness > 70) {
      starters.push("You seem like a really caring person - what causes or issues are you passionate about?");
    }

    // Based on extraversion trait
    if (targetProfile.traits.extraversion > 70) {
      starters.push("You seem pretty social - what's the best event or party you've attended recently?");
    }

    // Based on shared interests
    if (sharedInterests.length > 0) {
      const randomInterest = sharedInterests[Math.floor(Math.random() * sharedInterests.length)];
      starters.push(`I see we both enjoy ${randomInterest} - what got you interested in that?`);
    }

    // Default starter if no specific personality insights
    if (starters.length === 0) {
      starters.push("Hi! I'd love to get to know you better - what's something you're passionate about?");
    }

    return starters.slice(0, 3); // Return top 3 starters
  }

  /**
   * Get personality insights for a user
   */
  static async getPersonalityInsights(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const profile = await db.getPersonalityProfile(userId);
      if (!profile) {
        throw new Error('Personality profile not found');
      }

      // Generate insights based on personality traits
      const insights = this.generatePersonalityInsights(profile);

      return {
        success: true,
        insights,
        profile
      };
    } catch (error) {
      console.error('Error getting personality insights:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate insights based on personality profile
   */
  static generatePersonalityInsights(profile) {
    const insights = [];

    // Extraversion insights
    if (profile.traits.extraversion > 70) {
      insights.push("You're likely very social and enjoy meeting new people.");
    } else if (profile.traits.extraversion < 30) {
      insights.push("You prefer smaller groups and more intimate conversations.");
    }

    // Agreeableness insights
    if (profile.traits.agreeableness > 70) {
      insights.push("You're probably very empathetic and considerate of others.");
    }

    // Conscientiousness insights
    if (profile.traits.conscientiousness > 70) {
      insights.push("You likely value organization and planning in your life.");
    }

    // Neuroticism insights
    if (profile.traits.neuroticism > 70) {
      insights.push("You might experience emotions more intensely than others.");
    }

    // Openness insights
    if (profile.traits.openness > 70) {
      insights.push("You're likely curious and open to new experiences and ideas.");
    }

    return insights;
  }
}

module.exports = LushPersonalityAI;