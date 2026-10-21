const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const lushMatchController = require('../controllers/lushMatchController');

// Get user's matches
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, offset = 0 } = req.query;

    const result = await lushMatchController.getUserMatches(userId, parseInt(limit), parseInt(offset));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Unmatch with a user
router.delete('/:matchedUserId', authenticateToken, async (req, res) => {
  try {
    const { matchedUserId } = req.params;
    const userId = req.user.id;

    const result = await lushMatchController.unmatchUsers(userId, matchedUserId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get match statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await lushMatchController.getMatchStatistics(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get potential matches
router.get('/potential', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;

    const result = await lushMatchController.getPotentialMatches(userId, parseInt(limit));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Report a match
router.post('/report', authenticateToken, async (req, res) => {
  try {
    const { reportedUserId, reason } = req.body;
    const userId = req.user.id;

    const result = await lushMatchController.reportMatch(userId, reportedUserId, reason);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get match recommendations
router.get('/recommendations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;

    const result = await lushMatchController.getMatchRecommendations(userId, parseInt(limit));

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