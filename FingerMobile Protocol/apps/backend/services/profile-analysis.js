/* eslint-disable no-undef, no-unused-vars */
const logger = require('../utils/logger');
// Member Profile Analysis Service for FingerMobile P2P Matching System

const db = require('../db');

class memberProfileAnalysisService {
  constructor() {
    this.ANALYSIS_TYPES = {
      FULL_PROFILE: 'full_profile',
      CREDIT_WORTHINESS: 'credit_worthiness',
      BUSINESS_COMPATIBILITY: 'business_compatibility',
      INTEREST_ALIGNMENT: 'interest_alignment',
      FRAUD_RISK_ASSESSMENT: 'fraud_risk_assessment'
    };

    this.ANALYSIS_WEIGHTS = {
      demographics: 0.2,
      interests: 0.25,
      activity: 0.15,
      location: 0.1,
      behavior: 0.3
    };
  }

  /**
     * Perform full profile analysis (FIC subscription required)
     * @param {string} analyzedmemberId - member ID to analyze
     * @param {string} analyzermemberId - member ID performing the analysis
     * @returns {Object} Profile analysis result
     */
  async performFullProfileAnalysis(analyzedmemberId, analyzermemberId) {
    try {
      // Validate FIC subscription access
      const ficService = require('./fic-subscription');
      const accessValidation = await ficService.validateProfileAnalysisAccess(analyzermemberId, analyzedmemberId);

      if (!accessValidation.valid) {
        throw new Error(accessValidation.reason || 'FIC subscription required for profile analysis');
      }

      // Fetch the member profile
      const memberProfile = await db.query(
        'SELECT * FROM fm_member_profiles WHERE member_id = $1',
        [analyzedmemberId]
      );

      if (!memberProfile.rows[0]) {
        throw new Error('Member profile not found');
      }

      const profile = memberProfile.rows[0];

      // Perform detailed analysis
      const analysisResult = {
        member_id: profile.member_id,
        full_name: profile.full_name,
        demographics: this.analyzeDemographics(profile),
        interests_analysis: this.analyzeInterests(profile),
        activity_analysis: this.analyzeActivity(profile),
        location_analysis: this.analyzeLocation(profile),
        behavior_analysis: this.analyzeBehavior(profile),
        overall_compatibility_score: await this.calculateOverallCompatibility(profile),
        privacy_level: profile.profile_visibility,
        last_active: profile.updated_at,
        risk_assessment: await this.assessRisk(profile),
        recommendations: this.generateRecommendations(profile),
        generated_at: new Date().toISOString()
      };

      // Create analysis record in database
      const analysisRecord = await this.createAnalysisRecord({
        analyzed_member_id: analyzedmemberId,
        analyzer_member_id: analyzermemberId,
        analysis_type: this.ANALYSIS_TYPES.FULL_PROFILE,
        analysis_result: analysisResult,
        access_granted: true // Assuming consent is handled separately in real implementation
      });

      return {
        ...analysisResult,
        analysis_id: analysisRecord.id,
        access_validated: true
      };
    } catch (error) {
      logger.error('Error in full profile analysis:', error.message);
      throw error;
    }
  }

  /**
     * Analyze demographics
     * @param {Object} profile - member profile
     * @returns {Object} Demographics analysis
     */
  analyzeDemographics(profile) {
    return {
      age_group: this.getAgeGroup(profile.age),
      gender: profile.gender,
      activity_level: profile.activity_level,
      profile_completeness: this.calculateProfileCompleteness(profile)
    };
  }

  /**
     * Analyze member interests
     * @param {Object} profile - member profile
     * @returns {Object} Interests analysis
     */
  analyzeInterests(profile) {
    return {
      interests_count: profile.interests?.length || 0,
      interests_list: profile.interests || [],
      common_interests_score: this.calculateCommonInterestsScore(profile.interests || []),
      interests_diversity: this.calculateInterestsDiversity(profile.interests || [])
    };
  }

