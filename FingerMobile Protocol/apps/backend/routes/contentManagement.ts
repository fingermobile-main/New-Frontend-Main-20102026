import express, { Request, Response } from 'express';
import ContentManagementController from '../controllers/ContentManagementController';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(adminAuth);

// Define routes for content management
router.get('/', ContentManagementController.getAllContent);
router.get('/:id', ContentManagementController.getContentById);
router.post('/', ContentManagementController.createContent);
router.put('/:id', ContentManagementController.updateContent);
router.delete('/:id', ContentManagementController.deleteContent);

// Additional routes for specific content management functions
router.post('/:id/approve', ContentManagementController.approveContent);
router.post('/:id/reject', ContentManagementController.rejectContent);
router.get('/categories', ContentManagementController.getContentCategories);

export default router;