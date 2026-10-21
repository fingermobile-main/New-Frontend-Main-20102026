const CreatorTierModel = require('../models/CreatorTierModel');
const logger = require('../utils/logger');

/**
 * Public Endpoint: Fetch Live Spot Availability & Cohorts
 * GET /api/creators/availability?country=NG
 */
async function getAvailability(req, res) {
  try {
    const country = req.query.country || req.headers['cf-ipcountry'] || 'NG';
    const availability = await CreatorTierModel.getAvailability(country);

    return res.status(200).json({
      success: true,
      data: availability
    });
  } catch (error) {
    if (logger && logger.error) logger.error('Error fetching creator availability:', error);
    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to retrieve creator capacity'
    });
  }
}

/**
 * Endpoint: Process Creator Tier Registration with Race-Condition-Safe Atomic Claim
 * POST /api/creators/signup
 */
async function processCreatorSignup(req, res) {
  try {
    const { userId, countryCode, tier, inviteToken } = req.body;
    const isGeoSuspect = req.body.isGeoSuspect || false;

    if (!userId || !countryCode || !tier) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_FIELDS',
        message: 'userId, countryCode, and tier are required.'
      });
    }

    const result = await CreatorTierModel.processCreatorSignup({
      userId,
      countryCode,
      tier,
      isGeoSuspect,
      rawToken: inviteToken
    });

    if (!result.success) {
      const statusCode = result.reason === 'REGISTRATION_CLOSED' ? 403 : 400;
      return res.status(statusCode).json(result);
    }

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    if (logger && logger.error) logger.error('Error processing creator signup:', error);
    return res.status(500).json({
      success: false,
      error: 'SIGNUP_FAILED',
      message: 'An error occurred during creator seat registration.'
    });
  }
}

/**
 * Endpoint: Claim Dated Cohort Seat
 * POST /api/creators/claim-cohort
 */
async function claimCohortSeat(req, res) {
  try {
    const { cohortId, userId } = req.body;
    if (!cohortId || !userId) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_FIELDS',
        message: 'cohortId and userId are required.'
      });
    }

    const result = await CreatorTierModel.claimCohortSeat(cohortId, userId);
    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    if (logger && logger.error) logger.error('Error claiming cohort seat:', error);
    return res.status(500).json({
      success: false,
      error: 'COHORT_CLAIM_FAILED',
      message: 'Failed to reserve cohort seat.'
    });
  }
}

/**
 * Admin Endpoint: Get Country Tier Configurations
 * GET /api/admin/creator-rules/:countryCode
 */
async function getCountryTierRules(req, res) {
  try {
    const { countryCode } = req.params;
    const rules = await CreatorTierModel.getTierRules(countryCode);

    return res.status(200).json({
      success: true,
      data: {
        countryCode: countryCode.toUpperCase(),
        tiers: rules
      }
    });
  } catch (error) {
    if (logger && logger.error) logger.error('Error fetching admin creator rules:', error);
    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to fetch rules.'
    });
  }
}

/**
 * Admin Endpoint: Update Tier Capacities & Toggles with Immutable Audit
 * PUT /api/admin/creator-rules/:countryCode
 */
async function updateCountryTierRules(req, res) {
  try {
    const { countryCode } = req.params;
    const { tier, maxCapacity, registrationStatus, admissionMode } = req.body;
    const adminId = req.user?.id || req.body.adminId || 'SUPER_ADMIN_SYSTEM';

    if (!tier || maxCapacity === undefined || !registrationStatus || !admissionMode) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_FIELDS',
        message: 'tier, maxCapacity, registrationStatus, and admissionMode are required.'
      });
    }

    const result = await CreatorTierModel.updateCountryTierRules({
      countryCode,
      tier,
      maxCapacity: parseInt(maxCapacity, 10),
      registrationStatus,
      admissionMode,
      adminId,
      ipAddress: req.ip
    });

    if (!result.success) {
      if (result.notFound) return res.status(404).json(result);
      if (result.invalidCapacity) return res.status(400).json(result);
    }

    return res.status(200).json({
      success: true,
      data: {
        countryCode: countryCode.toUpperCase(),
        updatedAt: new Date().toISOString(),
        updatedBy: adminId,
        config: result.data
      }
    });
  } catch (error) {
    if (logger && logger.error) logger.error('Error updating country tier rules:', error);
    return res.status(500).json({
      success: false,
      error: 'UPDATE_FAILED',
      message: 'Failed to update tier configurations.'
    });
  }
}

module.exports = {
  getAvailability,
  processCreatorSignup,
  claimCohortSeat,
  getCountryTierRules,
  updateCountryTierRules
};
