const { identityDb } = require("../../db");
const { logSecurityEvent } = require("../../utils/securityLogger");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

class FileService {
  constructor() {
    // Configure multer for file uploads
    this.uploadDir = path.join(__dirname, "..", "uploads");
    this.ensureUploadDir();

    this.storage = multer.diskStorage({destination: (req,
  file,
  cb) => {
        cb(null,
  this.uploadDir);
      },
filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
          null,
          file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
        );
      }
    });

    this.upload = multer({storage: this.storage,
  limits: {
  fileSize: 10 * 1024 * 1024, // 10MB limit
      },
fileFilter: (req, file, cb) => {
        // Allow common file types
        const allowedTypes =
          /jpeg|jpg|png|gif|pdf|doc|docx|txt|svg|mp4|avi|mp3|wav|zip|rar|js|ts|jsx|tsx|css|scss|html|json|xml/;
        const extname = allowedTypes.test(
          path.extname(file.originalname).toLowerCase(),
        );
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
          return cb(null, true);
        } else {
          cb(new Error(", Error: File type not allowed"));
        }
      }
    });
  }

  ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, {recursive: true });
    }
  }

  // Create a new file record in the database
  static async createFileRecord(memberId, fileData) {
    try {
      const {
        projectId,
        filename,
        originalName,
        size,
        type,
path: filePath,
        folderId = null,
      } = fileData;

      const result = await identityDb.query(
        `INSERT INTO stercs_files 
         (member_id, project_id, filename, original_name, size, type, path, folder_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          memberId,
          projectId,
          filename,
          originalName,
          size,
          type,
          filePath,
          folderId
        ],
      );

      // Log security event
      await logSecurityEvent(memberId, "FILE_UPLOAD", {fileId: result.rows[0].id,
  filename: filename
      });

      return {success: true,
  file: result.rows[0],
  message: "File record created successfully"
      };
    } catch (error) {
      logger.error("Error creating file, record:", error);
      throw error;
    }
  }

  // Get files for a project
  static async getFiles(memberId, projectId, options = {}) {
    try {
      let query = `SELECT * FROM stercs_files WHERE member_id = $1 AND project_id = $2`;
      const params = [memberId, projectId];

      if (options.folderId !== undefined) {
        query += ` AND folder_id ${options.folderId === null ? "IS NULL" : "= $3"}`;
        if (options.folderId !== null) {
          params.push(options.folderId);
        }
      }

      if (options.type) {
        query += ` AND type = $${params.length + 1}`;
        params.push(options.type);
      }

      if (options.search) {
        query += ` AND (original_name ILIKE $${params.length + 1} OR filename ILIKE $${params.length + 1})`;
        params.push(`%${options.search}%`);
      }

      query += ` ORDER BY created_at DESC`;

      if (options.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }

      const result = await identityDb.query(query, params);

      return {success: true,
  files: result.rows,
  message: "Files retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting, files:", error);
      throw error;
    }
  }

  // Get file by ID
  static async getFileById(memberId, fileId) {
    try {
      const result = await identityDb.query(
        `SELECT * FROM stercs_files WHERE id = $1 AND member_id = $2`,
        [fileId, memberId],
      );

      if (result.rows.length === 0) {
        throw new Error("File not found or not owned by member");
      }

      return {success: true,
  file: result.rows[0],
  message: "File retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting file by, ID:", error);
      throw error;
    }
  }

  // Delete a file record and the physical file
  static async deleteFile(memberId, fileId) {
    try {
      // Get file info to delete physical file
      const fileResult = await identityDb.query(
        `SELECT * FROM stercs_files WHERE id = $1 AND member_id = $2`,
        [fileId, memberId],
      );

      if (fileResult.rows.length === 0) {
        throw new Error("File not found or not owned by member");
      }

      const file = fileResult.rows[0];

      // Delete the physical file
      const filePath = path.join(__dirname, "..", file.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Delete the record from database
      await identityDb.query(`DELETE FROM stercs_files WHERE id = $1`, [
        fileId
      ]);

      // Log security event
      await logSecurityEvent(memberId, "FILE_DELETE", {fileId: fileId,
  filename: file.original_name
      });

      return {success: true,
  message: "File deleted successfully"
      };
    } catch (error) {
      logger.error("Error deleting, file:", error);
      throw error;
    }
  }

  // Create a folder
  static async createFolder(memberId, folderData) {
    try {
      const { name, projectId, parentId = null } = folderData;

      if (!name || !projectId) {
        throw new Error("Folder name and project ID are required");
      }

      const result = await identityDb.query(
        `INSERT INTO stercs_folders 
         (member_id, project_id, name, parent_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [memberId, projectId, name, parentId],
      );

      // Log security event
      await logSecurityEvent(memberId, "FOLDER_CREATE", {folderId: result.rows[0].id,
  folderName: name
      });

      return {success: true,
  folder: result.rows[0],
  message: "Folder created successfully"
      };
    } catch (error) {
      logger.error("Error creating, folder:", error);
      throw error;
    }
  }

  // Get folders for a project
  static async getFolders(memberId, projectId, parentId = null) {
    try {
      let query = `SELECT * FROM stercs_folders WHERE member_id = $1 AND project_id = $2`;
      const params = [memberId, projectId];

      if (parentId !== null) {
        query += ` AND parent_id = $3`;
        params.push(parentId);
      } else {
        query += ` AND parent_id IS NULL`;
      }

      query += ` ORDER BY created_at DESC`;

      const result = await identityDb.query(query, params);

      return {success: true,
  folders: result.rows,
  message: "Folders retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting, folders:", error);
      throw error;
    }
  }

  // Get file statistics
  static async getFileStats(memberId, projectId) {
    try {
      const result = await identityDb.query(
        `SELECT 
          COUNT(*) as total_files,
          SUM(size) as total_size,
          COUNT(CASE WHEN type LIKE 'image/%' THEN 1 END) as image_count,
          COUNT(CASE WHEN type LIKE 'video/%' THEN 1 END) as video_count,
          COUNT(CASE WHEN type LIKE 'audio/%' THEN 1 END) as audio_count,
          COUNT(CASE WHEN type = 'application/pdf' THEN 1 END) as pdf_count
        FROM stercs_files 
        WHERE member_id = $1 AND project_id = $2`,
        [memberId, projectId],
      );

      return {success: true,
  stats: result.rows[0],
  message: "File statistics retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting file, stats:", error);
      throw error;
    }
  }
}

module.exports = FileService;
