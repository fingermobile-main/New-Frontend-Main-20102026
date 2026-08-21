const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../../middleware/authenticate");
const SearchService = require("../services/searchService");

// Apply admin authentication to all search routes
router.use(requireAdmin);

// Search for files by name
router.get("/files", async (req, res) => {
  const { projectId, searchTerm,
path: searchPath, type, maxDepth } = req.query;

  if (!projectId || !searchTerm) {
    return res.status(400).json({success: false,
  message: "Project ID and search term are required"
    });
  }

  const result = await SearchService.searchFilesByName(
    req.member.id,
    projectId,
    searchTerm,
    {path: searchPath,
  type,
  maxDepth: parseInt(maxDepth) || 5
    },
  );

  res.status(200).json({success: true,
  message: "File search completed successfully",
  data: result
  });
});

// Search for content within files
router.get("/content", async (req, res) => {
  const {
    projectId,
    searchTerm,
path: searchPath,
    extensions,
    maxDepth
  } = req.query;

  if (!projectId || !searchTerm) {
    return res.status(400).json({success: false,
  message: "Project ID and search term are required"
    });
  }

  const result = await SearchService.searchContent(
    req.member.id,
    projectId,
    searchTerm,
    {path: searchPath,
  extensions: extensions ? extensions.split(",") : undefined,
  maxDepth: parseInt(maxDepth) || 3
    },
  );

  res.status(200).json({success: true,
  message: "Content search completed successfully",
  data: result
  });
});

// Search for components
router.get("/components", async (req, res) => {
  const { searchTerm, category } = req.query;

  if (!searchTerm) {
    return res.status(400).json({success: false,
  message: "Search term is required"
    });
  }

  const result = await SearchService.searchComponents(
    req.member.id,
    searchTerm,
    {
      category
    },
  );

  res.status(200).json({success: true,
  message: "Component search completed successfully",
  data: result
  });
});

// Search for projects
router.get("/projects", async (req, res) => {
  const { searchTerm } = req.query;

  if (!searchTerm) {
    return res.status(400).json({success: false,
  message: "Search term is required"
    });
  }

  const result = await SearchService.searchProjects(req.member.id, searchTerm);

  res.status(200).json({success: true,
  message: "Project search completed successfully",
  data: result
  });
});

module.exports = router;
