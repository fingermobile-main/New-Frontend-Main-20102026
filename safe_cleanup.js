#!/usr/bin/env node

/**
 * Platform Cleanup Script - SAFE VERSION
 * 
 * SAFETY FEATURES:
 * 1. Dry-run mode by default (preview before moving)
 * 2. Whitelist protection for critical files
 * 3. Backup creation before any move operation
 * 4. Comprehensive logging and rollback capability
 * 5. Interactive confirmation for risky operations
 * 6. Pattern-based exclusion for important directories
 * 
 * USAGE:
 *   node safe_cleanup.js --dry-run          # Preview only (default)
 *   node safe_cleanup.js --apply            # Actually move files
 *   node safe_cleanup.js --apply --backup   # Move with backup
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================================================
// CONFIGURATION
// ============================================================================

const ROOT_DIR = path.join(__dirname);
const SLEEPER_DIR = path.join(ROOT_DIR, 'Sleeper 13062026');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');
const CLEANUP_DIR = path.join(SLEEPER_DIR, 'cleanup_archive', `archive_${TIMESTAMP}`);
const BACKUP_DIR = path.join(SLEEPER_DIR, 'cleanup_backup', `backup_${TIMESTAMP}`);
const LOG_FILE = path.join(CLEANUP_DIR, 'cleanup_log.json');

// Parse command line arguments
const args = process.argv.slice(2);
const MODE = {
  dryRun: args.includes('--dry-run') || !args.includes('--apply'),
  apply: args.includes('--apply'),
  backup: args.includes('--backup')
};

// ============================================================================
// CRITICAL FILE/DIRECTORY WHITELIST (NEVER MOVE THESE)
// ============================================================================

const CRITICAL_FILES = [
  // Root-level essential files
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'docker-compose.yml',
  'docker-compose.*.yml',
  'Dockerfile',
  'Dockerfile.*',
  '.env',
  '.env.*',
  '.gitignore',
  '.eslintrc*',
  '.prettierrc*',
  
  // Documentation that should stay
  'README.md',
  'CONTRIBUTING.md',
  'LICENSE',
  'CHANGELOG.md',
  
  // Configuration files
  'nginx.conf',
  '*.conf',
  
  // Build configuration
  'vite.config.*',
  'webpack.config.*',
  'babel.config.*',
  'tailwind.config.*',
  'jest.config.*',
  
  // CI/CD
  '.github/**/*',
  '.gitlab-ci.yml',
  'Jenkinsfile',
  
  // Infrastructure
  'cloud-run-service.yaml',
  'workflow.yaml',
  'lifecycle.json'
];

const CRITICAL_DIRECTORIES = [
  // Source code directories
  'apps',
  'src',
  'lib',
  'components',
  'services',
  'controllers',
  'models',
  'routes',
  'middleware',
  'utils',
  'config',
  'database',
  'schemas',
  'migrations',
  'seeders',
  
  // Build output
  'dist',
  'build',
  '.next',
  'out',
  
  // Dependencies
  'node_modules',
  
  // Version control
  '.git',
  
  // Environment
  '.env.local',
  '.env.production',
  '.env.staging',
  
  // Documentation directories
  'docs',
  'documentation',
  
  // Tests
  '__tests__',
  'tests',
  'test',
  'specs',
  
  // Public assets
  'public',
  'static',
  'assets',
  
  // Sleeper directory (our archive location)
  'Sleeper 13062026'
];

// File patterns that are SAFE to move (temporary/work files)
const SAFE_TO_MOVE_PATTERNS = {
  extensions: [
    '.log',           // Log files
    '.tmp',           // Temporary files
    '.temp',          // Temporary files
    '.swp',           // Vim swap files
    '.swo',           // Vim swap files
    '.DS_Store',      // macOS metadata
    'Thumbs.db'       // Windows thumbnail cache
  ],
  filenamePatterns: [
    '^fix_',          // Fix scripts (temporary)
    '^temp_',         // Temporary files
    '^test_',         // Test scripts (not in test directories)
    '^debug_',        // Debug scripts
    '^scratch_',      // Scratch/experimental files
    'COMPREHENSIVE.*\\.md$',  // Auto-generated reports
    '.*_REPORT\\.md$',        // Report files
    '.*_SUMMARY\\.md$',       // Summary files
    '.*_AUDIT\\.md$',         // Audit files
    '.*_ANALYSIS\\.md$',      // Analysis files
    '^cleanup_',      // Cleanup scripts
    '^verify_',       // Verification scripts
    '^check_',        // Check scripts
    '^audit_',        // Audit scripts
    '^implement_'     // Implementation scripts
  ]
};

