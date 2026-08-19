const express = require("express");
const router = express.Router();
const termsAndConditionsController = require("../controllers/termsAndConditionsController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Route to get the current terms and conditions
router.get("/", termsAndConditionsController.getTermsAndConditions);

// Route to create or update the terms and conditions (admin only)
router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin"]),
  termsAndConditionsController.createOrUpdateTermsAndConditions,
);

module.exports = router;
