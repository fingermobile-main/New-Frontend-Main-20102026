import fs from 'fs';
import path from 'path';

const TARGET_DIR = './FingerMobile Protocol/apps/frontend-main/src'; 

const fixFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // 1. DEDUPLICATION ENGINE (The App.tsx fix)
  // Finds all variations of import ... from 'react' and extracts the unique parts
  const reactImportRegex = /import\s+(?:React)?\s*(?:,\s*{([^}]*)})?\s*from\s+['"]react['"];?/g;
  let allHooks = new Set();
  let hasDefaultReact = false;
  let match;

  while ((match = reactImportRegex.exec(content)) !== null) {
    if (match[0].includes('React')) hasDefaultReact = true;
    if (match[1]) {
      match[1].split(',').forEach(h => allHooks.add(h.trim()));
    }
  }

  // If multiple imports were found, remove them and replace with one clean line
  if (content.match(reactImportRegex)?.length > 1 || (content.includes('useState') && !content.includes('{ useState'))) {
    content = content.replace(reactImportRegex, ''); // Remove all existing react imports
    
    // Add missing hooks detected in body
    ['useState', 'useEffect', 'useRef'].forEach(h => {
      if (content.includes(h)) allHooks.add(h);
    });

    const hookString = allHooks.size > 0 ? `, { ${Array.from(allHooks).join(', ')} }` : '';
    const newImport = `import React${hookString} from 'react';\n`;
    content = newImport + content.trimStart();
  }

  // 2. ROUTING DEDUPLICATION (React Router DOM)
  const rrdImportRegex = /import\s+{[^}]*}\s+from\s+['"]react-router-dom['"];?/g;
  let rrdMembers = new Set();
  let rrdMatch;

  while ((rrdMatch = rrdImportRegex.exec(content)) !== null) {
      const members = rrdMatch[0].match(/{([^}]*)}/)[1];
      members.split(',').forEach(m => rrdMembers.add(m.trim()));
  }

  if (content.match(rrdImportRegex)?.length > 0) {
      content = content.replace(rrdImportRegex, '');
      // Ensure key v6 hooks are present
      if (content.includes('useNavigate')) rrdMembers.add('useNavigate');
      if (content.includes('useParams')) rrdMembers.add('useParams');
      if (content.includes('Link')) rrdMembers.add('Link');
      
      const newRRD = `import { ${Array.from(rrdMembers).join(', ')} } from 'react-router-dom';\n`;
      content = newRRD + content.trimStart();
  }

  // 3. CLEANUP NEXT.JS LEFTOVERS
  content = content.replace(/import\s+Link\s+from\s+['"]next\/link['"];?/g, '');
  content = content.replace(/import\s+{[^}]*}\s+from\s+['"]next\/router['"];?/g, '');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content.trim(), 'utf8');
    console.log(`✨ Normalized: ${filePath}`);
  }
};

const walk = (dir) => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) walk(fullPath);
    else if (fullPath.match(/\.(tsx|ts|jsx|js)$/)) fixFile(fullPath);
  });
};

console.log("🚀 Running Deduped SPA Repair...");
walk(TARGET_DIR);
console.log("✅ Done.");