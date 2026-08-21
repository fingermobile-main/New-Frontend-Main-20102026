const { identityDb } = require("../../db");
const { logSecurityEvent } = require("../../utils/securityLogger");

class LogService {
  // Create a new log entry
  static async createLogEntry(memberId, logData) {
    try {
      const {
        projectId,
        action,
        details,
        level = "info",
        category = "general",
      } = logData;

      if (!projectId || !action) {
        throw new Error("Project ID and action are required for log entry");
      }

      const result = await identityDb.query(
        `INSERT INTO stercs_logs 
         (member_id, project_id, action, details, level, category)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [memberId, projectId, action, details || "", level, category],
      );

      // Log security event if it's a sensitive action
      if (["critical", "security", "admin"].includes(level)) {
        await logSecurityEvent(memberId, `LOG_${action.toUpperCase()}`, {logId: result.rows[0].id,
  action: action,
  projectId: projectId
        });
      }

      return {success: true,
  log: result.rows[0],
  message: "Log entry created successfully"
      };
    } catch (error) {
      logger.error("Error creating log, entry:", error);
      throw error;
    }
  }

  // Get logs for a member
  static async getLogs(memberId, options = {}) {
    try {
      let query = `SELECT l.*, m.membername as member_membername 
                   FROM stercs_logs l
                   JOIN members m ON l.member_id = m.id
                   WHERE l.member_id = $1`;
      const params = [memberId];

      if (options.projectId) {
        query += ` AND l.project_id = $${params.length + 1}`;
        params.push(options.projectId);
      }

      if (options.level) {
        query += ` AND l.level = $${params.length + 1}`;
        params.push(options.level);
      }

      if (options.category) {
        query += ` AND l.category = $${params.length + 1}`;
        params.push(options.category);
      }

      if (options.action) {
        query += ` AND l.action = $${params.length + 1}`;
        params.push(options.action);
      }

      if (options.startDate) {
        query += ` AND l.created_at >= $${params.length + 1}`;
        params.push(options.startDate);
      }

      if (options.endDate) {
        query += ` AND l.created_at <= $${params.length + 1}`;
        params.push(options.endDate);
      }

      query += ` ORDER BY l.created_at DESC`;

      if (options.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }

      const result = await identityDb.query(query, params);

      return {success: true,
  logs: result.rows,
  message: "Logs retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting, logs:", error);
      throw error;
    }
  }

  // Get logs for a specific project (for admins)
  static async getProjectLogs(projectId, options = {}) {
    try {
      let query = `SELECT l.*, m.membername as member_membername 
                   FROM stercs_logs l
                   JOIN members m ON l.member_id = m.id
                   WHERE l.project_id = $1`;
      const params = [projectId];

      if (options.level) {
        query += ` AND l.level = $${params.length + 1}`;
        params.push(options.level);
      }

      if (options.category) {
        query += ` AND l.category = $${params.length + 1}`;
        params.push(options.category);
      }

      if (options.action) {
        query += ` AND l.action = $${params.length + 1}`;
        params.push(options.action);
      }

      if (options.startDate) {
        query += ` AND l.created_at >= $${params.length + 1}`;
        params.push(options.startDate);
      }

      if (options.endDate) {
        query += ` AND l.created_at <= $${params.length + 1}`;
        params.push(options.endDate);
      }

      query += ` ORDER BY l.created_at DESC`;

      if (options.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }

      const result = await identityDb.query(query, params);

      return {success: true,
  logs: result.rows,
  message: "Project logs retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting project, logs:", error);
      throw error;
    }
  }

  // Get log statistics
  static async getLogStats(memberId, options = {}) {
    try {
      let query = `SELECT 
                     COUNT(*) as total_logs,
                     COUNT(CASE WHEN level = 'error' THEN 1 END) as error_count,
                     COUNT(CASE WHEN level = 'warning' THEN 1 END) as warning_count,
                     COUNT(CASE WHEN level = 'info' THEN 1 END) as info_count,
                     COUNT(CASE WHEN level = 'debug' THEN 1 END) as debug_count,
                     COUNT(CASE WHEN level = 'critical' THEN 1 END) as critical_count,
                     COUNT(CASE WHEN level = 'security' THEN 1 END) as security_count
                   FROM stercs_logs 
                   WHERE member_id = $1`;
      const params = [memberId];

      if (options.projectId) {
        query += ` AND project_id = $${params.length + 1}`;
        params.push(options.projectId);
      }

      if (options.startDate) {
        query += ` AND created_at >= $${params.length + 1}`;
        params.push(options.startDate);
      }

      if (options.endDate) {
        query += ` AND created_at <= $${params.length + 1}`;
        params.push(options.endDate);
      }

      const result = await identityDb.query(query, params);

      return {success: true,
  stats: result.rows[0],
  message: "Log statistics retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting log, stats:", error);
      throw error;
    }
  }

  // Create a system log entry (for internal system events)
  static async createSystemLog(logData) {
    try {
      const {
        projectId,
        action,
        details,
        level = "info",
        category = "system",
      } = logData;

      if (!projectId || !action) {
        throw new Error(
          "Project ID and action are required for system log entry",
        );
      }

      const result = await identityDb.query(
        `INSERT INTO stercs_logs 
         (member_id, project_id, action, details, level, category)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          0, // System member ID
          projectId,
          action,
          details || "",
          level,
          category
        ],
      );

      return {success: true,
  log: result.rows[0],
  message: "System log entry created successfully"
      };
    } catch (error) {
      logger.error("Error creating system log, entry:", error);
      throw error;
    }
  }
}

module.exports = LogService;
