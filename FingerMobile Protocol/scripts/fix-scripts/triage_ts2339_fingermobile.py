#!/usr/bin/env python3
"""
FingerMobile Protocol - TypeScript TS2339 Error Triage Script (v3 - Safety-First)

This script implements a multi-layered validation strategy for safely identifying
auto-fixable TypeScript errors while preventing semantic bugs.

SAFETY PRINCIPLES:
1. Progressive filtering: text similarity → verb matching → word-subset rule
2. CRUD verb mismatch prevention (never match create↔delete, cancel↔get, etc.)
3. ById preservation rule (don't rename getXById to getXByY - different signatures)
4. Domain object integrity (don't swap CounselingPlan↔CounselingSession)
5. Word-subset simplification only (candidate words must be subset of original)

USAGE:
  1. Run TypeScript compiler and capture errors:
     npx tsc --noEmit > /tmp/ts_errors.txt 2>&1
     
  2. Extract TS2339 errors:
     grep "error TS2339" /tmp/ts_errors.txt > /tmp/ts2339.txt
     
  3. Run this script:
     python3 triage_ts2339_fingermobile.py
     
  4. Review output categories:
     - SAFE AUTO-FIXABLE: High confidence renames
     - REJECTED DANGEROUS: Blocked by safety filters
     - NEEDS REAL IMPLEMENTATION: Missing methods

OUTPUT FILES:
  - /tmp/fm_auto_fixable.json: Safe auto-fix candidates
  - /tmp/fm_needs_implementation.json: Missing methods requiring implementation
  - /tmp/fm_rejected_dangerous.json: Dangerous mismatches blocked by safety filters
"""

import re
import glob
import os
import json
import difflib
from pathlib import Path

# Configuration - adjust paths for FingerMobile Protocol
API_ROOT = "/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps/backend"
TS2339_ERRORS_FILE = "/tmp/ts2339.txt"
AUTO_FIXABLE_OUTPUT = "/tmp/fm_auto_fixable.json"
NEEDS_IMPL_OUTPUT = "/tmp/fm_needs_implementation.json"
REJECTED_OUTPUT = "/tmp/fm_rejected_dangerous.json"

# Change to API root directory
os.chdir(API_ROOT)

print("=" * 80)
print("FINGERMOBILE PROTOCOL - TS2339 ERROR TRIAGE (v3 - Safety-First)")
print("=" * 80)
print(f"Working directory: {API_ROOT}")
print()

# ============================================================================
# STEP 1: Parse all TS2339 errors from TypeScript compiler output
# ============================================================================
print("Step 1/6: Parsing TS2339 errors...")

pattern = re.compile(
    r"^(\S+)\((\d+),(\d+)\): error TS2339: Property '([^']+)' does not exist on type '([^']+)'"
)

errors = []
try:
    with open(TS2339_ERRORS_FILE, 'r', encoding='utf-8') as f:
        for line in f:
            m = pattern.match(line.strip())
            if m:
                errors.append({
                    "file": m.group(1),
                    "line": int(m.group(2)),
                    "col": int(m.group(3)),
                    "prop": m.group(4),
                    "type": m.group(5)
                })
    print(f"✓ Total parsed TS2339 errors: {len(errors)}")
except FileNotFoundError:
    print(f"✗ Error file not found: {TS2339_ERRORS_FILE}")
    print("  Please run: npx tsc --noEmit 2>&1 | grep 'error TS2339' > /tmp/ts2339.txt")
    exit(1)

if not errors:
    print("✓ No TS2339 errors found! Your code is clean.")
    exit(0)

# ============================================================================
# STEP 2: Build index of service classes and their actual methods
# ============================================================================
print("\nStep 2/6: Indexing service classes and methods...")

# Search for TypeScript service files
service_files = glob.glob("services/**/*.ts", recursive=True)
class_methods = {}  # class_name -> (filepath, set of method names)

method_re = re.compile(
    r"^\s*(?:public\s+|private\s+|protected\s+|static\s+|async\s+)*([A-Za-z][A-Za-z0-9_]*)\s*\("
)

for sf in service_files:
    try:
        with open(sf, encoding="utf-8") as f:
            src = f.read()
    except Exception as e:
        continue
    
    # Find all classes (both exported and non-exported, as they may be exported via 'export default new ClassName(...)')
    # Pattern 1: export (default) class ClassName {
    # Pattern 2: class ClassName { ... } followed by export default new ClassName(...)
    for cm in re.finditer(r"(?:export\s+(?:default\s+)?)?class\s+([A-Za-z0-9]+)\s*{", src):
        cls_name = cm.group(1)
        
        # Crude brace-matching to extract class body
        start = cm.end()
        depth = 1
        i = start
        while i < len(src) and depth > 0:
            if src[i] == '{':
                depth += 1
            elif src[i] == '}':
                depth -= 1
            i += 1
        
        body = src[start:i]
        
        # Extract method names from class body
        methods = set()
        for line in body.split("\n"):
            mm = method_re.match(line)
            if mm:
                name = mm.group(1)
                # Filter out keywords and constructors
                if name not in ("constructor", "if", "for", "while", "switch", "catch", "try"):
                    methods.add(name)
        
        if methods:
            class_methods[cls_name] = (sf, methods)

