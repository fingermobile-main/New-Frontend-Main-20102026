// This is a temporary script to install missing dependencies
// Run this with: node install_deps.mjs

import { execSync } from 'child_process';

console.log('Installing missing dependencies...');

try {
  // Install the required packages
  execSync('npm install clsx tailwind-merge @radix-ui/react-slot @radix-ui/react-select class-variance-authority lucide-react', { stdio: 'inherit' });
  console.log('Dependencies installed successfully!');
} catch (error) {
  console.error('Error installing dependencies:', error.message);
}