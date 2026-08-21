# Safe Cleanup Script - Usage Guide

## Overview

This is a **significantly improved** version of the platform cleanup script with **comprehensive safety features** to prevent accidental deletion of important files.

---

## 🛡️ Safety Improvements Over Original

| Feature | Original Script | Improved Script |
|---------|----------------|-----------------|
| **Dry-run mode** | ❌ None | ✅ Default mode |
| **Whitelist protection** | ❌ Basic | ✅ Comprehensive (50+ patterns) |
| **Backup before move** | ❌ None | ✅ Optional backup creation |
| **Action logging** | ❌ None | ✅ Full JSON log for rollback |
| **Critical file protection** | ❌ Risky | ✅ 30+ protected patterns |
| **Directory exclusion** | ⚠️ Basic | ✅ Deep path analysis |
| **Confirmation prompts** | ❌ None | ✅ Clear warnings |
| **Rollback capability** | ❌ None | ✅ Action log + backups |
| **HTML handling** | ⚠️ Risky | ✅ Smart directory detection |
| **Config file protection** | ❌ Moves all | ✅ Protects critical configs |

---

## 🚀 Quick Start

### Step 1: Dry Run (ALWAYS start here)

```bash
cd "/Users/user/Documents/FingerMobile Protocol Communication"
node safe_cleanup.js --dry-run
```

This will:
- ✅ Scan all files
- ✅ Show what WOULD be moved
- ✅ Show what is PROTECTED
- ✅ Make NO changes

**Review the output carefully!**

### Step 2: Execute with Backup (Recommended)

```bash
node safe_cleanup.js --apply --backup
```

This will:
- ✅ Move safe-to-move files to archive
- ✅ Create backups before moving
- ✅ Log all actions
- ✅ Allow restoration if needed

### Step 3: Verify Everything Works

Test your application thoroughly:
```bash
# Check backend compiles
cd apps/backend && npx tsc --noEmit

# Check frontend compiles  
cd apps/frontend-main && npx tsc --noEmit

# Run tests if available
npm test
```

### Step 4: Clean Up (If Everything Works)

```bash
# Delete backups (if confident)
rm -rf "Sleeper 13062026/cleanup_backup/backup_*"

# Commit changes
git add .
git commit -m "Clean up non-production files"

# Delete archive (optional, keep for safety)
rm -rf "Sleeper 13062026/cleanup_archive/archive_*"
```

---

## 🔒 Safety Features Explained

### 1. Whitelist Protection

**Files that will NEVER be moved:**

```javascript
// Root-level essential files
package.json, tsconfig.json, docker-compose.yml, Dockerfile
.env, .gitignore, README.md, LICENSE

// Configuration files
*.conf, vite.config.*, webpack.config.*
tailwind.config.*, jest.config.*

// CI/CD and Infrastructure
.github/**/*, cloud-run-service.yaml, workflow.yaml

// Build configuration
babel.config.*, .eslintrc*, .prettierrc*
```

### 2. Directory Protection

**Directories that are completely excluded:**

```
apps/           - All application code
src/            - Source code
lib/            - Libraries
docs/           - Documentation
database/       - Database schemas
migrations/     - Database migrations
schemas/        - Schema definitions
config/         - Configuration
public/         - Public assets
tests/          - Test files
.git/           - Git repository
node_modules/   - Dependencies
dist/           - Build output
build/          - Build output
.next/          - Next.js output
```

### 3. Smart HTML Handling

**HTML files are ONLY moved if NOT in these directories:**
- `apps/*/frontend/public`
- `apps/*/frontend/src`
- `apps/*/public`
- `apps/*/src`
- `FINGERMOBILE HTML/`
- `platform pages html/`

### 4. Conservative File Matching

**Only these file types are considered safe to move:**

```javascript
// Extensions
.log, .tmp, .temp, .swp, .swo, .DS_Store, Thumbs.db

// Filename patterns
fix_*.js          // Fix scripts
temp_*.js         // Temporary files
debug_*.js        // Debug scripts
scratch_*.js      // Experimental files
*_REPORT.md       // Auto-generated reports
*_SUMMARY.md      // Summary files
*_AUDIT.md        // Audit files
*_ANALYSIS.md     // Analysis files
COMPREHENSIVE_*.md // Comprehensive reports
cleanup_*.js      // Cleanup scripts
verify_*.js       // Verification scripts
check_*.js        // Check scripts
audit_*.js        // Audit scripts
implement_*.js    // Implementation scripts
```

**Everything else is PROTECTED by default.**

---

## 📊 Understanding the Output

### Dry Run Example

