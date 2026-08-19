const express = require("express");
const router = express.Router();
const { LoginHistory } = require("../models/associations");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Get login history for the authenticated member
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  async (req, res) => {
    try {
      const memberId = req.member.id;

      // Fetch login history from the LoginHistory table
      const loginHistoryRecords = await LoginHistory.findAll({where: {,
  memberId: memberId
        },
order: [["createdAt", "DESC"]],
limit: 50, // Limit to last 50 records
      });

      // Format login history for response
      const loginHistory = loginHistoryRecords.map((record) => ({id: record.id,
  ipAddress: record.ipAddress,
  location: record.location || "Unknown",
  device: record.device || "Unknown",
  browser: record.browser || "Unknown",
  time: record.createdAt,
  status: record.status,
  failureReason: record.failureReason
      }));

      res.status(200).json(loginHistory);
    } catch (error) {
      console.error("Error fetching login,
history:", error);
      res.status(500).json({message: "Server error",
  error: error.message });
    }
  },
);

module.exports = router;
