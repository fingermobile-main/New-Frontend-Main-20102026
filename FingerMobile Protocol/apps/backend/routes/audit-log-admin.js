const express = require('express');
const router = express.Router();
const AuditLogAdminController = require('../controllers/AuditLogAdminController').default || require('../controllers/AuditLogAdminController');
const { authenticate, requireAdmin } = require('../middleware/authenticate');

// All routes require admin authentication
router.use(authenticate);
router.use(requireAdmin);

// Query audit logs with filters
router.get('/', AuditLogAdminController.queryLogs);

// Get audit log statistics
router.get('/stats', AuditLogAdminController.getStats);

// Export logs to CSV/JSON
router.post('/export', AuditLogAdminController.exportLogs);

// Cleanup old logs based on retention policy
router.delete('/cleanup', AuditLogAdminController.cleanupLogs);

// Get specific log entry
router.get('/:id', AuditLogAdminController.getLogEntry);

// Advanced search
router.post('/search', AuditLogAdminController.searchLogs);

// Forensic Trace Reconstruction (Phase 5)
router.get('/trace/:traceId', AuditLogAdminController.getTraceTimeline);
router.get('/session/:sessionId', AuditLogAdminController.getSessionForensics);

module.exports = router;