```
🧹 Starting SAFE Platform Cleanup

Root Directory: /Users/user/Documents/FingerMobile Protocol Communication
Mode: DRY RUN (Preview Only)
Backup: DISABLED
Cleanup Archive: .../Sleeper 13062026/cleanup_archive/archive_2026-07-09T...

⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ 
SAFETY WARNINGS
⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ 

PROTECTED FILES (will NOT be moved):
  • All files in critical directories (apps/, src/, docs/, etc.)
  • Configuration files (package.json, docker-compose.yml, etc.)
  • README.md and other essential documentation
  • HTML files in app directories
  • Database schemas and migrations

SAFE TO MOVE (will be archived):
  • Log files (*.log)
  • Temporary files (*.tmp, *.temp)
  • Auto-generated reports (*_REPORT.md, *_SUMMARY.md)
  • Fix/debug scripts (fix_*.js, debug_*.js)
  • Editor artifacts (.DS_Store, Thumbs.db)

📁 Scanning for files...

🔒 Protected: package.json (WHITELISTED - Critical file/directory)
🔒 Protected: apps/backend/server.js (WHITELISTED - Critical file/directory)
📋 Would move: COMPREHENSIVE_AUDIT_REPORT.md (Matches safe-to-move pattern)
📋 Would move: fix_typescript_errors.js (Matches safe-to-move pattern)
📋 Would move: temp_test.log (Extension .log is safe to move)

================================================================================
📊 CLEANUP SUMMARY
================================================================================
Mode:                     DRY RUN (Preview)
Backup Enabled:           NO
--------------------------------------------------------------------------------
Files Scanned:            1523
Files Safe to Move:       47
Files Protected:          1476
Files Moved:              0
Files Backed Up:          0
Directories Created:      3
Errors:                   0
Skipped (critical):       89
--------------------------------------------------------------------------------
Archive Location:         .../cleanup_archive/archive_2026-07-09T...
Action Log:               .../cleanup_archive/archive_.../cleanup_log.json
================================================================================

⚠️  This was a DRY RUN - no files were moved.

To execute the cleanup:
  node safe_cleanup.js --apply

To execute with backup:
  node safe_cleanup.js --apply --backup
```

### Apply Mode Example

```
✅ Moved: COMPREHENSIVE_AUDIT_REPORT.md
✅ Moved: fix_typescript_errors.js
✅ Moved: temp_test.log
✅ Updated .gitignore with safe cleanup rules

================================================================================
📊 CLEANUP SUMMARY
================================================================================
Mode:                     APPLY (Executing)
Backup Enabled:           YES
--------------------------------------------------------------------------------
Files Scanned:            1523
Files Safe to Move:       47
Files Protected:          1476
Files Moved:              47
Files Backed Up:          47
Directories Created:      3
Errors:                   0
Skipped (critical):       89
--------------------------------------------------------------------------------
Archive Location:         .../cleanup_archive/archive_2026-07-09T...
Backup Location:          .../cleanup_backup/backup_2026-07-09T...
Action Log:               .../cleanup_archive/archive_.../cleanup_log.json
================================================================================

✅ Cleanup complete!

Next steps:
1. Review the archive at: .../cleanup_archive/archive_2026-07-09T...
2. Review backups at: .../cleanup_backup/backup_2026-07-09T...
3. Verify your application still works
4. If everything works, you can delete backups:
   rm -rf ".../cleanup_backup/backup_2026-07-09T..."
5. Commit the changes:
   git add . && git commit -m "Clean up non-production files"
6. Delete the archive when confident:
   rm -rf ".../cleanup_archive/archive_2026-07-09T..."
```

---

## 🔄 Rollback Procedures

### If Something Goes Wrong

#### Option 1: Restore from Backup (If --backup was used)

```bash
# List available backups
ls -la Sleeper\ 13062026/cleanup_backup/

# Restore entire backup
cp -r Sleeper\ 13062026/cleanup_backup/backup_YYYY-MM-DDTHH-MM-SS/* .

# Or restore specific file
cp Sleeper\ 13062026/cleanup_backup/backup_*/path/to/file.ext ./path/to/file.ext
```

#### Option 2: Restore from Git

```bash
# See what changed
git status

# Restore all changes
git checkout HEAD -- .

# Or restore specific file
git checkout HEAD -- path/to/file.ext
```

#### Option 3: Use Action Log for Selective Restore

```bash
# View action log
cat Sleeper\ 13062026/cleanup_archive/archive_*/cleanup_log.json | python3 -m json.tool

# Manually restore files listed in the log
cp Sleeper\ 13062026/cleanup_archive/archive_*/path/to/file.ext ./path/to/file.ext
```

---

## ⚙️ Advanced Usage

### Custom Patterns

Edit the `SAFE_TO_MOVE_PATTERNS` object in the script:

