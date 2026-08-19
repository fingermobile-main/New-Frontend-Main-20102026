const express = require("express");
const router = express.Router();
const dataSubjectRequestController = require("../controllers/dataSubjectRequestController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Route to submit a new data subject request
router.post(
  "/submit",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  dataSubjectRequestController.submitRequest,
);

// Route to get all data subject requests (admin only)
router.get(
  "/requests",
  authenticateToken,
  authorizeRoles(["admin"]),
  dataSubjectRequestController.getAllRequests,
);

// Route to get a specific data subject request by ID (admin or requester)
router.get(
  "/requests/:id",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  dataSubjectRequestController.getRequestById,
);

// Route to update the status of a data subject request (admin only)
router.put(
  "/requests/:id/status",
  authenticateToken,
  authorizeRoles(["admin"]),
  dataSubjectRequestController.updateRequestStatus,
);

module.exports = router;
