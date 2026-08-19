const express = require("express");
const router = express.Router();
const cookiePolicyController = require("../controllers/cookiePolicyController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Route to get the current cookie policy
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  cookiePolicyController.getCookiePolicy,
);

// Route to create or update the cookie policy (admin only)
router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin"]),
  cookiePolicyController.createOrUpdateCookiePolicy,
);

module.exports = router;
