import express, { Router } from 'express';
import { 
  getOverview,
  getSeshat,
  getPrograms,
  getEligibility,
  estimateRevenue,
  submitApplication as createApplication,
  getApplication,
  getBusinessVerifications,
  submitBusinessVerification as createBusinessVerification,
  getPlatformConfig,
  updatePlatformConfig
} from '../business-suite-controller';

const router: Router = express.Router();

// Overview Routes
router.get('/api/overview', getOverview);

// Seshat Routes
router.get('/api/seshat', getSeshat);
// Note: Missing createSeshat in controller

// Program Routes
router.get('/api/programs', getPrograms);

// Eligibility Routes
router.get('/api/eligibility', getEligibility);

// Application Routes
router.get('/api/applications', getApplication);  // This gets single by ID, need to adjust
router.post('/api/applications', createApplication);
// Note: Missing getApplicationById, updateApplication, deleteApplication in controller

// Business Verification Routes
router.get('/api/verifications', getBusinessVerifications);
router.post('/api/verifications', createBusinessVerification);
// Note: Missing getBusinessVerificationById, updateBusinessVerification, deleteBusinessVerification in controller

// Config Routes
router.get('/api/config', getPlatformConfig);
router.put('/api/config', updatePlatformConfig);

// Estimate Routes
router.post('/api/estimates', estimateRevenue);  // Using the estimate endpoint differently

// Note: Missing other routes in controller

// Export the router
export default router;