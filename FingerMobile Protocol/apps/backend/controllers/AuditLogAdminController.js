const { securityDb } = require('../db');
const logger = require('../utils/logger');

class AuditLogAdminController {

  static async queryLogs(req, res) {
    try {
      const { limit = 50, offset = 0, user_id, action, resource_type, startDate, endDate } = req.query;

      let query = 'SELECT * FROM audit_logs WHERE 1=1';
      const params = [];
      let paramCount = 1;

      if (user_id) {
        query += ` AND user_id = $${paramCount++}`;
        params.push(user_id);
      }
      if (action) {
        query += ` AND action = $${paramCount++}`;
        params.push(action);
      }
      if (resource_type) {
        query += ` AND resource_type = $${paramCount++}`;
        params.push(resource_type);
      }
      if (startDate) {
        const dStart = new Date(startDate);
        if (!isNaN(dStart)) {
          query += ` AND created_at >= $${paramCount++}`;
          params.push(dStart.toISOString());
        }
      }
      if (endDate) {
        const dEnd = new Date(endDate);
        if (!isNaN(dEnd)) {
          query += ` AND created_at <= $${paramCount++}`;
          params.push(dEnd.toISOString());
        }
      }

      // Count total for pagination
      const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
      const countResult = await securityDb.query(countQuery, params);
      const total = parseInt(countResult.rows[0].count, 10);

      // Add pagination and ordering
      query += ` ORDER BY created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
      params.push(limit, offset);

      const result = await securityDb.query(query, params);

      return res.status(200).json({
        total,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
        logs: result.rows
      });
    } catch (error) {
      logger.error('Error querying audit logs:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getStats(req, res) {
    try {
      // Get total count
      const totalResult = await securityDb.query('SELECT COUNT(*) FROM audit_logs');
      const totalLogs = parseInt(totalResult.rows[0].count, 10);

      // Get count by action
      const actionStats = await securityDb.query(`
        SELECT action, COUNT(*) as count 
        FROM audit_logs 
        GROUP BY action 
        ORDER BY count DESC
      `);

      // Get timeline for the last 7 days
      const timelineStats = await securityDb.query(`
        SELECT DATE(created_at) as date, COUNT(*) as count 
        FROM audit_logs 
        WHERE created_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `);

      return res.status(200).json({
        totalLogs,
        byAction: actionStats.rows,
        timeline: timelineStats.rows
      });
    } catch (error) {
      logger.error('Error getting audit stats:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async exportLogs(req, res) {
    try {
      // Simple export (reusing logic from ExportController or doing basic JSON dump)
      const { format = 'json' } = req.query;

      const result = await securityDb.query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10000');

      if (format === 'csv') {
        const logs = result.rows;
        if (logs.length === 0) return res.send('');

        const headers = Object.keys(logs[0]).join(',');

        const escapeCSV = (val) => {
          if (val === null || val === undefined) return '""';
          let str = typeof val === 'object' ? JSON.stringify(val) : String(val);
          return `"${str.replace(/"/g, '""')}"`; }; const rows = logs.map(log => Object.values(log).map(escapeCSV).join(',')); res.setHeader('Content-Type', 'text/csv'); res.setHeader('Content-Disposition', 'attachment; filename="audit_logs.csv"'); return res.status(200).send([headers, ...rows].join('\n')); } // Default JSON res.setHeader('Content-Disposition', 'attachment; filename="audit_logs.json"');
      return res.status(200).json(result.rows);
    } catch (error) {
      logger.error('Error exporting audit logs:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async cleanupLogs(req, res) {
    try {
      const { retentionDays = 90 } = req.body;

      if (isNaN(retentionDays) || retentionDays < 1) {
        return res.status(400).json({ error: 'Invalid retention days parameter' });
      }

      const result = await securityDb.query(`
        DELETE FROM audit_logs 
        WHERE created_at < NOW() - INTERVAL '${parseInt(retentionDays, 10)} days'
        RETURNING id
      `);

      return res.status(200).json({
        message: 'Cleanup successful',
        deletedCount: result.rowCount
      });
    } catch (error) {
      logger.error('Error cleaning up audit logs:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getLogEntry(req, res) {
    try {
      const { id } = req.params;

      const result = await securityDb.query('SELECT * FROM audit_logs WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Audit log entry not found' });
      }

      return res.status(200).json(result.rows[0]);
    } catch (error) {
      logger.error('Error fetching audit log entry:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async searchLogs(req, res) {
    try {
      const { query } = req.body;

      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const searchTerm = `%${query}%`;

      // ILIKE search across action, resource_type, and casting metadata to text
      const result = await securityDb.query(`
        SELECT * FROM audit_logs 
        WHERE action ILIKE $1 
           OR COALESCE(resource_type, '') ILIKE $1 
           OR COALESCE(metadata::text, '') ILIKE $1
        ORDER BY created_at DESC
        LIMIT 100
      `, [searchTerm]);

      return res.status(200).json({
        total: result.rowCount,
        logs: result.rows
      });
    } catch (error) {
      logger.error('Error searching audit logs:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getTraceTimeline(req, res) {
    try {
      const { traceId } = req.params;

      if (!traceId) {
        return res.status(400).json({ error: 'Trace ID is required' });
      }

      // Query the JSONB context field to extract trace_id
      // Since context is JSONB, we can query it directly
      const result = await securityDb.query(`
        SELECT * FROM audit_logs 
        WHERE context->>'trace_id' = $1
        ORDER BY created_at ASC
      `, [traceId]);

      return res.status(200).json({
        trace_id: traceId,
        total_events: result.rowCount,
        timeline: result.rows
      });
    } catch (error) {
      logger.error('Error retrieving trace timeline:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getSessionForensics(req, res) {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
      }

      // Query the JSONB metadata field to extract session_id
      const result = await securityDb.query(`
        SELECT * FROM audit_logs 
        WHERE metadata->>'session_id' = $1
        ORDER BY created_at ASC
      `, [sessionId]);

      return res.status(200).json({
        session_id: sessionId,
        total_events: result.rowCount,
        forensics: result.rows
      });
    } catch (error) {
      logger.error('Error retrieving session forensics:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = AuditLogAdminController;

