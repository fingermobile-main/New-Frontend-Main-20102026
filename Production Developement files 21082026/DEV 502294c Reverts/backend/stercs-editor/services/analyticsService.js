const { identityDb } = require("../../db");
const { logSecurityEvent } = require("../../utils/securityLogger");

class AnalyticsService {
  // Track a page view event
  static async trackPageView(memberId, projectId, pageId, eventData = {}) {
    try {
      const result = await identityDb.query(
        `INSERT INTO stercs_analytics_events 
         (member_id, project_id, page_id, event_type, event_data)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [memberId, projectId, pageId, "page_view", eventData],
      );

      return {success: true,
  eventId: result.rows[0].id,
  message: "Page view tracked successfully"
      };
    } catch (error) {
      logger.error("Error tracking page, view:", error);
      throw error;
    }
  }

  // Track a custom event
  static async trackEvent(memberId, projectId, eventType, eventData = {}) {
    try {
      const result = await identityDb.query(
        `INSERT INTO stercs_analytics_events 
         (member_id, project_id, event_type, event_data)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [memberId, projectId, eventType, eventData],
      );

      // Log security event
      await logSecurityEvent(memberId, "ANALYTICS_EVENT_TRACK", {eventId: result.rows[0].id,
  eventType
      });

      return {success: true,
  eventId: result.rows[0].id,
  message: "Event tracked successfully"
      };
    } catch (error) {
      logger.error("Error tracking, event:", error);
      throw error;
    }
  }

  // Get project analytics summary
  static async getProjectAnalytics(memberId, projectId) {
    try {
      // Get total page views
      const pageViewsResult = await identityDb.query(
        `SELECT COUNT(*) as count FROM stercs_analytics_events 
         WHERE project_id = $1 AND event_type = 'page_view'`,
        [projectId],
      );

      // Get unique visitors (based on member_id)
      const uniqueVisitorsResult = await identityDb.query(
        `SELECT COUNT(DISTINCT member_id) as count FROM stercs_analytics_events 
         WHERE project_id = $1 AND event_type = 'page_view'`,
        [projectId],
      );

      // Get top pages by views
      const topPagesResult = await identityDb.query(
        `SELECT page_id, COUNT(*) as view_count FROM stercs_analytics_events 
         WHERE project_id = $1 AND event_type = 'page_view'
         GROUP BY page_id
         ORDER BY view_count DESC
         LIMIT 10`,
        [projectId],
      );

      // Get events by type
      const eventsByTypeResult = await identityDb.query(
        `SELECT event_type, COUNT(*) as count FROM stercs_analytics_events 
         WHERE project_id = $1
         GROUP BY event_type
         ORDER BY count DESC`,
        [projectId],
      );

      // Get events by date (last 30 days)
      const eventsByDateResult = await identityDb.query(
        `SELECT DATE(created_at) as date, COUNT(*) as count FROM stercs_analytics_events 
         WHERE project_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
         GROUP BY DATE(created_at)
         ORDER BY date DESC`,
        [projectId],
      );

      return {success: true,
  summary: {
  totalPageViews: parseInt(pageViewsResult.rows[0].count),
  uniqueVisitors: parseInt(uniqueVisitorsResult.rows[0].count),
  topPages: topPagesResult.rows,
  eventsByType: eventsByTypeResult.rows,
  eventsByDate: eventsByDateResult.rows
        },
message: "Project analytics retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting project, analytics:", error);
      throw error;
    }
  }

  // Get page-specific analytics
  static async getPageAnalytics(memberId, projectId, pageId) {
    try {
      // Get page view count
      const pageViewsResult = await identityDb.query(
        `SELECT COUNT(*) as count FROM stercs_analytics_events 
         WHERE project_id = $1 AND page_id = $2 AND event_type = 'page_view'`,
        [projectId, pageId],
      );

      // Get unique visitors for this page
      const uniqueVisitorsResult = await identityDb.query(
        `SELECT COUNT(DISTINCT member_id) as count FROM stercs_analytics_events 
         WHERE project_id = $1 AND page_id = $2 AND event_type = 'page_view'`,
        [projectId, pageId],
      );

      // Get page-specific events
      const pageEventsResult = await identityDb.query(
        `SELECT event_type, COUNT(*) as count FROM stercs_analytics_events 
         WHERE project_id = $1 AND page_id = $2
         GROUP BY event_type
         ORDER BY count DESC`,
        [projectId, pageId],
      );

      // Get page views by date (last 30 days)
      const pageViewsByDateResult = await identityDb.query(
        `SELECT DATE(created_at) as date, COUNT(*) as count FROM stercs_analytics_events 
         WHERE project_id = $1 AND page_id = $2 AND event_type = 'page_view'
         AND created_at >= NOW() - INTERVAL '30 days'
         GROUP BY DATE(created_at)
         ORDER BY date DESC`,
        [projectId, pageId],
      );

      return {success: true,
  pageAnalytics: {
          pageId,
  totalPageViews: parseInt(pageViewsResult.rows[0].count),
  uniqueVisitors: parseInt(uniqueVisitorsResult.rows[0].count),
  eventsByType: pageEventsResult.rows,
  viewsByDate: pageViewsByDateResult.rows
        },
message: "Page analytics retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting page, analytics:", error);
      throw error;
    }
  }

