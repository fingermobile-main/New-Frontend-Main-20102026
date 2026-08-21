const express = require('express');
const fingerwars = require('../controllers/fingerwarsController.js');
const { contentDb } = require("../db");
const router = express.Router();

router.get("/games", fingerwars.getAll);
router.get("/games/:gameId", fingerwars.getById);
router.post("/games", fingerwars.create);
router.post("/games/:gameId/join", fingerwars.create);
router.post("/games/:gameId/leave", fingerwars.create);
router.get("/players/:playerId/games", fingerwars.getById);
router.get("/players/:playerId/participations", fingerwars.getById);
router.get("/categories", fingerwars.getAll);

module.exports = router;