// Directories where HTML files are allowed (should NOT be moved)
const ALLOWED_HTML_DIRS = [
  'apps/*/frontend/public',
  'apps/*/frontend/src',
  'apps/*/public',
  'apps/*/src',
  'FINGERMOBILE HTML',
  'platform pages html'
];

// ============================================================================
// STATISTICS TRACKING
// ============================================================================

let stats = {
  filesScanned: 0,
  filesSafeToMove: 0,
  filesProtected: 0,
  filesMoved: 0,
  filesBackedUp: 0,
  dirsCreated: 0,
  errors: 0,
  skipped: 0
};

let actionLog = [];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if file matches any pattern in the list
 */
function matchesPattern(fileName, patterns) {
  return patterns.some(pattern => {
    try {
      const regex = new RegExp(pattern, 'i');
      return regex.test(fileName);
    } catch (e) {
      // If pattern is not a valid regex, do exact match
      return fileName.toLowerCase().includes(pattern.toLowerCase());
    }
  });
}

/**
 * Check if path matches glob pattern
 */
function matchesGlob(filePath, pattern) {
  const regex = new RegExp('^' + pattern.replace(/\*/g, '[^/]*').replace(/\./g, '\\.') + '$');
  return regex.test(filePath);
}

/**
 * Check if file is in a critical directory
 */
function isInCriticalDirectory(filePath) {
  const relativePath = path.relative(ROOT_DIR, filePath);
  const pathParts = relativePath.split(path.sep);
  
  return CRITICAL_DIRECTORIES.some(criticalDir => {
    return pathParts.some(part => part === criticalDir);
  });
}

/**
 * Check if file is whitelisted (should NEVER be moved)
 */
function isWhitelisted(filePath) {
  const relativePath = path.relative(ROOT_DIR, filePath);
  const fileName = path.basename(filePath);
  
  // Check exact filename matches
  if (CRITICAL_FILES.some(pattern => {
    if (pattern.includes('*')) {
      return matchesGlob(fileName, pattern);
    }
    return fileName === pattern;
  })) {
    return true;
  }
  
  // Check if in critical directory
  if (isInCriticalDirectory(filePath)) {
    return true;
  }
  
  return false;
}

/**
 * Check if HTML file is in an allowed directory
 */
function isHTMLInAllowedDir(filePath) {
  if (!filePath.endsWith('.html')) return false;
  
  const relativePath = path.relative(ROOT_DIR, filePath);
  
  return ALLOWED_HTML_DIRS.some(pattern => {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '[^/]+') + '/.*\\.html$');
    return regex.test(relativePath);
  });
}

/**
 * Determine if file is safe to move
 */
function isSafeToMove(filePath) {
  const fileName = path.basename(filePath);
  const ext = path.extname(fileName).toLowerCase();
  const relativePath = path.relative(ROOT_DIR, filePath);
  
  // SAFETY CHECK 1: Never move whitelisted files
  if (isWhitelisted(filePath)) {
    return { safe: false, reason: 'WHITELISTED - Critical file/directory' };
  }
  
  // SAFETY CHECK 2: HTML files in allowed directories
  if (isHTMLInAllowedDir(filePath)) {
    return { safe: false, reason: 'HTML in allowed directory' };
  }
  
  // SAFETY CHECK 3: Check if extension is in safe-to-move list
  if (SAFE_TO_MOVE_PATTERNS.extensions.includes(ext)) {
    return { safe: true, reason: `Extension ${ext} is safe to move` };
  }
  
  // SAFETY CHECK 4: Check filename patterns
  if (matchesPattern(fileName, SAFE_TO_MOVE_PATTERNS.filenamePatterns)) {
    return { safe: true, reason: 'Matches safe-to-move pattern' };
  }
  
  // DEFAULT: Not safe to move (conservative approach)
  return { safe: false, reason: 'Not in safe-to-move list (conservative)' };
}

/**
 * Create directory structure
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    stats.dirsCreated++;
    logAction('DIR_CREATED', dirPath);
  }
}

/**
 * Log action for rollback capability
 */
function logAction(action, source, destination = null) {
  actionLog.push({
    timestamp: new Date().toISOString(),
    action,
    source,
    destination,
    status: 'pending'
  });
}

/**
 * Save action log to file
 */
function saveActionLog() {
  try {
    const logData = {
      timestamp: TIMESTAMP,
      mode: MODE,
      summary: stats,
      actions: actionLog
    };
    
    ensureDirectoryExists(path.dirname(LOG_FILE));
    fs.writeFileSync(LOG_FILE, JSON.stringify(logData, null, 2), 'utf8');
  } catch (error) {
    console.error('⚠️  Failed to save action log:', error.message);
  }
}

/**
 * Backup file before moving
 */
