#!/usr/bin/env node

/**
 * DUPLICATE FILE REMOVAL SCRIPT
 * 
 * This script safely removes 7 pairs of duplicate files identified in the platform audit.
 * 
 * SAFETY FEATURES:
 * - Dry-run mode by default (shows what would be deleted without actually deleting)
 * - Git backup verification before deletion
 * - Detailed logging of all actions
 * - Confirmation prompt before actual deletion
 * 
 * FILES TO BE REMOVED:
 * 
 * 1. /apps/frontend-main/src/pages/financials/MonetizationPage.tsx
 *    (Duplicate of /apps/frontend-main/src/pages/MonetizationPage.tsx)
 * 
 * 2. /apps/frontend-main/src/pages/auth/VerificationPage.tsx
 *    (Duplicate of /apps/frontend-main/src/pages/VerificationPage.tsx)
 * 
 * 3. /Business and Monetization Suite/src/components/StatusBadge.tsx
 *    (Duplicate of /Business and Monetization Suite/StatusBadge.tsx)
 * 
 * 4. /Business and Monetization Suite/src/components/ProgramCard.tsx
 *    (Duplicate of /Business and Monetization Suite/ProgramCard.tsx)
 * 
 * 5-7. Entire Sleeper Archive directory (unused):
 *    /FingerMobile Protocol/Sleeper 13062026/Platform Monetization Draft Acrchive/
 *    Contains: OverviewPage.tsx, RevenuePage.tsx, HallmarksPage.tsx, and other archived files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Base directory
const BASE_DIR = '/Users/user/Documents/FingerMobile Protocol Communication';

// Files to remove (relative paths from BASE_DIR)
const DUPLICATE_FILES = [
  // Frontend-main duplicates
  'FingerMobile Protocol/apps/frontend-main/src/pages/financials/MonetizationPage.tsx',
  'FingerMobile Protocol/apps/frontend-main/src/pages/auth/VerificationPage.tsx',
  
  // Business Suite component duplicates
  'FingerMobile Business and Monetization Suite/src/components/StatusBadge.tsx',
  'FingerMobile Business and Monetization Suite/src/components/ProgramCard.tsx',
];

// Directory to remove entirely (Sleeper archive - completely unused)
const ARCHIVE_DIR = 'FingerMobile Protocol/Sleeper 13062026/Platform Monetization Draft Acrchive';

/**
 * Check if git repository is clean
 */
function checkGitStatus() {
  try {
    console.log('🔍 Checking Git repository status...');
    const status = execSync('git status --porcelain', { 
      cwd: BASE_DIR,
      encoding: 'utf-8'
    }).trim();
    
    if (status) {
      console.warn('⚠️  WARNING: Git working directory has uncommitted changes!');
      console.warn('   Please commit or stash your changes before proceeding.\n');
      console.warn('   Uncommitted files:');
      console.log(status);
      return false;
    }
    
    console.log('✅ Git repository is clean\n');
    return true;
  } catch (error) {
    console.error('❌ Error checking Git status:', error.message);
    return false;
  }
}

/**
 * Verify file exists
 */
function fileExists(filePath) {
  const fullPath = path.join(BASE_DIR, filePath);
  return fs.existsSync(fullPath);
}

/**
 * Verify directory exists
 */
function dirExists(dirPath) {
  const fullPath = path.join(BASE_DIR, dirPath);
  return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
}

/**
 * Count lines in file
 */
function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.split('\n').length;
  } catch (error) {
    return 0;
  }
}

/**
 * Get file size in KB
 */
function getFileSizeKB(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return (stats.size / 1024).toFixed(2);
  } catch (error) {
    return 0;
  }
}

/**
 * List files in directory recursively
 */
function listDirectoryFiles(dirPath, indent = '') {
  const fullPath = path.join(BASE_DIR, dirPath);
  if (!fs.existsSync(fullPath)) return [];
  
  const files = [];
  const items = fs.readdirSync(fullPath);
  
  for (const item of items) {
    const itemPath = path.join(fullPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isFile()) {
      const relPath = path.join(dirPath, item);
      const lines = countLines(itemPath);
      const sizeKB = getFileSizeKB(itemPath);
      files.push({ path: relPath, lines, sizeKB });
    } else if (stat.isDirectory()) {
      const subFiles = listDirectoryFiles(path.join(dirPath, item), indent + '  ');
      files.push(...subFiles);
    }
  }
  
  return files;
}

/**
 * Display dry-run summary
 */
