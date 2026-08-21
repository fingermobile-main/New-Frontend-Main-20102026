const express = require('express');
const sentient = require('../controllers/SentientController.js');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();

// Sentient AI behavioral analytics endpoints
router.post("/analyze", authenticate, sentient.analyzeBehavior);
router.get("/baseline/:memberId", authenticate, sentient.getBaseline);
router.put("/baseline", authenticate, sentient.updateBaseline);
router.get("/anomalies", authenticate, sentient.getAnomalies);

module.exports = router;
