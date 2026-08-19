const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Create a new game
router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  gameController.createGame,
);

// Get all games with optional filters
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "editor", "member"]),
  gameController.getGames,
);

// Get game by ID
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "editor", "member"]),
  gameController.getGameById,
);

// Update game by ID
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  gameController.updateGame,
);

// Delete game by ID
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  gameController.deleteGame,
);

module.exports = router;
