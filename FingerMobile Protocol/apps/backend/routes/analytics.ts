import express, { Request, Response } from 'express';
import AnalyticsController from '../controllers/AnalyticsController';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(adminAuth);

// Platform performance routes
router.get('/platform-performance', AnalyticsController.getPlatformPerformance);

// User engagement routes
router.get('/user-engagement', AnalyticsController.getUserEngagement);

// Content performance routes
router.get('/content-performance', AnalyticsController.getContentPerformance);

// Revenue performance routes
router.get('/revenue-performance', AnalyticsController.getRevenuePerformance);

// Historical data routes
router.get('/historical-data', AnalyticsController.getHistoricalData);

// Export analytics routes
router.get('/export', AnalyticsController.exportAnalytics);

// Real-time data routes
router.get('/realtime', AnalyticsController.getRealtimeData);

export default router;