function displayDryRunSummary() {
  console.log('=' .repeat(80));
  console.log('DUPLICATE FILE REMOVAL - DRY RUN SUMMARY');
  console.log('=' .repeat(80));
  console.log();
  
  console.log('📋 FILES MARKED FOR DELETION:\n');
  
  let totalLines = 0;
  let totalSizeKB = 0;
  
  // Individual duplicate files
  console.log('Individual Duplicate Files:');
  DUPLICATE_FILES.forEach((file, index) => {
    const fullPath = path.join(BASE_DIR, file);
    if (fileExists(file)) {
      const lines = countLines(fullPath);
      const sizeKB = getFileSizeKB(fullPath);
      totalLines += lines;
      totalSizeKB += parseFloat(sizeKB);
      console.log(`  ${index + 1}. ${file}`);
      console.log(`     Lines: ${lines}, Size: ${sizeKB} KB`);
    } else {
      console.log(`  ${index + 1}. ${file} ⚠️  (NOT FOUND)`);
    }
  });
  
  console.log();
  
  // Archive directory
  console.log('Archive Directory (Entire):');
  if (dirExists(ARCHIVE_DIR)) {
    const archiveFiles = listDirectoryFiles(ARCHIVE_DIR);
    const archiveTotalLines = archiveFiles.reduce((sum, f) => sum + f.lines, 0);
    const archiveTotalSize = archiveFiles.reduce((sum, f) => sum + parseFloat(f.sizeKB), 0);
    totalLines += archiveTotalLines;
    totalSizeKB += archiveTotalSize;
    
    console.log(`  Directory: ${ARCHIVE_DIR}`);
    console.log(`  Files: ${archiveFiles.length}`);
    console.log(`  Total Lines: ${archiveTotalLines}`);
    console.log(`  Total Size: ${archiveTotalSize.toFixed(2)} KB`);
    console.log();
    console.log('  Sample files:');
    archiveFiles.slice(0, 5).forEach(f => {
      console.log(`    - ${f.path} (${f.lines} lines, ${f.sizeKB} KB)`);
    });
    if (archiveFiles.length > 5) {
      console.log(`    ... and ${archiveFiles.length - 5} more files`);
    }
  } else {
    console.log(`  ${ARCHIVE_DIR} ⚠️  (NOT FOUND)`);
  }
  
  console.log();
  console.log('-'.repeat(80));
  console.log(`TOTAL FILES TO DELETE: ${DUPLICATE_FILES.length + (dirExists(ARCHIVE_DIR) ? listDirectoryFiles(ARCHIVE_DIR).length : 0)}`);
  console.log(`TOTAL LINES TO REMOVE: ${totalLines}`);
  console.log(`TOTAL SIZE TO FREE: ${totalSizeKB.toFixed(2)} KB (${(totalSizeKB / 1024).toFixed(2)} MB)`);
  console.log('-'.repeat(80));
  console.log();
}

/**
 * Execute deletion
 */
function executeDeletion(dryRun = true) {
  if (dryRun) {
    displayDryRunSummary();
    console.log('✅ DRY RUN COMPLETE - No files were deleted\n');
    console.log('To perform actual deletion, run with: node remove_duplicates.js --execute\n');
    return;
  }
  
  console.log('⚠️  EXECUTING ACTUAL DELETION...\n');
  
  let deletedCount = 0;
  let errorCount = 0;
  
  // Delete individual files
  console.log('Deleting individual duplicate files:');
  DUPLICATE_FILES.forEach((file, index) => {
    const fullPath = path.join(BASE_DIR, file);
    if (fileExists(file)) {
      try {
        fs.unlinkSync(fullPath);
        console.log(`  ✅ Deleted: ${file}`);
        deletedCount++;
      } catch (error) {
        console.error(`  ❌ Failed to delete ${file}:`, error.message);
        errorCount++;
      }
    } else {
      console.log(`  ⚠️  Not found: ${file}`);
    }
  });
  
  console.log();
  
  // Delete archive directory
  console.log('Deleting archive directory:');
  if (dirExists(ARCHIVE_DIR)) {
    try {
      const archivePath = path.join(BASE_DIR, ARCHIVE_DIR);
      fs.rmSync(archivePath, { recursive: true, force: true });
      console.log(`  ✅ Deleted: ${ARCHIVE_DIR}/`);
      deletedCount++;
    } catch (error) {
      console.error(`  ❌ Failed to delete ${ARCHIVE_DIR}:`, error.message);
      errorCount++;
    }
  } else {
    console.log(`  ⚠️  Not found: ${ARCHIVE_DIR}`);
  }
  
  console.log();
  console.log('-'.repeat(80));
  console.log(`DELETION COMPLETE:`);
  console.log(`  Files/Directories Deleted: ${deletedCount}`);
  console.log(`  Errors: ${errorCount}`);
  console.log('-'.repeat(80));
  console.log();
  
  if (errorCount === 0) {
    console.log('✅ All duplicates successfully removed!\n');
    console.log('Next steps:');
    console.log('  1. Verify application still builds correctly');
    console.log('  2. Run tests to ensure no broken imports');
    console.log('  3. Commit changes to Git');
  } else {
    console.log('⚠️  Some deletions failed. Please review errors above.\n');
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🗑️  DUPLICATE FILE REMOVAL UTILITY\n');
  
  const args = process.argv.slice(2);
  const executeMode = args.includes('--execute');
  
  // Check Git status first
  const gitClean = checkGitStatus();
  if (!gitClean && executeMode) {
    console.error('❌ Aborting: Git working directory is not clean');
    console.error('   Please commit or stash changes before executing deletion\n');
    process.exit(1);
  }
  
  if (executeMode) {
    console.log('⚠️  WARNING: You are about to PERMANENTLY DELETE files!\n');
    console.log('This action CANNOT be undone unless you have Git backups.\n');
    
    // Final confirmation
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('Are you sure you want to proceed? Type "YES" to confirm: ', (answer) => {
      rl.close();
      if (answer === 'YES') {
        console.log();
        executeDeletion(false);
      } else {
        console.log('\n❌ Deletion cancelled by user\n');
        process.exit(0);
      }
    });
  } else {
    displayDryRunSummary();
    console.log('💡 To execute actual deletion, run:');
    console.log('   node remove_duplicates.js --execute\n');
  }
}

main();


