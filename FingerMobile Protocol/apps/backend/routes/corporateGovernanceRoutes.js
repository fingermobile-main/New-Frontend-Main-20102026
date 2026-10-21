/**
 * FingerMobile Protocol - Corporate Governance Routes
 * Blueprint Reference: FingerMobile corporate governance and structure 14102026.md
 */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/corporateGovernanceController');

// Roles Catalog & Management
router.get('/roles', controller.getRoles);
router.get('/corporate-roles', controller.getRoles);
router.get('/roles/:id', controller.getRoleById);
router.get('/corporate-roles/:id', controller.getRoleById);
router.post('/roles', controller.createRole);
router.post('/corporate-roles', controller.createRole);
router.put('/roles/:id', controller.updateRole);
router.put('/corporate-roles/:id', controller.updateRole);
router.delete('/roles/:id', controller.deleteRole);
router.delete('/corporate-roles/:id', controller.deleteRole);

// Sub-offices & Functional Units
router.post('/roles/:roleId/sub-offices', controller.addSubOffice);
router.put('/roles/:roleId/sub-offices/:subOfficeId', controller.updateSubOffice);
router.delete('/roles/:roleId/sub-offices/:subOfficeId', controller.deleteSubOffice);

// Technical Delegated Authority (DoA) Matrix
router.get('/doa', controller.getDoaMatrix);

// Cross-Functional RACI Governance Matrix
router.get('/raci', controller.getRaciMatrix);

// Segregation of Duties (SoD) Safeguards
router.get('/sod', controller.getSodSafeguards);

// Member Assignment strictly by SuperAdmin or Co-Founder CFO
router.post('/assign-member', controller.assignMemberToRole);
router.get('/member-assignments', controller.getMemberAssignments);

// WORM Audit Logs
router.get('/audit-logs', controller.getAuditLogs);

module.exports = router;
