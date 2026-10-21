const logger = require('../../utils/logger');
const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/authenticate');
const ReportingService = require('../services/reportingService');

// Apply admin authentication to all reporting routes
router.use(requireAdmin);

// Create a new report
router.post('/', async (req, res) => {
  try {
    const memberId = req.member.id;
    const reportData = req.body;

    if (!reportData.name || !reportData.type) {
      return res.status(400).json({success: false,
        message: 'Report name and type are required'
      });
    }

    const result = await ReportingService.createReport(memberId, reportData);

    res.status(201).json({success: true,
      message: result.message,
      data: result.report
    });
  } catch (error) {
    logger.error('Error creating, report:', error);
    res.status(500).json({success: false,
      message: 'Failed to create report', error: error.message });
  }
});

// Get reports for a member
router.get('/', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { type, enabled, search, limit } = req.query;
    const result = await ReportingService.getReports(memberId, {
      type: type || null,
      enabled: enabled !== undefined ? enabled === 'true' : undefined,
      search: search || null,
      limit: limit ? parseInt(limit) : null
    });
    res.status(200).json({
      success: true,
      message: result.message,
      data: result.reports
    });
  } catch (error) {
    logger.error('Error getting reports:', error);
    res.status(500).json({success: false, message: 'Failed to retrieve reports', error: error.message });
  }
});

// Get report by ID
router.get('/:reportId', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { reportId } = req.params;

    const result = await ReportingService.getReportById(
      memberId,
      parseInt(reportId),
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.report
    });
  } catch (error) {
    logger.error('Error getting, report:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve report', error: error.message });
  }
});

// Update a report
router.put('/:reportId', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { reportId } = req.params;
    const reportData = req.body;
    const result = await ReportingService.updateReport(memberId, parseInt(reportId), reportData);
    res.status(200).json({success: true, message: result.message, data: result.report });
  } catch (error) {
    logger.error('Error updating report:', error);
    res.status(500).json({ success: false, message: 'Failed to update report', error: error.message });
  }
});

// Delete a report
router.delete('/:reportId', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { reportId } = req.params;

    const result = await ReportingService.deleteReport(
      memberId,
      parseInt(reportId),
    );

    res.status(200).json({success: true,
      message: result.message
    });
  } catch (error) {
    logger.error('Error deleting, report:', error);
    res.status(500).json({success: false,
      message: 'Failed to delete report', error: error.message });
  }
});

// Generate a report
router.post('/:reportId/generate', async (req, res) => { try { const memberId = req.member.id; const { reportId } = req.params; const result = await ReportingService.generateReport( memberId, parseInt(reportId), ); res.status(200).json({success: true, message: result.message, data: result.report }); } catch (error) {
  logger.error('Error generating report:', error);
  res.status(500).json({ success: false, message: 'Failed to generate report', error: error.message });
}
});

// Get generated reports
router.get('/:reportId/generated', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { reportId } = req.params;
    const { fromDate, toDate, limit } = req.query;

    const result = await ReportingService.getGeneratedReports(
      memberId,
      parseInt(reportId),
      {fromDate: fromDate || null,
        toDate: toDate || null,
        limit: limit ? parseInt(limit) : null
      },
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.reports
    });
  } catch (error) {
    logger.error('Error getting generated, reports:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve generated reports', error: error.message
    });
  }
});

module.exports = router;
