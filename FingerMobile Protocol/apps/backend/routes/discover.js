/* eslint-disable no-unused-vars */
const express = require('express');
const discover = require('../controllers/discoverController.js');
const consoleUpload = require('../middleware/consoleUpload');
const router = express.Router();

// MasterDashboard Console Micro-Management Telemetry
router.get('/console/stats', discover.getConsoleStats.bind(discover));

// Content & Discovery Core Endpoints
router.get('/content', discover.getAll.bind(discover));
router.get('/featured', discover.getFeatured.bind(discover));
router.get('/categories/:category', discover.getByCategory.bind(discover));
router.get('/creators', discover.getCreators.bind(discover));
router.get('/suggested/:memberId', discover.getSuggestions.bind(discover));
router.get('/broadcasts', discover.getBroadcasts.bind(discover));

// Content Dispatch & Management with multipart/form-data upload
router.post('/content/dispatch', consoleUpload.single('file'), discover.dispatchContent.bind(discover));
router.put('/content/:id', discover.updateContent.bind(discover));
router.delete('/content/:id', discover.deleteContent.bind(discover));

// Topics Engine: CRUD & Telemetry
router.get('/topics', discover.getTopics.bind(discover));
router.post('/topics', discover.createTopic.bind(discover));
router.put('/topics/:id', discover.updateTopic.bind(discover));
router.delete('/topics/:id', discover.deleteTopic.bind(discover));

// Hashtag Engine: CRUD & Telemetry
router.get('/hashtags', discover.getHashtags.bind(discover));
router.post('/hashtags', discover.createHashtag.bind(discover));
router.put('/hashtags/:id', discover.updateHashtag.bind(discover));
router.delete('/hashtags/:id', discover.deleteHashtag.bind(discover));

// P2P Swarm & Mesh Engine Endpoints
router.get('/p2p-swarm', discover.getP2PSwarm.bind(discover));
router.post('/p2p-swarm/rebalance', discover.rebalanceSwarm.bind(discover));

// Trends Syndication & Cross-Engine Feeder Endpoints
router.get('/trends-syndication', discover.getTrendsSyndication.bind(discover));
router.post('/trends-syndication/push', discover.triggerTrendsSyndication.bind(discover));

// Seshat Vault & Permanence Stream
router.get('/seshat-vault', discover.getSeshatVault.bind(discover));
router.get('/permanence-stream', discover.getPermanenceStream.bind(discover));

// ML & Interaction tracking routes
router.get('/personalized', discover.getPersonalized.bind(discover));
router.get('/metrics/algorithm', discover.getAlgorithmMetrics.bind(discover));
router.post('/track-interaction', discover.trackInteraction.bind(discover));

module.exports = router;

