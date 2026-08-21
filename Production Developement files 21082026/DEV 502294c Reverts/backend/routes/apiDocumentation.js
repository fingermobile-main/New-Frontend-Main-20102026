const express = require("express");
const router = express.Router();
const apiDocumentationController = require("../controllers/apiDocumentationController");
const { authenticateApiKey } = require("../middleware/apiKeyAuth");

// Get API documentation
router.get("/", authenticateApiKey, (req, res) => {
  apiDocumentationController.getApiDocumentation(req, res);
});

// Get security information
router.get("/security", authenticateApiKey, (req, res) => {
  apiDocumentationController.getSecurityInfo(req, res);
});

module.exports = router;
