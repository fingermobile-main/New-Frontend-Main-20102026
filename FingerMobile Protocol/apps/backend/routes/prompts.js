const express = require('express');
const prompts = require('../controllers/PromptsController.js');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();

router.post('/analyze', authenticate, prompts.analyzePrompt);

module.exports = router;
