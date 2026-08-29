import express from 'express';
import { authenticateToken } from './middleware/auth';
import { validateRequest } from './middleware/validation';
import { BusinessSuiteController } from './controllers/business-suite-controller';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

router.use(limiter);

// Routes for business suite functionality
router.get('/overview', authenticateToken, BusinessSuiteController.getOverview);
router.post('/estimate', authenticateToken, validateRequest, BusinessSuiteController.calculateEstimate);
router.get('/programs', authenticateToken, BusinessSuiteController.getPrograms);
router.post('/applications', authenticateToken, validateRequest, BusinessSuiteController.submitApplication);
router.put('/config', authenticateToken, validateRequest, BusinessSuiteController.updateConfig);

export { router as businessSuiteRouter };