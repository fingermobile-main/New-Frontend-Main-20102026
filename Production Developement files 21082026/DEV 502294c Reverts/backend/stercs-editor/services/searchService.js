const { identityDb } = require("../../db");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { logSecurityEvent } = require("../../utils/securityLogger");

// Promisify fs functions for async usage
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

class SearchService {
  // Search for files by name
  static async searchFilesByName(
    memberId,
    projectId,
    searchTerm,
    options = {},
  ) {
    try {
      // Verify member has access to project
      const projectResult = await identityDb.query(
        `SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error("Project not found or not owned by member");
      }

      // Get search path (default to project root)
      const searchPath =
        options.path || path.resolve(process.cwd(), `./projects/${projectId}`);

      // Security, check: ensure the path is within allowed directories
      if (!this.validatePath(searchPath)) {
        throw new Error("Invalid, path: outside allowed directories");
      }

      if (!fs.existsSync(searchPath)) {
        return {results: [],
  path: searchPath };
      }

      const results = [];
      const maxDepth = options.maxDepth || 5; // Limit search depth to prevent performance issues

      await this.searchInDirectory(
        searchPath,
        searchTerm,
        results,
        0,
        maxDepth,
        options.type,
      );

      // Log security event
      await logSecurityEvent(memberId, "SEARCH_FILES_BY_NAME", {
        projectId,
        searchTerm,
resultsCount: results.length
      });

      return {
        results,
path: searchPath,
        searchTerm
      };
    } catch (error) {
      logger.error("Error searching files by, name:", error);
      throw error;
    }
  }

  // Search for content within files
  static async searchContent(memberId, projectId, searchTerm, options = {}) {
    try {
      // Verify member has access to project
      const projectResult = await identityDb.query(
        `SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error("Project not found or not owned by member");
      }

      // Get search path (default to project root)
      const searchPath =
        options.path || path.resolve(process.cwd(), `./projects/${projectId}`);

      // Security, check: ensure the path is within allowed directories
      if (!this.validatePath(searchPath)) {
        throw new Error("Invalid, path: outside allowed directories");
      }

      if (!fs.existsSync(searchPath)) {
        return {results: [],
  path: searchPath };
      }

      const results = [];
      const maxDepth = options.maxDepth || 3; // Limit search depth for performance
      const fileExtensions = options.extensions || [
        ".js",
        ".ts",
        ".jsx",
        ".tsx",
        ".html",
        ".css",
        ".scss",
        ".json",
        ".md"
      ];

      await this.searchContentInDirectory(
        searchPath,
        searchTerm,
        results,
        0,
        maxDepth,
        fileExtensions,
      );

      // Log security event
      await logSecurityEvent(memberId, "SEARCH_CONTENT", {
        projectId,
        searchTerm,
resultsCount: results.length
      });

      return {
        results,
path: searchPath,
        searchTerm
      };
    } catch (error) {
      logger.error("Error searching, content:", error);
      throw error;
    }
  }

