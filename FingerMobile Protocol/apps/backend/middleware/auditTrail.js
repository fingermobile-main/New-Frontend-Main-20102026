/**
 * AuditTrailMiddleware
 * Comprehensive STERCS CommandBank audit logging for all critical actions
 */

const pool = require('../database/connection');
const logger = require('../utils/logger');

class AuditTrailMiddleware {
  /**
   * Log all authenticated requests with structural context boundaries
   */
  static async logAction(req, res, next) {
    // Only log authenticated requests
    if (!req.user || !req.user.id) {
      return next();
    }

    const originalJson = res.json.bind(res);

    res.json = (body) => {
      const isSuccess = res.statusCode >= 200 && res.statusCode < 400;
      const status = isSuccess ? 'SUCCESS' : (res.statusCode === 403 || res.statusCode === 401 ? 'BLOCKED' : 'FAILURE');
      const failureReason = isSuccess ? null : (body && body.message ? body.message : 'HTTP Error');

      const action = AuditTrailMiddleware.determineAction(req.method, req.path);
      const category = AuditTrailMiddleware.determineCategory(req.path);

      const modulesTouched = AuditTrailMiddleware.mapModulesTouched(req.path);

      const auditData = {
        service: req.headers['x-stercs-service'] || 'FingerMobile Protocol',
        zone: req.headers['x-stercs-zone'] || 'Platform',
        node_group: process.env.NODE_GROUP || 'CentralOffice',

        user_id: req.user.id,
        role: req.user.role || 'user',
        is_root: req.user.role === 'admin' || req.user.role === 'root',
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),

        event_category: category,
        action: action,
        status: status,
        failure_reason: failureReason,

        resource_type: AuditTrailMiddleware.extractResourceType(req.path),
        resource_id: AuditTrailMiddleware.extractResourceId(req.path),

        context: {
          panelName: req.headers['x-stercs-panel'] || 'Platform',
          modulesTouched: modulesTouched,
          entityId: AuditTrailMiddleware.extractResourceId(req.path),
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode
        },
        metadata: {
          request_body: AuditTrailMiddleware.sanitizeBody(req.body),
          response_summary: AuditTrailMiddleware.summarizeResponse(body)
        },
        created_at: new Date()
      };

      // Log to database asynchronously (don't block response)
      AuditTrailMiddleware.writeAuditLog(auditData).catch((err) => {
        logger.error('Audit log write failed:', err.message);
      });

      // Call original json method
      return originalJson(body);
    };

    next();
  }

  static determineAction(method, path) {
    // Check if it's a specific known action from URL
    if (path.includes('/approve')) return 'grant_approval';
    if (path.includes('/payout')) return 'payout';
    if (path.includes('/upload')) return 'upload';

    const actionMap = {
      'GET': 'read',
      'POST': 'create',
      'PUT': 'update',
      'PATCH': 'update',
      'DELETE': 'delete'
    };
    return actionMap[method] || 'unknown';
  }

  static determineCategory(path) {
    if (path.includes('/auth') || path.includes('/login')) return 'AUTH';
    if (path.includes('/admin') || path.includes('/policy')) return 'POLICY';
    if (path.includes('/pay') || path.includes('/wallet')) return 'TRANSACTION';
    if (path.includes('/mod') || path.includes('/report')) return 'MODERATION';
    return 'SYSTEM';
  }

  static mapModulesTouched(path) {
    const modules = [];
    if (path.includes('/auth')) modules.push('AuthCore');
    if (path.includes('/pay') || path.includes('/wallet')) modules.push('BillingGateway');
    if (path.includes('/products') || path.includes('/store')) modules.push('ProductCatalog');
    if (path.includes('/admin')) modules.push('AdminPanel');
    return modules.length ? modules : ['CoreAPI'];
  }

  static extractResourceType(path) {
    const parts = path.split('/').filter(p => p && !p.startsWith(':'));
    return parts[1] || 'unknown';
  }

  static extractResourceId(path) {
    const match = path.match(/\/(\w+)\/([a-f0-9-]+)/i);
    return match ? match[2] : null;
  }

  static sanitizeBody(body) {
    if (!body) return null;
    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'credit_card', 'ssn'];
    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });
    return sanitized;
  }

  static summarizeResponse(body) {
    if (!body) return null;
    return {
      success: body.success,
      message: body.message,
      has_data: !!body.data,
      data_count: Array.isArray(body.data) ? body.data.length : null
    };
  }

  static async writeAuditLog(data) {
    try {
      const query = `
        INSERT INTO audit_logs (
          service, zone, node_group,
          user_id, role, is_root, ip_address, user_agent,
          event_category, action, status, failure_reason,
          resource_type, resource_id, context, metadata, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      `;

      await pool.query(query, [
        data.service, data.zone, data.node_group,
        data.user_id, data.role, data.is_root, data.ip_address, data.user_agent,
        data.event_category, data.action, data.status, data.failure_reason,
        data.resource_type, data.resource_id,
        JSON.stringify(data.context),
        JSON.stringify(data.metadata),
        data.created_at
      ]);
    } catch (error) {
      logger.error('Failed to write STERCS audit log:', error.message);
    }
  }
}

module.exports = AuditTrailMiddleware;
