#!/usr/bin/env node
/**
 * COMPREHENSIVE FIX SCRIPT: Systematic Comma Corruption Repair (v7.0)
 * 
 * PROBLEM: Automated find-replace corrupted code in SEVEN ways:
 * 1. SQL keywords: "FROM table" instead of "FROM table"
 * 2. String literals: "Cannot block yourself" instead of "Cannot block yourself"
 * 3. Array parameters: `template`, [params] instead of `template`\n[params]
 * 4. JS keywords: "typeof value" instead of "typeof value"
 * 5. Array join: .join(" AND") instead of .join(" AND")
 * 6. Comments: "// text
            const x" converts code to comment
 * 7. Missing commas: "SELECT a, b FROM" instead of "SELECT a, b FROM"
 * 
 * SAFETY: Per-pattern inline validation, selective rollback, syntax checking
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BACKEND_DIR = path.resolve(__dirname, '..');

const FIX_STATS = {
  totalFilesScanned: 0,
  filesFixed: 0,
  errorsFixed: 0,
  backupsCreated: 0,
  failedFixes: 0
};

// ============================================================================
// PATTERN 1: SQL Keyword Commas (bidirectional)
// ============================================================================
const SQL_PATTERNS = [
  // Remove comma AFTER SQL keywords
  { pattern: /SELECT,\s+/gi, replacement: 'SELECT ' },
  { pattern: /FROM,\s+/gi, replacement: 'FROM ' },
  { pattern: /WHERE,\s+/gi, replacement: 'WHERE ' },
  { pattern: /\bAND,\s+/gi, replacement: 'AND ' },
  { pattern: /\bOR,\s+/gi, replacement: 'OR ' },
  { pattern: /ORDER\s+BY,\s+/gi, replacement: 'ORDER BY ' },
  { pattern: /GROUP\s+BY,\s+/gi, replacement: 'GROUP BY ' },
  { pattern: /JOIN,\s+/gi, replacement: 'JOIN ' },
  { pattern: /\bON,\s+/gi, replacement: 'ON ' },
  { pattern: /SET,\s+/gi, replacement: 'SET ' },
  { pattern: /VALUES,\s*\(/gi, replacement: 'VALUES (' },
  { pattern: /INSERT\s+INTO,\s+/gi, replacement: 'INSERT INTO ' },
  { pattern: /DELETE\s+FROM,\s+/gi, replacement: 'DELETE FROM ' },
  { pattern: /UPDATE,\s+/gi, replacement: 'UPDATE ' },
  { pattern: /DISTINCT,\s+/gi, replacement: 'DISTINCT ' },
  
  // Remove comma BEFORE SQL keywords (reverse direction)
  { pattern: /,\s*SELECT\b/gi, replacement: ' SELECT' },
  { pattern: /,\s*FROM\b/gi, replacement: ' FROM' },
  { pattern: /,\s*WHERE\b/gi, replacement: ' WHERE' },
  { pattern: /,\s*\bAND\b/gi, replacement: ' AND' },
  { pattern: /,\s*\bOR\b/gi, replacement: ' OR' },
  { pattern: /,\s*ORDER\s+BY\b/gi, replacement: ' ORDER BY' },
  { pattern: /,\s*GROUP\s+BY\b/gi, replacement: ' GROUP BY' },
  { pattern: /,\s*JOIN\b/gi, replacement: ' JOIN' },
  { pattern: /,\s*\bON\b/gi, replacement: ' ON' },
  { pattern: /,\s*SET\b/gi, replacement: ' SET' },
  { pattern: /,\s*VALUES\b/gi, replacement: ' VALUES' },
  { pattern: /,\s*INSERT\s+INTO\b/gi, replacement: ' INSERT INTO' },
  { pattern: /,\s*DELETE\s+FROM\b/gi, replacement: ' DELETE FROM' },
  { pattern: /,\s*UPDATE\b/gi, replacement: ' UPDATE' },
  { pattern: /,\s*DISTINCT\b/gi, replacement: ' DISTINCT' },
  
  // Special case: CAST function - remove comma before AS
  { pattern: /CAST\(([^)]+?),\s+AS\s+/gi, replacement: 'CAST($1 AS ' },
  { pattern: /,\s+AS\s+(?:VARCHAR|INTEGER|FLOAT|TEXT|BOOLEAN|DATE|TIMESTAMP|NUMERIC|DECIMAL|REAL|DOUBLE|BIGINT|SMALLINT)/gi, replacement: ' AS $1' }
];

// ============================================================================
// PATTERN 4: JavaScript Keyword/Operator Commas
// ============================================================================
const JS_KEYWORD_PATTERNS = [
  // Control flow: if(...) return -> if(...) return
  { pattern: /\)\s*,\s*return\b/g, replacement: ') return' },
  { pattern: /\)\s*,\s*throw\b/g, replacement: ') throw' },
  
  // Operators with commas after
  { pattern: /\btypeof\s*,\s+/g, replacement: 'typeof ' },
  { pattern: /\binstanceof\s*,\s+/g, replacement: 'instanceof ' },
  
  // Variable declarations with leading comma
  { pattern: /\bconst\s*,\s+(\w)/g, replacement: 'const $1' },
  { pattern: /\blet\s*,\s+(\w)/g, replacement: 'let $1' },
  { pattern: /\bvar\s*,\s+(\w)/g, replacement: 'var $1' },
  
  // Loop declarations
  { pattern: /\bfor\s*\(\s*const\s*,\s+/g, replacement: 'for (const ' },
  { pattern: /\bfor\s*\(\s*let\s*,\s+/g, replacement: 'for (let ' },
  { pattern: /\bfor\s*\(\s*var\s*,\s+/g, replacement: 'for (var ' },
  
  // Common comment/string patterns
  { pattern: /\(if,\s+/g, replacement: '(if ' },
  { pattern: /\(for,\s+/g, replacement: '(for ' }
];

// ============================================================================
// PATTERN 2: String Literal Commas (ENHANCED v3 - comprehensive smart detection)
// ============================================================================
function fixStringLiterals(content) {
  let fixesApplied = 0;
  
  // Match double-quoted strings (LINE-BOUNDED to prevent multiline issues)
  const doubleQuotePattern = /"[^"\n]*"/g;
  
  const fixedContent = content.replace(doubleQuotePattern, (match) => {
    // Skip legitimate patterns
    if (match.includes('join(') || match.match(/\$\d+/)) return match;
    
    // ENHANCED v3: Multi-layer smart detection
    
    // Layer 1: Detect definite corruption patterns
    const hasMultipleCommas = /,\s+\w+(?:\s*,\s+\w+){2,}/.test(match);
    const corruptionIndicators = /\b(Cannot|Please|Error|Warning|Failed|Unable|Invalid|Missing|Required|Expected)\s*,\s+\w+/i.test(match);
    
    // Layer 2: Detect patterns to PRESERVE (CSV/technical/lists)
    const isCSVPattern = /_\w+,|,\s*\d+|,\s*[A-Z]{2,}/.test(match);
    
    // NEW: Detect simple word lists (short common words in sequence)
    // e.g., "id, name, age, score" or "one, two, three"
    const words = match.match(/\b\w+\b/g) || [];
    const shortWords = words.filter(w => w.length <= 4);
    const isWordList = words.length >= 3 && shortWords.length / words.length > 0.6;
    
    // Only fix if it's likely corruption AND not a preserved pattern
    const hasCorruption = (hasMultipleCommas || corruptionIndicators) && !isCSVPattern && !isWordList;
    
    if (hasCorruption) {
      // Remove all ", word" patterns (comma + space + word)
      const fixed = match.replace(/,\s+(\w+)/g, ' $1');
      if (fixed !== match) {
        fixesApplied++;
        return fixed;
      }
    }
    
    return match;
  });
  
  // Also fix template literals (backticks) with LINE-BOUNDED matching
  const templatePattern = /`[^`\n]*`/g;
  const finalContent = fixedContent.replace(templatePattern, (match) => {
    // Skip SQL with parameter placeholders
    if (match.match(/\$\d+/)) return match;
    
    // Apply same smart detection for template literals
    const hasMultipleCommas = /,\s+\w+(?:\s*,\s+\w+){2,}/.test(match);
    const corruptionIndicators = /\b(Cannot|Please|Error|Warning|Failed|Unable|Invalid|Missing|Required|Expected)\s*,\s+\w+/i.test(match);
    const isCSVPattern = /_\w+,|,\s*\d+|,\s*[A-Z]{2,}/.test(match);
    
    const words = match.match(/\b\w+\b/g) || [];
    const shortWords = words.filter(w => w.length <= 4);
    const isWordList = words.length >= 3 && shortWords.length / words.length > 0.6;
    
    const hasCorruption = (hasMultipleCommas || corruptionIndicators) && !isCSVPattern && !isWordList;
    
    if (hasCorruption) {
      const fixed = match.replace(/,\s+(\w+)/g, ' $1');
      if (fixed !== match) {
        fixesApplied++;
        return fixed;
      }
    }
    
    return match;
  });
  
  return { fixedContent: finalContent, fixesApplied };
}

// ============================================================================
// PATTERN 3: Array Parameter Separation
// ============================================================================
function fixArrayParameters(content) {
  let fixesApplied = 0;
  const arrayPattern = /(`[^`]+?`|"[^"]+?")\s*,\s*(\[.*?\])/g;
  
  const fixedContent = content.replace(arrayPattern, (match, str, array, offset) => {
    const beforeMatch = content.substring(Math.max(0, offset - 50), offset);
    const isOnSameLine = !beforeMatch.includes('\n');
    
    if (isOnSameLine && (str.includes('INSERT') || str.includes('SELECT') || str.includes('DELETE') || str.includes('UPDATE'))) {
      fixesApplied++;
      return `${str}\n                ${array}`;
    }
    return match;
  });
  
  return { fixedContent, fixesApplied };
}

// ============================================================================
// PATTERN 5: Array Join Separator Corruption
// ============================================================================
const JOIN_PATTERNS = [
  { pattern: /\.join\("\s*,\s*AND\s*"\)/g, replacement: '.join(" AND ")' },
  { pattern: /\.join\('\s*,\s*AND\s*'\)/g, replacement: ".join(' AND ')" },
  { pattern: /\.join\("\s*,\s*OR\s*"\)/g, replacement: '.join(" OR ")' },
  { pattern: /\.join\('\s*,\s*OR\s*'\)/g, replacement: ".join(' OR ')" }
];

// ============================================================================
// PATTERN 6: Comment-to-Code Corruption (Safe line-termination scanning)
// ============================================================================
function fixCommentCorruption(content) {
  let fixesApplied = 0;
  
  const patternA = /(\/\/[^:\n]*?)\(([^)\n]*?,\s*[^)\n]*?)\),\s*(const|let|var|async|await|return|if|for|while)\b(.*)/g;
  let fixedContent = content.replace(patternA, (match, beforeParen, insideParen, keyword, restOfLine) => {
    fixesApplied++;
    const cleanParen = insideParen.replace(/,\s*/g, ' ');
    return `${beforeParen}(${cleanParen})\n            ${keyword}${restOfLine}`;
  });
  
  const patternB = /(\/\/[^,\n]*(?:,[^,\n]+?)*?),\s*(const|let|var|async|await|return|if|for|while)\b(.*)/g;
  fixedContent = fixedContent.replace(patternB, (match, commentPart, keyword, restOfLine) => {
    fixesApplied++;
    return `${commentPart.trim()}\n            ${keyword}${restOfLine}`;
  });
  
  return { fixedContent, fixesApplied };
}

