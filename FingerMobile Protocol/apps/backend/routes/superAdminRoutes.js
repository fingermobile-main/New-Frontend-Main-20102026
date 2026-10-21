const express = require('express');
const router = express.Router();
const SuperAdminController = require('../controllers/SuperAdminController');
const { requireSuperAdmin } = require('../middleware/authMiddleware');

// All routes require SuperAdmin privileges
router.use(requireSuperAdmin);

// User Management
router.post('/user/censor', SuperAdminController.censorUser);
router.post('/user/reset-password', SuperAdminController.resetPassword);

// Content Management (UGC, Posts, Comments)
router.post('/content/manage', SuperAdminController.manageContent);

// Role Assignment (Mandates, Moderators, Creatives)
router.post('/roles/manage', SuperAdminController.manageRoles);

// Microservices Management
router.post('/services/manage', SuperAdminController.manageMicroservice);

// Curation Management
router.post('/curation/product', SuperAdminController.curateProduct);
router.post('/curation/media', SuperAdminController.curateMedia);
router.post('/curation/ads', SuperAdminController.manageAds);

// Member Management
router.post('/members', SuperAdminController.addMember);
router.delete('/members/:id', SuperAdminController.removeMember);
router.put('/members/:id', SuperAdminController.updateMember);
router.put('/members/:id/role', SuperAdminController.assignRole);
router.post('/operations', SuperAdminController.executeOperation);

// Dashboard Analytics
router.get('/stats', SuperAdminController.getStats);

module.exports = router;
