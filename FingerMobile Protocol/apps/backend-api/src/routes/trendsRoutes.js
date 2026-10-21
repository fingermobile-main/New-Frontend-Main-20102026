const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const lushTrendsController = require('../controllers/lushTrendsController');

// Get trending topics
router.get('/topics', authenticateToken, async (req, res) => {
  try {
    const { timeframe = 'daily', limit = 10 } = req.query;

    const result = await lushTrendsController.getTrendingTopics(timeframe, parseInt(limit));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get trending hashtags
router.get('/hashtags', authenticateToken, async (req, res) => {
  try {
    const { timeframe = 'daily', limit = 10 } = req.query;

    const result = await lushTrendsController.getTrendingHashtags(timeframe, parseInt(limit));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get trending users
router.get('/users', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeframe = 'daily', limit = 10 } = req.query;

    const result = await lushTrendsController.getTrendingUsers(timeframe, parseInt(limit), userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get trending content
router.get('/content', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeframe = 'daily', limit = 10 } = req.query;

    const result = await lushTrendsController.getTrendingContent(timeframe, parseInt(limit), userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get trending interests
router.get('/interests', authenticateToken, async (req, res) => {
  try {
    const { timeframe = 'daily', limit = 10 } = req.query;

    const result = await lushTrendsController.getTrendingInterests(timeframe, parseInt(limit));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get personalized trends for a user
router.get('/personalized', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeframe = 'daily', limit = 10 } = req.query;

    const result = await lushTrendsController.getPersonalizedTrends(userId, timeframe, parseInt(limit));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get trend analytics
router.get('/analytics/:trendType/:trendId', authenticateToken, async (req, res) => {
  try {
    const { trendType, trendId } = req.params;
    const { startDate, endDate } = req.query;

    const result = await lushTrendsController.getTrendAnalytics(trendType, trendId, startDate, endDate);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get trend predictions
router.get('/predictions', authenticateToken, async (req, res) => {
  try {
    const { timeframe = 'daily', limit = 10 } = req.query;

    const result = await lushTrendsController.getTrendPredictions(timeframe, parseInt(limit));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get trend history
router.get('/history/:trendType/:trendId', authenticateToken, async (req, res) => {
  try {
    const { trendType, trendId } = req.params;
    const { timeframe = 'daily' } = req.query;

    const result = await lushTrendsController.getTrendHistory(trendType, trendId, timeframe);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get regional trends
router.get('/regional/:region', authenticateToken, async (req, res) => {
  try {
    const { region } = req.params;
    const { timeframe = 'daily', limit = 10 } = req.query;

    const result = await lushTrendsController.getRegionalTrends(region, timeframe, parseInt(limit));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get seasonal trends
router.get('/seasonal/:season', authenticateToken, async (req, res) => {
  try {
    const { season } = req.params;
    const { limit = 10 } = req.query;

    const result = await lushTrendsController.getSeasonalTrends(season, parseInt(limit));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get trend alerts for user
router.get('/alerts', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await lushTrendsController.getTrendAlerts(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Subscribe to trend alerts
router.post('/alerts/subscribe', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { preferences } = req.body;

    const result = await lushTrendsController.subscribeToTrendAlerts(userId, preferences);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get trending gifts
router.get('/gifts', authenticateToken, async (req, res) => {
  try {
    const { timeframe = 'daily', limit = 10 } = req.query;

    const result = await lushTrendsController.getTrendingGifts(timeframe, parseInt(limit));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get trending matching preferences
router.get('/matching-preferences', authenticateToken, async (req, res) => {
  try {
    const { timeframe = 'daily', limit = 10 } = req.query;

    const result = await lushTrendsController.getTrendingMatchingPreferences(timeframe, parseInt(limit));

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