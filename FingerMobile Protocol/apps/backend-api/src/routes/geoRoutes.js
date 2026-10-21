const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const lushGeoController = require('../controllers/lushGeoController');

// Update user's location
router.post('/location', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, accuracy } = req.body;
    const userId = req.user.id;

    const location = { latitude, longitude };
    const result = await lushGeoController.updateUserLocation(userId, location, accuracy);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's current location
router.get('/location', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await lushGeoController.getUserLocation(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get nearby users
router.get('/nearby', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { maxDistance = 50, limit = 20 } = req.query;

    const result = await lushGeoController.getNearbyUsers(userId, parseInt(maxDistance), parseInt(limit));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get users within a specific area
router.post('/area', authenticateToken, async (req, res) => {
  try {
    const { northEast, southWest, limit = 50 } = req.body;

    const result = await lushGeoController.getUsersInArea(northEast, southWest, parseInt(limit));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update user's geo preferences
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { preferences } = req.body;

    const result = await lushGeoController.updateUserGeoPreferences(userId, preferences);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's geo preferences
router.get('/preferences', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await lushGeoController.getUserGeoPreferences(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get location-based recommendations
router.post('/recommendations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { location, maxDistance = 25, limit = 10 } = req.body;

    const result = await lushGeoController.getLocationBasedRecommendations(userId, location, parseInt(maxDistance), parseInt(limit));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get location statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await lushGeoController.getLocationStats(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get users by country
router.get('/country/:countryCode', authenticateToken, async (req, res) => {
  try {
    const { countryCode } = req.params;
    const { limit = 50 } = req.query;

    const result = await lushGeoController.getUsersByCountry(countryCode, parseInt(limit));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get trending locations
router.get('/trending', authenticateToken, async (req, res) => {
  try {
    const { timeframe = 'daily', limit = 10 } = req.query;

    const result = await lushGeoController.getTrendingLocations(timeframe, parseInt(limit));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get location-based events
router.post('/events', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { location, radius = 25, limit = 10 } = req.body;

    const result = await lushGeoController.getLocationBasedEvents(userId, location, parseInt(radius), parseInt(limit));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Hide user from location discovery
router.patch('/hide-discovery', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { hide = true } = req.body;

    const result = await lushGeoController.hideFromLocationDiscovery(userId, hide);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get users with similar location patterns
router.get('/similar-patterns', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;

    const result = await lushGeoController.getUsersWithSimilarLocationPatterns(userId, parseInt(limit));

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