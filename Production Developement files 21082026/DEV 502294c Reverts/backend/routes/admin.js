const express = require("express");
const adminController = require('../controllers/adminController.js');
const { authenticate } = require("../middleware/authenticate");

const router = express.Router();

// Admin member management routes
router.get("/admin/members", authenticate, adminController.getMembers);
router.post("/admin/members", authenticate, adminController.createMember);

// Verification records routes
router.get("/admin/verification-records", authenticate, adminController.getVerificationRecords);
router.post("/admin/update-verification-status", authenticate, adminController.updateVerificationStatus);

// Security events routes
router.get("/admin/security-events", authenticate, adminController.getSecurityEvents);

// System configurations routes
router.get("/admin/configurations", authenticate, adminController.getConfigurations);
router.put("/admin/configurations/:key", authenticate, adminController.updateConfiguration);

module.exports = router;

