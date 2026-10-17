const express = require('express');
const supervi_leaderboards = require('../controllers/supervi_leaderboardsController.js');
const { authenticate } = require('../middleware/authenticate');
const { Pool } = require("pg");
const router = express.Router();

router.get("/health", supervi_leaderboards.getAll);
router.get("/", supervi_leaderboards.getAll);
router.get("/:id", supervi_leaderboards.getById);
router.post("/", supervi_leaderboards.create);
router.put("/:id", supervi_leaderboards.update);
router.delete("/:id", supervi_leaderboards.delete);
router.get("/:id/entries", supervi_leaderboards.getById);
router.get("/:id/members/:memberId/position", supervi_leaderboards.getById);
router.post("/:id/submit-score", authenticate, supervi_leaderboards.create);
router.get("/:id/stats", supervi_leaderboards.getById);
router.get("/members/:memberId/best-scores", supervi_leaderboards.getById);

module.exports = router;