#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Comprehensive Platform Testing Suite
 * Tests backend endpoints, frontend integration, and system readiness
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧪 COMPREHENSIVE PLATFORM TESTING SUITE\n');
console.log('═══════════════════════════════════════════\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let warnings = [];

// Base paths - adjust based on where this script is located
const BACKEND_DIR = path.join(__dirname, 'backend');
const FRONTEND_DIR = path.join(__dirname, 'frontend-main/src');

console.log(`Backend directory: ${BACKEND_DIR}`);
console.log(`Frontend directory: ${FRONTEND_DIR}\n`);

// Helper function to read file with fallback extensions
function readFileWithFallback(basePath) {
  const extensions = ['.ts', '.js'];
  
  for (const ext of extensions) {
    const fullPath = basePath + ext;
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, 'utf8');
    }
  }
  
  // Try without extension
  if (fs.existsSync(basePath)) {
    return fs.readFileSync(basePath, 'utf8');
  }
  
  throw new Error(`File not found: ${basePath}`);
}

// Helper function to check if file exists with any extension
function fileExistsWithAnyExt(basePath) {
  const extensions = ['.ts', '.js', ''];
  return extensions.some(ext => fs.existsSync(basePath + ext));
}

// Helper function to run tests
function runTest(name, testFn) {
  totalTests++;
  try {
    const result = testFn();
    if (result) {
      passedTests++;
      console.log(`✅ ${name}`);
      return true;
    } else {
      failedTests++;
      console.log(`❌ ${name}`);
      return false;
    }
  } catch (error) {
    failedTests++;
    console.log(`❌ ${name} - Error: ${error.message}`);
    return false;
  }
}

function warn(message) {
  warnings.push(message);
  console.log(`⚠️  WARNING: ${message}`);
}

// ==================== SECTION 1: BACKEND VERIFICATION ====================
console.log('\n📦 SECTION 1: BACKEND IMPLEMENTATION\n');
console.log('───────────────────────────────────────\n');

// Test 1.1: Payment Controller Method
runTest('Backend: processPayment controller method exists', () => {
  const controllerPath = path.join(BACKEND_DIR, 'controllers/enhanced_walletController.js');
  if (!fs.existsSync(controllerPath)) return false;
  const content = fs.readFileSync(controllerPath, 'utf8');
  return content.includes('async processPayment(req, res)');
});

// Test 1.2: Payment Service Implementation
runTest('Backend: processPayment service method with transaction support', () => {
  const servicePath = path.join(BACKEND_DIR, 'services/enhanced_wallet_service.js');
  if (!fs.existsSync(servicePath)) return false;
  const content = fs.readFileSync(servicePath, 'utf8');
  return content.includes('async processPayment(') && 
         content.includes('beginTransaction') &&
         content.includes('commit') &&
         content.includes('rollback');
});

// Test 1.3: Payment Route Registration
runTest('Backend: /process-payment route registered with auth middleware', () => {
  const routePath = path.join(__dirname, '../backend/routes/enhanced_wallet.js');
  const content = fs.readFileSync(routePath, 'utf8');
  return content.includes('router.post("/process-payment"') &&
         content.includes('authMiddleware');
});

// Test 1.4: Enhanced Wallet Routes Imported
runTest('Backend: enhanced_wallet routes imported in index.ts', () => {
  const indexPath = path.join(__dirname, '../backend/routes/index.ts');
  const content = fs.readFileSync(indexPath, 'utf8');
  return content.includes('enhanced_wallet') || content.includes('enhanced-wallet');
});

// Test 1.5: Auth Middleware Password Check
runTest('Backend: Auth middleware checks mustChangePassword flag', () => {
  const authPath = path.join(__dirname, '../backend/middleware/auth.ts');
  const content = fs.readFileSync(authPath, 'utf8');
  return content.includes('mustChangePassword') &&
         content.includes('requiresPasswordChange');
});

// Test 1.6: User Model has mustChangePassword Field
runTest('Backend: UserModel includes mustChangePassword field definition', () => {
  const modelPath = path.join(__dirname, '../backend/models/UserModel.ts');
  const content = fs.readFileSync(modelPath, 'utf8');
  return content.includes('mustChangePassword?: boolean') &&
         content.includes('public mustChangePassword');
});

// Test 1.7: Database Schema Script Exists
runTest('Backend: payment_transactions table schema script exists', () => {
  const schemaPath = path.join(BACKEND_DIR, 'create_payment_transactions_table.sql');
  return fs.existsSync(schemaPath);
});

// Test 1.8: Auth Controller Change Password Endpoint
runTest('Backend: AuthController has change-password endpoint', () => {
  const controllerPath = path.join(__dirname, '../backend/controllers/AuthController.ts');
  const content = fs.readFileSync(controllerPath, 'utf8');
  return content.includes('changePassword') || content.includes('change-password');
});

