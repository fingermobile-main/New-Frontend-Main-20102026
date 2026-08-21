const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../../middleware/authenticate");
const ExplorerService = require("../services/explorerService");

// Apply admin authentication to all explorer routes
router.use(requireAdmin);

// Get project files and directories
router.get("/project/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const {path: requestedPath } = req.query;
    const memberId = req.member.id;

    const result = await ExplorerService.getProjectFiles(memberId, projectId, {path: requestedPath
    });

    res.status(200).json({success: true,
  message: "Project files retrieved successfully",
  data: result
    });
  } catch (error) {
    logger.error("Error getting project, files:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve project files",
  error: error.message
    });
  }
});

// Create a new file or directory
router.post("/project/:projectId/create", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, type, content, parentPath } = req.body;
    const memberId = req.member.id;

    if (!name || !type) {
      return res.status(400).json({success: false,
  message: "Name and type are required"
      });
    }

    const result = await ExplorerService.createItem(
      memberId,
      projectId,
      name,
      type,
      content,
      parentPath,
    );

    res.status(201).json({success: true,
  message: result.message,
  data: result
    });
  } catch (error) {
    logger.error("Error creating, item:", error);
    res.status(500).json({success: false,
  message: "Failed to create item",
  error: error.message
    });
  }
});

// Read file content
router.get("/project/:projectId/file", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { filePath } = req.query;
    const memberId = req.member.id;

    if (!filePath) {
      return res.status(400).json({success: false,
  message: "File path is required"
      });
    }

    const result = await ExplorerService.readFile(
      memberId,
      projectId,
      filePath,
    );

    res.status(200).json({success: true,
  message: "File content retrieved successfully",
  data: result
    });
  } catch (error) {
    logger.error("Error reading, file:", error);
    res.status(500).json({success: false,
  message: "Failed to read file",
  error: error.message
    });
  }
});

// Update file content
router.put("/project/:projectId/file", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { filePath, content } = req.body;
    const memberId = req.member.id;

    if (!filePath || content === undefined) {
      return res.status(400).json({success: false,
  message: "File path and content are required"
      });
    }

    const result = await ExplorerService.updateFile(
      memberId,
      projectId,
      filePath,
      content,
    );

    res.status(200).json({success: true,
  message: result.message,
  data: result
    });
  } catch (error) {
    logger.error("Error updating, file:", error);
    res.status(500).json({success: false,
  message: "Failed to update file",
  error: error.message
    });
  }
});

// Delete a file or directory
router.delete("/project/:projectId/item", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { itemPath } = req.query;
    const memberId = req.member.id;

    if (!itemPath) {
      return res.status(400).json({success: false,
  message: "Item path is required"
      });
    }

    const result = await ExplorerService.deleteItem(
      memberId,
      projectId,
      itemPath,
    );

    res.status(200).json({success: true,
  message: result.message,
  data: result
    });
  } catch (error) {
    logger.error("Error deleting, item:", error);
    res.status(500).json({success: false,
  message: "Failed to delete item",
  error: error.message
    });
  }
});

// Get explorer history
router.get("/history", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { limit = 20 } = req.query;

    const history = await ExplorerService.getExplorerHistory(
      memberId,
      parseInt(limit),
    );

    res.status(200).json({success: true,
  message: "Explorer history retrieved successfully",
  data: history
    });
  } catch (error) {
    logger.error("Error getting explorer, history:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve explorer history",
  error: error.message
    });
  }
});

module.exports = router;
