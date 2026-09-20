#!/usr/bin/env node

/**
 * FingerMobile Protocol - Advanced Auto-Commit & Push Source Code Changes
 * 
 * Purpose: Automatically commit & push source code changes (.tsx/.ts/.js/.jsx/.json/.md files) as you work
 * Safety: Includes safeguards against committing large files, sensitive data, and dangerous patterns
 * Format: CommonJS (no external dependencies)
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// --- Configuration ---
const REPO_URL = 'https://github.com/fingermobile-main/FingerMobile-Protocol-Frontend-Main.git';
const WATCH_DIRS = [
  path.join(__dirname, 'FingerMobile Github 27072026', 'FingerMobile-Protocol-Frontend-Main'),
  path.join(__dirname, 'FingerMobile Protocol', 'apps', 'backend'),
  path.join(__dirname, 'FingerMobile Business and Monetization Suite')
];
const COMMIT_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes
const STATUS_INTERVAL_MS = 30 * 1000;      // 30 seconds
const FILE_EXTENSIONS = new Set(['.tsx', '.ts', '.js', '.jsx', '.json', '.md', '.yaml', '.yml', '.html', '.css', '.scss']);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB max file size
const IGNORE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /build/,
  /dist/,
  /out/,
  /coverage/,
  /logs/,
  /\.next/,
  /__pycache__/
];

// --- State Tracking ---
let lastCommitTime = Date.now();
const modifiedFiles = new Set();
let isShuttingDown = false;
let watchers = [];


/**
 * Safely execute git commands using execFileSync (prevents shell injection)
 */
function runGit(args) {
  try {
    const output = execFileSync('git', args, {
      cwd: __dirname,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });
    return { success: true, output: output.trim() };
  } catch (error) {
    return { 
      success: false, 
      error: error.stderr?.toString().trim() || error.message 
    };
  }
}


/**
 * Validates if a file should be included in auto-commit
 */
function isValidFile(filePath) {
  // Check file size
  try {
    const stats = fs.statSync(filePath);
    if (stats.size > MAX_FILE_SIZE) {
      console.log(`⚠️  Skipping large file: ${filePath} (${Math.round(stats.size / 1024 / 1024)}MB)`);
      return false;
    }
  } catch (err) {
    return false;
  }

  // Check file extension
  const ext = path.extname(filePath).toLowerCase();
  return FILE_EXTENSIONS.has(ext);
}

/**
 * Checks if file contains sensitive information
 */
function containsSensitiveInfo(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const sensitivePatterns = [
      /password\s*[:=]\s*["'][^"']*["']/gi,
      /secret\s*[:=]\s*["'][^"']*["']/gi,
      /token\s*[:=]\s*["'][^"']*["']/gi,
      /key\s*[:=]\s*["'][^"']*["']/gi,
      /api_key\s*[:=]\s*["'][^"']*["']/gi,
      /access_token\s*[:=]\s*["'][^"']*["']/gi,
      /client_secret\s*[:=]\s*["'][^"']*["']/gi
    ];
    
    for (const pattern of sensitivePatterns) {
      if (pattern.test(content)) {
        console.log(`⚠️  Potential sensitive data detected in: ${filePath}`);
        return true;
      }
    }
    return false;
  } catch (err) {
    return false;
  }
}

/**
 * Ensures the Git remote repository URL matches the target repository
 */
function ensureGitRemote() {
  const remoteResult = runGit(['remote', 'get-url', 'origin']);

  if (!remoteResult.success) {
    console.log(`🔗 Setting git remote 'origin' to ${REPO_URL}...`);
    runGit(['remote', 'add', 'origin', REPO_URL]);
  } else if (remoteResult.output !== REPO_URL) {
    console.log(`🔄 Updating git remote 'origin' URL to ${REPO_URL}...`);
    runGit(['remote', 'set-url', 'origin', REPO_URL]);
  }
}

/**
 * Gets the current active Git branch
 */
function getCurrentBranch() {
  const result = runGit(['rev-parse', '--abbrev-ref', 'HEAD']);
  return result.success ? result.output : 'main';
}

/**
 * Stage, commit, and push tracked files
 */
