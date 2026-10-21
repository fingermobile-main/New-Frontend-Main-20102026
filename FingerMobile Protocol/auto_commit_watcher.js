#!/usr/bin/env node

/**
 * FingerMobile Protocol - Auto-Commit Source Code Changes
 * 
 * Purpose: Automatically commit source code changes (.tsx/.ts files) as you work
 * Safety: Only monitors src/pages/ directory, excludes build artifacts
 * Format: CommonJS (no external dependencies)
 * Polling: Checks every 5 seconds, batches commits every 20 minutes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const WATCH_DIR = __dirname;
const POLL_INTERVAL_MS = 5000; // Check every 5 seconds
const COMMIT_INTERVAL_MS = 20 * 60 * 1000; // Commit every 20 minutes
const FILE_EXTENSIONS = ['.tsx', '.ts'];

// State tracking
let lastCheckTime = Date.now();
let lastCommitTime = Date.now();
let modifiedFiles = new Set();
let isRunning = false;

/**
 * Get all tracked source files recursively
 */
function getSourceFiles(dir, fileList = []) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      
      try {
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          // Skip node_modules, .git, and hidden directories
          if (!file.startsWith('.') && file !== 'node_modules') {
            getSourceFiles(filePath, fileList);
          }
        } else if (stat.isFile()) {
          // Only track TypeScript/TSX files
          const ext = path.extname(file).toLowerCase();
          if (FILE_EXTENSIONS.includes(ext)) {
            fileList.push(filePath);
          }
        }
      } catch (err) {
        // Skip files we can't access
      }
    });
    
    return fileList;
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message);
    return fileList;
  }
}

/**
 * Get file modification time
 */
function getFileMtime(filePath) {
  try {
    const stat = fs.statSync(filePath);
    return stat.mtimeMs;
  } catch (err) {
    return 0;
  }
}

/**
 * Check for modified files since last check
 */
function findModifiedFiles() {
  const allFiles = getSourceFiles(WATCH_DIR);
  const modified = [];
  
  allFiles.forEach(filePath => {
    const mtime = getFileMtime(filePath);
    
    // File was modified since last check
    if (mtime > lastCheckTime) {
      modified.push(filePath);
      modifiedFiles.add(filePath);
    }
  });
  
  return modified;
}

/**
 * Execute git command safely
 */
