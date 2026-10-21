import express, { Request, Response } from 'express';
import CommunityController from '../controllers/CommunityController';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(adminAuth);

// Community groups routes
router.get('/groups', CommunityController.getCommunityGroups);
router.get('/groups/:id', CommunityController.getCommunityGroupById);
router.post('/groups', CommunityController.createCommunityGroup);
router.put('/groups/:id', CommunityController.updateCommunityGroup);
router.delete('/groups/:id', CommunityController.deleteCommunityGroup);
router.put('/groups/:id/suspend', CommunityController.suspendCommunityGroup);
router.put('/groups/:id/activate', CommunityController.activateCommunityGroup);

// Forum threads routes
router.get('/threads', CommunityController.getForumThreads);

// Community interactions routes
router.get('/interactions', CommunityController.getCommunityInteractions);

// Community moderation routes
router.get('/moderation', CommunityController.getCommunityModerationData);

// Community analytics routes
router.get('/analytics', CommunityController.getCommunityAnalytics);

export default router;