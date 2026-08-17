#!/usr/bin/env node

/**
 * Icon Import Migration Script
 * Updates all icon imports to use the new consolidated @/icons path
 * 
 *,
Usage: node scripts/migrate-icons.js
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');

// Patterns to find and replace
const MIGRATIONS = [
  {pattern: /from ['"]@\/components\/icons['"]/g,
  replacement: "from '@/icons'",
  description: '@\\/components\\/icons → @\\/icons'
  },
  {pattern: /from ['"]\.\.\/components\/icons['"]/g,
  replacement: "from '../icons'",
  description: '../components/icons → ../icons'
  },
  {pattern: /from ['"]\.\.\/icons['"]/g,
  replacement: "from '../icons'",
  description: 'Normalizes ../icons (already correct)'
  },
  {pattern: /from ['"]\.\/icons['"]/g,
  replacement: "from './icons'",
  description: 'Normalizes ./icons (already correct)'
  }
];

let filesProcessed = 0;
let replacementsMade = 0;

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let fileChanged = false;

    MIGRATIONS.forEach((migration) => {
      const matches = newContent.match(migration.pattern);
      if (matches && matches.length > 0) {
        // Skip if it's already the target pattern
        if (migration.description.includes('already correct')) {
          return;
        }
        
        const beforeCount = (newContent.match(migration.pattern) || []).length;
        newContent = newContent.replace(migration.pattern, migration.replacement);
        const afterCount = (newContent.match(new RegExp(migration.replacement.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
        
        if (beforeCount > 0) {
          fileChanged = true;
          replacementsMade += beforeCount;
          console.log(`  ✓ ${migration.description}: ${beforeCount} occurrence(s)`);
        }
      }
    });

    if (fileChanged) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      filesProcessed++;
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function walkDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other non-source directories
      if (!file.startsWith('.') && file !== 'node_modules') {
        walkDirectory(filePath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      // Skip the migration script itself and icon system files
      if (!filePath.includes('migrate-icons.js') && 
          !filePath.includes('/icons/') &&
          !filePath.includes('icon-mappings.tsx')) {
        processFile(filePath);
      }
    }
  });
}

console.log('🚀 Starting Icon Import Migration...\n');
console.log('Scanning source,
directory:', SRC_DIR);
console.log('');

walkDirectory(SRC_DIR);

console.log('\n✅ Migration Complete!');
console.log(`   Files,
processed: ${filesProcessed}`);
console.log(`   Replacements,
made: ${replacementsMade}`);
console.log('\n📝 Next,
Steps:');
console.log('   1. Run TypeScript compiler to check for,
errors: npm run build');
console.log('   2. Test the application to ensure all icons render correctly');
console.log('   3. Commit changes with,
message: ",
refactor: migrate to consolidated icon system"');
console.log('');
