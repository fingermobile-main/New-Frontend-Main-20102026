import express from 'express';
import { 
  getCommunications, 
  createCommunication, 
  updateCommunication, 
  deleteCommunication,
  getBroadcastHistory
} from '../controllers/communicationController';
import enhancedCommunicationRoutes from './enhancedCommunicationRoutes';

const router = express.Router();

// Legacy communication routes
router.get('/', getCommunications);
router.post('/', createCommunication);
router.put('/:id', updateCommunication);
router.delete('/:id', deleteCommunication);
router.get('/history', getBroadcastHistory);

// Enhanced communication routes
router.use('/enhanced', enhancedCommunicationRoutes);

export default router;