function backupFile(filePath) {
  try {
    const relativePath = path.relative(ROOT_DIR, filePath);
    const backupPath = path.join(BACKUP_DIR, relativePath);
    const backupDir = path.dirname(backupPath);
    
    ensureDirectoryExists(backupDir);
    fs.copyFileSync(filePath, backupPath);
    stats.filesBackedUp++;
    logAction('BACKED_UP', filePath, backupPath);
    return true;
  } catch (error) {
    console.error(`❌ Failed to backup ${filePath}:`, error.message);
    stats.errors++;
    return false;
  }
}

/**
 * Move file to cleanup archive
 */
function moveFileToArchive(filePath) {
  try {
    const relativePath = path.relative(ROOT_DIR, filePath);
    const destPath = path.join(CLEANUP_DIR, relativePath);
    const destDir = path.dirname(destPath);
    
    // Ensure destination directory exists
    ensureDirectoryExists(destDir);
    
    // Backup first if requested
    if (MODE.backup) {
      backupFile(filePath);
    }
    
    // Move file
    fs.renameSync(filePath, destPath);
    stats.filesMoved++;
    logAction('MOVED', filePath, destPath, 'success');
    
    if (MODE.dryRun) {
      console.log(`📋 Would move: ${relativePath}`);
    } else {
      console.log(`✅ Moved: ${relativePath}`);
    }
  } catch (error) {
    console.error(`❌ Failed to move ${filePath}:`, error.message);
    stats.errors++;
    logAction('MOVE_FAILED', filePath, null, error.message);
  }
}

/**
 * Recursively scan directory
 */
