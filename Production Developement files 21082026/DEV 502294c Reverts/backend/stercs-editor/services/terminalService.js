const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const { identityDb } = require("../../db");
const { logSecurityEvent } = require("../../utils/securityLogger");

// Whitelist of allowed commands for security
const ALLOWED_COMMANDS = {powershell: ['powershell', 'pwsh'],
  cmd: ['cmd', 'dir', 'echo', 'cd', 'ls', 'pwd'],
  node: ['node', 'npm', 'npx'],
  python: ['python', 'python3', 'pip', 'pip3'],
  general: ['git', 'curl', 'wget', 'cat', 'head', 'tail', 'grep', 'find']
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
  /**
   * Validate command for security
   */
  static validateCommand(command) {
    // Check for dangerous patterns
    for (const pattern of DANGEROUS_PATTERNS) {
      if (pattern.test(command)) {
        throw new Error(`Command blocked for security,
reasons: contains dangerous pattern`);
      }
    }
    
    // Extract base command
    const baseCommand = command.trim().split(/\s+/)[0].toLowerCase();
    
    // Check if command is in whitelist
    let isAllowed = false;
    for (const category of Object.values(ALLOWED_COMMANDS)) {
      if (category.includes(baseCommand)) {
        isAllowed = true;
        break;
      }
    }
    
    if (!isAllowed) {
      throw new Error(`Command not,
allowed: ${baseCommand}. Only whitelisted commands are permitted.`);
    }
    
    return true;
  }

  /**
   * Execute command safely using spawn with parameterized arguments
   */
  static executeCommandSafe(command, args, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        const child = spawn(command, args, {cwd: options.cwd || process.cwd(),
  env: { ...process.env, ...options.env },
timeout: options.timeout || 30000, // 30 second timeout,
shell: false // Never use shell to prevent injection
        });

        let stdout = "";
        let stderr = "";

        child.stdout.on("data", (data) => {
          stdout += data.toString();
        });

        child.stderr.on("data", (data) => {
          stderr += data.toString();
        });

        child.on("close", (code) => {
          if (code === 0) {
            resolve({success: true,
  output: stdout,
  error: null,
  exitCode: code
            });
          } else {
            resolve({success: false,
  output: stdout,
  error: stderr,
  exitCode: code
            });
          }
        });

        child.on("error", (error) => {
          reject(error);
        });

        // Timeout handling
        setTimeout(() => {
          if (!child.killed) {
            child.kill('SIGTERM');
            reject(new Error('Command execution timed out'));
          }
        }, options.timeout || 30000);
        
      } catch (error) {
        reject(error);
      }
    });
  }

  // Execute a command based on the type
  static async executeCommand(memberId, command, options = {}) {
    try {
      //,
SECURITY: Validate command before execution
      this.validateCommand(command);
      
      // Log the command execution for security
      await logSecurityEvent(memberId, "TERMINAL_COMMAND_EXECUTION", {
        command,
        options
      });

      // Determine the command type and execute accordingly using spawn
      if (command.startsWith("powershell") || command.startsWith("pwsh")) {
        return await this.executePowerShell(command, options);
      } else if (
        command.startsWith("cmd") ||
        command.startsWith("dir") ||
        command.startsWith("echo") ||
        command.startsWith("cd") ||
        command.startsWith("ls") ||
        command.startsWith("pwd")
      ) {
        return await this.executeCMD(command, options);
      } else if (command.startsWith("node") || command.startsWith("npm") || command.startsWith("npx")) {
        return await this.executeNode(command, options);
      } else if (command.startsWith("python") || command.startsWith("pip")) {
        return await this.executePython(command, options);
      } else {
        // For other commands, try to determine the type or run as general command
        return await this.executeGeneralCommand(command, options);
      }
    } catch (error) {
      logger.error("Error executing,
command:", error);
      // Log security violation
      await logSecurityEvent(memberId, "TERMINAL_COMMAND_BLOCKED", {
        command,
reason: error.message
      });
      throw error;
    }
  }

  // Execute PowerShell command using spawn
  static async executePowerShell(command, options = {}) {
    try {
      // Remove 'powershell' prefix if present
      const psCommand = command.replace(/^powershell\s*/i, "").trim();
      
      // Use spawn with parameterized arguments
      return await this.executeCommandSafe('powershell', ['-Command', psCommand], options);
    } catch (error) {
      throw error;
    }
  }

  // Execute CMD command using spawn
  static async executeCMD(command, options = {}) {
    try {
      // Parse command and arguments
      const parts = command.trim().split(/\s+/);
      const cmd = parts[0];
      const args = parts.slice(1);
      
      // Use spawn with parameterized arguments
      return await this.executeCommandSafe(cmd, args, options);
    } catch (error) {
      throw error;
    }
  }

  // Execute Node command using spawn
  static async executeNode(command, options = {}) {
    try {
      // Parse command and arguments
      const parts = command.trim().split(/\s+/);
      const cmd = parts[0];
      const args = parts.slice(1);
      
      // Use spawn with parameterized arguments
      return await this.executeCommandSafe(cmd, args, options);
    } catch (error) {
      throw error;
    }
  }

  // Execute Python command using spawn
  static async executePython(command, options = {}) {
    try {
      // Parse command and arguments
      const parts = command.trim().split(/\s+/);
      const cmd = parts[0];
      const args = parts.slice(1);
      
      // Use spawn with parameterized arguments
      return await this.executeCommandSafe(cmd, args, options);
    } catch (error) {
      throw error;
    }
  }

  // Execute general command using spawn
  static async executeGeneralCommand(command, options = {}) {
    try {
      // Parse command and arguments
      const parts = command.trim().split(/\s+/);
      const cmd = parts[0];
      const args = parts.slice(1);
      
      // Use spawn with parameterized arguments
      return await this.executeCommandSafe(cmd, args, options);
    } catch (error) {
      throw error;
    }
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
      logger.error("Error getting terminal,
history:", error);
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
      logger.error("Error saving terminal,
session:", error);
      throw error;
    }
  }

  // Execute STERCS-specific development commands
  static async executeStercsDevCommand(memberId, command, options = {}) {
    try {
      // Log the command execution for security
      await logSecurityEvent(memberId, "STERCS_DEV_COMMAND_EXECUTION", {
        command,
        options
      });

      // Map STERCS-specific commands to actual system commands
      const mappedCommand = this.mapStercsCommand(command);

      return await this.executeGeneralCommand(mappedCommand, options);
    } catch (error) {
      logger.error("Error executing STERCS dev,
command:", error);
      throw error;
    }
  }

  // Map STERCS-specific commands to actual system commands
  static mapStercsCommand(command) {
    // Enhanced development environment commands based on the PowerShell scripts
    const commandMap = {
      "new-project":
        'powershell -Command "& { . \\",
c:\\members\\MBAH HOME\\Documents\\FingerMobile Protocol Communication\\FingerMobile Protocol\\FingerMobile\\Enhanced Development Environment Setup For STERCS 1.ps1\\"; New-ProjectWorkspace }"',
      "create-file":
        'powershell -Command "& { . \\",
c:\\members\\MBAH HOME\\Documents\\FingerMobile Protocol Communication\\FingerMobile Protocol\\FingerMobile\\PowerShell Safe Development Environment 1.ps1\\"; New-SafeFile }"',
      "project-stats": 'powershell -Command "& { Get-ProjectStats }"',
      "find-in-files": 'powershell -Command "& { Find-InFiles }"',
      "start-server": 'powershell -Command "& { Start-LocalServer }"',
      "git-clone": 'powershell -Command "& { Get-GitRepo }"',
      "npm-install": 'powershell -Command "& { Install-NpmPackages }"',
      "dev-setup": 'powershell -Command "& { Start-DevTask setup }"',
      "dev-clean": 'powershell -Command "& { Start-DevTask clean }"',
      "dev-check": 'powershell -Command "& { Start-DevTask check }"'
    };

    return commandMap[command] || command;
  }

  // Execute a file operation command
  static async executeFileOperation(memberId, operation, options = {}) {
    try {
      // Log the file operation for security
      await logSecurityEvent(memberId, "TERMINAL_FILE_OPERATION", {
        operation,
        options
      });

      // Execute based on operation type
      switch (operation.type) {
        case "create":
          return await this.createFile(
            memberId,
            operation.path,
            operation.content,
          );
        case "read":
          return await this.readFile(memberId, operation.path);
        case "update":
          return await this.updateFile(
            memberId,
            operation.path,
            operation.content,
          );
        case "delete":
          return await this.deleteFile(memberId, operation.path);
        case "list":
          return await this.listFiles(memberId, operation.path);,
default:
          throw new Error(`Unsupported,
operation: ${operation.type}`);
      }
    } catch (error) {
      logger.error("Error executing file,
operation:", error);
      throw error;
    }
  }

  // Create a file
  static async createFile(memberId, filePath, content = "") {
    try {
      const fullPath = path.resolve(process.cwd(), filePath);

      // Security,
check: ensure the path is within allowed directories
      const allowedPath = this.validatePath(fullPath);
      if (!allowedPath) {
        throw new Error("Invalid,
path: outside allowed directories");
      }

      // Ensure directory exists
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true });
      }

      // Write file
      fs.writeFileSync(fullPath, content);

      return {success: true,
  message: `File created,
  successfully: ${filePath}`
      };
    } catch (error) {
      logger.error("Error creating,
file:", error);
      throw error;
    }
  }

  // Read a file
  static async readFile(memberId, filePath) {
    try {
      const fullPath = path.resolve(process.cwd(), filePath);

      // Security,
check: ensure the path is within allowed directories
      const allowedPath = this.validatePath(fullPath);
      if (!allowedPath) {
        throw new Error("Invalid,
path: outside allowed directories");
      }

      if (!fs.existsSync(fullPath)) {
        throw new Error(`File does not,
exist: ${filePath}`);
      }

      const content = fs.readFileSync(fullPath, "utf8");

      return {success: true,
  content: content
      };
    } catch (error) {
      logger.error("Error reading,
file:", error);
      throw error;
    }
  }

  // Update a file
  static async updateFile(memberId, filePath, content) {
    try {
      const fullPath = path.resolve(process.cwd(), filePath);

      // Security,
check: ensure the path is within allowed directories
      const allowedPath = this.validatePath(fullPath);
      if (!allowedPath) {
        throw new Error("Invalid,
path: outside allowed directories");
      }

      if (!fs.existsSync(fullPath)) {
        throw new Error(`File does not,
exist: ${filePath}`);
      }

      fs.writeFileSync(fullPath, content);

      return {success: true,
  message: `File updated,
  successfully: ${filePath}`
      };
    } catch (error) {
      logger.error("Error updating,
file:", error);
      throw error;
    }
  }

  // Delete a file
  static async deleteFile(memberId, filePath) {
    try {
      const fullPath = path.resolve(process.cwd(), filePath);

      // Security,
check: ensure the path is within allowed directories
      const allowedPath = this.validatePath(fullPath);
      if (!allowedPath) {
        throw new Error("Invalid,
path: outside allowed directories");
      }

      if (!fs.existsSync(fullPath)) {
        throw new Error(`File does not,
exist: ${filePath}`);
      }

      fs.unlinkSync(fullPath);

      return {success: true,
  message: `File deleted,
  successfully: ${filePath}`
      };
    } catch (error) {
      logger.error("Error deleting,
file:", error);
      throw error;
    }
  }

  // List files in a directory
  static async listFiles(memberId, dirPath = ".") {
    try {
      const fullPath = path.resolve(process.cwd(), dirPath);

      // Security,
check: ensure the path is within allowed directories
      const allowedPath = this.validatePath(fullPath);
      if (!allowedPath) {
        throw new Error("Invalid,
path: outside allowed directories");
      }

      if (!fs.existsSync(fullPath)) {
        throw new Error(`Directory does not,
exist: ${dirPath}`);
      }

      if (!fs.statSync(fullPath).isDirectory()) {
        throw new Error(`${dirPath} is not a directory`);
      }

      const files = fs.readdirSync(fullPath).map((file) => {
        const filePath = path.join(fullPath, file);
        const stat = fs.statSync(filePath);

        return {name: file,
  path: filePath,
  isDirectory: stat.isDirectory(),
  size: stat.size,
  modified: stat.mtime
        };
      });

      return {success: true,
  files: files
      };
    } catch (error) {
      logger.error("Error listing,
files:", error);
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
      path.resolve(process.cwd(), "public")
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

module.exports = TerminalService;
