const express = require('express');
const security = require('../controllers/securityController.js');
const rawAuth = require('../middleware/authenticate');
const authenticate = typeof rawAuth === 'function' ? rawAuth : (rawAuth.authenticate || ((req, res, next) => next()));
const router = express.Router();

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return authenticate(req, res, next);
  }
  return next();
};

// Security Settings & MFA
router.get('/settings', optionalAuth, security.getSecuritySettings);
router.put('/settings', optionalAuth, security.updateSecuritySettings);
router.post('/enable-mfa', optionalAuth, security.updateSecuritySettings);
router.post('/backup-codes/generate', optionalAuth, security.generateBackupCodes);

// Sessions
router.get('/sessions', optionalAuth, security.getActiveSessions);
router.post('/sessions/:id/revoke', optionalAuth, security.revokeSession);
router.delete('/sessions/:sessionId', optionalAuth, security.revokeSession);
router.delete('/sessions', optionalAuth, security.revokeAllSessions);

// Audit & Events
router.get('/audit-log', optionalAuth, security.getAuditLog);
router.get('/audit-logs', optionalAuth, security.getAuditLog);
router.get('/events', optionalAuth, security.getAuditLog);

// Alerts & Incidents
router.get('/alerts', optionalAuth, (req, res) => security.getAlerts(req, res));
router.post('/alerts/:id/resolve', optionalAuth, (req, res) => security.resolveAlert(req, res));
router.put('/alerts/:id/resolve', optionalAuth, (req, res) => security.resolveAlert(req, res));
router.post('/alerts', optionalAuth, (req, res) => security.createAlert(req, res));
router.post('/block-ip', optionalAuth, (req, res) => security.blockIp(req, res));

module.exports = router;
