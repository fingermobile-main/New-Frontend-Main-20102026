const express = require('express');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();
const luminaController = require('../controllers/luminaController');  // Corrected capitalization

// NEW: Lumina AI endpoints
// POST /api/lumina/ask - Proxy to AI provider (Gemini/OpenAI)
router.post('/ask', authenticate, luminaController.askQuestion);

// GET /api/lumina/history - Get user's AI query history
router.get('/history', authenticate, luminaController.getHistory);

// POST /api/lumina/chat - Start new chat session
router.post('/chat', authenticate, luminaController.startChat);

module.exports = router;
