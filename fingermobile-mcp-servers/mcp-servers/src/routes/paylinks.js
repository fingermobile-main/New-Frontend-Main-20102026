const express = require("express");
const router = express.Router();
const paylinkController = require("../controllers/paylinkController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Get all paylinks for the authenticated member
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  paylinkController.getPaylinks,
);

// Create a new paylink
router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  paylinkController.createPaylink,
);

// Get a specific paylink by ID
router.get(
  "/:paylinkId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  paylinkController.getPaylinkById,
);

// Update a paylink
router.put(
  "/:paylinkId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  paylinkController.updatePaylink,
);

// Delete a paylink
router.delete(
  "/:paylinkId",
  authenticateToken,
  authorizeRoles(["admin"]),
  paylinkController.deletePaylink,
);

// Use a paylink (public endpoint - no auth required)
router.post("/use/:paylinkUrl", paylinkController.usePaylink);

module.exports = router;