// ============================================================================
// PATTERN 7: Missing Comma Detection (Template Bound Restrictive Match)
// ============================================================================
function fixMissingCommas(content) {
  let fixesApplied = 0;
  let fixedContent = content;
  
  const sqlSelectPattern = /(`[^`]*?)\bSELECT\s+(\w+)\s+(\w+)\s+FROM\b/gi;
  fixedContent = fixedContent.replace(sqlSelectPattern, (match, before, col1, col2) => {
    fixesApplied++;
    return `${before}SELECT ${col1}, ${col2} FROM`;
  });
  
  const insertValuesPattern = /(`[^`]*?)\bVALUES\s*\((\w+)\s+(\w+)(?!\s*,)/gi;
  fixedContent = fixedContent.replace(insertValuesPattern, (match, before, val1, val2) => {
    fixesApplied++;
    return `${before}VALUES (${val1}, ${val2}`;
  });
  
  const updateSetPattern = /(`[^`]*?)\bSET\s+([\w$]+\s*=\s*(?:\w+|\$\d+|\?|'[^']*?'|"[^"]*?"))\s+([\w$]+\s*=)/gi;
  fixedContent = fixedContent.replace(updateSetPattern, (match, before, set1, set2) => {
    if (set1.trim().endsWith(',')) return match;
    fixesApplied++;
    return `${before}SET ${set1}, ${set2}`;
  });
  
  return { fixedContent, fixesApplied };
}

