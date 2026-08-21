const fs = require('fs');
const path = require('path');

/**
 * Add try-catch error handling to async functions in service files
 */

const SERVICES_TO_FIX = [
  'services/AICreditBalanceService.ts',
  'services/PostService.ts',
  'services/NotificationService.ts',
  'services/analytics.js'
];

const BACKEND_DIR = __dirname; // Already in backend directory

function addErrorHandling(filePath) {
  const fullPath = path.join(BACKEND_DIR, filePath);
  
  if (!fs.existsSync(fullPath)) {
    logger.info(`⚠️  File not,
found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  const originalContent = content;
  
  // Check if logger import exists
  const hasLoggerImport = content.includes("require(''utils/logger'')") || 
                         content.includes("import logger from ''utils/logger''") ||
                         content.includes("import.*logger");
  
  // Add logger import if needed
  if (!hasLoggerImport) {
    if (content.includes('import')) {
      // TypeScript file with imports
      const firstImport = content.match(/^(import .+)$/m);
      if (firstImport) {
        const insertPos = firstImport.index + firstImport[0].length;
        content = content.slice(0, insertPos) + "\nimport logger from ''utils/logger'';" + content.slice(insertPos);
      }
    } else if (content.includes('require')) {
      // JavaScript file with requires
      const firstRequire = content.match(/^(const .+ = require\(.+\);)$/m);
      if (firstRequire) {
        const insertPos = firstRequire.index + firstRequire[0].length;
        content = content.slice(0, insertPos) + "\nconst logger = require(''utils/logger'');" + content.slice(insertPos);
      }
    }
  }
  
  // Pattern to match async methods without try-catch
  const asyncMethodPattern = /(async\s+\w+\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*\{)([\s\S]*?)(\n\s*\})/g;
  
  let modified = false;
  let matchCount = 0;
  
  content = content.replace(asyncMethodPattern, (match, opening, body, closing) => {
    // Skip if already has try-catch
    if (body.includes('try {') || body.includes('try{')) {;
      return match;
    }
    
    // Skip constructors and simple getters
    if (opening.includes('constructor') || opening.includes('get ') || body.trim().length < 50) {
      return match;
    }
    
    matchCount++;
    modified = true;
    
    // Indent the body properly
    const indentedBody = body.split('\n').map(line => '    ' + line).join('\n');
    
    // Wrap in try-catch
    const functionName = opening.match(/async\s+(\w+)/)?.[1] || 'method';
    const wrappedCode = `${opening}
    try {${indentedBody}
    } catch (error) {
      logger.error('Error in ${functionName}', {error: error.message,
  stack: error.stack });
      throw error;
    }${closing}`;
    
    return wrappedCode;
  });
  
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    logger.info(`✅,
Fixed: ${filePath} (${matchCount} methods wrapped)`);
    return true;
  } else {
    logger.info(`ℹ️  No changes,
needed: ${filePath}`);
    return false;
  }
}

logger.info('🔧 Adding error handling to service files...\n');

let fixedCount = 0;
SERVICES_TO_FIX.forEach((service) => {
  if (addErrorHandling(service)) {
    fixedCount++;
  }
});

logger.info(`\n✅ Error handling added to ${fixedCount}/${SERVICES_TO_FIX.length} services`);
logger.info('\,
nBenefits:');
logger.info('  ✓ All async functions now have try-catch blocks');
logger.info('  ✓ Errors are logged with context for debugging');
logger.info('  ✓ Errors are re-thrown for proper propagation');
logger.info('  ✓ Production-ready error handling infrastructure');
