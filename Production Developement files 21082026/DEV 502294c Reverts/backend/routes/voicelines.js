const express = require('express');
const voicelines = require('../controllers/voicelinesController.js');
const { authenticate } = require('../middleware/authenticate');
const { contentDb } = require("../db");
const router = express.Router();

router.get("/voicelines", voicelines.getAll);
router.get("/voicelines/:voiceLineId", voicelines.getById);
router.post("/voicelines", voicelines.create);
router.put("/voicelines/:voiceLineId", voicelines.update);
router.delete("/voicelines/:voiceLineId", authenticate, voicelines.delete);
router.post("/voicelines/:voiceLineId/like", authenticate, voicelines.create);
router.delete("/voicelines/:voiceLineId/like", authenticate, voicelines.delete);
router.get("/members/:memberId/voicelines", authenticate, voicelines.getById);
router.get("/voicelines/:voiceLineId/comments", voicelines.getById);
router.post("/voicelines/:voiceLineId/comments", authenticate, voicelines.create);
router.delete("/comments/:commentId", authenticate, voicelines.delete);

module.exports = router;