const logger = require('../../utils/logger');
const { identityDb } = require('../../db');
const fs = require('fs');
const path = require('path');
const { logSecurityEvent } = require('../../utils/securityLogger');

class ExplorerService {
  // Get project files and directories
  static async getProjectFiles(memberId, projectId, options = {}) {
    try {
      // Verify member has access to project
      const projectResult = await identityDb.query(
        'SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2',
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error('Project not found or not owned by member');
      }

      // Get path from options, default to project root
      const projectPath = options.path || `./projects/${projectId}`;
      const fullPath = path.resolve(process.cwd(), projectPath);

      // Security check: ensure the path is within allowed directories
      if (!this.validatePath(fullPath)) {
        throw new Error('Invalid, path: outside allowed directories');
      }

      // Check if path exists
      if (!fs.existsSync(fullPath)) {
        // Create project directory if it doesn't exist
        fs.mkdirSync(fullPath, {recursive: true });
      }

      // Read directory contents
      const items = fs.readdirSync(fullPath).map((item) => {
        const itemPath = path.join(fullPath, item);
        const stat = fs.statSync(itemPath);

        return {name: item,
          path: path.relative(path.resolve(process.cwd()),
            itemPath),
          isDirectory: stat.isDirectory(),
          size: stat.size,
          modified: stat.mtime,
          created: stat.birthtime
        };
      });

      // Save to explorer history
      await this.saveExplorerHistory(memberId, fullPath);

      return {path: fullPath,
        items: items,
        project: projectResult.rows[0]
      };
    } catch (error) {
      logger.error('Error getting project files:', error);
      throw error;
    }
  }

  // Create a new file or directory
  static async createItem(
    memberId,
    projectId,
    name,
    type,
    content = '',
    parentPath = null,
  ) {
    try {
      // Verify member has access to project
      const projectResult = await identityDb.query(
        'SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2',
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error('Project not found or not owned by member');
      }

      // Build path
      const basePath = parentPath
        ? path.resolve(process.cwd(), parentPath)
        : path.resolve(process.cwd(), `./projects/${projectId}`);

      // Security check: ensure the path is within allowed directories
      if (!this.validatePath(basePath)) {
        throw new Error('Invalid, path: outside allowed directories');
      }

      const itemPath = path.join(basePath, name);

      // Security check: ensure the new path is also within allowed directories
      if (!this.validatePath(itemPath)) {
        throw new Error('Invalid, path: outside allowed directories');
      }

      if (type === 'directory') {
        fs.mkdirSync(itemPath, {recursive: true });
      } else if (type === 'file') {
        fs.writeFileSync(itemPath, content, 'utf8');
      } else {
        throw new Error('Invalid type: must be "directory" or "file"');
      }

      // Log security event
      await logSecurityEvent(memberId, 'EXPLORER_CREATE_ITEM', {
        projectId,
        name,
        type,
        path: itemPath
      });

      return {success: true,
        path: itemPath,
        message: `${type} created successfully`
      };
    } catch (error) {
      logger.error('Error creating item:', error);
      throw error;
    }
  }

  // Read file content
  static async readFile(memberId, projectId, filePath) {
    try {
      // Verify member has access to project
      const projectResult = await identityDb.query(
        'SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2',
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error('Project not found or not owned by member');
      }

      const fullPath = path.resolve(process.cwd(), filePath);

      // Security check: ensure the path is within allowed directories
      if (!this.validatePath(fullPath)) {
        throw new Error('Invalid, path: outside allowed directories');
      }

      if (!fs.existsSync(fullPath)) {
        throw new Error('File does not exist');
      }

      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        throw new Error('Path is a directory, not a file');
      }

      const content = fs.readFileSync(fullPath, 'utf8');

      // Log security event
      await logSecurityEvent(memberId, 'EXPLORER_READ_FILE', {
        projectId,
        filePath
      });

      return {
        content,
        path: fullPath,
        size: stat.size,
        modified: stat.mtime
      };
    } catch (error) {
      logger.error('Error reading file:', error);
      throw error;
    }
  }

  // Update file content
  static async updateFile(memberId, projectId, filePath, content) {
    try {
      // Verify member has access to project
      const projectResult = await identityDb.query(
        'SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2',
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error('Project not found or not owned by member');
      }

      const fullPath = path.resolve(process.cwd(), filePath);

      // Security check: ensure the path is within allowed directories
      if (!this.validatePath(fullPath)) {
        throw new Error('Invalid, path: outside allowed directories');
      }

      if (!fs.existsSync(fullPath)) {
        throw new Error('File does not exist');
      }

      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        throw new Error('Path is a directory, not a file');
      }

      fs.writeFileSync(fullPath, content, 'utf8');

      // Log security event
      await logSecurityEvent(memberId, 'EXPLORER_UPDATE_FILE', {
        projectId,
        filePath
      });

      return {success: true,
        path: fullPath,
        message: 'File updated successfully'
      };
    } catch (error) {
      logger.error('Error updating file:', error);
      throw error;
    }
  }

  // Delete a file or directory
  static async deleteItem(memberId, projectId, itemPath) {
    try {
      // Verify member has access to project
      const projectResult = await identityDb.query(
        'SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2',
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error('Project not found or not owned by member');
      }

      const fullPath = path.resolve(process.cwd(), itemPath);

      // Security check: ensure the path is within allowed directories
      if (!this.validatePath(fullPath)) {
        throw new Error('Invalid, path: outside allowed directories');
      }

      if (!fs.existsSync(fullPath)) {
        throw new Error('Item does not exist');
      }

      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        // For directories, remove recursively
        fs.rmSync(fullPath, {recursive: true,
          force: true });
      } else {
        // For files, remove directly
        fs.unlinkSync(fullPath);
      }

      // Log security event
      await logSecurityEvent(memberId, 'EXPLORER_DELETE_ITEM', {
        projectId,
        itemPath
      });

      return {success: true,
        path: fullPath,
        message: 'Item deleted successfully'
      };
    } catch (error) {
      logger.error('Error deleting item:', error);
      throw error;
    }
  }

  // Save explorer history
  static async saveExplorerHistory(memberId, path) {
    try {
      await identityDb.query(
        'INSERT INTO explorer_history (member_id, path) VALUES ($1, $2)',
        [memberId, path],
      );
    } catch (error) {
      logger.error('Error saving explorer history:', error);
      throw error;
    }
  }

  // Get explorer history for a member
  static async getExplorerHistory(memberId, limit = 20) {
    try {
      const result = await identityDb.query(
        `SELECT * FROM explorer_history 
         WHERE member_id = $1 
         ORDER BY timestamp DESC 
         LIMIT $2`,
        [memberId, limit],
      );

      return result.rows;
    } catch (error) {
      logger.error('Error getting explorer history:', error);
      throw error;
    }
  }

  // Validate that a path is within allowed directories
  static validatePath(fullPath) {
    // Define allowed base directories (for security)
    const allowedBaseDirs = [
      path.resolve(process.cwd()),
      path.resolve(process.cwd(), 'stercs-editor'),
      path.resolve(process.cwd(), 'backend'),
      path.resolve(process.cwd(), 'frontend'),
      path.resolve(process.cwd(), 'public'),
      path.resolve(process.cwd(), 'projects')
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

module.exports = ExplorerService;