  // Search in a directory recursively (for file names)
  static async searchInDirectory(
    dirPath,
    searchTerm,
    results,
    currentDepth,
    maxDepth,
    fileType = null,
  ) {;
    if (currentDepth >= maxDepth) return;

    try {
      const items = await readdir(dirPath);

      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const itemStat = await stat(itemPath);

        // Check if item matches the search term
        if (item.toLowerCase().includes(searchTerm.toLowerCase())) {
          if (
            !fileType ||
            (fileType === "directory" && itemStat.isDirectory()) ||
            (fileType === "file" && itemStat.isFile())
          ) {
            results.push({name: item,
  path: itemPath,
  type: itemStat.isDirectory() ? "directory" : "file",
  size: itemStat.size,
  modified: itemStat.mtime
            });
          }
        }

        // If it's a directory, search inside it
        if (itemStat.isDirectory()) {
          await this.searchInDirectory(
            itemPath,
            searchTerm,
            results,
            currentDepth + 1,
            maxDepth,
            fileType,
          );
        }
      }
    } catch (error) {
      // Ignore errors for directories we can't read
      logger.warn(`Could not read,
directory: ${dirPath}`, error.message);
    }
  }

  // Search content in a directory recursively
  static async searchContentInDirectory(
    dirPath,
    searchTerm,
    results,
    currentDepth,
    maxDepth,
    fileExtensions,
  ) {
    if (currentDepth >= maxDepth) return;

    try {
      const items = await readdir(dirPath);

      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const itemStat = await stat(itemPath);

        // If it's a file with a matching extension, search its content
        if (
          itemStat.isFile() &&
          fileExtensions.some((ext) => item.endsWith(ext))
        ) {
          try {
            const content = fs.readFileSync(itemPath, "utf8");
            const lines = content.split("\n");
            const matches = [];

            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              if (line.toLowerCase().includes(searchTerm.toLowerCase())) {
                matches.push({lineNumber: i + 1,
  content: line.trim(),
  context: this.getContext(lines,
  i)
                });
              }
            }

            if (matches.length > 0) {
              results.push({name: item,
  path: itemPath,
  type: "file",
  size: itemStat.size,
  modified: itemStat.mtime,
  matches
              });
            }
          } catch (error) {
            // Ignore errors for files we can't read
            logger.warn(`Could not read,
file: ${itemPath}`, error.message);
          }
        }

        // If it's a directory, search inside it
        if (itemStat.isDirectory()) {
          await this.searchContentInDirectory(
            itemPath,
            searchTerm,
            results,
            currentDepth + 1,
            maxDepth,
            fileExtensions,
          );
        }
      }
    } catch (error) {
      // Ignore errors for directories we can't read
      logger.warn(`Could not read,
directory: ${dirPath}`, error.message);
    }
  }

  // Get context around a matched line
  static getContext(lines, index, contextSize = 2) {
    const start = Math.max(0, index - contextSize);
    const end = Math.min(lines.length - 1, index + contextSize);

    const context = [];
    for (let i = start; i <= end; i++) {
      context.push({lineNumber: i + 1,
  content: lines[i],
  isMatch: i === index
      });
    }

    return context;
  }

  // Search for components by name
  static async searchComponents(memberId, searchTerm, options = {}) {
    try {
      // Search for available components in the database
      let query = `SELECT * FROM stercs_components WHERE is_active = TRUE AND name ILIKE $1`;
      const params = [`%${searchTerm}%`];

      if (options.category) {
        query += ` AND category = $2`;
        params.push(options.category);
      }

      query += ` ORDER BY name LIMIT 20`;

      const result = await identityDb.query(query, params);

      // Log security event
      await logSecurityEvent(memberId, "SEARCH_COMPONENTS", {
        searchTerm,
resultsCount: result.rows.length
      });

      return {results: result.rows,
  searchTerm
      };
    } catch (error) {
      logger.error("Error searching, components:", error);
      throw error;
    }
  }

  // Search for projects by name or description
  static async searchProjects(memberId, searchTerm) {
    try {
      const query = `
        SELECT id, name, description, project_type, theme, created_at, updated_at
        FROM stercs_projects
        WHERE member_id = $1 
        AND (name ILIKE $2 OR description ILIKE $2)
        ORDER BY updated_at DESC
      `;

      const result = await identityDb.query(query, [
        memberId,
        `%${searchTerm}%`
      ]);

      // Log security event
      await logSecurityEvent(memberId, "SEARCH_PROJECTS", {
        searchTerm,
resultsCount: result.rows.length
      });

      return {results: result.rows,
  searchTerm
      };
    } catch (error) {
      logger.error("Error searching, projects:", error);
      throw error;
    }
  }

  // Validate that a path is within allowed directories
  static validatePath(fullPath) {
    // Define allowed base directories (for security)
    const allowedBaseDirs = [
      path.resolve(process.cwd()),
      path.resolve(process.cwd(), "stercs-editor"),
      path.resolve(process.cwd(), "backend"),
      path.resolve(process.cwd(), "frontend"),
      path.resolve(process.cwd(), "public"),
      path.resolve(process.cwd(), "projects")
    ];

    // Normalize paths for comparison
    const normalizedPath = path.resolve(fullPath);

    // Check if the path is within any of the allowed base directories
    for (const baseDir of allowedBaseDirs) {
      if (normalizedPath.startsWith(baseDir)) {
        return true;
      }
    }

    return false;
  }
}

module.exports = SearchService;
