/**
 * GovernanceService
 * Manages AI governance policies, consent tracking, and audit logging
 */

const pool = require('../database/connection');

class GovernanceService {
  /**
   * Get all governance policies
   */
  async getAllPolicies(filters = {}) {
    try {
      const { status, limit = 50, offset = 0 } = filters;
      
      let query = 'SELECT * FROM ai_governance_policies';
      const params = [];
      const conditions = [];
      
      if (status) {
        conditions.push(`status = $${params.length + 1}`);
        params.push(status);
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);
      
      const result = await pool.query(query, params);
      
      return {
        policies: result.rows,
        total: result.rows.length,
        limit,
        offset
      };
    } catch (error) {
      logger.error('Error in GovernanceService.getAllPolicies:', error);
      throw error;
    }
  }

  /**
   * Get policy by ID
   */
  async getPolicyById(policyId) {
    try {
      const query = 'SELECT * FROM ai_governance_policies WHERE id = $1 OR policy_id = $1';
      const result = await pool.query(query, [policyId]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error in GovernanceService.getPolicyById:', error);
      throw error;
    }
  }

  /**
   * Create new governance policy
   */
  async createPolicy(policyData, userId) {
    try {
      const {
        policy_id,
        name,
        description,
        version = '1.0.0',
        status = 'active',
        allowed_actions = [],
        banned_actions = [],
        require_explicit_consent = true,
        data_handling_config = null,
        audit_config = null
      } = policyData;
      
      const query = `
        INSERT INTO ai_governance_policies (
          policy_id, name, description, version, status,
          allowed_actions, banned_actions, require_explicit_consent,
          data_handling_config, audit_config, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;
      
      const values = [
        policy_id,
        name,
        description,
        version,
        status,
        JSON.stringify(allowed_actions),
        JSON.stringify(banned_actions),
        require_explicit_consent,
        data_handling_config ? JSON.stringify(data_handling_config) : null,
        audit_config ? JSON.stringify(audit_config) : null,
        userId
      ];
      
      const result = await pool.query(query, values);
      
      // Log audit event
      await this.logAudit({
        user_id: userId,
        action: 'policy_created',
        resource_type: 'governance_policy',
        resource_id: result.rows[0].id,
        result: 'allowed',
        details: { policy_id, name }
      });
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error in GovernanceService.createPolicy:', error);
      throw error;
    }
  }

  /**
   * Update existing policy
   */
  async updatePolicy(policyId, updateData, userId) {
    try {
      const existing = await this.getPolicyById(policyId);
      if (!existing) {
        throw new Error('Policy not found');
      }
      
      const fields = [];
      const values = [];
      let paramIndex = 1;
      
      for (const [key, value] of Object.entries(updateData)) {
        if (value !== undefined && key !== 'id' && key !== 'created_at') {
          if (Array.isArray(value) || typeof value === 'object') {
            fields.push(`${key} = $${paramIndex}`);
            values.push(JSON.stringify(value));
          } else {
            fields.push(`${key} = $${paramIndex}`);
            values.push(value);
          }
          paramIndex++;
        }
      }
      
      if (fields.length === 0) {
        return existing;
      }
      
      values.push(policyId);
      const query = `
        UPDATE ai_governance_policies
        SET ${fields.join(', ')} updated_at = NOW()
        WHERE id = $${paramIndex} OR policy_id = $${paramIndex}
        RETURNING *
      `;
      
      const result = await pool.query(query, values);
      
      // Log audit event
      await this.logAudit({
        user_id: userId,
        action: 'policy_updated',
        resource_type: 'governance_policy',
        resource_id: existing.id,
        result: 'allowed',
        details: { policy_id: existing.policy_id, updates: Object.keys(updateData) }
      });
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error in GovernanceService.updatePolicy:', error);
      throw error;
    }
  }

  /**
   * Delete policy
   */
  async deletePolicy(policyId, userId) {
    try {
      const existing = await this.getPolicyById(policyId);
      if (!existing) {
        throw new Error('Policy not found');
      }
      
      const query = 'DELETE FROM ai_governance_policies WHERE id = $1 OR policy_id = $1 RETURNING *';
      const result = await pool.query(query, [policyId]);
      
      // Log audit event
      await this.logAudit({
        user_id: userId,
        action: 'policy_deleted',
        resource_type: 'governance_policy',
        resource_id: existing.id,
        result: 'allowed',
        details: { policy_id: existing.policy_id }
      });
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error in GovernanceService.deletePolicy:', error);
      throw error;
    }
  }

  /**
   * Grant user consent for a policy
   */
  async grantConsent(userId, policyId, consentType = 'explicit', metadata = {}) {
    try {
      const policy = await this.getPolicyById(policyId);
      if (!policy) {
        throw new Error('Policy not found');
      }
      
      const query = `
        INSERT INTO ai_consent_records (user_id, policy_id, consent_type, metadata)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, policy_id)
        DO UPDATE SET 
          consent_type = EXCLUDED.consent_type,
          granted_at = NOW(),
          withdrawn_at = NULL,
          metadata = EXCLUDED.metadata
        RETURNING *
      `;
      
      const result = await pool.query(query, [userId, policy.id, consentType, JSON.stringify(metadata)]);
      
      // Log audit event
      await this.logAudit({
        user_id: userId,
        action: 'consent_granted',
        resource_type: 'governance_consent',
        resource_id: result.rows[0].id,
        policy_id: policy.id,
        result: 'allowed',
        details: { policy_id: policy.policy_id, consent_type: consentType }
      });
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error in GovernanceService.grantConsent:', error);
      throw error;
    }
  }

  /**
   * Withdraw user consent
   */
  async withdrawConsent(userId, policyId) {
    try {
      const query = `
        UPDATE ai_consent_records
        SET consent_type = 'withdrawn', withdrawn_at = NOW()
        WHERE user_id = $1 AND policy_id = $2
        RETURNING *
      `;
      
      const result = await pool.query(query, [userId, policyId]);
      
      if (result.rows.length === 0) {
        throw new Error('Consent record not found');
      }
      
      // Log audit event
      await this.logAudit({
        user_id: userId,
        action: 'consent_withdrawn',
        resource_type: 'governance_consent',
        resource_id: result.rows[0].id,
        result: 'allowed',
        details: { policy_id }
      });
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error in GovernanceService.withdrawConsent:', error);
      throw error;
    }
  }

  /**
   * Check if user has valid consent
   */
  async checkConsent(userId, policyId) {
    try {
      const query = `
        SELECT EXISTS (
          SELECT 1 FROM ai_consent_records
          WHERE user_id = $1
            AND policy_id = $2
            AND consent_type != 'withdrawn'
            AND (withdrawn_at IS NULL OR withdrawn_at > NOW())
        ) as has_consent
      `;
      
      const result = await pool.query(query, [userId, policyId]);
      return result.rows[0].has_consent;
    } catch (error) {
      logger.error('Error in GovernanceService.checkConsent:', error);
      throw error;
    }
  }

  /**
   * Get user's consent records
   */
  async getUserConsents(userId, limit = 50) {
    try {
      const query = `
        SELECT acr.*, agp.name as policy_name, agp.policy_id
        FROM ai_consent_records acr
        JOIN ai_governance_policies agp ON acr.policy_id = agp.id
        WHERE acr.user_id = $1
        ORDER BY acr.granted_at DESC
        LIMIT $2
      `;
      
      const result = await pool.query(query, [userId, limit]);
      return result.rows;
    } catch (error) {
      logger.error('Error in GovernanceService.getUserConsents:', error);
      throw error;
    }
  }

  /**
   * Log audit event
   */
  async logAudit(auditData) {
    try {
      const {
        user_id,
        action,
        resource_type,
        resource_id,
        policy_id,
        result,
        details,
        ip_address,
        user_agent
      } = auditData;
      
      const query = `
        INSERT INTO ai_audit_logs (
          user_id, action, resource_type, resource_id,
          policy_id, result, details, ip_address, user_agent
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;
      
      await pool.query(query, [
        user_id,
        action,
        resource_type,
        resource_id,
        policy_id,
        result,
        details ? JSON.stringify(details) : null,
        ip_address || null,
        user_agent || null
      ]);
    } catch (error) {
      logger.error('Error in GovernanceService.logAudit:', error);
      // Don't throw - audit logging failures shouldn't break main operations
    }
  }

  /**
   * Get audit logs with filtering
   */
  async getAuditLogs(filters = {} limit = 100, offset = 0) {
    try {
      const { user_id, action, result: filterResult, start_date, end_date } = filters;
      
      let query = 'SELECT * FROM ai_audit_logs';
      const params = [];
      const conditions = [];
      
      if (user_id) {
        conditions.push(`user_id = $${params.length + 1}`);
        params.push(user_id);
      }
      
      if (action) {
        conditions.push(`action = $${params.length + 1}`);
        params.push(action);
      }
      
      if (filterResult) {
        conditions.push(`result = $${params.length + 1}`);
        params.push(filterResult);
      }
      
      if (start_date) {
        conditions.push(`created_at >= $${params.length + 1}`);
        params.push(start_date);
      }
      
      if (end_date) {
        conditions.push(`created_at <= $${params.length + 1}`);
        params.push(end_date);
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);
      
      const result = await pool.query(query, params);
      
      return {
        logs: result.rows,
        total: result.rows.length,
        limit,
        offset
      };
    } catch (error) {
      logger.error('Error in GovernanceService.getAuditLogs:', error);
      throw error;
    }
  }

  /**
   * Validate if action is allowed by policy
   */
  async validateAction(policyId, action, userId) {
    try {
      const policy = await this.getPolicyById(policyId);
      if (!policy) {
        return { allowed: false, reason: 'Policy not found' };
      }
      
      // Check if user has consent
      const hasConsent = await this.checkConsent(userId, policy.id);
      if (!hasConsent && policy.require_explicit_consent) {
        return { allowed: false, reason: 'User consent required' };
      }
      
      // Check if action is banned
      const bannedActions = Array.isArray(policy.banned_actions) 
        ? policy.banned_actions 
        : JSON.parse(policy.banned_actions || '[]');
      
      if (bannedActions.includes(action)) {
        return { allowed: false, reason: 'Action is banned by policy' };
      }
      
      // Check if action is explicitly allowed (if allowed_actions is defined)
      const allowedActions = Array.isArray(policy.allowed_actions)
        ? policy.allowed_actions
        : JSON.parse(policy.allowed_actions || '[]');
      
      if (allowedActions.length > 0 && !allowedActions.includes(action)) {
        return { allowed: false, reason: 'Action not in allowed list' };
      }
      
      return { allowed: true, policy };
    } catch (error) {
      logger.error('Error in GovernanceService.validateAction:', error);
      throw error;
    }
  }
}

module.exports = new GovernanceService();
