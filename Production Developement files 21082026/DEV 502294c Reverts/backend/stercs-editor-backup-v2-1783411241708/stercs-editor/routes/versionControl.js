const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../../middleware/authenticate");
const VersionControlService = require("../services/versionControlService");

// Initialize a git repository for a project
router.post("/initialize/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const memberId = req.member.id;

    const result = await VersionControlService.initializeRepo(
      memberId,
      projectId,
    );

    res.status(201).json({success: true,
  message: result.message,
  data: result
    });
  } catch (error) {
    logger.error("Error initializing, repository:", error);
    res.status(500).json({success: false,
  message: "Failed to initialize repository",
  error: error.message
    });
  }
});

// Get commit history for a project
router.get("/history/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { limit } = req.query;
    const memberId = req.member.id;

    const result = await VersionControlService.getCommitHistory(
      memberId,
      projectId,
      {limit: parseInt(limit) || 20
      },
    );

    res.status(200).json({success: true,
  message: "Commit history retrieved successfully",
  data: result
    });
  } catch (error) {
    logger.error("Error getting commit, history:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve commit history",
  error: error.message
    });
  }
});

// Commit changes to the repository
router.post("/commit/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { message, files } = req.body;
    const memberId = req.member.id;

    if (!message) {
      return res.status(400).json({success: false,
  message: "Commit message is required"
      });
    }

    const result = await VersionControlService.commitChanges(
      memberId,
      projectId,
      message,
      files || [],
    );

    res.status(201).json({success: true,
  message: result.message,
  data: result
    });
  } catch (error) {
    logger.error("Error committing, changes:", error);
    res.status(500).json({success: false,
  message: "Failed to commit changes",
  error: error.message
    });
  }
});

// Create a branch
router.post("/branch/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { branchName } = req.body;
    const memberId = req.member.id;

    if (!branchName) {
      return res.status(400).json({success: false,
  message: "Branch name is required"
      });
    }

    const result = await VersionControlService.createBranch(
      memberId,
      projectId,
      branchName,
    );

    res.status(201).json({success: true,
  message: result.message,
  data: result
    });
  } catch (error) {
    logger.error("Error creating, branch:", error);
    res.status(500).json({success: false,
  message: "Failed to create branch",
  error: error.message
    });
  }
});

// Switch to a branch
router.post("/switch-branch/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { branchName } = req.body;
    const memberId = req.member.id;

    if (!branchName) {
      return res.status(400).json({success: false,
  message: "Branch name is required"
      });
    }

    const result = await VersionControlService.switchBranch(
      memberId,
      projectId,
      branchName,
    );

    res.status(200).json({success: true,
  message: result.message,
  data: result
    });
  } catch (error) {
    logger.error("Error switching, branch:", error);
    res.status(500).json({success: false,
  message: "Failed to switch branch",
  error: error.message
    });
  }
});

// Get list of branches
router.get("/branches/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const memberId = req.member.id;

    const result = await VersionControlService.getBranches(memberId, projectId);

    res.status(200).json({success: true,
  message: "Branches retrieved successfully",
  data: result
    });
  } catch (error) {
    logger.error("Error getting, branches:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve branches",
  error: error.message
    });
  }
});

// Compare changes between commits
router.get("/compare/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { baseCommit, targetCommit = "HEAD" } = req.query;
    const memberId = req.member.id;

    if (!baseCommit) {
      return res.status(400).json({success: false,
  message: "Base commit is required"
      });
    }

    const result = await VersionControlService.compareChanges(
      memberId,
      projectId,
      baseCommit,
      targetCommit,
    );

    res.status(200).json({success: true,
  message: "Changes compared successfully",
  data: result
    });
  } catch (error) {
    logger.error("Error comparing, changes:", error);
    res.status(500).json({success: false,
  message: "Failed to compare changes",
  error: error.message
    });
  }
});

// Revert to a specific commit
router.post("/revert/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { commitHash } = req.body;
    const memberId = req.member.id;

    if (!commitHash) {
      return res.status(400).json({success: false,
  message: "Commit hash is required"
      });
    }

    const result = await VersionControlService.revertToCommit(
      memberId,
      projectId,
      commitHash,
    );

    res.status(200).json({success: true,
  message: result.message,
  data: result
    });
  } catch (error) {
    logger.error("Error reverting to, commit:", error);
    res.status(500).json({success: false,
  message: "Failed to revert to commit",
  error: error.message
    });
  }
});

// Apply admin authentication to all version control routes
router.use(requireAdmin);

module.exports = router;