print(f"✓ Indexed {len(class_methods)} service classes")

# ============================================================================
# STEP 3: Define CRUD verb groups for safety filtering
# ============================================================================
print("\nStep 3/6: Setting up CRUD verb safety groups...")

# CRUD/operation verb groups - operations in different groups must NEVER be matched
VERB_GROUPS = [
    {"create", "add", "schedule", "generate", "publish", "post", "record", "register", "book"},
    {"get", "find", "fetch", "list", "search", "retrieve", "view"},
    {"update", "edit", "modify", "set", "patch", "apply"},
    {"delete", "remove", "cancel", "revoke", "archive", "unpublish"},
    {"validate", "verify", "check"},
    {"process", "execute", "run", "handle"},
    {"calculate", "compute"},
    {"download", "export"},
]

def verb_of(name):
    """Extract the leading operation verb from a camelCase method name."""
    words = re.findall(r'[A-Z]?[a-z0-9]+|[A-Z]+(?=[A-Z]|$)', name)
    return words[0].lower() if words else name.lower()

def verb_group(v):
    """Return the verb group index for a given verb, or None if unknown."""
    for i, g in enumerate(VERB_GROUPS):
        if v in g:
            return i
    return None  # Unknown verb - be conservative

def words_of(name):
    """Split camelCase into individual words."""
    return [w.lower() for w in re.findall(r'[A-Z]?[a-z0-9]+|[A-Z]+(?=[A-Z]|$)', name)]

print("✓ CRUD verb groups configured:")
for i, group in enumerate(VERB_GROUPS):
    print(f"   Group {i}: {', '.join(sorted(group))}")

# ============================================================================
# STEP 4: Apply multi-layered triage with progressive safety filters
# ============================================================================
print("\nStep 4/6: Applying multi-layered safety filters...")

auto_fixable = []
needs_implementation = {}
rejected_dangerous = []

for e in errors:
    cls = e["type"]
    
    # Skip if not a known service class
    if cls not in class_methods:
        continue
    
    svc_file, methods = class_methods[cls]
    
    # Skip if property already exists (shouldn't happen but safety check)
    if e["prop"] in methods:
        continue
    
    prop_words = words_of(e["prop"])
    prop_verb = prop_words[0] if prop_words else ""
    prop_wordset = set(prop_words)
    prop_group = verb_group(prop_verb)
    
    # Find best matching method using multiple criteria
    best = None
    best_ratio = 0
    
    for m in methods:
        m_words = words_of(m)
        if not m_words:
            continue
        
        m_verb = m_words[0]
        m_wordset = set(m_words)
        m_group = verb_group(m_verb)
        
        # Calculate text similarity
        ratio = difflib.SequenceMatcher(None, e["prop"].lower(), m.lower()).ratio()
        
        # SAFETY GATE 1: Verb must match exactly OR be in same operational group
        verb_safe = (prop_verb == m_verb) or (prop_group is not None and prop_group == m_group)
        
        # SAFETY GATE 2: ById preservation - never rename ById to ByX
        has_byid_original = "byid" in e["prop"].lower()
        has_byid_candidate = "byid" in m.lower()
        byid_safe = not has_byid_original or has_byid_candidate
        
        # SAFETY GATE 3: Word-subset rule (strictest)
        # Candidate's words must be subset of original (pure simplification)
        word_subset_safe = m_wordset.issubset(prop_wordset) and m_wordset != prop_wordset
        
        # Apply progressive filtering
        if ratio > best_ratio:
            # Layer 1: Basic similarity + verb safety
            if verb_safe and byid_safe and ratio >= 0.72:
                # Layer 2: Word-subset rule (most conservative)
                if word_subset_safe:
                    best_ratio = ratio
                    best = m
                # Keep as candidate even without word-subset for manual review
                elif best is None:
                    best_ratio = ratio
                    best = m
    
    # Classification based on safety checks
    if best:
        m_words = words_of(best)
        m_verb = m_words[0] if m_words else ""
        m_group = verb_group(m_verb)
        
        # Final safety validation
        final_verb_safe = (prop_verb == m_verb) or (prop_group is not None and prop_group == m_group)
        has_byid_original = "byid" in e["prop"].lower()
        has_byid_candidate = "byid" in best.lower()
        final_byid_safe = not has_byid_original or has_byid_candidate
        final_word_subset = set(m_words).issubset(prop_wordset) and set(m_words) != prop_wordset
        
        if final_verb_safe and final_byid_safe and final_word_subset and best_ratio >= 0.72:
            # SAFE for auto-fix
            auto_fixable.append({
                **e,
                "suggested": best,
                "ratio": round(best_ratio, 2),
                "svc_file": svc_file,
                "validation": {
                    "verb_match": prop_verb == m_verb,
                    "verb_group_match": prop_group == m_group,
                    "byid_preserved": final_byid_safe,
                    "word_subset": True
                }
            })
        else:
            # REJECTED as dangerous
            reasons = []
            if not final_verb_safe:
                reasons.append(f"verb mismatch: '{prop_verb}' vs '{m_verb}'")
            if not final_byid_safe:
                reasons.append("ById preservation violated")
            if not final_word_subset:
                reasons.append("word-subset rule violated (semantic swap detected)")
            
            rejected_dangerous.append({
                **e,
                "suggested": best,
                "ratio": round(best_ratio, 2),
                "reason": "; ".join(reasons),
                "svc_file": svc_file
            })
            
            needs_implementation.setdefault(cls, {"file": svc_file, "missing": set()})
            needs_implementation[cls]["missing"].add(e["prop"])
    else:
        # No suitable match found
        needs_implementation.setdefault(cls, {"file": svc_file, "missing": set()})
        needs_implementation[cls]["missing"].add(e["prop"])