  // Get all analytics events for a project
  static async getAnalyticsEvents(memberId, projectId, options = {}) {
    try {
      let query = `SELECT * FROM stercs_analytics_events WHERE project_id = $1`;
      const params = [projectId];

      if (options.eventType) {
        query += ` AND event_type = $${params.length + 1}`;
        params.push(options.eventType);
      }

      if (options.startDate) {
        query += ` AND created_at >= $${params.length + 1}`;
        params.push(options.startDate);
      }

      if (options.endDate) {
        query += ` AND created_at <= $${params.length + 1}`;
        params.push(options.endDate);
      }

      if (options.pageId) {
        query += ` AND page_id = $${params.length + 1}`;
        params.push(options.pageId);
      }

      query += ` ORDER BY created_at DESC`;

      if (options.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }

      const result = await identityDb.query(query, params);

      return {success: true,
  events: result.rows,
  message: "Analytics events retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting analytics, events:", error);
      throw error;
    }
  }

  // Create a custom dashboard
  static async createDashboard(memberId, dashboardData) {
    try {
      const { name, description, widgets, filters } = dashboardData;

      if (!name) {
        throw new Error("Dashboard name is required");
      }

      const result = await identityDb.query(
        `INSERT INTO stercs_analytics_dashboards 
         (member_id, name, description, widgets, filters)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [memberId, name, description || "", widgets || [], filters || {}],
      );

      // Log security event
      await logSecurityEvent(memberId, "ANALYTICS_DASHBOARD_CREATE", {dashboardId: result.rows[0].id,
  dashboardName: name
      });

      return {success: true,
  dashboard: result.rows[0],
  message: "Dashboard created successfully"
      };
    } catch (error) {
      logger.error("Error creating, dashboard:", error);
      throw error;
    }
  }

  // Get member dashboards
  static async getMemberDashboards(memberId) {
    try {
      const result = await identityDb.query(
        `SELECT * FROM stercs_analytics_dashboards WHERE member_id = $1 ORDER BY created_at DESC`,
        [memberId],
      );

      return {success: true,
  dashboards: result.rows,
  message: "Member dashboards retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting member, dashboards:", error);
      throw error;
    }
  }

  // Update a dashboard
  static async updateDashboard(memberId, dashboardId, dashboardData) {
    try {
      // Verify dashboard belongs to member
      const dashboardResult = await identityDb.query(
        `SELECT * FROM stercs_analytics_dashboards WHERE id = $1 AND member_id = $2`,
        [dashboardId, memberId],
      );

      if (dashboardResult.rows.length === 0) {
        throw new Error("Dashboard not found or not owned by member");
      }

      let updateFields = [];
      let updateValues = [];
      let paramIndex = 2; // First param is dashboardId

      if (dashboardData.name) {
        updateFields.push(`name = $${paramIndex}`);
        updateValues.push(dashboardData.name);
        paramIndex++;
      }

      if (dashboardData.description !== undefined) {
        updateFields.push(`description = $${paramIndex}`);
        updateValues.push(dashboardData.description);
        paramIndex++;
      }

      if (dashboardData.widgets) {
        updateFields.push(`widgets = $${paramIndex}`);
        updateValues.push(dashboardData.widgets);
        paramIndex++;
      }

      if (dashboardData.filters) {
        updateFields.push(`filters = $${paramIndex}`);
        updateValues.push(dashboardData.filters);
        paramIndex++;
      }

      updateValues.push(dashboardId); // Add dashboardId as last value

      const query = `UPDATE stercs_analytics_dashboards SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`;
      const result = await identityDb.query(query, updateValues);

      // Log security event
      await logSecurityEvent(memberId, "ANALYTICS_DASHBOARD_UPDATE", {dashboardId: result.rows[0].id,
  dashboardName: result.rows[0].name
      });

      return {success: true,
  dashboard: result.rows[0],
  message: "Dashboard updated successfully"
      };
    } catch (error) {
      logger.error("Error updating, dashboard:", error);
      throw error;
    }
  }
}

module.exports = AnalyticsService;
