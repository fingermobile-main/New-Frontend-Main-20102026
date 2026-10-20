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
const REPO_URL = 'https://github.com/fingermobile-main/New-Frontend-Main-20102026.git';
const WATCH_DIRS = [
  path.resolve(__dirname, 'FingerMobile Protocol', 'apps', 'frontend-main'),
  path.resolve(__dirname, 'FingerMobile Protocol', 'apps', 'backend'),
  path.resolve(__dirname, 'FingerMobile Business and Monetization Suite')
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

// --- CLI Flags ---
const ARGS = new Set(process.argv.slice(2));
const RUN_NOW = ARGS.has('--now') || ARGS.has('-n');
const RUN_ONCE = ARGS.has('--once') || ARGS.has('-1');

// --- State Tracking ---
let lastCommitTime = Date.now();
const modifiedFiles = new Set();
let isShuttingDown = false;
let watchers = [];

/**
 * Safely execute git commands using execFileSync (prevents shell injection)
 */
function runGit(args, cwd = __dirname) {
  try {
    const output = execFileSync('git', args, {
      cwd,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });
    return { success: true, output };
  } catch (error) {
    return { 
      success: false, 
      error: error.stderr?.toString().trim() || error.message 
    };
  }
}

/**
 * Resolves the enclosing git repository root for a given file or directory
 */
function getGitRepoRoot(targetPath) {
  let curr = path.resolve(targetPath);
  if (fs.existsSync(curr) && !fs.statSync(curr).isDirectory()) {
    curr = path.dirname(curr);
  }

  while (curr && curr !== path.dirname(curr)) {
    if (fs.existsSync(path.join(curr, '.git'))) {
      return curr;
    }
    curr = path.dirname(curr);
  }
  return path.resolve(__dirname);
}

/**
 * Validates if a file should be included in auto-commit
 */
function isValidFile(filePath) {
  // Check ignore patterns
  for (const pattern of IGNORE_PATTERNS) {
    if (pattern.test(filePath)) return false;
  }

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
 * Ensures the Git remote repository URL matches the target repository for a given directory
 */
function ensureGitRemote(repoRoot = __dirname) {
  const remoteResult = runGit(['remote', 'get-url', 'origin'], repoRoot);

  if (!remoteResult.success) {
    console.log(`🔗 Setting git remote 'origin' to ${REPO_URL} in ${repoRoot}...`);
    runGit(['remote', 'add', 'origin', REPO_URL], repoRoot);
  } else if (remoteResult.output.trim() !== REPO_URL) {
    console.log(`🔄 Updating git remote 'origin' URL to ${REPO_URL} in ${repoRoot}...`);
    runGit(['remote', 'set-url', 'origin', REPO_URL], repoRoot);
  }
}

/**
 * Gets the current active Git branch for a given directory
 */
function getCurrentBranch(repoRoot = __dirname) {
  const result = runGit(['rev-parse', '--abbrev-ref', 'HEAD'], repoRoot);
  return result.success ? result.output.trim() : 'main';
}

/**
 * Parses git status --porcelain output into list of file paths
 */
function parsePorcelainStatus(output) {
  const lines = output.split('\n');
  const files = [];
  for (let line of lines) {
    if (!line.trim()) continue;
    let filePart = '';
    const match = line.match(/^([ MARCUD?]{1,2})\s+(.*)$/);
    if (match) {
      filePart = match[2].trim();
    } else {
      filePart = line.substring(3).trim();
    }
    if (filePart.startsWith('"') && filePart.endsWith('"')) {
      filePart = filePart.slice(1, -1);
    }
    if (filePart.includes(' -> ')) {
      filePart = filePart.split(' -> ')[1].trim();
    }
    if (filePart) files.push(filePart);
  }
  return files;
}

/**
 * Collects any uncommitted changed files from git status across watch directories
 */
function scanPendingChanges() {
  const found = [];
  const checkedRoots = new Set();

  for (const watchDir of WATCH_DIRS) {
    if (!fs.existsSync(watchDir)) continue;
    const repoRoot = getGitRepoRoot(watchDir);
    if (checkedRoots.has(repoRoot)) continue;
    checkedRoots.add(repoRoot);

    const status = runGit(['status', '--porcelain'], repoRoot);
    if (status.success && status.output) {
      const parsedFiles = parsePorcelainStatus(status.output);
      for (const filePart of parsedFiles) {
        const fullPath = path.resolve(repoRoot, filePart);
        if (fs.existsSync(fullPath) && isValidFile(fullPath) && !containsSensitiveInfo(fullPath)) {
          found.push(fullPath);
        }
      }
    }
  }

  return found;
}

/**
 * Stage, commit, and push tracked files grouped by repository
 */
function createBatchCommit() {
  // If no files actively queued, check git status for pending modifications
  if (modifiedFiles.size === 0) {
    const pending = scanPendingChanges();
    for (const f of pending) modifiedFiles.add(f);
  }

  if (modifiedFiles.size === 0) return { success: true, committed: false };

  // Filter valid files
  const validFiles = Array.from(modifiedFiles).filter(file => 
    fs.existsSync(file) && isValidFile(file) && !containsSensitiveInfo(file)
  );

  if (validFiles.length === 0) {
    modifiedFiles.clear();
    return { success: true, committed: false };
  }

  // Group files by repo root
  const filesByRepo = new Map();
  for (const file of validFiles) {
    const repoRoot = getGitRepoRoot(file);
    if (!filesByRepo.has(repoRoot)) {
      filesByRepo.set(repoRoot, []);
    }
    filesByRepo.get(repoRoot).push(file);
  }

  let totalCommitted = 0;
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  for (const [repoRoot, files] of filesByRepo.entries()) {
    ensureGitRemote(repoRoot);
    const commitMessage = `auto: Source code changes - ${files.length} file(s) modified at ${timestamp}`;

    console.log(`\n📝 Creating batch commit in: ${repoRoot}...`);
    console.log(`   Files: ${files.length}`);
    console.log(`   Message: "${commitMessage}"`);

    const relativePaths = files.map(f => path.relative(repoRoot, f));
    const stageResult = runGit(['add', ...relativePaths], repoRoot);

    if (!stageResult.success) {
      console.error(`   ✗ Failed to stage files in ${repoRoot}: ${stageResult.error}`);
      continue;
    }

    const statusResult = runGit(['status', '--porcelain'], repoRoot);
    if (!statusResult.success || !statusResult.output || !statusResult.output.trim()) {
      console.log(`   ℹ No staged changes detected in ${repoRoot}.`);
      continue;
    }

    const commitResult = runGit(['commit', '-m', commitMessage], repoRoot);
    if (!commitResult.success) {
      console.error(`   ✗ Commit failed in ${repoRoot}: ${commitResult.error}`);
      continue;
    }

    console.log(`   ✓ Commit successful\n   ${commitResult.output.trim()}`);
    totalCommitted++;

    const currentBranch = getCurrentBranch(repoRoot);
    console.log(`🚀 Pushing changes to origin/${currentBranch} from ${repoRoot}...`);
    const pushResult = runGit(['push', 'origin', currentBranch], repoRoot);

    if (pushResult.success) {
      console.log(`   ✓ Successfully pushed to GitHub (${REPO_URL})\n`);
    } else {
      console.error(`   ⚠️ Commit created, but push failed: ${pushResult.error}\n`);
    }
  }

  modifiedFiles.clear();
  lastCommitTime = Date.now();

  return { success: true, committed: totalCommitted > 0 };
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

// Ensure Git remote is configured correctly across watch roots
for (const dir of WATCH_DIRS) {
  if (fs.existsSync(dir)) {
    ensureGitRemote(getGitRepoRoot(dir));
  }
}

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

// Handle immediate run flags
if (RUN_NOW || RUN_ONCE) {
  console.log('⏩ Immediate commit requested...');
  const result = createBatchCommit();
  if (!result.success) {
    console.error('Immediate commit failed.');
  } else if (!result.committed) {
    console.log('No pending changes detected for commit.');
  }
}

if (RUN_ONCE) {
  console.log('🧪 --once flag detected: exiting after immediate attempt.');
  handleShutdown();
}
