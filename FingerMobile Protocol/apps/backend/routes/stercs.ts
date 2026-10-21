import express, { Request, Response } from 'express';
import StercsController from '../controllers/StercsController';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(adminAuth);

// STERCS modules routes
router.get('/modules', StercsController.getStercsModules);
router.get('/modules/:id', StercsController.getStercsModuleById);
router.post('/modules', StercsController.createStercsModule);
router.put('/modules/:id', StercsController.updateStercsModule);
router.put('/modules/:id/deploy', StercsController.deployStercsModule);

// STERCS policies routes
router.get('/policies', StercsController.getStercsPolicies);

// STERCS controls routes
router.get('/controls', StercsController.getStercsControls);

// STERCS audits routes
router.get('/audits', StercsController.getStercsAudits);

// Dashboard route
router.get('/dashboard', StercsController.getStercsDashboard);

// STERCS controls test route
router.put('/controls/:id/test', StercsController.testStercsControl);

export default router;