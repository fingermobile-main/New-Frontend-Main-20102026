import express, { Request, Response } from 'express';
import { 
  sendBroadcast, 
  getBroadcastRecipients, 
  scheduleBroadcast,
  getActiveBroadcasts,
  cancelScheduledBroadcast
} from '../controllers/broadcastController';

const router = express.Router();

// Send a broadcast to all users
router.post('/send', sendBroadcast);

// Get recipients for a broadcast
router.post('/recipients', getBroadcastRecipients);

// Schedule a broadcast
router.post('/schedule', scheduleBroadcast);

// Get active broadcasts
router.get('/active', getActiveBroadcasts);

// Cancel a scheduled broadcast
router.delete('/schedule/:id', cancelScheduledBroadcast);

// Bulk operations
router.post('/bulk-send', async (req: Request, res: Response) => {
  try {
    // Implementation for bulk sending would go here
    res.status(501).json({
      success: false,
      message: 'Bulk send operation not yet implemented'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to perform bulk operation',
      error: (error as Error).message 
    });
  }
});

export default router;