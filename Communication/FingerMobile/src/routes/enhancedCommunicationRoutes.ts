import express, { Request, Response } from 'express';
import { 
  getEnhancedCommunications,
  createEnhancedCommunication,
  sendTargetedMessage,
  sendAutomatedMessage,
  getCommunicationStats,
  scheduleAutomatedMessage,
  processGuardianTrigger
} from '../controllers/enhancedCommunicationController';

const router = express.Router();

// Enhanced communication routes
router.get('/', getEnhancedCommunications);
router.post('/', createEnhancedCommunication);

// Targeted messaging routes
router.post('/targeted', sendTargetedMessage);

// Automated messaging routes
router.post('/automated', sendAutomatedMessage);
router.post('/automated/schedule', scheduleAutomatedMessage);
router.post('/automated/guardian-trigger', processGuardianTrigger);

// Statistics routes
router.get('/stats', getCommunicationStats);

export default router;