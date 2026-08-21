import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIR = path.resolve(__dirname, 'src');

const processFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // 1. Remove the broken ESLint rule if it exists in comments/config
  content = content.replace(/\/*\s*eslint-disable\s+@typescript-eslint\/no-extra-semi\s*\*\//g, '');
  
  // 2. Surgical Unused Hook Removal (React)
  // We look for the definitions ESLint hates and remove them from the import block
  const unusedVars = ['useState', 'useEffect', 'useRef', 'Link', 'useNavigate', 'useParams', 'useLocation', 'RouterLink'];
  
  unusedVars.forEach(v => {
    // Split content into imports section and rest
    const lines = content.split('\n');
    let inImportSection = true;
    let importLines = [];
    let codeLines = [];
    
    // Identify import lines vs code lines
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith('import ') && inImportSection) {
        importLines.push(line);
      } else if (line.trim() === '' && inImportSection) {
        importLines.push(line);
      } else {
        inImportSection = false;
        codeLines.push(line);
      }
    }
    
    // Check if variable is used in the code section (after imports)
    const codeContent = codeLines.join('\n');
    const isUsedInCode = new RegExp(`\\b${v}\\b`).test(codeContent);
    
    if (!isUsedInCode) {
      // Process each import line to remove unused variables
      importLines = importLines.map(line => {
        // Handle named imports like: import { useState, useEffect } from 'react';
        if (line.includes('{') && line.includes('}') && line.includes(v)) {
          // Find the import statement containing the variable
          const regex = new RegExp(`(import\\s*\\{)([^}]*)(\\}\\s*from\\s*['"][^'"]+['"]\\s*;)`);
          const match = line.match(regex);
          
          if (match) {
            // Extract the variables inside the braces
            let varsStr = match[2];
            let vars = varsStr.split(',').map(varName => varName.trim());
            
            // Remove the unused variable
            vars = vars.filter(varName => varName !== v);
            
            // Recreate the import statement
            if (vars.length > 0) {
              return `import { ${vars.join(', ')} } from ${match[3]}`;
            } else {
              // If no variables left, remove the entire import line
              return '';
            }
          }
        }
        
        // Handle default imports if the variable matches
        if (line.includes(`import ${v}`) && !line.includes('{')) {
          // Remove the entire import line for default imports
          return '';
        }
        
        return line;
      }).filter(line => line.trim() !== ''); // Remove empty lines
      
      // Reconstruct the content
      content = [...importLines, ...codeLines].join('\n');
    }
  });

  // 3. Remove empty import statements
  content = content.replace(/^\s*import\s*\{\s*\}\s*from\s*['"][^'"]+['"]\s*;\s*$/gm, '');


  // 5. Cleanup whitespace created by import removals
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`🔨 Hammered: ${filePath}`);
  }
};

const walk = (dir) => {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.match(/\.(tsx|ts|jsx|js)$/)) processFile(p);
  });
};

console.log('Starting lint-crusher...');
walk(TARGET_DIR);
console.log("🏁 Build Path Cleared.");