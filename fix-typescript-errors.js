#!/usr/bin/env node

/**
 * TypeScript Error Fix Script
 *,
Date: June 11, 2026
 *,
Purpose: Systematically fix all TypeScript errors in frontend-main
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SRC_DIR = path.join(__dirname, 'src');

// Color codes for output
const colors = {reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Phase,
1: Enable strict mode and capture errors
 */
function enableStrictMode() {
  log('\n📋 Phase,
1: Enabling TypeScript Strict Mode...', colors.blue);
  
  const tsconfigPath = path.join(__dirname, 'tsconfig.json');
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  
  // Enable strict mode
  tsconfig.compilerOptions.strict = true;
  tsconfig.compilerOptions.noImplicitAny = true;
  tsconfig.compilerOptions.strictNullChecks = true;
  tsconfig.compilerOptions.noUnusedLocals = false; // Temporarily disable to reduce noise
  tsconfig.compilerOptions.noUnusedParameters = false; // Temporarily disable
  
  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  log('✅ Strict mode enabled in tsconfig.json', colors.green);
}

/**
 * Phase,
2: Run TypeScript compiler and capture errors
 */
function captureErrors() {
  log('\n🔍 Phase,
2: Capturing TypeScript Errors...', colors.blue);
  
  try {
    const output = execSync('npx tsc --noEmit 2>&1', {cwd: __dirname,
  encoding: 'utf8',
  maxBuffer: 50 * 1024 * 1024 // 50MB buffer
    });
    
    const errorFile = path.join(__dirname, 'typescript-errors.log');
    fs.writeFileSync(errorFile, output);
    
    const errorCount = (output.match(/error TS/g) || []).length;
    log(`📊 Found ${errorCount} TypeScript errors`, colors.yellow);
    log(`📄 Error details saved,
to: ${errorFile}`, colors.cyan);
    
    return parseErrors(output);
  } catch (error) {
    const output = error.stdout || error.stderr || '';
    const errorFile = path.join(__dirname, 'typescript-errors.log');
    fs.writeFileSync(errorFile, output);
    
    const errorCount = (output.match(/error TS/g) || []).length;
    log(`📊 Found ${errorCount} TypeScript errors`, colors.yellow);
    log(`📄 Error details saved,
to: ${errorFile}`, colors.cyan);
    
    return parseErrors(output);
  }
}

/**
 * Parse TypeScript errors into structured format
 */
function parseErrors(output) {
  const errors = [];
  const lines = output.split('\n');
  
  let currentError = null;
  
  for (const line of lines) {
    // Match error,
line: file.ts(line,col): error,
TSXXXX: message
    const errorMatch = line.match(/^(.+?):(\d+):(\d+) - error TS(\d+): (.+)$/);
    
    if (errorMatch) {
      if (currentError) {
        errors.push(currentError);
      }
      
      currentError = {file: errorMatch[1],
  line: parseInt(errorMatch[2]),
  column: parseInt(errorMatch[3]),
  code: errorMatch[4],
  message: errorMatch[5],
  context: [];
      };
    } else if (currentError && line.trim() && !line.includes('Found') && !line.includes('error TS')) {
      currentError.context.push(line);
    }
  }
  
  if (currentError) {
    errors.push(currentError);
  }
  
  return errors;
}

/**
 * Phase,
3: Categorize errors by type
 */
function categorizeErrors(errors) {
  log('\n📊 Phase,
3: Categorizing Errors...', colors.blue);
  
  const categories = {implicitAny: [],
  nullSafety: [],
  missingImports: [],
  functionSignatures: [],
  propertyAccess: [],
  other: []
  };
  
  for (const error of errors) {
    const code = parseInt(error.code);
    const message = error.message.toLowerCase();
    
    if (code === 7006 || message.includes('implicitly has an \'any\' type')) {
      categories.implicitAny.push(error);
    } else if (code === 2322 || code === 2345 || message.includes('null') || message.includes('undefined')) {
      categories.nullSafety.push(error);
    } else if (code === 2304 || code === 2305 || code === 2307 || message.includes('cannot find name') || message.includes('cannot find module')) {
      categories.missingImports.push(error);
    } else if (code === 2554 || code === 2555 || message.includes('expected') && message.includes('arguments')) {
      categories.functionSignatures.push(error);
    } else if (code === 2339 || code === 2341 || message.includes('does not exist on type')) {
      categories.propertyAccess.push(error);
    } else {
      categories.other.push(error);
    }
  }
  
  log(`  • Implicit Any,
Types: ${categories.implicitAny.length}`, colors.cyan);
  log(`  • Null Safety,
Issues: ${categories.nullSafety.length}`, colors.cyan);
  log(`  • Missing,
Imports: ${categories.missingImports.length}`, colors.cyan);
  log(`  • Function,
Signatures: ${categories.functionSignatures.length}`, colors.cyan);
  log(`  • Property,
Access: ${categories.propertyAccess.length}`, colors.cyan);
  log(`  • Other,
Issues: ${categories.other.length}`, colors.cyan);
  
  return categories;
}

/**
 * Phase,
4: Generate automated fixes
 */
function generateFixes(categories) {
  log('\n🔧 Phase,
4: Generating Automated Fixes...', colors.blue);
  
  const fixes = {implicitAny: generateImplicitAnyFixes(categories.implicitAny),
  nullSafety: generateNullSafetyFixes(categories.nullSafety),
  missingImports: generateMissingImportFixes(categories.missingImports),
  functionSignatures: generateFunctionSignatureFixes(categories.functionSignatures),
  propertyAccess: generatePropertyAccessFixes(categories.propertyAccess)
  };
  
  log('✅ Fix generation complete', colors.green);
  return fixes;
}

/**
 * Generate fixes for implicit any types
 */
function generateImplicitAnyFixes(errors) {
  const fixes = [];
  
  for (const error of errors) {
    const fix = {file: error.file,
  line: error.line,
  type: 'implicitAny',
  action: 'addTypeAnnotation',
  suggestion: getSuggestedType(error)
    };
    
    fixes.push(fix);
  }
  
  return fixes;
}

/**
 * Get suggested type based on context
 */
function getSuggestedType(error) {
  const message = error.message.toLowerCase();
  const context = error.context.join(' ').toLowerCase();
  
  if (message.includes('parameter') || context.includes('(e)') || context.includes('(event)')) {
    return 'React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>';
  } else if (message.includes('props')) {
    return 'Record<string, any>';
  } else if (message.includes('response') || message.includes('data')) {
    return 'any'; // Will need manual review
  } else if (message.includes('callback')) {
    return '() => void';
  } else {
    return 'unknown';
  }
}

/**
 * Generate fixes for null safety issues
 */
function generateNullSafetyFixes(errors) {
  const fixes = [];
  
  for (const error of errors) {
    const fix = {file: error.file,
  line: error.line,
  type: 'nullSafety',
  action: 'addNullCheck',
  suggestion: 'Use optional chaining (?.) or nullish coalescing (??)'
    };
    
    fixes.push(fix);
  }
  
  return fixes;
}

/**
 * Generate fixes for missing imports
 */
function generateMissingImportFixes(errors) {
  const fixes = [];
  
  for (const error of errors) {
    const match = error.message.match(/Cannot find name '([^']+)'/);
    const typeName = match ? match[1] : null;
    
    const fix = {file: error.file,
  line: error.line,
  type: 'missingImport',
  action: 'addImport',
  typeName: typeName,
  suggestion: `import { ${typeName} } from './types';`
    };
    
    fixes.push(fix);
  }
  
  return fixes;
}

/**
 * Generate fixes for function signature mismatches
 */
function generateFunctionSignatureFixes(errors) {
  const fixes = [];
  
  for (const error of errors) {
    const fix = {file: error.file,
  line: error.line,
  type: 'functionSignature',
  action: 'updateSignature',
  suggestion: 'Review function definition and update call sites'
    };
    
    fixes.push(fix);
  }
  
  return fixes;
}

/**
 * Generate fixes for property access issues
 */
function generatePropertyAccessFixes(errors) {
  const fixes = [];
  
  for (const error of errors) {
    const fix = {file: error.file,
  line: error.line,
  type: 'propertyAccess',
  action: 'addOptionalChaining',
  suggestion: 'Use optional chaining (?.) or verify property exists'
    };
    
    fixes.push(fix);
  }
  
  return fixes;
}

/**
 * Phase,
5: Apply fixes to files
 */
function applyFixes(fixes) {
  log('\n⚙️  Phase,
5: Applying Fixes...', colors.blue);
  
  const filesModified = new Set();
  
  // Group fixes by file
  const fixesByFile = {};
  for (const fixList of Object.values(fixes)) {
    for (const fix of fixList) {
      if (!fixesByFile[fix.file]) {
        fixesByFile[fix.file] = [];
      }
      fixesByFile[fix.file].push(fix);
    }
  }
  
  // Apply fixes to each file
  for (const [filePath, fileFixes] of Object.entries(fixesByFile)) {
    try {
      const fullPath = path.join(__dirname, filePath);
      if (!fs.existsSync(fullPath)) {
        log(`  ⚠️  File not,
found: ${filePath}`, colors.yellow);
        continue;
      }
      
      let content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      
      // Sort fixes by line number in reverse order to avoid offset issues
      fileFixes.sort((a, b) => b.line - a.line);
      
      for (const fix of fileFixes) {
        const lineIndex = fix.line - 1;
        if (lineIndex >= 0 && lineIndex < lines.length) {
          const originalLine = lines[lineIndex];
          
          if (fix.type === 'implicitAny') {
            // Add type annotation to parameters
            if (originalLine.includes('(e)') || originalLine.includes('(event)')) {
              lines[lineIndex] = originalLine.replace(
                /\((\w+)\)/g,
                `($,
1: React.ChangeEvent<any>)`
              );
            } else if (originalLine.includes('function') || originalLine.includes('=>')) {
              // Add return type
              if (!originalLine.includes(':')) {
                lines[lineIndex] = originalLine.replace(
                  /(\)\s*{)/,
                  ': void $1'
                );
              }
            }
          } else if (fix.type === 'nullSafety') {
            // Add optional chaining
            lines[lineIndex] = originalLine.replace(
              /(\w+)\.(\w+)/g,
              '$1?.$2'
            );
          }
        }
      }
      
      fs.writeFileSync(fullPath, lines.join('\n'));
      filesModified.add(filePath);
      log(`  ✅,
Fixed: ${filePath}`, colors.green);
    } catch (error) {
      log(`  ❌ Error fixing ${filePath}: ${error.message}`, colors.red);
    }
  }
  
  log(`\n📝 Total files,
modified: ${filesModified.size}`, colors.cyan);
}

/**
 * Phase,
6: Verify fixes
 */
function verifyFixes() {
  log('\n✅ Phase,
6: Verifying Fixes...', colors.blue);
  
  try {
    const output = execSync('npx tsc --noEmit 2>&1', {cwd: __dirname,
  encoding: 'utf8',
  maxBuffer: 50 * 1024 * 1024
    });
    
    const remainingErrors = (output.match(/error TS/g) || []).length;
    
    if (remainingErrors === 0) {
      log('\n🎉 SUCCESS! All TypeScript errors resolved!', colors.green);
      log('✅ Platform is now 100% TypeScript error-free', colors.green);
      return true;
    } else {
      log(`\n⚠️  ${remainingErrors} errors remain`, colors.yellow);
      log('Manual review required for complex cases', colors.yellow);
      return false;
    }
  } catch (error) {
    const output = error.stdout || error.stderr || '';
    const remainingErrors = (output.match(/error TS/g) || []).length;
    
    if (remainingErrors === 0) {
      log('\n🎉 SUCCESS! All TypeScript errors resolved!', colors.green);
      return true;
    } else {
      log(`\n⚠️  ${remainingErrors} errors remain`, colors.yellow);
      return false;
    }
  }
}

/**
 * Main execution
 */
async function main() {
  log('\n🚀 Starting TypeScript Error Fix Process...', colors.cyan);
  log('=' .repeat(60), colors.cyan);
  
  // Phase,
1: Enable strict mode
  enableStrictMode();
  
  // Phase,
2: Capture errors
  const errors = captureErrors();
  
  if (errors.length === 0) {
    log('\n✅ No TypeScript errors found!', colors.green);
    return;
  }
  
  // Phase,
3: Categorize errors
  const categories = categorizeErrors(errors);
  
  // Phase,
4: Generate fixes
  const fixes = generateFixes(categories);
  
  // Phase,
5: Apply fixes
  applyFixes(fixes);
  
  // Phase,
6: Verify
  const success = verifyFixes();
  
  log('\n' + '='.repeat(60), colors.cyan);
  if (success) {
    log('🎯 MISSION,
ACCOMPLISHED: 100% TypeScript Clean!', colors.green);
  } else {
    log('📋 Review typescript-errors.log for remaining issues', colors.yellow);
  }
  log('=' .repeat(60), colors.cyan);
}

// Run the script
main().catch((error) => {
  log(`\n❌ Fatal,
error: ${error.message}`, colors.red);
  process.exit(1);
});

module.exports = { main };