```javascript
const SAFE_TO_MOVE_PATTERNS = {
  extensions: [
    '.log',
    '.tmp',
    '.your_extension'  // Add custom extensions
  ],
  filenamePatterns: [
    '^fix_',
    '^custom_pattern_'  // Add custom patterns
  ]
};
```

### Modify Whitelist

Edit the `CRITICAL_FILES` and `CRITICAL_DIRECTORIES` arrays:

```javascript
const CRITICAL_FILES = [
  'package.json',
  'your_important_file.txt'  // Add files to protect
];

const CRITICAL_DIRECTORIES = [
  'apps',
  'your_important_dir'  // Add directories to protect
];
```

### Adjust Verbosity

Control logging depth by modifying the `scanDirectory` function:

```javascript
// Show all protected files
if (depth <= 5) {  // Increase from 2 to show deeper paths
  console.log(`🔒 Protected: ${relativePath}`);
}
```

---

## 📋 Pre-Cleanup Checklist

Before running the cleanup:

- [ ] **Commit current state**: `git add . && git commit -m "Pre-cleanup snapshot"`
- [ ] **Run dry run first**: `node safe_cleanup.js --dry-run`
- [ ] **Review dry run output**: Check protected vs. movable files
- [ ] **Backup important data**: Manual backup of critical files
- [ ] **Close IDE/editor**: Prevent file lock issues
- [ ] **Stop running servers**: Avoid conflicts during cleanup
- [ ] **Notify team**: If working in shared repository

---

## 🎯 Best Practices

### DO ✅

- Always run `--dry-run` first
- Use `--backup` flag for safety
- Review the action log after cleanup
- Test application thoroughly after cleanup
- Keep archives for at least 1 week before deleting
- Commit changes immediately after verification

### DON'T ❌

- Never skip the dry run
- Don't use `--apply` without `--backup` on first run
- Don't delete archives immediately
- Don't modify whitelist without understanding implications
- Don't run during active development
- Don't ignore error messages

---

## 🔍 Troubleshooting

### Problem: Too many files protected

**Solution**: Review why files are protected. They may be in critical directories or match whitelist patterns. This is intentional safety.

### Problem: Important file was moved

**Solution**: 
1. Check backup: `ls Sleeper\ 13062026/cleanup_backup/`
2. Restore: `cp backup/path/to/file.ext ./path/to/file.ext`
3. Or use Git: `git checkout HEAD -- path/to/file.ext`
4. Add to whitelist if needed

### Problem: Script fails with permission error

**Solution**:
```bash
# Check file permissions
ls -la path/to/problematic/file

# Fix permissions if needed
chmod 644 path/to/problematic/file

# Or run with sudo (not recommended)
sudo node safe_cleanup.js --dry-run
```

### Problem: Too much output in terminal

**Solution**: Redirect to file:
```bash
node safe_cleanup.js --dry-run > cleanup_report.txt 2>&1
cat cleanup_report.txt
```

### Problem: Want to see what was moved

**Solution**: Check action log:
```bash
cat Sleeper\ 13062026/cleanup_archive/archive_*/cleanup_log.json | python3 -m json.tool
```

---

## 📊 Metrics Tracking

The script tracks detailed metrics:

```json
{
  "filesScanned": 1523,
  "filesSafeToMove": 47,
  "filesProtected": 1476,
  "filesMoved": 47,
  "filesBackedUp": 47,
  "dirsCreated": 3,
  "errors": 0,
  "skipped": 89
}
```

Use these to understand cleanup impact and adjust patterns if needed.

---

## 🆘 Emergency Recovery

If cleanup breaks something critically:

```bash
# IMMEDIATE: Restore from Git
git reset --hard HEAD

# Then restore any uncommitted work
# Or restore from backup if --backup was used
cp -r Sleeper\ 13062026/cleanup_backup/backup_*/ .

# Verify restoration
git status
ls -la
```

---

## 📞 Support

For issues or questions:

1. Check this guide first
2. Review the action log: `cleanup_log.json`
3. Check backup directory contents
4. Consult Git history: `git log --oneline`
5. Reach out to team leads

---

## 🎓 Key Differences from Original Script

| Aspect | Original | Improved |
|--------|----------|----------|
| **Philosophy** | Aggressive cleanup | Conservative safety |
| **Default mode** | Apply immediately | Dry-run preview |
| **File protection** | Basic exclusions | Comprehensive whitelist |
| **Error handling** | Minimal | Detailed logging |
| **Recovery** | None | Multiple rollback options |
| **Transparency** | Limited | Full action logging |
| **User control** | Low | High (multiple modes) |
| **Risk level** | HIGH | LOW |

---

**Remember**: This script prioritizes **safety over aggressiveness**. It's better to leave some temporary files than to accidentally delete something important.

**Last Updated**: 2026-07-09  
**Version**: 2.0 (Safe Edition)  
**Status**: ✅ Production Ready
