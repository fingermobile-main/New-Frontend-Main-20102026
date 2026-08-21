const express = require('express');
const router = express.Router();
const nexusgnnController = require('../controllers/nexusgnnController');
const { 
  findMatchesLimiter, 
  recommendationsLimiter, 
  lifecycleUpdateLimiter,
  validateMatchRequest,
  validateLifecycleUpdate,
  cacheMatchScore logNexusGNNUsage
} = require('../middleware/nexusgnn');

// Authentication middleware (import from your auth middleware)
const { authenticate } = require('../middleware/auth');

/**
 * NexusGNN API Routes
 * Graph Neural Network P2P Matching System
 */

// Apply usage logging to all routes
router.use(logNexusGNNUsage);

// Match finding and recommendations
router.post('/match', authenticate, findMatchesLimiter, validateMatchRequest, nexusgnnController.findMatches);
router.get('/recommendations/:userId', authenticate, recommendationsLimiter, nexusgnnController.getRecommendations);

// Content lifecycle management
router.post('/content/:id/lifecycle', authenticate, lifecycleUpdateLimiter, validateLifecycleUpdate, nexusgnnController.updateContentLifecycle);

// Graph analytics
router.get('/graph/analytics', authenticate, nexusgnnController.getGraphAnalytics);

// Embedding management
router.post('/embeddings/update', authenticate, nexusgnnController.updateEmbeddings);

// Serendipity content
router.get('/serendipity/:userId', authenticate, nexusgnnController.getSerendipityContent);

// Graph operations
router.post('/graph/node', authenticate, nexusgnnController.createGraphNode);
router.post('/graph/edge', authenticate, nexusgnnController.createGraphEdge);

// Scoring with cache
router.get('/score/:userId/:contentId', authenticate, cacheMatchScore, nexusgnnController.getMatchScore);

// Algorithm configuration (admin only)
router.put('/config/weights', authenticate, nexusgnnController.updateAlgorithmWeights);

module.exports = router;
