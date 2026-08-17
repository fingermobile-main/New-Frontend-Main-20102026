import fs from 'fs';
import path from 'path';

const fixSeadsPage = () => {
  const filePath = './src/pages/SeadsPage.tsx';
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if the correct import is already present
  if (!content.includes('SeadsInitiative') || !content.includes('../types/seads')) {
     // Remove old import if it exists
     content = content.replace(/import { SeadsInitiative } from '..\/types\/context';/g, '');
     // Add the correct import for the model we just created
     content = `import { SeadsInitiative } from '../types/seads';\n` + content;
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("✅ SeadsPage Model Restored.");
};

const fixBrokenTypesFile = () => {
    const filePath = './src/types.ts';
    let content = fs.readFileSync(filePath, 'utf8');
    // Fix Pattern: import from 'react-router-dom' (Missing identifier)
    content = content.replace(/import\s+from\s+['"]react-router-dom['"];/g, "import { Link, useNavigate } from 'react-router-dom';");
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("✅ General Types Cleaned.");
};

fixSeadsPage();
fixBrokenTypesFile();