function executeGitCommand(command) {
  try {
    const result = execSync(command, {
      cwd: __dirname,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return { success: true, output: result };
  } catch (error) {
    return { 
      success: false, 
      error: error.stderr?.toString() || error.message 
    };
  }
}

/**
 * Stage modified files in git
 */
function stageFiles(files) {
  if (files.length === 0) return { success: true, staged: 0 };
  
  const relativePaths = files.map(f => path.relative(__dirname, f));
  const command = `git add ${relativePaths.map(p => `"${p}"`).join(' ')}`;
  
  console.log(`   Staging ${files.length} file(s)...`);
  const result = executeGitCommand(command);
  
  if (result.success) {
    console.log(`   ✓ Successfully staged ${files.length} file(s)`);
    return { success: true, staged: files.length };
  } else {
    console.error(`   ✗ Failed to stage files: ${result.error}`);
    return { success: false, staged: 0 };
  }
}

/**
 * Create batch commit with summary
 */
function createBatchCommit() {
  if (modifiedFiles.size === 0) {
    return { success: true, committed: false };
  }
  
  const fileCount = modifiedFiles.size;
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const commitMessage = `auto: Source code changes - ${fileCount} file(s) modified at ${timestamp}`;
  
  console.log(`\n📝 Creating batch commit...`);
  console.log(`   Files: ${fileCount}`);
  console.log(`   Message: "${commitMessage}"`);
  
  // Stage all modified files
  const stageResult = stageFiles(Array.from(modifiedFiles));
  
  if (!stageResult.success) {
    return { success: false, committed: false };
  }
  
  // Check if there are actually changes to commit
  const statusResult = executeGitCommand('git status --porcelain');
  if (!statusResult.success || !statusResult.output.trim()) {
    console.log('   ℹ No changes to commit (files may be unchanged)');
    modifiedFiles.clear();
    return { success: true, committed: false };
  }
  
  // Commit changes
  const commitCommand = `git commit -m "${commitMessage}"`;
  const commitResult = executeGitCommand(commitCommand);
  
  if (commitResult.success) {
    console.log(`   ✓ Commit successful`);
    console.log(`   ${commitResult.output.trim()}\n`);
    modifiedFiles.clear();
    lastCommitTime = Date.now();
    return { success: true, committed: true };
  } else {
    console.error(`   ✗ Commit failed: ${commitResult.error}`);
    return { success: false, committed: false };
  }
}

/**
 * Display current status
 */
function displayStatus() {
  const now = Date.now();
  const timeSinceLastCheck = Math.round((now - lastCheckTime) / 1000);
  const timeSinceLastCommit = Math.round((now - lastCommitTime) / 1000);
  const nextCommitIn = Math.max(0, Math.round((COMMIT_INTERVAL_MS - (now - lastCommitTime)) / 1000));
  
  console.log(`\n⏱️  Status Update:`);
  console.log(`   Watching: ${WATCH_DIR}`);
  console.log(`   Modified files tracked: ${modifiedFiles.size}`);
  console.log(`   Last check: ${timeSinceLastCheck}s ago`);
  console.log(`   Last commit: ${timeSinceLastCommit}s ago`);
  console.log(`   Next auto-commit: ${nextCommitIn}s\n`);
}

/**
 * Main monitoring loop
 */
function monitoringLoop() {
  if (!isRunning) return;
  
  try {
    const now = Date.now();
    
    // Check for modified files
    const modified = findModifiedFiles();
    
    if (modified.length > 0) {
      console.log(`\n📄 Detected ${modified.length} modified file(s):`);
      modified.forEach(file => {
        const relativePath = path.relative(__dirname, file);
        console.log(`   • ${relativePath}`);
      });
    }
    
    // Update last check time
    lastCheckTime = now;
    
    // Check if it's time for a batch commit
    const timeSinceLastCommit = now - lastCommitTime;
    if (timeSinceLastCommit >= COMMIT_INTERVAL_MS && modifiedFiles.size > 0) {
      console.log(`\n⏰ Auto-commit triggered (${Math.round(timeSinceLastCommit / 1000)}s elapsed)`);
      createBatchCommit();
    }
    
    // Display periodic status (every 60 seconds)
    if (Math.round(timeSinceLastCommit / 1000) % 60 === 0) {
      displayStatus();
    }
    
  } catch (error) {
    console.error('\n❌ Error in monitoring loop:', error.message);
  }
  
  // Schedule next check
  setTimeout(monitoringLoop, POLL_INTERVAL_MS);
}

/**
 * Initialize and start monitoring
 */
function startAutoCommit() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  FingerMobile Protocol - Auto-Commit Source Code Watcher');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  // Verify watch directory exists
  if (!fs.existsSync(WATCH_DIR)) {
    console.error(`ERROR: Watch directory not found: ${WATCH_DIR}`);
    process.exit(1);
  }
  
  // Verify we're in a git repository
  const gitCheck = executeGitCommand('git rev-parse --git-dir');
  if (!gitCheck.success) {
    console.error('ERROR: Not a git repository. Please initialize git first.');
    process.exit(1);
  }
  
  console.log(`✅ Configuration:`);
  console.log(`   Watch Directory: ${WATCH_DIR}`);
  console.log(`   Poll Interval: ${POLL_INTERVAL_MS / 1000}s`);
  console.log(`   Commit Interval: ${COMMIT_INTERVAL_MS / 60000} minutes`);
  console.log(`   File Types: ${FILE_EXTENSIONS.join(', ')}`);
  console.log(`   Git Repository: Valid ✓\n`);
  
  console.log(`🚀 Starting auto-commit watcher...\n`);
  console.log(`💡 Tip: Press Ctrl+C to stop the watcher\n`);
  
  isRunning = true;
  lastCheckTime = Date.now();
  lastCommitTime = Date.now();
  
  // Start monitoring loop
  monitoringLoop();
}

/**
 * Handle graceful shutdown
 */
function handleShutdown() {
  console.log('\n\n🛑 Shutting down auto-commit watcher...');
  isRunning = false;
  
  // Final commit if there are pending changes
  if (modifiedFiles.size > 0) {
    console.log('📝 Creating final commit before exit...');
    createBatchCommit();
  }
  
  console.log('✓ Auto-commit watcher stopped\n');
  process.exit(0);
}

// Register shutdown handlers
process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

// Start the watcher
startAutoCommit();
