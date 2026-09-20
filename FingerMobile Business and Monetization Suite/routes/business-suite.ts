import express, { Router, Request, Response, NextFunction } from 'express';
import { businessSuiteController } from '../business-suite-controller';
// Remove the verification-service import as it's now handled in the controller
// import { VerificationService } from '../services/verification-service';
// import { ComplianceService } from '../services/compliance-service';
// import { AuditLogService } from '../services/audit-log-service';

const router: Router = express.Router();

// Overview Routes
router.get('/api/overview', businessSuiteController.getOverview);

// Seshat Routes
router.get('/api/seshat', businessSuiteController.getSeshat);
router.post('/api/seshat', businessSuiteController.createSeshat);

// Application Routes
router.get('/api/applications', businessSuiteController.getApplications);
router.post('/api/applications', businessSuiteController.createApplication);
router.get('/api/applications/:id', businessSuiteController.getApplicationById);
router.put('/api/applications/:id', businessSuiteController.updateApplication);
router.delete('/api/applications/:id', businessSuiteController.deleteApplication);

// Business Verification Routes
router.get('/api/verifications', businessSuiteController.getBusinessVerifications);
router.post('/api/verifications', businessSuiteController.createBusinessVerification);
router.get('/api/verifications/:id', businessSuiteController.getBusinessVerificationById);
router.put('/api/verifications/:id', businessSuiteController.updateBusinessVerification);
router.delete('/api/verifications/:id', businessSuiteController.deleteBusinessVerification);

// Config Routes
router.get('/api/config', businessSuiteController.getConfig);
router.put('/api/config', businessSuiteController.updateConfig);

// Estimate Routes
router.get('/api/estimates', businessSuiteController.getEstimates);
router.post('/api/estimates', businessSuiteController.createEstimate);
router.get('/api/estimates/:id', businessSuiteController.getEstimateById);
router.put('/api/estimates/:id', businessSuiteController.updateEstimate);
router.delete('/api/estimates/:id', businessSuiteController.deleteEstimate);

// Payout Routes
router.get('/api/payouts', businessSuiteController.getPayouts);
router.post('/api/payouts', businessSuiteController.createPayout);
router.get('/api/payouts/:id', businessSuiteController.getPayoutById);
router.put('/api/payouts/:id', businessSuiteController.updatePayout);
router.delete('/api/payouts/:id', businessSuiteController.deletePayout);

// Product Routes
router.get('/api/products', businessSuiteController.getProducts);
router.post('/api/products', businessSuiteController.createProduct);
router.get('/api/products/:id', businessSuiteController.getProductById);
router.put('/api/products/:id', businessSuiteController.updateProduct);
router.delete('/api/products/:id', businessSuiteController.deleteProduct);

// Verification Status Routes
router.get('/api/verification/:userId', businessSuiteController.getVerificationStatus);
router.put('/api/verification/:userId', businessSuiteController.updateVerificationStatus);

// Compliance Report Routes
router.get('/api/compliance/report', businessSuiteController.getComplianceReport);

// Audit Log Routes
router.get('/api/auditlogs', businessSuiteController.getAuditLogs);

// Export the router
export default router;