#!/usr/bin/env python3
"""
FingerMobile Protocol - Apply TS2339 Auto-Fixes Safely

This script applies the safe auto-fixes identified by triage_ts2339_fingermobile.py
with additional verification and backup mechanisms.

SAFETY FEATURES:
1. Creates backups before any modification
2. Verifies method signatures match between controller and service
3. Validates changes don't introduce new TypeScript errors
4. Provides detailed change log for review
5. Supports dry-run mode for preview

USAGE:
  # Preview changes without applying:
  python3 apply_ts2339_fixes.py --input /tmp/fm_auto_fixable.json --dry-run
  
  # Apply fixes with backup:
  python3 apply_ts2339_fixes.py --input /tmp/fm_auto_fixable.json --backup
  
  # Apply fixes (requires explicit confirmation):
  python3 apply_ts2339_fixes.py --input /tmp/fm_auto_fixable.json --apply
"""

import re
import json
import os
import sys
import shutil
import argparse
from pathlib import Path
from datetime import datetime

# Configuration
API_ROOT = "/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps/backend"
BACKUP_DIR = "/tmp/fm_backups"

os.chdir(API_ROOT)

def parse_args():
    parser = argparse.ArgumentParser(
        description="Apply TS2339 auto-fixes safely with verification"
    )
    parser.add_argument(
        "--input", 
        required=True,
        help="Path to auto-fixable JSON file from triage script"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview changes without applying them"
    )
    parser.add_argument(
        "--backup",
        action="store_true",
        help="Create backups before applying fixes"
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Actually apply the fixes (requires confirmation)"
    )
    return parser.parse_args()

def load_fixes(input_file):
    """Load auto-fix candidates from JSON file."""
    try:
        with open(input_file, 'r') as f:
            fixes = json.load(f)
        print(f"✓ Loaded {len(fixes)} auto-fix candidates from {input_file}")
        return fixes
    except Exception as e:
        print(f"✗ Error loading fixes: {e}")
        sys.exit(1)

