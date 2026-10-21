import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PAGES_DIR = path.resolve(__dirname, '../src/pages');
const FRONTEND_ROOT = path.resolve(__dirname, '..');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== '__tests__' && file !== 'node_modules') {
        getAllFiles(filePath, fileList);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allPagePaths = getAllFiles(PAGES_DIR);

const auditResults = allPagePaths.map(filePath => {
  const relativePath = path.relative(PAGES_DIR, filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // Component Name
  const exportMatch = content.match(/export\s+(?:default\s+)?(?:function\s+|const\s+|class\s+)([A-Za-z0-9_]+)/) ||
                      content.match(/const\s+([A-Za-z0-9_]+)\s*:\s*React\.FC/) ||
                      content.match(/function\s+([A-Za-z0-9_]+)\s*\(/);
  const componentName = exportMatch ? exportMatch[1] : path.basename(filePath, path.extname(filePath));

  // Determine Domain/Subfolder
  const dirParts = relativePath.split(path.sep);
  const domain = dirParts.length > 1 ? dirParts[0] : 'root';

  // State
  const hasState = /useState|useReducer|useSelector/.test(content);
  const stateMatches = [...content.matchAll(/const\s+\[([a-zA-Z0-9_]+),\s*set[a-zA-Z0-9_]+\]\s*=\s*useState/g)].map(m => m[1]);

  // API calls
  const apiCalls = [];
  const apiRegex = /(?:fetch|axios\.(?:get|post|put|delete|patch)|api\.(?:get|post|put|delete|patch)|\.get|\.post|\.put|\.delete)\s*\(\s*['"`]([^'"`]+)['"`]/g;
  let apiMatch;
  while ((apiMatch = apiRegex.exec(content)) !== null) {
    if (apiMatch[1].startsWith('/') || apiMatch[1].startsWith('http') || apiMatch[1].includes('api')) {
      apiCalls.push(apiMatch[1]);
    }
  }

  // Handlers
  const handlers = [...content.matchAll(/(?:const|function)\s+(handle[A-Za-z0-9_]+)/g)].map(m => m[1]);

  // Buttons and actions
  const buttonCount = (content.match(/<button/g) || []).length;
  const inputCount = (content.match(/<input|<textarea|<select/g) || []).length;

  // Mock / Stub indicators
  const hasMockData = /mock|dummy|fake|sample[A-Z]|SAMPLE_/i.test(content);
  const hasTodo = /TODO|FIXME|TBD|stub/i.test(content);
  const hasEmptyHandlers = /onClick=\{\s*\(\)\s*=>\s*\{\s*\}\s*\}/.test(content) || /alert\(/.test(content);

  // CRUD capabilities
  const canCreate = /create|add|new|insert/i.test(content) && (buttonCount > 0 || handlers.length > 0);
  const canEdit = /edit|update|modify|save/i.test(content) && handlers.length > 0;
  const canDelete = /delete|remove|destroy|archive/i.test(content) && handlers.length > 0;
  const hasTableOrGrid = /table|<tbody|<tr|grid|list/i.test(content);

  // Classification
  let implementationStatus = 'Full Logic';
  const gaps = [];

  if (apiCalls.length === 0 && !content.includes('Service.')) {
    gaps.push('No backend API integration (isolated UI / local state only)');
  }
  if (hasMockData) {
    gaps.push('Relies on hardcoded mock/sample datasets');
  }
  if (hasEmptyHandlers) {
    gaps.push('Contains empty dummy onClick stubs or alert placeholders');
  }
  if (hasTodo) {
    gaps.push('Contains inline TODO / FIXME comments');
  }
  if (handlers.length === 0 && buttonCount > 2) {
    gaps.push('Interactive buttons present without dedicated event handlers');
  }

  if (gaps.length === 0) {
    implementationStatus = 'Complete / Governed';
  } else if (gaps.length <= 2) {
    implementationStatus = 'Partial / Needs Wiring';
  } else {
    implementationStatus = 'High Gaps / Stub';
  }

  return {
    filePath: `src/pages/${relativePath}`,
    fileName: path.basename(filePath),
    componentName,
    domain,
    lineCount: lines.length,
    buttonCount,
    inputCount,
    stateCount: stateMatches.length,
    handlers: handlers.slice(0, 5),
    apiCalls: [...new Set(apiCalls)].slice(0, 4),
    canCreate,
    canEdit,
    canDelete,
    hasTableOrGrid,
    hasMockData,
    gaps,
    implementationStatus
  };
});

// Group by domain
const domainGroups = {};
auditResults.forEach(r => {
  if (!domainGroups[r.domain]) domainGroups[r.domain] = [];
  domainGroups[r.domain].push(r);
});

console.log(`Audited total pages: ${auditResults.length}`);
console.log(`Domains found: ${Object.keys(domainGroups).length}`);

// Write JSON artifact
const outputPath = path.resolve(__dirname, '../../PAGES_AUDIT_356_INSPECTION.json');
fs.writeFileSync(outputPath, JSON.stringify(auditResults, null, 2), 'utf8');
console.log(`Saved detailed audit to: ${outputPath}`);

// Output summary counts
const fullyGoverned = auditResults.filter(r => r.implementationStatus === 'Complete / Governed').length;
const partial = auditResults.filter(r => r.implementationStatus === 'Partial / Needs Wiring').length;
const highGaps = auditResults.filter(r => r.implementationStatus === 'High Gaps / Stub').length;

console.log(`Complete / Governed: ${fullyGoverned}`);
console.log(`Partial / Needs Wiring: ${partial}`);
console.log(`High Gaps / Stub: ${highGaps}`);
