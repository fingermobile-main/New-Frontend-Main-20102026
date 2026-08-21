import fs from 'fs';
import path from 'path';

const TARGET_DIRS = ['./src']; // Adjust to your actual source folder

const fixFile = async (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Fix Pattern 1 & 3: Missing React and Hook Imports
  const hasUseState = content.includes('useState') && !content.includes('from \'react\'');
  const hasUseEffect = content.includes('useEffect') && !content.includes('from \'react\'');
  const hasUseRef = content.includes('useRef') && !content.includes('from \'react\'');
  
  if (hasUseState || hasUseEffect || hasUseRef || content.includes('<')) {
    // Inject React and Hooks if missing
    if (!content.includes("import React") && !content.includes("from 'react'")) {
      content = `import React, { useState, useEffect, useRef } from 'react';\n` + content;
    } else if (content.includes("import React from 'react'")) {
      // Fix Pattern 2: Duplicate/Incomplete React imports
      if (!content.includes('useState') && !content.includes('useEffect') && !content.includes('useRef')) {
        content = content.replace("import React from 'react'", "import React, { useState, useEffect, useRef } from 'react'");
      }
    }
  }

  // 2. Fix Pattern 4 & 5: Routing Migration (useParams / navigate)
  if (content.includes('useParams') && !content.includes('next/router')) {
    content = `import { useRouter } from 'next/router';\n` + content;
  }
  
  // Replace navigate calls with router.push
  content = content.replace(/navigate\(/g, 'router.push(');

  // 3. Fix Pattern 6: Quick Type Interface Patches (Member/Gem)
  // This is a surgical injection into your types file if detected
  if (filePath.includes('types') || filePath.includes('interfaces')) {
    if (content.includes('interface Member') && !content.includes('preferences')) {
      content = content.replace('interface Member {', 'interface Member {\n  preferences?: any;');
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
      const fixed = await fixFile(fullPath);
      if (fixed) console.log(`✅ Repaired: ${fullPath}`);
    }
  }
};

console.log("🚀 Starting Global Repair of 702 errors...");
walk(TARGET_DIRS[0]).then(() => console.log("🏁 Repair Complete. Run 'npm run build' now."));