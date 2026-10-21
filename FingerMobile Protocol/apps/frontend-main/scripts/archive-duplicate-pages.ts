import fs from 'fs';
import path from 'path';

// Define the paths to check for duplicate auth pages
const pathsToCheck = [
  path.join(__dirname, '../src/pages'),
  path.join(__dirname, '../src/components'),
];

// Define the pages to look for (potential duplicates)
const authPagesToCheck = [
  'LoginPage',
  'RegisterPage',
  'SignupPage',
  'AuthenticationPage',
  'AuthPage'
];

// Create archive directory if it doesn't exist
const archiveDir = path.join(__dirname, '../src/pages/archive_duplicates');
if (!fs.existsSync(archiveDir)) {
  fs.mkdirSync(archiveDir, { recursive: true });
}

console.log('Scanning for potential duplicate auth pages...\n');

pathsToCheck.forEach(dirPath => {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory does not exist: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    // Check if the file name matches any auth page pattern (excluding the ones in auth subdirectory)
    const fileNameWithoutExt = path.parse(file).name;
    
    if (authPagesToCheck.includes(fileNameWithoutExt)) {
      // Skip if it's already in the auth subdirectory (the intended location)
      if (dirPath.includes('/auth/') || dirPath.includes('\\auth\\')) {
        console.log(`Skipping ${file} in auth directory (correct location)`);
        return;
      }
      
      // Skip if it's already marked as duplicate
      if (fileNameWithoutExt.startsWith('duplicate_')) {
        console.log(`Skipping already duplicated file: ${file}`);
        return;
      }
      
      const fullPath = path.join(dirPath, file);
      const archivePath = path.join(archiveDir, `duplicate_${file}`);
      
      console.log(`Archiving duplicate: ${fullPath} -> ${archivePath}`);
      
      // Move the file to archive
      fs.renameSync(fullPath, archivePath);
      console.log(`✓ Archived: ${file}\n`);
    }
  });
});

console.log('Duplicate page archiving complete!');
console.log(`\nCurrent archive location: ${archiveDir}`);

// List what's in the archive
const archivedFiles = fs.readdirSync(archiveDir);
console.log(`\nFiles currently in archive (${archivedFiles.length} total):`);
archivedFiles.forEach(file => {
  console.log(`  - ${file}`);
});