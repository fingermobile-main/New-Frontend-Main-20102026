#!/bin/bash
# FingerMobile Protocol - Quick TS2339 Fix Workflow
# This script automates the complete workflow from error detection to fix application

set -e  # Exit on error

# Configuration
BACKEND_DIR="/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps/backend"
SCRIPTS_DIR="/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/scripts/fix-scripts"
ERRORS_FILE="/tmp/ts2339.txt"
FIXES_FILE="/tmp/fm_auto_fixable.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================================================${NC}"
echo -e "${BLUE}FINGERMOBILE PROTOCOL - QUICK TS2339 FIX WORKFLOW${NC}"
echo -e "${BLUE}================================================================================${NC}"
echo ""

# Function to print step header
print_step() {
    echo -e "\n${GREEN}━━━ Step $1: $2 ━━━${NC}\n"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠️  WARNING: $1${NC}\n"
}

# Function to print error
print_error() {
    echo -e "${RED}✗ ERROR: $1${NC}\n"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓ $1${NC}\n"
}

# Check prerequisites
print_step "0" "Checking prerequisites"

if ! command -v python3 &> /dev/null; then
    print_error "Python3 is required but not installed"
    exit 1
fi

if ! command -v npx &> /dev/null; then
    print_error "Node.js/npx is required but not installed"
    exit 1
fi

if [ ! -d "$BACKEND_DIR" ]; then
    print_error "Backend directory not found: $BACKEND_DIR"
    exit 1
fi

if [ ! -f "$SCRIPTS_DIR/triage_ts2339_fingermobile.py" ]; then
    print_error "Triage script not found: $SCRIPTS_DIR/triage_ts2339_fingermobile.py"
    exit 1
fi

print_success "All prerequisites met"

# Navigate to backend directory
cd "$BACKEND_DIR"

# Step 1: Run TypeScript compiler
print_step "1" "Running TypeScript compiler to capture errors"

echo "Compiling TypeScript files..."
npx tsc --noEmit > /tmp/ts_all_errors.txt 2>&1 || true

# Extract TS2339 errors
grep "error TS2339" /tmp/ts_all_errors.txt > "$ERRORS_FILE" || true

ERROR_COUNT=$(wc -l < "$ERRORS_FILE" 2>/dev/null || echo "0")

if [ "$ERROR_COUNT" -eq "0" ]; then
    print_success "No TS2339 errors found! Your code is clean."
    exit 0
fi

print_success "Found $ERROR_COUNT TS2339 errors"
echo "Sample errors:"
head -5 "$ERRORS_FILE" | sed 's/^/  /'
echo ""

# Step 2: Run triage analysis
print_step "2" "Running triage analysis with safety filters"

cd "$SCRIPTS_DIR"
python3 triage_ts2339_fingermobile.py

if [ $? -ne 0 ]; then
    print_error "Triage analysis failed"
    exit 1
fi

# Check if safe fixes were found
SAFE_COUNT=$(python3 -c "import json; data=json.load(open('$FIXES_FILE')); print(len(data))" 2>/dev/null || echo "0")

if [ "$SAFE_COUNT" -eq "0" ]; then
    print_warning "No safe auto-fixes identified. All errors require manual implementation."
    echo ""
    echo "Review the needs_implementation.json file:"
    echo "  cat /tmp/fm_needs_implementation.json | python3 -m json.tool"
    exit 0
fi

print_success "Identified $SAFE_COUNT safe auto-fix candidates"

# Step 3: Dry run preview
print_step "3" "Previewing proposed changes (dry run)"

python3 apply_ts2339_fixes.py --input "$FIXES_FILE" --dry-run

echo ""
read -p "$(echo -e ${YELLOW}Review the changes above. Continue to backup and apply? [y/N]: ${NC})" -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Operation cancelled by user"
    echo ""
    echo "To apply later, run:"
    echo "  cd $SCRIPTS_DIR"
    echo "  python3 apply_ts2339_fixes.py --input $FIXES_FILE --backup --apply"
    exit 0
fi

# Step 4: Create Git checkpoint
print_step "4" "Creating Git checkpoint before modifications"

cd "$BACKEND_DIR"

if git rev-parse --git-dir > /dev/null 2>&1; then
    # Check for uncommitted changes
    if ! git diff --quiet || ! git diff --cached --quiet; then
        print_warning "You have uncommitted changes. Creating stash..."
        git stash push "auto-stash-before-ts2339-fixes-$(date +%Y%m%d_%H%M%S)"
    fi
    
    # Create a temporary branch for safety
    BRANCH_NAME="ts2339-fixes-$(date +%Y%m%d_%H%M%S)"
    git checkout -b "$BRANCH_NAME" 2>/dev/null || true
    print_success "Created checkpoint branch: $BRANCH_NAME"
else
    print_warning "Not a Git repository. Skipping checkpoint."
fi

# Step 5: Apply fixes with backup
print_step "5" "Applying fixes with automatic backup"

cd "$SCRIPTS_DIR"
python3 apply_ts2339_fixes.py --input "$FIXES_FILE" --backup --apply

if [ $? -ne 0 ]; then
    print_error "Fix application failed"
    exit 1
fi

# Step 6: Verify results
print_step "6" "Verifying no new errors introduced"

cd "$BACKEND_DIR"

echo "Re-running TypeScript compiler..."
npx tsc --noEmit > /tmp/ts_errors_after.txt 2>&1 || true

AFTER_COUNT=$(grep -c "error TS2339" /tmp/ts_errors_after.txt 2>/dev/null || echo "0")

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "RESULTS SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Before: $ERROR_COUNT TS2339 errors"
echo "After:  $AFTER_COUNT TS2339 errors"
echo "Fixed:  $((ERROR_COUNT - AFTER_COUNT)) errors"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$AFTER_COUNT" -lt "$ERROR_COUNT" ]; then
    print_success "Successfully reduced TS2339 errors!"
    
    IMPROVEMENT=$(( (ERROR_COUNT - AFTER_COUNT) * 100 / ERROR_COUNT ))
    echo "Improvement: ${IMPROVEMENT}%"
    echo ""
    
    if [ "$AFTER_COUNT" -gt "0" ]; then
        echo "Remaining errors that need manual attention:"
        grep "error TS2339" /tmp/ts_errors_after.txt | head -10 | sed 's/^/  /'
        echo ""
    fi
elif [ "$AFTER_COUNT" -eq "$ERROR_COUNT" ]; then
    print_warning "No improvement detected. Fixes may not have been applied correctly."
else
    print_error "More errors after fix application! Restoring from backup recommended."
    echo ""
    echo "To restore backups:"
    echo "  ls -la /tmp/fm_backups/"
    echo "  cp /tmp/fm_backups/<backup_file> <original_path>"
fi

# Step 7: Next steps
print_step "7" "Recommended next steps"

echo "1. Review the changes made:"
echo "   git diff"
echo ""
echo "2. Run your test suite:"
echo "   npm test"
echo ""
echo "3. If everything looks good, commit the changes:"
echo "   git add ."
echo "   git commit -m 'Fix TS2339 errors: auto-renamed methods with safety validation'"
echo ""
echo "4. For remaining errors, implement missing methods manually:"
echo "   cat /tmp/fm_needs_implementation.json | python3 -m json.tool"
echo ""
echo "5. Backups are available at:"
echo "   /tmp/fm_backups/"
echo ""

echo -e "${BLUE}================================================================================${NC}"
echo -e "${BLUE}WORKFLOW COMPLETE${NC}"
echo -e "${BLUE}================================================================================${NC}"
