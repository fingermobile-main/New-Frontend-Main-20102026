#!/bin/bash
BASE="/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps/backend"

# Monetization Route
cat << 'ROUTE' > "$BASE/routes/monetization.js"
const express = require('express');
const router = express.Router();
const controller = require('../controllers/monetizationController');
const { authenticate } = require('../middleware/authenticate');

router.get('/subscriptions', authenticate, controller.getSubscriptions);
router.post('/subscriptions', authenticate, controller.createSubscription);
router.delete('/subscriptions', authenticate, controller.cancelSubscription);

module.exports = router;
ROUTE

# Voice Route
cat << 'ROUTE' > "$BASE/routes/voice.js"
const express = require('express');
const router = express.Router();
const controller = require('../controllers/voiceController');
const { authenticate } = require('../middleware/authenticate');

router.post('/process', authenticate, controller.processVoice);
router.get('/settings', authenticate, controller.getVoiceSettings);

module.exports = router;
ROUTE

# Business Hub Route
cat << 'ROUTE' > "$BASE/routes/businessHub.js"
const express = require('express');
const router = express.Router();
const controller = require('../controllers/businessHubController');
const { authenticate } = require('../middleware/authenticate');

router.get('/metrics', authenticate, controller.getBusinessMetrics);
router.put('/profile', authenticate, controller.updateBusinessProfile);

module.exports = router;
ROUTE

# Metrics Route
cat << 'ROUTE' > "$BASE/routes/metrics.js"
const express = require('express');
const router = express.Router();
const controller = require('../controllers/metricsController');
const { authenticate } = require('../middleware/authenticate');

router.get('/platform', authenticate, controller.getPlatformInsights);
router.get('/user', authenticate, controller.getUserAnalytics);

module.exports = router;
ROUTE

# User Management Route
cat << 'ROUTE' > "$BASE/routes/userManagement.js"
const express = require('express');
const router = express.Router();
const controller = require('../controllers/userManagementController');
const { authenticate } = require('../middleware/authenticate');

router.get('/profile', authenticate, controller.getProfile);
router.put('/profile', authenticate, controller.updateProfile);
router.put('/settings', authenticate, controller.updateSettings);

module.exports = router;
ROUTE

# Recommendations Route
cat << 'ROUTE' > "$BASE/routes/recommendations.js"
const express = require('express');
const router = express.Router();
const controller = require('../controllers/recommendationsController');
const { authenticate } = require('../middleware/authenticate');

router.get('/discover', authenticate, controller.getDiscoverFeed);

module.exports = router;
ROUTE

# Dancia Route
cat << 'ROUTE' > "$BASE/routes/dancia.js"
const express = require('express');
const router = express.Router();
const controller = require('../controllers/danciaController');
const { authenticate } = require('../middleware/authenticate');

router.get('/channels', authenticate, controller.getTvChannels);
router.get('/schedule', authenticate, controller.getSchedule);

module.exports = router;
ROUTE

echo "Routes generated successfully."