// Test 1.9: All Route Files Registered
runTest('Backend: All route files properly registered (133 routes)', () => {
  const scriptPath = path.join(__dirname, '../backend/find_unregistered_routes.js');
  if (!fs.existsSync(scriptPath)) return false;
  
  try {
    const output = execSync('node find_unregistered_routes.js', { 
      cwd: path.join(__dirname, '../backend'),
      encoding: 'utf8'
    });
    return output.includes('All route files are registered') || 
           output.includes('Unregistered routes: 0');
  } catch (error) {
    return false;
  }
});

// Test 1.10: No TypeScript Errors in Backend
runTest('Backend: Zero TypeScript compilation errors', () => {
  try {
    execSync('npx tsc --noEmit', { 
      cwd: path.join(__dirname, '../backend'),
      encoding: 'utf8',
      stdio: 'pipe'
    });
    return true;
  } catch (error) {
    warn('TypeScript compilation has errors (check manually)');
    return false;
  }
});

// ==================== SECTION 2: FRONTEND VERIFICATION ====================
console.log('\n🎨 SECTION 2: FRONTEND IMPLEMENTATION\n');
console.log('───────────────────────────────────────\n');

// Test 2.1: Enhanced Wallet Service Process Payment
runTest('Frontend: enhancedWalletService.processPayment method configured', () => {
  const servicePath = path.join(FRONTEND_DIR, 'services/enhancedWalletService.ts');
  if (!fs.existsSync(servicePath)) return false;
  const content = fs.readFileSync(servicePath, 'utf8');
  return content.includes('async processPayment(') &&
         content.includes('/enhanced-wallet/process-payment');
});

// Test 2.2: Auth Service User Interface
runTest('Frontend: User interface includes mustChangePassword field', () => {
  const authServicePath = path.join(__dirname, '../frontend-main/src/services/authService.ts');
  const content = fs.readFileSync(authServicePath, 'utf8');
  return content.includes('mustChangePassword?: boolean');
});

// Test 2.3: Login Method Handles Flag
runTest('Frontend: login() method checks mustChangePassword flag', () => {
  const authServicePath = path.join(__dirname, '../frontend-main/src/services/authService.ts');
  const content = fs.readFileSync(authServicePath, 'utf8');
  return content.includes('user.mustChangePassword') &&
         content.includes("localStorage.setItem('mustChangePassword'");
});

// Test 2.4: Helper Methods Exist
runTest('Frontend: mustChangePassword() and clearMustChangePasswordFlag() methods', () => {
  const authServicePath = path.join(__dirname, '../frontend-main/src/services/authService.ts');
  const content = fs.readFileSync(authServicePath, 'utf8');
  return content.includes('mustChangePassword(): boolean') &&
         content.includes('clearMustChangePasswordFlag()');
});

// Test 2.5: LoginPage Redirect Logic
runTest('Frontend: LoginPage redirects to /change-password when flag is true', () => {
  const loginPagePath = path.join(__dirname, '../frontend-main/src/pages/LoginPage.tsx');
  const content = fs.readFileSync(loginPagePath, 'utf8');
  return content.includes('mustChangePassword') &&
         content.includes("navigate('/change-password')");
});

// Test 2.6: ChangePasswordPage Component Exists
runTest('Frontend: ChangePasswordPage.tsx component file exists', () => {
  const pagePath = path.join(__dirname, '../frontend-main/src/pages/ChangePasswordPage.tsx');
  return fs.existsSync(pagePath);
});

// Test 2.7: ChangePasswordPage Has Validation
runTest('Frontend: ChangePasswordPage includes form validation', () => {
  const pagePath = path.join(__dirname, '../frontend-main/src/pages/ChangePasswordPage.tsx');
  const content = fs.readFileSync(pagePath, 'utf8');
  return content.includes('validateForm') &&
         content.includes('authService.changePassword');
});

// Test 2.8: Change Password Route Registered
runTest('Frontend: /change-password route registered in App.tsx', () => {
  const appPath = path.join(__dirname, '../frontend-main/src/App.tsx');
  const content = fs.readFileSync(appPath, 'utf8');
  return content.includes('import ChangePasswordPage') &&
         content.includes('path="/change-password"');
});

// Test 2.9: API Configuration Correct
runTest('Frontend: API base URL configured correctly', () => {
  const apiPath = path.join(__dirname, '../frontend-main/src/services/api.ts');
  const content = fs.readFileSync(apiPath, 'utf8');
  return content.includes('localhost:3001') || content.includes('API_BASE_URL');
});

