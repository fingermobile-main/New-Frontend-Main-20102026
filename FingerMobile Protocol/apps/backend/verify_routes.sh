#!/bin/bash
# Quick Route Verification Script
# Tests if newly registered routes are accessible

BASE_URL="http://localhost:3001/api"

echo "=========================================="
echo "🔍 Testing Newly Registered Routes"
echo "=========================================="
echo ""

# Test each route
test_route() {
  local route=$1
  local description=$2
  
  echo -n "Testing $description... "
  
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${route}" 2>/dev/null || echo "FAILED")
  
  if [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "403" ]; then
    echo "✅ REGISTERED (requires auth - HTTP $HTTP_CODE)"
  elif [ "$HTTP_CODE" = "404" ]; then
    echo "❌ NOT FOUND (HTTP 404)"
  elif [ "$HTTP_CODE" = "200" ]; then
    echo "✅ WORKING (HTTP 200)"
  else
    echo "⚠️  UNEXPECTED (HTTP $HTTP_CODE)"
  fi
}

# Test critical routes
test_route "/fingerlux/items" "FingerLux"
test_route "/commissions" "Commissions"
test_route "/recommendations/trending" "Recommendations"
test_route "/ugc-media/uploads" "UGC Media"
test_route "/fingerwars/games" "FingerWars"
test_route "/helpcenter/faqs" "HelpCenter"

echo ""
echo "=========================================="
echo "✅ Route verification complete"
echo "=========================================="
