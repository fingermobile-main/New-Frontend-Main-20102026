import express, { Request, Response } from 'express';
import SecurityController from '../controllers/SecurityController';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(adminAuth);

// Security events routes
router.get('/events', SecurityController.getSecurityEvents);
router.get('/events/:id', SecurityController.getSecurityEventById);
router.put('/events/:id/resolve', SecurityController.resolveSecurityEvent);

// Threat detection routes
router.get('/threats', SecurityController.getThreatDetections);

// Security policies routes
router.get('/policies', SecurityController.getSecurityPolicies);
router.put('/policies/:id/toggle', SecurityController.toggleSecurityPolicy);

// Security incidents summary
router.get('/incidents', SecurityController.getSecurityIncidentsSummary);

// Security monitoring
router.get('/monitoring', SecurityController.getSecurityMonitoringData);

// Security scan
router.post('/scan', SecurityController.initiateSecurityScan);

export default router;