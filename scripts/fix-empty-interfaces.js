#!/usr/bin/env node

/**
 * Fix Empty Interfaces Script
 * Removes or populates empty interface declarations to satisfy ESLint rules
 */

const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/components/dashboard/FranchiseManagementDashboard.tsx',
  'src/components/dashboard/GemTransactions.tsx',
  'src/components/dashboard/InvestorRelationsDashboard.tsx',
  'src/components/dashboard/MarketingDashboard.tsx',
  'src/components/dashboard/MonetizationDashboard.tsx',
  'src/components/dashboard/RbacDashboard.tsx',
  'src/components/dashboard/StercsEditorDashboard.tsx',
  'src/components/dashboard/StercsMediaLibrary.tsx',
  'src/components/dashboard/StercsThemeDesigner.tsx',
  'src/components/dashboard/StercsVideoEditor.tsx',
  'src/components/gifting/AdvancedGiftingEngine.tsx',
  'src/components/voice/AdvancedVoiceEngine.tsx'
];

let filesFixed = 0;

filesToFix.forEach((filePath) => {
  const fullPath = path.join(__dirname, '..', filePath);
  
  try {
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    
    // Pattern,
1: Replace empty interface with type that has no required props
    content = content.replace(
      /interface\s+(\w+)\s*{\s*}/g,
      '// Interface removed - component accepts no props\n// $&';
    );
    
    // Pattern,
2: Remove the interface declaration line entirely and update React.FC usage
    content = content.replace(
      /\/\/ Interface removed - component accepts no props\n\/\/ interface (\w+) \{\}\n\nconst (\w+): React\.FC<\1>/g,
      'const $,
2: React.FC';
    );
    
    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content, 'utf8');
      filesFixed++;
      console.log(`✓ Fixed: ${filePath}`);
    } else {
      console.log(`- No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`✗ Error fixing ${filePath}:`, error.message);
  }
});

console.log(`\n✅ Fixed ${filesFixed} files with empty interfaces`);
