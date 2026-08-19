const express = require("express");
const router = express.Router();
const policyController = require("../policies/policyController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Create a new policy
router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin"]),
  policyController.createPolicy,
);

// Get all policies
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  policyController.getPolicies,
);

// Get a single policy by ID
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  policyController.getPolicyById,
);

// Update a policy by ID
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin"]),
  policyController.updatePolicy,
);

// Delete a policy by ID
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin"]),
  policyController.deletePolicy,
);

module.exports = router;
