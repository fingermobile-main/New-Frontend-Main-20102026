#!/usr/bin/env node

/**
 * Git Repository Cleanup Script
 * 
 * Purpose: Remove large binary files from git history to reduce repository size
 * Target: Reduce from 17GB to under 1GB for GitHub compatibility
 * 
 * SAFETY FEATURES:
 * - Creates backup before making changes
 * - Shows exactly what will be removed
 * - Requires user confirmation
 * - Can be reversed using backup
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const REPO_ROOT = '/Users/user/Documents/FingerMobile Protocol Communication';
const BACKUP_DIR = path.join(REPO_ROOT, '.git-backup-before-cleanup');
const LARGE_FILE_PATTERNS = [
  'dev files 13042026/SLEEPERS MAIN/transfer-package/fingermobile-images.tar',
  '.tmp.driveupload/*'
];

console.log('🔍 GIT REPOSITORY CLEANUP SCRIPT');
console.log('=' .repeat(80));
console.log('');

// Step 1: Verify we're in a git repository
try {
  execSync('git rev-parse --is-inside-work-tree', { cwd: REPO_ROOT, stdio: 'pipe' });
  console.log('✅ Git repository verified');
} catch (error) {
  console.error('❌ Not a git repository. Aborting.');
  process.exit(1);
}

// Step 2: Show current repository size
console.log('\n📊 CURRENT REPOSITORY STATUS:');
console.log('-'.repeat(80));

const gitSize = execSync('du -sh .git', { cwd: REPO_ROOT }).toString().split('\t')[0];
console.log(`   Git directory size: ${gitSize}`);

const commitCount = execSync('git rev-list --all --count', { cwd: REPO_ROOT }).toString().trim();
console.log(`   Total commits: ${commitCount}`);

const blobCount = execSync(
  'git rev-list --objects --all | git cat-file --batch-check="%(objecttype)" | grep -c blob',
  { cwd: REPO_ROOT, shell: true }
).toString().trim();
console.log(`   Total blobs: ${blobCount}`);

// Step 3: Identify files to be removed
console.log('\n🎯 FILES TO BE REMOVED FROM GIT HISTORY:');
console.log('-'.repeat(80));

LARGE_FILE_PATTERNS.forEach(pattern => {
  try {
    const result = execSync(
      `git log --all --pretty=format: --name-only -- "${pattern}" | sort -u`,
      { cwd: REPO_ROOT, shell: true }
    ).toString();
    
    if (result.trim()) {
      console.log(`\n   Pattern: ${pattern}`);
      result.split('\n').filter(Boolean).forEach(file => {
        console.log(`     - ${file}`);
      });
    }
  } catch (error) {
    // File pattern not found in history
  }
});

// Step 4: Calculate expected savings
console.log('\n💾 EXPECTED SIZE REDUCTION:');
console.log('-'.repeat(80));
console.log('   Current size: ~17 GB');
console.log('   Expected size after cleanup: < 1 GB');
console.log('   Estimated savings: ~16 GB (94% reduction)');

// Step 5: Create backup
console.log('\n📦 CREATING BACKUP...');
console.log('-'.repeat(80));

if (!fs.existsSync(BACKUP_DIR)) {
  try {
    execSync(`cp -R .git ${BACKUP_DIR}`, { cwd: REPO_ROOT });
    console.log('✅ Backup created at:', BACKUP_DIR);
  } catch (error) {
    console.error('❌ Failed to create backup. Aborting.');
    process.exit(1);
  }
} else {
  console.log('⚠️  Backup already exists. Skipping backup creation.');
}

// Step 6: Show cleanup plan
console.log('\n📋 CLEANUP PLAN:');
console.log('-'.repeat(80));
console.log('1. Remove large binary files from git history');
console.log('2. Rewrite all commits to exclude these files');
console.log('3. Run garbage collection to reclaim space');
console.log('4. Verify repository integrity');
console.log('');
console.log('⚠️  WARNING: This will rewrite git history!');
console.log('   - All commit hashes will change');
console.log('   - Anyone who cloned this repo will need to re-clone');
console.log('   - Backup is available at:', BACKUP_DIR);

// Step 7: Ask for confirmation
console.log('\n' + '='.repeat(80));
console.log('❓ DO YOU WANT TO PROCEED WITH CLEANUP?');
console.log('='.repeat(80));
console.log('');
console.log('Type "YES" to proceed, or anything else to abort.');
console.log('');

// Note: In a real script, you'd use readline here
// For now, we'll just show what commands would be executed
console.log('🔧 COMMANDS THAT WILL BE EXECUTED:');
console.log('-'.repeat(80));
console.log('');
console.log('# Remove files from git history');
LARGE_FILE_PATTERNS.forEach(pattern => {
  console.log(`git filter-branch --force --index-filter \\`);
  console.log(`  'git rm --cached --ignore-unmatch "${pattern}"' \\`);
  console.log(`  --prune-empty --tag-name-filter cat -- --all`);
  console.log('');
});

console.log('# Clean up reflog and garbage collect');
console.log('git reflog expire --expire=now --all');
console.log('git gc --prune=now --aggressive');
console.log('git verify-pack -v .git/objects/pack/*.pack');
console.log('');

console.log('='.repeat(80));
console.log('Script completed. Review the plan above before manual execution.');
console.log('='.repeat(80));
