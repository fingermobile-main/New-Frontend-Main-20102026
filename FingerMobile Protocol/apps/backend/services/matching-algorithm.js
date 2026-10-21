// Algorithmic Matching Service for FingerMobile P2P Platform
// Handles marketplace and lending matching algorithms

const db = require('../db');
const logger = require('../utils/logger');

class MatchingAlgorithmService {
  constructor() {
    // Weight configurations for different matching scenarios
    this.MATCHING_WEIGHTS = {
      // Lush Pressies (gifts/rewards)
      LUSH_PRESSIES: {
        price_match: 0.3,
        category_match: 0.25,
        popularity_score: 0.2,
        member_preference_match: 0.15,
        recent_activity: 0.1
      },
      // PhotoCredits (media credits)
      PHOTO_CREDITS: {
        member_preference_match: 0.3,
        content_type_match: 0.25,
        quality_rating: 0.2,
        price_range_match: 0.15,
        recency: 0.1
      },
      // Lendsq (lending platform)
      LENDSQ: {
        credit_score_match: 0.3,
        risk_tolerance_match: 0.25,
        loan_amount_range: 0.2,
        interest_rate_preference: 0.15,
        repayment_history: 0.1
      },
      // General marketplace
      MARKETPLACE: {
        category_match: 0.3,
        price_range_match: 0.25,
        location_proximity: 0.2,
        member_rating_match: 0.15,
        shipping_preference: 0.1
      }
    };

    // Thresholds for different match types
    this.MATCH_THRESHOLDS = {
      HIGH: 85,
      MEDIUM: 70,
      LOW: 50
    };
  }

  /**
   * Perform marketplace matching between buyers and sellers
   * @param {Object} buyerData - Buyer information
   * @param {Object} sellers - Array of potential sellers
   * @param {string} category - Marketplace category
   * @returns {Array} Ranked list of matches
   */
  async marketplaceMatch(buyerData, sellers, category = 'MARKETPLACE') {
    const matches = [];

    for (const seller of sellers) {
      const matchScore = await this.calculateMarketplaceMatchScore(
        buyerData,
        seller,
        category,
      );

      if (matchScore >= this.MATCH_THRESHOLDS.LOW) {
        matches.push({
          seller_id: seller.id,
          seller_info: seller,
          match_score: matchScore,
          match_reasons: this.generateMatchReasons(buyerData, seller, category),
          confidence: this.matchScoreToConfidence(matchScore)
        });
      }
    }

    // Sort by match score in descending order
    return matches.sort((a, b) => b.match_score - a.match_score);
  }

  /**
   * Calculate marketplace match score
   * @param {Object} buyer - Buyer information
   * @param {Object} seller - Seller information
   * @param {string} category - Marketplace category
   * @returns {number} Match score (0-100)
   */
  async calculateMarketplaceMatchScore(buyer, seller, category) {
    const weights =
      this.MATCHING_WEIGHTS[category] || this.MATCHING_WEIGHTS.MARKETPLACE;
    let totalScore = 0;

    // Category match
    if (buyer.preferred_categories && seller.categories) {
      const categoryMatch = buyer.preferred_categories.some((cat) =>
        seller.categories.includes(cat),
      )
        ? 100
        : 0;
      totalScore += categoryMatch * weights.category_match;
    }

    // Price range match
    if (buyer.budget_range && seller.price_range) {
      const priceMatch = this.calculatePriceRangeMatch(
        buyer.budget_range,
        seller.price_range,
      );
      totalScore += priceMatch * weights.price_range_match;
    }

    // Location proximity (if location-based matching is enabled)
    if (buyer.preferred_location && seller.location_coordinates) {
      const locationMatch = this.calculateLocationProximity(
        buyer.preferred_location,
        seller.location_coordinates,
        buyer.max_distance,
      );
      totalScore += locationMatch * weights.location_proximity;
    }

    // member rating match
    if (buyer.min_seller_rating && seller.rating) {
      const ratingMatch = seller.rating >= buyer.min_seller_rating ? 100 : 0;
      totalScore += ratingMatch * weights.member_rating_match;
    }

    // Additional factors can be added based on category
    switch (category) {
    case 'PHOTO_CREDITS':
      totalScore +=
          (await this.calculatePhotoCreditsFactors(buyer, seller)) *
          weights.content_type_match;
      break;
    case 'LUSH_PRESSIES':
      totalScore +=
          (await this.calculateGiftMatchFactors(buyer, seller)) *
          weights.popularity_score;
      break;
    }

    return Math.min(100, Math.round(totalScore)); // Cap at 100
  }

