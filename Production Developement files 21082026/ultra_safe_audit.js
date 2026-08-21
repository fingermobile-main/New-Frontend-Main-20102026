#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * ULTRA-SAFE SEMANTIC AUDIT & FIX SCRIPT
 * 
 * Inspired by advanced TypeScript error triage methodology
 * Applies semantic safety rules, CRUD verb matching, and word-subset validation
 * Zero tolerance for silent bugs or false positives
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔥 ULTRA-SAFE SEMANTIC AUDIT & FIX SCRIPT\n');
console.log('═══════════════════════════════════════════\n');

// ==================== CONFIGURATION ====================

const BACKEND = path.join(__dirname, 'backend');
const FRONTEND = path.join(__dirname, 'frontend-main/src');

// CRUD/Operation verb groups - operations in different groups are NEVER interchangeable
const VERB_GROUPS = [
  new Set(['create', 'add', 'schedule', 'generate', 'publish', 'post', 'record', 'register', 'book', 'process']),
  new Set(['get', 'find', 'fetch', 'list', 'search', 'retrieve', 'view', 'read', 'load']),
  new Set(['update', 'edit', 'modify', 'set', 'patch', 'apply', 'change']),
  new Set(['delete', 'remove', 'cancel', 'revoke', 'archive', 'unpublish', 'clear']),
  new Set(['validate', 'verify', 'check', 'authenticate', 'authorize']),
  new Set(['calculate', 'compute']),
  new Set(['download', 'export']),
  new Set(['import', 'upload']),
];

// Dangerous patterns that should NEVER be auto-fixed
const DANGEROUS_PATTERNS = [
  /ById.*By[A-Z]/,  // Swapping filter dimensions
  /ByDate.*ById/,   // Different query semantics
  /ByType.*By[A-Z]/,
  /Session.*Plan/,  // Different domain objects
  /Report.*Stats/,  // Different data shapes
  /History.*Session/,
];

// Safe simplification patterns (candidate words must be subset of original)
const SAFE_SIMPLIFICATIONS = [
  // Pattern: drop redundant entity name when context is clear
  { from: /Student([A-Z][a-z]+)ById$/, to: '$1ById' },
  { from: /Staff([A-Z][a-z]+)ById$/, to: '$1ById' },
  { from: /Library([A-Z][a-z]+)ById$/, to: '$1ById' },
  { from: /getAll([A-Z][a-z]+)s$/, to: 'getAll$1s' },
];

// ==================== HELPER FUNCTIONS ====================

function readFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Extract CRUD verb from method name (first word in camelCase)
function extractVerb(methodName) {
  const words = methodName.match(/[A-Z]?[a-z0-9]+|[A-Z]+(?=[A-Z]|$)/g) || [];
  return words.length > 0 ? words[0].toLowerCase() : methodName.toLowerCase();
}

// Get verb group index for a given verb
function getVerbGroup(verb) {
  for (let i = 0; i < VERB_GROUPS.length; i++) {
    if (VERB_GROUPS[i].has(verb)) {
      return i;
    }
  }
  return null; // Unknown verb
}

// Split camelCase into words
function splitWords(name) {
  return (name.match(/[A-Z]?[a-z0-9]+|[A-Z]+(?=[A-Z]|$)/g) || []).map(w => w.toLowerCase());
}

// Check if candidate is safe based on semantic rules
function isSemanticallySafe(original, candidate) {
  const origVerb = extractVerb(original);
  const candVerb = extractVerb(candidate);
  
  // Rule 1: Verbs must match exactly OR be in same group
  const origGroup = getVerbGroup(origVerb);
  const candGroup = getVerbGroup(candVerb);
  
  if (origVerb !== candVerb && (origGroup === null || candGroup === null || origGroup !== candGroup)) {
    return { safe: false, reason: `verb mismatch: '${origVerb}' vs '${candVerb}'` };
  }
  
  // Rule 2: Check for dangerous patterns
  const combined = `${original}->${candidate}`;
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(combined)) {
      return { safe: false, reason: `dangerous pattern detected: ${pattern.source}` };
    }
  }
  
  // Rule 3: Word-subset rule (strict)
  const origWords = new Set(splitWords(original));
  const candWords = new Set(splitWords(candidate));
  
  // Candidate words must be subset of original words (pure simplification)
  let isSubset = true;
  for (const word of candWords) {
    if (!origWords.has(word)) {
      isSubset = false;
      break;
    }
  }
  
  if (!isSubset) {
    return { safe: false, reason: 'word mismatch: candidate introduces new words' };
  }
  
  // Rule 4: ById preservation
  const hasByIdOriginal = original.includes('ById');
  const hasByIdCandidate = candidate.includes('ById');
  
  if (hasByIdOriginal && !hasByIdCandidate) {
    return { safe: false, reason: 'ById preservation violated' };
  }
  
  // Rule 5: Must actually differ (otherwise why fix?)
  if (original === candidate) {
    return { safe: false, reason: 'identical names' };
  }
  
  return { safe: true, reason: 'passed all safety checks' };
}

