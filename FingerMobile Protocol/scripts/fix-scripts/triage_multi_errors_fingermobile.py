#!/usr/bin/env python3
"""
FingerMobile Protocol - Multi-Error TypeScript Fix Triage

Extends the TS2339 methodology to handle multiple TypeScript error types:
- TS2339: Property does not exist on type
- TS2345: Argument of type X is not assignable to parameter of type Y
- TS2304: Cannot find name
- TS2322: Type X is not assignable to type Y
- TS7006: Parameter implicitly has 'any' type

USAGE:
  npx tsc --noEmit > /tmp/ts_errors.txt 2>&1
  python3 triage_multi_errors_fingermobile.py
"""

import re
import json
import os
import sys
from collections import defaultdict
from pathlib import Path

# Configuration
API_ROOT = "/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps/backend"
ERRORS_FILE = "/tmp/ts_errors.txt"
OUTPUT_DIR = "/tmp/fm_error_analysis"

os.chdir(API_ROOT)
os.makedirs(OUTPUT_DIR, exist_ok=True)

print("=" * 80)
print("FINGERMOBILE PROTOCOL - MULTI-ERROR TYPESCRIPT TRIAGE")
print("=" * 80)
print()

# Error patterns
ERROR_PATTERNS = {
    "TS2339": re.compile(
        r"^(\S+)\((\d+),(\d+)\): error TS2339: Property '([^']+)' does not exist on type '([^']+)'"
    ),
    "TS2345": re.compile(
        r"^(\S+)\((\d+),(\d+)\): error TS2345: Argument of type '([^']+)' is not assignable to parameter of type '([^']+)'"
    ),
    "TS2304": re.compile(
        r"^(\S+)\((\d+),(\d+)\): error TS2304: Cannot find name '([^']+)'\."
    ),
    "TS2322": re.compile(
        r"^(\S+)\((\d+),(\d+)\): error TS2322: Type '([^']+)' is not assignable to type '([^']+)'"
    ),
    "TS7006": re.compile(
        r"^(\S+)\((\d+),(\d+)\): error TS7006: Parameter '([^']+)' implicitly has an 'any' type\."
    ),
}

# Parse all errors
print("Step 1/5: Parsing TypeScript errors...")

errors_by_type = defaultdict(list)
total_errors = 0

