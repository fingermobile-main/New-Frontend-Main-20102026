const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const lushSwipeController = require('../controllers/lushSwipeController');

// Process a swipe (like or pass)
router.post('/swipe', authenticateToken, async (req, res) => {
  try {
    const { targetUserId, direction } = req.body;
    const userId = req.user.id;

    const result = await lushSwipeController.processSwipe(userId, targetUserId, direction);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get discovery queue
router.get('/queue', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, offset = 0 } = req.query;

    const result = await lushSwipeController.getDiscoveryQueue(userId, parseInt(limit), parseInt(offset));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user swipe statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await lushSwipeController.getUserSwipeStats(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Rewind last swipe
router.post('/rewind', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await lushSwipeController.rewindSwipe(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Perform super like
router.post('/super-like', authenticateToken, async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const userId = req.user.id;

    const result = await lushSwipeController.performSuperLike(userId, targetUserId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get recent likes
router.get('/recent-likes', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;

    const result = await lushSwipeController.getRecentLikes(userId, parseInt(limit));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;