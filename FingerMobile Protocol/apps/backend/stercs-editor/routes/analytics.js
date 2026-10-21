const logger = require('../../utils/logger');
const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/authenticate');
const AnalyticsService = require('../services/analyticsService');

// Apply admin authentication to all analytics routes
router.use(requireAdmin);

// Track a page view event
router.post('/track-page-view', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId, pageId, eventData } = req.body;

    if (!projectId || !pageId) {
      return res.status(400).json({success: false,
        message: 'Project ID and Page ID are required for tracking page view'
      });
    }

    const result = await AnalyticsService.trackPageView(
      memberId,
      projectId,
      pageId,
      eventData,
    );

    res.status(201).json({success: true,
      message: result.message,
      data: result
    });
  } catch (error) {
    logger.error('Error tracking page, view:', error);
    res.status(500).json({success: false,
      message: 'Failed to track page view',
      error: error.message
    });
  }
});

// Track a custom event
router.post('/track-event', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId, eventType, eventData } = req.body;

    if (!projectId || !eventType) {
      return res.status(400).json({success: false,
        message: 'Project ID and Event Type are required for tracking event'
      });
    }

    const result = await AnalyticsService.trackEvent(
      memberId,
      projectId,
      eventType,
      eventData,
    );

    res.status(201).json({success: true,
      message: result.message,
      data: result
    });
  } catch (error) {
    logger.error('Error tracking, event:', error);
    res.status(500).json({success: false,
      message: 'Failed to track event',
      error: error.message
    });
  }
});

// Get project analytics summary
router.get('/projects/:projectId', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId } = req.params;

    const result = await AnalyticsService.getProjectAnalytics(
      memberId,
      parseInt(projectId),
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.summary
    });
  } catch (error) {
    logger.error('Error getting project, analytics:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve project analytics',
      error: error.message
    });
  }
});

// Get page-specific analytics
router.get('/projects/:projectId/pages/:pageId', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId, pageId } = req.params;

    const result = await AnalyticsService.getPageAnalytics(
      memberId,
      parseInt(projectId),
      parseInt(pageId),
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.pageAnalytics
    });
  } catch (error) {
    logger.error('Error getting page, analytics:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve page analytics',
      error: error.message
    });
  }
});

// Get analytics events
router.get('/projects/:projectId/events', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId } = req.params;
    const { eventType, startDate, endDate, pageId, limit } = req.query;

    const result = await AnalyticsService.getAnalyticsEvents(
      memberId,
      parseInt(projectId),
      {eventType: eventType || null,
        startDate: startDate || null,
        endDate: endDate || null,
        pageId: pageId ? parseInt(pageId) : null,
        limit: limit ? parseInt(limit) : null
      },
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.events
    });
  } catch (error) {
    logger.error('Error getting analytics, events:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve analytics events',
      error: error.message
    });
  }
});

// Create a custom dashboard
router.post('/dashboards', async (req, res) => {
  try {
    const memberId = req.member.id;
    const dashboardData = req.body;

    if (!dashboardData.name) {
      return res.status(400).json({success: false,
        message: 'Dashboard name is required'
      });
    }

    const result = await AnalyticsService.createDashboard(
      memberId,
      dashboardData,
    );

    res.status(201).json({success: true,
      message: result.message,
      data: result.dashboard
    });
  } catch (error) {
    logger.error('Error creating, dashboard:', error);
    res.status(500).json({success: false,
      message: 'Failed to create dashboard',
      error: error.message
    });
  }
});

// Get member dashboards
router.get('/dashboards', async (req, res) => {
  try {
    const memberId = req.member.id;

    const result = await AnalyticsService.getMemberDashboards(memberId);

    res.status(200).json({success: true,
      message: result.message,
      data: result.dashboards
    });
  } catch (error) {
    logger.error('Error getting member, dashboards:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve member dashboards',
      error: error.message
    });
  }
});

// Update a dashboard
router.put('/dashboards/:dashboardId', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { dashboardId } = req.params;
    const dashboardData = req.body;

    const result = await AnalyticsService.updateDashboard(
      memberId,
      parseInt(dashboardId),
      dashboardData,
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.dashboard
    });
  } catch (error) {
    logger.error('Error updating, dashboard:', error);
    res.status(500).json({success: false,
      message: 'Failed to update dashboard',
      error: error.message
    });
  }
});

module.exports = router;
