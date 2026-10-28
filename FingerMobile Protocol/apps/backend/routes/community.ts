import express, { Request, Response } from 'express';
import CommunityGroupAdminController from '../controllers/CommunityGroupAdminController';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(adminAuth);

// Community groups routes
router.get('/groups', CommunityGroupAdminController.getCommunityGroups);
router.get('/groups/:id', CommunityGroupAdminController.getCommunityGroupById);
router.post('/groups', CommunityGroupAdminController.createCommunityGroup);
router.put('/groups/:id', CommunityGroupAdminController.updateCommunityGroup);
router.delete('/groups/:id', CommunityGroupAdminController.deleteCommunityGroup);
router.put('/groups/:id/suspend', CommunityGroupAdminController.suspendCommunityGroup);
router.put('/groups/:id/activate', CommunityGroupAdminController.activateCommunityGroup);

// Forum threads routes
router.get('/threads', CommunityGroupAdminController.getForumThreads);

// Community interactions routes
router.get('/interactions', CommunityGroupAdminController.getCommunityInteractions);

// Community moderation routes
router.get('/moderation', CommunityGroupAdminController.getCommunityModerationData);

// Community analytics routes
router.get('/analytics', CommunityGroupAdminController.getCommunityAnalytics);

export default router;