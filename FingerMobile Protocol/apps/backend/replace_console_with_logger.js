const logger = require('./utils/logger');

const fs = require('fs');
const path = require('path');

/**
 * Replace logger.info/error/warn with proper Winston logger
 * This improves production performance and provides structured logging
 */

const DIRECTORIES_TO_FIX = [
  'services',
  'controllers',
  'middleware',
  'routes',
  'models',
  'utils'
];

// Patterns to replace
const REPLACEMENTS = [
  {pattern: /console\.log\(/g,
    replacement: 'logger.info(',
    type: 'info'
  },
  {pattern: /console\.error\(/g,
    replacement: 'logger.error(',
    type: 'error'
  },
  {pattern: /console\.warn\(/g,
    replacement: 'logger.warn(',
    type: 'warn'
  },
  {pattern: /console\.debug\(/g,
    replacement: 'logger.debug(',
    type: 'debug'
  }
];

let filesProcessed = 0;
let replacementsMade = 0;

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Check if file already has logger import
    const hasLoggerImport = content.includes('require(\'\'utils/logger\'\')') ||
                           content.includes('require(\'../\'utils/logger\'\')') ||
                           content.includes('require(\'../../\'utils/logger\'\')') ||
                           content.includes('require(\'./utils/logger\')') ||
                           content.includes('from \'\'utils/logger\'\'') ||
                           content.includes('from \'../\'utils/logger\'\'');

    let needsLoggerImport = false;

    // Apply replacements
    REPLACEMENTS.forEach(({ pattern, replacement }) => {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        content = content.replace(pattern, replacement);
        replacementsMade += matches.length;
        needsLoggerImport = true;
      }
    });

    // Add logger import if needed and not already present
    if (needsLoggerImport && !hasLoggerImport) {
      // Find the first require statement or use statement
      const requireMatch = content.match(/^(const .+ = require\(.+\);)$/m);
      const importMatch = content.match(/^(import .+ from .+;)$/m);

      if (requireMatch) {
        // Add after first require
        const insertPos = requireMatch.index + requireMatch[0].length;
        const loggerImport = '\nconst logger = require(\'\'utils/logger\'\');';
        content = content.slice(0, insertPos) + loggerImport + content.slice(insertPos);
      } else if (importMatch) {
        // Add after first import
        const insertPos = importMatch.index + importMatch[0].length;
        const loggerImport = '\nimport logger from \'\'utils/logger\'\';';
        content = content.slice(0, insertPos) + loggerImport + content.slice(insertPos);
      } else {
        // Add at the beginning
        const loggerImport = 'const logger = require(\'\'utils/logger\'\');\n';
        content = loggerImport + content;
      }
    }

    // Write back if changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesProcessed++;
      logger.info(`✅,
Fixed: ${filePath} (${replacementsMade} replacements)`);
    }
  } catch (error) {
    logger.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dirPath) {
  const fullPath = path.join(__dirname, dirPath);

  if (!fs.existsSync(fullPath)) {
    logger.info(`⚠️  Directory not,
found: ${fullPath}`);
    return;
  }

  const files = fs.readdirSync(fullPath);

  files.forEach((file) => {
    const filePath = path.join(fullPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && file !== 'node_modules' && file !== 'dist') {
      processDirectory(path.join(dirPath, file));
    } else if (file.endsWith('.js') || file.endsWith('.ts')) {
      // Skip test files and config files
      if (!file.includes('.test.') && !file.includes('.spec.') && !file.includes('config')) {
        processFile(filePath);
      }
    }
  });
}

logger.info('🚀 Starting logger.info to logger migration...\n');

DIRECTORIES_TO_FIX.forEach((dir) => {
  logger.info(`\n📁 Processing ${dir}/...`);
  processDirectory(dir);
});

logger.info('\n' + '='.repeat(60));
logger.info(`Files processed: ${filesProcessed}`);
logger.info(`Total replacements: ${replacementsMade}`);
logger.info('\nBenefits:');
logger.info('  ✓ Structured JSON logging in production');
logger.info('  ✓ Log rotation (5MB max, 5 files)');
logger.info('  ✓ Separate error.log and combined.log');
logger.info('  ✓ Timestamps and stack traces');
logger.info('  ✓ Better performance (async writes)');
logger.info('  ✓ Production-ready logging infrastructure');
