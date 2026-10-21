const express = require('express');
const router = express.Router();
const emojiController = require('../controllers/emojiController');

// GET /api/emojis - Retrieve full official brand emoji catalog
router.get('/', emojiController.getAllEmojis);

// GET /api/emojis/toast/:type - Retrieve official emoji for specific toast type
router.get('/toast/:type', emojiController.getToastEmoji);

// GET /api/emojis/:slug - Retrieve specific emoji by slug
router.get('/:slug', emojiController.getEmojiBySlug);

module.exports = router;
