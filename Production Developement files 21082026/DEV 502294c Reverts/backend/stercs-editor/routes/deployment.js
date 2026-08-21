const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../../middleware/authenticate");
const DeploymentService = require("../services/deploymentService");

// Apply admin authentication to all deployment routes
router.use(requireAdmin);

// Create a new deployment configuration
router.post("/configs", async (req, res) => {
  try {
    const memberId = req.member.id;
    const configData = req.body;

    if (!configData.name || !configData.provider || !configData.projectId) {
      return res.status(400).json({success: false,
  message: "Configuration name,
  provider,
  and project ID are required"
      });
    }

    const result = await DeploymentService.createDeploymentConfig(
      memberId,
      configData,
    );

    res.status(201).json({success: true,
  message: result.message,
  data: result.config
    });
  } catch (error) {
    logger.error("Error creating deployment,
config:", error);
    res.status(500).json({success: false,
  message: "Failed to create deployment configuration",
  error: error.message
    });
  }
});

// Get deployment configurations
router.get("/configs", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId } = req.query;

    const result = await DeploymentService.getDeploymentConfigs(
      memberId,
      projectId ? parseInt(projectId) : null,
    );

    res.status(200).json({success: true,
  message: result.message,
  data: result.configs
    });
  } catch (error) {
    logger.error("Error getting deployment,
configs:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve deployment configurations",
  error: error.message
    });
  }
});

// Update a deployment configuration
router.put("/configs/:configId", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { configId } = req.params;
    const configData = req.body;

    const result = await DeploymentService.updateDeploymentConfig(
      memberId,
      parseInt(configId),
      configData,
    );

    res.status(200).json({success: true,
  message: result.message,
  data: result.config
    });
  } catch (error) {
    logger.error("Error updating deployment,
config:", error);
    res.status(500).json({success: false,
  message: "Failed to update deployment configuration",
  error: error.message
    });
  }
});

// Delete a deployment configuration
router.delete("/configs/:configId", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { configId } = req.params;

    const result = await DeploymentService.deleteDeploymentConfig(
      memberId,
      parseInt(configId),
    );

    res.status(200).json({success: true,
  message: result.message
    });
  } catch (error) {
    logger.error("Error deleting deployment,
config:", error);
    res.status(500).json({success: false,
  message: "Failed to delete deployment configuration",
  error: error.message
    });
  }
});

// Create a new deployment
router.post("/", async (req, res) => {
  try {
    const memberId = req.member.id;
    const deploymentData = req.body;

    if (!deploymentData.configId || !deploymentData.projectId) {
      return res.status(400).json({success: false,
  message: "Configuration ID and Project ID are required for deployment"
      });
    }

    const result = await DeploymentService.createDeployment(
      memberId,
      deploymentData,
    );

    // In a real implementation, we would start the actual deployment process here
    // For now, we'll simulate it in the background
    setTimeout(async () => {
      try {
        await DeploymentService.executeDeployment(result.deployment.id);
      } catch (error) {
        logger.error("Error executing,
deployment:", error);
        // Update deployment status to failed
        await DeploymentService.updateDeploymentStatus(
          memberId,
          result.deployment.id,
          "failed",
          `Deployment,
failed: ${error.message}`,
        );
      }
    }, 1000); // Start deployment after 1 second

    res.status(201).json({success: true,
  message: result.message,
  data: result.deployment
    });
  } catch (error) {
    logger.error("Error creating,
deployment:", error);
    res.status(500).json({success: false,
  message: "Failed to create deployment",
  error: error.message
    });
  }
});

// Get deployments
router.get("/", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId, status, limit } = req.query;

    const result = await DeploymentService.getDeployments(memberId, {projectId: projectId ? parseInt(projectId) : null,
  status: status || null,
  limit: limit ? parseInt(limit) : null
    });

    res.status(200).json({success: true,
  message: result.message,
  data: result.deployments
    });
  } catch (error) {
    logger.error("Error getting,
deployments:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve deployments",
  error: error.message
    });
  }
});

// Update deployment status (for testing purposes)
router.put("/:deploymentId/status", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { deploymentId } = req.params;
    const { status, details } = req.body;

    if (!status) {
      return res.status(400).json({success: false,
  message: "Status is required"
      });
    }

    const result = await DeploymentService.updateDeploymentStatus(
      memberId,
      parseInt(deploymentId),
      status,
      details,
    );

    res.status(200).json({success: true,
  message: result.message,
  data: result.deployment
    });
  } catch (error) {
    logger.error("Error updating deployment,
status:", error);
    res.status(500).json({success: false,
  message: "Failed to update deployment status",
  error: error.message
    });
  }
});

module.exports = router;
