#!/usr/bin/env node

/**
 * COMPREHENSIVE BACKEND RESTORATION SCRIPT
 * 
 * PURPOSE: Restore ALL missing backend folders and files from DEV 502294c Reverts backup
 * 
 * CRITICAL ISSUE: During cleanup process, essential backend directories were mistakenly removed:
 * - controllers (433 files)
 * - routes (171 files) 
 * - models (41 files)
 * - services (105 files)
 * - middleware (27 files)
 * - utils (7 files)
 * - config (8 files)
 * - database (3 files)
 * - security (11 files)
 * - schemas (3 files)
 * - scripts (11 files)
 * - monitoring (1 file)
 * - websocket (1 file)
 * - logs (39 files)
 * - db (5 files)
 * - constants (1 file)
 * - types (3 files)
 * 
 * CSV IMPORT IMPLEMENTATION: Also restores CSV import functionality including:
 * - csvImportController.js
 * - csvImportService.js  
 * - csvImport.js route
 * - Proper registration in app.js
 * 
 * SOURCE: /Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/DEV 502294c Reverts/backend/
 * DESTINATION: /Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps/backend/
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BACKUP_DIR = path.join(__dirname, 'FingerMobile Protocol', 'DEV 502294c Reverts', 'backend');
const TARGET_DIR = path.join(__dirname, 'FingerMobile Protocol', 'apps', 'backend');

// Directories to restore (excluding already existing ones)
const DIRECTORIES_TO_RESTORE = [
  'controllers',
  'routes', 
  'models',
  'services',
  'middleware',
  'utils',
  'config',
  'database',
  'security',
  'schemas',
  'scripts',
  'monitoring',
  'websocket',
  'logs',
  'db',
  'constants',
  'types'
];

// Files to restore at root level
const ROOT_FILES_TO_RESTORE = [
  'app.js',
  'server.js',
  'server.ts',
  'package.json',
  'package-lock.json',
  '.env',
  '.env.example',
  '.env.staging',
  '.eslintrc.json',
  '.prettierrc.json',
  'Dockerfile',
  'Dockerfile.staging',
  'docker-compose.staging.yml',
  'tsconfig.json',
  'tsconfig.test.json',
  'knockfile.ts',
  'jest.config.json',
  'jest.setup.js',
  'start.js',
  'db.js',
  'initTables.js',
  'protocolClient.js',
  'protocolServer.js',
  'wsServer.js',
  'nginx-staging.conf',
  '.dockerignore',
  '.gitignore',
  '.env.paystack.template',
  '.env.staging.template'
];

// Special handling for CSV import route registration
const CSV_IMPORT_ROUTE_REGISTRATION = `
// Import CSV import routes
const csvImportRoutes = require("./routes/csvImport");
`;

const CSV_IMPORT_ROUTE_USAGE = `
// CSV Import routes
app.use("/api/csv-import", csvImportRoutes);
`;

/**
 * Copy directory recursively
 */
function copyDirectory(src, dest) {
  try {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
      console.log(`✓ Created directory: ${dest}`);
    }

    // Read source directory
    const entries = fs.readdirSync(src, { withFileTypes: true });

    let copiedFiles = 0;
    let copiedDirs = 0;

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules to avoid copying dependencies
        if (entry.name === 'node_modules') {
          console.log(`⊘ Skipping node_modules directory`);
          continue;
        }
        
        const result = copyDirectory(srcPath, destPath);
        copiedFiles += result.copiedFiles;
        copiedDirs += result.copiedDirs + 1;
      } else {
        // Copy file
        fs.copyFileSync(srcPath, destPath);
        copiedFiles++;
      }
    }

    return { copiedFiles, copiedDirs };
  } catch (error) {
    console.error(`✗ Error copying directory ${src}:`, error.message);
    throw error;
  }
}

/**
 * Copy a single file
 */
function copyFile(src, dest) {
  try {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`✓ Copied file: ${path.basename(src)}`);
      return true;
    } else {
      console.log(`⊘ File not found: ${src}`);
      return false;
    }
  } catch (error) {
    console.error(`✗ Error copying file ${src}:`, error.message);
    return false;
  }
}