  /**
   * Calculate price range match score
   * @param {Object} buyerRange - Buyer's budget range
   * @param {Object} sellerRange - Seller's price range
   * @returns {number} Price match score (0-100)
   */
  calculatePriceRangeMatch(buyerRange, sellerRange) {
    if (!buyerRange || !sellerRange) return 50; // Neutral score if not specified

    const buyerMin = buyerRange.min || 0;
    const buyerMax = buyerRange.max || Infinity;
    const sellerMin = sellerRange.min || 0;
    const sellerMax = sellerRange.max || Infinity;

    // Perfect match if ranges overlap significantly
    if (sellerMin >= buyerMin && sellerMax <= buyerMax) {
      return 100;
    }

    // Partial overlap
    if (sellerMin <= buyerMax && sellerMax >= buyerMin) {
      return 75;
    }

    // Close ranges
    if (
      Math.abs(sellerMin - buyerMin) <=
      Math.max(buyerMax - buyerMin, sellerMax - sellerMin) * 0.2
    ) {
      return 50;
    }

    return 0; // No match
  }

  /**
   * Calculate location proximity score
   * @param {Object} buyerLocation - Buyer's location
   * @param {Object} sellerLocation - Seller's location coordinates
   * @param {number} maxDistance - Maximum preferred distance in km
   * @returns {number} Location proximity score (0-100)
   */
  calculateLocationProximity(buyerLocation, sellerLocation, maxDistance = 50) {
    if (!buyerLocation || !sellerLocation) return 0;

    // Simplified distance calculation (in a real app, you'd use haversine formula)
    const distance = this.calculateDistance(
      buyerLocation.lat,
      buyerLocation.lng,
      sellerLocation.lat,
      sellerLocation.lng,
    );

    if (distance <= maxDistance * 0.2) return 100; // Very close
    if (distance <= maxDistance * 0.5) return 75; // Close
    if (distance <= maxDistance) return 50; // Within range
    if (distance <= maxDistance * 1.5) return 25; // Far but acceptable
    return 0; // Too far
  }

