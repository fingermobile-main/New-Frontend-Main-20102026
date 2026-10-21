#!/bin/bash

# Fix undefined route callbacks in backend routes
# This script wraps all direct controller method references in arrow functions

ROUTES_DIR="/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps/backend/routes"

echo "🔧 Fixing route callback issues..."

for file in "$ROUTES_DIR"/*.js; do
    filename=$(basename "$file")
    
    # Skip if it's already using arrow functions or inline handlers
    if grep -q "=> {" "$file" || grep -q "(req, res)" "$file"; then
        echo "✅ Skipping $filename (already has arrow functions)"
        continue
    fi
    
    echo "📝 Processing $filename..."
    
    # Create a backup
    cp "$file" "$file.backup"
    
    # Replace patterns like: router.get("/path", controller.method);
    # With: router.get("/path", (req, res) => controller.method(req, res));
    
    # Pattern 1: router.METHOD("path", controller.method)
    sed -i '' 's/router\.\(get\|post\|put\|delete\|patch\)(\(.*\), \([a-zA-Z_][a-zA-Z0-9_]*\)\.\([a-zA-Z_][a-zA-Z0-9_]*\));/router.\1(\2, (req, res) => \3.\4(req, res));/g' "$file"
    
    # Pattern 2: router.METHOD("path", authenticate, controller.method)
    sed -i '' 's/router\.\(get\|post\|put\|delete\|patch\)(\(.*\), authenticate, \([a-zA-Z_][a-zA-Z0-9_]*\)\.\([a-zA-Z_][a-zA-Z0-9_]*\));/router.\1(\2, authenticate, (req, res) => \3.\4(req, res));/g' "$file"
    
    # Add module.exports if missing
    if ! grep -q "module.exports" "$file"; then
        echo "" >> "$file"
        echo "module.exports = router;" >> "$file"
    fi
done

echo "✅ Route fixes complete!"
echo "⚠️  Please review the changes and test thoroughly"
