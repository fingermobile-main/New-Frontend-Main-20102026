const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { identityDb } = require('../../db');
const { logSecurityEvent } = require('../../utils/securityLogger');
const logger = require('../../utils/logger');

// Whitelist of allowed commands for security
const ALLOWED_COMMANDS = {
  powershell: ['powershell', 'pwsh'],
  cmd: ['cmd', 'dir', 'echo', 'cd', 'ls', 'pwd'],
  node: ['node', 'npm', 'npx'],
  python: ['python', 'python3', 'pip', 'pip3'],
  general: ['git', 'curl', 'wget', 'cat', 'head', 'tail', 'grep', 'find', 'ai-broadcast']
};

// Dangerous patterns to block
const DANGEROUS_PATTERNS = [
  /\brm\s+-rf\b/i,           // Recursive force delete
  /\bformat\b/i,             // Format drive
  /\bdel\s+\/f\b/i,          // Force delete
  /\bshutdown\b/i,           // Shutdown system
  /\breboot\b/i,             // Reboot system
  /\bsudo\b/i,               // Sudo escalation
  /\bchmod\s+777\b/i,        // Unsafe permissions
  /&&\s*rm\b/,               // Chained delete
  /\|.*rm\b/,                // Piped delete
  /`.*rm\b/,                 // Backtick delete
];

class TerminalService {
  // Execute command with safety checks
  static async executeCommandSafe(command, args, options = {}) {
    try {
      // Security validation
      if (!this.isAllowedCommand(command)) {
        throw new Error(`Command not allowed: ${command}`);
      }

      if (this.containsDangerousPattern([...args, command].join(' '))) {
        throw new Error('Command contains dangerous patterns');
      }

      return new Promise((resolve, reject) => {
        let output = '';
        let errorOutput = '';

        const childProcess = spawn(command, args, {
          stdio: ['pipe', 'pipe', 'pipe'],
          shell: true,
          ...options
        });

        childProcess.stdout.on('data', (data) => {
          output += data.toString();
        });

        childProcess.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });

        childProcess.on('close', (code) => {
          if (code === 0) {
            resolve({ success: true, output, error: null, exitCode: code });
          } else {
            resolve({ success: false, output, error: errorOutput, exitCode: code });
          }
        });

        childProcess.on('error', (err) => {
          reject(err);
        });
      });
    } catch (error) {
      return { success: false, output: '', error: error.message, exitCode: 1 };
    }
  }

  // Check if command is in allowed list
  static isAllowedCommand(command) {
    const cmd = command.toLowerCase();
    return Object.values(ALLOWED_COMMANDS).some(list =>
      list.some(allowedCmd =>
        cmd.includes(allowedCmd.toLowerCase())
      )
    );
  }

  // Check for dangerous patterns
  static containsDangerousPattern(command) {
    return DANGEROUS_PATTERNS.some(pattern => pattern.test(command));
  }

  // Execute AI broadcast command
  static async executeAIBroadcastCommand(memberId, command) {
    try {
      // Log the command execution for security
      await logSecurityEvent(memberId, 'AI_BROADCAST_EXECUTION', { command });

      // Parse command: ai-broadcast "Message title" "Message content" [targetGroup]
      const regex = /"([^"]+)"|'([^']+)'|(\S+)/g;
      const parts = [];
      let match;
      while ((match = regex.exec(command)) !== null) {
        parts.push(match[1] || match[2] || match[3]);
      }
      const title = parts[1] || 'System Broadcast';
      const content = parts[2] || 'This is a test broadcast from STERCS Terminal';
      const targetGroup = parts[3] || 'all_users';

      const axios = require('axios');
      const commsUrl = process.env.COMMS_SERVICE_URL || 'http://localhost:3002/api/guardian/trigger';

      await axios.post(commsUrl, {
        triggerType: 'system_event',
        triggerSource: 'STERCS_Terminal',
        messageTemplate: 'community_update',
        targetGroups: [targetGroup],
        customData: {
          title: title,
          content: content,
          type: 'notification'
        },
        priority: 'high',
        threatLevel: 'low'
      }, {
        headers: {
          'Authorization': 'Bearer GUARDIAN_INTERNAL_SECURE_TOKEN_2026',
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        output: `Broadcast sent successfully.\nTitle: ${title}\nTarget: ${targetGroup}`,
        error: null,
        exitCode: 0
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: `Failed to send broadcast: ${error.message}`,
        exitCode: 1
      };
    }
  }

  // Execute general command using spawn
  static async executeGeneralCommand(command, options = {}) {
    // Parse command and arguments
    const parts = command.trim().split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    // Use spawn with parameterized arguments
    return await this.executeCommandSafe(cmd, args, options);
  }

  // Get terminal history for a member
  static async getTerminalHistory(memberId, limit = 20, offset = 0) {
    try {
      const result = await identityDb.query(
        `SELECT * FROM terminal_sessions  
         WHERE member_id = $1  
         ORDER BY last_used DESC  
         LIMIT $2 OFFSET $3`,
        [memberId, limit, offset],
      );
      return result.rows;
    } catch (error) {
      logger.error('Error getting terminal history:', error);
      throw error;
    }
  }

  // Save terminal session
  static async saveTerminalSession(memberId, sessionId, command) {
    try {
      // Check if session exists
      const existing = await identityDb.query(
        `SELECT * FROM terminal_sessions  
         WHERE member_id = $1 AND session_id = $2`,
        [memberId, sessionId],
      );

      if (existing.rows.length > 0) {
        // Update existing session
        await identityDb.query(
          `UPDATE terminal_sessions  
           SET command_history = command_history || $1, last_used = CURRENT_TIMESTAMP 
           WHERE member_id = $2 AND session_id = $3`,
          [[command], memberId, sessionId],
        );
      } else {
        // Create new session
        await identityDb.query(
          `INSERT INTO terminal_sessions (member_id, session_id, command_history) 
           VALUES ($1, $2, $3)`,
          [memberId, sessionId, [command]],
        );
      }
    } catch (error) {
      logger.error('Error saving terminal session:', error);
      throw error;
    }
  }

  // Execute STERCS-specific development commands
  static async executeStercsDevCommand(memberId, command, options = {}) {
    try {
      // Log the command execution for security
      await logSecurityEvent(memberId, 'STERCS_DEV_COMMAND_EXECUTION', {
        command,
        options
      });

      // Map STERCS-specific commands to actual system commands
      const mappedCommand = this.mapStercsCommand(command);
      return await this.executeGeneralCommand(mappedCommand, options);
    } catch (error) {
      logger.error('Error executing STERCS dev command:', error);
      throw error;
    }
  }

  // Map STERCS-specific commands to actual system commands
  static mapStercsCommand(command) {
    // Enhanced development environment commands based on the PowerShell scripts
    const commandMap = {
      'new-project': 'powershell -Command "& { . \\"c:\\\\members\\\\MBAH HOME\\\\Documents\\\\FingerMobile Protocol Communication\\\\FingerMobile Protocol\\\\FingerMobile\\\\Enhanced Development Environment Setup For STERCS 1.ps1\\"; New-ProjectWorkspace }"',
      'create-file': 'powershell -Command "& { . \\"c:\\\\members\\\\MBAH HOME\\\\Documents\\\\FingerMobile Protocol Communication\\\\FingerMobile Protocol\\\\FingerMobile\\\\PowerShell Safe Development Environment 1.ps1\\"; New-SafeFile }"',
      'project-stats': 'powershell -Command "& { Get-ProjectStats }"',
      'find-in-files': 'powershell -Command "& { Find-InFiles }"',
      'start-server': 'powershell -Command "& { Start-LocalServer }"',
      'git-clone': 'powershell -Command "& { Get-GitRepo }"',
      'npm-install': 'powershell -Command "& { Install-NpmPackages }"',
      'dev-setup': 'powershell -Command "& { Start-DevTask setup }"',
      'dev-clean': 'powershell -Command "& { Start-DevTask clean }"',
      'dev-check': 'powershell -Command "& { Start-DevTask check }"'
    };

    return commandMap[command] || command;
  }

  /**
   * Execute a file operation command
   * @param {string} memberId - The member ID
   * @param {string} operation - The operation to perform
   * @param {Object} options - Operation options
   * @returns {Promise<Object>} Result of the operation
   */
  static async executeFileOperation(memberId, operation, options = {}) {
    try {
      // Log the file operation for security
      await logSecurityEvent(memberId, 'TERMINAL_FILE_OPERATION', {
        operation,
        options
      });

      switch (operation) {
      case 'create':
        return await this.createFile(memberId, options.filePath, options.content);
      case 'read':
        return await this.readFile(memberId, options.filePath);
      case 'update':
        return await this.updateFile(memberId, options.filePath, options.content);
      case 'delete':
        return await this.deleteFile(memberId, options.filePath);
      case 'list':
        return await this.listFiles(memberId, options.dirPath);
      default:
        return {
          success: false,
          output: '',
          error: `Unknown file operation: ${operation}`,
          exitCode: 1
        };
      }
    } catch (error) {
      logger.error('Error executing file operation:', error);
      return {
        success: false,
        output: '',
        error: error.message,
        exitCode: 1
      };
    }
  }

  /**
   * Create a new file
   * @param {string} memberId - The member ID
   * @param {string} filePath - Path of the file to create
   * @param {string} content - Content to write to the file
   * @returns {Promise<Object>} Result of the file creation
   */
  static async createFile(memberId, filePath, content = '') {
    try {
      // Validate path for security
      if (!this.validatePath(filePath)) {
        return { success: false, output: '', error: 'Invalid path specified', exitCode: 1 };
      }

      // Ensure directory exists
      const fullPath = path.resolve(__dirname, '../../../..', filePath);
      const dirPath = path.dirname(fullPath);

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Write file with security logging
      fs.writeFileSync(fullPath, content, { encoding: 'utf8' });
      await logSecurityEvent(memberId, 'TERMINAL_CREATE_FILE', { filePath });

      return {
        success: true,
        output: `File created successfully: ${filePath}`,
        error: null,
        exitCode: 0
      };
    } catch (error) {
      logger.error('Error creating file:', error);
      return {
        success: false,
        output: '',
        error: `Failed to create file: ${error.message}`,
        exitCode: 1
      };
    }
  }

  /**
   * Read a file
   * @param {string} memberId - The member ID
   * @param {string} filePath - Path of the file to read
   * @returns {Promise<Object>} Result of the file read operation
   */
  static async readFile(memberId, filePath) {
    try {
      // Validate path for security
      if (!this.validatePath(filePath)) {
        return { success: false, output: '', error: 'Invalid path specified', exitCode: 1 };
      }

      const fullPath = path.resolve(__dirname, '../../../..', filePath);

      // Check if file exists and is not a directory
      if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
        return {
          success: false,
          output: '',
          error: `File does not exist: ${filePath}`,
          exitCode: 1
        };
      }

      // Read file with security logging
      const content = fs.readFileSync(fullPath, { encoding: 'utf8' });
      await logSecurityEvent(memberId, 'TERMINAL_READ_FILE', { filePath });

      return {
        success: true,
        output: content,
        error: null,
        exitCode: 0
      };
    } catch (error) {
      logger.error('Error reading file:', error);
      return {
        success: false,
        output: '',
        error: `Failed to read file: ${error.message}`,
        exitCode: 1
      };
    }
  }

  /**
   * Update a file
   * @param {string} memberId - The member ID
   * @param {string} filePath - Path of the file to update
   * @param {string} content - New content to write to the file
   * @returns {Promise<Object>} Result of the file update
   */
  static async updateFile(memberId, filePath, content) {
    try {
      // Validate path for security
      if (!this.validatePath(filePath)) {
        return { success: false, output: '', error: 'Invalid path specified', exitCode: 1 };
      }

      const fullPath = path.resolve(__dirname, '../../../..', filePath);

      // Check if file exists
      if (!fs.existsSync(fullPath)) {
        return {
          success: false,
          output: '',
          error: `File does not exist: ${filePath}`,
          exitCode: 1
        };
      }

      // Write file with security logging
      fs.writeFileSync(fullPath, content, { encoding: 'utf8' });
      await logSecurityEvent(memberId, 'TERMINAL_UPDATE_FILE', { filePath });

      return {
        success: true,
        output: `File updated successfully: ${filePath}`,
        error: null,
        exitCode: 0
      };
    } catch (error) {
      logger.error('Error updating file:', error);
      return {
        success: false,
        output: '',
        error: `Failed to update file: ${error.message}`,
        exitCode: 1
      };
    }
  }

  /**
   * Delete a file
   * @param {string} memberId - The member ID
   * @param {string} filePath - Path of the file to delete
   * @returns {Promise<Object>} Result of the file deletion
   */
  static async deleteFile(memberId, filePath) {
    try {
      // Validate path for security
      if (!this.validatePath(filePath)) {
        return { success: false, output: '', error: 'Invalid path specified', exitCode: 1 };
      }

      const fullPath = path.resolve(__dirname, '../../../..', filePath);

      // Check if file exists and is not a directory
      if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
        return {
          success: false,
          output: '',
          error: `File does not exist: ${filePath}`,
          exitCode: 1
        };
      }

      // Delete file with security logging
      fs.unlinkSync(fullPath);
      await logSecurityEvent(memberId, 'TERMINAL_DELETE_FILE', { filePath });

      return {
        success: true,
        output: `File deleted successfully: ${filePath}`,
        error: null,
        exitCode: 0
      };
    } catch (error) {
      logger.error('Error deleting file:', error);
      return {
        success: false,
        output: '',
        error: `Failed to delete file: ${error.message}`,
        exitCode: 1
      };
    }
  }

  /**
   * List files in a directory
   * @param {string} memberId - The member ID
   * @param {string} dirPath - Directory path to list files from
   * @returns {Promise<Object>} Result of the file listing
   */
  static async listFiles(memberId, dirPath = '.') {
    try {
      // Validate path for security
      if (!this.validatePath(dirPath)) {
        return { success: false, output: '', error: 'Invalid path specified', exitCode: 1 };
      }

      const fullPath = path.resolve(__dirname, '../../../..', dirPath);

      // Check if directory exists
      if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
        return {
          success: false,
          output: '',
          error: `Directory does not exist: ${dirPath}`,
          exitCode: 1
        };
      }

      // Read directory with security logging
      const files = fs.readdirSync(fullPath);
      await logSecurityEvent(memberId, 'TERMINAL_LIST_FILES', { dirPath });

      return {
        success: true,
        output: files.join('\n'),
        error: null,
        exitCode: 0
      };
    } catch (error) {
      logger.error('Error listing files:', error);
      return {
        success: false,
        output: '',
        error: `Failed to list files: ${error.message}`,
        exitCode: 1
      };
    }
  }

  /**
   * Validate a file path for security purposes
   * @param {string} fullPath - The full path to validate
   * @returns {boolean} Whether the path is valid
   */
  static validatePath(fullPath) {
    // Prevent directory traversal attacks
    if (fullPath.includes('../') || fullPath.includes('..\\')) {
      return false;
    }

    // Additional validation can be added here
    return true;
  }
}

module.exports = TerminalService;
