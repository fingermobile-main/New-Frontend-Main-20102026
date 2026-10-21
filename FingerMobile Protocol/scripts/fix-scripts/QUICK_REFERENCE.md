# Quick Reference - TypeScript Error Fix Scripts

## 🚀 Quick Start (One Command)

```bash
cd "/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol"
./scripts/fix-scripts/run_ts2339_fix_workflow.sh
```

---

## 📋 Manual Workflow

### 1. Capture Errors
```bash
cd apps/backend
npx tsc --noEmit > /tmp/ts_errors.txt 2>&1
grep "error TS2339" /tmp/ts_errors.txt > /tmp/ts2339.txt
```

### 2. Run Triage
```bash
cd scripts/fix-scripts
python3 triage_ts2339_fingermobile.py
```

### 3. Review Results
```bash
# Safe fixes
cat /tmp/fm_auto_fixable.json | python3 -m json.tool | head -50

# Dangerous (blocked)
cat /tmp/fm_rejected_dangerous.json | python3 -m json.tool | head -50

# Missing implementations
cat /tmp/fm_needs_implementation.json | python3 -m json.tool | head -50
```

### 4. Preview Changes
```bash
python3 apply_ts2339_fixes.py --input /tmp/fm_auto_fixable.json --dry-run
```

### 5. Apply Fixes
```bash
python3 apply_ts2339_fixes.py --input /tmp/fm_auto_fixable.json --backup --apply
```

### 6. Verify
```bash
cd apps/backend
npx tsc --noEmit > /tmp/ts_after.txt 2>&1
echo "Before: $(wc -l < /tmp/ts2339.txt)"
echo "After:  $(grep -c 'error TS2339' /tmp/ts_after.txt || echo 0)"
```

---

## 🔒 Safety Rules Summary

| Rule | What It Prevents | Example |
|------|------------------|---------|
| **CRUD Verb Match** | Operation mismatches | ❌ `create` → `delete` |
| **ById Preservation** | Signature changes | ❌ `getXById` → `getXByY` |
| **Word-Subset** | Semantic swaps | ❌ `Plan` → `Session` |
| **Similarity ≥ 0.72** | Weak matches | ❌ Low confidence renames |

---

## 📊 Output Files

| File | Purpose |
|------|---------|
| `/tmp/fm_auto_fixable.json` | Safe to apply automatically |
| `/tmp/fm_rejected_dangerous.json` | Blocked by safety filters |
| `/tmp/fm_needs_implementation.json` | Missing methods to implement |
| `/tmp/fm_error_analysis/` | Multi-error analysis results |
| `/tmp/fm_backups/` | Timestamped file backups |

---

## 🎯 Error Types Handled

| Code | Description | Script |
|------|-------------|--------|
| TS2339 | Property doesn't exist | `triage_ts2339_fingermobile.py` |
| TS2345 | Argument type mismatch | `triage_multi_errors_fingermobile.py` |
| TS2304 | Cannot find name | `triage_multi_errors_fingermobile.py` |
| TS2322 | Type not assignable | `triage_multi_errors_fingermobile.py` |
| TS7006 | Implicit 'any' type | `triage_multi_errors_fingermobile.py` |

---

## ⚠️ Critical Warnings

1. **ALWAYS review before applying** - Even "safe" fixes need spot-checking
2. **ALWAYS create backups** - Use `--backup` flag
3. **NEVER skip verification** - Run TypeScript compiler after
4. **DON'T force unsafe fixes** - Implement missing methods properly
5. **TEST after application** - Run unit tests for affected modules

---

## 🔄 Rollback if Needed

```bash
# List backups
ls -la /tmp/fm_backups/

# Restore specific file
cp /tmp/fm_backups/<backup_file> <original_path>

# Or use Git
git checkout HEAD~1
```

---

## 📚 Documentation

- **README.md**: Complete usage guide
- **METHODOLOGY.md**: Deep dive into safety principles
- **Scripts**: Self-documented with help text (`--help`)

---

## 💡 Pro Tips

- Run workflow during low-activity periods
- Process one module at a time initially
- Keep Git commits small and focused
- Document any manual interventions
- Share learnings with team

---

**Remember**: Safety first, automation second. These scripts assist development—they don't replace careful engineering.
