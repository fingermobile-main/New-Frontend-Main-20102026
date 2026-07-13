# WEEK 0: PREPARATION & HARMONIZATION
## Critical Pre-Implementation Tasks
### Date: 2026-07-10

---

## 🎯 OBJECTIVE

Before starting Week 1 implementation, we must resolve critical architectural issues to prevent duplication, data loss, and naming conflicts. This preparation phase will take **2-3 days**.

---

## ⚠️ CRITICAL FINDINGS SUMMARY

1. **🔴 Directory Duplication**: Platform Monetization is 79% identical to Business Suite
2. **🔴 Database Mismatch**: Uses SQLite instead of required PostgreSQL
3. **🔴 Naming Collision**: "Hallmarks" used for both community achievements AND business pages
4. **🟡 In-Memory Storage**: All data lost on restart
5. **🟡 Mock Data**: Controllers return fake data, not real database queries

---

## ✅ TASK LIST (Execute in Order)

### TASK 0.1: Archive Duplicate Directory
**Priority**: 🔴 CRITICAL  
**Estimated Time**: 15 minutes  
**Risk**: LOW (archiving, not deleting)

```bash
cd "/Users/user/Documents/FingerMobile Protocol Communication"
mv "Platform Monetization" "Platform Monetization.ARCHIVED_20260710"
```

**Verification**:
- [ ] Directory renamed successfully
- [ ] All files still accessible in archive
- [ ] No broken symlinks or references

---

### TASK 0.2: Delete Backup/Variants Files
**Priority**: 🔴 CRITICAL  
**Estimated Time**: 10 minutes  
**Risk**: LOW (backups already exist in archive)

**Files to Delete from Business Suite**:
```bash
cd "/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Business and Monetization Suite"

# Delete all (1) and (2) variant files
rm -f "AdminPage (1).tsx"
rm -f "AffiliatePage (1).tsx"
rm -f "HallmarksPage (1).tsx"
rm -f "MonetizationPage (1).tsx"
rm -f "RevenuePage (1).tsx"
rm -f "VerificationPage (1).tsx"
rm -f "VerificationPage (2).tsx"
rm -f "app (1).ts"
rm -f "constants (1).ts"
rm -f "database (1).ts"
rm -f "formulas (1).ts"
rm -f "policy (1).ts"
rm -f "tsconfig (1).json"
rm -f "types (1).ts"
rm -f "package (1).json"
```

**Verification**:
- [ ] All 15 backup files deleted
- [ ] No `(1)` or `(2)` files remain
- [ ] Canonical versions still exist

---

### TASK 0.3: Rename Community Hallmarks to Achievements
**Priority**: 🔴 CRITICAL  
**Estimated Time**: 2 hours  
**Risk**: MEDIUM (affects frontend routing)

**Files to Update**:

#### 3.1 Rename Route in Frontend-Main
**File**: `/FingerMobile Protocol/apps/frontend-main/src/App.tsx` or main router file

**Change**:
```typescript
// BEFORE
<Route path="/hallmarks/*" element={<HallmarksPage />} />

// AFTER
<Route path="/achievements/*" element={<AchievementsPage />} />
```

#### 3.2 Rename Component File
```bash
cd "/FingerMobile Protocol/apps/frontend-main/src/pages"
mv HallmarksPage.tsx AchievementsPage.tsx
```

#### 3.3 Update Component Name Inside File
**File**: `AchievementsPage.tsx`

**Change**:
```typescript
// BEFORE
const HallmarksPage: React.FC = () => { ... }
export default HallmarksPage;

// AFTER
const AchievementsPage: React.FC = () => { ... }
export default AchievementsPage;
```

#### 3.4 Update Navigation Links
Search for all references to `/hallmarks` in frontend-main and update to `/achievements`:
```bash
grep -r "/hallmarks" "/FingerMobile Protocol/apps/frontend-main/src" --include="*.tsx" --include="*.ts"
```

Update all found instances:
- Navigation menus
- Button links
- Breadcrumbs
- Documentation comments

#### 3.5 Update Mobile App Routes (if applicable)
Check Flutter/Dart app for hallmark routes and rename if they refer to community system (not business hallmarks).

**Verification**:
- [ ] All route changes tested
- [ ] No broken links
- [ ] Navigation menus updated
- [ ] Mobile app routes checked
- [ ] Documentation updated

---

### TASK 0.4: Reconcile Database Schemas
**Priority**: 🔴 CRITICAL  
**Estimated Time**: 3 hours  
**Risk**: HIGH (data migration)

#### 4.1 Review Current SQLite Schema
**File**: `/FingerMobile Business and Monetization Suite/db/database.ts`

Document all existing tables and columns.

#### 4.2 Review PostgreSQL Schema
**File**: `/FingerMobile Business and Monetization Suite/schema.sql`

Document all defined tables and columns.

#### 4.3 Identify Differences
Create comparison table:

