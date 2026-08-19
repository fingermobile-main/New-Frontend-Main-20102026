const express = require("express");
const router = express.Router();
const memberDirectoryController = require("../controllers/memberDirectoryController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  memberDirectoryController.getAllMembers,
);

module.exports = router;
