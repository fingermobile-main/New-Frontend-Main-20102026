# FingerMobile Protocol - TypeScript Error Fix Scripts

## Overview

This directory contains **safety-first** automated scripts for fixing TypeScript compilation errors, specifically TS2339 ("Property does not exist on type") errors. These scripts implement a **multi-layered validation strategy** learned from industry best practices to prevent semantic bugs while enabling safe automation.

## 🎯 Philosophy: Safety Over Speed

Unlike naive regex-based fix scripts that introduce more bugs than they fix, these scripts employ:

1. **Progressive Filtering**: Multiple safety gates applied in sequence
2. **Semantic Understanding**: CRUD verb analysis prevents operation mismatches
3. **Conservative Defaults**: Only pure simplifications are auto-applied
4. **Human-in-the-Loop**: Manual review required before any changes

## 📁 Scripts

### 1. `triage_ts2339_fingermobile.py`

**Purpose**: Analyze TS2339 errors and classify them into safe/unsafe categories

**Safety Layers**:
- ✅ **Layer 1**: Text similarity matching (ratio ≥ 0.72)
- ✅ **Layer 2**: CRUD verb group matching (never match create↔delete)
- ✅ **Layer 3**: ById preservation rule (don't rename `getXById` → `getXByY`)
- ✅ **Layer 4**: Word-subset rule (candidate words must be subset of original)

**Output Categories**:
- 🟢 **SAFE AUTO-FIXABLE**: High confidence, all safety gates passed
- 🔴 **REJECTED DANGEROUS**: Blocked by safety filters (verb mismatch, etc.)
- 🟡 **NEEDS REAL IMPLEMENTATION**: Missing methods requiring actual code

### 2. `apply_ts2339_fixes.py`

**Purpose**: Safely apply auto-fixes with verification and backup

**Safety Features**:
- 💾 Automatic backup creation before modifications
- ✓ Method existence verification in target service
- ℹ️ Signature comparison for parameter compatibility
- 🔄 Dry-run mode for preview without changes
- ⚠️ Explicit confirmation required for application

## 🚀 Usage Workflow

### Step 1: Capture TypeScript Errors

```bash
cd "/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps/backend"

# Run TypeScript compiler and capture errors
npx tsc --noEmit > /tmp/ts_errors.txt 2>&1

# Extract only TS2339 errors
grep "error TS2339" /tmp/ts_errors.txt > /tmp/ts2339.txt

# Verify errors were captured
wc -l /tmp/ts2339.txt
cat /tmp/ts2339.txt | head -20
```

### Step 2: Run Triage Analysis

```bash
cd "/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/scripts/fix-scripts"

python3 triage_ts2339_fingermobile.py
```

**Expected Output**:
```
================================================================================
FINGERMOBILE PROTOCOL - TS2339 ERROR TRIAGE (v3 - Safety-First)
================================================================================

Step 1/6: Parsing TS2339 errors...
✓ Total parsed TS2339 errors: 591

Step 2/6: Indexing service classes and methods...
✓ Indexed 134 service classes

Step 3/6: Setting up CRUD verb safety groups...
✓ CRUD verb groups configured:
   Group 0: add, book, create, generate, post, publish, record, register, schedule
   Group 1: fetch, find, get, list, retrieve, search, view
   Group 2: apply, edit, modify, patch, set, update
   Group 3: archive, cancel, delete, remove, revoke, unpublish
   ...

✅ SAFE AUTO-FIXABLE (high-confidence, all safety gates passed)
   Count: 32
   • controllers/MemberController.ts:844
     MemberService.getMemberProfileById => .getMemberById (ratio=0.76)
     Validation: verb=match, byId=preserved, word-subset=yes

⚠️  REJECTED AS DANGEROUS (blocked by safety filters)
   Count: 13
   • controllers/PaymentController.ts:23
     PaymentService.schedulePayment =/=> .deletePayment (verb mismatch: 'schedule' vs 'delete')

🔧 NEEDS REAL IMPLEMENTATION (missing methods)
   Total: 70 missing methods across 26 services
   • JournalEntryService (services/JournalEntryService.ts)
     7 missing: addJournalEntryLine, createJournalEntry, deleteJournalEntry, ...
```

### Step 3: Review Results

Examine the generated JSON files:

```bash
# Safe fixes ready for application
cat /tmp/fm_auto_fixable.json | python3 -m json.tool | head -50

# Dangerous matches blocked by safety filters
cat /tmp/fm_rejected_dangerous.json | python3 -m json.tool | head -50

# Missing methods requiring implementation
cat /tmp/fm_needs_implementation.json | python3 -m json.tool | head -50
```

### Step 4: Preview Fixes (Dry Run)

```bash
python3 apply_ts2339_fixes.py \
  --input /tmp/fm_auto_fixable.json \
  --dry-run
```

**Review each proposed change carefully**, especially:
- Method name changes (ensure semantic equivalence)
- Parameter compatibility (check signatures match)
- Return type expectations (single object vs array)

### Step 5: Apply Fixes with Backup

```bash
python3 apply_ts2339_fixes.py \
  --input /tmp/fm_auto_fixable.json \
  --backup \
  --apply
```

You'll be prompted to confirm:
```
⚠️  WARNING: You are about to modify source files!
   Files to be modified: 15
   Total changes: 32

Type 'YES' to confirm: YES
```

### Step 6: Verify No New Errors

```bash
cd "/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps/backend"

# Re-run TypeScript compiler
npx tsc --noEmit > /tmp/ts_errors_after.txt 2>&1

# Compare error counts
echo "Before: $(wc -l < /tmp/ts2339.txt) errors"
echo "After:  $(grep -c 'error TS2339' /tmp/ts_errors_after.txt || echo 0) errors"

# Check for new errors introduced
diff <(sort /tmp/ts2339.txt) <(grep "error TS2339" /tmp/ts_errors_after.txt | sort)
```

### Step 7: Restore if Needed

If new errors were introduced:

```bash
# List available backups
ls -la /tmp/fm_backups/

# Restore a specific file
cp /tmp/fm_backups/controllers_MemberController_ts_20260709_013045.bak \
   apps/backend/controllers/MemberController.ts

# Or restore all files
for backup in /tmp/fm_backups/*.bak; do
  original=$(echo $backup | sed 's|/tmp/fm_backups/||' | sed 's|_|/|g' | sed 's|_[0-9]*\.bak$||')
  cp "$backup" "apps/backend/$original"
done
```

## 🔒 Safety Rules Explained

### Rule 1: CRUD Verb Mismatch Prevention

**Problem**: Pure text similarity can match semantically opposite operations.

**Example Dangers**:
- ❌ `scheduleCounselingSession` → `deleteCounselingSession` (0.83 similarity)
- ❌ `cancelCounselingSession` → `getCounselingSession` (0.84 similarity)
- ❌ `createMessage` → `deleteMessage` (0.77 similarity)

**Solution**: Operations are grouped by intent:
```python
CREATE_GROUP = {"create", "add", "schedule", "generate", "publish", ...}
GET_GROUP    = {"get", "find", "fetch", "list", "search", ...}
UPDATE_GROUP = {"update", "edit", "modify", "set", "patch", ...}
DELETE_GROUP = {"delete", "remove", "cancel", "revoke", "archive", ...}
```

Only match within the same group or with identical verbs.

### Rule 2: ById Preservation

**Problem**: `getXById(id)` and `getXByY(y)` have completely different signatures.

**Example Danger**:
- ❌ `getStaffAttendanceById(attendanceId)` → `getAttendanceByStaff(staffId, dateFrom?, dateTo?)`
  - Returns: single object vs array
  - Parameters: 1 vs 3
  - Error handling: 404 on not found vs empty array

**Solution**: Never rename methods containing "ById" to methods with different filter dimensions.

### Rule 3: Domain Object Integrity

**Problem**: Different domain entities may share similar naming patterns.

**Example Dangers**:
- ❌ `updateCounselingPlan` → `updateCounselingSession`
  - Plan: long-term goals and strategies
  - Session: single meeting instance
- ❌ `getGradeScale` → `getGradeByScore`
  - Scale: grading definition/rubric
  - ByScore: convert numeric score to letter grade

**Solution**: Word-subset rule ensures we only drop redundant qualifiers, never swap domain concepts.

### Rule 4: Word-Subset Simplification

**Problem**: Renaming can inadvertently change meaning even with matching verbs.

**Safe Examples** (pure simplification):
- ✅ `getClubSocietyById` → `getClubById` (dropping redundant "Society")
- ✅ `getAllLibraryBooks` → `getAllBooks` (context makes "Library" implicit)
- ✅ `createStudentParent` → `createParent` (service context clarifies scope)

**Unsafe Examples** (semantic swaps):
- ❌ `getSessionsByType` → `getSessionsByStudent` (swapping filter dimension)
- ❌ `getStudentAttendanceByDate` → `getAttendanceById` (different query pattern)

**Solution**: Candidate method's words must be a **subset** of original method's words.

## 📊 Expected Results

Based on reference implementation testing:

| Metric | v1 (Naive) | v2 (Verb) | v3 (Word-Subset) |
|--------|-----------|-----------|------------------|
| Total Candidates | 70 | 57 | 32 |
| Dangerous Blocked | 0 | 13 | 25+ |
| False Positives | ~40% | ~15% | <5% |
| Safe to Apply | 30 | 44 | 32 |

The conservative approach reduces automation speed but **eliminates silent production bugs**.

## 🛠️ Customization

### Adjust Similarity Threshold

Edit `triage_ts2339_fingermobile.py`:
```python
# Current: 0.72 (balanced)
if ratio >= 0.72:

# More conservative: 0.80 (fewer false positives)
if ratio >= 0.80:

# More aggressive: 0.65 (more candidates, more manual review)
if ratio >= 0.65:
```

### Add Custom Verb Groups

For domain-specific operations:
```python
VERB_GROUPS.append({
    "calculate", "compute", "derive", "estimate"
})
```

### Extend to Other Error Types

Copy and modify for TS2345 (argument type mismatch), TS2304 (cannot find name), etc.

## ⚠️ Critical Warnings

1. **Never skip manual review**: Even "safe" fixes should be spot-checked
2. **Always create backups**: Use `--backup` flag before applying
3. **Verify after application**: Run TypeScript compiler to catch regressions
4. **Don't force unsafe fixes**: If a fix is rejected, implement the method properly
5. **Test in isolation**: Apply fixes to one module at a time initially

## 📝 Best Practices

### Before Running Scripts
- ✅ Commit current state to Git
- ✅ Ensure clean working directory
- ✅ Run existing test suite (baseline)
- ✅ Document current error count

### During Review
- ✅ Check each proposed change makes semantic sense
- ✅ Verify method signatures are compatible
- ✅ Look for edge cases (null handling, error paths)
- ✅ Consider impact on callers and tests

### After Application
- ✅ Run TypeScript compiler immediately
- ✅ Execute unit tests for affected modules
- ✅ Check integration tests if applicable
- ✅ Monitor error logs in staging environment

## 🔄 Iterative Improvement

These scripts evolve based on real-world usage:

1. **Track false positives**: Add patterns that slipped through to safety rules
2. **Refine verb groups**: Add domain-specific operation categories
3. **Improve indexing**: Better class/method extraction from complex TypeScript
4. **Extend coverage**: Support additional error types beyond TS2339

## 📚 References

- Original methodology: Reference Claude triage scripts (v1-v3)
- TypeScript error codes: https://www.typescriptlang.org/docs/handbook/error-handling.html
- Safety-first automation: Progressive filtering with human oversight

## 🆘 Troubleshooting

### No TS2339 Errors Found
```bash
# Verify TypeScript is running correctly
npx tsc --version

# Check tsconfig.json includes your files
cat tsconfig.json | grep "include"

# Try compiling a specific file
npx tsc --noEmit controllers/MemberController.ts
```

### Script Fails to Parse Errors
```bash
# Check error format matches expected pattern
head -5 /tmp/ts2339.txt

# Expected format:
# file.ts(line,col): error TS2339: Property 'X' does not exist on type 'Y'

# If format differs, update regex pattern in script
```

### Too Many False Positives
```bash
# Increase similarity threshold
# Edit triage script: ratio >= 0.72 → ratio >= 0.80

# Or enable stricter word-subset checking
# Already enabled by default in v3
```

### Backups Not Created
```bash
# Check permissions
ls -la /tmp/fm_backups/

# Create directory manually
mkdir -p /tmp/fm_backups

# Verify backup path in script matches your system
```

## 📞 Support

For issues or improvements:
1. Check this README first
2. Review script output for error messages
3. Examine generated JSON files for details
4. Consult TypeScript documentation for error meanings

---

**Remember**: These scripts are tools to **assist** development, not replace careful engineering. Always prioritize correctness over convenience.
