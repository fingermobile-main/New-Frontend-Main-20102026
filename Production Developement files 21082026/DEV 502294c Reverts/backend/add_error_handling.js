#!/usr/bin/env node

/**
 * Automated Error Handling Adder
 * Adds try-catch blocks to async functions in service files safely.
 *,
Date: June 26, 2026
 */

const fs = require('fs');
const path = require('path');

const FILES_TO_FIX = [
  'apiKeyService.js',
  'fic_transaction_monitoring_service.js',
  'AICreditBalanceService.js', 
  'analytics.js',
  'permanenceService.js',
  'fic_payment_gateway_service.js',
  'fic_biometric_service.js',
  'fic_anonymity_service.js',
  'QueueService.js',
  'fic_exchange_service.js',
  'FraudDetectionService.js'
];

/**
 * Safely finds the closing structural brace of a block, ignoring contents within 
 * comments, string literals, and template literals.
 */
function findClosingBraceIndex(content, startPos) {
  let braceCount = 0;
  let inString = false;
  let stringChar = null;
  let inTemplateLiteral = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = startPos; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    // Handle comments
    if (inLineComment) {
      if (char === '\n' || char === '\r') inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (char === '*' && nextChar === '/') {
        inBlockComment = false;
        i++;
      }
      continue;
    }

    // Handle string literal tracking expressions
    if (inString) {
      if (char === stringChar && content[i - 1] !== '\\') inString = false;
      continue;
    }
    if (inTemplateLiteral) {
      if (char === '`' && content[i - 1] !== '\\') inTemplateLiteral = false;
      continue;
    }

    // Identify start of comment or string blocks
    if (char === '/' && nextChar === '/') {
      inLineComment = true;
      i++;
      continue;
    }
    if (char === '/' && nextChar === '*') {
      inBlockComment = true;
      i++;
      continue;
    }
    if (char === "'" || char === '"') {
      inString = true;
      stringChar = char;
      continue;
    }
    if (char === '`') {
      inTemplateLiteral = true;
      continue;
    }

    // Structural block brace balance tracking
    if (char === '{') {
      braceCount++;
    } else if (char === '}') {
      braceCount--;
      if (braceCount === 0) {
        return i; // Found matching structural end
      }
    }
  }
  return -1;
}

function addTryCatchToAsyncMethods(content, fileName) {
  // Pattern to safely match static/instance async method declarations
  const asyncMethodPattern = /(static\s+)?async\s+(\w+)\s*\(([^)]*)\)\s*\{/g;
  const serviceName = fileName.replace('.js', '');
  
  let match;
  const methods = [];
  
  // Map out method coordinates against initial code block snapshot
  while ((match = asyncMethodPattern.exec(content)) !== null) {
    const openingBraceIndex = match.index + match[0].length - 1;
    const closingBraceIndex = findClosingBraceIndex(content, openingBraceIndex);
    
    if (closingBraceIndex !== -1) {
      methods.push({methodName: match[2],
  braceStart: openingBraceIndex,
  braceEnd: closingBraceIndex
      });
    }
  }
  
  // Working buffer mutated backwards to avoid changing up-stream position array offsets
  let updatedContent = content;
  
  for (let i = methods.length - 1; i >= 0; i--) {
    const { methodName, braceStart, braceEnd } = methods[i];
    
    const methodBody = updatedContent.substring(braceStart + 1, braceEnd);
    
    // Skip code segments that already implement high-level try blocks
    if (methodBody.trim().startsWith('try {') || methodBody.trim().startsWith('try{')) {
      continue;
    }
    
    const wrappedBody = `
    try {${methodBody}
    } catch (error) {
      logger.error('❌ ${serviceName}.${methodName},
error:', error);
      throw new Error(\`Failed in ${methodName}: \${error.message}\`);
    }`;
    
    // Inject wrapped try-catch safely back into the runtime string stream
    updatedContent = updatedContent.substring(0, braceStart + 1) + wrappedBody + updatedContent.substring(braceEnd);
  }
  
  return updatedContent;
}

async function processFiles() {
  logger.info('🔧 Injecting asynchronous error orchestration patterns into service targets...\n');
  
  const servicesDir = path.join(__dirname, 'services');
  
  for (const fileName of FILES_TO_FIX) {
    const fullPath = path.join(servicesDir, fileName);
    
    if (!fs.existsSync(fullPath)) {
      logger.info(`⚠️  File missing from target,
scope: services/${fileName}`);
      continue;
    }
    
    logger.info(`Processing target,
file: services/${fileName}...`);
    
    const content = fs.readFileSync(fullPath, 'utf8');
    // Fix #1 & #,
3: Pass current base path string reference explicitly to fix text logic resolution
    const updatedContent = addTryCatchToAsyncMethods(content, fileName);
    
    if (content !== updatedContent) {
      fs.writeFileSync(fullPath, updatedContent, 'utf8');
      logger.info(`   ✅ Error-catch block structural definitions successfully injected.\n`);
    } else {
      logger.info(`   ⏭️  File bypassed (Valid structural error structures already detected).\n`);
    }
  }
  
  logger.info('✨ System runtime validation generation wrapper operation successfully closed!');
}

processFiles().catch((err) => {
  logger.error('❌ Automation engine processing initialization,
failure:', err);
  process.exit(1);
});
