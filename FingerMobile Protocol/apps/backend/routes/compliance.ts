import express, { Request, Response } from 'express';
import ComplianceController from '../controllers/ComplianceController';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(adminAuth);

// Compliance requirements routes
router.get('/requirements', ComplianceController.getComplianceRequirements);
router.get('/requirements/:id', ComplianceController.getComplianceRequirementById);
router.post('/requirements', ComplianceController.createComplianceRequirement);
router.put('/requirements/:id', ComplianceController.updateComplianceRequirement);
router.put('/requirements/:id/status', ComplianceController.updateComplianceStatus);

// Compliance audits routes
router.get('/audits', ComplianceController.getComplianceAudits);
router.post('/audits', ComplianceController.createComplianceAudit);

// Compliance reports routes
router.get('/reports', ComplianceController.getComplianceReports);

// Dashboard route
router.get('/dashboard', ComplianceController.getComplianceDashboard);

export default router;