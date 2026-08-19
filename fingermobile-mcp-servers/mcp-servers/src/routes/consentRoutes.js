const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const Member = require("../models/Member");

// Get member consent preferences
router.get(
  "/preferences",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  async (req, res) => {
    try {
      const member = await Member.findByPk(req.member.id);
      if (!member) {
        return res.status(404).json({message: "member not found" });
      }
      res.json(member.consentPreferences);
    } catch (error) {
      res.status(500).json({message: error.message });
    }
  },
);

// Update member consent preferences
router.put(
  "/preferences",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  async (req, res) => {
    try {
      const member = await Member.findByPk(req.member.id);
      if (!member) {
        return res.status(404).json({message: "member not found" });
      }
      await member.update({consentPreferences: req.body });
      res.json(member.consentPreferences);
    } catch (error) {
      res.status(500).json({message: error.message });
    }
  },
);

module.exports = router;