  /**
     * Analyze member activity
     * @param {Object} profile - member profile
     * @returns {Object} Activity analysis
     */
  analyzeActivity(profile) {
    return {
      last_updated: profile.updated_at,
      activity_level: profile.activity_level,
      profile_views: this.getProfileViews(profile.member_id), // Would need a separate tracking table
      engagement_score: this.calculateEngagementScore(profile)
    };
  }

  /**
     * Analyze location data
     * @param {Object} profile - member profile
     * @returns {Object} Location analysis
     */
  analyzeLocation(profile) {
    if (!profile.coordinates_lat || !profile.coordinates_lng) {
      return {
        location_available: false,
        distance_analysis: null
      };
    }

    return {
      location_available: true,
      coordinates: {
        lat: profile.coordinates_lat,
        lng: profile.coordinates_lng
      },
      location_type: this.determineLocationType({lat: profile.coordinates_lat, lng: profile.coordinates_lng}),
      timezone: this.getTimezoneFromCoordinates(profile.coordinates_lat, profile.coordinates_lng)
    };
  }

  /**
     * Analyze member behavior patterns
     * @param {Object} profile - member profile
     * @returns {Object} Behavior analysis
     */
  analyzeBehavior(profile) {
    return {
      matching_preferences: profile.matching_preferences || {},
      preferred_categories: profile.matching_preferences?.categories || [],
      response_time_tendency: profile.matching_preferences?.response_time || 'medium',
      risk_tolerance: profile.matching_preferences?.risk_tolerance || 'medium'
    };
  }

  /**
     * Calculate overall compatibility score
     * @param {Object} profile - member profile
     * @returns {number} Compatibility score (0-100)
     */
  async calculateOverallCompatibility(profile) {
    let totalScore = 0;
    let totalWeight = 0;

    // Demographics score
    const demoScore = this.calculateDemographicsScore(profile);
    totalScore += demoScore * this.ANALYSIS_WEIGHTS.demographics;
    totalWeight += this.ANALYSIS_WEIGHTS.demographics;

    // Interests score
    const interestScore = this.calculateInterestsScore(profile.interests || []);
    totalScore += interestScore * this.ANALYSIS_WEIGHTS.interests;
    totalWeight += this.ANALYSIS_WEIGHTS.interests;

    // Activity score
    const activityScore = this.calculateActivityScore(profile);
    totalScore += activityScore * this.ANALYSIS_WEIGHTS.activity;
    totalWeight += this.ANALYSIS_WEIGHTS.activity;

    // Location score
    const locationScore = profile.coordinates_lat && profile.coordinates_lng ? 85 : 40;
    totalScore += locationScore * this.ANALYSIS_WEIGHTS.location;
    totalWeight += this.ANALYSIS_WEIGHTS.location;

    // Behavior score
    const behaviorScore = this.calculateBehaviorScore(profile);
    totalScore += behaviorScore * this.ANALYSIS_WEIGHTS.behavior;
    totalWeight += this.ANALYSIS_WEIGHTS.behavior;

    // Normalize to 0-100 scale
    return totalWeight > 0 ? Math.round((totalScore / totalWeight)) : 50;
  }

  /**
     * Assess member risk level
     * @param {Object} profile - member profile
     * @returns {Object} Risk assessment
     */
  async assessRisk(profile) {
    // Check for fraud indicators in the member's activity
    const fraudIndicators = await db.query(
      `SELECT * FROM fm_ai_insights 
            WHERE entity_id = $1 AND insight_type = 'fraud_risk' AND is_flagged = true`,
      [profile.member_id]
    );

    const riskLevel = fraudIndicators.rows.length > 0 ? 'high' : 'low';

    return {
      risk_level: riskLevel,
      fraud_indicators_count: fraudIndicators.rows.length,
      flags: fraudIndicators.rows.map(flag => flag.insights_data),
      trust_score: riskLevel === 'low' ? 85 : 25
    };
  }

