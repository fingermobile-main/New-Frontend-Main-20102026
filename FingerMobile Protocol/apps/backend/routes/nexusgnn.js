const express = require('express');
const router = express.Router();
const nexusgnnController = require('../controllers/nexusgnnController');
const {
  findMatchesLimiter,
  recommendationsLimiter,
  lifecycleUpdateLimiter,
  validateMatchRequest,
  validateLifecycleUpdate,
  cacheMatchScore,
  logNexusGNNUsage
} = require('../middleware/nexusgnn');

// Authentication middleware
const { authenticate } = require('../middleware/authenticate');

/**
 * NexusGNN API Routes
 * Graph Neural Network P2P Matching & Management System
 */

// Apply usage logging to all routes
router.use(logNexusGNNUsage);

// Match finding and recommendations
router.post('/match', authenticate, findMatchesLimiter, validateMatchRequest, (req, res) => nexusgnnController.findMatches(req, res));
router.get('/recommendations/:userId', authenticate, recommendationsLimiter, (req, res) => nexusgnnController.getRecommendations(req, res));

// Content lifecycle management & Kanban
router.post('/content/:id/lifecycle', authenticate, lifecycleUpdateLimiter, validateLifecycleUpdate, (req, res) => nexusgnnController.updateContentLifecycle(req, res));
router.get('/lifecycle/content', authenticate, (req, res) => nexusgnnController.getLifecycleContent(req, res));
router.post('/lifecycle/batch-evaluate', authenticate, (req, res) => nexusgnnController.batchEvaluateLifecycle(req, res));

// Graph analytics & topology
router.get('/graph/analytics', authenticate, (req, res) => nexusgnnController.getGraphAnalytics(req, res));
router.get('/graph/nodes', authenticate, (req, res) => nexusgnnController.getGraphNodes(req, res));
router.get('/graph/edges', authenticate, (req, res) => nexusgnnController.getGraphEdges(req, res));

// Embedding management & background jobs
router.post('/embeddings/update', authenticate, (req, res) => nexusgnnController.updateEmbeddings(req, res));
router.get('/embeddings/jobs', authenticate, (req, res) => nexusgnnController.getEmbeddingJobs(req, res));
router.get('/embeddings/jobs/:jobId', authenticate, (req, res) => nexusgnnController.getEmbeddingJobStatus(req, res));

// Serendipity content
router.get('/serendipity/:userId', authenticate, (req, res) => nexusgnnController.getSerendipityContent(req, res));

// Graph operations
router.post('/graph/node', authenticate, (req, res) => nexusgnnController.createGraphNode(req, res));
router.post('/graph/edge', authenticate, (req, res) => nexusgnnController.createGraphEdge(req, res));

// Scoring with cache
router.get('/score/:userId/:contentId', authenticate, cacheMatchScore, (req, res) => nexusgnnController.getMatchScore(req, res));

// Algorithm configuration & weights management
router.get('/config/weights', authenticate, (req, res) => nexusgnnController.getAlgorithmWeights(req, res));
router.put('/config/weights', authenticate, (req, res) => nexusgnnController.updateAlgorithmWeights(req, res));

module.exports = router;
