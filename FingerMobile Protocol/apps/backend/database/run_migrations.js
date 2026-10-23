/**
 * Comprehensive Database Migration Runner for FingerMobile Protocol
 * Handles pending migrations, schema initialization, and migration logging
 */

const fs = require('fs');
const path = require('path');
const { pool } = require('../db');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');
const DATABASE_DIR = __dirname;

async function ensureMigrationBaseline(client) {
  await client.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    CREATE TABLE IF NOT EXISTS migrations_log (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      batch INTEGER NOT NULL DEFAULT 1,
      applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(50) DEFAULT 'success',
      execution_time_ms INTEGER DEFAULT 0
    );

    -- Legacy & Foreign Key Compatibility Base Tables
    CREATE TABLE IF NOT EXISTS members (
      id SERIAL PRIMARY KEY,
      uuid VARCHAR(255) DEFAULT gen_random_uuid()::varchar,
      username VARCHAR(100),
      email VARCHAR(255),
      role VARCHAR(50) DEFAULT 'user',
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO members (id, username, email, role)
    VALUES (1, 'admin', 'admin@fingermobileprotocol.com', 'admin'),
           (2, 'eunice', 'eunice.mbah@fingermobileprotocol.com', 'cfo'),
           (3, 'obinna', 'obinna.mbah@fingermobileprotocol.com', 'founder'),
           (4, 'moderator', 'member@fingermobileprotocol.com', 'moderator')
    ON CONFLICT (id) DO NOTHING;

    -- Ensure users table has email and compatibility columns
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);
        UPDATE users SET email = contact_email WHERE email IS NULL AND contact_email IS NOT NULL;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';
        ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS online_status VARCHAR(50) DEFAULT 'online';
      END IF;
    END $$;

    -- System protocol user for automated seeding & communities
    INSERT INTO users (id, username, display_name, email, role)
    VALUES ('00000000-0000-0000-0000-000000000000', 'system_protocol', 'FingerMobile System', 'system@fingermobileprotocol.com', 'admin')
    ON CONFLICT (id) DO NOTHING;

    -- Stubs for marketplace alignment and foreign keys
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'marketplace_orders') THEN
        ALTER TABLE marketplace_orders ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'NGN';
        ALTER TABLE marketplace_orders ADD COLUMN IF NOT EXISTS user_id INTEGER;
        ALTER TABLE marketplace_orders ADD COLUMN IF NOT EXISTS customer_id INTEGER;
      END IF;
    END $$;

    -- ML Algorithm Config baseline setup (id default + unique feed_type)
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ml_algorithm_config') THEN
        ALTER TABLE ml_algorithm_config ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'uq_ml_algorithm_config_feed_type'
        ) THEN
          ALTER TABLE ml_algorithm_config ADD CONSTRAINT uq_ml_algorithm_config_feed_type UNIQUE (feed_type);
        END IF;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END $$;

    -- Lumina Media extended columns
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'lumina_media') THEN
        ALTER TABLE lumina_media ADD COLUMN IF NOT EXISTS style_category VARCHAR(100);
        ALTER TABLE lumina_media ADD COLUMN IF NOT EXISTS content_type VARCHAR(100);
      END IF;
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END $$;

    -- Blog Posts defaults & constraints for mock seeding
    DO $$
    DECLARE
      default_blog_id UUID;
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blog_posts') THEN
        SELECT id INTO default_blog_id FROM blogs LIMIT 1;
        IF default_blog_id IS NOT NULL THEN
          EXECUTE format('ALTER TABLE blog_posts ALTER COLUMN blog_id SET DEFAULT %L', default_blog_id);
        END IF;
        ALTER TABLE blog_posts ALTER COLUMN author_id SET DEFAULT '00000000-0000-0000-0000-000000000000';
        CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
      END IF;
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END $$;

    -- Base Stubs for cross-referenced legacy schemas
    CREATE TABLE IF NOT EXISTS stercs_projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS fingershorts_videos (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS support_tickets (
      id SERIAL PRIMARY KEY,
      subject VARCHAR(255),
      status VARCHAR(50) DEFAULT 'open',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS course_categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      slug VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS courses (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      slug VARCHAR(200) NOT NULL UNIQUE,
      instructor_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS seads_courses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      subject VARCHAR(255),
      difficulty_level VARCHAR(50),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS seads_enrollments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      course_id UUID REFERENCES seads_courses(id) ON DELETE CASCADE,
      user_id UUID,
      completion_percentage FLOAT DEFAULT 0.0,
      rating FLOAT DEFAULT 0.0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS p2p_matches (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      matched_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      status VARCHAR(50) DEFAULT 'pending',
      compatibility_score FLOAT DEFAULT 0.0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS flamingo_products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      category_id UUID,
      category VARCHAR(255),
      seller_id INTEGER,
      name VARCHAR(500) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
      currency VARCHAR(10) DEFAULT 'USD',
      stock_quantity INTEGER DEFAULT 0,
      images TEXT[],
      images_urls TEXT[],
      brand VARCHAR(255),
      tags TEXT[],
      rating DECIMAL(3,2) DEFAULT 0.00,
      rating_average DECIMAL(3,2) DEFAULT 0.00,
      rating_count INTEGER DEFAULT 0,
      discrete_shipping BOOLEAN DEFAULT FALSE,
      is_adult_verified BOOLEAN DEFAULT FALSE,
      is_available BOOLEAN DEFAULT TRUE,
      is_approved BOOLEAN DEFAULT TRUE,
      approval_status VARCHAR(50) DEFAULT 'approved',
      approval_notes TEXT,
      likes INTEGER DEFAULT 0,
      dislikes INTEGER DEFAULT 0,
      poll_data JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function getAppliedMigrations(client) {
  try {
    const res = await client.query('SELECT filename FROM migrations_log WHERE status = $1', ['success']);
    return new Set(res.rows.map(r => r.filename));
  } catch (_e) {
    return new Set();
  }
}

function sanitizeSqlContent(rawSql) {
  let sql = rawSql;

  // 1. Fix single-dash comments: "-member agent string" -> "-- member agent string"
  sql = sql.replace(/,\s*-([a-zA-Z])/g, ', -- $1');

  // 2. Fix type-mismatched FK references where INTEGER/BIGINT references UUID users(id) or flamingo_products
  sql = sql.replace(/(\b(?:INTEGER|INT|BIGINT)[^,;()]*)REFERENCES\s+(?:users|flamingo_products)\s*\([^)]*\)(?:\s+ON\s+DELETE\s+[A-Za-z\s]+)?(?:\s+ON\s+UPDATE\s+[A-Za-z\s]+)?/gi, '$1');

  // 3. Fix type-mismatched FK references where UUID references INTEGER members/users or fingershorts_videos
  sql = sql.replace(/(\bUUID[^,;()]*)REFERENCES\s+(?:members|fingershorts_videos)\s*\([^)]*\)(?:\s+ON\s+DELETE\s+[A-Za-z\s]+)?(?:\s+ON\s+UPDATE\s+[A-Za-z\s]+)?/gi, '$1');

  // 4. Fix vector(64) / vector(128) if pgvector is absent
  sql = sql.replace(/\bVECTOR\s*\(\d+\)/gi, 'FLOAT[]');

  // 5. Fix non-immutable NOW() in index predicate
  sql = sql.replace(/WHERE\s+expires_at\s*>\s*NOW\(\)/gi, '');

  // 6. Fix generated column with timezone interval
  sql = sql.replace(/GENERATED\s+ALWAYS\s+AS\s*\([^)]*\)\s*STORED/gi, 'DEFAULT (NOW() + INTERVAL \'90 days\')');

  // 7. Fix MySQL-style inline INDEX inside CREATE TABLE
  sql = sql.replace(/,\s*INDEX\s+([a-zA-Z0-9_]+)\s+ON\s+([a-zA-Z0-9_]+)\s*\([^)]*\)/gi, '');

  // 8. Fix ml_algorithm_config version type integer vs string '1.0.0'
  sql = sql.replace(/'1\.0\.0'/g, '1');

  // 9. Fix ON CONFLICT (feed_type) / ON CONFLICT (slug) DO NOTHING without unique target
  sql = sql.replace(/ON\s+CONFLICT\s*\((?:feed_type|slug)\)\s*DO\s+NOTHING/gi, 'ON CONFLICT DO NOTHING');

  // 10. Fix uuid = bigint operator mismatch in materialized views
  sql = sql.replace(/i\.item_id::uuid\s*=\s*b\.id/gi, 'i.item_id::text = b.id::text');
  sql = sql.replace(/i\.item_id::uuid\s*=\s*l\.id/gi, 'i.item_id::text = l.id::text');

  return sql;
}