| Table | SQLite Exists? | PostgreSQL Exists? | Column Match? | Action |
|-------|---------------|-------------------|---------------|--------|
| users | ✅ | ✅ | ⚠️ Partial | Merge |
| hallmark_pages | ✅ | ✅ | ⚠️ Partial | Merge |
| monetization_metrics | ✅ | ❌ | N/A | Add to PostgreSQL |
| content_metrics | ❌ | ✅ | N/A | Add to SQLite (for migration) |
| access_keys | ❌ | ❌ | N/A | Create new |
| coupons | ❌ | ❌ | N/A | Create new |
| kyc_records | ❌ | ❌ | N/A | Create new |
| ... | ... | ... | ... | ... |

#### 4.4 Create Unified Schema
Update `schema.sql` to include:
- All existing SQLite tables (with correct column names)
- All missing PostgreSQL tables (14 new tables)
- Proper foreign keys and indexes
- ENUM types for all enumerated fields

#### 4.5 Create Migration Script
Create `/db/migrations/migrate_sqlite_to_postgres.js`:

```javascript
// Pseudo-code for migration
const sqlite3 = require('better-sqlite3');
const { Pool } = require('pg');

// Connect to both databases
const sqlite = sqlite3('./db.sqlite');
const postgres = new Pool({ /* config */ });

// Export SQLite data
const users = sqlite.prepare('SELECT * FROM users').all();
const hallmarkPages = sqlite.prepare('SELECT * FROM hallmark_pages').all();
// ... export all tables

// Transform data (adjust column names, types)
const transformedUsers = users.map(u => ({
  id: u.id,
  full_name: u.full_name,
  email: u.email,
  // ... map all fields
}));

// Import into PostgreSQL
await postgres.query('INSERT INTO users (...) VALUES (...)', transformedUsers);
// ... import all tables

console.log('Migration complete');
```

**Verification**:
- [ ] Unified schema created
- [ ] All tables accounted for
- [ ] Migration script tested on copy of data
- [ ] Data integrity verified after migration
- [ ] Rollback plan tested

---

### TASK 0.5: Review Merge Candidate Files
**Priority**: 🟡 HIGH  
**Estimated Time**: 2 hours  
**Risk**: LOW (review only)

Compare these files between Business Suite and archived Platform Monetization:

#### 5.1 HallmarksPage.tsx Variants
```bash
diff "FingerMobile Business and Monetization Suite/HallmarksPage.tsx" \
     "Platform Monetization.ARCHIVED_20260710/HallmarksPage.tsx"
```

**Action**: 
- Identify unique features in each version
- Merge into single canonical version
- Document differences

#### 5.2 app.ts Variants
```bash
diff "FingerMobile Business and Monetization Suite/app.ts" \
     "Platform Monetization.ARCHIVED_20260710/app.ts"
```

**Action**: Investigate size difference (0.7KB vs 1.9KB)

#### 5.3 database.ts Variants
```bash
diff "FingerMobile Business and Monetization Suite/db/database.ts" \
     "Platform Monetization.ARCHIVED_20260710/db/database.ts"
```

**Action**: Check for additional tables or fixes

#### 5.4 types.ts Variants
```bash
diff "FingerMobile Business and Monetization Suite/types.ts" \
     "Platform Monetization.ARCHIVED_20260710/types.ts"
```

**Action**: Verify type definitions match

**Verification**:
- [ ] All variants reviewed
- [ ] Unique features identified
- [ ] Merge decisions documented
- [ ] Canonical versions selected

---

### TASK 0.6: Update Package Dependencies
**Priority**: 🟡 HIGH  
**Estimated Time**: 30 minutes  
**Risk**: LOW

#### 6.1 Install PostgreSQL Client
```bash
cd "/FingerMobile Business and Monetization Suite"
npm install pg @types/pg
```

#### 6.2 Install Redis Client
```bash
npm install ioredis @types/ioredis
```

#### 6.3 Remove SQLite (After Migration)
```bash
# DO NOT REMOVE YET - wait until migration complete
# npm uninstall better-sqlite3 @types/better-sqlite3
```

#### 6.4 Update package.json
Add new dependencies:
```json
{
  "dependencies": {
    "pg": "^8.11.0",
    "@types/pg": "^8.10.0",
    "ioredis": "^5.3.0",
    "@types/ioredis": "^5.0.0"
  }
}
```

**Verification**:
- [ ] Dependencies installed
- [ ] No version conflicts
- [ ] TypeScript types available
- [ ] package.json updated

---

### TASK 0.7: Update Docker Compose Configuration
**Priority**: 🟡 HIGH  
**Estimated Time**: 1 hour  
**Risk**: LOW

**File**: `/FingerMobile Business and Monetization Suite/docker-compose.yml`

Add PostgreSQL and Redis services:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DB_HOST=db
      - DB_PORT=5432
      - DB_NAME=fingermobile_biz_suite_dev
      - DB_USER=postgres
      - DB_PASSWORD=dev_password_123
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev

  db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=fingermobile_biz_suite_dev
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=dev_password_123
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./schema.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:
```

**Verification**:
- [ ] Docker Compose file updated
- [ ] PostgreSQL service configured
- [ ] Redis service configured
- [ ] Health checks defined
- [ ] Volumes persistent
- [ ] Test with `docker-compose up`

---

### TASK 0.8: Create Environment Configuration
**Priority**: 🟡 HIGH  
**Estimated Time**: 30 minutes  
**Risk**: LOW

**File**: `.env.example`

Add PostgreSQL and Redis configuration:

```env
# Application
NODE_ENV=development
PORT=3000

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fingermobile_biz_suite_dev
DB_USER=postgres
DB_PASSWORD=dev_password_123
DB_POOL_MAX=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=2000

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h

