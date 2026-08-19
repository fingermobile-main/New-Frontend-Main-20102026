const express = require("express");
const router = express.Router();
const ppvController = require("../controllers/ppvController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// POST /api/ppv/content - Create new PPV content
router.post(
  "/content",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  ppvController.createPpvContent,
);

// GET /api/ppv/content/:contentId - Get PPV content by ID
router.get(
  "/content/:contentId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  ppvController.getPpvContentById,
);

// GET /api/ppv/content/creator/:creatorId - Get all PPV content by a creator
router.get(
  "/content/creator/:creatorId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  ppvController.getPpvContentByCreator,
);

// POST /api/ppv/purchase - Purchase PPV content
router.post(
  "/purchase",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  ppvController.purchasePpvContent,
);

// GET /api/ppv/access/:contentId - Check PPV content access for authenticated member
router.get(
  "/access/:contentId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  ppvController.checkPpvAccess,
);

module.exports = router;
