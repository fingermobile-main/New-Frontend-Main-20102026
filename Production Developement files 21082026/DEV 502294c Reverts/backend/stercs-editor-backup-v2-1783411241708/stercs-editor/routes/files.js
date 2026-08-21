const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../../middleware/authenticate");
const FileService = require("../services/fileService");

// Apply admin authentication to all file routes
router.use(requireAdmin);

// Initialize multer upload middleware
const fileService = new FileService();

// Upload a file
router.post("/upload", fileService.upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({success: false,
  message: "No file uploaded"
      });
    }

    const memberId = req.member.id;
    const { projectId, folderId } = req.body;

    if (!projectId) {
      return res.status(400).json({success: false,
  message: "Project ID is required"
      });
    }

    // Create file record in the database
    const fileData = {projectId: parseInt(projectId),
  filename: req.file.filename,
  originalName: req.file.originalname,
  size: req.file.size,
  type: req.file.mimetype,
  path: req.file.path,
  folderId: folderId ? parseInt(folderId) : null
    };

    const result = await FileService.createFileRecord(memberId, fileData);

    res.status(201).json({success: true,
  message: result.message,
  data: result.file
    });
  } catch (error) {
    logger.error("Error uploading,
file:", error);
    res.status(500).json({success: false,
  message: "Failed to upload file",
  error: error.message
    });
  }
});

// Get files for a project
router.get("/", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId, folderId, type, search, limit } = req.query;

    if (!projectId) {
      return res.status(400).json({success: false,
  message: "Project ID is required"
      });
    }

    const result = await FileService.getFiles(memberId, parseInt(projectId), {folderId:
        folderId !== undefined
          ? folderId === "null"
            ?,
  null
            : parseInt(folderId)
          : undefined,
  type: type || null,
  search: search || null,
  limit: limit ? parseInt(limit) : null
    });

    res.status(200).json({success: true,
  message: result.message,
  data: result.files
    });
  } catch (error) {
    logger.error("Error getting,
files:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve files",
  error: error.message
    });
  }
});

// Get a specific file by ID
router.get("/:fileId", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { fileId } = req.params;

    const result = await FileService.getFileById(memberId, parseInt(fileId));

    res.status(200).json({success: true,
  message: result.message,
  data: result.file
    });
  } catch (error) {
    logger.error("Error getting,
file:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve file",
  error: error.message
    });
  }
});

// Delete a file
router.delete("/:fileId", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { fileId } = req.params;

    const result = await FileService.deleteFile(memberId, parseInt(fileId));

    res.status(200).json({success: true,
  message: result.message
    });
  } catch (error) {
    logger.error("Error deleting,
file:", error);
    res.status(500).json({success: false,
  message: "Failed to delete file",
  error: error.message
    });
  }
});

// Create a folder
router.post("/folders", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { name, projectId, parentId } = req.body;

    if (!name || !projectId) {
      return res.status(400).json({success: false,
  message: "Folder name and project ID are required"
      });
    }

    const folderData = {
      name,
projectId: parseInt(projectId),
parentId: parentId ? parseInt(parentId) : null
    };

    const result = await FileService.createFolder(memberId, folderData);

    res.status(201).json({success: true,
  message: result.message,
  data: result.folder
    });
  } catch (error) {
    logger.error("Error creating,
folder:", error);
    res.status(500).json({success: false,
  message: "Failed to create folder",
  error: error.message
    });
  }
});

// Get folders for a project
router.get("/folders", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId, parentId } = req.query;

    if (!projectId) {
      return res.status(400).json({success: false,
  message: "Project ID is required"
      });
    }

    const result = await FileService.getFolders(
      memberId,
      parseInt(projectId),
      parentId !== undefined
        ? parentId === "null"
          ?,
null
          : parseInt(parentId)
        : null,
    );

    res.status(200).json({success: true,
  message: result.message,
  data: result.folders
    });
  } catch (error) {
    logger.error("Error getting,
folders:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve folders",
  error: error.message
    });
  }
});

// Get file statistics
router.get("/stats/:projectId", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId } = req.params;

    const result = await FileService.getFileStats(
      memberId,
      parseInt(projectId),
    );

    res.status(200).json({success: true,
  message: result.message,
  data: result.stats
    });
  } catch (error) {
    logger.error("Error getting file,
stats:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve file statistics",
  error: error.message
    });
  }
});

module.exports = router;
