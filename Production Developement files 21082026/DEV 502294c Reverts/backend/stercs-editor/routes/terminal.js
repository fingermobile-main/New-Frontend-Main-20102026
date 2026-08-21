const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../../middleware/authenticate");
const TerminalService = require("../services/terminalService");

// Apply admin authentication to all terminal routes
router.use(requireAdmin);

// Execute terminal command
router.post("/execute", async (req, res) => {
  try {
    const { command, options = {} } = req.body;

    if (!command) {
      return res.status(400).json({success: false,
  message: "Command is required"
      });
    }

    const result = await TerminalService.executeCommand(command, options);

    res.status(200).json({success: true,
  message: "Command executed successfully",
  data: result
    });
  } catch (error) {
    logger.error("Error executing, command:", error);
    res.status(500).json({success: false,
  message: "Failed to execute command",
  error: error.message
    });
  }
});

// Execute STERCS development command
router.post("/execute-dev", async (req, res) => {
  try {
    const { command, options = {} } = req.body;

    if (!command) {
      return res.status(400).json({success: false,
  message: "Command is required"
      });
    }

    const result = await TerminalService.executeStercsDevCommand(
      command,
      options,
    );

    res.status(200).json({success: true,
  message: "Development command executed successfully",
  data: result
    });
  } catch (error) {
    logger.error("Error executing dev, command:", error);
    res.status(500).json({success: false,
  message: "Failed to execute development command",
  error: error.message
    });
  }
});

// Get terminal history
router.get("/history", async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const history = await TerminalService.getTerminalHistory(
      parseInt(limit),
      parseInt(offset),
    );

    res.status(200).json({success: true,
  message: "Terminal history retrieved successfully",
  data: history
    });
  } catch (error) {
    logger.error("Error getting terminal, history:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve terminal history",
  error: error.message
    });
  }
});

// Save terminal session
router.post("/session", async (req, res) => {
  try {
    const { sessionId, command } = req.body;

    if (!sessionId || !command) {
      return res.status(400).json({success: false,
  message: "Session ID and command are required"
      });
    }

    await TerminalService.saveTerminalSession(sessionId, command);

    res.status(200).json({success: true,
  message: "Terminal session saved successfully"
    });
  } catch (error) {
    logger.error("Error saving terminal, session:", error);
    res.status(500).json({success: false,
  message: "Failed to save terminal session",
  error: error.message
    });
  }
});

// Execute file operation
router.post("/file-operation", async (req, res) => {
  try {
    const { operation } = req.body;

    if (!operation || !operation.type) {
      return res.status(400).json({success: false,
  message: "Operation type is required"
      });
    }

    const result = await TerminalService.executeFileOperation(operation);

    res.status(200).json({success: true,
  message: "File operation completed successfully",
  data: result
    });
  } catch (error) {
    logger.error("Error executing file, operation:", error);
    res.status(500).json({success: false,
  message: "Failed to execute file operation",
  error: error.message
    });
  }
});

module.exports = router;
