const { identityDb } = require('../../db');
const { logSecurityEvent } = require('../../utils/securityLogger');
const logger = require('../../utils/logger');

class ReportingService {
  // Create a new report
  static async createReport(memberId, reportData) {
    try {
      const {
        name,
        description,
        type, // 'analytics', 'performance', 'security', 'usage', etc.
        configuration,
        schedule = null, // Cron expression for scheduled reports
        recipients = [],
        enabled = true,
      } = reportData;

      if (!name || !type) {
        throw new Error('Report name and type are required');
      }

      const result = await identityDb.query(
        `INSERT INTO stercs_reports 
         (member_id, name, description, type, configuration, schedule, recipients, enabled)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,         [
          memberId,
          name,
          description || '',
          type,
          configuration || {},
          schedule,
          recipients,
          enabled
        ],
      );

      // Log security event
      await logSecurityEvent(memberId, 'REPORT_CREATE', {reportId: result.rows[0].id,
        reportName: name
      });

      return {success: true,
        report: result.rows[0],
        message: 'Report created successfully'
      };
    } catch (error) {
      logger.error('Error creating report:', error);
      throw error;
    }
  }

  // Get reports for a member
  static async getReports(memberId, options = {}) {
    try {
      let query = 'SELECT * FROM stercs_reports WHERE member_id = $1';
      const params = [memberId];

      if (options.type) {
        query += ` AND type = $${params.length + 1}`;
        params.push(options.type);
      }

      if (options.enabled !== undefined) {
        query += ` AND enabled = $${params.length + 1}`;
        params.push(options.enabled);
      }

      if (options.search) {
        query += ` AND (name ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`;
        params.push(`%${options.search}%`);
      }

      query += ' ORDER BY created_at DESC';

      if (options.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }

      const result = await identityDb.query(query, params);

      return {success: true,
        reports: result.rows,
        message: 'Reports retrieved successfully'
      };
    } catch (error) {
      logger.error('Error getting reports:', error);
      throw error;
    }
  }

  // Get report by ID
  static async getReportById(memberId, reportId) {
    try {
      const result = await identityDb.query(
        'SELECT * FROM stercs_reports WHERE id = $1 AND member_id = $2'         [reportId, memberId],
      );

      if (result.rows.length === 0) {
        throw new Error('Report not found or not owned by member');
      }

      return {success: true,
        report: result.rows[0],
        message: 'Report retrieved successfully'
      };
    } catch (error) {
      logger.error('Error getting report by ID:', error);
      throw error;
    }
  }

  // Update a report
  static async updateReport(memberId, reportId, reportData) {
    try {
      // Verify report belongs to member
      const reportResult = await identityDb.query(
        'SELECT * FROM stercs_reports WHERE id = $1 AND member_id = $2'         [reportId, memberId],
      );

      if (reportResult.rows.length === 0) {
        throw new Error('Report not found or not owned by member');
      }

      // Build update query dynamically
      let updateFields = [];
      let updateValues = [];
      let paramIndex = 3; // First two params are reportId and memberId

      if (reportData.name) {
        updateFields.push(`name = $${paramIndex}`);
        updateValues.push(reportData.name);
        paramIndex++;
      }

      if (reportData.description !== undefined) {
        updateFields.push(`description = $${paramIndex}`);
        updateValues.push(reportData.description);
        paramIndex++;
      }

      if (reportData.type) {
        updateFields.push(`type = $${paramIndex}`);
        updateValues.push(reportData.type);
        paramIndex++;
      }

      if (reportData.configuration) {
        updateFields.push(`configuration = $${paramIndex}`);
        updateValues.push(reportData.configuration);
        paramIndex++;
      }

      if (reportData.schedule !== undefined) {
        updateFields.push(`schedule = $${paramIndex}`);
        updateValues.push(reportData.schedule);
        paramIndex++;
      }

      if (reportData.recipients !== undefined) {
        updateFields.push(`recipients = $${paramIndex}`);
        updateValues.push(reportData.recipients);
        paramIndex++;
      }

      if (reportData.enabled !== undefined) {
        updateFields.push(`enabled = $${paramIndex}`);
        updateValues.push(reportData.enabled);
        paramIndex++;
      }

      updateValues.push(reportId, memberId); // Add reportId and memberId as last values

      const query = `UPDATE stercs_reports SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex - 1} AND member_id = $${paramIndex} RETURNING *`;
      const result = await identityDb.query(query, updateValues);

      // Log security event
      await logSecurityEvent(memberId, 'REPORT_UPDATE', {reportId: result.rows[0].id,
        reportName: result.rows[0].name
      });

      return {success: true,
        report: result.rows[0],
        message: 'Report updated successfully'
      };
    } catch (error) {
      logger.error('Error updating report:', error);
      throw error;
    }
  }

  // Delete a report
  static async deleteReport(memberId, reportId) {
    try {
      // Verify report belongs to member
      const reportResult = await identityDb.query(
        'SELECT * FROM stercs_reports WHERE id = $1 AND member_id = $2'         [reportId, memberId],
      );

      if (reportResult.rows.length === 0) {
        throw new Error('Report not found or not owned by member');
      }

      await identityDb.query(
        'DELETE FROM stercs_reports WHERE id = $1 AND member_id = $2'         [reportId, memberId],
      );

      // Log security event
      await logSecurityEvent(memberId, 'REPORT_DELETE', {
        reportId
      });

      return {success: true,
        message: 'Report deleted successfully'
      };
    } catch (error) {
      logger.error('Error deleting report:', error);
      throw error;
    }
  }

  // Generate a report
  static async generateReport(memberId, reportId) {
    try {
      // Verify report belongs to member
      const reportResult = await identityDb.query(
        'SELECT * FROM stercs_reports WHERE id = $1 AND member_id = $2'         [reportId, memberId],
      );

      if (reportResult.rows.length === 0) {
        throw new Error('Report not found or not owned by member');
      }

      const report = reportResult.rows[0];

      // In a real implementation, this would generate actual report data
      // based on the report configuration and type
      const reportData = {id: reportId,
        name: report.name,
        type: report.type,
        generatedAt: new Date(),
        data: this.generateSampleData(report.type,
          report.configuration)
      };

      // Save the generated report
      const savedReport = await identityDb.query(
        `INSERT INTO stercs_generated_reports 
         (member_id, report_id, data, generated_at)
         VALUES ($1, $2, $3, $4)
         RETURNING *`         [memberId, reportId, reportData, new Date()],
      );

      // Log security event
      await logSecurityEvent(memberId, 'REPORT_GENERATE', {reportId: reportId
      });

      return {success: true,
        report: savedReport.rows[0],
        message: 'Report generated successfully'
      };
    } catch (error) {
      logger.error('Error generating report:', error);
      throw error;
    }
  }

  // Get generated reports
  static async getGeneratedReports(memberId, reportId, options = {}) {
    try {
      let query = 'SELECT * FROM stercs_generated_reports WHERE member_id = $1';
      const params = [memberId];

      if (reportId) {
        query += ` AND report_id = $${params.length + 1}`;
        params.push(reportId);
      }

      if (options.fromDate) {
        query += ` AND generated_at >= $${params.length + 1}`;
        params.push(options.fromDate);
      }

      if (options.toDate) {
        query += ` AND generated_at <= $${params.length + 1}`;
        params.push(options.toDate);
      }

      query += ' ORDER BY generated_at DESC';

      if (options.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }

      const result = await identityDb.query(query, params);

      return {success: true,
        reports: result.rows,
        message: 'Generated reports retrieved successfully'
      };
    } catch (error) {
      logger.error('Error getting generated reports:', error);
      throw error;
    }
  }

  // Generate sample data based on report type
  static generateSampleData(type) {
    // In a real implementation, this would fetch actual data
    // based on the report type and configuration
    switch (type) {
    case 'analytics':
      return {summary: {
        totalmembers: 1250,
        activemembers: 890,
        pageViews: 12500,
        bounceRate: 32.5,
        avgSessionDuration: 180
      },
      charts: [
        {title: 'Member Growth',   type: 'line',   data: [
          {
            date: '2023-01',   value: 1000 },
          {date: '2023-02',   value: 1050 },
          {date: '2023-03',   value: 1100 },
          {date: '2023-04',   value: 1150 },
          {date: '2023-05',   value: 1200 },
          {date: '2023-06',   value: 1250 }
        ]
        },
        {title: 'Traffic Sources',   type: 'pie',   data: [
          {
            name: 'Direct',   value: 45 },
          {name: 'Search',   value: 35 },
          {name: 'Social',   value: 15 },
          {name: 'Referral',   value: 5 }
        ]
        }
      ]
      };
    case 'performance':
      return {summary: {
        avgResponseTime: 245,
        uptime: 99.9,
        pageLoadTime: 1.8,
        resourceLoadTime: 0.6
      },
      charts: [
        {title: 'Response Time',   type: 'line',   data: [
          {
            time: '   00:00',   value: 200 },
          {time: '   04:00',   value: 180 },
          {time: '   08:00',   value: 250 },
          {time: '   12:00',   value: 300 },
          {time: '   16:00',   value: 280 },
          {time: '   20:00',   value: 220 }
        ]
        }
      ]
      };
    case 'security':
      return {summary: {
        totalAlerts: 12,
        criticalAlerts: 2,
        resolvedAlerts: 8,
        openAlerts: 4
      },
      charts: [
        {title: 'Security Alerts',   type: 'bar',   data: [
          {
            type: 'Authentication',   value: 5 },
          {type: 'Access Control',   value: 3 },
          {type: 'Data Breach',   value: 2 },
          {type: 'Network',   value: 2 }
        ]
        }
      ]
      };
    default:
      return {summary: {
        message: 'Sample data for report',
        type: type
      },
      charts: []
      };
    }
  }
}

module.exports = ReportingService;