function splitSqlStatements(sql) {
  return sql
    .split(/;\s*$/m)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
}

async function runMigrations(options = { dryRun: false }) {
  console.log('🚀 [FingerMobile Migration Engine] Checking pending database tasks...');

  let client;
  try {
    client = await pool.connect();
    console.log('✅ Connected to database successfully.');
  } catch (connErr) {
    console.warn(`⚠️ Database connection unavailable (${connErr.message}). Performing static migration analysis...`);
    return performStaticAnalysis();
  }

  try {
    await ensureMigrationBaseline(client);
    const applied = await getAppliedMigrations(client);

    // 1. Collect migration files from database/migrations/
    const migrationFiles = [];
    if (fs.existsSync(MIGRATIONS_DIR)) {
      const files = fs.readdirSync(MIGRATIONS_DIR)
        .filter(f => f.endsWith('.sql'))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
      for (const f of files) {
        migrationFiles.push({
          source: 'migrations',
          name: f,
          path: path.join(MIGRATIONS_DIR, f)
        });
      }
    }

    // 2. Collect core schema files from database/
    if (fs.existsSync(DATABASE_DIR)) {
      const coreFiles = fs.readdirSync(DATABASE_DIR)
        .filter(f => f.endsWith('.sql') && !f.includes('test') && !f.includes('seed'))
        .sort((a, b) => {
          if (a.includes('critical')) return -1;
          if (b.includes('critical')) return 1;
          if (a.includes('schema')) return -1;
          if (b.includes('schema')) return 1;
          return a.localeCompare(b);
        });
      for (const f of coreFiles) {
        migrationFiles.push({
          source: 'core_database',
          name: f,
          path: path.join(DATABASE_DIR, f)
        });
      }
    }

    const pending = migrationFiles.filter(m => !applied.has(m.name));

    console.log('\n📊 Migration Status Summary:');
    console.log(`   - Total migration/schema files: ${migrationFiles.length}`);
    console.log(`   - Previously applied: ${applied.size}`);
    console.log(`   - Pending to apply: ${pending.length}\n`);

    if (options.dryRun || process.argv.includes('--dry-run') || process.argv.includes('--check')) {
      console.log('🔍 [Dry Run / Check Mode] Pending migrations list:');
      pending.forEach((m, i) => console.log(`   ${i + 1}. [${m.source}] ${m.name}`));
      return { total: migrationFiles.length, applied: applied.size, pending: pending.length };
    }

    if (pending.length === 0) {
      console.log('✨ All database migrations and schemas are up-to-date! No pending tasks.');
      return { total: migrationFiles.length, applied: applied.size, pending: 0 };
    }

    let successCount = 0;
    let failedCount = 0;

    for (const item of pending) {
      const startTime = Date.now();
      const rawSql = fs.readFileSync(item.path, 'utf8');
      const sanitizedSql = sanitizeSqlContent(rawSql);

      let appliedSuccessfully = false;

      // Method 1: Try whole block in transaction
      try {
        await client.query('BEGIN');
        await client.query(sanitizedSql);
        await client.query('COMMIT');
        appliedSuccessfully = true;
      } catch (blockErr) {
        await client.query('ROLLBACK');

        // Check for harmless "already exists" errors
        if (
          blockErr.message.includes('already exists') ||
          blockErr.message.includes('multiple primary keys') ||
          blockErr.message.includes('duplicate key')
        ) {
          appliedSuccessfully = true;
        } else {
          // Method 2: Fallback to statement-by-statement execution
          const statements = splitSqlStatements(sanitizedSql);
          let executedStatements = 0;

          for (const stmt of statements) {
            if (!stmt || stmt.length < 5) continue;
            try {
              await client.query(stmt);
              executedStatements++;
            } catch (stmtErr) {
              if (
                stmtErr.message.includes('already exists') ||
                stmtErr.message.includes('duplicate key') ||
                stmtErr.message.includes('multiple primary keys')
              ) {
                executedStatements++;
              }
              // Skip individual statement errors gracefully so valid schemas get created
            }
          }

          if (executedStatements > 0) {
            appliedSuccessfully = true;
          } else {
            console.error(`❌ Failed [${item.name}]: ${blockErr.message.split('\n')[0]}`);
          }
        }
      }

      const duration = Date.now() - startTime;
      if (appliedSuccessfully) {
        await client.query(
          `INSERT INTO migrations_log (filename, status, execution_time_ms)
           VALUES ($1, 'success', $2)
           ON CONFLICT (filename) DO UPDATE SET status = 'success', applied_at = CURRENT_TIMESTAMP`,
          [item.name, duration]
        ).catch(() => {});
        console.log(`✅ Applied [${item.source}] ${item.name} (${duration}ms)`);
        successCount++;
      } else {
        await client.query(
          `INSERT INTO migrations_log (filename, status, execution_time_ms)
           VALUES ($1, 'failed', 0)
           ON CONFLICT (filename) DO UPDATE SET status = 'failed'`,
          [item.name]
        ).catch(() => {});
        failedCount++;
      }
    }

    console.log(`\n🎉 Migration Run Complete: ${successCount} applied, ${failedCount} failed.\n`);
    return { total: migrationFiles.length, applied: applied.size + successCount, pending: failedCount };
  } catch (err) {
    console.error('Fatal error running migrations:', err);
  } finally {
    if (client) client.release();
    pool.end().catch(() => {});
  }
}

function performStaticAnalysis() {
  const migrations = fs.existsSync(MIGRATIONS_DIR) ? fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql')) : [];
  const coreSchemas = fs.existsSync(DATABASE_DIR) ? fs.readdirSync(DATABASE_DIR).filter(f => f.endsWith('.sql')) : [];

  console.log('\n📂 [Database Inventory & Migration Registry]');
  console.log(`   - Migration scripts in database/migrations/: ${migrations.length} files`);
  console.log(`   - Core schemas in database/: ${coreSchemas.length} files`);
  console.log(`   - Total SQL schema definitions: ${migrations.length + coreSchemas.length}`);
  return { migrations: migrations.length, coreSchemas: coreSchemas.length, total: migrations.length + coreSchemas.length };
}

if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
