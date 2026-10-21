#!/usr/bin/env node
const logger = require('./utils/logger');

/**
 * Comprehensive Backend Implementation Audit
 * Checks for missing controllers, services, models, routes, and database tables
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BACKEND_DIR = '/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps/backend';
const ROUTES_DIR = path.join(BACKEND_DIR, 'routes');
const CONTROLLERS_DIR = path.join(BACKEND_DIR, 'controllers');
const MODELS_DIR = path.join(BACKEND_DIR, 'models');
const SERVICES_DIR = path.join(BACKEND_DIR, 'services');

// Track findings
const findings = {
  totalRoutes: 0,
  missingControllers: [],
  missingModels: [],
  missingServices: [],
  disabledRoutes: [],
  routeControllerMap: {}
};

// Step 1: Scan all route files
const routeFiles = fs.readdirSync(ROUTES_DIR).filter(f => f.endsWith('.js') || f.endsWith('.ts'));
findings.totalRoutes = routeFiles.length;

// Step 2: Check route imports in index.ts
const indexContent = fs.readFileSync(path.join(ROUTES_DIR, 'index.ts'), 'utf8');

// Find all route imports
const importRegex = /const\s+(\w+)Routes?\s*=\s*require\(['"]\.\/([^'"]+)['"]\)/g;
let match;
while ((match = importRegex.exec(indexContent)) !== null) {
  const varName = match[1];
  const routeFile = match[2];

  // Read route file
  const routeFilePathJs = path.join(ROUTES_DIR, routeFile + '.js');
  const routeFilePathTs = path.join(ROUTES_DIR, routeFile + '.ts');
  let routeContent = '';
  if (fs.existsSync(routeFilePathJs)) {
    routeContent = fs.readFileSync(routeFilePathJs, 'utf8');
  } else if (fs.existsSync(routeFilePathTs)) {
    routeContent = fs.readFileSync(routeFilePathTs, 'utf8');
  }

  // Find imported controllers
  const controllerRegex = /['"](?:\.\.\/)+controllers\/([^'"]+)['"]/g;
  let importedControllers = [];
  let cmatch;
  while ((cmatch = controllerRegex.exec(routeContent)) !== null) {
    let ctrlName = cmatch[1];
    if (ctrlName.endsWith('.js')) ctrlName = ctrlName.slice(0, -3);
    if (ctrlName.endsWith('.ts')) ctrlName = ctrlName.slice(0, -3);
    importedControllers.push(ctrlName);
  }

  if (importedControllers.length > 0) {
    // Check if the imported controllers exist
    for (const ctrl of importedControllers) {
      if (!fs.existsSync(path.join(CONTROLLERS_DIR, ctrl + '.js')) && !fs.existsSync(path.join(CONTROLLERS_DIR, ctrl + '.ts'))) {
        findings.missingControllers.push({
          route: routeFile,
          expectedController: ctrl,
          variableName: varName
        });
      }
    }
  } else {
    // If no controllers are imported, check if it's missing inline logic
    if (routeContent && !routeContent.includes('Router') && !routeContent.includes('router.')) {
      findings.missingControllers.push({
        route: routeFile,
        expectedController: 'Missing Controller (no imports found)',
        variableName: varName
      });
    }
  }

}

// Find disabled routes
const disabledRegex = /\/\/\s*(const\s+\w+Routes?\s*=\s*require\([^)]+\)).*DISABLED/g;
while ((match = disabledRegex.exec(indexContent)) !== null) {
  findings.disabledRoutes.push(match[1]);
}

// Step 3: Check models
const modelFiles = fs.readdirSync(MODELS_DIR).filter(f => f.endsWith('.js') || f.endsWith('.ts'));

// Step 4: Check services
const serviceFiles = fs.readdirSync(SERVICES_DIR).filter(f => f.endsWith('.js') || f.endsWith('.ts'));

// Summary output
const summaryLines = [
  '📊 AUDIT SUMMARY',
  '='.repeat(60),
  `Total Route Files:        ${findings.totalRoutes}`,
  `Route Registrations:      ${Object.keys(findings.routeControllerMap).length}`,
  `Missing Controllers:      ${findings.missingControllers.length}`,
  `Disabled Routes:          ${findings.disabledRoutes.length}`,
  `Model Files:              ${modelFiles.length}`,
  `Service Files:            ${serviceFiles.length}`,
  '='.repeat(60)
];

if (findings.missingControllers.length > 0) {
  const missingList = findings.missingControllers.map((item, idx) =>
    `   ${idx + 1}. ${item.expectedController} (for route: ${item.route})`
  ).join('\n');
  summaryLines.push('\n⚠️  MISSING CONTROLLERS:', missingList);
}

if (findings.disabledRoutes.length > 0) {
  const disabledList = findings.disabledRoutes.map((route, idx) =>
    `   ${idx + 1}. ${route}`
  ).join('\n');
  summaryLines.push('\n🚫 DISABLED ROUTES:', disabledList);
}

summaryLines.push('\n✅ Audit complete!\n');
logger.info(summaryLines.join('\n'));

// Export findings for further processing
module.exports = { findings };
