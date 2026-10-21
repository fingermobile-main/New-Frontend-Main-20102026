import express, { Request, Response } from 'express';
import UserManagementController from '../controllers/UserManagementController';
import { adminAuth } from '../middleware/adminAuth'; // Using admin authentication

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(adminAuth);

// Define routes for user management
router.get('/', UserManagementController.getAllUsers);
router.get('/:id', UserManagementController.getUserById);
router.post('/', UserManagementController.createUser);
router.put('/:id', UserManagementController.updateUser);
router.delete('/:id', UserManagementController.deleteUser);

// Additional routes for specific user management functions
router.post('/:id/roles', UserManagementController.assignRole);
router.get('/:id/activity', UserManagementController.getUserActivity);
router.post('/:id/reset-password', UserManagementController.resetPassword);

// Export the router with CommonJS + ES module compatibility
module.exports = router;
export default router;