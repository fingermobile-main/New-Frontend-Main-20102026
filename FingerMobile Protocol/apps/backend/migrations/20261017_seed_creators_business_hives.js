/**
 * Migration & Seeder: Content Creators Hive & Business Organizations Hive
 * Expands RBAC with dedicated Hive Operations roles, directory pages, and test records
 */

const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), quiet: true });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fingermobile_platform_db',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5433')
});

async function runHiveMigration() {
  const client = await pool.connect();
  try {
    console.log('--- Starting Creators & Business Hives Migration ---');
    await client.query('BEGIN');

    // 1. Add Hive Staff Roles
    const hiveStaffRoles = [
      {
        id: 'staff_role_creator_ops',
        slug: 'creator-ops-manager',
        department: 'Creator Studio & UGC',
        name: 'Creator Hive & UGC Operations Director',
        description: 'Oversees creator onboarding cohorts, subscription splits, UGC curation, and verification badges.',
        clearance_level: 4
      },
      {
        id: 'staff_role_business_ops',
        slug: 'business-ops-manager',
        department: 'Commercial & Merchant Operations',
        name: 'Enterprise Business & Merchant Accounts Manager',
        description: 'Manages KYB vetting, corporate SLA tiers, Canary Ads lines of credit, and merchant franchise seats.',
        clearance_level: 4
      }
    ];

    for (const role of hiveStaffRoles) {
      await client.query(`
        INSERT INTO rbac_staff_roles (id, slug, department, name, description, clearance_level, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, TRUE)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          department = EXCLUDED.department,
          description = EXCLUDED.description,
          clearance_level = EXCLUDED.clearance_level;
      `, [role.id, role.slug, role.department, role.name, role.description, role.clearance_level]);
    }

    // 2. Add Hive & Dashboard Pages to rbac_pages_directory
    const hivePages = [
      {
        id: 'page_creator_dashboard',
        path: '/creatordashboard',
        title: 'Creator Studio Dashboard',
        category: 'CREATOR_STUDIO',
        min_role_tier: 'CREATOR',
        is_public_member_facing: false,
        is_backoffice_only: false,
        is_moderator_only: false,
        is_distinguished_only: false,
        is_executive_only: false,
        description: 'Self-service dashboard for registered Content Creators to schedule content, track earnings, and view audience analytics.'
      },
      {
        id: 'page_admin_creators_console',
        path: '/admin/creators-console',
        title: 'Content Creators Console (Hive Ops)',
        category: 'ADMIN_HIVE',
        min_role_tier: 'STAFF',
        is_public_member_facing: false,
        is_backoffice_only: true,
        is_moderator_only: false,
        is_distinguished_only: false,
        is_executive_only: false,
        description: 'Operations hive for assigned staff and executives to manage creator tiers, subscription splits, and verification.'
      },
      {
        id: 'page_admin_business_console',
        path: '/admin/business-console',
        title: 'Business & Organizations Console (Hive Ops)',
        category: 'ADMIN_HIVE',
        min_role_tier: 'STAFF',
        is_public_member_facing: false,
        is_backoffice_only: true,
        is_moderator_only: false,
        is_distinguished_only: false,
        is_executive_only: false,
        description: 'Operations hive for assigned staff and executives to manage corporate accounts, KYB status, and Canary Ads credit.'
      },
      {
        id: 'page_business_offices',
        path: '/businessoffices',
        title: 'Business Hub & Enterprise Offices',
        category: 'COMMERCE',
        min_role_tier: 'BUSINESS',
        is_public_member_facing: false,
        is_backoffice_only: false,
        is_moderator_only: false,
        is_distinguished_only: false,
        is_executive_only: false,
        description: 'Enterprise workspace for verified businesses and organization accounts.'
      }
    ];

    for (const p of hivePages) {
      await client.query(`
        INSERT INTO rbac_pages_directory (id, path, title, category, min_role_tier, is_public_member_facing, is_backoffice_only, is_moderator_only, is_distinguished_only, is_executive_only, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (path) DO UPDATE SET
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          min_role_tier = EXCLUDED.min_role_tier,
          description = EXCLUDED.description;
      `, [p.id, p.path, p.title, p.category, p.min_role_tier, p.is_public_member_facing, p.is_backoffice_only, p.is_moderator_only, p.is_distinguished_only, p.is_executive_only, p.description]);
    }

    // 3. Seed sample Creator user and profile
    const creatorUserResult = await client.query(`
      INSERT INTO users (
        id, username, display_name, email, role, is_active, reputation_score, gem_balance, onboarding_completed, first_name, last_name
      ) VALUES (
        gen_random_uuid(), 'creator_davinci', 'Leonardo DaVinci', 'creator.davinci@fingermobileprotocol.com', 'Creator', TRUE, 480, 1500, TRUE, 'Leonardo', 'DaVinci'
      )
      ON CONFLICT (username) DO UPDATE SET role = 'Creator'
      RETURNING id, email;
    `);

    const creatorUserId = creatorUserResult.rows[0].id;
    await client.query(`
      INSERT INTO creator_profiles (
        id, user_id, country_code, tier, status, is_geo_suspect
      ) VALUES (
        gen_random_uuid(), $1, 'NG', 'TIER_1', 'ACTIVE', FALSE
      )
      ON CONFLICT (user_id) DO UPDATE SET status = 'ACTIVE', tier = 'TIER_1';
    `, [creatorUserId.toString()]);

    // 4. Seed sample Business user and organization
    const bizUserResult = await client.query(`
      INSERT INTO users (
        id, username, display_name, email, role, is_active, reputation_score, gem_balance, onboarding_completed, first_name, last_name
      ) VALUES (
        gen_random_uuid(), 'corp_acme', 'Acme Sovereign Global', 'enterprise@acmeglobal.com', 'Business', TRUE, 750, 50000, TRUE, 'Acme', 'Corporate'
      )
      ON CONFLICT (username) DO UPDATE SET role = 'Business'
      RETURNING id, email;
    `);

    await client.query(`
      INSERT INTO organizations (
        id, name, type, country, state, city, website, accreditation_status, is_verified, metadata
      ) VALUES (
        gen_random_uuid(), 'Acme Sovereign Global Limited', 'other', 'Nigeria', 'Lagos', 'Victoria Island', 'https://acmeglobal.fingermobile.com', 'verified', TRUE,
        '{"registration_no": "RC-893021", "tax_id": "TIN-92837482", "tier": "ENTERPRISE", "ads_credit_allocated": 10000, "sla_tier": "GOLD"}'::jsonb
      )
      ON CONFLICT DO NOTHING;
    `);

    await client.query('COMMIT');
    console.log('✅ Content Creators & Business Hives migration & seeding complete!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

runHiveMigration().catch((err) => {
  console.error(err);
  process.exit(1);
});
