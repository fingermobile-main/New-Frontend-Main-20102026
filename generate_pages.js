const fs = require('fs');
const path = require('path');

const missingPagesFile = path.join(__dirname, 'missing_pages.txt');
const pagesDir = path.join(__dirname, 'FingerMobile Protocol', 'apps', 'frontend-main', 'src', 'pages');

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

const lines = fs.readFileSync(missingPagesFile, 'utf8').split('\n').filter(Boolean);

lines.forEach(line => {
  // line looks like: AIAvatarGenerator.js
  const baseName = line.replace('.js', '');
  const tsxName = `${baseName}.tsx`;
  const filePath = path.join(pagesDir, tsxName);
  
  if (!fs.existsSync(filePath)) {
    const componentCode = `import React from 'react';\n\nconst ${baseName} = () => {\n  return (\n    <div className="p-8">\n      <h1 className="text-2xl font-bold">${baseName}</h1>\n      <p>This is a placeholder component for the ${baseName} page.</p>\n    </div>\n  );\n};\n\nexport default ${baseName};\n`;
    fs.writeFileSync(filePath, componentCode, 'utf8');
    console.log(`Generated ${tsxName}`);
  }
});
