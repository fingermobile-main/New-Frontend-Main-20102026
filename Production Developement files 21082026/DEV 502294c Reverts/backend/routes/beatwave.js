const express = require('express');
const beatwave = require('../controllers/beatwaveController.js');
const { authenticate } = require('../middleware/authenticate');
const { identityDb } = require("../db");
const router = express.Router();

router.get("/tracks", authenticate, beatwave.getAll);
router.get("/tracks/:id", beatwave.getById);
router.post("/tracks", authenticate, beatwave.create);
router.put("/tracks/:id", authenticate, beatwave.update);
router.delete("/tracks/:id", authenticate, beatwave.delete);
router.post("/tracks/:id/like", authenticate, beatwave.create);
router.post("/tracks/:id/save", authenticate, beatwave.create);
router.post("/tracks/:id/play", beatwave.create);
router.get("/playlists", beatwave.getAll);
router.get("/playlists/:id", beatwave.getById);
router.post("/playlists", authenticate, beatwave.create);
router.post("/playlists/:id/tracks", authenticate, beatwave.create);
router.delete("/playlists/:playlistId/tracks/:trackId", authenticate, beatwave.delete);
router.get("/artists", beatwave.getAll);
router.get("/artists/:id", beatwave.getById);
router.get("/albums", beatwave.getAll);
router.get("/albums/:id", beatwave.getById);
router.get("/search", beatwave.getAll);
router.get("/recommended/:memberId", authenticate, beatwave.getById);
router.get("/trending", beatwave.getAll);
router.get("/history/recent", authenticate, beatwave.getAll);

module.exports = router;