/**
 * Check if CSV import route is already registered in app.js
 */
function checkCsvImportRegistration(appJsPath) {
  try {
    if (!fs.existsSync(appJsPath)) {
      return { hasImport: false, hasUsage: false };
    }

    const content = fs.readFileSync(appJsPath, 'utf8');
    const hasImport = content.includes('csvImportRoutes') || content.includes('csvImport');
    const hasUsage = content.includes('/api/csv-import') || content.includes('csv-import');
    
    return { hasImport, hasUsage };
  } catch (error) {
    console.error('Error checking CSV import registration:', error.message);
    return { hasImport: false, hasUsage: false };
  }
}

/**
 * Add CSV import route registration to app.js
 */
function addCsvImportRegistration(appJsPath) {
  try {
    if (!fs.existsSync(appJsPath)) {
      console.log('⊘ app.js not found, skipping CSV import registration');
      return false;
    }

    let content = fs.readFileSync(appJsPath, 'utf8');
    const registration = checkCsvImportRegistration(appJsPath);

    // Add import statement if not present
    if (!registration.hasImport) {
      // Find the section where other CSV import is mentioned or add after other route imports
      const importInsertionPoint = content.indexOf('// Import CSV import routes');
      
      if (importInsertionPoint !== -1) {
        console.log('✓ CSV import route already has import statement');
      } else {
        // Find a good place to insert - after other route imports
        const lastRouteImport = content.lastIndexOf('require("./routes/');
        if (lastRouteImport !== -1) {
          const lineEnd = content.indexOf('\n', lastRouteImport);
          const insertionPoint = lineEnd !== -1 ? lineEnd + 1 : lastRouteImport;
          
          content = content.slice(0, insertionPoint) + 
                    CSV_IMPORT_ROUTE_REGISTRATION + 
                    content.slice(insertionPoint);
          
          console.log('✓ Added CSV import route import statement');
        }
      }
    }

    // Add route usage if not present
    if (!registration.hasUsage) {
      // Find where to insert the route usage - after other route registrations
      const routeUsagePattern = 'app.use("/api/';
      const lastRouteUsage = content.lastIndexOf(routeUsagePattern);
      
      if (lastRouteUsage !== -1) {
        // Find the end of this line
        const lineEnd = content.indexOf('\n', lastRouteUsage);
        const insertionPoint = lineEnd !== -1 ? lineEnd + 1 : lastRouteUsage;
        
        content = content.slice(0, insertionPoint) + 
                  CSV_IMPORT_ROUTE_USAGE + 
                  content.slice(insertionPoint);
        
        console.log('✓ Added CSV import route usage');
      }
    }

    // Write updated content
    fs.writeFileSync(appJsPath, content, 'utf8');
    console.log('✓ Updated app.js with CSV import registration');
    return true;
  } catch (error) {
    console.error('✗ Error updating app.js:', error.message);
    return false;
  }
}

/**
 * Main restoration function
 */