  /**
   * Calculate geographic distance (simplified)
   * @param {number} lat1 - Latitude 1
   * @param {number} lng1 - Longitude 1
   * @param {number} lat2 - Latitude 2
   * @param {number} lng2 - Longitude 2
   * @returns {number} Distance in km
   */
  calculateDistance(lat1, lng1, lat2, lng2) {
    // Simplified calculation - in a real app use haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Perform lending/borrowing matching
   * @param {Object} borrower - Borrower information
   * @param {Array} lenders - Array of potential lenders
   * @returns {Array} Ranked list of matches
   */
  async lendingMatch(borrower, lenders) {
    const matches = [];

    for (const lender of lenders) {
      const matchScore = await this.calculateLendingMatchScore(
        borrower,
        lender,
      );

      if (matchScore >= this.MATCH_THRESHOLDS.LOW) {
        matches.push({
          lender_id: lender.id,
          lender_info: lender,
          match_score: matchScore,
          match_reasons: this.generateLendingMatchReasons(borrower, lender),
          expected_interest_rate: this.calculateExpectedInterestRate(
            borrower,
            lender,
          ),
          risk_assessment: await this.assessLendingRisk(borrower, lender),
          confidence: this.matchScoreToConfidence(matchScore)
        });
      }
    }

    // Sort by match score in descending order
    return matches.sort((a, b) => b.match_score - a.match_score);
  }

  /**
   * Calculate lending match score
   * @param {Object} borrower - Borrower information
   * @param {Object} lender - Lender information
   * @returns {number} Match score (0-100)
   */
  async calculateLendingMatchScore(borrower, lender) {
    const weights = this.MATCHING_WEIGHTS.LENDSQ;
    let totalScore = 0;

    // Credit score match
    if (borrower.credit_score && lender.min_credit_score) {
      const creditMatch =
        borrower.credit_score >= lender.min_credit_score ? 100 : 0;
      totalScore += creditMatch * weights.credit_score_match;
    }

    // Risk tolerance match
    if (borrower.risk_profile && lender.risk_tolerance) {
      const riskMatch = this.calculateRiskCompatibility(
        borrower.risk_profile,
        lender.risk_tolerance,
      );
      totalScore += riskMatch * weights.risk_tolerance_match;
    }

    // Loan amount match
    if (borrower.requested_amount && lender.lending_range) {
      const amountMatch = this.calculateLoanAmountMatch(
        borrower.requested_amount,
        lender.lending_range,
      );
      totalScore += amountMatch * weights.loan_amount_range;
    }

    // Interest rate preference
    if (borrower.max_interest_rate && lender.interest_rate_range) {
      const rateMatch = this.calculateInterestRateMatch(
        borrower.max_interest_rate,
        lender.interest_rate_range,
      );
      totalScore += rateMatch * weights.interest_rate_preference;
    }

    // Repayment history
    if (borrower.repayment_history) {
      const historyScore = await this.calculateRepaymentHistoryScore(
        borrower.repayment_history,
      );
      totalScore += historyScore * weights.repayment_history;
    }

    return Math.min(100, Math.round(totalScore)); // Cap at 100
  }

  /**
   * Calculate risk compatibility
   * @param {string} borrowerRisk - Borrower's risk profile
   * @param {string} lenderRisk - Lender's risk tolerance
   * @returns {number} Risk compatibility score (0-100)
   */
  calculateRiskCompatibility(borrowerRisk, lenderRisk) {
    const riskLevels = {
      low: 1,
      medium: 2,
      high: 3
    };

    const borrowerLevel = riskLevels[borrowerRisk] || 2;
    const lenderLevel = riskLevels[lenderRisk] || 2;

    // Higher compatibility when borrower's risk <= lender's tolerance
    if (borrowerLevel <= lenderLevel) {
      return 100;
    } else {
      // Decreasing compatibility for higher risk borrower
      const diff = borrowerLevel - lenderLevel;
      return Math.max(0, 100 - diff * 30);
    }
  }

  /**
   * Calculate loan amount match score
   * @param {number} requestedAmount - Amount borrower wants
   * @param {Object} lendingRange - Lender's lending range
   * @returns {number} Amount match score (0-100)
   */
  calculateLoanAmountMatch(requestedAmount, lendingRange) {
    if (!lendingRange.min || !lendingRange.max) return 50;

    if (
      requestedAmount >= lendingRange.min &&
      requestedAmount <= lendingRange.max
    ) {
      return 100;
    }

    if (
      requestedAmount >= lendingRange.min * 0.8 &&
      requestedAmount <= lendingRange.max * 1.2
    ) {
      return 75;
    }

    if (
      requestedAmount >= lendingRange.min * 0.5 &&
      requestedAmount <= lendingRange.max * 1.5
    ) {
      return 50;
    }

    return 0;
  }

  /**
   * Calculate interest rate match score
   * @param {number} borrowerMaxRate - Maximum rate borrower accepts
   * @param {Object} lenderRateRange - Lender's interest rate range
   * @returns {number} Rate match score (0-100)
   */
  calculateInterestRateMatch(borrowerMaxRate, lenderRateRange) {
    if (!lenderRateRange.min || !lenderRateRange.max) return 50;

    // If lender's min rate is within borrower's max, it's a potential match
    if (lenderRateRange.min <= borrowerMaxRate) {
      return 100;
    }

    if (lenderRateRange.min <= borrowerMaxRate * 1.1) {
      return 75;
    }

    if (lenderRateRange.min <= borrowerMaxRate * 1.2) {
      return 50;
    }

    return 0;
  }

  /**
   * Calculate repayment history score
   * @param {Object} repaymentHistory - Borrower's repayment history
   * @returns {number} History score (0-100)
   */
  async calculateRepaymentHistoryScore(repaymentHistory) {
    if (!repaymentHistory) return 50;

    const { on_time_payments, late_payments, default_history } =
      repaymentHistory;

    let score = 70; // Base score

    // On-time payment percentage
    const totalPayments = (on_time_payments || 0) + (late_payments || 0);
    if (totalPayments > 0) {
      const onTimePercentage = (on_time_payments / totalPayments) * 100;
      score += onTimePercentage * 0.3; // Up to 30 points for payment history
    }

    // Deduct for defaults
    if (default_history && default_history.length > 0) {
      score -= default_history.length * 15; // Heavy penalty for defaults
    }

    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Calculate expected interest rate based on risk
   * @param {Object} borrower - Borrower information
   * @param {Object} lender - Lender information
   * @returns {number} Expected interest rate
   */
  calculateExpectedInterestRate(borrower, lender) {
    const baseRate = lender.base_interest_rate || 5; // Base rate from lender
    const riskAdjustment = this.calculateRiskAdjustment(borrower);

    return baseRate + riskAdjustment;
  }

  /**
   * Calculate risk adjustment based on borrower profile
   * @param {Object} borrower - Borrower information
   * @returns {number} Risk adjustment percentage
   */
  calculateRiskAdjustment(borrower) {
    let adjustment = 0;

    // Lower credit score = higher risk
    if (borrower.credit_score) {
      if (borrower.credit_score < 600) adjustment += 5;
      else if (borrower.credit_score < 700) adjustment += 2;
      else if (borrower.credit_score < 750) adjustment += 1;
    }

    // Repayment history affects risk
    if (borrower.repayment_history?.late_payments > 3) adjustment += 3;
    if (borrower.repayment_history?.default_history?.length > 0)
      adjustment += 5;

    return adjustment;
  }

  /**
   * Assess lending risk
   * @param {Object} borrower - Borrower information
   * @param {Object} lender - Lender information
   * @returns {Object} Risk assessment
   */
  async assessLendingRisk(borrower, _lender) {
    const riskFactors = [];
    let overallRisk = 'medium';
    let riskScore = 50;

    // Credit score risk
    if (borrower.credit_score < 650) {
      riskFactors.push({
        factor: 'credit_score',
        level: 'high',
        impact: 'significant',
        details: `Credit score ${borrower.credit_score} is below recommended threshold`
      });
      riskScore += 20;
    } else if (borrower.credit_score < 750) {
      riskFactors.push({
        factor: 'credit_score',
        level: 'medium',
        impact: 'moderate',
        details: `Credit score ${borrower.credit_score} is adequate`
      });
      riskScore += 10;
    }

    // Loan-to-income risk
    if (borrower.debt_to_income_ratio > 0.4) {
      riskFactors.push({
        factor: 'debt_to_income',
        level: 'high',
        impact: 'significant',
        details: `Debt-to-income ratio of ${(borrower.debt_to_income_ratio * 100).toFixed(2)}% is high`
      });
      riskScore += 15;
    }

    // Repayment history risk
    if (borrower.repayment_history?.late_payments > 5) {
      riskFactors.push({
        factor: 'repayment_history',
        level: 'high',
        impact: 'significant',
        details: `${borrower.repayment_history.late_payments} late payments in history`
      });
      riskScore += 25;
    }

    // Determine overall risk level
    if (riskScore >= 80) overallRisk = 'critical';
    else if (riskScore >= 60) overallRisk = 'high';
    else if (riskScore >= 40) overallRisk = 'medium';
    else overallRisk = 'low';

    return {
      overall_level: overallRisk,
      score: riskScore,
      factors: riskFactors,
      recommendation: this.getLendingRecommendation(overallRisk)
    };
  }

  /**
   * Get lending recommendation based on risk
   * @param {string} riskLevel - Risk level
   * @returns {string} Recommendation
   */
  getLendingRecommendation(riskLevel) {
    switch (riskLevel) {
    case 'low':
      return 'Strong candidate for lending';
    case 'medium':
      return 'Consider with standard terms';
    case 'high':
      return 'Consider with higher interest rate or collateral';
    case 'critical':
      return 'Decline or require significant collateral';
    default:
      return 'Assessment required';
    }
  }

  /**
   * Calculate PhotoCredits specific matching factors
   * @param {Object} buyer - PhotoCredits buyer
   * @param {Object} seller - PhotoCredits seller
   * @returns {number} Match score contribution (0-100)
   */
  async calculatePhotoCreditsFactors(buyer, seller) {
    let score = 0;

    // Content type match
    if (buyer.preferred_content_types && seller.content_types) {
      const matchingTypes = buyer.preferred_content_types.filter((type) =>
        seller.content_types.includes(type),
      );
      if (matchingTypes.length > 0) {
        score +=
          (matchingTypes.length / buyer.preferred_content_types.length) * 60;
      }
    }

    // Quality rating match
    if (buyer.min_quality_rating && seller.quality_rating) {
      if (seller.quality_rating >= buyer.min_quality_rating) {
        score += 40;
      }
    }

    return Math.min(100, Math.round(score));
  }

  /**
   * Calculate gift/present matching factors
   * @param {Object} buyer - Gift buyer
   * @param {Object} seller - Gift seller
   * @returns {number} Match score contribution (0-100)
   */
  async calculateGiftMatchFactors(buyer, seller) {
    let score = 0;

    // Popularity score (based on sales/ratings)
    if (seller.popularity_score > 80) score += 30;
    else if (seller.popularity_score > 60) score += 20;
    else if (seller.popularity_score > 40) score += 10;

    // Recency factor (recently active sellers)
    if (
      seller.last_active &&
      new Date(seller.last_active) >
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ) {
      score += 20; // Recently active
    }

    // Special occasion matching
    if (buyer.special_occasion && seller.special_occasions) {
      if (seller.special_occasions.includes(buyer.special_occasion)) {
        score += 30;
      }
    }

    // Gift category match
    if (buyer.gift_preferences && seller.gift_categories) {
      const matchingCategories = buyer.gift_preferences.filter((cat) =>
        seller.gift_categories.includes(cat),
      );
      if (matchingCategories.length > 0) {
        score +=
          (matchingCategories.length / buyer.gift_preferences.length) * 20;
      }
    }

    return Math.min(100, Math.round(score));
  }

  /**
   * Generate match reasons for explanation
   * @param {Object} buyer - Buyer information
   * @param {Object} seller - Seller information
   * @param {string} category - Marketplace category
   * @returns {Array} List of match reasons
   */
  generateMatchReasons(buyer, seller, category) {
    const reasons = [];

    if (category === 'MARKETPLACE') {
      if (buyer.preferred_categories && seller.categories) {
        const matchingCategories = buyer.preferred_categories.filter((cat) =>
          seller.categories.includes(cat),
        );
        if (matchingCategories.length > 0) {
          reasons.push(`Category match: ${matchingCategories.join(', ')}`);
        }
      }

      if (buyer.budget_range && seller.price_range) {
        const priceMatch = this.calculatePriceRangeMatch(
          buyer.budget_range,
          seller.price_range,
        );
        if (priceMatch > 0) {
          reasons.push(`Price range compatibility: ${priceMatch}% match`);
        }
      }

      if (buyer.min_seller_rating && seller.rating >= buyer.min_seller_rating) {
        reasons.push(
          `Rating meets minimum requirement: ${seller.rating} ≥ ${buyer.min_seller_rating}`,
        );
      }
    }

    return reasons;
  }

  /**
   * Generate lending match reasons
   * @param {Object} borrower - Borrower information
   * @param {Object} lender - Lender information
   * @returns {Array} List of match reasons
   */
  generateLendingMatchReasons(borrower, lender) {
    const reasons = [];

    if (borrower.credit_score >= lender.min_credit_score) {
      reasons.push(
        `Credit score meets requirement: ${borrower.credit_score} ≥ ${lender.min_credit_score}`,
      );
    }

    const riskCompatible = this.calculateRiskCompatibility(
      borrower.risk_profile,
      lender.risk_tolerance,
    );
    if (riskCompatible === 100) {
      reasons.push('Risk profile compatible with lender\'s tolerance');
    }

    const amountMatch = this.calculateLoanAmountMatch(
      borrower.requested_amount,
      lender.lending_range,
    );
    if (amountMatch === 100) {
      reasons.push('Loan amount fits within lender\'s range');
    }

    const rateMatch = this.calculateInterestRateMatch(
      borrower.max_interest_rate,
      lender.interest_rate_range,
    );
    if (rateMatch > 0) {
      reasons.push(`Interest rate alignment: ${rateMatch}% compatibility`);
    }

    return reasons;
  }

  /**
   * Convert match score to confidence level
   * @param {number} score - Match score (0-100)
   * @returns {string} Confidence level
   */
  matchScoreToConfidence(score) {
    if (score >= this.MATCH_THRESHOLDS.HIGH) return 'high';
    if (score >= this.MATCH_THRESHOLDS.MEDIUM) return 'medium';
    if (score >= this.MATCH_THRESHOLDS.LOW) return 'low';
    return 'very_low';
  }

  /**
   * Get top matches after algorithmic matching
   * @param {Array} allMatches - All potential matches with scores
   * @param {number} limit - Maximum number of matches to return
   * @returns {Array} Top matches
   */
  getTopMatches(allMatches, limit = 5) {
    return allMatches
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, limit);
  }

  /**
   * Save matching result to database for analytics
   * @param {string} matchingType - Type of matching ('marketplace', 'lending', etc.)
   * @param {Object} inputData - Input data used for matching
   * @param {Array} results - Matching results
   * @param {string} memberId - member ID initiating the match
   */
  async saveMatchingResult(matchingType, inputData, results, memberId) {
    try {
      const matchingRecord = await db.query(
        `INSERT INTO fm_marketplace_lending_matches (
                    client_id, request_type, match_type, matching_algorithm_data
                ) VALUES ($1, $2, $3, $4)
                RETURNING *`,
        [
          memberId,
          `${matchingType}_match`,
          matchingType,
          {
            input_data: inputData,
            results: results,
            timestamp: new Date()
          }
        ],
      );

      // Log the matching activity
      await db.query(
        `INSERT INTO fm_sentinel_logs (
                    log_type, severity, entity_id, entity_type, 
                    action_taken, details
                ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          'algorithmic_match',
          'info',
          matchingRecord.rows[0].id,
          'matching_result',
          'completed',
          {
            matching_type: matchingType,
            number_of_results: results.length,
            member_id: memberId,
            timestamp: new Date().toISOString()
          }
        ],
      );

      return matchingRecord.rows[0];
    } catch (error) {
      logger.error('Error saving matching result:', error.message);
      throw error;
    }
  }

  /**
   * Update matching algorithms based on feedback
   * @param {string} algorithmId - Algorithm ID
   * @param {Object} feedback - member feedback data
   */
  async updateMatchingAlgorithm(algorithmId, feedback) {
    try {
      const algorithm = await db.query(
        'SELECT * FROM fm_matching_algorithms WHERE id = $1',
        [algorithmId],
      );

      if (algorithm.rows.length === 0) {
        throw new Error('Algorithm not found');
      }

      const currentParams = algorithm.rows[0].parameters || {};

      // Adjust algorithm parameters based on feedback
      const updatedParams = this.adjustAlgorithmParams(currentParams, feedback);

      // Update the algorithm
      await db.query(
        `UPDATE fm_matching_algorithms 
                SET parameters = $1, updated_at = CURRENT_TIMESTAMP 
                WHERE id = $2`,
        [updatedParams, algorithmId],
      );

      // Log the update
      await db.query(
        `INSERT INTO fm_sentinel_logs (
                    log_type, severity, entity_id, entity_type, 
                    action_taken, details
                ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          'algorithm_update',
          'info',
          algorithmId,
          'matching_algorithm',
          'updated',
          {
            feedback_used: feedback,
            old_params: currentParams,
            new_params: updatedParams,
            timestamp: new Date().toISOString()
          }
        ],
      );
    } catch (error) {
      logger.error('Error updating matching algorithm:', error.message);
      throw error;
    }
  }

  /**
   * Adjust algorithm params based on feedback
   * @param {Object} currentParams - Current algorithm parameters
   * @param {Object} feedback - Feedback data
   * @returns {Object} Updated parameters
   */
  adjustAlgorithmParams(currentParams, feedback) {
    const updatedParams = { ...currentParams };

    // Simple example: adjust weights for successful matching dimensions
    if (feedback.positive_feedback) {
      // Increase weights for successful matching dimensions
      Object.keys(updatedParams.weights || {}).forEach((key) => {
        updatedParams.weights[key] = Math.min(
          1.0,
          (updatedParams.weights[key] || 0.5) + 0.05,
        );
      });
    } else if (feedback.negative_feedback) {
      // Decrease weights for problematic matching dimensions
      Object.keys(updatedParams.weights || {}).forEach((key) => {
        updatedParams.weights[key] = Math.max(
          0.1,
          (updatedParams.weights[key] || 0.5) - 0.05,
        );
      });
    }

    updatedParams.last_updated = new Date();
    return updatedParams;
  }
}

module.exports = new MatchingAlgorithmService();
