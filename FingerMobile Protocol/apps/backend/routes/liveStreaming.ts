import express, { Request, Response } from 'express';
import LiveStreamingController from '../controllers/LiveStreamingController';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(adminAuth);

// Streams routes
router.get('/streams', LiveStreamingController.getStreams);
router.get('/streams/:id', LiveStreamingController.getStreamById);
router.post('/streams', LiveStreamingController.createStream);
router.put('/streams/:id', LiveStreamingController.updateStream);
router.delete('/streams/:id', LiveStreamingController.deleteStream);
router.put('/streams/:id/start', LiveStreamingController.startStream);
router.put('/streams/:id/end', LiveStreamingController.endStream);
router.put('/streams/:id/toggle-record', LiveStreamingController.toggleStreamRecording);

// Stream viewers routes
router.get('/viewers', LiveStreamingController.getStreamViewers);

// Stream interactions routes
router.get('/interactions', LiveStreamingController.getStreamInteractions);

// Analytics routes
router.get('/analytics', LiveStreamingController.getStreamingAnalytics);

export default router;