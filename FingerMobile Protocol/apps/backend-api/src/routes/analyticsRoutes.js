const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const lushAnalyticsController = require('../controllers/lushAnalyticsController');

// Track a user event
router.post('/events', authenticateToken, async (req, res) => {
  try {
    const { eventType, properties } = req.body;
    const userId = req.user.id;

    const result = await lushAnalyticsController.trackEvent(userId, eventType, properties);

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user analytics
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    const result = await lushAnalyticsController.getUserAnalytics(userId, startDate, endDate);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get app analytics overview
router.get('/app', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const result = await lushAnalyticsController.getAppAnalytics(startDate, endDate);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user retention analytics
router.get('/retention', authenticateToken, async (req, res) => {
  try {
    const { cohortPeriod = 'weekly' } = req.query;

    const result = await lushAnalyticsController.getUserRetentionAnalytics(cohortPeriod);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user engagement over time
router.get('/engagement', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { metric, granularity = 'daily', startDate, endDate } = req.query;

    if (!metric) {
      return res.status(400).json({ success: false, error: 'Metric is required' });
    }

    const result = await lushAnalyticsController.getUserEngagementOverTime(userId, metric, granularity, startDate, endDate);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's most active times
router.get('/active-times', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await lushAnalyticsController.getUserActiveTimes(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get conversion funnel
router.get('/funnel', authenticateToken, async (req, res) => {
  try {
    const { steps, startDate, endDate } = req.query;

    if (!steps) {
      return res.status(400).json({ success: false, error: 'Steps array is required' });
    }

    const stepsArray = Array.isArray(steps) ? steps : steps.split(',');

    const result = await lushAnalyticsController.getConversionFunnel(stepsArray, startDate, endDate);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get cohort analysis
router.get('/cohort', authenticateToken, async (req, res) => {
  try {
    const { cohortDimension = 'signup_date', metric = 'retention', startDate, endDate } = req.query;

    const result = await lushAnalyticsController.getCohortAnalysis(cohortDimension, metric, startDate, endDate);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get A/B test results
router.get('/ab-test/:testId', authenticateToken, async (req, res) => {
  try {
    const { testId } = req.params;
    const { startDate, endDate } = req.query;

    const result = await lushAnalyticsController.getAbTestResults(testId, startDate, endDate);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user behavior segments
router.get('/segments', authenticateToken, async (req, res) => {
  try {
    const { criteria, limit = 100 } = req.query;

    if (!criteria) {
      return res.status(400).json({ success: false, error: 'Criteria is required' });
    }

    const parsedCriteria = JSON.parse(criteria);

    const result = await lushAnalyticsController.getUserBehaviorSegments(parsedCriteria, parseInt(limit));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get feature usage analytics
router.get('/feature-usage', authenticateToken, async (req, res) => {
  try {
    const { featureNames, startDate, endDate } = req.query;

    if (!featureNames) {
      return res.status(400).json({ success: false, error: 'Feature names array is required' });
    }

    const featuresArray = Array.isArray(featureNames) ? featureNames : featureNames.split(',');

    const result = await lushAnalyticsController.getFeatureUsageAnalytics(featuresArray, startDate, endDate);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user lifetime value
router.get('/user-ltv/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await lushAnalyticsController.getUserLifetimeValue(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get churn prediction for user
router.get('/churn-prediction/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await lushAnalyticsController.getChurnPrediction(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get analytics export
router.get('/export', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { exportType, startDate, endDate } = req.query;

    if (!exportType) {
      return res.status(400).json({ success: false, error: 'Export type is required' });
    }

    const result = await lushAnalyticsController.getAnalyticsExport(userId, exportType, startDate, endDate);

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