  /**
     * Generate recommendations based on profile analysis
     * @param {Object} profile - member profile
     * @returns {Array} Recommendations
     */
  generateRecommendations(profile) {
    const recommendations = [];

    // Profile completeness recommendation
    const completeness = this.calculateProfileCompleteness(profile);
    if (completeness < 0.7) {
      recommendations.push({
        type: 'profile_enhancement',
        priority: 'high',
        message: 'Consider completing more profile fields to improve matching quality'
      });
    }

    // Interests diversity recommendation
    if ((profile.interests || []).length < 3) {
      recommendations.push({
        type: 'interest_expansion',
        priority: 'medium',
        message: 'Add more interests to improve match compatibility'
      });
    }

    // Location visibility recommendation
    if (!profile.coordinates_lat || !profile.coordinates_lng) {
      recommendations.push({
        type: 'location_enhancement',
        priority: 'low',
        message: 'Add location data to enable location-based matching'
      });
    }

    return recommendations;
  }

  /**
     * Calculate credit worthiness (for financial matching scenarios)
     * @param {string} memberId - member ID
     * @returns {Object} Credit worthiness assessment
     */
  async calculateCreditWorthiness(memberId) {
    // In a real implementation, this would integrate with credit scoring services
    // For now, we'll simulate based on available data

    const profile = await this.getMemberProfile(memberId);
    if (!profile) {
      throw new Error('Member profile not found');
    }

    // Fetch any financial-related records for the member
    const financialRecords = await db.query(
      `SELECT * FROM fm_marketplace_lending_matches 
            WHERE client_id = $1 OR lender_id = $1 OR borrower_id = $1`,
      [memberId]
    );

    let score = 600; // Base score

    // Adjust based on available data
    if (profile.age && profile.age >= 25 && profile.age <= 65) {
      score += 50;
    }

    if (profile.full_name && profile.full_name.length > 3) {
      score += 20;
    }

    if (financialRecords.rows.length > 0) {
      // If member has financial activity, assess based on that
      const successfulTransactions = financialRecords.rows.filter(
        record => record.status === 'completed' || record.status === 'repaid'
      ).length;

      score += (successfulTransactions * 10);
    }

    // Cap the score at 850
    score = Math.min(score, 850);

    return {
      member_id: memberId,
      credit_score: score,
      score_rating: this.getScoreRating(score),
      factors_considered: [
        'profile_completeness',
        'financial_history',
        'demographics'
      ],
      risk_level: this.getRiskLevelFromScore(score),
      generated_at: new Date().toISOString()
    };
  }

  /**
     * Analyze business compatibility
     * @param {string} member1Id - Firsmembermber ID
     * @param {string} member2Id - Seconmembermber ID
     * @returns {Object} Business compatibility analysis
     */
  async analyzeBusinessCompatibility(member1Id, member2Id) {
    const [profile1, profile2] = await Promise.all([
      this.getMemberProfile(member1Id),
      this.getMemberProfile(member2Id)
    ]);

    if (!profile1 || !profile2) {
      throw new Error('Both member profiles must exist for compatibility analysis');
    }

    // Calculate compatibility factors
    const compatibilityFactors = {
      interest_alignment: this.calculateInterestAlignment(profile1.interests, profile2.interests),
      location_proximity: this.calculateLocationProximity(profile1, profile2),
      activity_level_compatibility: this.calculateActivityLevelCompatibility(
        profile1.activity_level, profile2.activity_level
      ),
      communication_style: this.estimateCommunicationStyle(profile1, profile2)
    };

    // Calculate overall compatibility score
    const overallCompatibility = this.calculateBusinessCompatibilityScore(compatibilityFactors);

    return {
      members: [member1Idmembermber2Id],
      compatibility_factors: compatibilityFactors,
      overall_compatibility_score: overallCompatibility,
      strengths: this.identifyCompatibilityStrengths(compatibilityFactors),
      improvement_areas: this.identifyCompatibilityImprovements(compatibilityFactors),
      recommendation: this.getCompatibilityRecommendation(overallCompatibility),
      generated_at: new Date().toISOString()
    };
  }

  /**
     * Create an analysis record in the database
     * @param {Object} data - Analysis data
     * @returns {Object} Created analysis record
     */
  async createAnalysisRecord(data) {
    const { analyzed_member_id, analyzer_member_id, analysis_type, analysis_result, access_granted } = data;

    // Calculate expiration time (24 hours from now)
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 24);

