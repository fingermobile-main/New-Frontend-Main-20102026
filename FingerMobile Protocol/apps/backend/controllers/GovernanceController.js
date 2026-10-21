/**
 * GovernanceController
 * Manages AI governance policies, consent tracking, and audit logging
 */

const governanceService = require('../services/governanceService');
const logger = require('../utils/logger');

class GovernanceController {
  /**
   * GET /api/governance/policies
   * Get all governance policies
   */
  async getAllPolicies(req, res) {
    try {
      const filters = {
        status: req.query.status,
        limit: parseInt(req.query.limit) || 50,
        offset: parseInt(req.query.offset) || 0
      };

      const result = await governanceService.getAllPolicies(filters);

      res.json({
        success: true, message: 'Governance policies retrieved successfully', data: result
      });
    } catch (error) {
      logger.error('Error in GovernanceController.getAllPolicies:', error);
      res.status(500).json({
        success: false, error: 'Failed to retrieve governance policies',
        details: error.message
      });
    }
  }

  /**
   * GET /api/governance/policies/:id
   * Get policy by ID
   */
  async getPolicyById(req, res) {
    try {
      const { id } = req.params;

      const policy = await governanceService.getPolicyById(id);

      if (!policy) {
        return res.status(404).json({
          success: false, error: 'Policy not found'
        });
      }

      res.json({
        success: true, message: 'Policy retrieved successfully', data: policy
      });
    } catch (error) {
      logger.error('Error in GovernanceController.getPolicyById:', error);
      res.status(500).json({
        success: false, error: 'Failed to retrieve policy',
        details: error.message
      });
    }
  }

  /**
   * POST /api/governance/policies
   * Create new governance policy
   */
  async createPolicy(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const policyData = req.body;

      // Validation
      if (!policyData.policy_id || !policyData.name) {
        return res.status(400).json({
          success: false, error: 'Policy ID and name are required'
        });
      }

      const policy = await governanceService.createPolicy(policyData, userId);

      res.status(201).json({
        success: true, message: 'Policy created successfully', data: policy
      });
    } catch (error) {
      logger.error('Error in GovernanceController.createPolicy:', error);
      res.status(500).json({
        success: false, error: 'Failed to create policy',
        details: error.message
      });
    }
  }

  /**
   * PUT /api/governance/policies/:id
   * Update existing policy
   */
  async updatePolicy(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.user?.userId;
      const updateData = req.body;

      const policy = await governanceService.updatePolicy(id, updateData, userId);

      res.json({
        success: true, message: 'Policy updated successfully', data: policy
      });
    } catch (error) {
      logger.error('Error in GovernanceController.updatePolicy:', error);

      if (error.message === 'Policy not found') {
        return res.status(404).json({
          success: false, error: 'Policy not found'
        });
      }

      res.status(500).json({
        success: false, error: 'Failed to update policy',
        details: error.message
      });
    }
  }

  /**
   * DELETE /api/governance/policies/:id
   * Delete policy
   */
  async deletePolicy(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.user?.userId;

      const policy = await governanceService.deletePolicy(id, userId);

      res.json({
        success: true, message: 'Policy deleted successfully', data: policy
      });
    } catch (error) {
      logger.error('Error in GovernanceController.deletePolicy:', error);

      if (error.message === 'Policy not found') {
        return res.status(404).json({
          success: false, error: 'Policy not found'
        });
      }

      res.status(500).json({
        success: false, error: 'Failed to delete policy', details: error.message
      });
    }
  }

  /**
   * POST /api/governance/consent
   * Grant user consent for a policy
   */
  async grantConsent(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const { policy_id, consent_type = 'explicit', metadata = {} } = req.body;

      if (!policy_id) {
        return res.status(400).json({
          success: false, error: 'Policy ID is required'
        });
      }

      const consent = await governanceService.grantConsent(userId, policy_id, consent_type, metadata);

      res.status(201).json({
        success: true, message: 'Consent granted successfully', data: consent
      });
    } catch (error) {
      logger.error('Error in GovernanceController.grantConsent:', error);

      if (error.message === 'Policy not found') {
        return res.status(404).json({
          success: false, error: 'Policy not found'
        });
      }

      res.status(500).json({
        success: false, error: 'Failed to grant consent',
        details: error.message
      });
    }
  }

  /**
   * DELETE /api/governance/consent/:policyId
   * Withdraw user consent
   */
  async withdrawConsent(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const { policyId } = req.params;

      const consent = await governanceService.withdrawConsent(userId, policyId);

      res.json({
        success: true, message: 'Consent withdrawn successfully', data: consent
      });
    } catch (error) {
      logger.error('Error in GovernanceController.withdrawConsent:', error);

      if (error.message === 'Consent record not found') {
        return res.status(404).json({
          success: false, error: 'Consent record not found'
        });
      }

      res.status(500).json({
        success: false, error: 'Failed to withdraw consent', details: error.message
      });
    }
  }

  /**
   * GET /api/governance/consent/user
   * Get user's consent records
   */
  async getUserConsents(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const limit = parseInt(req.query.limit) || 50;

      const consents = await governanceService.getUserConsents(userId, limit);

      res.json({
        success: true,
        message: 'User consents retrieved successfully',
        data: {
          consents,
          total: consents.length, limit
        }
      });
    } catch (error) {
      logger.error('Error in GovernanceController.getUserConsents:', error);
      res.status(500).json({
        success: false, error: 'Failed to retrieve user consents',
        details: error.message
      });
    }
  }

  /**
   * POST /api/governance/validate
   * Validate if action is allowed by policy
   */
  async validateAction(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const { policy_id, action } = req.body;

      if (!policy_id || !action) {
        return res.status(400).json({
          success: false, error: 'Policy ID and action are required'
        });
      }

      const validation = await governanceService.validateAction(policy_id, action, userId);

      res.json({
        success: true, message: 'Action validation completed', data: validation
      });
    } catch (error) {
      logger.error('Error in GovernanceController.validateAction:', error);
      res.status(500).json({
        success: false, error: 'Failed to validate action',
        details: error.message
      });
    }
  }

  /**
   * GET /api/governance/audit-logs
   * Get audit logs with filtering
   */
  async getAuditLogs(req, res) {
    try {
      const filters = {
        user_id: req.query.user_id,
        action: req.query.action,
        result: req.query.result,
        start_date: req.query.start_date,
        end_date: req.query.end_date
      };

      const limit = parseInt(req.query.limit) || 100;
      const offset = parseInt(req.query.offset) || 0;

      const result = await governanceService.getAuditLogs(filters, limit, offset);

      res.json({
        success: true, message: 'Audit logs retrieved successfully', data: result
      });
    } catch (error) {
      logger.error('Error in GovernanceController.getAuditLogs:', error);
      res.status(500).json({
        success: false, error: 'Failed to retrieve audit logs',
        details: error.message
      });
    }
  }
}

module.exports = new GovernanceController();
