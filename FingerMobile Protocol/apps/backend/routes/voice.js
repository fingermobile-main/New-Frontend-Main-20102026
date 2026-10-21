const express = require('express');
const router = express.Router();
const controller = require('../controllers/voiceController');
const { authenticate } = require('../middleware/authenticate');

router.post('/process', authenticate, controller.processVoice);
router.get('/settings', authenticate, controller.getVoiceSettings);

module.exports = router;