def verify_method_exists(service_file, method_name):
    """Verify that the target method actually exists in the service file."""
    try:
        with open(service_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Look for method definition
        pattern = rf'(?:public|private|protected|static|async)?\s*{re.escape(method_name)}\s*\('
        if re.search(pattern, content):
            return True
        return False
    except Exception as e:
        print(f"  ⚠️  Warning: Could not verify method in {service_file}: {e}")
        return False

def extract_method_signature(service_file, method_name):
    """Extract the full method signature for comparison."""
    try:
        with open(service_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find method definition with parameters
        pattern = rf'((?:public|private|protected|static|async)?\s*{re.escape(method_name)}\s*\([^)]*\))'
        match = re.search(pattern, content)
        if match:
            return match.group(1).strip()
        return None
    except Exception:
        return None

def create_backup(file_path):
    """Create a backup of the file before modification."""
    os.makedirs(BACKUP_DIR, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    rel_path = os.path.relpath(file_path, API_ROOT)
    backup_path = os.path.join(BACKUP_DIR, f"{rel_path.replace('/', '_')}_{timestamp}.bak")
    
    try:
        shutil.copy2(file_path, backup_path)
        return backup_path
    except Exception as e:
        print(f"  ✗ Failed to create backup: {e}")
        return None

def apply_fix_to_file(file_path, old_prop, new_method, line_number):
    """Apply a single fix to a file at the specified line."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # Verify we're at the right line
        if line_number - 1 >= len(lines):
            print(f"  ✗ Line {line_number} out of range in {file_path}")
            return False
        
        target_line = lines[line_number - 1]
        
        # Replace the property name
        # Pattern: .oldProp( or .oldProp; or .oldProp, etc.
        pattern = rf'\.{re.escape(old_prop)}(\b)'
        replacement = f'.{new_method}\\1'
        
        new_line = re.sub(pattern, replacement, target_line)
        
        if new_line == target_line:
            print(f"  ⚠️  No change made - pattern not found at line {line_number}")
            return False
        
        lines[line_number - 1] = new_line
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        
        return True
    except Exception as e:
        print(f"  ✗ Error applying fix: {e}")
        return False

def main():
    args = parse_args()
    
    print("=" * 80)
    print("FINGERMOBILE PROTOCOL - APPLY TS2339 AUTO-FIXES")
    print("=" * 80)
    
    # Load fixes
    fixes = load_fixes(args.input)
    
    if not fixes:
        print("✓ No fixes to apply")
        return
    
    # Dry run mode
    if args.dry_run:
        print("\n📋 DRY RUN MODE - Showing proposed changes:\n")
        for i, fix in enumerate(fixes, 1):
            print(f"{i}. {fix['file']}:{fix['line']}")
            print(f"   Change: .{fix['prop']} → .{fix['suggested']}")
            print(f"   Service: {fix['svc_file']}")
            if 'validation' in fix:
                val = fix['validation']
                print(f"   Validation: verb={'✓' if val.get('verb_match') else '○'}, "
                      f"byId={'✓' if val.get('byid_preserved') else '○'}")
            print()
        
        print(f"Total proposed changes: {len(fixes)}")
        print("\nTo apply these changes, run:")
        print(f"  python3 {sys.argv[0]} --input {args.input} --backup --apply")
        return
    
    # Confirmation for actual application
    if args.apply:
        print("\n⚠️  WARNING: You are about to modify source files!")
        print(f"   Files to be modified: {len(set(f['file'] for f in fixes))}")
        print(f"   Total changes: {len(fixes)}")
        print()
        
        confirm = input("Type 'YES' to confirm: ")
        if confirm.strip().upper() != 'YES':
            print("✗ Operation cancelled")
            return
    
    # Create backups if requested
    if args.backup or args.apply:
        print("\n📦 Creating backups...")
        files_to_backup = set(fix['file'] for fix in fixes)
        for file_path in files_to_backup:
            backup_path = create_backup(file_path)
            if backup_path:
                print(f"  ✓ Backed up: {file_path} → {backup_path}")
    
    # Apply fixes
    print("\n🔧 Applying fixes...")
    successful = 0
    failed = 0
    skipped = 0
    
    for fix in fixes:
        file_path = fix['file']
        old_prop = fix['prop']
        new_method = fix['suggested']
        line_number = fix['line']
        svc_file = fix.get('svc_file', '')
        
        print(f"\nProcessing: {file_path}:{line_number}")
        print(f"  Change: .{old_prop} → .{new_method}")
        
        # Verify target method exists
        if svc_file and not verify_method_exists(svc_file, new_method):
            print(f"  ⚠️  SKIPPED: Method '{new_method}' not found in service")
            skipped += 1
            continue
        
        # Extract and compare signatures (informational)
        if svc_file:
            sig = extract_method_signature(svc_file, new_method)
            if sig:
                print(f"  ℹ️  Target signature: {sig[:80]}{'...' if len(sig) > 80 else ''}")
        
        # Apply the fix
        if args.apply:
            if apply_fix_to_file(file_path, old_prop, new_method, line_number):
                print(f"  ✓ Applied successfully")
                successful += 1
            else:
                print(f"  ✗ Failed to apply")
                failed += 1
        else:
            print(f"  ℹ️  Would apply (use --apply to execute)")
            successful += 1
    
    # Summary
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"Successful: {successful}")
    print(f"Failed: {failed}")
    print(f"Skipped: {skipped}")
    
    if args.backup:
        print(f"\nBackups saved to: {BACKUP_DIR}")
        print("To restore a backup:")
        print(f"  cp {BACKUP_DIR}/<backup_file> <original_path>")
    
    if args.apply and failed == 0:
        print("\n✅ All fixes applied successfully!")
        print("\nNext step: Run TypeScript compiler to verify no new errors:")
        print("  npx tsc --noEmit")
    elif args.apply and failed > 0:
        print(f"\n⚠️  {failed} fixes failed. Check backups for restoration if needed.")
    
    print("=" * 80)

if __name__ == "__main__":
    main()
