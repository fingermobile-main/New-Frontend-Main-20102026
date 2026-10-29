/**
 * Phone Intelligence Controller - FingerMobile Protocol™
 * Provides REST API endpoints for Phone Reconnaissance, Carrier Detection & Risk Scoring
 */

const phoneIntelligenceService = require('../services/PhoneIntelligenceService');
const logger = require('../utils/logger');

class PhoneIntelligenceController {
  /**
   * POST /api/phone/scan
   * Deep scan including OSINT dorks and PhoneInfoga sidecar intelligence
   */
  async scanPhone(req, res) {
    try {
      const { phone: rawPhone, phoneNumber, country = 'NG' } = req.body;
      const phone = rawPhone || phoneNumber;
      if (!phone) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is required in request body.'
        });
      }

      const result = await phoneIntelligenceService.deepScan(phone, country);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      if (logger && typeof logger.error === 'function') logger.error('Error scanning phone:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to scan phone intelligence',
        error: error.message
      });
    }
  }

  /**
   * POST /api/phone/validate
   * Fast Tier 1 validation used during registration (< 2ms)
   */
  async validatePhone(req, res) {
    try {
      const { phone: rawPhone, phoneNumber, country = 'NG' } = req.body;
      const phone = rawPhone || phoneNumber;
      if (!phone) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is required.'
        });
      }

      const result = phoneIntelligenceService.analyzeFast(phone, country);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Phone validation failed',
        error: error.message
      });
    }
  }

  /**
   * GET /api/phone/history/:phone
   */
  async getHistory(req, res) {
    try {
      const { phone } = req.params;
      const history = await phoneIntelligenceService.getScanHistory(phone);
      return res.status(200).json({
        success: true,
        data: history
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to load phone scan history',
        error: error.message
      });
    }
  }
}

module.exports = new PhoneIntelligenceController();
