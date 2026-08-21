const express = require('express');
const leaderboards = require('../controllers/leaderboardsController.js');
const { identityDb } = require("../db");
const router = express.Router();

router.get("/", leaderboards.getAll);
router.get("/:leaderboardId", leaderboards.getById);
router.get("/:leaderboardId/positions", leaderboards.getById);
router.get("/:leaderboardId/user/:userId", leaderboards.getById);
router.post("/", leaderboards.create);
router.post("/:leaderboardId/score", leaderboards.create);
router.get("/:leaderboardId/top/:count", leaderboards.getById);

module.exports = router;