const express = require("express");
const router = express.Router();
const gameProgressController = require("../controllers/gameProgressController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Create a new game progress entry
router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  gameProgressController.createGameProgress,
);

// Get all game progress entries for a specific member
router.get(
  "/member/:memberId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  gameProgressController.getGameProgressBymemberId,
);

// Get all game progress entries for a specific game
router.get(
  "/game/:gameId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  gameProgressController.getGameProgressByGameId,
);

// Get a single game progress entry by ID
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  gameProgressController.getGameProgressById,
);

// Update a game progress entry by ID
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  gameProgressController.updateGameProgress,
);

// Delete a game progress entry by ID
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin"]),
  gameProgressController.deleteGameProgress,
);

module.exports = router;