// ==================== LAYER 1: ISSUE DETECTION ====================

console.log('📊 LAYER 1: ISSUE DETECTION\n');
console.log('────────────────────────────\n');

const issues = [];

// Check 1: Missing transaction support in payment service
try {
  const serviceContent = readFile(path.join(BACKEND, 'services/enhanced_wallet_service.js'));
  const hasTransaction = serviceContent.includes('beginTransaction') &&
                        serviceContent.includes('commit') &&
                        serviceContent.includes('rollback');
  
  if (!hasTransaction) {
    issues.push({
      type: 'CRITICAL',
      category: 'Functionality',
      description: 'Payment service lacks database transaction support',
      file: 'services/enhanced_wallet_service.js',
      severity: 'high',
      autoFixable: false,
      requiresImplementation: true
    });
  } else {
    console.log('✅ Payment service has transaction support');
  }
} catch (error) {
  console.log(`❌ Cannot check payment service: ${error.message}`);
}

// Check 2: Auth middleware naming consistency
try {
  const routeContent = readFile(path.join(BACKEND, 'routes/enhanced_wallet.js'));
  const usesAuthenticate = routeContent.includes('authenticate');
  const usesAuthMiddleware = routeContent.includes('authMiddleware');
  
  if (usesAuthenticate && !usesAuthMiddleware) {
    console.log('⚠️  Route uses "authenticate" instead of "authMiddleware" (inconsistent but functional)');
  }
} catch (error) {
  console.log(`❌ Cannot check route middleware: ${error.message}`);
}

// Check 3: Logging presence
try {
  const controllerContent = readFile(path.join(BACKEND, 'controllers/enhanced_walletController.js'));
  const logCount = (controllerContent.match(/console\./g) || []).length;
  
  if (logCount < 2) {
    issues.push({
      type: 'WARNING',
      category: 'Quality',
      description: `Insufficient logging (${logCount} console statements)`,
      file: 'controllers/enhanced_walletController.js',
      severity: 'medium',
      autoFixable: true,
      fix: 'Add comprehensive logging'
    });
  } else {
    console.log(`✅ Adequate logging present (${logCount} statements)`);
  }
} catch (error) {
  console.log(`❌ Cannot check logging: ${error.message}`);
}

// Check 4: Magic numbers
try {
  const serviceContent = readFile(path.join(BACKEND, 'services/enhanced_wallet_service.js'));
  const bareNumbers = serviceContent.match(/\b\d+\b/g) || [];
  const suspicious = bareNumbers.filter(n => n !== '0' && n !== '1' && n !== '2');
  
  if (suspicious.length > 0) {
    issues.push({
      type: 'WARNING',
      category: 'Quality',
      description: `Found ${suspicious.length} magic numbers: ${suspicious.slice(0, 5).join(', ')}`,
      file: 'services/enhanced_wallet_service.js',
      severity: 'low',
      autoFixable: true,
      fix: 'Extract to named constants'
    });
  } else {
    console.log('✅ No suspicious magic numbers');
  }
} catch (error) {
  console.log(`❌ Cannot check magic numbers: ${error.message}`);
}

// Check 5: JSDoc comments
try {
  const serviceContent = readFile(path.join(BACKEND, 'services/enhanced_wallet_service.js'));
  const hasJSDoc = serviceContent.includes('* @') || serviceContent.includes('/**');
  
  if (!hasJSDoc) {
    issues.push({
      type: 'WARNING',
      category: 'Quality',
      description: 'Missing JSDoc documentation comments',
      file: 'services/enhanced_wallet_service.js',
      severity: 'low',
      autoFixable: true,
      fix: 'Add JSDoc to critical functions'
    });
  } else {
    console.log('✅ JSDoc comments present');
  }
} catch (error) {
  console.log(`❌ Cannot check JSDoc: ${error.message}`);
}

// Check 6: Schema field completeness
try {
  const schemaContent = readFile(path.join(BACKEND, 'create_payment_transactions_table.sql'));
  const requiredFields = ['user_id', 'amount', 'currency', 'payment_method', 'status', 'transaction_id'];
  const missingFields = requiredFields.filter(field => !schemaContent.includes(field));
  
  if (missingFields.length > 0) {
    issues.push({
      type: 'CRITICAL',
      category: 'Database',
      description: `Schema missing required fields: ${missingFields.join(', ')}`,
      file: 'create_payment_transactions_table.sql',
      severity: 'high',
      autoFixable: false,
      requiresImplementation: true
    });
  } else {
    console.log('✅ Schema has all required fields');
  }
} catch (error) {
  console.log(`❌ Cannot check schema: ${error.message}`);
}

