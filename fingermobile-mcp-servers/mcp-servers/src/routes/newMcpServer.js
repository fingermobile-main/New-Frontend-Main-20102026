/* global require, module */
const express = require("express");
const router = express.Router();
const newMcpServerController = require("../controllers/newMcpServerController");

// Initialize MCP server
router.post("/initialize", newMcpServerController.initializeMcpServer);

// Health check endpoint
router.get("/health", newMcpServerController.healthCheck);

module.exports = router;
