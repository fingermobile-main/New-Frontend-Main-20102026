const express = require("express");
const router = express.Router();
const contactSupportController = require("../controllers/contactSupportController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Route to submit a new support request
router.post(
  "/submit",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  contactSupportController.submitRequest,
);

// Route to get all support requests (admin only)
router.get(
  "/requests",
  authenticateToken,
  authorizeRoles(["admin"]),
  contactSupportController.getAllRequests,
);

// Route to get a specific support request by ID (admin or requester)
router.get(
  "/requests/:id",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  contactSupportController.getRequestById,
);

// Route to update the status of a support request (admin only)
router.put(
  "/requests/:id/status",
  authenticateToken,
  authorizeRoles(["admin"]),
  contactSupportController.updateRequestStatus,
);

module.exports = router;
