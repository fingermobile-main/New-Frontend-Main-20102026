const express = require('express');
const router = express.Router();
const developerPortalController = require('../controllers/DeveloperPortalController');
const { authenticate } = require('../middleware/authenticate');

// Public endpoints - API documentation
router.get('/openapi.json', developerPortalController.getOpenAPISpec);
router.get('/examples/curl', developerPortalController.getCurlExamples);

// SDK downloads (can be public or authenticated)
router.get('/sdk/javascript', developerPortalController.getJavaScriptSDK);
router.get('/sdk/python', developerPortalController.getPythonSDK);

// Protected endpoints - Admin only
router.post('/docs/generate', authenticate, developerPortalController.regenerateDocs);
router.get('/stats', authenticate, developerPortalController.getAPIStats);

module.exports = router;