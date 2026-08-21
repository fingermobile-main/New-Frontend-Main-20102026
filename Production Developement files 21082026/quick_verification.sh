#!/bin/bash

echo "🧪 QUICK PLATFORM VERIFICATION"
echo "═══════════════════════════════"
echo ""

PASS=0
FAIL=0

check() {
  if [ $? -eq 0 ]; then
    echo "✅ $1"
    PASS=$((PASS + 1))
  else
    echo "❌ $1"
    FAIL=$((FAIL + 1))
  fi
}

# Backend Tests
echo "📦 BACKEND:"
grep -q "async processPayment" apps/backend/controllers/enhanced_walletController.js
check "Payment controller method exists"

grep -q "async processPayment" apps/backend/services/enhanced_wallet_service.js
check "Payment service with transactions"

grep -q 'router.post("/process-payment"' apps/backend/routes/enhanced_wallet.js
check "Payment route registered"

grep -q "mustChangePassword" apps/backend/middleware/auth.ts
check "Auth middleware checks password flag"

grep -q "mustChangePassword" apps/backend/models/UserModel.ts
check "User model has mustChangePassword field"

test -f apps/backend/create_payment_transactions_table.sql
check "Database schema script exists"

node apps/backend/find_unregistered_routes.js 2>&1 | grep -q "Unregistered routes: 0"
check "All routes registered (133 total)"

echo ""
echo "🎨 FRONTEND:"

grep -q "processPayment" apps/frontend-main/src/services/enhancedWalletService.ts
check "Enhanced wallet service has processPayment"

grep -q "mustChangePassword" apps/frontend-main/src/services/authService.ts
check "Auth service handles password flag"

grep -q "change-password" apps/frontend-main/src/pages/LoginPage.tsx
check "LoginPage redirects to change password"

test -f apps/frontend-main/src/pages/ChangePasswordPage.tsx
check "ChangePasswordPage component exists"

grep -q "ChangePasswordPage" apps/frontend-main/src/App.tsx
check "Route registered in App.tsx"

echo ""
echo "🔗 INTEGRATION:"

grep -q "/enhanced-wallet/process-payment" apps/frontend-main/src/services/enhancedWalletService.ts && \
grep -q "/process-payment" apps/backend/routes/enhanced_wallet.js
check "Payment endpoint mapping consistent"

echo ""
echo "═══════════════════════════════"
echo "Results: $PASS passed, $FAIL failed"
echo ""

if [ $FAIL -eq 0 ]; then
  echo "🎉 ALL CHECKS PASSED!"
  exit 0
else
  echo "⚠️  Some checks failed"
  exit 1
fi
