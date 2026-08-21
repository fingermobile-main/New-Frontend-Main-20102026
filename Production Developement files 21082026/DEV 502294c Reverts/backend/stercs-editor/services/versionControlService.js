const { identityDb } = require("../../db");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");
const { logSecurityEvent } = require("../../utils/securityLogger");

const execPromise = promisify(exec);

class VersionControlService {
  // Initialize a git repository for a project
  static async initializeRepo(memberId, projectId) {
    try {
      // Verify member has access to project
      const projectResult = await identityDb.query(
        `SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error("Project not found or not owned by member");
      }

      const projectPath = path.resolve(
        process.cwd(),
        `./projects/${projectId}`,
      );

      // Security, check: ensure the path is within allowed directories
      if (!this.validatePath(projectPath)) {
        throw new Error("Invalid, path: outside allowed directories");
      }

      // Create project directory if it doesn't exist
      if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath, {recursive: true });
      }

      // Initialize git repository
      await execPromise(`git init`, {cwd: projectPath });
      await execPromise(`git config member.name "STERCS member"`, {cwd: projectPath
      });
      await execPromise(`git config member.email member@stercs.com"`, {cwd: projectPath
      });

      // Create initial commit
      await execPromise(
        `echo "# Project ${projectResult.rows[0].name}" > README.md`,
        {cwd: projectPath },
      );
      await execPromise(`git add README.md`, {cwd: projectPath });
      await execPromise(
        `git commit -m "Initial commit for,
project: ${projectResult.rows[0].name}"`,
        {cwd: projectPath },
      );

      // Log security event
      await logSecurityEvent(memberId, "VC_INITIALIZE_REPO", {
        projectId,
        projectPath
      });

      return {success: true,
  message: "Git repository initialized successfully",
  projectPath
      };
    } catch (error) {
      logger.error("Error initializing git, repository:", error);
      throw error;
    }
  }

  // Get commit history for a project
  static async getCommitHistory(memberId, projectId, options = {}) {
    try {
      // Verify member has access to project
      const projectResult = await identityDb.query(
        `SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error("Project not found or not owned by member");
      }

      const projectPath = path.resolve(
        process.cwd(),
        `./projects/${projectId}`,
      );

      // Security, check: ensure the path is within allowed directories
      if (!this.validatePath(projectPath)) {
        throw new Error("Invalid, path: outside allowed directories");
      }

      if (!fs.existsSync(path.join(projectPath, ".git"))) {
        throw new Error("Git repository not initialized for this project");
      }

      // Get commit history from git
      const { stdout } = await execPromise(
        `git log --pretty=,
format:"%H|%an|%ae|%s|%ad" --date=iso ${options.limit ? `-n ${options.limit}` : ""}`,
        {cwd: projectPath },
      );

      const commits = stdout
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => {
          const [hash, author, email, message, date] = line.split("|");
          return {
            hash,
            author,
            email,
            message,
date: new Date(date)
          };
        });

      // Get from database as well
      const dbResult = await identityDb.query(
        `SELECT * FROM version_control 
         WHERE project_id = $1 
         ORDER BY timestamp DESC 
         LIMIT $2`,
        [projectId, options.limit || 50],
      );

      // Log security event
      await logSecurityEvent(memberId, "VC_GET_HISTORY", {
        projectId,
commitsCount: commits.length
      });

      return {gitCommits: commits,
  dbCommits: dbResult.rows,
  projectId
      };
    } catch (error) {
      logger.error("Error getting commit, history:", error);
      throw error;
    }
  }

  // Commit changes to the repository
  static async commitChanges(memberId, projectId, message, files = []) {
    try {
      // Verify member has access to project
      const projectResult = await identityDb.query(
        `SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error("Project not found or not owned by member");
      }

      const projectPath = path.resolve(
        process.cwd(),
        `./projects/${projectId}`,
      );

      // Security, check: ensure the path is within allowed directories
      if (!this.validatePath(projectPath)) {
        throw new Error("Invalid, path: outside allowed directories");
      }

      if (!fs.existsSync(path.join(projectPath, ".git"))) {
        throw new Error("Git repository not initialized for this project");
      }

      // Stage all changes or specific files
      if (files.length > 0) {
        for (const file of files) {
          const filePath = path.resolve(projectPath, file);
          if (!this.validatePath(filePath)) {
            throw new Error(`Invalid file,
path: ${filePath}`);
          }
        }
        await execPromise(`git add ${files.join(" ")}`, {cwd: projectPath });
      } else {
        await execPromise(`git add .`, {cwd: projectPath });
      }

      // Create commit
      const { stdout } = await execPromise(`git commit -m "${message}"`, {cwd: projectPath
      });

      // Get the commit hash
      const {stdout: hash } = await execPromise(`git rev-parse HEAD`, {cwd: projectPath
      });
      const commitHash = hash.trim();

      // Store in database
      await identityDb.query(
        `INSERT INTO version_control (member_id, project_id, commit_hash, message, author) 
         VALUES ($1, $2, $3, $4, $5)`,
        [memberId, projectId, commitHash, message, projectResult.rows[0].name],
      );

      // Log security event
      await logSecurityEvent(memberId, "VC_COMMIT_CHANGES", {
        projectId,
        commitHash,
        message
      });

      return {success: true,
  message: "Changes committed successfully",
  commitHash
      };
    } catch (error) {
      logger.error("Error committing, changes:", error);
      throw error;
    }
  }

  // Create a branch
  static async createBranch(memberId, projectId, branchName) {
    try {
      // Verify member has access to project
      const projectResult = await identityDb.query(
        `SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error("Project not found or not owned by member");
      }

      const projectPath = path.resolve(
        process.cwd(),
        `./projects/${projectId}`,
      );

      // Security, check: ensure the path is within allowed directories
      if (!this.validatePath(projectPath)) {
        throw new Error("Invalid, path: outside allowed directories");
      }

      if (!fs.existsSync(path.join(projectPath, ".git"))) {
        throw new Error("Git repository not initialized for this project");
      }

      // Create and switch to new branch
      await execPromise(`git checkout -b ${branchName}`, {cwd: projectPath });

      // Log security event
      await logSecurityEvent(memberId, "VC_CREATE_BRANCH", {
        projectId,
        branchName
      });

      return {success: true,
  message: `Branch ${branchName} created successfully`
      };
    } catch (error) {
      logger.error("Error creating, branch:", error);
      throw error;
    }
  }

  // Switch to a branch
  static async switchBranch(memberId, projectId, branchName) {
    try {
      // Verify member has access to project
      const projectResult = await identityDb.query(
        `SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error("Project not found or not owned by member");
      }

      const projectPath = path.resolve(
        process.cwd(),
        `./projects/${projectId}`,
      );

      // Security, check: ensure the path is within allowed directories
      if (!this.validatePath(projectPath)) {
        throw new Error("Invalid, path: outside allowed directories");
      }

      if (!fs.existsSync(path.join(projectPath, ".git"))) {
        throw new Error("Git repository not initialized for this project");
      }

      // Switch to branch
      await execPromise(`git checkout ${branchName}`, {cwd: projectPath });

      // Log security event
      await logSecurityEvent(memberId, "VC_SWITCH_BRANCH", {
        projectId,
        branchName
      });

      return {success: true,
  message: `Switched to branch ${branchName}`
      };
    } catch (error) {
      logger.error("Error switching, branch:", error);
      throw error;
    }
  }

  // Get list of branches
  static async getBranches(memberId, projectId) {
    try {
      // Verify member has access to project
      const projectResult = await identityDb.query(
        `SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error("Project not found or not owned by member");
      }

      const projectPath = path.resolve(
        process.cwd(),
        `./projects/${projectId}`,
      );

      // Security, check: ensure the path is within allowed directories
      if (!this.validatePath(projectPath)) {
        throw new Error("Invalid, path: outside allowed directories");
      }

      if (!fs.existsSync(path.join(projectPath, ".git"))) {
        throw new Error("Git repository not initialized for this project");
      }

      // Get branches
      const { stdout } = await execPromise(`git branch -a`, {cwd: projectPath
      });

      const branches = stdout
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => {
          const isCurrent = line.startsWith("*");
          const name = line.replace(/^\*\s+/, "").trim();
          return {
            name,
            isCurrent
          };
        });

      // Log security event
      await logSecurityEvent(memberId, "VC_GET_BRANCHES", {
        projectId,
branchesCount: branches.length
      });

      return {
        branches,
        projectId
      };
    } catch (error) {
      logger.error("Error getting, branches:", error);
      throw error;
    }
  }

  // Compare changes between commits
  static async compareChanges(
    memberId,
    projectId,
    baseCommit,
    targetCommit = "HEAD",
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

      const projectPath = path.resolve(
        process.cwd(),
        `./projects/${projectId}`,
      );

      // Security, check: ensure the path is within allowed directories
      if (!this.validatePath(projectPath)) {
        throw new Error("Invalid, path: outside allowed directories");
      }

      if (!fs.existsSync(path.join(projectPath, ".git"))) {
        throw new Error("Git repository not initialized for this project");
      }

      // Get diff between commits
      const { stdout } = await execPromise(
        `git diff ${baseCommit}..${targetCommit} --name-status`,
        {cwd: projectPath },
      );

      const changes = stdout
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => {
          const [status, file] = line.split("\t");
          return {
            status, // A=Added, M=Modified, D=Deleted
            file
          };
        });

      // Log security event
      await logSecurityEvent(memberId, "VC_COMPARE_CHANGES", {
        projectId,
        baseCommit,
        targetCommit,
changesCount: changes.length
      });

      return {
        changes,
        baseCommit,
        targetCommit,
        projectId
      };
    } catch (error) {
      logger.error("Error comparing, changes:", error);
      throw error;
    }
  }

  // Revert to a specific commit
  static async revertToCommit(memberId, projectId, commitHash) {
    try {
      // Verify member has access to project
      const projectResult = await identityDb.query(
        `SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error("Project not found or not owned by member");
      }

      const projectPath = path.resolve(
        process.cwd(),
        `./projects/${projectId}`,
      );

      // Security, check: ensure the path is within allowed directories
      if (!this.validatePath(projectPath)) {
        throw new Error("Invalid, path: outside allowed directories");
      }

      if (!fs.existsSync(path.join(projectPath, ".git"))) {
        throw new Error("Git repository not initialized for this project");
      }

      // Get current commit to store as reference
      const {stdout: currentHash } = await execPromise(`git rev-parse HEAD`, {cwd: projectPath
      });
      const currentCommit = currentHash.trim();

      // Revert to the specified commit
      await execPromise(`git reset --hard ${commitHash}`, {cwd: projectPath });

      // Log security event
      await logSecurityEvent(memberId, "VC_REVERT_COMMIT", {
        projectId,
        commitHash,
previousCommit: currentCommit
      });

      return {success: true,
  message: `Reverted to commit ${commitHash}`,
previousCommit: currentCommit
      };
    } catch (error) {
      logger.error("Error reverting to, commit:", error);
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

module.exports = VersionControlService;