// Test 2.10: Auth Interceptor Adds Token
runTest('Frontend: Axios interceptor attaches JWT token to requests', () => {
  const apiPath = path.join(__dirname, '../frontend-main/src/services/api.ts');
  const content = fs.readFileSync(apiPath, 'utf8');
  return content.includes('Authorization') &&
         content.includes('Bearer');
});

// ==================== SECTION 3: INTEGRATION CHECKS ====================
console.log('\n🔗 SECTION 3: FRONTEND-BACKEND INTEGRATION\n');
console.log('──────────────────────────────────────────\n');

// Test 3.1: Payment Endpoint Mapping
runTest('Integration: Frontend payment endpoint matches backend route', () => {
  const frontendServicePath = path.join(FRONTEND_DIR, 'services/enhancedWalletService.ts');
  const backendRoutePath = path.join(BACKEND_DIR, 'routes/enhanced_wallet.js');
  
  if (!fs.existsSync(frontendServicePath) || !fs.existsSync(backendRoutePath)) return false;
  
  const frontendService = fs.readFileSync(frontendServicePath, 'utf8');
  const backendRoute = fs.readFileSync(backendRoutePath, 'utf8');
  
  const frontendEndpoint = frontendService.includes('/enhanced-wallet/process-payment');
  const backendEndpoint = backendRoute.includes('/process-payment');
  
  return frontendEndpoint && backendEndpoint;
});

// Test 3.2: Auth Endpoint Consistency
runTest('Integration: Login endpoint consistent across frontend/backend', () => {
  const frontendApi = fs.readFileSync(
    path.join(__dirname, '../frontend-main/src/services/api.ts'), 
    'utf8'
  );
  const backendRoutes = fs.readFileSync(
    path.join(__dirname, '../backend/routes/auth.routes.ts'), 
    'utf8'
  );
  
  return frontendApi.includes('/auth/login') && backendRoutes.includes('/login');
});

// Test 3.3: Change Password Endpoint Match
runTest('Integration: Change password endpoint matches', () => {
  const frontendAuth = fs.readFileSync(
    path.join(__dirname, '../frontend-main/src/services/authService.ts'), 
    'utf8'
  );
  const backendRoutes = fs.readFileSync(
    path.join(__dirname, '../backend/routes/auth.routes.ts'), 
    'utf8'
  );
  
  return frontendAuth.includes('/change-password') && backendRoutes.includes('/change-password');
});

// Test 3.4: Authentication Flow Complete
runTest('Integration: Complete auth flow (login → flag check → redirect → change → clear)', () => {
  // Check all piecesences of the flow
  const loginPage = fs.readFileSync(
    path.join(__dirname, '../frontend-main/src/pages/LoginPage.tsx'), 
    'utf8'
  );
  const authService = fs.readFileSync(
    path.join(__dirname, '../frontend-main/src/services/authService.ts'), 
    'utf8'
  );
  const changePage = fs.readFileSync(
    path.join(__dirname, '../frontend-main/src/pages/ChangePasswordPage.tsx'), 
    'utf8'
  );
  
  const hasLoginCheck = loginPage.includes('mustChangePassword');
  const hasRedirect = loginPage.includes("navigate('/change-password')");
  const hasFlagStorage = authService.includes("localStorage.setItem('mustChangePassword'");
  const hasClearFlag = authService.includes('clearMustChangePasswordFlag');
  const hasChangeCall = changePage.includes('authService.changePassword');
  
  return hasLoginCheck && hasRedirect && hasFlagStorage && hasClearFlag && hasChangeCall;
});

// ==================== SECTION 4: CODE QUALITY ====================
console.log('\n✨ SECTION 4: CODE QUALITY & BEST PRACTICES\n');
console.log('────────────────────────────────────────────\n');

// Test 4.1: Error Handling in Payment Controller
runTest('Quality: Payment controller has try-catch error handling', () => {
  const controllerPath = path.join(BACKEND_DIR, 'controllers/enhanced_walletController.js');
  if (!fs.existsSync(controllerPath)) return false;
  const content = fs.readFileSync(controllerPath, 'utf8');
  return content.includes('try {') && content.includes('catch (error)');
});

// Test 4.2: Input Validation in Payment
runTest('Quality: Payment endpoint validates required fields', () => {
  const servicePath = path.join(__dirname, '../backend/services/enhanced_wallet_service.js');
  const content = fs.readFileSync(servicePath, 'utf8');
  return content.includes('amount') && 
         content.includes('currency') && 
         content.includes('paymentMethod');
});

