import fs from 'fs';
import path from 'path';

const TARGET_DIR = './FingerMobile Protocol/apps/frontend-main/src'; 

const batchFix = (dir) => {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      batchFix(filePath);
      continue;
    }

    if (!filePath.match(/\.(tsx|ts|js|jsx)$/)) continue;

    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // 1. REVERT NEXT.JS TRASH & RESTORE REACT ROUTER DOM
    content = content.replace(/import\s+Link\s+from\s+['"]next\/link['"];?/g, '');
    content = content.replace(/import\s+{?\s*useRouter\s*}?\s+from\s+['"]next\/router['"];?/g, '');
    
    // Check if Link is already imported from another library to avoid conflicts
    const hasLinkFromOtherLib = /import\s+{[^}]*Link[^}]*}\s+from\s+['"][^'"]*[^react][^'"]*['"]/.test(content) ||
                               /import\s+Link\s+from\s+['"][^'"]*[^react][^'"]*['"]/.test(content);
    
    // Ensure react-router-dom is present if routing hooks are used
    const needsRRD = content.includes('useNavigate') || content.includes('useParams') || content.includes('Link');
    if (needsRRD && !content.includes("from 'react-router-dom'")) {
      if (hasLinkFromOtherLib) {
        // Use an alias for Link to avoid conflicts
        content = `import { Link as RouterLink, useNavigate, useParams, useLocation } from 'react-router-dom';\n` + content;
      } else {
        content = `import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';\n` + content;
      }
    }

    // 2. FIX MISSING REACT HOOKS (Pattern 1)
    const hooksUsed = [];
    if (content.includes('useState') && !content.includes('{ useState') && !content.includes('from \'react\'')) hooksUsed.push('useState');
    if (content.includes('useEffect') && !content.includes('{ useEffect') && !content.includes('from \'react\'')) hooksUsed.push('useEffect');
    if (content.includes('useRef') && !content.includes('{ useRef') && !content.includes('from \'react\'')) hooksUsed.push('useRef');

    // Check if hooks are already imported somewhere in the file
    const allReactImports = content.match(/import\s+(?:React(?:,\s*\{([^}]*)\})?|{([^}]*)})\s+from\s+['"]react['"]/g) || [];
    
    if (allReactImports.length > 0) {
      // Parse existing hooks from all React imports
      let existingHooks = [];
      allReactImports.forEach(importStmt => {
        const match = importStmt.match(/import\s+(?:React(?:,\s*\{([^}]*)\})?|{([^}]*)})\s+from\s+['"]react['"]/);
        if (match) {
          let hookStr = '';
          if (match[1]) hookStr = match[1];
          else if (match[2]) hookStr = match[2];
          
          if (hookStr) {
            existingHooks = existingHooks.concat(hookStr.split(',').map(h => h.trim()));
          }
        }
      });
      
      // Filter out hooks that are already imported
      const neededHooks = hooksUsed.filter(hook => !existingHooks.includes(hook));
      
      if (neededHooks.length > 0) {
        // Find and update the first React import
        content = content.replace(/import\s+(?:React(?:,\s*\{([^}]*)\})?|{([^}]*)})\s+from\s+['"]react['"];?/, (match, hooks1, hooks2) => {
          let allHooks = [];
          if (hooks1) allHooks = allHooks.concat(hooks1.split(',').map(h => h.trim()));
          if (hooks2) allHooks = allHooks.concat(hooks2.split(',').map(h => h.trim()));
          
          // Add the needed hooks
          allHooks = [...new Set(allHooks.concat(neededHooks))]; // Remove duplicates with Set
          
          // Determine if React is part of the import
          const hasReact = match.includes('React');
          if (hasReact) {
            return `import React, { ${allHooks.join(', ')} } from 'react';`;
          } else {
            return `import { ${allHooks.join(', ')} } from 'react';`;
          }
        });
      }
    } else {
      // No React imports found, add a new one with needed hooks
      if (hooksUsed.length > 0) {
        content = `import React, { ${hooksUsed.join(', ')} } from 'react';\n` + content;
      } else {
        // 3. FIX UMD GLOBAL / MISSING REACT (Pattern 3) - only if no React import exists
        if (!content.includes("import React") && (content.includes('<') || content.match(/function\s+\w+\s*\(|const\s+\w+\s*=\s*\(|=>\s*</))) {
          content = `import React from 'react';\n` + content;
        }
      }
    }

    // 4. Remove duplicate React imports (clean up multiple React imports)
    const reactImportMatches = content.match(/import\s+(?:React(?:,\s*\{[^}]*\})?|{[^}]*})\s+from\s+['"]react['"];?/g);
    if (reactImportMatches && reactImportMatches.length > 1) {
      // Combine all React imports into one
      let combinedReact = 'import React, { ';
      let hasReact = false;
      let allHooks = [];
      
      reactImportMatches.forEach(match => {
        const parsed = match.match(/import\s+(?:React(?:,\s*\{([^}]*)\})?|{([^}]*)})\s+from\s+['"]react['"]/);
        if (parsed) {
          if (parsed[0].includes('React')) hasReact = true;
          if (parsed[1]) allHooks = allHooks.concat(parsed[1].split(',').map(h => h.trim()));
          if (parsed[2]) allHooks = allHooks.concat(parsed[2].split(',').map(h => h.trim()));
        }
      });
      
      // Remove duplicates
      allHooks = [...new Set(allHooks.filter(h => h && h !== 'React'))];
      
      if (allHooks.length > 0) {
        combinedReact += `${allHooks.join(', ')} } from 'react';`;
      } else {
        combinedReact = hasReact ? "import React from 'react';" : '';
      }
      
      // Replace all React imports with the combined one
      content = content.replace(/import\s+(?:React(?:,\s*\{[^}]*\})?|{[^}]*})\s+from\s+['"]react['"];?\s*/g, '');
      if (combinedReact) {
        content = combinedReact + '\n' + content;
      }
    }

    // 5. RESTORE ROUTING CALLS (Pattern 5)
    // Only replace if RouterLink alias was used
    if (hasLinkFromOtherLib) {
      content = content.replace(/router\.push\(/g, 'navigate(');
      content = content.replace(/router\.query/g, 'params');
    } else {
      content = content.replace(/router\.push\(/g, 'navigate(');
      content = content.replace(/router\.query/g, 'params');
    }

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
    }
  }
};

console.log("🔥 Initializing SPA-Grade Repair (React Router DOM v6)...");
batchFix(TARGET_DIR);
console.log("🏁 Restoration Complete.");