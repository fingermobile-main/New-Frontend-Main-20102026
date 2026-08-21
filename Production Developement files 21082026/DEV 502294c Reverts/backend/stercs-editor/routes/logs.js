const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../../middleware/authenticate");
const LogService = require("../services/logService");

// Apply admin authentication to all log routes
router.use(requireAdmin);

// Create a new log entry
router.post("/", async (req, res) => {
  try {
    const memberId = req.member.id;
    const logData = req.body;

    if (!logData.projectId || !logData.action) {
      return res.status(400).json({success: false,
  message: "Project ID and action are required for log entry"
      });
    }

    const result = await LogService.createLogEntry(memberId, logData);

    res.status(201).json({success: true,
  message: result.message,
  data: result.log
    });
  } catch (error) {
    logger.error("Error creating log, entry:", error);
    res.status(500).json({success: false,
  message: "Failed to create log entry",
  error: error.message
    });
  }
});

// Get logs for the authenticated member
router.get("/", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId, level, category, action, startDate, endDate, limit } =
      req.query;

    const result = await LogService.getLogs(memberId, {projectId: projectId ? parseInt(projectId) : null,
  level: level || null,
  category: category || null,
  action: action || null,
  startDate: startDate || null,
  endDate: endDate || null,
  limit: limit ? parseInt(limit) : null
    });

    res.status(200).json({success: true,
  message: result.message,
  data: result.logs
    });
  } catch (error) {
    logger.error("Error getting, logs:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve logs",
  error: error.message
    });
  }
});

// Get project logs (for admins)
router.get("/project/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { level, category, action, startDate, endDate, limit } = req.query;

    const result = await LogService.getProjectLogs(parseInt(projectId), {level: level || null,
  category: category || null,
  action: action || null,
  startDate: startDate || null,
  endDate: endDate || null,
  limit: limit ? parseInt(limit) : null
    });

    res.status(200).json({success: true,
  message: result.message,
  data: result.logs
    });
  } catch (error) {
    logger.error("Error getting project, logs:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve project logs",
  error: error.message
    });
  }
});

// Get log statistics
router.get("/stats", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId, startDate, endDate } = req.query;

    const result = await LogService.getLogStats(memberId, {projectId: projectId ? parseInt(projectId) : null,
  startDate: startDate || null,
  endDate: endDate || null
    });

    res.status(200).json({success: true,
  message: result.message,
  data: result.stats
    });
  } catch (error) {
    logger.error("Error getting log, stats:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve log statistics",
  error: error.message
    });
  }
});

module.exports = router;
