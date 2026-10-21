import express, { Request, Response } from 'express';
import GuardianAIController from '../controllers/GuardianAIController';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(adminAuth);

// Guardian AI systems routes
router.get('/systems', GuardianAIController.getGuardianAISystems);
router.get('/systems/:id', GuardianAIController.getGuardianAISystemById);
router.post('/systems', GuardianAIController.createGuardianAISystem);
router.put('/systems/:id', GuardianAIController.updateGuardianAISystem);
router.put('/systems/:id/train', GuardianAIController.trainGuardianAISystem);

// Guardian AI events routes
router.get('/events', GuardianAIController.getGuardianAIEvents);

// Guardian AI responses routes
router.get('/responses', GuardianAIController.getGuardianAIResponses);

// Guardian AI reports routes
router.get('/reports', GuardianAIController.getGuardianAIReports);

// Dashboard route
router.get('/dashboard', GuardianAIController.getGuardianAIDashboard);

// Event resolution route
router.put('/events/:id/resolve', GuardianAIController.resolveGuardianAIEvent);

export default router;