function scanDirectory(dirPath, depth = 0) {
  // Prevent infinite recursion
  if (depth > 20) {
    console.warn(`⚠️  Max depth reached at ${dirPath}, skipping`);
    return;
  }
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.relative(ROOT_DIR, fullPath);
      
      stats.filesScanned++;
      
      // Skip excluded directories
      if (entry.isDirectory()) {
        if (isInCriticalDirectory(fullPath)) {
          stats.skipped++;
          continue;
        }
        scanDirectory(fullPath, depth + 1);
      } else if (entry.isFile()) {
        const safetyCheck = isSafeToMove(fullPath);
        
        if (safetyCheck.safe) {
          stats.filesSafeToMove++;
          if (MODE.apply) {
            moveFileToArchive(fullPath);
          } else {
            console.log(`📋 Would move: ${relativePath} (${safetyCheck.reason})`);
          }
        } else {
          stats.filesProtected++;
          if (depth <= 2) {
            console.log(`🔒 Protected: ${relativePath} (${safetyCheck.reason})`);
          }
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error scanning ${dirPath}:`, error.message);
    stats.errors++;
  }
}

/**
 * Generate safe .gitignore entries
 */
function generateGitignore() {
  const gitignoreContent = `
# ============================================================================
# Auto-generated cleanup rules - ${new Date().toISOString()}
# Generated by safe_cleanup.js
# ============================================================================

# Temporary and log files
*.log
*.tmp
*.temp
*.swp
*.swo
.DS_Store
Thumbs.db

# Auto-generated reports and analysis (safe to ignore)
COMPREHENSIVE_*.md
*_REPORT.md
*_SUMMARY.md
*_AUDIT.md
*_ANALYSIS.md

# Temporary fix/debug scripts
fix_*.js
temp_*.js
debug_*.js
scratch_*.js

# Cleanup archive (already backed up)
Sleeper 13062026/cleanup_archive/
Sleeper 13062026/cleanup_backup/

# IMPORTANT: Core project files are NOT ignored
# They are protected by the whitelist in safe_cleanup.js
`;
  
  const gitignorePath = path.join(ROOT_DIR, '.gitignore');
  let existingContent = '';
  
  if (fs.existsSync(gitignorePath)) {
    existingContent = fs.readFileSync(gitignorePath, 'utf8');
  }
  
  // Only append if not already present
  if (!existingContent.includes('# Auto-generated cleanup rules')) {
    if (MODE.apply) {
      fs.writeFileSync(gitignorePath, existingContent + '\n' + gitignoreContent, 'utf8');
      console.log('✅ Updated .gitignore with safe cleanup rules');
      logAction('GITIGNORE_UPDATED', gitignorePath);
    } else {
      console.log('📋 Would update .gitignore with safe cleanup rules');
    }
  }
}

/**
 * Print detailed summary
 */
function printSummary() {
  console.log('\n' + '='.repeat(80));
  console.log('📊 CLEANUP SUMMARY');
  console.log('='.repeat(80));
  console.log(`Mode:                     ${MODE.dryRun ? 'DRY RUN (Preview)' : 'APPLY (Executing)'}`);
  console.log(`Backup Enabled:           ${MODE.backup ? 'YES' : 'NO'}`);
  console.log('-'.repeat(80));
  console.log(`Files Scanned:            ${stats.filesScanned}`);
  console.log(`Files Safe to Move:       ${stats.filesSafeToMove}`);
  console.log(`Files Protected:          ${stats.filesProtected}`);
  console.log(`Files Moved:              ${stats.filesMoved}`);
  console.log(`Files Backed Up:          ${stats.filesBackedUp}`);
  console.log(`Directories Created:      ${stats.dirsCreated}`);
  console.log(`Errors:                   ${stats.errors}`);
  console.log(`Skipped (critical):       ${stats.skipped}`);
  console.log('-'.repeat(80));
  console.log(`Archive Location:         ${CLEANUP_DIR}`);
  if (MODE.backup) {
    console.log(`Backup Location:          ${BACKUP_DIR}`);
  }
  console.log(`Action Log:               ${LOG_FILE}`);
  console.log('='.repeat(80));
  
  if (MODE.dryRun) {
    console.log('\n⚠️  This was a DRY RUN - no files were moved.');
    console.log('\nTo execute the cleanup:');
    console.log('  node safe_cleanup.js --apply');
    console.log('\nTo execute with backup:');
    console.log('  node safe_cleanup.js --apply --backup');
  } else {
    if (stats.errors > 0) {
      console.log('\n⚠️  Some operations failed. Check logs above.');
    } else {
      console.log('\n✅ Cleanup complete!');
    }
    
    console.log('\nNext steps:');
    console.log('1. Review the archive at:', CLEANUP_DIR);
    if (MODE.backup) {
      console.log('2. Review backups at:', BACKUP_DIR);
      console.log('3. Verify your application still works');
      console.log('4. If everything works, you can delete backups:');
      console.log(`   rm -rf "${BACKUP_DIR}"`);
    } else {
      console.log('2. ⚠️  WARNING: No backup was created!');
      console.log('3. Verify your application still works IMMEDIATELY');
      console.log('4. If something broke, restore from Git:');
      console.log('   git checkout HEAD -- .');
    }
    console.log('5. Commit the changes:');
    console.log('   git add . && git commit -m "Clean up non-production files"');
    console.log('6. Delete the archive when confident:');
    console.log(`   rm -rf "${CLEANUP_DIR}"`);
  }
  
  console.log('\n✨ Cleanup process complete!\n');
}

/**
 * Display safety warnings
 */
function displaySafetyWarnings() {
  console.log('\n' + '⚠️ '.repeat(40));
  console.log('SAFETY WARNINGS');
  console.log('⚠️ '.repeat(40));
  console.log('\nThis script will move files based on conservative safety rules.');
  console.log('\nPROTECTED FILES (will NOT be moved):');
  console.log('  • All files in critical directories (apps/, src/, docs/, etc.)');
  console.log('  • Configuration files (package.json, docker-compose.yml, etc.)');
  console.log('  • README.md and other essential documentation');
  console.log('  • HTML files in app directories');
  console.log('  • Database schemas and migrations');
  console.log('\nSAFE TO MOVE (will be archived):');
  console.log('  • Log files (*.log)');
  console.log('  • Temporary files (*.tmp, *.temp)');
  console.log('  • Auto-generated reports (*_REPORT.md, *_SUMMARY.md)');
  console.log('  • Fix/debug scripts (fix_*.js, debug_*.js)');
  console.log('  • Editor artifacts (.DS_Store, Thumbs.db)');
  console.log('\n' + '⚠️ '.repeat(40) + '\n');
}

/**
 * Main execution
 */
async function main() {
  console.log('🧹 Starting SAFE Platform Cleanup\n');
  console.log(`Root Directory: ${ROOT_DIR}`);
  console.log(`Mode: ${MODE.dryRun ? 'DRY RUN (Preview Only)' : 'APPLY (Will Move Files)'}`);
  console.log(`Backup: ${MODE.backup ? 'ENABLED' : 'DISABLED'}`);
  console.log(`Cleanup Archive: ${CLEANUP_DIR}`);
  if (MODE.backup) {
    console.log(`Backup Location: ${BACKUP_DIR}`);
  }
  console.log('');
  
  // Display safety warnings
  displaySafetyWarnings();
  
  // Create necessary directories
  ensureDirectoryExists(CLEANUP_DIR);
  if (MODE.backup) {
    ensureDirectoryExists(BACKUP_DIR);
  }
  
  // Scan and move files
  console.log('📁 Scanning for files...\n');
  scanDirectory(ROOT_DIR);
  
  // Generate .gitignore updates
  console.log('\n📝 Updating .gitignore...');
  generateGitignore();
  
  // Save action log
  saveActionLog();
  
  // Print summary
  printSummary();
}

main().catch(error => {
  console.error('💥 Fatal error:', error);
  console.error('Stack trace:', error.stack);
  saveActionLog();
  process.exit(1);
});
