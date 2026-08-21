const { exec } = require('child_process');
const fs = require('fs');

console.log('Running TypeScript compiler to check for errors...\n');

exec('npx tsc --noEmit --skipLibCheck', { cwd: __dirname }, (error, stdout, stderr) => {
  const fullOutput = stdout + stderr;
  
  // Count the number of errors by counting lines that start with file paths ending in .ts or .tsx
  const errorLines = fullOutput.split('\n').filter(line => 
    line.includes('.ts') && (line.includes(': error TS') || line.includes('error')))
    
  console.log(`Found ${errorLines.length} TypeScript error lines\n`);
  console.log('Full output:');
  console.log(fullOutput.substring(0, 2000)); // Limit output to first 2000 chars
  
  // Write full output to file
  fs.writeFileSync('./typescript-error-report.txt', `Total error lines: ${errorLines.length}\n\n${fullOutput}`);
  console.log('\nFull report saved to typescript-error-report.txt');
});