try:
    with open(ERRORS_FILE, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            
            matched = False
            for error_code, pattern in ERROR_PATTERNS.items():
                m = pattern.match(line)
                if m:
                    error_data = {
                        "file": m.group(1),
                        "line": int(m.group(2)),
                        "col": int(m.group(3)),
                        "raw": line
                    }
                    
                    # Extract specific data based on error type
                    if error_code == "TS2339":
                        error_data.update({
                            "property": m.group(4),
                            "type": m.group(5)
                        })
                    elif error_code == "TS2345":
                        error_data.update({
                            "arg_type": m.group(4),
                            "param_type": m.group(5)
                        })
                    elif error_code == "TS2304":
                        error_data.update({
                            "missing_name": m.group(4)
                        })
                    elif error_code == "TS2322":
                        error_data.update({
                            "actual_type": m.group(4),
                            "expected_type": m.group(5)
                        })
                    elif error_code == "TS7006":
                        error_data.update({
                            "parameter": m.group(4)
                        })
                    
                    errors_by_type[error_code].append(error_data)
                    total_errors += 1
                    matched = True
                    break
    
    print(f"✓ Total errors parsed: {total_errors}")
    for error_code, errors in sorted(errors_by_type.items()):
        print(f"  • {error_code}: {len(errors)} errors")
        
except FileNotFoundError:
    print(f"✗ Error file not found: {ERRORS_FILE}")
    print("  Please run: npx tsc --noEmit > /tmp/ts_errors.txt 2>&1")
    sys.exit(1)

if total_errors == 0:
    print("✓ No TypeScript errors found! Your code is clean.")
    sys.exit(0)

# Analyze each error type
print("\nStep 2/5: Analyzing error patterns...")

# TS2339 Analysis (already covered by dedicated script)
ts2339_count = len(errors_by_type.get("TS2339", []))
print(f"\n📋 TS2339 (Property does not exist): {ts2339_count} errors")
print(f"   → Use: triage_ts2339_fingermobile.py for detailed analysis")

# TS2345 Analysis (Type mismatch in arguments)
ts2345_errors = errors_by_type.get("TS2345", [])
if ts2345_errors:
    print(f"\n📋 TS2345 (Argument type mismatch): {len(ts2345_errors)} errors")
    
    # Group by type pairs
    type_pairs = defaultdict(int)
    for err in ts2345_errors:
        pair = f"{err['arg_type']} → {err['param_type']}"
        type_pairs[pair] += 1
    
    print("   Top type mismatches:")
    for pair, count in sorted(type_pairs.items(), key=lambda x: -x[1])[:10]:
        print(f"     • {pair}: {count} occurrences")
    
    # Save to file
    with open(os.path.join(OUTPUT_DIR, "ts2345_analysis.json"), 'w') as f:
        json.dump({
            "total": len(ts2345_errors),
            "type_pairs": dict(type_pairs),
            "examples": ts2345_errors[:20]
        }, f, indent=2)

# TS2304 Analysis (Cannot find name)
ts2304_errors = errors_by_type.get("TS2304", [])
if ts2304_errors:
    print(f"\n📋 TS2304 (Cannot find name): {len(ts2304_errors)} errors")
    
    # Group by missing name
    missing_names = defaultdict(list)
    for err in ts2304_errors:
        missing_names[err['missing_name']].append(err['file'])
    
    print("   Most common missing names:")
    for name, files in sorted(missing_names.items(), key=lambda x: -len(x[1]))[:10]:
        unique_files = len(set(files))
        print(f"     • '{name}': missing in {unique_files} file(s)")
    
    # Check if these are imports that need to be added
    print("\n   Likely causes:")
    print("     • Missing import statements")
    print("     • Undefined variables or functions")
    print("     • Typos in variable names")
    
    with open(os.path.join(OUTPUT_DIR, "ts2304_analysis.json"), 'w') as f:
        json.dump({
            "total": len(ts2304_errors),
            "missing_names": {k: list(set(v)) for k, v in missing_names.items()},
            "examples": ts2304_errors[:20]
        }, f, indent=2)

# TS2322 Analysis (Type not assignable)
ts2322_errors = errors_by_type.get("TS2322", [])
if ts2322_errors:
    print(f"\n📋 TS2322 (Type not assignable): {len(ts2322_errors)} errors")
    
    # Group by type conversions
    type_conversions = defaultdict(int)
    for err in ts2322_errors:
        conversion = f"{err['actual_type']} → {err['expected_type']}"
        type_conversions[conversion] += 1
    
    print("   Common type conversion issues:")
    for conv, count in sorted(type_conversions.items(), key=lambda x: -x[1])[:10]:
        print(f"     • {conv}: {count} occurrences")
    
    with open(os.path.join(OUTPUT_DIR, "ts2322_analysis.json"), 'w') as f:
        json.dump({
            "total": len(ts2322_errors),
            "type_conversions": dict(type_conversions),
            "examples": ts2322_errors[:20]
        }, f, indent=2)

# TS7006 Analysis (Implicit any)
ts7006_errors = errors_by_type.get("TS7006", [])
if ts7006_errors:
    print(f"\n📋 TS7006 (Implicit 'any' type): {len(ts7006_errors)} errors")
    
    # This is usually easy to fix automatically
    print("   ⚡ HIGH FIXABILITY: These can often be auto-fixed by adding explicit types")
    
    # Group by file
    files_with_implicit_any = defaultdict(int)
    for err in ts7006_errors:
        files_with_implicit_any[err['file']] += 1
    
    print("   Files most affected:")
    for file, count in sorted(files_with_implicit_any.items(), key=lambda x: -x[1])[:10]:
        print(f"     • {file}: {count} parameters")
    
    with open(os.path.join(OUTPUT_DIR, "ts7006_analysis.json"), 'w') as f:
        json.dump({
            "total": len(ts7006_errors),
            "files_affected": dict(files_with_implicit_any),
            "examples": ts7006_errors[:20]
        }, f, indent=2)

# Generate comprehensive summary
print("\n" + "=" * 80)
print("SUMMARY AND RECOMMENDATIONS")
print("=" * 80)

print("\n🎯 Priority Order for Fixes:")
print("  1. TS7006 (Implicit any) - Easy to auto-fix, high impact")
print("  2. TS2304 (Cannot find name) - Usually missing imports")
print("  3. TS2339 (Property not exist) - Use dedicated triage script")
print("  4. TS2345 (Argument type mismatch) - Requires signature review")
print("  5. TS2322 (Type not assignable) - May need type annotations")

print("\n📊 Quick Win Opportunities:")

quick_wins = 0
if ts7006_errors:
    quick_wins += len(ts7006_errors)
    print(f"  ✓ Add explicit types to {len(ts7006_errors)} parameters (TS7006)")

if ts2304_errors:
    # Check if many are the same missing import
    unique_missing = len(set(err['missing_name'] for err in ts2304_errors))
    if unique_missing < len(ts2304_errors) / 2:
        quick_wins += len(ts2304_errors)
        print(f"  ✓ Add missing imports ({unique_missing} unique names across {len(ts2304_errors)} errors)")

print(f"\n  Total quick wins: ~{quick_wins} errors")
print(f"  Remaining complex fixes: {total_errors - quick_wins} errors")

# Save comprehensive report
report = {
    "timestamp": "2026-07-09",
    "total_errors": total_errors,
    "breakdown": {code: len(errors) for code, errors in errors_by_type.items()},
    "quick_wins": quick_wins,
    "output_files": {
        "ts2339": "/tmp/fm_auto_fixable.json (from dedicated script)",
        "ts2345": os.path.join(OUTPUT_DIR, "ts2345_analysis.json"),
        "ts2304": os.path.join(OUTPUT_DIR, "ts2304_analysis.json"),
        "ts2322": os.path.join(OUTPUT_DIR, "ts2322_analysis.json"),
        "ts7006": os.path.join(OUTPUT_DIR, "ts7006_analysis.json")
    }
}

with open(os.path.join(OUTPUT_DIR, "comprehensive_report.json"), 'w') as f:
    json.dump(report, f, indent=2)

print(f"\n💾 Detailed analysis saved to: {OUTPUT_DIR}/")
print("   • comprehensive_report.json")
print("   • ts2345_analysis.json")
print("   • ts2304_analysis.json")
print("   • ts2322_analysis.json")
print("   • ts7006_analysis.json")

print("\n" + "=" * 80)
print("NEXT STEPS")
print("=" * 80)
print("1. Fix TS7006 errors (add explicit parameter types)")
print("2. Fix TS2304 errors (add missing imports)")
print("3. Run triage_ts2339_fingermobile.py for TS2339 errors")
print("4. Manually review TS2345 and TS2322 errors")
print("5. Re-run TypeScript compiler after each batch of fixes")
print("=" * 80)
