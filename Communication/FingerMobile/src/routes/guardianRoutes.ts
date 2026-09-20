import { Router } from 'express';
import { guardianController } from '../controllers/guardianController';

const router = Router();

// Endpoint for Guardian AI triggers from Core Backend
router.post('/trigger', guardianController.triggerAlert);

export default router;
