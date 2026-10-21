/**
 * Sovereign RBAC & Pages Directory Consoles Routes
 * FingerMobile Protocol Backend
 */

const express = require('express');
const router = express.Router();
const sovereignRbacController = require('../controllers/sovereignRbacController');
const pagesPermissionController = require('../controllers/pagesPermissionController');
const { executiveFieldFilter } = require('../middleware/executiveFieldFilter');
const { requireMasterDashboardAccess } = require('../middleware/requireMasterDashboardAccess');

// Global field sanitizer for this route subtree
router.use(executiveFieldFilter);

// 1. Overview & Stats
router.get('/overview', sovereignRbacController.getOverview);

// 2. Users Permission Summary Matrix
router.get('/users-matrix', sovereignRbacController.getUsersPermissionSummary);

// 3. Back Office Staff Directory & Assignments
router.get('/staff', sovereignRbacController.getStaffDirectory);
router.post('/staff/assign', sovereignRbacController.assignStaffRole);
router.delete('/staff/assign/:id', sovereignRbacController.removeStaffAssignment);

// 4. Badge Tier Privileges
router.get('/badges', sovereignRbacController.getBadgeTiers);
router.put('/badges/:id', sovereignRbacController.updateBadgeTier);

// 5. Distinguished & Honoured Members Registry
router.get('/distinguished', sovereignRbacController.getDistinguishedRegistry);
router.post('/distinguished/appoint', sovereignRbacController.appointDistinguishedMember);
router.delete('/distinguished/appoint/:id', sovereignRbacController.revokeDistinguishedMember);

// 6. Moderator Scopes
router.get('/moderators', sovereignRbacController.getModeratorScopes);
router.post('/moderators/assign', sovereignRbacController.assignModeratorScope);
router.delete('/moderators/assign/:id', sovereignRbacController.revokeModeratorScope);

// 7. Canonical Pages Directory
router.get('/pages', pagesPermissionController.getPagesDirectory);
router.post('/pages/register', pagesPermissionController.registerPage);
router.put('/pages/:id', pagesPermissionController.updatePagePermissions);

// 8. Field Level Masking Rules
router.get('/masking-rules', pagesPermissionController.getMaskingRules);
router.put('/masking-rules/:id', pagesPermissionController.updateMaskingRule);

// 9. Content Creators Hive
router.get('/creators', sovereignRbacController.getCreatorsDirectory);
router.put('/creators/:id', sovereignRbacController.updateCreatorProfile);

// 10. Business & Organizations Hive
router.get('/business', sovereignRbacController.getBusinessDirectory);
router.put('/business/:id', sovereignRbacController.updateBusinessAccreditation);

// 11. Role / Account Type Promotion
router.post('/users/update-role', sovereignRbacController.updateUserAccountType);

module.exports = router;
