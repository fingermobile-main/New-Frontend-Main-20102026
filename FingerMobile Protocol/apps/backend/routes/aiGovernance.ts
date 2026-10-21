import express, { Request, Response } from 'express';
import AIGovernanceController from '../controllers/AIGovernanceController';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(adminAuth);

// AI decisions routes
router.get('/decisions', AIGovernanceController.getAIDecisions);
router.get('/decisions/:id', AIGovernanceController.getAIDecisionById);
router.put('/decisions/:id/review', AIGovernanceController.reviewAIDecision);

// AI policies routes
router.get('/policies', AIGovernanceController.getAIPolicies);
router.get('/policies/:id', AIGovernanceController.getAIPolicyById);
router.post('/policies', AIGovernanceController.createAIPolicy);
router.put('/policies/:id', AIGovernanceController.updateAIPolicy);
router.put('/policies/:id/toggle', AIGovernanceController.toggleAIPolicyStatus);

// AI incidents routes
router.get('/incidents', AIGovernanceController.getAIIncidents);
router.put('/incidents/:id/resolve', AIGovernanceController.resolveAIIncident);

// Analytics routes
router.get('/analytics', AIGovernanceController.getAIGovernanceAnalytics);

export default router;