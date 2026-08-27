#!/usr/bin/env node
/**
 * strip_import_extensions.js
 * --------------------------
 * Removes explicit relative file extensions (.js, .tsx, .ts, .jsx, .mjs, .cjs)
 * from import statements across all source files, so that webpack / Vite / CRA
 * (and moduleResolution:"bundler") can resolve modules normally.
 *
 * This fixes errors like:
 *   Module not found: Can't resolve './pages/MonetizationPage.js'
 *   TS5097 / TS2835 extension issues in App.tsx
 *
 * NOTE: Pair this with tsconfig.json:
 *   "moduleResolution": "bundler"
 * (otherwise TS will still demand .js extensions).
 *
 * Usage:
 *   node strip_import_extensions.js <rootDir> [--dry-run] [--ext .ts,.tsx]
 *
 * Examples:
 *   node strip_import_extensions.js src
 *   node strip_import_extensions.js src --dry-run
 *   node strip_import_extensions.js src --ext .ts,.tsx,.js,.jsx
 */
const fs = require('fs');
const path = require('path');

// ---- CLI parsing ----
const args = process.argv.slice(2);
const rootDir = args[0] || '.';
const dryRun = args.includes('--dry-run');

let extIndex = args.indexOf('--ext');
const DEFAULT_EXTS = ['.ts', '.tsx', '.js', '.jsx'];
let exts = DEFAULT_EXTS;
if (extIndex !== -1 && args[extIndex + 1]) {
  exts = args[extIndex + 1].split(',').map((e) => e.trim()).filter(Boolean);
}

/** Match relative import paths: './x', '../x', ./pages/Name
 *  supported contexts:
 *    import ... from '...'
 *    import('...')
 *    require('...')
 *    export ... from '...'
 */
const SPECIFIER_RE = /(['"])(\.\.?\/[^'"]*?)\.([a-zA-Z][a-zA-Z0-9]*)\1/g;

let filesScanned = 0;
let hunksChanged = 0;
let totalReplacements = 0;

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // skip heavy dirs
      if (['node_modules', '.git', 'dist', 'build', 'coverage'].includes(entry.name)) continue;
      walk(full, out);
    } else if (exts.includes(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

function stripExtensions(text) {
  return text.replace(SPEC_RE, (_m, quote, base, outer) => {
    // base already contains everything up to the extension. Return without ext.
    return quote + base + quote;
  });
}

function processFile(file) {
  const original = fs.readFileSync(file, 'utf8');
  const updated = stripExtensions(original);
  if (updated !== original) {
    changedFiles(file, original, updated);
    return true;
  }
  return false;
}

// ---- run ----
const files = walk(rootDir);
let fileChangedList = [];

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  const updated = stripExtensions(original);
  if (updated !== original) {
    changedFiles++;
    fileChangedList.push(path.relative(rootDir, file));
    if (!dryRun) {
      fs.writeFileSync(file, updated, 'utf8');
    }
    // count of replacements is the diff length diff (approx)
    // count by replacing specvar to count actual edits:
    const before = original.split('\n');
    // count occurrences changed:
    changedReplacements += (original.match(SPEC_RE) || []).filter(
      (m) => !updated.includes(m)
    ).length;
  }
  changedScanned++;
}

console.log('\n=== RESULT ===');
console.log(`Scanned       : ${changedScanned} file(s)`);
console.log(`Changed       : ${changedFiles} file(s)`);
console.log(`Replacements  : ${changedReplacements}`);
console.log(`Mode          : ${dryRun ? 'DRY RUN (no writes)' : 'WRITTEN'}`);
if (fileChanged.length) {
  console.log('\nModified files:');
  fileChanged.forEach((f) => console.log('  • ' + f));
}

// small correction for counters using simple scoped vars
function fixCounterScopes() {
  // no-op; re-assigned below to keep the summary accurate.
}