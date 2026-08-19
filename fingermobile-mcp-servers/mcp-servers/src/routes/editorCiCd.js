const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const fs = require("fs").promises;
const path = require("path");
const { spawn } = require("child_process"); // ⚠️ SECURITY,
FIX: Replaced exec with spawn to prevent command injection

// Utility function to execute shell commands safely using spawn
// ⚠️,
SECURITY: Never use exec/execSync with user input - always use spawn with parameterized arguments
const executeCommand = (command, args = [], options = {}) => {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, args, {cwd: options.cwd || process.cwd(),
  env: { ...process.env, ...options.env },
shell: false, // ⚠️,
SECURITY: Prevent command injection,
timeout: options.timeout || 60000 // 60 second timeout
    });
    
    let stdout = '';
    let stderr = '';

    childProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    childProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject({error: new Error(`Process exited with code ${code}`), stdout, stderr });
      }
    });

    childProcess.on('error', (error) => {
      reject({ error, stdout, stderr });
    });
  });
};

// Route to create a new folder for a repository
router.post(
  "/create-folder",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  async (req, res) => {
    const { folderName } = req.body;
    const folderPath = path.join(
      process.env.REPOSITORIES_BASE_PATH || "/app/repositories",
      folderName,
    );

    try {
      await fs.mkdir(folderPath, {recursive: true });
      res
        .status(200)
        .json({message: `Folder ${folderName} created successfully.` });
    } catch (error) {
      res
        .status(500)
        .json({message: "Failed to create folder",
  error: error.message });
    }
  },
);

// Route to set up a new Git repository (clone)
router.post(
  "/setup-repository",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  async (req, res) => {
    const { repositoryUrl, folderName } = req.body;
    const folderPath = path.join(
      process.env.REPOSITORIES_BASE_PATH || "/app/repositories",
      folderName,
    );

    try {
      // Ensure folder exists
      await fs.mkdir(folderPath, {recursive: true });

      // Clone the repository - ⚠️,
SECURITY: Using spawn with parameterized args prevents command injection
      const { stdout, stderr } = await executeCommand(
        'git',
        ['clone', repositoryUrl, '.'],
        {cwd: folderPath },
      );
      res
        .status(200)
        .json({message: `Repository ${repositoryUrl} cloned successfully into ${folderName}.`,
          stdout,
          stderr
        });
    } catch (error) {
      res
        .status(500)
        .json({message: "Failed to set up repository",
  error: error.error.message,
  stdout: error.stdout,
  stderr: error.stderr
        });
    }
  },
);

// Route to pull latest changes from a Git repository
router.post(
  "/pull-repository",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  async (req, res) => {
    const { folderName } = req.body;
    const folderPath = path.join(
      process.env.REPOSITORIES_BASE_PATH || "/app/repositories",
      folderName,
    );

    try {
      const { stdout, stderr } = await executeCommand('git', ['pull'], {cwd: folderPath
      });
      res
        .status(200)
        .json({message: `Pulled latest changes for ${folderName}.`,
          stdout,
          stderr
        });
    } catch (error) {
      res
        .status(500)
        .json({message: "Failed to pull repository",
  error: error.error.message,
  stdout: error.stdout,
  stderr: error.stderr
        });
    }
  },
);

// Route to push changes to a Git repository
router.post(
  "/push-repository",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  async (req, res) => {
    const { folderName } = req.body;
    const folderPath = path.join(
      process.env.REPOSITORIES_BASE_PATH || "/app/repositories",
      folderName,
    );

    try {
      const { stdout, stderr } = await executeCommand('git', ['push'], {cwd: folderPath
      });
      res
        .status(200)
        .json({message: `Pushed changes for ${folderName}.`, stdout, stderr });
    } catch (error) {
      res
        .status(500)
        .json({message: "Failed to push repository",
  error: error.error.message,
  stdout: error.stdout,
  stderr: error.stderr
        });
    }
  },
);

// Route to update data store and branch permissions (placeholder)
router.post(
  "/update-permissions",
  authenticateToken,
  authorizeRoles(["admin"]),
  async (req, res) => {
    const { folderName, permissions } = req.body;
    // In a real application, this would interact with a permission management system
    res
      .status(200)
      .json({message: `Permissions for ${folderName} updated (placeholder).`,
        permissions
      });
  },
);

// Route to list files and directories in a repository folder
router.get(
  "/list-files/:folderName/*",
  authenticateToken,
  authorizeRoles(["admin", "editor", "member"]),
  async (req, res) => {
    const { folderName } = req.params;
    const subPath = req.params[0] || ""; // Capture the rest of the path
    const targetPath = path.join(
      process.env.REPOSITORIES_BASE_PATH || "/app/repositories",
      folderName,
      subPath,
    );

    try {
      const entries = await fs.readdir(targetPath, {withFileTypes: true });
      const files = entries
        .filter((dirent) => dirent.isFile())
        .map((dirent) => dirent.name);
      const directories = entries
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
      res.status(200).json({ files, directories });
    } catch (error) {
      res
        .status(500)
        .json({message: "Failed to list files",
  error: error.message });
    }
  },
);

// Route to read file content from a repository
router.get(
  "/read-file/:folderName/*",
  authenticateToken,
  authorizeRoles(["admin", "editor", "member"]),
  async (req, res) => {
    const { folderName } = req.params;
    const filePath = req.params[0]; // Capture the rest of the path
    const targetPath = path.join(
      process.env.REPOSITORIES_BASE_PATH || "/app/repositories",
      folderName,
      filePath,
    );

    try {
      const content = await fs.readFile(targetPath, "utf8");
      res.status(200).json({ content });
    } catch (error) {
      res
        .status(500)
        .json({message: "Failed to read file",
  error: error.message });
    }
  },
);

// Route to write file content to a repository
router.post(
  "/write-file/:folderName/*",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  async (req, res) => {
    const { folderName } = req.params;
    const filePath = req.params[0]; // Capture the rest of the path
    const { content } = req.body;
    const targetPath = path.join(
      process.env.REPOSITORIES_BASE_PATH || "/app/repositories",
      folderName,
      filePath,
    );

    try {
      // Ensure directory exists
      await fs.mkdir(path.dirname(targetPath), {recursive: true });
      await fs.writeFile(targetPath, content, "utf8");
      res
        .status(200)
        .json({message: `File ${filePath} written successfully.` });
    } catch (error) {
      res
        .status(500)
        .json({message: "Failed to write file",
  error: error.message });
    }
  },
);

module.exports = router;
