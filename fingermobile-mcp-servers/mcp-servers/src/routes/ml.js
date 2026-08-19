const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const {
  getmemberSegments,
  getmemberSegmentsChart,
  getContentRecommendations,
  getDeepLearningRecommendations,
  getEngagementHeatmap,
  getEngagementHeatmapChart,
  getCorrelationMatrix,
  getCorrelationMatrixChart,
  getPCAAnalysis,
  getPCAAnalysisChart,
  extractKeywords,
  analyzeSentiment,
  extractEntities,
  categorizeContent,
  generateContentTags,
  recordmemberActivity,
  getRealTimeRecommendations,
  getRealTimeAnalytics
} = require("../../ml_services/integration/ml_integration");
const { exportAnalytics } = require("../controllers/analyticsController");

// member segmentation endpoint
router.get(
  "/analytics/segments",
  authenticateToken,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const segments = await getmemberSegments();
      res.json(segments);
    } catch (error) {
      res.status(500).json({message: "Error fetching member segments",
  error: error.message
      });
    }
  },
);

// member segmentation chart endpoint
router.get(
  "/analytics/segments/chart",
  authenticateToken,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const chart = await getmemberSegmentsChart();
      res.json(chart);
    } catch (error) {
      res.status(500).json({message: "Error fetching member segments chart",
  error: error.message
      });
    }
  },
);

// Content recommendations endpoint
router.post(
  "/recommendations",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  async (req, res) => {
    try {
      const { memberId } = req.body;
      const recommendations = await getContentRecommendations(memberId);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({message: "Error fetching recommendations",
  error: error.message
      });
    }
  },
);

// Deep learning recommendations endpoint
router.post(
  "/recommendations/deep-learning",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  async (req, res) => {
    try {
      const { memberId } = req.body;
      const recommendations = await getDeepLearningRecommendations(memberId);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({message: "Error fetching deep learning recommendations",
  error: error.message
      });
    }
  },
);

// Engagement heatmap endpoint
router.get(
  "/analytics/heatmap",
  authenticateToken,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const heatmap = await getEngagementHeatmap();
      res.json(heatmap);
    } catch (error) {
      res.status(500).json({message: "Error fetching engagement heatmap",
  error: error.message
      });
    }
  },
);

// Engagement heatmap chart endpoint
router.get(
  "/analytics/heatmap/chart",
  authenticateToken,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const chart = await getEngagementHeatmapChart();
      res.json(chart);
    } catch (error) {
      res.status(500).json({message: "Error fetching engagement heatmap chart",
  error: error.message
      });
    }
  },
);

// Correlation matrix endpoint
router.get(
  "/analytics/correlations",
  authenticateToken,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const correlations = await getCorrelationMatrix();
      res.json(correlations);
    } catch (error) {
      res.status(500).json({message: "Error fetching correlation matrix",
  error: error.message
      });
    }
  },
);

// Correlation matrix chart endpoint
router.get(
  "/analytics/correlations/chart",
  authenticateToken,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const chart = await getCorrelationMatrixChart();
      res.json(chart);
    } catch (error) {
      res.status(500).json({message: "Error fetching correlation matrix chart",
  error: error.message
      });
    }
  },
);

// PCA analysis endpoint
router.get(
  "/analytics/pca",
  authenticateToken,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const pca = await getPCAAnalysis();
      res.json(pca);
    } catch (error) {
      res.status(500).json({message: "Error fetching PCA analysis",
  error: error.message
      });
    }
  },
);

// PCA analysis chart endpoint
router.get(
  "/analytics/pca/chart",
  authenticateToken,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const chart = await getPCAAnalysisChart();
      res.json(chart);
    } catch (error) {
      res.status(500).json({message: "Error fetching PCA analysis chart",
  error: error.message
      });
    }
  },
);

// NLP endpoints
router.post(
  "/nlp/keywords",
  authenticateToken,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const { text } = req.body;
      const keywords = await extractKeywords(text);
      res.json(keywords);
    } catch (error) {
      res.status(500).json({message: "Error extracting keywords",
  error: error.message
      });
    }
  },
);

router.post(
  "/nlp/sentiment",
  authenticateToken,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const { text } = req.body;
      const sentiment = await analyzeSentiment(text);
      res.json(sentiment);
    } catch (error) {
      res.status(500).json({message: "Error analyzing sentiment",
  error: error.message
      });
    }
  },
);

router.post(
  "/nlp/entities",
  authenticateToken,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const { text } = req.body;
      const entities = await extractEntities(text);
      res.json(entities);
    } catch (error) {
      res.status(500).json({message: "Error extracting entities",
  error: error.message
      });
    }
  },
);

router.post(
  "/nlp/category",
  authenticateToken,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const { text } = req.body;
      const category = await categorizeContent(text);
      res.json(category);
    } catch (error) {
      res.status(500).json({message: "Error categorizing content",
  error: error.message
      });
    }
  },
);

router.post(
  "/nlp/tags",
  authenticateToken,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const { text } = req.body;
      const tags = await generateContentTags(text);
      res.json(tags);
    } catch (error) {
      res.status(500).json({message: "Error generating content tags",
  error: error.message
      });
    }
  },
);

// Real-time recommendation endpoints
router.post(
  "/realtime/activity",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  async (req, res) => {
    try {
      const { memberId, itemId, activityType } = req.body;
      const result = await recordmemberActivity(memberId, itemId, activityType);
      res.json(result);
    } catch (error) {
      res.status(500).json({message: "Error recording member activity",
  error: error.message
      });
    }
  },
);

router.get(
  "/realtime/recommendations/:memberId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  async (req, res) => {
    try {
      const { memberId } = req.params;
      const { limit } = req.query;
      const recommendations = await getRealTimeRecommendations(memberId, limit);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({message: "Error fetching real-time recommendations",
  error: error.message
      });
    }
  },
);

router.get(
  "/realtime/analytics",
  authenticateToken,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const analytics = await getRealTimeAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({message: "Error fetching real-time analytics",
  error: error.message
      });
    }
  },
);

// Analytics export endpoint
router.get(
  "/analytics/export",
  authenticateToken,
  authorizeRoles(["admin"]),
  exportAnalytics,
);

module.exports = router;