async function restoreBackend() {
  console.log('='.repeat(80));
  console.log('BACKEND RESTORATION SCRIPT');
  console.log('='.repeat(80));
  console.log('');
  console.log('Source:', BACKUP_DIR);
  console.log('Target:', TARGET_DIR);
  console.log('');

  // Verify backup directory exists
  if (!fs.existsSync(BACKUP_DIR)) {
    console.error('✗ ERROR: Backup directory not found:', BACKUP_DIR);
    console.error('Please verify the backup location and try again.');
    process.exit(1);
  }

  // Verify target directory exists
  if (!fs.existsSync(TARGET_DIR)) {
    console.error('✗ ERROR: Target directory not found:', TARGET_DIR);
    console.error('Please verify the target location and try again.');
    process.exit(1);
  }

  console.log('✓ Backup directory verified');
  console.log('✓ Target directory verified');
  console.log('');

  let totalFilesCopied = 0;
  let totalDirsCopied = 0;
  let errors = [];

  // Step 1: Restore directories
  console.log('-'.repeat(80));
  console.log('STEP 1: Restoring Missing Directories');
  console.log('-'.repeat(80));
  
  for (const dirName of DIRECTORIES_TO_RESTORE) {
    const srcDir = path.join(BACKUP_DIR, dirName);
    const destDir = path.join(TARGET_DIR, dirName);

    if (fs.existsSync(srcDir)) {
      try {
        console.log(`\nRestoring: ${dirName}/`);
        const result = copyDirectory(srcDir, destDir);
        totalFilesCopied += result.copiedFiles;
        totalDirsCopied += result.copiedDirs;
        console.log(`  ✓ Copied ${result.copiedFiles} files, ${result.copiedDirs} subdirectories`);
      } catch (error) {
        errors.push({ directory: dirName, error: error.message });
        console.error(`  ✗ Failed to restore ${dirName}:`, error.message);
      }
    } else {
      console.log(`  ⊘ Directory not found in backup: ${dirName}`);
    }
  }

  console.log('');
  console.log('-'.repeat(80));
  console.log('STEP 2: Restoring Root-Level Files');
  console.log('-'.repeat(80));

  // Step 2: Restore root-level files
  for (const fileName of ROOT_FILES_TO_RESTORE) {
    const srcFile = path.join(BACKUP_DIR, fileName);
    const destFile = path.join(TARGET_DIR, fileName);
    
    if (copyFile(srcFile, destFile)) {
      totalFilesCopied++;
    }
  }

  console.log('');
  console.log('-'.repeat(80));
  console.log('STEP 3: Verifying CSV Import Implementation');
  console.log('-'.repeat(80));

  // Step 3: Verify and register CSV import routes
  const csvControllerExists = fs.existsSync(path.join(TARGET_DIR, 'controllers', 'csvImportController.js'));
  const csvServiceExists = fs.existsSync(path.join(TARGET_DIR, 'services', 'csvImportService.js'));
  const csvRouteExists = fs.existsSync(path.join(TARGET_DIR, 'routes', 'csvImport.js'));

  console.log(`CSV Import Controller: ${csvControllerExists ? '✓' : '✗'}`);
  console.log(`CSV Import Service: ${csvServiceExists ? '✓' : '✗'}`);
  console.log(`CSV Import Route: ${csvRouteExists ? '✓' : '✗'}`);

  if (csvControllerExists && csvServiceExists && csvRouteExists) {
    console.log('\n✓ All CSV import files restored');
    
    // Register CSV import routes in app.js
    const appJsPath = path.join(TARGET_DIR, 'app.js');
    addCsvImportRegistration(appJsPath);
  } else {
    console.log('\n✗ Some CSV import files are missing');
  }

  console.log('');
  console.log('='.repeat(80));
  console.log('RESTORATION SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total files copied: ${totalFilesCopied}`);
  console.log(`Total directories restored: ${totalDirsCopied}`);
  console.log(`Errors encountered: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log('\nErrors:');
    errors.forEach(err => {
      console.log(`  - ${err.directory}: ${err.error}`);
    });
  }

  console.log('');
  console.log('='.repeat(80));
  
  if (errors.length === 0) {
    console.log('✓ RESTORATION COMPLETED SUCCESSFULLY');
    console.log('='.repeat(80));
    console.log('\nNext steps:');
    console.log('1. Verify all directories are present in:', TARGET_DIR);
    console.log('2. Run: npm install (to install dependencies)');
    console.log('3. Verify CSV import endpoints are working');
    console.log('4. Test the platform functionality');
    console.log('');
  } else {
    console.log('✗ RESTORATION COMPLETED WITH ERRORS');
    console.log('='.repeat(80));
    console.log('\nPlease review the errors above and address them manually.');
    console.log('');
  }
}

// Execute the restoration
if (require.main === module) {
  restoreBackend().catch(error => {
    console.error('\n✗ FATAL ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  });
}

module.exports = { restoreBackend, copyDirectory, copyFile };
