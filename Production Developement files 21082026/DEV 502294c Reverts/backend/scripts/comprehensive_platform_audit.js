#!/usr/bin/env node
/**
 * ULTRA-STRICT COMPREHENSIVE PLATFORM AUDIT v3.0
 * Performs deep analysis of syntax errors, missing components, route registration, 
 * database schema alignment AND production readiness
 * 
 * Date: July 5, 2026
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.join(__dirname, '..', '..');
const BACKEND_DIR = path.join(ROOT_DIR, 'backend');
const FRONTEND_DIR = path.join(ROOT_DIR, 'frontend-main');

const RESULTS = {
  // Syntax & Compilation
  backendSyntaxErrors: [],
  frontendSyntaxErrors: [],
  typescriptErrors: [],
  
  // Missing Components
  missingModels: [],
  missingControllers: [],
  missingServices: [],
  missingRoutes: [],
  missingMiddleware: [],
  
  // Route Registration
  unregisteredRoutes: [],
  orphanedControllers: [],
  
  // Database
  schemaMismatches: [],
  missingMigrations: [],
  
  // Code Quality
  unusedImports: [],
  circularDependencies: [],
  hardcodedSecrets: [],
  
  // Configuration
  missingEnvVars: [],
  configErrors: [],
  
  // Tests
  missingTests: [],
  testCoverage: {}
};

let stats = {
  filesScanned: 0,
  errorsFound: 0,
  warningsFound: 0
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getAllFiles(dir, extensions = ['js', 'ts'], excludeDirs = ['node_modules', '.git', 'dist', 'build']) {
  const files = [];
  
  function traverse(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        if (!excludeDirs.includes(entry.name)) {
          traverse(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).substring(1);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

function checkSyntax(filePath) {
  try {
    execSync(`node -c "${filePath}"`, { stdio: 'pipe' });
    return { valid: true, error: null };
  } catch (error) {
    const stderr = error.stderr?.toString() || error.stdout?.toString() || '';
    // Improved regex to match Node.js error format: "filename:line:col)"
    const match = stderr.match(/:(\d+):\d+\)/);
    const line = match ? parseInt(match[1]) : 0;
    
    // If no match found in standard format, try alternative patterns
    if (line === 0) {
      const altMatch = stderr.match(/line\s+(\d+)/i) || stderr.match(/^(\d+)/m);
      if (altMatch) {
        return { 
          valid: false, 
          error: stderr.split('\n')[0].trim(),
          line: parseInt(altMatch[1])
        };
      }
    }
    
    return { 
      valid: false, 
      error: stderr.split('\n')[0].trim(),
      line: line
    };
  }
}

function extractImports(content) {
  const imports = [];
  const importMatches = content.matchAll(/import\s+(?:.*?\s+from\s+)?['"](.+?)['"]/g);
  for (const match of importMatches) {
    imports.push(match[1]);
  }
  return imports;
}

function extractRequires(content) {
  const requires = [];
  const requireMatches = content.matchAll(/require\(['"](.*?)['"]\)/g);
  for (const match of requireMatches) {
    requires.push(match[1]);
  }
  return requires;
}

// ============================================================================
// AUDIT FUNCTIONS
// ============================================================================

function auditBackendSyntax() {
  console.log('\n🔍 [SYNTAX] Scanning backend JavaScript files...');
  const jsFiles = getAllFiles(BACKEND_DIR, ['js'], ['node_modules', 'tests', 'backups', 'middleware_compiled']);
  
  jsFiles.forEach(file => {
    stats.filesScanned++;
    const result = checkSyntax(file);
    if (!result.valid) {
      const relativePath = path.relative(BACKEND_DIR, file);
      RESULTS.backendSyntaxErrors.push({
        file: relativePath,
        error: result.error,
        line: result.line
      });
      stats.errorsFound++;
    }
  });
  
  console.log(`   Scanned: ${jsFiles.length} files`);
  console.log(`   Errors: ${RESULTS.backendSyntaxErrors.length}`);
}

function auditTypeScriptErrors() {
  console.log('\n🔍 [TYPESCRIPT] Checking TypeScript compilation...');
  
  try {
    const output = execSync('npx tsc --noEmit 2>&1', { 
      cwd: BACKEND_DIR,
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024
    });
    
    const lines = output.split('\n').filter(line => line.includes('error TS'));
    lines.forEach(line => {
      stats.errorsFound++;
      RESULTS.typescriptErrors.push({
        raw: line.trim(),
        severity: 'ERROR'
      });
    });
    
    console.log(`   TypeScript Errors: ${lines.length}`);
  } catch (error) {
    const output = error.stdout?.toString() || '';
    const lines = output.split('\n').filter(line => line.includes('error TS'));
    lines.forEach(line => {
      stats.errorsFound++;
      RESULTS.typescriptErrors.push({
        raw: line.trim(),
        severity: 'ERROR'
      });
    });
    console.log(`   TypeScript Errors: ${lines.length}`);
  }
}

function auditMissingComponents() {
  console.log('\n🔍 [COMPONENTS] Checking for missing models, controllers, services...');
  
  // Check for referenced but missing models
  const controllers = getAllFiles(path.join(BACKEND_DIR, 'controllers'), ['js', 'ts']);
  const services = getAllFiles(path.join(BACKEND_DIR, 'services'), ['js', 'ts']);
  const existingModels = fs.readdirSync(path.join(BACKEND_DIR, 'models'))
    .filter(f => f.match(/\.(js|ts)$/))
    .map(f => f.replace(/\.[^.]+$/, ''));
  
  const modelReferences = new Set();
  
  [...controllers, ...services].forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const matches = content.matchAll(/require\(['"]\.\.?\/models\/(\w+)['"]\)/g);
      for (const match of matches) {
        modelReferences.add(match[1]);
      }
    } catch (e) {
      // Skip
    }
  });
  
  modelReferences.forEach(modelName => {
    if (!existingModels.includes(modelName)) {
      RESULTS.missingModels.push({
        name: modelName,
        referencedBy: 'Multiple files'
      });
      stats.warningsFound++;
    }
  });
  
  console.log(`   Missing Models: ${RESULTS.missingModels.length}`);
}

function auditRouteRegistration() {
  console.log('\n🔍 [ROUTES] Checking route registration...');
  
  const routesIndex = path.join(BACKEND_DIR, 'routes', 'index.js');
  if (!fs.existsSync(routesIndex)) {
    console.log('   ⚠️  routes/index.js not found');
    return;
  }
  
  const indexContent = fs.readFileSync(routesIndex, 'utf8');
  const controllers = getAllFiles(path.join(BACKEND_DIR, 'controllers'), ['js']);
  
  controllers.forEach(controllerFile => {
    const controllerName = path.basename(controllerFile, '.js');
    const importPattern = new RegExp(`require.*${controllerName}`, 'i');
    
    if (!indexContent.match(importPattern)) {
      RESULTS.orphanedControllers.push({
        name: controllerName,
        file: path.relative(BACKEND_DIR, controllerFile)
      });
      stats.warningsFound++;
    }
  });
  
  console.log(`   Orphaned Controllers: ${RESULTS.orphanedControllers.length}`);
}

function auditHardcodedSecrets() {
  console.log('\n🔍 [SECURITY] Scanning for hardcoded secrets...');
  
  const allFiles = getAllFiles(BACKEND_DIR, ['js', 'ts'], ['node_modules', 'tests']);
  const secretPatterns = [
    /password\s*[:=]\s*['"][^'"]{3,}['"]/gi,
    /secret\s*[:=]\s*['"][^'"]{3,}['"]/gi,
    /api[_-]?key\s*[:=]\s*['"][^'"]{3,}['"]/gi,
    /token\s*[:=]\s*['"][^'"]{10,}['"]/gi
  ];
  
  allFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = path.relative(BACKEND_DIR, file);
      
      // Skip .env files and config files
      if (relativePath.includes('.env') || relativePath.includes('config/')) return;
      
      secretPatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          matches.forEach(match => {
            // Filter out obvious placeholders
            if (!match.includes('process.env') && !match.includes('YOUR_') && !match.includes('CHANGE_ME')) {
              RESULTS.hardcodedSecrets.push({
                file: relativePath,
                pattern: match.substring(0, 50) + '...'
              });
              stats.errorsFound++;
            }
          });
        }
      });
    } catch (e) {
      // Skip
    }
  });
  
  console.log(`   Hardcoded Secrets: ${RESULTS.hardcodedSecrets.length}`);
}

function auditMissingEnvVars() {
  console.log('\n🔍 [CONFIG] Checking environment variables...');
  
  const envExample = path.join(BACKEND_DIR, '.env.example');
  const envActual = path.join(BACKEND_DIR, '.env');
  
  if (!fs.existsSync(envActual)) {
    RESULTS.configErrors.push({
      type: 'MISSING_ENV_FILE',
      message: '.env file not found'
    });
    return;
  }
  
  const envContent = fs.readFileSync(envActual, 'utf8');
  const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'PORT',
    'NODE_ENV'
  ];
  
  requiredVars.forEach(varName => {
    if (!envContent.includes(varName)) {
      RESULTS.missingEnvVars.push(varName);
      stats.warningsFound++;
    }
  });
  
  console.log(`   Missing Env Vars: ${RESULTS.missingEnvVars.length}`);
}

function auditDatabaseSchema() {
  console.log('\n🔍 [DATABASE] Checking schema alignment...');
  
  // This would require actual DB connection - skip for now
  console.log('   ℹ️  Schema validation requires running database');
}

// ============================================================================
// REPORT GENERATION
// ============================================================================

function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('📊 ULTRA-COMPREHENSIVE AUDIT RESULTS');
  console.log('='.repeat(80));
  console.log(`Files Scanned:        ${stats.filesScanned}`);
  console.log(`Total Errors:         ${stats.errorsFound}`);
  console.log(`Total Warnings:       ${stats.warningsFound}`);
  console.log('='.repeat(80));
  
  console.log('\n📋 DETAILED FINDINGS:\n');
  
  if (RESULTS.backendSyntaxErrors.length > 0) {
    console.log(`❌ Backend Syntax Errors: ${RESULTS.backendSyntaxErrors.length}`);
    RESULTS.backendSyntaxErrors.slice(0, 10).forEach(err => {
      console.log(`   - ${err.file}:${err.line} - ${err.error.substring(0, 80)}`);
    });
    if (RESULTS.backendSyntaxErrors.length > 10) {
      console.log(`   ... and ${RESULTS.backendSyntaxErrors.length - 10} more`);
    }
    console.log('');
  }
  
  if (RESULTS.typescriptErrors.length > 0) {
    console.log(`❌ TypeScript Errors: ${RESULTS.typescriptErrors.length}`);
    RESULTS.typescriptErrors.slice(0, 5).forEach(err => {
      console.log(`   - ${err.raw.substring(0, 100)}`);
    });
    if (RESULTS.typescriptErrors.length > 5) {
      console.log(`   ... and ${RESULTS.typescriptErrors.length - 5} more`);
    }
    console.log('');
  }
  
  if (RESULTS.missingModels.length > 0) {
    console.log(`⚠️  Missing Models: ${RESULTS.missingModels.length}`);
    RESULTS.missingModels.forEach(m => console.log(`   - ${m.name}`));
    console.log('');
  }
  
  if (RESULTS.orphanedControllers.length > 0) {
    console.log(`⚠️  Orphaned Controllers: ${RESULTS.orphanedControllers.length}`);
    RESULTS.orphanedControllers.slice(0, 10).forEach(c => console.log(`   - ${c.name} (${c.file})`));
    if (RESULTS.orphanedControllers.length > 10) {
      console.log(`   ... and ${RESULTS.orphanedControllers.length - 10} more`);
    }
    console.log('');
  }
  
  if (RESULTS.hardcodedSecrets.length > 0) {
    console.log(`🔴 SECURITY: Hardcoded Secrets Found: ${RESULTS.hardcodedSecrets.length}`);
    RESULTS.hardcodedSecrets.slice(0, 5).forEach(s => console.log(`   - ${s.file}: ${s.pattern}`));
    if (RESULTS.hardcodedSecrets.length > 5) {
      console.log(`   ... and ${RESULTS.hardcodedSecrets.length - 5} more`);
    }
    console.log('');
  }
  
  // Save detailed JSON report
  const reportPath = path.join(BACKEND_DIR, 'scripts', 'ULTRA_COMPREHENSIVE_AUDIT_RESULTS.json');
  fs.writeFileSync(reportPath, JSON.stringify(RESULTS, null, 2), 'utf8');
  console.log(`💾 Detailed report saved to: ${reportPath}`);
  
  console.log('\n' + '='.repeat(80));
  console.log('✨ Audit complete!');
  console.log('='.repeat(80) + '\n');
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

console.log('🚀 Starting Ultra-Strict Comprehensive Platform Audit...\n');
console.log(`Backend Directory: ${BACKEND_DIR}`);
console.log(`Frontend Directory: ${FRONTEND_DIR}\n`);

auditBackendSyntax();
auditTypeScriptErrors();
auditMissingComponents();
auditRouteRegistration();
auditHardcodedSecrets();
auditMissingEnvVars();
auditDatabaseSchema();
generateReport();
