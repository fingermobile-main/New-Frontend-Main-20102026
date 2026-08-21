const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../../middleware/authenticate");
const PageService = require("../services/pageService");

// Apply admin authentication to all page routes
router.use(requireAdmin);

// Page routes
router.get("/", async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({success: false,
  message: "Project ID is required"
      });
    }

    const result = await PageService.getPages(projectId);

    res.status(200).json({success: true,
  data: result
    });
  } catch (error) {
    logger.error("Page retrieval, error:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve pages",
  error: error.message
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { projectId, name, content, path } = req.body;

    if (!projectId || !name) {
      return res.status(400).json({success: false,
  message: "Project ID and page name are required"
      });
    }

    const result = await PageService.createPage(projectId, name, content, path);

    res.status(201).json({success: true,
  data: result
    });
  } catch (error) {
    logger.error("Page creation, error:", error);
    res.status(500).json({success: false,
  message: "Failed to create page",
  error: error.message
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const result = await PageService.updatePage(id, updates);

    res.status(200).json({success: true,
  data: result
    });
  } catch (error) {
    logger.error("Page update, error:", error);
    res.status(500).json({success: false,
  message: "Failed to update page",
  error: error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await PageService.deletePage(id);

    res.status(200).json({success: true,
  data: result
    });
  } catch (error) {
    logger.error("Page deletion, error:", error);
    res.status(500).json({success: false,
  message: "Failed to delete page",
  error: error.message
    });
  }
});

module.exports = router;
