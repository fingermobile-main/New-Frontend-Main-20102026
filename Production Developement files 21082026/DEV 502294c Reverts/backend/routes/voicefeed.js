const express = require('express');
const voicefeed = require('../controllers/voicefeedController.js');
const { authenticate } = require('../middleware/authenticate');
const { contentDb } = require("../db");
const router = express.Router();

router.get("/clips", voicefeed.getAll);
router.get("/clips/:clipId", voicefeed.getById);
router.post("/clips", voicefeed.create);
router.put("/clips/:clipId", voicefeed.update);
router.delete("/clips/:clipId", authenticate, voicefeed.delete);
router.post("/clips/:clipId/like", authenticate, voicefeed.create);
router.delete("/clips/:clipId/like", authenticate, voicefeed.delete);
router.get("/members/:memberId/clips", authenticate, voicefeed.getById);
router.get("/clips/:clipId/comments", voicefeed.getById);
router.post("/clips/:clipId/comments", authenticate, voicefeed.create);
router.delete("/comments/:commentId", authenticate, voicefeed.delete);

module.exports = router;