    const result = await db.query(
      `INSERT INTO fm_profile_analysis (
                analyzed_member_id, analyzer_member_id, analysis_type, 
                analysis_result, is_fic_subscriber, access_granted, expires_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
      [
        analyzed_member_id,
        analyzer_member_id || null,
        analysis_type,
        analysis_result,
        !!analyzer_member_id, // Assuming analyzer has FIC if they can access
        access_granted,
        expirationTime
      ]
    );

    // Log the analysis activity
    await db.query(
      `INSERT INTO fm_sentinel_logs (
                log_type, severity, entity_id, entity_type, 
                action_taken, details
            ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        'profile_analysis',
        'info',
        result.rows[0].id,
        'profile_analysis',
        'completed',
        {
          analyzed_member_id,
          analyzer_member_id: analyzer_member_id || 'system',
          analysis_type,
          timestamp: new Date().toISOString()
        }
      ]
    );

    return result.rows[0];
  }

  /**
     * Get member profile with error handling
     * @param {string} memberId - member ID
     * @returns {Object} member profile
     */
  async getMemberProfile(memberId) {
    const profile = await db.query(
      'SELECT * FROM fm_member_profiles WHERE member_id = $1',
      [memberId]
    );

    return profile.rows[0] || null;
  }

  /**
     * Calculate profile completeness
     * @param {Object} profile - member profile
     * @returns {number} Completeness score (0-1)
     */
  calculateProfileCompleteness(profile) {
    const fields = [
      'full_name', 'age', 'gender', 'interests',
      'coordinates_lat', 'coordinates_lng', 'matching_preferences'
    ];

    const filledFields = fields.filter(field =>
      profile[field] && profile[field] !== '' &&
            !(Array.isArray(profile[field]) && profile[field].length === 0)
    ).length;

    return filledFields / fields.length;
  }

  /**
     * Get age group based on age
     * @param {number} age - Age
     * @returns {string} Age group
     */
  getAgeGroup(age) {
    if (!age) return 'unknown';
    if (age < 18) return 'minor';
    if (age < 25) return 'young_adult';
    if (age < 35) return 'adult';
    if (age < 50) return 'middle_aged';
    return 'senior';
  }

  /**
     * Calculate common interests score
     * @param {Array} interests - Array of interests
     * @returns {number} Common interests score
     */
  calculateCommonInterestsScore(interests) {
    if (!Array.isArray(interests) || interests.length === 0) return 0;

    // In a real system, this would compare against popular interests
    // For now, return a score based on number of interests
    return Math.min(100, interests.length * 10);
  }

  /**
     * Calculate interests diversity
     * @param {Array} interests - Array of interests
     * @returns {number} Diversity score (0-100)
     */
  calculateInterestsDiversity(interests) {
    if (!Array.isArray(interests) || interests.length === 0) return 0;

    // Simple diversity calculation - in real implementation you'd categorize interests
    return Math.min(100, interests.length * 15);
  }

  /**
     * Calculate engagement score
     * @param {Object} profile - member profile
     * @returns {number} Engagement score (0-100)
     */
  calculateEngagementScore(profile) {
    // Based on profile completeness and update frequency
    const completeness = this.calculateProfileCompleteness(profile);
    return Math.round(completeness * 100);
  }

  /**
     * Determine location type based on coordinates
     * @param {Object} coordinates - Latitude and longitude
     * @returns {string} Location type
     */
  determineLocationType(coordinates) {
    // In a real implementation, you'd use reverse geocoding
    return 'urban'; // Placeholder
  }

  /**
     * Get timezone from coordinates
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     * @returns {string} Timezone
     */
  getTimezoneFromCoordinates(lat, lng) {
    // In a real implementation, you'd use a timezone service
    return 'UTC'; // Placeholder
  }

  /**
     * Calculate demographics score
     * @param {Object} profile - member profile
     * @returns {number} Demographics score (0-100)
     */
  calculateDemographicsScore(profile) {
    let score = 0;

    if (profile.age) score += 30;
    if (profile.gender) score += 20;
    if (profile.full_name) score += 30;
    if (profile.activity_level) score += 20;

    return Math.min(100, score);
  }

  /**
     * Calculate interests score
     * @param {Array} interests - member interests
     * @returns {number} Interests score (0-100)
     */
  calculateInterestsScore(interests) {
    if (!Array.isArray(interests)) return 0;
    return Math.min(100, interests.length * 15);
  }

  /**
     * Calculate activity score
     * @param {Object} profile - member profile
     * @returns {number} Activity score (0-100)
     */
  calculateActivityScore(profile) {
    let score = 50; // Base score

    // Increase score for more profile fields filled
    score += (this.calculateProfileCompleteness(profile) * 50);

    // Check how recent the profile was updated
    const updateTime = new Date(profile.updated_at);
    const now = new Date();
    const daysSinceUpdate = (now - updateTime) / (1000 * 60 * 60 * 24);

    if (daysSinceUpdate < 7) score += 10; // Updated in last week
    else if (daysSinceUpdate < 30) score += 5; // Updated in last month

    return Math.min(100, Math.max(0, score));
  }

  /**
     * Calculate behavior score
     * @param {Object} profile - member profile
     * @returns {number} Behavior score (0-100)
     */
  calculateBehaviorScore(profile) {
    let score = 60; // Base score

    if (profile.matching_preferences) score += 20;
    if (profile.preferences) score += 20;

    return Math.min(100, score);
  }

  /**
     * Get profile views for a member (placeholder implementation)
     * @param {string} memberId - member ID
     * @returns {number} Profile views count
     */
  getProfileViews(memberId) {
    // In a real implementation, this would come from a tracking table
    return Math.floor(Math.random() * 100); // Placeholder
  }

  /**
     * Get score rating based on credit score
     * @param {number} score - Credit score
     * @returns {string} Score rating
     */
  getScoreRating(score) {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    if (score >= 600) return 'Poor';
    return 'Very Poor';
  }

  /**
     * Get risk level based on credit score
     * @param {number} score - Credit score
     * @returns {string} Risk level
     */
  getRiskLevelFromScore(score) {
    if (score >= 750) return 'low';
    if (score >= 650) return 'medium';
    return 'high';
  }

  /**
     * Calculate interest alignment between two members
     * @param {Array} interests1 - First member's interests
     * @param {Array} interests2 - Second member's interests
     * @returns {number} Alignment score (0-100)
     */
  calculateInterestAlignment(interests1, interests2) {
    if (!Array.isArray(interests1) || !Array.isArray(interests2)) return 0;

    if (interests1.length === 0 || interests2.length === 0) return 0;

    const commonInterests = interests1.filter(interest =>
      interests2.includes(interest)
    );

    return (commonInterests.length / Math.max(interests1.length, interests2.length)) * 100;
  }

  /**
     * Calculate location proximity between two profiles
     * @param {Object} profile1 - First profile
     * @param {Object} profile2 - Second profile
     * @returns {number} Proximity score (0-100)
     */
  calculateLocationProximity(profile1, profile2) {
    if (!profile1.coordinates_lat || !profile1.coordinates_lng ||
            !profile2.coordinates_lat || !profile2.coordinates_lng) {
      return 0; // No location data
    }

    // Calculate distance using haversine formula (simplified)
    const R = 6371e3; // Earth's radius in meters
    const φ1 = profile1.coordinates_lat * Math.PI/180;
    const φ2 = profile2.coordinates_lat * Math.PI/180;
    const Δφ = (profile2.coordinates_lat-profile1.coordinates_lat) * Math.PI/180;
    const Δλ = (profile2.coordinates_lng-profile1.coordinates_lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const distanceInMeters = R * c; // Distance in meters
    const distanceInKm = distanceInMeters / 1000;

    // Convert to score (inverse relationship: closer = higher score)
    const maxDistanceConsidered = 1000; // 1000km
    const score = Math.max(0, 100 - (distanceInKm / maxDistanceConsidered) * 100);

    return Math.round(score);
  }

  /**
     * Calculate activity level compatibility
     * @param {string} level1 - First member's activity level
     * @param {string} level2 - Second member's activity level
     * @returns {number} Compatibility score (0-100)
     */
  calculateActivityLevelCompatibility(level1, level2) {
    const levels = { 'low': 1, 'moderate': 2, 'high': 3 };

    const level1Value = levels[level1] || 2;
    const level2Value = levels[level2] || 2;

    // Calculate compatibility based on difference
    const difference = Math.abs(level1Value - level2Value);
    return Math.max(0, 100 - (difference * 25));
  }

  /**
     * Estimate communication style (placeholder)
     * @param {Object} profile1 - First profile
     * @param {Object} profile2 - Second profile
     * @returns {string} Communication style compatibility
     */
  estimateCommunicationStyle(profile1, profile2) {
    // Placeholder implementation
    return 'compatible';
  }

  /**
     * Calculate business compatibility score
     * @param {Object} factors - Compatibility factors
     * @returns {number} Compatibility score (0-100)
     */
  calculateBusinessCompatibilityScore(factors) {
    const weights = {
      interest_alignment: 0.4,
      location_proximity: 0.2,
      activity_level_compatibility: 0.2,
      communication_style: 0.2
    };

    let totalScore = 0;
    for (const [key, value] of Object.entries(factors)) {
      if (typeof value === 'number') {
        totalScore += value * weights[key];
      }
    }

    return Math.round(totalScore);
  }

  /**
     * Identify compatibility strengths
     * @param {Object} factors - Compatibility factors
     * @returns {Array} Strengths
     */
  identifyCompatibilityStrengths(factors) {
    const strengths = [];

    if (factors.interest_alignment >= 70) {
      strengths.push('Strong interest alignment');
    }

    if (factors.location_proximity >= 70) {
      strengths.push('Close geographic proximity');
    }

    if (factors.activity_level_compatibility >= 80) {
      strengths.push('High activity level compatibility');
    }

    if (factors.communication_style === 'compatible') {
      strengths.push('Compatible communication styles');
    }

    return strengths;
  }

  /**
     * Identify compatibility improvements
     * @param {Object} factors - Compatibility factors
     * @returns {Array} Improvement areas
     */
  identifyCompatibilityImprovements(factors) {
    const improvements = [];

    if (factors.interest_alignment < 50) {
      improvements.push('Limited interest alignment - consider finding common interests');
    }

    if (factors.location_proximity < 50) {
      improvements.push('Geographic distance may impact collaboration');
    }

    if (factors.activity_level_compatibility < 60) {
      improvements.push('Different activity levels may require compromise');
    }

    return improvements;
  }

  /**
     * Get compatibility recommendation
     * @param {number} score - Compatibility score
     * @returns {string} Recommendation
     */
  getCompatibilityRecommendation(score) {
    if (score >= 80) return 'Highly Compatible - Excellent match for collaboration';
    if (score >= 60) return 'Moderately Compatible - Good potential for collaboration';
    if (score >= 40) return 'Marginally Compatible - Limited collaboration potential';
    return 'Not Compatible - Not recommended for collaboration';
  }

  /**
     * Get member's analysis history
     * @param {string} memberId - member ID
     * @returns {Array} Analysis history
     */
  async getAnalysisHistory(memberId) {
    const results = await db.query(
      'SELECT * FROM fm_profile_analysis WHERE analyzed_member_id = $1 ORDER BY created_at DESC',
      [memberId]
    );

    return results.rows;
  }

  /**
     * Check if analysis is still valid (not expired)
     * @param {string} analysisId - Analysis ID
     * @returns {boolean} Whether analysis is valid
     */
  async isAnalysisValid(analysisId) {
    const result = await db.query(
      'SELECT expires_at FROM fm_profile_analysis WHERE id = $1',
      [analysisId]
    );

    if (result.rows.length === 0) {
      return false;
    }

    const expiration = new Date(result.rows[0].expires_at);
    const now = new Date();

    return now < expiration;
  }
}

module.exports = new memberProfileAnalysisService();
