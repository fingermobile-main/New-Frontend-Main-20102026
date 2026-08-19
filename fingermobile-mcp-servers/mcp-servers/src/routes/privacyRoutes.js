const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const {
  getmemberData,
  rectifymemberData,
  deletememberData
} = require("../utils/privacyPolicy");

// Get member data (Right to Access)
router.get(
  "/data",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  async (req, res) => {
    try {
      const memberData = await getmemberData(req.member.id);
      res.json(memberData);
    } catch (error) {
      res.status(500).json({message: error.message });
    }
  },
);

// Rectify member data (Right to Rectification)
router.put(
  "/data",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  async (req, res) => {
    try {
      const updatedmemberData = await rectifymemberData(
        req.member.id,
        req.body,
      );
      res.json(updatedmemberData);
    } catch (error) {
      res.status(500).json({message: error.message });
    }
  },
);

// Delete member data (Right to Erasure / Right to be Forgotten)
router.delete(
  "/data",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  async (req, res) => {
    try {
      await deletememberData(req.member.id);
      res.status(204).send(); // No Content
    } catch (error) {
      res.status(500).json({message: error.message });
    }
  },
);

module.exports = router;
