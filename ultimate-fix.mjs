import fs from 'fs';
import path from 'path';

// Target only the pages directory for Next.js-specific fixes, and other directories for general fixes
const TARGET_DIRS = ['./FingerMobile Protocol/apps/frontend-main/src'];

const fixFile = async (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Check if file already has React imports
  const hasReactNamedImport = /import\s+React\b/.test(content);
  const hasReactNamespaceImport = /import\s+\*\s+as\s+React\b/.test(content);
  const hasIndividualHookImports = /import\s+\{[^}]*useState|useEffect|useRef/.test(content);
  const hasAnyReactImport = hasReactNamedImport || hasReactNamespaceImport || hasIndividualHookImports;

  // Check for usage of React features
  const hasUseState = /\buseState\b/.test(content) && !/\w+\s*\.\s*useState/.test(content);
  const hasUseEffect = /\buseEffect\b/.test(content) && !/\w+\s*\.\s*useEffect/.test(content);
  const hasUseRef = /\buseRef\b/.test(content) && !/\w+\s*\.\s*useRef/.test(content);
  const hasJSX = content.includes('<') && !content.includes('&lt;') && !content.includes('&gt;');

  // Determine if React and hooks need to be imported
  if ((hasUseState || hasUseEffect || hasUseRef || hasJSX) && (hasAnyReactImport || hasUseState || hasUseEffect || hasUseRef)) {
    // Check what imports are already present
    let needsUseState = hasUseState;
    let needsUseEffect = hasUseEffect;
    let needsUseRef = hasUseRef;
    
    // Check if individual hooks are already imported
    if (hasIndividualHookImports) {
      const importMatch = content.match(/import\s+\{([^}]+)\}\s+from\s+['"]react['"]/);
      if (importMatch) {
        const importedItems = importMatch[1].split(',').map(item => item.trim()).filter(item => item);
        if (importedItems.includes('useState')) needsUseState = false;
        if (importedItems.includes('useEffect')) needsUseEffect = false;
        if (importedItems.includes('useRef')) needsUseRef = false;
      }
    }
    
    // If we need to add some hooks but React is already imported
    if ((needsUseState || needsUseEffect || needsUseRef) && (hasReactNamedImport || hasReactNamespaceImport)) {
      // Find and update the existing React import
      content = content.replace(/(import\s+(?:React(?:,\s*\{[^}]*\})?|\*\s+as\s+React|{[^}]*React[^}]*}|{[^}]*,\s*React|React\s*,[^}]*\}))\s+from\s+['"]react['"]/, 
        (match, imports) => {
          // Parse the imports to add missing hooks
          let newImports = imports.replace('{', '').replace('}', '').trim();
          const importArray = newImports.split(',').map(i => i.trim()).filter(i => i);
          
          if (needsUseState && !importArray.includes('useState')) importArray.push('useState');
          if (needsUseEffect && !importArray.includes('useEffect')) importArray.push('useEffect');
          if (needsUseRef && !importArray.includes('useRef')) importArray.push('useRef');
          
          // Separate React from other imports
          const hasReact = importArray.includes('React');
          const otherImports = importArray.filter(i => i !== 'React');
          
          if (hasReact) {
            if (otherImports.length > 0) {
              return `import React, { ${otherImports.join(', ')} } from 'react'`;
            } else {
              return `import React from 'react'`;
            }
          } else {
            return `import { ${importArray.join(', ')} } from 'react'`;
          }
        });
    } else if (!hasAnyReactImport) {
      // If no React import exists, add a new one
      const hooksToImport = [];
      if (needsUseState) hooksToImport.push('useState');
      if (needsUseEffect) hooksToImport.push('useEffect');
      if (needsUseRef) hooksToImport.push('useRef');
      
      if (hooksToImport.length > 0) {
        content = `import React, { ${hooksToImport.join(', ')} } from 'react';\n` + content;
      } else {
        content = `import React from 'react';\n` + content;
      }
    }
  }

  // 2. Fix routing imports intelligently based on file location and existing imports
  const usesReactRouterDOM = content.includes("from 'react-router-dom'");
  const usesNextRouter = content.includes("from 'next/router'");
  
  // Apply routing fixes based on file path (Next.js pages directory vs other components)
  const isPageFile = filePath.includes('/pages/') || filePath.includes('/app/');
  
  // Only fix routing if it's potentially a Next.js page file and doesn't use React Router DOM
  if (isPageFile && !usesReactRouterDOM && (content.includes('useParams') && !usesNextRouter)) {
    if (!content.includes("import { useRouter") && !content.includes("from 'next/router'")) {
      content = `import { useRouter } from 'next/router';\n` + content;
    }
  }
  
  // Only replace navigate with router.push if this is a Next.js file (not using react-router-dom) and in page directory
  if (isPageFile && !usesReactRouterDOM) {
    content = content.replace(/navigate\(/g, 'router.push(');
  }

  // 3. Fix type interface patches
  if (filePath.includes('types') || filePath.includes('interfaces')) {
    if (content.includes('interface Member') && !content.includes('preferences')) {
      content = content.replace(/interface Member \{/, 'interface Member {\n  preferences?: any;');
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
};

const walk = async (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      await walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      try {
        const fixed = await fixFile(fullPath);
        if (fixed) console.log(`✅ Repaired: ${fullPath}`);
      } catch (err) {
        console.error(`❌ Error processing ${fullPath}:`, err.message);
      }
    }
  }
};

console.log("🚀 Starting Global Repair of React import and type issues...");
walk(TARGET_DIRS[0]).then(() => console.log("🏁 Repair Complete. Run 'npm run build' now."));