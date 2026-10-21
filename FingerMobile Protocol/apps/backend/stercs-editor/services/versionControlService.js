/* eslint-disable no-unused-vars */
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { identityDb } = require('../../db');
const { logSecurityEvent } = require('../../utils/securityLogger');
const logger = require('../../utils/logger');

// Promisify exec for easier use with async/await
const execPromise = (command, options = {}) => {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
};

class VersionControlService {
  // Initialize a git repository for a project
  static async initializeRepository(memberId, projectId) {
    try {
      // Verify member has access to project
      const projectResult = await identityDb.query(
        'SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2',
        [projectId, memberId]
      );

      if (projectResult.rows.length === 0) {
        throw new Error('Project not found or not owned by member');
      }

      const projectPath = path.resolve(
        process.cwd(),
        `./projects/${projectId}`
      );

      // Security check: ensure the path is within allowed directories
      if (!this.validatePath(projectPath)) {
        throw new Error('Invalid path: outside allowed directories');
      }

      // Create project directory if it doesn't exist
      if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath, { recursive: true });
      }

      // Initialize git repository
      await execPromise('git init', { cwd: projectPath });
      await execPromise('git config user.name "STERCS User"', { cwd: projectPath });
      await execPromise('git config user.email user@stercs.com', { cwd: projectPath });

      // Create initial commit
      await execPromise(
        `echo "# Project ${projectResult.rows[0].name}" > README.md`,
        { cwd: projectPath },
      );
      await execPromise('git add README.md', { cwd: projectPath });
      await execPromise(
        `git commit -m "Initial commit for project: ${projectResult.rows[0].name}"`,
        { cwd: projectPath },
      );

      // Log security event
      await logSecurityEvent(memberId, 'VC_INITIALIZE_REPO', { projectId, projectPath });