function createBatchCommit() {
  if (modifiedFiles.size === 0) return { success: true, committed: false };

  // Filter valid files
  const validFiles = Array.from(modifiedFiles).filter(file => 
    fs.existsSync(file) && isValidFile(file) && !containsSensitiveInfo(file)
  );

  if (validFiles.length === 0) {
    modifiedFiles.clear();
    return { success: true, committed: false };
  }

  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const commitMessage = `auto: Source code changes - ${validFiles.length} file(s) modified at ${timestamp}`;

  console.log(`\n📝 Creating batch commit...`);
  console.log(`   Files: ${validFiles.length}`);
  console.log(`   Message: "${commitMessage}"`);

  // Stage files
  const relativePaths = validFiles.map(f => path.relative(__dirname, f));
  const stageResult = runGit(['add', ...relativePaths]);

  if (!stageResult.success) {
    console.error(`   ✗ Failed to stage files: ${stageResult.error}`);
    return { success: false, committed: false };
  }

  // Check if git detected actual index changes
  const statusResult = runGit(['status', '--porcelain']);
  if (!statusResult.success || !statusResult.output) {
    console.log('   ℹ No staged changes detected by Git.');
    modifiedFiles.clear();
    return { success: true, committed: false };
  }

  // Commit
  const commitResult = runGit(['commit', '-m', commitMessage]);
  if (!commitResult.success) {
    console.error(`   ✗ Commit failed: ${commitResult.error}`);
    return { success: false, committed: false };
  }

  console.log(`   ✓ Commit successful\n   ${commitResult.output}`);
  modifiedFiles.clear();
  lastCommitTime = Date.now();

  // Push to remote repository
  const currentBranch = getCurrentBranch();
  console.log(`🚀 Pushing changes to origin/${currentBranch}...`);
  const pushResult = runGit(['push', 'origin', currentBranch]);

  if (pushResult.success) {
    console.log(`   ✓ Successfully pushed to GitHub\n`);
  } else {
    console.error(`   ⚠️ Commit created, but push failed: ${pushResult.error}\n`);
  }

  return { success: true, committed: true };
}

/**
 * Display periodic status update
 */
function displayStatus() {
  if (isShuttingDown) return;
  const now = Date.now();
  const timeSinceLastCommit = Math.round((now - lastCommitTime) / 1000);
  const nextCommitIn = Math.max(0, Math.round((COMMIT_INTERVAL_MS - (now - lastCommitTime)) / 1000));

  console.log(`\n⏱️  Status Update:`);
  console.log(`   Watching directories: ${WATCH_DIRS.length}`);
  console.log(`   Remote Repository: ${REPO_URL}`);
  console.log(`   Pending files tracked: ${modifiedFiles.size}`);
  console.log(`   Last commit: ${timeSinceLastCommit}s ago`);
  console.log(`   Next auto-commit in: ${nextCommitIn}s\n`);
}



/**
 * Handle File System Watcher Events
 */
function setupWatchers() {
  for (const watchDir of WATCH_DIRS) {
    if (!fs.existsSync(watchDir)) {
      console.warn(`⚠️ Warning: Directory does not exist -> ${watchDir}`);
      continue;
    }

    try {
      const watcher = fs.watch(watchDir, { recursive: true }, (eventType, filename) => {
        if (!filename || isShuttingDown) return;

        const fullPath = path.join(watchDir, filename);
        if (isValidFile(fullPath) && !modifiedFiles.has(fullPath)) {
          modifiedFiles.add(fullPath);
          console.log(`\n📄 Detected change: ${filename}`);
        }
      });
      watchers.push(watcher);
    } catch (err) {
      console.error(`❌ Watcher error for ${watchDir}: ${err.message}`);
    }
  }
}

/**
 * Cleanup function to close all watchers
 */
function cleanupWatchers() {
  for (const watcher of watchers) {
    try {
      watcher.close();
    } catch (err) {
      console.error(`Error closing watcher: ${err.message}`);
    }
  }
  watchers = [];
}

/**
 * Graceful Shutdown Handler
 */
function handleShutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log('\n\n🛑 Shutting down auto-commit watcher...');
  
  if (modifiedFiles.size > 0) {
    console.log('📝 Creating final commit before exit...');
    createBatchCommit();
  }
  
  cleanupWatchers();
  console.log('✓ Auto-commit watcher stopped successfully.\n');
  process.exit(0);
}

// --- Application Initialization ---
console.log('🚀 Starting FingerMobile Protocol Auto-Commit Watcher...');
console.log(`   Target Repository: ${REPO_URL}`);
console.log(`   Watched Directories: ${WATCH_DIRS.length}`);
console.log(`   Extensions: ${Array.from(FILE_EXTENSIONS).join(', ')}`);
console.log(`   Commit Interval: ${COMMIT_INTERVAL_MS / 1000 / 60} minutes\n`);

// Ensure Git remote is configured correctly
ensureGitRemote();

// Start event listening
setupWatchers();

// Register interval timers
setInterval(() => {
  if (modifiedFiles.size > 0 && (Date.now() - lastCommitTime >= COMMIT_INTERVAL_MS)) {
    console.log(`\n⏰ Auto-commit interval reached.`);
    createBatchCommit();
  }
}, 5000);

setInterval(displayStatus, STATUS_INTERVAL_MS);

// Shutdown handlers
process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);
process.on('exit', () => {
  cleanupWatchers();
});

console.log('✅ Auto-commit watcher initialized successfully!\n');