# ============================================================================
# STEP 5: Generate comprehensive report
# ============================================================================
print("\n" + "=" * 80)
print("TRIAGE RESULTS")
print("=" * 80)

print(f"\n✅ SAFE AUTO-FIXABLE (high-confidence, all safety gates passed)")
print(f"   Count: {len(auto_fixable)}")
if auto_fixable:
    for a in auto_fixable[:10]:  # Show first 10
        val = a.get("validation", {})
        print(f"   • {a['file']}:{a['line']}")
        print(f"     {a['type']}.{a['prop']} => .{a['suggested']} (ratio={a['ratio']})")
        print(f"     Validation: verb={'match' if val.get('verb_match') else 'group'}, "
              f"byId={'preserved' if val.get('byid_preserved') else 'N/A'}, "
              f"word-subset={'yes' if val.get('word_subset') else 'no'}")
    if len(auto_fixable) > 10:
        print(f"   ... and {len(auto_fixable) - 10} more")

print(f"\n⚠️  REJECTED AS DANGEROUS (blocked by safety filters)")
print(f"   Count: {len(rejected_dangerous)}")
if rejected_dangerous:
    for r in rejected_dangerous[:10]:  # Show first 10
        print(f"   • {r['file']}:{r['line']}")
        print(f"     {r['type']}.{r['prop']} =/=> .{r['suggested']} ({r['ratio']})")
        print(f"     Reason: {r['reason']}")
    if len(rejected_dangerous) > 10:
        print(f"   ... and {len(rejected_dangerous) - 10} more")

print(f"\n🔧 NEEDS REAL IMPLEMENTATION (missing methods)")
sorted_missing = sorted(needs_implementation.items(), key=lambda x: -len(x[1]["missing"]))
total_missing = sum(len(v["missing"]) for v in needs_implementation.values())
print(f"   Total: {total_missing} missing methods across {len(needs_implementation)} services")
if sorted_missing:
    for cls, info in sorted_missing[:15]:  # Show top 15
        print(f"   • {cls} ({info['file']})")
        print(f"     {len(info['missing'])} missing: {', '.join(sorted(info['missing'])[:5])}")
        if len(info['missing']) > 5:
            print(f"     ... and {len(info['missing']) - 5} more")
    if len(sorted_missing) > 15:
        print(f"   ... and {len(sorted_missing) - 15} more services")

# ============================================================================
# STEP 6: Save results to JSON files for next steps
# ============================================================================
print("\n" + "=" * 80)
print("Saving results...")
print("=" * 80)

with open(AUTO_FIXABLE_OUTPUT, "w") as f:
    json.dump(auto_fixable, f, indent=2)
print(f"✓ Safe auto-fix candidates: {AUTO_FIXABLE_OUTPUT}")

with open(NEEDS_IMPL_OUTPUT, "w") as f:
    json.dump(
        {k: {"file": v["file"], "missing": sorted(v["missing"])} 
         for k, v in needs_implementation.items()},
        f, indent=2
    )
print(f"✓ Missing methods: {NEEDS_IMPL_OUTPUT}")

with open(REJECTED_OUTPUT, "w") as f:
    json.dump(rejected_dangerous, f, indent=2)
print(f"✓ Rejected dangerous matches: {REJECTED_OUTPUT}")

print("\n" + "=" * 80)
print("NEXT STEPS")
print("=" * 80)
print("1. Review SAFE AUTO-FIXABLE candidates manually")
print("2. Verify method signatures match before applying fixes")
print("3. Implement missing methods from NEEDS REAL IMPLEMENTATION list")
print("4. Investigate REJECTED DANGEROUS cases for proper solutions")
print("\nTo apply safe fixes automatically (after manual review):")
print("  python3 apply_ts2339_fixes.py --input /tmp/fm_auto_fixable.json")
print("=" * 80)