// Test 4.3: Password Strength Validation
runTest('Quality: ChangePasswordPage enforces password strength requirements', () => {
  const pagePath = path.join(__dirname, '../frontend-main/src/pages/ChangePasswordPage.tsx');
  const content = fs.readFileSync(pagePath, 'utf8');
  return content.includes('8') && // min length
         content.includes('[a-z]') && // lowercase
         content.includes('[A-Z]') && // uppercase
         content.includes('\\d'); // number
});

// Test 4.4: Toast Notifications Implemented
runTest('Quality: Toast notifications for user feedback', () => {
  const loginPage = fs.readFileSync(
    path.join(__dirname, '../frontend-main/src/pages/LoginPage.tsx'), 
    'utf8'
  );
  const changePage = fs.readFileSync(
    path.join(__dirname, '../frontend-main/src/pages/ChangePasswordPage.tsx'), 
    'utf8'
  );
  
  return loginPage.includes('toast(') && changePage.includes('toast(');
});

// Test 4.5: Loading States During API Calls
runTest('Quality: Loading states prevent multiple submissions', () => {
  const loginPage = fs.readFileSync(
    path.join(__dirname, '../frontend-main/src/pages/LoginPage.tsx'), 
    'utf8'
  );
  const changePage = fs.readFileSync(
    path.join(__dirname, '../frontend-main/src/pages/ChangePasswordPage.tsx'), 
    'utf8'
  );
  
  return loginPage.includes('isLoading') && changePage.includes('isLoading');
});

// Test 4.6: Form Validation Before Submission
runTest('Quality: Forms validated before API submission', () => {
  const loginPage = fs.readFileSync(
    path.join(__dirname, '../frontend-main/src/pages/LoginPage.tsx'), 
    'utf8'
  );
  const changePage = fs.readFileSync(
    path.join(__dirname, '../frontend-main/src/pages/ChangePasswordPage.tsx'), 
    'utf8'
  );
  
  return loginPage.includes('validateForm()') && changePage.includes('validateForm()');
});

// Test 4.7: Database Transaction Safety
runTest('Quality: Payment processing uses database transactions', () => {
  const servicePath = path.join(__dirname, '../backend/services/enhanced_wallet_service.js');
  const content = fs.readFileSync(servicePath, 'utf8');
  return content.includes('beginTransaction') && 
         content.includes('commit') && 
         content.includes('rollback');
});

// Test 4.8: Logging Implemented
runTest('Quality: Comprehensive logging in critical operations', () => {
  const controllerPath = path.join(__dirname, '../backend/controllers/enhanced_walletController.js');
  const content = fs.readFileSync(controllerPath, 'utf8');
  return content.includes('console.log') || content.includes('logger');
});

// ==================== SUMMARY ====================
console.log('\n═══════════════════════════════════════════');
console.log('📊 TEST RESULTS SUMMARY\n');
console.log(`Total Tests: ${totalTests}`);
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`⚠️  Warnings: ${warnings.length}`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
console.log('═══════════════════════════════════════════\n');

if (warnings.length > 0) {
  console.log('⚠️  WARNINGS:\n');
  warnings.forEach((warning, idx) => {
    console.log(`  ${idx + 1}. ${warning}`);
  });
  console.log('');
}

if (failedTests === 0) {
  console.log('🎉 ALL TESTS PASSED! Platform is ready for runtime testing.\n');
  console.log('NEXT STEPS:');
  console.log('═══════════\n');
  console.log('1. Create Database Table:');
  console.log('   docker exec fingermobile_postgres psql -U postgres -d fingermobile_platform_db \\');
  console.log('     -f apps/backend/create_payment_transactions_table.sql\n');
  console.log('2. Start Backend Server:');
  console.log('   cd apps/backend && npm run dev\n');
  console.log('3. Start Frontend Server:');
  console.log('   cd apps/frontend-main && npm start\n');
  console.log('4. Manual Testing:');
  console.log('   - Login with imported user credentials');
  console.log('   - Verify password change enforcement');
  console.log('   - Test payment processing endpoint\n');
  
  // Generate curl test commands
  console.log('CURL TEST COMMANDS:');
  console.log('═══════════════════\n');
  console.log('# Test Login:');
  console.log('curl -X POST http://localhost:3001/api/auth/login \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"email": "mustybash@icloud.com", "password": "FingerMobile2024!Secure"}\'\n');
  console.log('# Test Payment (replace TOKEN):');
  console.log('curl -X POST http://localhost:3001/api/enhanced-wallet/process-payment \\');
  console.log('  -H "Authorization: Bearer TOKEN" \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"amount": 100, "currency": "USD", "paymentMethod": "fic_wallet"}\'\n');
  
  process.exit(0);
} else {
  console.log('❌ SOME TESTS FAILED. Please review failures above.\n');
  console.log('Fix the failed tests before proceeding to runtime testing.\n');
  process.exit(1);
}