# Guardian AI
TOKEN_LENGTH=16
COUPON_LENGTH=12
MIN_AGE=22

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

**File**: `.env` (local development)

Copy `.env.example` to `.env` and fill in actual values.

**Verification**:
- [ ] `.env.example` updated
- [ ] `.env` created with local values
- [ ] `.env` added to `.gitignore`
- [ ] All required variables documented

---

### TASK 0.9: Update TypeScript Configuration
**Priority**: 🟢 MEDIUM  
**Estimated Time**: 30 minutes  
**Risk**: LOW

**File**: `tsconfig.json`

Ensure proper module resolution for new dependencies:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": ".",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

**Verification**:
- [ ] TypeScript compiles without errors
- [ ] New dependencies recognized
- [ ] No type conflicts

---

### TASK 0.10: Create Project Structure Documentation
**Priority**: 🟢 MEDIUM  
**Estimated Time**: 1 hour  
**Risk**: LOW

Create `/STRUCTURE.md` documenting:

```markdown
# Project Structure

## Directories
- `/db` - Database clients, migrations, seeds
- `/cache` - Redis cache layer
- `/services` - Business logic services
- `/controllers` - HTTP request handlers
- `/middleware` - Express middleware
- `/routes` - API route definitions
- `/models` - TypeScript interfaces/types
- `/components` - React UI components
- `/contexts` - React context providers
- `/tests` - Test files

## Single Source of Truth
All Business Suite code lives in:
/FingerMobile Business and Monetization Suite/

Archived duplicate (DO NOT USE):
/Platform Monetization.ARCHIVED_20260710/

## Naming Conventions
- Community System: "Achievements" (was Hallmarks)
- Business System: "Hallmarks Pages"
- Routes: /achievements/* (community), /biz-suite/hallmarks/* (business)
```

**Verification**:
- [ ] Structure documented
- [ ] Naming conventions clear
- [ ] Single source of truth identified

---

## 📊 PROGRESS TRACKING

| Task | Status | Time Spent | Blockers |
|------|--------|------------|----------|
| 0.1 Archive Directory | ⬜ Pending | 0 min | None |
| 0.2 Delete Backups | ⬜ Pending | 0 min | None |
| 0.3 Rename Hallmarks→Achievements | ⬜ Pending | 0 min | None |
| 0.4 Reconcile Schemas | ⬜ Pending | 0 min | None |
| 0.5 Review Merge Candidates | ⬜ Pending | 0 min | None |
| 0.6 Update Dependencies | ⬜ Pending | 0 min | None |
| 0.7 Update Docker Compose | ⬜ Pending | 0 min | None |
| 0.8 Create .env Config | ⬜ Pending | 0 min | None |
| 0.9 Update TypeScript Config | ⬜ Pending | 0 min | None |
| 0.10 Document Structure | ⬜ Pending | 0 min | None |

**Total Estimated Time**: 10-12 hours (2-3 business days)

---

## ✅ COMPLETION CRITERIA

Week 0 is complete when:

- [ ] Platform Monetization directory archived
- [ ] All 15 backup files deleted
- [ ] Community Hallmarks renamed to Achievements
- [ ] Unified database schema created
- [ ] Migration script tested
- [ ] All merge candidates reviewed
- [ ] PostgreSQL and Redis dependencies installed
- [ ] Docker Compose updated with new services
- [ ] Environment configuration complete
- [ ] TypeScript configuration valid
- [ ] Project structure documented
- [ ] Team notified of changes
- [ ] All tests passing (after updates)

---

## 🚀 NEXT STEPS

After Week 0 completion:

1. **Proceed to Week 1 Day 1**: Create missing database tables
2. **Run migration**: SQLite → PostgreSQL
3. **Test thoroughly**: Ensure no data loss
4. **Begin Guardian AI implementation**: Token generator, naming validator, coupon generator

---

## ⚠️ WARNINGS

1. **DO NOT DELETE Platform Monetization** - Archive it instead (safety net)
2. **DO NOT REMOVE SQLite** until migration verified
3. **TEST ALL CHANGESAGES** before committing to main branch
4. **BACKUP DATABASE** before running migration script
5. **NOTIFY TEAM** of directory consolidation and renaming

---

## 📞 SUPPORT

If issues arise during Week 0:

1. Check archived Platform Monetization for reference
2. Review PLATFORM_INVESTIGATION_REPORT.md for context
3. Test changes in isolation before integrating
4. Use Git to rollback if needed

---

**Prepared By**: AI Development Assistant  
**Date**: 2026-07-10  
**Status**: Ready for user review and approval  
**Next Action**: User confirms approach, then execute tasks in order