      return {
        success: true,
        message: 'Git repository initialized successfully',
        projectPath
      };
    } catch (error) {
      logger.error('Error initializing git repository:', error);
      throw error;
    }
  }

  // Get commit history for a project
  static async getCommitHistory(memberId, projectId, options = {}) {
    try {
      // Verify member has access to project
      const projectResult = await identityDb.query(
        'SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2',
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error('Project not found or not owned by member');
      }

      const projectPath = path.resolve(
        process.cwd(),
        `./projects/${projectId}`,
      );

      // Security check: ensure the path is within allowed directories
      if (!this.validatePath(projectPath)) {
        throw new Error('Invalid path: outside allowed directories');
      }

      if (!fs.existsSync(path.join(projectPath, '.git'))) {
        throw new Error('Git repository not initialized for this project');
      }

      // Get commit history from git
      const { stdout } = await execPromise(
        `git log --pretty=format:"%H|%an|%ae|%s|%ad" --date=iso ${options.limit ? `-n ${options.limit}` : ''}`,
        { cwd: projectPath },
      );

      const commits = stdout
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((line) => {
          const [hash, author, email, message, date] = line.split('|');
          return { hash, author, email, message, date: new Date(date) };
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
      await logSecurityEvent(memberId, 'VC_GET_HISTORY', { projectId, commitsCount: commits.length });

      return {
        gitCommits: commits,
        dbCommits: dbResult.rows,
        projectId
      };
    } catch (error) {
      logger.error('Error getting commit history:', error);
      throw error;
    }
  }

  // Commit changes to the repository
  static async commitChanges(memberId, projectId, message, files = []) {
    try {
      // Verify member has access to project
      const projectResult = await identityDb.query(
        'SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2',
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error('Project not found or not owned by member');
      }

      const projectPath = path.resolve(
        process.cwd(),
        `./projects/${projectId}`,
      );

      // Security check: ensure the path is within allowed directories
      if (!this.validatePath(projectPath)) {
        throw new Error('Invalid path: outside allowed directories');
      }

      if (!fs.existsSync(path.join(projectPath, '.git'))) {
        throw new Error('Git repository not initialized for this project');
      }

      // Stage all changes or specific files
      if (files.length > 0) {
        for (const file of files) {
          const filePath = path.resolve(projectPath, file);
          if (!this.validatePath(filePath)) {
            throw new Error(`Invalid file path: ${filePath}`);
          }
        }
        await execPromise(`git add ${files.join(' ')}`, { cwd: projectPath });
      } else {
        await execPromise('git add .', { cwd: projectPath });
      }

      // Create commit
      const { stdout } = await execPromise(`git commit -m "${message}"`, { cwd: projectPath });

      // Get the commit hash
      const { stdout: hash } = await execPromise('git rev-parse HEAD', { cwd: projectPath });
      const commitHash = hash.trim();

      // Store in database
      await identityDb.query(
        `INSERT INTO version_control (member_id, project_id, commit_hash, message, author) 
         VALUES ($1, $2, $3, $4, $5)`,
        [memberId, projectId, commitHash, message, projectResult.rows[0].name],
      );

      // Log security event
      await logSecurityEvent(memberId, 'VC_COMMIT_CHANGES', {
        projectId,
        commitHash,
        message
      });

      return {
        success: true,
        message: 'Changes committed successfully',
        commitHash
      };
    } catch (error) {
      logger.error('Error committing changes:', error);
      throw error;
    }
  }

  /**
   * Create a branch
   * @param {string} memberId - The member ID
   * @param {string} projectId - The project ID
   * @param {string} branchName - Name of the branch to create
   * @returns {Promise<Object>} Result of the branch creation
   */
  static async createBranch(memberId, projectId, branchName) {
    try {
      // Verify member has access to project
      const projectResult = await identityDb.query(
        'SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2',
        [projectId, memberId]
      );

      if (projectResult.rows.length === 0) {
        throw new Error('Project not found or not owned by member');
      }

      const projectPath = path.resolve(
        process.cwd(),
        `./projects/${projectId}`
      );

      // Security check: ensure the path is within allowed directories
      if (!this.validatePath(projectPath)) {
        throw new Error('Invalid path: outside allowed directories');
      }

      if (!fs.existsSync(path.join(projectPath, '.git'))) {
        throw new Error('Git repository not initialized for this project');
      }

      // Create the branch
      await execPromise(`git checkout -b ${branchName}`, { cwd: projectPath });

      // Log security event
      await logSecurityEvent(memberId, 'VC_CREATE_BRANCH', {
        projectId,
        branchName
      });

      return {
        success: true,
        message: `Branch ${branchName} created successfully`
      };
    } catch (error) {
      logger.error('Error creating branch:', error);
      throw error;
    }
  }

  /**
   * Switch to a branch
   * @param {string} memberId - The member ID
   * @param {string} projectId - The project ID
   * @param {string} branchName - Name of the branch to switch to
   * @returns {Promise<Object>} Result of the branch switching
   */
  static async switchBranch(memberId, projectId, branchName) {
    try {
      // Verify member has access to project
      const projectResult = await identityDb.query(
        'SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2',
        [projectId, memberId]
      );

      if (projectResult.rows.length === 0) {
        throw new Error('Project not found or not owned by member');
      }

      const projectPath = path.resolve(
        process.cwd(),
        `./projects/${projectId}`
      );

      // Security check: ensure the path is within allowed directories
      if (!this.validatePath(projectPath)) {
        throw new Error('Invalid path: outside allowed directories');
      }

      if (!fs.existsSync(path.join(projectPath, '.git'))) {
        throw new Error('Git repository not initialized for this project');
      }

      // Switch to the branch
      await execPromise(`git checkout ${branchName}`, { cwd: projectPath });

      // Log security event
      await logSecurityEvent(memberId, 'VC_SWITCH_BRANCH', {
        projectId,
        branchName
      });

      return {
        success: true,
        message: `Switched to branch ${branchName} successfully`
      };
    } catch (error) {
      logger.error('Error switching branch:', error);
      throw error;
    }
  }

  /**
   * Get all branches in a project
   * @param {string} memberId - The member ID
   * @param {string} projectId - The project ID
   * @returns {Promise<Object>} List of branches
   */
  static async getBranches(memberId, projectId) {
    try {
      // Verify member has access to project
      const projectResult = await identityDb.query(
        'SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2',
        [projectId, memberId]
      );

      if (projectResult.rows.length === 0) {
        throw new Error('Project not found or not owned by member');
      }

      const projectPath = path.resolve(
        process.cwd(),
        `./projects/${projectId}`
      );

      // Security check: ensure the path is within allowed directories
      if (!this.validatePath(projectPath)) {
        throw new Error('Invalid path: outside allowed directories');
      }

      if (!fs.existsSync(path.join(projectPath, '.git'))) {
        throw new Error('Git repository not initialized for this project');
      }

      // Get all branches
      const { stdout } = await execPromise('git branch -a', { cwd: projectPath });
      const branches = stdout
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => line.replace(/^\*\s*/, '').trim()); // Remove current branch marker (*)

      // Log security event
      await logSecurityEvent(memberId, 'VC_GET_BRANCHES', {
        projectId,
        branchesCount: branches.length
      });

      return {
        success: true,
        branches
      };
    } catch (error) {
      logger.error('Error getting branches:', error);
      throw error;
    }
  }

  /**
   * Compare changes between commits or branches
   * @param {string} memberId - The member ID
   * @param {string} projectId - The project ID
   * @param {string} fromRef - Source reference (commit hash, branch name)
   * @param {string} toRef - Target reference (commit hash, branch name)
   * @returns {Promise<Object>} Comparison result
   */
  static async compareChanges(
    memberId,
    projectId,
    fromRef = 'HEAD~1',
    toRef = 'HEAD'
  ) {
    try {
      // Verify member has access to project
      const projectResult = await identityDb.query(
        'SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2',
        [projectId, memberId]
      );

      if (projectResult.rows.length === 0) {
        throw new Error('Project not found or not owned by member');
      }

      const projectPath = path.resolve(
        process.cwd(),
        `./projects/${projectId}`
      );

      // Security check: ensure the path is within allowed directories
      if (!this.validatePath(projectPath)) {
        throw new Error('Invalid path: outside allowed directories');
      }

      if (!fs.existsSync(path.join(projectPath, '.git'))) {
        throw new Error('Git repository not initialized for this project');
      }

      // Get diff between references
      const { stdout } = await execPromise(`git diff ${fromRef}..${toRef}`, { cwd: projectPath });

      // Log security event
      await logSecurityEvent(memberId, 'VC_COMPARE_CHANGES', {
        projectId,
        fromRef,
        toRef
      });

      return {
        success: true,
        diff: stdout
      };
    } catch (error) {
      logger.error('Error comparing changes:', error);
      throw error;
    }
  }

  /**
   * Revert to a specific commit
   * @param {string} memberId - The member ID
   * @param {string} projectId - The project ID
   * @param {string} commitHash - Hash of the commit to revert to
   * @returns {Promise<Object>} Result of the revert operation
   */
  static async revertToCommit(memberId, projectId, commitHash) {
    try {
      // Verify member has access to project
      const projectResult = await identityDb.query(
        'SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2',
        [projectId, memberId]
      );

      if (projectResult.rows.length === 0) {
        throw new Error('Project not found or not owned by member');
      }

      const projectPath = path.resolve(
        process.cwd(),
        `./projects/${projectId}`
      );

      // Security check: ensure the path is within allowed directories
      if (!this.validatePath(projectPath)) {
        throw new Error('Invalid path: outside allowed directories');
      }

      if (!fs.existsSync(path.join(projectPath, '.git'))) {
        throw new Error('Git repository not initialized for this project');
      }

      // Validate commit hash format
      if (!/^[a-f0-9]{7,40}$/i.test(commitHash)) {
        throw new Error('Invalid commit hash format');
      }

      // Check if commit exists
      try {
        await execPromise(`git cat-file -e ${commitHash}`, { cwd: projectPath });
      } catch (error) {
        throw new Error(`Commit ${commitHash} does not exist in this repository`);
      }

      // Revert to the specified commit
      await execPromise(`git reset --hard ${commitHash}`, { cwd: projectPath });

      // Log security event
      await logSecurityEvent(memberId, 'VC_REVERT_COMMIT', {
        projectId,
        commitHash
      });

      return {
        success: true,
        message: `Reverted to commit ${commitHash} successfully`
      };
    } catch (error) {
      logger.error('Error reverting to commit:', error);
      throw error;
    }
  }

  /**
   * Validate a file path for security purposes
   * @param {string} fullPath - The full path to validate
   * @returns {boolean} Whether the path is valid
   */
  static validatePath(fullPath) {
    // Resolve the path to canonical form
    const resolvedPath = path.resolve(fullPath);
    const projectsDir = path.resolve(process.cwd(), './projects');

    // Ensure the path is within the allowed projects directory
    if (!resolvedPath.startsWith(projectsDir)) {
      return false;
    }

    // Prevent directory traversal attacks
    if (resolvedPath.includes('../') || resolvedPath.includes('..\\')) {
      return false;
    }

    return true;
  }
}

module.exports = VersionControlService;
