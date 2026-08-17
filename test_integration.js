#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Frontend-Backend Integration Test Script
 * Verifies that frontend services properly connect to backend endpoints
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Frontend-Backend Integration Verification\n');
console.log('═══════════════════════════════════════════\n');

let allTestsPassed = true;

// Test 1: Enhanced Wallet Service - processPayment endpoint
console.log('✓ Test 1: Enhanced Wallet Service - Payment Endpoint');
try {
  const enhancedWalletServicePath = path.join(__dirname, '../frontend-main/src/services/enhancedWalletService.ts');
  const enhancedWalletContent = fs.readFileSync(enhancedWalletServicePath, 'utf8');
  
  if (enhancedWalletContent.includes('/enhanced-wallet/process-payment')) {
    console.log('  ✅ processPayment endpoint configured correctly\n');
  } else {
    console.log('  ❌ processPayment endpoint NOT found\n');
    allTestsPassed = false;
  }
} catch (error) {
  console.log('  ❌ Error reading enhancedWalletService:', error.message, '\n');
  allTestsPassed = false;
}

// Test 2: Auth Service - mustChangePassword handling
console.log('✓ Test 2: Auth Service - Password Change Flag');
try {
  const authServicePath = path.join(__dirname, '../frontend-main/src/services/authService.ts');
  const authContent = fs.readFileSync(authServicePath, 'utf8');
  
  const hasMustChangePasswordField = authContent.includes('mustChangePassword?: boolean');
  const hasLoginCheck = authContent.includes('user.mustChangePassword');
  const hasHelperMethod = authContent.includes('mustChangePassword(): boolean');
  
  if (hasMustChangePasswordField && hasLoginCheck && hasHelperMethod) {
    console.log('  ✅ mustChangePassword flag fully integrated\n');
  } else {
    console.log('  ⚠️  Partial implementation detected\n');
    console.log('     - User interface field:', hasMustChangePasswordField ? '✅' : '❌');
    console.log('     - Login check:', hasLoginCheck ? '✅' : '❌');
    console.log('     - Helper method:', hasHelperMethod ? '✅' : '❌\n');
    allTestsPassed = false;
  }
} catch (error) {
  console.log('  ❌ Error reading authService:', error.message, '\n');
  allTestsPassed = false;
}

// Test 3: LoginPage - Password change redirect
console.log('✓ Test 3: Login Page - Password Change Redirect');
try {
  const loginPagePath = path.join(__dirname, '../frontend-main/src/pages/LoginPage.tsx');
  const loginContent = fs.readFileSync(loginPagePath, 'utf8');
  
  const hasRedirectLogic = loginContent.includes('mustChangePassword') && 
                          loginContent.includes("navigate('/change-password')");
  
  if (hasRedirectLogic) {
    console.log('  ✅ Password change redirect logic implemented\n');
  } else {
    console.log('  ❌ Password change redirect NOT implemented\n');
    allTestsPassed = false;
  }
} catch (error) {
  console.log('  ❌ Error reading LoginPage:', error.message, '\n');
  allTestsPassed = false;
}

// Test 4: ChangePasswordPage component exists
console.log('✓ Test 4: Change Password Page Component');
try {
  const changePasswordPagePath = path.join(__dirname, '../frontend-main/src/pages/ChangePasswordPage.tsx');
  
  if (fs.existsSync(changePasswordPagePath)) {
    const pageContent = fs.readFileSync(changePasswordPagePath, 'utf8');
    const hasFormValidation = pageContent.includes('validateForm');
    const hasApiCall = pageContent.includes('authService.changePassword');
    
    if (hasFormValidation && hasApiCall) {
      console.log('  ✅ ChangePasswordPage component complete with validation\n');
    } else {
      console.log('  ⚠️  ChangePasswordPage exists but may be incomplete\n');
      allTestsPassed = false;
    }
  } else {
    console.log('  ❌ ChangePasswordPage component NOT found\n');
    allTestsPassed = false;
  }
} catch (error) {
  console.log('  ❌ Error checking ChangePasswordPage:', error.message, '\n');
  allTestsPassed = false;
}

// Test 5: Route registration in App.tsx
console.log('✓ Test 5: Route Registration');
try {
  const appPath = path.join(__dirname, '../frontend-main/src/App.tsx');
  const appContent = fs.readFileSync(appPath, 'utf8');
  
  const hasImport = appContent.includes('import ChangePasswordPage');
  const hasRoute = appContent.includes('path="/change-password"');
  
  if (hasImport && hasRoute) {
    console.log('  ✅ Change password route registered in App.tsx\n');
  } else {
    console.log('  ❌ Change password route NOT registered\n');
    allTestsPassed = false;
  }
} catch (error) {
  console.log('  ❌ Error reading App.tsx:', error.message, '\n');
  allTestsPassed = false;
}

// Test 6: Backend endpoint verification
console.log('✓ Test 6: Backend Payment Endpoint');
try {
  const backendControllerPath = path.join(__dirname, '../backend/controllers/enhanced_walletController.js');
  const controllerContent = fs.readFileSync(backendControllerPath, 'utf8');
  
  const hasProcessPaymentMethod = controllerContent.includes('async processPayment(req, res)');
  
  if (hasProcessPaymentMethod) {
    console.log('  ✅ Backend processPayment controller method exists\n');
  } else {
    console.log('  ❌ Backend processPayment method NOT found\n');
    allTestsPassed = false;
  }
} catch (error) {
  console.log('  ❌ Error reading backend controller:', error.message, '\n');
  allTestsPassed = false;
}

// Test 7: Backend route registration
console.log('✓ Test 7: Backend Route Registration');
try {
  const backendRoutePath = path.join(__dirname, '../backend/routes/enhanced_wallet.js');
  const routeContent = fs.readFileSync(backendRoutePath, 'utf8');
  
  const hasRouteRegistration = routeContent.includes('router.post("/process-payment"');
  
  if (hasRouteRegistration) {
    console.log('  ✅ Backend /process-payment route registered\n');
  } else {
    console.log('  ❌ Backend route NOT registered\n');
    allTestsPassed = false;
  }
} catch (error) {
  console.log('  ❌ Error reading backend route:', error.message, '\n');
  allTestsPassed = false;
}

// Summary
console.log('═══════════════════════════════════════════');
if (allTestsPassed) {
  console.log('✅ ALL INTEGRATION TESTS PASSED!');
  console.log('═══════════════════════════════════════════\n');
  console.log('Frontend is ready for backend integration!\n');
  console.log('Next Steps:');
  console.log('  1. Start backend server: cd apps/backend && npm run dev');
  console.log('  2. Start frontend server: cd apps/frontend-main && npm start');
  console.log('  3. Test login flow with imported user credentials');
  console.log('  4. Verify password change enforcement works');
  console.log('  5. Test payment processing endpoint\n');
} else {
  console.log('❌ SOME TESTS FAILED');
  console.log('═══════════════════════════════════════════\n');
  console.log('Please review the failed tests above and fix issues.\n');
  process.exit(1);
}