// ============================================================================
// DETECTION: Check if file has any corruption (ALL 7 PATTERNS)
// ============================================================================
function hasCorruption(content) {
  const sqlCheck = SQL_PATTERNS.some(({ pattern }) => pattern.test(content));
  
  // ENHANCED v3: Comprehensive smart string literal corruption detection
  const stringCheck = (() => {
    // Check double-quoted strings (LINE-BOUNDED to prevent multiline false positives)
    const doubleQuoteMatches = content.match(/"[^"\n]*"/g);
    if (doubleQuoteMatches) {
      for (const str of doubleQuoteMatches) {
        // Skip legitimate patterns
        if (str.includes('join(') || str.match(/\$\d+/)) continue;
        
        const hasMultipleCommas = /,\s+\w+(?:\s*,\s+\w+){2,}/.test(str);
        const corruptionIndicators = /\b(Cannot|Please|Error|Warning|Failed|Unable|Invalid|Missing|Required|Expected)\s*,\s+\w+/i.test(str);
        const isCSVPattern = /_\w+,|,\s*\d+|,\s*[A-Z]{2,}/.test(str);
        
        // NEW: Detect simple word lists to preserve
        const words = str.match(/\b\w+\b/g) || [];
        const shortWords = words.filter(w => w.length <= 4);
        const isWordList = words.length >= 3 && shortWords.length / words.length > 0.6;
        
        if ((hasMultipleCommas || corruptionIndicators) && !isCSVPattern && !isWordList) {
          return true;
        }
      }
    }
    
    // Check template literals (LINE-BOUNDED)
    const templateMatches = content.match(/`[^`\n]*`/g);
    if (templateMatches) {
      for (const str of templateMatches) {
        if (str.match(/\$\d+/)) continue;
        
        const hasMultipleCommas = /,\s+\w+(?:\s*,\s+\w+){2,}/.test(str);
        const corruptionIndicators = /\b(Cannot|Please|Error|Warning|Failed|Unable|Invalid|Missing|Required|Expected)\s*,\s+\w+/i.test(str);
        const isCSVPattern = /_\w+,|,\s*\d+|,\s*[A-Z]{2,}/.test(str);
        
        const words = str.match(/\b\w+\b/g) || [];
        const shortWords = words.filter(w => w.length <= 4);
        const isWordList = words.length >= 3 && shortWords.length / words.length > 0.6;
        
        if ((hasMultipleCommas || corruptionIndicators) && !isCSVPattern && !isWordList) {
          return true;
        }
      }
    }
    
    return false;
  })();
  
  const arrayCheck = /`[^`]+`,\s*\[/.test(content);
  const jsKeywordCheck = /\b(if|return|typeof|const|let|var|for|while)\s*,\s+/.test(content);
  const joinCheck = /\.join\("\s*,\s*(AND|OR)\s*"\)/.test(content);
  const commentCheck = /\/\/[^,\n]*?,\s*(const|let|var|async|await|return|if|for|while)\b/.test(content);
  
  const missingSQLSelect = /`[^`]*?\bSELECT\s+\w+\s+\w+\s+FROM\b/.test(content);
  const missingInsertValues = /`[^`]*?\bVALUES\s*\(\w+\s+\w+(?!\s*,)/.test(content);
  const missingUpdateSet = /`[^`]*?\bSET\s+\w+\s*=\s*\S+\s+\w+\s*=/i.test(content);
  
  return sqlCheck || stringCheck || arrayCheck || jsKeywordCheck || 
         joinCheck || commentCheck || missingSQLSelect || missingInsertValues || missingUpdateSet;
}

// Remove the old fixContent function as it's no longer needed

// ============================================================================
// VALIDATION ENGINES
// ============================================================================
function validateSyntaxInline(content) {
  const tmpPath = path.join(__dirname, `comma_fix_validation_${Date.now()}_${Math.random().toString(36).substr(2, 5)}.js`);
  try {
    fs.writeFileSync(tmpPath, content, 'utf8');
    execSync(`node -c "${tmpPath.replace(/"/g, '\\"')}"`, { stdio: 'pipe' });
    fs.unlinkSync(tmpPath);
    return { valid: true, error: null };
  } catch (error) {
    const stderr = error.stderr?.toString() || '';
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    return { valid: false, error: stderr.split('\n')[0] };
  }
}

function createBackup(filePath) {
  const backupPath = `${filePath}.comprehensive_fix_backup_${Date.now()}`;
  fs.copyFileSync(filePath, backupPath);
  FIX_STATS.backupsCreated++;
  return backupPath;
}

// ============================================================================
// PROCESS: Handle single file WITH PER-PATTERN VALIDATION AND SELECTIVE ROLLBACK
// ============================================================================
function processFile(filePath) {
  FIX_STATS.totalFilesScanned++;
  
  try {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    if (!hasCorruption(originalContent)) {
      return { fixed: false, reason: 'No corruption found' };
    }
    
    const backupPath = createBackup(filePath);
    let currentContent = originalContent;
    let totalFixesApplied = 0;
    const patternResults = [];
    
    const patterns = [
      { 
        name: 'SQL Keywords', 
        apply: (content) => {
          let fixed = content;
          let count = 0;
          SQL_PATTERNS.forEach(({ pattern, replacement }) => {
            const matches = fixed.match(pattern);
            if (matches) {
              count += matches.length;
              fixed = fixed.replace(pattern, replacement);
            }
          });
          return { content: fixed, fixes: count };
        }
      },
      { 
        name: 'String Literals', 
        apply: (content) => {
          const result = fixStringLiterals(content);
          return { content: result.fixedContent, fixes: result.fixesApplied };
        }
      },
      { 
        name: 'Array Parameters', 
        apply: (content) => {
          const result = fixArrayParameters(content);
          return { content: result.fixedContent, fixes: result.fixesApplied };
        }
      },
      { 
        name: 'JS Keywords', 
        apply: (content) => {
          let fixed = content;
          let count = 0;
          JS_KEYWORD_PATTERNS.forEach(({ pattern, replacement }) => {
            const matches = fixed.match(pattern);
            if (matches) {
              count += matches.length;
              fixed = fixed.replace(pattern, replacement);
            }
          });
          return { content: fixed, fixes: count };
        }
      },
      { 
        name: 'Array Join', 
        apply: (content) => {
          let fixed = content;
          let count = 0;
          JOIN_PATTERNS.forEach(({ pattern, replacement }) => {
            const matches = fixed.match(pattern);
            if (matches) {
              count += matches.length;
              fixed = fixed.replace(pattern, replacement);
            }
          });
          return { content: fixed, fixes: count };
        }
      },
      { 
        name: 'Comment-to-Code', 
        apply: (content) => {
          const result = fixCommentCorruption(content);
          return { content: result.fixedContent, fixes: result.fixesApplied };
        }
      },
      { 
        name: 'Missing Commas', 
        apply: (content) => {
          const result = fixMissingCommas(content);
          return { content: result.fixedContent, fixes: result.fixesApplied };
        }
      }
    ];
    
    for (const pattern of patterns) {
      const result = pattern.apply(currentContent);
      if (result.fixes === 0) {
        patternResults.push({ pattern: pattern.name, applied: false, reason: 'No matches' });
        continue;
      }
      
      const testValidation = validateSyntaxInline(result.content);
      if (testValidation.valid) {
        currentContent = result.content;
        totalFixesApplied += result.fixes;
        patternResults.push({ pattern: pattern.name, applied: true, fixes: result.fixes });
      } else {
        patternResults.push({ pattern: pattern.name, applied: false, reason: `Syntax error: ${testValidation.error}` });
      }
    }
    
    if (totalFixesApplied === 0) {
      fs.unlinkSync(backupPath);
      return { fixed: false, reason: 'No valid fixes applied' };
    }
    
    const finalValidation = validateSyntaxInline(currentContent);
    if (!finalValidation.valid) {
      fs.copyFileSync(backupPath, filePath);
      fs.unlinkSync(backupPath);
      FIX_STATS.failedFixes++;
      return { 
        fixed: false, 
        reason: `Final verification aborted: ${finalValidation.error}`,
        restored: true,
        patternResults
      };
    }
    
    fs.writeFileSync(filePath, currentContent, 'utf8');
    fs.unlinkSync(backupPath);
    
    FIX_STATS.filesFixed++;
    FIX_STATS.errorsFixed += totalFixesApplied;
    
    return { fixed: true, fixesApplied: totalFixesApplied, patternResults };
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return { fixed: false, reason: error.message };
  }
}

// ============================================================================
// SCAN: Get all JavaScript files recursively
// ============================================================================
function getAllJSFiles(dir, excludedDirs = ['node_modules', 'backups', '_archive', '.git', 'dist']) {
  const files = [];
  
  function traverse(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!excludedDirs.includes(item)) {
          traverse(fullPath);
        }
      } else if (item.endsWith('.js') && !item.includes('backup')) {
        files.push(fullPath);
      }
    });
  }
  
  traverse(dir);
  return files;
}

