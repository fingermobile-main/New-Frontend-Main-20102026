const express = require('express');
const supervi_achievements = require('../controllers/supervi_achievementsController.js');
const { Pool } = require("pg");
const router = express.Router();

router.get("/health", supervi_achievements.getAll);
router.get("/", supervi_achievements.getAll);
router.get("/:id", supervi_achievements.getById);
router.post("/", supervi_achievements.create);
router.put("/:id", supervi_achievements.update);
router.delete("/:id", supervi_achievements.delete);
router.get("/members/:memberId", supervi_achievements.getById);
router.post("/members/:memberId/:achievementId/unlock", supervi_achievements.create);
router.post("/members/:memberId/:achievementId/progress", supervi_achievements.create);
router.get("/members/:memberId/stats", supervi_achievements.getById);
router.get("/top-achievers", supervi_achievements.getAll);

module.exports = router;