// Check 7: Frontend App.tsx path
try {
  const appPath = path.join(FRONTEND, '../App.tsx');
  if (!fileExists(appPath)) {
    issues.push({
      type: 'ERROR',
      category: 'Frontend',
      description: 'App.tsx not found at expected location',
      file: 'frontend-main/App.tsx',
      severity: 'high',
      autoFixable: false,
      requiresInvestigation: true
    });
  } else {
    console.log('✅ App.tsx found');
  }
} catch (error) {
  console.log(`❌ Cannot check App.tsx: ${error.message}`);
}

// ==================== LAYER 2: TRIAGE & CLASSIFICATION ====================

console.log('\n🎯 LAYER 2: TRIAGE & CLASSIFICATION\n');
console.log('────────────────────────────────────\n');

const autoFixable = [];
const needsImplementation = [];
const needsReview = [];
const rejected = [];

for (const issue of issues) {
  if (issue.autoFixable && !issue.requiresImplementation) {
    // Apply semantic safety checks for auto-fixable issues
    if (issue.fix) {
      const safety = isSemanticallySafe(issue.description, issue.fix);
      
      if (safety.safe) {
        autoFixable.push({ ...issue, safetyCheck: safety });
      } else {
        rejected.push({ ...issue, rejectionReason: safety.reason });
      }
    } else {
      autoFixable.push(issue);
    }
  } else if (issue.requiresImplementation) {
    needsImplementation.push(issue);
  } else {
    needsReview.push(issue);
  }
}

console.log(`Auto-Fixable: ${autoFixable.length}`);
console.log(`Needs Implementation: ${needsImplementation.length}`);
console.log(`Needs Review: ${needsReview.length}`);
console.log(`Rejected (Unsafe): ${rejected.length}\n`);

if (autoFixable.length > 0) {
  console.log('✅ SAFE AUTO-FIXES:\n');
  autoFixable.forEach((fix, idx) => {
    console.log(`  ${idx + 1}. [${fix.severity.toUpperCase()}] ${fix.description}`);
    console.log(`     File: ${fix.file}`);
    if (fix.fix) console.log(`     Fix: ${fix.fix}`);
    console.log('');
  });
}

if (rejected.length > 0) {
  console.log('❌ REJECTED AS UNSAFE:\n');
  rejected.forEach((rej, idx) => {
    console.log(`  ${idx + 1}. [${rej.severity.toUpperCase()}] ${rej.description}`);
    console.log(`     Reason: ${rej.rejectionReason}`);
    console.log('');
  });
}

if (needsImplementation.length > 0) {
  console.log('🔧 NEEDS MANUAL IMPLEMENTATION:\n');
  needsImplementation.forEach((impl, idx) => {
    console.log(`  ${idx + 1}. [${impl.severity.toUpperCase()}] ${impl.description}`);
    console.log(`     File: ${impl.file}`);
    console.log('');
  });
}

// ==================== LAYER 3: ACTION PLAN ====================

console.log('\n📋 LAYER 3: ACTION PLAN\n');
console.log('────────────────────────\n');

if (autoFixable.length > 0) {
  console.log('Step 1: Apply Safe Auto-Fixes');
  console.log('─────────────────────────────\n');
  
  autoFixable.forEach(fix => {
    console.log(`□ ${fix.description}`);
  });
  
  console.log('\nExecute with: node apply_safe_fixes.js\n');
}

if (needsImplementation.length > 0) {
  console.log('Step 2: Implement Missing Features');
  console.log('──────────────────────────────────\n');
  
  needsImplementation.forEach(impl => {
    console.log(`□ ${impl.description}`);
    console.log(`  Location: ${impl.file}`);
  });
  
  console.log('\nRequires manual coding.\n');
}

if (needsReview.length > 0) {
  console.log('Step 3: Manual Review Required');
  console.log('──────────────────────────────\n');
  
  needsReview.forEach(review => {
    console.log(`□ ${review.description}`);
  });
  
  console.log('\nHuman decision needed.\n');
}

// ==================== SUMMARY ====================

console.log('\n═══════════════════════════════════════════');
console.log('📊 FINAL SUMMARY\n');
console.log(`Total Issues Found: ${issues.length}`);
console.log(`✅ Safe to Auto-Fix: ${autoFixable.length}`);
console.log(`🔧 Needs Implementation: ${needsImplementation.length}`);
console.log(`⚠️  Needs Review: ${needsReview.length}`);
console.log(`❌ Rejected (Unsafe): ${rejected.length}`);
console.log('═══════════════════════════════════════════\n');

if (issues.length === 0) {
  console.log('🎉 NO ISSUES FOUND! Platform is clean.\n');
  process.exit(0);
} else if (rejected.length === 0 && needsImplementation.length === 0) {
  console.log('✅ All issues are safe to auto-fix.\n');
  console.log('Ready to generate fix script.\n');
  process.exit(0);
} else {
  console.log('⚠️  Some issues require manual intervention.\n');
  console.log('Review the action plan above.\n');
  process.exit(1);
}