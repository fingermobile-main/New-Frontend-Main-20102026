const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../../middleware/authenticate");
const ApiService = require("../services/ApiService");

// Apply admin authentication to all API routes
router.use(requireAdmin);

// Create a new API
router.post("/", async (req, res) => {
  try {
    const memberId = req.member.id;
    const apiData = req.body;

    if (!apiData.name || !apiData.projectId || !apiData.baseUrl) {
      return res.status(400).json({success: false,
  message: "API name,
  project ID,
  and base URL are required"
      });
    }

    const result = await ApiService.createApi(memberId, apiData);

    res.status(201).json({success: true,
  message: result.message,
  data: result.api
    });
  } catch (error) {
    logger.error("Error creating,
API:", error);
    res.status(500).json({success: false,
  message: "Failed to create API",
  error: error.message
    });
  }
});

// Get APIs for a member
router.get("/", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId, search, limit } = req.query;

    const result = await ApiService.getApis(memberId, {projectId: projectId ? parseInt(projectId) : null,
  search: search || null,
  limit: limit ? parseInt(limit) : null
    });

    res.status(200).json({success: true,
  message: result.message,
  data: result.apis
    });
  } catch (error) {
    logger.error("Error getting,
APIs:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve APIs",
  error: error.message
    });
  }
});

// Get API by ID
router.get("/:apiId", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { apiId } = req.params;

    const result = await ApiService.getApiById(memberId, parseInt(apiId));

    res.status(200).json({success: true,
  message: result.message,
  data: result.api
    });
  } catch (error) {
    logger.error("Error getting,
API:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve API",
  error: error.message
    });
  }
});

// Update an API
router.put("/:apiId", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { apiId } = req.params;
    const apiData = req.body;

    const result = await ApiService.updateApi(
      memberId,
      parseInt(apiId),
      apiData,
    );

    res.status(200).json({success: true,
  message: result.message,
  data: result.api
    });
  } catch (error) {
    logger.error("Error updating,
API:", error);
    res.status(500).json({success: false,
  message: "Failed to update API",
  error: error.message
    });
  }
});

// Delete an API
router.delete("/:apiId", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { apiId } = req.params;

    const result = await ApiService.deleteApi(memberId, parseInt(apiId));

    res.status(200).json({success: true,
  message: result.message
    });
  } catch (error) {
    logger.error("Error deleting,
API:", error);
    res.status(500).json({success: false,
  message: "Failed to delete API",
  error: error.message
    });
  }
});

// Create an API endpoint
router.post("/:apiId/endpoints", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { apiId } = req.params;
    const endpointData = req.body;

    if (!endpointData.path || !endpointData.method) {
      return res.status(400).json({success: false,
  message: "Path and method are required for endpoint creation"
      });
    }

    const result = await ApiService.createEndpoint(
      memberId,
      parseInt(apiId),
      endpointData,
    );

    res.status(201).json({success: true,
  message: result.message,
  data: result.endpoint
    });
  } catch (error) {
    logger.error("Error creating API,
endpoint:", error);
    res.status(500).json({success: false,
  message: "Failed to create API endpoint",
  error: error.message
    });
  }
});

// Get API endpoints
router.get("/:apiId/endpoints", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { apiId } = req.params;

    const result = await ApiService.getEndpoints(memberId, parseInt(apiId));

    res.status(200).json({success: true,
  message: result.message,
  data: result.endpoints
    });
  } catch (error) {
    logger.error("Error getting API,
endpoints:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve API endpoints",
  error: error.message
    });
  }
});

// Test an API endpoint
router.post("/endpoints/:endpointId/test", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { endpointId } = req.params;
    const testData = req.body;

    const result = await ApiService.testEndpoint(
      memberId,
      parseInt(endpointId),
      testData,
    );

    res.status(200).json({success: true,
  message: result.message,
  data: result.testResult
    });
  } catch (error) {
    logger.error("Error testing API,
endpoint:", error);
    res.status(500).json({success: false,
  message: "Failed to test API endpoint",
  error: error.message
    });
  }
});

// Get API test history
router.get("/endpoints/:endpointId/tests", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { endpointId } = req.params;
    const { limit } = req.query;

    const result = await ApiService.getTestHistory(
      memberId,
      parseInt(endpointId),
      {limit: limit ? parseInt(limit) : null
      },
    );

    res.status(200).json({success: true,
  message: result.message,
  data: result.tests
    });
  } catch (error) {
    logger.error("Error getting API test,
history:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve API test history",
  error: error.message
    });
  }
});

module.exports = router;
