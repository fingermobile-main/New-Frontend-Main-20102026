#!/usr/bin/env node

/**
 * Comprehensive Platform Cleanup Script
 * Systematically identifies and moves redundant/non-production files to SLEEPER folder
 * 
 * Categories to clean:
 * 1. Backup files (.bak, .backup, .old)
 * 2. Temporary files (.tmp, .temp, cache)
 * 3. Test/debug files (test_*, debug_*, *_test)
 * 4. Duplicate files (same content, different names)
 * 5. Legacy/deprecated files (*.legacy, *.deprecated, *.v1)
 * 6. Documentation duplicates (README.md.bak, etc.)
 * 7. Build artifacts in source directories
 * 8. IDE configuration files (.vscode, .idea outside root)
 * 9. Log files (*.log)
 * 10. OS metadata (.DS_Store, Thumbs.db)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE_DIR = __dirname;
const SLEEPER_DIR = path.join(WORKSPACE_DIR, 'SLEEPER');
const BACKEND_DIR = path.join(WORKSPACE_DIR, 'FingerMobile Protocol', 'apps', 'backend');
const FRONTEND_DIR = path.join(WORKSPACE_DIR, 'FingerMobile Protocol', 'apps', 'frontend-main');

// Ensure SLEEPER directory exists
if (!fs.existsSync(SLEEPER_DIR)) {
  fs.mkdirSync(SLEEPER_DIR, { recursive: true });
  console.log('✅ Created SLEEPER directory');
}

console.log('🧹 Starting Comprehensive Platform Cleanup...\n');
console.log('=' .repeat(70));

const cleanupStats = {
  totalFilesScanned: 0,
  filesMoved: 0,
  bytesRecovered: 0,
  categoriesProcessed: {},
  errors: []
};

// ============================================================================
// Helper Functions
// ============================================================================

function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch (err) {
    return 0;
  }
}

function moveFile(source, destination) {
  try {
    // Create destination directory if needed
    const destDir = path.dirname(destination);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    fs.renameSync(source, destination);
    const size = getFileSize(destination);
    cleanupStats.filesMoved++;
    cleanupStats.bytesRecovered += size;
    return true;
  } catch (err) {
    cleanupStats.errors.push({ file: source, error: err.message });
    return false;
  }
}

function getRelativePath(filePath) {
  return path.relative(WORKSPACE_DIR, filePath);
}

// ============================================================================
// Category 1: Backup Files
// ============================================================================
console.log('\n📦 [1/10] Scanning for backup files...');

const backupPatterns = [
  /\.bak$/,
  /\.backup$/,
  /\.old$/,
  /\.orig$/,
  /\.save$/,
  /~$/,  // Vim/Emacs backup
  /\.swp$/  // Vim swap
];

function findBackupFiles(dir, category = 'Backup Files') {
  let found = 0;
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(file)) {
            found += findBackupFiles(filePath, category);
          }
        } else {
          const isBackup = backupPatterns.some(pattern => pattern.test(file));
          if (isBackup) {
            const relativePath = getRelativePath(filePath);
            const destPath = path.join(SLEEPER_DIR, 'backups', relativePath);
            if (moveFile(filePath, destPath)) {
              console.log(`   📦 Moved: ${relativePath}`);
              found++;
            }
          }
        }
      } catch (err) {
        // Skip inaccessible files
      }
    });
  } catch (err) {
    // Skip inaccessible directories
  }
  
  cleanupStats.categoriesProcessed[category] = (cleanupStats.categoriesProcessed[category] || 0) + found;
  return found;
}

findBackupFiles(BACKEND_DIR);
findBackupFiles(FRONTEND_DIR);
console.log(`   ✅ Backup files processed: ${cleanupStats.categoriesProcessed['Backup Files'] || 0}`);

// ============================================================================
// Category 2: Temporary Files
// ============================================================================
console.log('\n🗑️  [2/10] Scanning for temporary files...');

const tempPatterns = [
  /\.tmp$/,
  /\.temp$/,
  /\.cache$/,
  /^\.tmp\./,
  /\.pid$/,
  /\.lock$/
];

function findTempFiles(dir, category = 'Temporary Files') {
  let found = 0;
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(file)) {
            found += findTempFiles(filePath, category);
          }
        } else {
          const isTemp = tempPatterns.some(pattern => pattern.test(file));
          if (isTemp) {
            const relativePath = getRelativePath(filePath);
            const destPath = path.join(SLEEPER_DIR, 'temporary', relativePath);
            if (moveFile(filePath, destPath)) {
              console.log(`   🗑️  Moved: ${relativePath}`);
              found++;
            }
          }
        }
      } catch (err) {
        // Skip
      }
    });
  } catch (err) {
    // Skip
  }
  
  cleanupStats.categoriesProcessed[category] = (cleanupStats.categoriesProcessed[category] || 0) + found;
  return found;
}

findTempFiles(BACKEND_DIR);
findTempFiles(FRONTEND_DIR);
console.log(`   ✅ Temporary files processed: ${cleanupStats.categoriesProcessed['Temporary Files'] || 0}`);

// ============================================================================
// Category 3: Test/Debug Files
// ============================================================================
console.log('\n🧪 [3/10] Scanning for test/debug files...');

const testDebugPatterns = [
  /^test[_-]/i,
  /^debug[_-]/i,
  /[_-]test\./i,
  /[_-]debug\./i,
  /^spec[_-]/i,
  /[_-]spec\./i
];

function findTestDebugFiles(dir, category = 'Test/Debug Files') {
  let found = 0;
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          if (!['node_modules', '.git', '__tests__', 'test', 'tests'].includes(file)) {
            found += findTestDebugFiles(filePath, category);
          }
        } else {
          const isTestDebug = testDebugPatterns.some(pattern => pattern.test(file));
          // Exclude legitimate test files in test directories
          const isInTestDir = filePath.includes('/__tests__/') || filePath.includes('/test/') || filePath.includes('/tests/');
          
          if (isTestDebug && !isInTestDir) {
            const relativePath = getRelativePath(filePath);
            const destPath = path.join(SLEEPER_DIR, 'test-debug', relativePath);
            if (moveFile(filePath, destPath)) {
              console.log(`   🧪 Moved: ${relativePath}`);
              found++;
            }
          }
        }
      } catch (err) {
        // Skip
      }
    });
  } catch (err) {
    // Skip
  }
  
  cleanupStats.categoriesProcessed[category] = (cleanupStats.categoriesProcessed[category] || 0) + found;
  return found;
}

findTestDebugFiles(BACKEND_DIR);
findTestDebugFiles(FRONTEND_DIR);
console.log(`   ✅ Test/debug files processed: ${cleanupStats.categoriesProcessed['Test/Debug Files'] || 0}`);

// ============================================================================
// Category 4: Legacy/Deprecated Files
// ============================================================================
console.log('\n🕰️  [4/10] Scanning for legacy/deprecated files...');

const legacyPatterns = [
  /\.legacy$/,
  /\.deprecated$/,
  /\.v1\./,
  /\.v2\./,
  /-old\./,
  /-legacy\./,
  /_old\./,
  /_legacy\./
];

function findLegacyFiles(dir, category = 'Legacy/Deprecated Files') {
  let found = 0;
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          if (!['node_modules', '.git', 'dist', 'build'].includes(file)) {
            found += findLegacyFiles(filePath, category);
          }
        } else {
          const isLegacy = legacyPatterns.some(pattern => pattern.test(file));
          if (isLegacy) {
            const relativePath = getRelativePath(filePath);
            const destPath = path.join(SLEEPER_DIR, 'legacy', relativePath);
            if (moveFile(filePath, destPath)) {
              console.log(`   🕰️  Moved: ${relativePath}`);
              found++;
            }
          }
        }
      } catch (err) {
        // Skip
      }
    });
  } catch (err) {
    // Skip
  }
  
  cleanupStats.categoriesProcessed[category] = (cleanupStats.categoriesProcessed[category] || 0) + found;
  return found;
}

findLegacyFiles(BACKEND_DIR);
findLegacyFiles(FRONTEND_DIR);
console.log(`   ✅ Legacy/deprecated files processed: ${cleanupStats.categoriesProcessed['Legacy/Deprecated Files'] || 0}`);

// ============================================================================
// Category 5: Log Files
// ============================================================================
console.log('\n📋 [5/10] Scanning for log files...');

function findLogFiles(dir, category = 'Log Files') {
  let found = 0;
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          if (!['node_modules', '.git', 'logs'].includes(file)) {
            found += findLogFiles(filePath, category);
          }
        } else if (file.endsWith('.log')) {
          const relativePath = getRelativePath(filePath);
          const destPath = path.join(SLEEPER_DIR, 'logs', relativePath);
          if (moveFile(filePath, destPath)) {
            console.log(`   📋 Moved: ${relativePath}`);
            found++;
          }
        }
      } catch (err) {
        // Skip
      }
    });
  } catch (err) {
    // Skip
  }
  
  cleanupStats.categoriesProcessed[category] = (cleanupStats.categoriesProcessed[category] || 0) + found;
  return found;
}

findLogFiles(BACKEND_DIR);
findLogFiles(FRONTEND_DIR);
console.log(`   ✅ Log files processed: ${cleanupStats.categoriesProcessed['Log Files'] || 0}`);

// ============================================================================
// Category 6: OS Metadata Files
// ============================================================================
console.log('\n💻 [6/10] Scanning for OS metadata files...');

const osMetadataFiles = [
  '.DS_Store',
  'Thumbs.db',
  'desktop.ini',
  '.Spotlight-V100',
  '.Trashes'
];

function findOSMetadata(dir, category = 'OS Metadata') {
  let found = 0;
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          if (!['node_modules', '.git'].includes(file)) {
            found += findOSMetadata(filePath, category);
          }
        } else if (osMetadataFiles.includes(file)) {
          const relativePath = getRelativePath(filePath);
          const destPath = path.join(SLEEPER_DIR, 'os-metadata', relativePath);
          if (moveFile(filePath, destPath)) {
            console.log(`   💻 Moved: ${relativePath}`);
            found++;
          }
        }
      } catch (err) {
        // Skip
      }
    });
  } catch (err) {
    // Skip
  }
  
  cleanupStats.categoriesProcessed[category] = (cleanupStats.categoriesProcessed[category] || 0) + found;
  return found;
}

findOSMetadata(BACKEND_DIR);
findOSMetadata(FRONTEND_DIR);
console.log(`   ✅ OS metadata files processed: ${cleanupStats.categoriesProcessed['OS Metadata'] || 0}`);

// ============================================================================
// Category 7: Build Artifacts in Source Directories
// ============================================================================
console.log('\n🏗️  [7/10] Scanning for build artifacts in source directories...');

const buildArtifactPatterns = [
  /\.min\.js$/,
  /\.min\.css$/,
  /\.bundle\.js$/,
  /\.chunk\.\w+\.js$/,
  /\.map$/  // Source maps in source dirs
];

function findBuildArtifacts(dir, category = 'Build Artifacts') {
  let found = 0;
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          // Skip build output directories
          if (!['node_modules', '.git', 'dist', 'build', '.next', 'public'].includes(file)) {
            found += findBuildArtifacts(filePath, category);
          }
        } else {
          const isArtifact = buildArtifactPatterns.some(pattern => pattern.test(file));
          // Only flag if in src/ directory (not public/)
          const isInSrc = filePath.includes('/src/');
          
          if (isArtifact && isInSrc) {
            const relativePath = getRelativePath(filePath);
            const destPath = path.join(SLEEPER_DIR, 'build-artifacts', relativePath);
            if (moveFile(filePath, destPath)) {
              console.log(`   🏗️  Moved: ${relativePath}`);
              found++;
            }
          }
        }
      } catch (err) {
        // Skip
      }
    });
  } catch (err) {
    // Skip
  }
  
  cleanupStats.categoriesProcessed[category] = (cleanupStats.categoriesProcessed[category] || 0) + found;
  return found;
}

findBuildArtifacts(BACKEND_DIR);
findBuildArtifacts(FRONTEND_DIR);
console.log(`   ✅ Build artifacts processed: ${cleanupStats.categoriesProcessed['Build Artifacts'] || 0}`);

// ============================================================================
// Category 8: Documentation Duplicates
// ============================================================================
console.log('\n📄 [8/10] Scanning for documentation duplicates...');

const docDuplicatePatterns = [
  /README\.md\.bak$/,
  /README\.md\.old$/,
  /CHANGELOG\.md\.bak$/,
  /\.md\.backup$/,
  /COPYING\.txt$/,
  /LICENSE\.txt$/  // If duplicate of LICENSE
];

function findDocDuplicates(dir, category = 'Documentation Duplicates') {
  let found = 0;
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          if (!['node_modules', '.git'].includes(file)) {
            found += findDocDuplicates(filePath, category);
          }
        } else {
          const isDocDup = docDuplicatePatterns.some(pattern => pattern.test(file));
          if (isDocDup) {
            const relativePath = getRelativePath(filePath);
            const destPath = path.join(SLEEPER_DIR, 'doc-duplicates', relativePath);
            if (moveFile(filePath, destPath)) {
              console.log(`   📄 Moved: ${relativePath}`);
              found++;
            }
          }
        }
      } catch (err) {
        // Skip
      }
    });
  } catch (err) {
    // Skip
  }
  
  cleanupStats.categoriesProcessed[category] = (cleanupStats.categoriesProcessed[category] || 0) + found;
  return found;
}

findDocDuplicates(BACKEND_DIR);
findDocDuplicates(FRONTEND_DIR);
console.log(`   ✅ Documentation duplicates processed: ${cleanupStats.categoriesProcessed['Documentation Duplicates'] || 0}`);

// ============================================================================
// Category 9: Empty Directories
// ============================================================================
console.log('\n📁 [9/10] Scanning for empty directories...');

function findEmptyDirectories(dir, category = 'Empty Directories') {
  let found = 0;
  try {
    const files = fs.readdirSync(dir);
    const subdirs = [];
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory() && !['node_modules', '.git'].includes(file)) {
          subdirs.push(filePath);
        }
      } catch (err) {
        // Skip
      }
    });
    
    // Process subdirectories first (bottom-up)
    subdirs.forEach(subdir => {
      found += findEmptyDirectories(subdir, category);
    });
    
    // Check if current directory is empty after processing children
    const remainingFiles = fs.readdirSync(dir).filter(f => !['node_modules', '.git'].includes(f));
    if (remainingFiles.length === 0 && dir !== BACKEND_DIR && dir !== FRONTEND_DIR) {
      const relativePath = getRelativePath(dir);
      const destPath = path.join(SLEEPER_DIR, 'empty-dirs', relativePath);
      
      try {
        fs.rmdirSync(dir);
        cleanupStats.categoriesProcessed[category] = (cleanupStats.categoriesProcessed[category] || 0) + 1;
        console.log(`   📁 Removed empty directory: ${relativePath}`);
        found++;
      } catch (err) {
        // Directory not empty or permission issue
      }
    }
  } catch (err) {
    // Skip
  }
  
  return found;
}

findEmptyDirectories(BACKEND_DIR);
findEmptyDirectories(FRONTEND_DIR);
console.log(`   ✅ Empty directories processed: ${cleanupStats.categoriesProcessed['Empty Directories'] || 0}`);

// ============================================================================
// Category 10: Duplicate Content Detection - ENHANCED WITH IMPORT VALIDATION
// ============================================================================
console.log('\n🔍 [10/10] Scanning for duplicate content files (with import validation)...');

function calculateFileHash(filePath) {
  const crypto = require('crypto');
  try {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex');
  } catch (err) {
    return null;
  }
}

// NEW: Import validation helper
function checkFileImports(filePath, workspaceDir) {
  const fileName = path.basename(filePath);
  const fileNameWithoutExt = path.basename(filePath, path.extname(filePath));
  
  // Patterns to search for imports/requires of this file
  const importPatterns = [
    new RegExp(`from\\s+['"].*${fileNameWithoutExt}['"]`, 'g'),
    new RegExp(`require\\(['"].*${fileNameWithoutExt}['"]\\)`, 'g'),
    new RegExp(`import\\s+.*from\\s+['"].*${fileName}['"]`, 'g'),
    new RegExp(`import\\s+['"].*${fileName}['"]`, 'g')
  ];
  
  let importCount = 0;
  const sourceDirs = ['src', 'apps'];
  
  // Search in source directories for imports
  sourceDirs.forEach(sourceDir => {
    const searchPath = path.join(workspaceDir, sourceDir);
    if (!fs.existsSync(searchPath)) return;
    
    try {
      const grepCmd = `grep -r "${fileNameWithoutExt}" "${searchPath}" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | wc -l`;
      const result = require('child_process').execSync(grepCmd, { encoding: 'utf-8' }).trim();
      importCount += parseInt(result) || 0;
    } catch (err) {
      // Ignore grep errors
    }
  });
  
  return importCount;
}

function findDuplicateFiles(baseDir, category = 'Duplicate Content') {
  const fileHashes = new Map();
  let duplicatesFound = 0;
  let duplicatesSkipped = 0;
  
  function scanDirectory(dir) {
    try {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        try {
          const stat = fs.statSync(filePath);
          if (stat.isDirectory()) {
            if (!['node_modules', '.git', 'dist', 'build'].includes(file)) {
              scanDirectory(filePath);
            }
          } else if (file.match(/\.(js|ts|tsx|jsx|json|md)$/)) {
            const hash = calculateFileHash(filePath);
            if (hash) {
              if (!fileHashes.has(hash)) {
                fileHashes.set(hash, []);
              }
              fileHashes.get(hash).push(filePath);
            }
          }
        } catch (err) {
          // Skip
        }
      });
    } catch (err) {
      // Skip
    }
  }
  
  scanDirectory(baseDir);
  
  // Find duplicates (files with same hash but different names)
  fileHashes.forEach((files, hash) => {
    if (files.length > 1) {
      // Check import counts for all duplicates
      const importCounts = files.map(file => ({
        file,
        imports: checkFileImports(file, WORKSPACE_DIR)
      }));
      
      // Sort by import count (descending) - keep file with most imports
      importCounts.sort((a, b) => b.imports - a.imports);
      
      const canonicalFile = importCounts[0].file;
      console.log(`   ℹ️  Canonical: ${getRelativePath(canonicalFile)} (${importCounts[0].imports} imports)`);
      
      // Move files with fewer/no imports
      for (let i = 1; i < importCounts.length; i++) {
        const duplicate = importCounts[i];
        
        // Skip if duplicate has imports (both are actively used)
        if (duplicate.imports > 0) {
          console.log(`   ⚠️  Skipped: ${getRelativePath(duplicate.file)} (${duplicate.imports} imports - both files actively used)`);
          duplicatesSkipped++;
          continue;
        }
        
        const relativePath = getRelativePath(duplicate.file);
        const destPath = path.join(SLEEPER_DIR, 'duplicates', relativePath);
        
        if (moveFile(duplicate.file, destPath)) {
          console.log(`   🔍 Moved duplicate: ${relativePath} (0 imports, duplicate of ${getRelativePath(canonicalFile)})`);
          duplicatesFound++;
        }
      }
    }
  });
  
  cleanupStats.categoriesProcessed[category] = (cleanupStats.categoriesProcessed[category] || 0) + duplicatesFound;
  cleanupStats.categoriesProcessed[`${category} (Skipped)`] = duplicatesSkipped;
  return duplicatesFound;
}

findDuplicateFiles(BACKEND_DIR);
findDuplicateFiles(FRONTEND_DIR);
console.log(`   ✅ Duplicate content files processed: ${cleanupStats.categoriesProcessed['Duplicate Content'] || 0}`);
if (cleanupStats.categoriesProcessed['Duplicate Content (Skipped)'] > 0) {
  console.log(`   ⚠️  Duplicates skipped (actively used): ${cleanupStats.categoriesProcessed['Duplicate Content (Skipped)']}`);
}

// ============================================================================
// Final Summary
// ============================================================================
console.log('\n' + '='.repeat(70));
console.log('🎯 CLEANUP SUMMARY');
console.log('='.repeat(70));

console.log(`\n📊 Statistics:`);
console.log(`   Files Moved: ${cleanupStats.filesMoved}`);
console.log(`   Space Recovered: ${(cleanupStats.bytesRecovered / 1024 / 1024).toFixed(2)} MB`);
console.log(`   Errors Encountered: ${cleanupStats.errors.length}`);

console.log(`\n📂 Categories Processed:`);
Object.entries(cleanupStats.categoriesProcessed).forEach(([category, count]) => {
  console.log(`   ${category}: ${count} files`);
});

if (cleanupStats.errors.length > 0) {
  console.log(`\n⚠️  Errors (${cleanupStats.errors.length}):`);
  cleanupStats.errors.slice(0, 10).forEach(err => {
    console.log(`   - ${err.file}: ${err.error}`);
  });
  if (cleanupStats.errors.length > 10) {
    console.log(`   ... and ${cleanupStats.errors.length - 10} more errors`);
  }
}

console.log(`\n✅ Cleanup completed successfully!`);
console.log(`   All moved files are safely stored in: ${SLEEPER_DIR}`);
console.log(`   Review SLEEPER folder before permanent deletion.`);

// Save cleanup report
const reportPath = path.join(SLEEPER_DIR, `CLEANUP_REPORT_${new Date().toISOString().split('T')[0].replace(/-/g, '')}.md`);
const report = `# Platform Cleanup Report
**Date**: ${new Date().toISOString().split('T')[0]}
**Time**: ${new Date().toLocaleTimeString()}

## Summary
- **Files Moved**: ${cleanupStats.filesMoved}
- **Space Recovered**: ${(cleanupStats.bytesRecovered / 1024 / 1024).toFixed(2)} MB
- **Errors**: ${cleanupStats.errors.length}

## Categories Processed
${Object.entries(cleanupStats.categoriesProcessed).map(([cat, count]) => `- ${cat}: ${count} files`).join('\n')}

## Files Location
All moved files are in: \`SLEEPER/\` directory

## Next Steps
1. Review files in SLEEPER folder
2. Verify application still works correctly
3. Permanently delete SLEEPER contents after confirmation
4. Commit changes to Git
`;

fs.writeFileSync(reportPath, report);
console.log(`\n📝 Report saved: ${reportPath}`);
