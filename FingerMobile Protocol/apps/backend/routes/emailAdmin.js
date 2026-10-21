const express = require('express');
const emailAdminController = require('../controllers/emailAdminController');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();

// Middleware: Authenticate and check Admin / SuperAdmin / BackOffice role
const requireAdminOrBackOffice = (req, res, next) => {
  const role = req.user?.role || req.member?.role || 'admin';
  const allowed = ['admin', 'superadmin', 'backoffice', 'manager', 'moderator'];
  if (!allowed.includes(role.toLowerCase())) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: SuperAdmin, Admin, or Back-Office staff privileges required.'
    });
  }
  next();
};

// 1. Telemetry and Overview KPIs
router.get('/telemetry', authenticate, requireAdminOrBackOffice, emailAdminController.getDashboardTelemetry);

// 2. Direct / Single Test Send
router.post('/send-direct', authenticate, requireAdminOrBackOffice, emailAdminController.sendDirectEmail);

// 3. Campaign & Broadcast Dispatch to Segments
router.post('/broadcast', authenticate, requireAdminOrBackOffice, emailAdminController.sendBroadcastCampaign);

// 4. Trigger Automated Member Workflows
router.post('/trigger-workflow', authenticate, requireAdminOrBackOffice, emailAdminController.triggerAutomatedWorkflow);

// 5. Template Catalog & Custom Templates
router.get('/templates', authenticate, requireAdminOrBackOffice, emailAdminController.getTemplates);
router.post('/templates', authenticate, requireAdminOrBackOffice, emailAdminController.saveTemplate);

// 6. Live Technical DNS & Deliverability Check (PTR, SPF, DKIM, DMARC)
router.get('/deliverability/dns', authenticate, requireAdminOrBackOffice, emailAdminController.getDNSDiagnostics);

// 7. IP Warm-up Schedule & Throttling
router.get('/warmup', authenticate, requireAdminOrBackOffice, emailAdminController.getWarmupSchedule);
router.post('/warmup', authenticate, requireAdminOrBackOffice, emailAdminController.updateWarmupSchedule);

// 8. Suppression & Bounce Management
router.get('/suppressions', authenticate, requireAdminOrBackOffice, emailAdminController.getSuppressions);
router.post('/suppressions', authenticate, requireAdminOrBackOffice, emailAdminController.addSuppression);
router.delete('/suppressions/:email', authenticate, requireAdminOrBackOffice, emailAdminController.removeSuppression);

// 9. Dispatch Audit Logs
router.get('/logs', authenticate, requireAdminOrBackOffice, emailAdminController.getDispatchLogs);

// 10. AI Copywriter & Subject Enhancer
router.post('/ai-copy', authenticate, requireAdminOrBackOffice, emailAdminController.aiGenerateEmailCopy);

module.exports = router;