// ============================================================================
// MAIN: Execute comprehensive fix
// ============================================================================
async function main() {
  console.log('🔧 Starting COMPREHENSIVE Comma Corruption Fix (v7.0)...\n');
  console.log('Backend Directory:', BACKEND_DIR);
  
  const jsFiles = getAllJSFiles(BACKEND_DIR);
  console.log(`📁 Found ${jsFiles.length} JavaScript files to scan\n`);
  
  for (let i = 0; i < jsFiles.length; i++) {
    const file = jsFiles[i];
    const relativePath = path.relative(BACKEND_DIR, file);
    
    const result = processFile(file);
    if (result.fixed) {
      console.log(`✅ Fixed: ${relativePath} (${result.fixesApplied} corrections)`);
      if (result.patternResults) {
        const appliedPatterns = result.patternResults.filter(r => r.applied);
        if (appliedPatterns.length > 0) {
          console.log(`   Patterns: ${appliedPatterns.map(p => p.pattern).join(', ')}`);
        }
      }
    } else if (result.patternResults) {
      const failedPatterns = result.patternResults.filter(r => !r.applied && r.reason !== 'No matches');
      if (failedPatterns.length > 0) {
        console.log(`⚠️  Skipped / Selected Fallback inside: ${relativePath}`);
        failedPatterns.forEach(p => {
          console.log(`   ❌ Solved-With-Skip [${p.pattern}]: ${p.reason}`);
        });
      }
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 COMPREHENSIVE FIX SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Files Scanned:    ${FIX_STATS.totalFilesScanned}`);
  console.log(`Files Fixed:            ${FIX_STATS.filesFixed}`);
  console.log(`Total Corrections:      ${FIX_STATS.errorsFixed}`);
  console.log(`Backups Created:        ${FIX_STATS.backupsCreated}`);
  console.log(`Failed Fixes:           ${FIX_STATS.failedFixes}`);
  console.log('='.repeat(80));
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { processFile, hasCorruption };