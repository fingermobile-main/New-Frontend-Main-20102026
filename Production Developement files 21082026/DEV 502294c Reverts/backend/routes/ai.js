const express = require('express');
// const ai = require('../controllers/aiController.js'); // Temporarily disabled - needs OPENAI_API_KEY
const { authenticate } = require('../middleware/authenticate');
const { identityDb } = require("../db");
const router = express.Router();

// AI Assistant routes - TEMPORARILY DISABLED
// router.post("/assist", authenticate, ai.chatAssistant);
// router.post("/generate-code", authenticate, ai.chatAssistant);
// router.get("/history", authenticate, ai.getUsageLogs);
// router.get("/code-history", authenticate, ai.getUsageLogs);
// router.get("/stats", authenticate, ai.getCreditBalance);

// Placeholder routes
router.post("/assist", authenticate, (req, res) => res.json({ message: "AI service coming soon" }));
router.post("/generate-code", authenticate, (req, res) => res.json({ message: "AI service coming soon" }));
router.get("/history", authenticate, (req, res) => res.json({ history: [] }));
router.get("/code-history", authenticate, (req, res) => res.json({ history: [] }));
router.get("/stats", authenticate, (req, res) => res.json({ stats: {} }));

module.exports = router;