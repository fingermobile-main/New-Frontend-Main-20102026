/**
 * Migration & Seeder: Sovereign RBAC, Pages Directory & Field Masking System
 * FingerMobile Protocol Database Engine (PostgreSQL)
 */

const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), quiet: true });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fingermobile_main',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432')
});

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('--- Starting Sovereign RBAC & Consoles Migration ---');
    await client.query('BEGIN');

    // 1. Back Office Staff Roles
    await client.query(`
      CREATE TABLE IF NOT EXISTS rbac_staff_roles (
        id VARCHAR(64) PRIMARY KEY,
        slug VARCHAR(64) UNIQUE NOT NULL,
        department VARCHAR(64) NOT NULL,
        name VARCHAR(128) NOT NULL,
        description TEXT,
        clearance_level INT DEFAULT 1 CHECK (clearance_level BETWEEN 1 AND 5),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. Back Office Staff Assignments
    await client.query(`
      CREATE TABLE IF NOT EXISTS rbac_staff_assignments (
        id VARCHAR(64) PRIMARY KEY,
        user_id UUID NOT NULL,
        role_id VARCHAR(64) NOT NULL REFERENCES rbac_staff_roles(id) ON DELETE CASCADE,
        assigned_by VARCHAR(128) NOT NULL,
        notes TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 3. Badge Tier Privileges
    await client.query(`
      CREATE TABLE IF NOT EXISTS rbac_badge_tier_privileges (
        id VARCHAR(64) PRIMARY KEY,
        tier_name VARCHAR(64) UNIQUE NOT NULL,
        badge_level INT NOT NULL UNIQUE,
        min_fic_balance INT DEFAULT 0,
        min_reputation INT DEFAULT 0,
        fee_discount_pct NUMERIC(5,2) DEFAULT 0.00,
        can_access_private_vaults BOOLEAN DEFAULT FALSE,
        can_access_early_drops BOOLEAN DEFAULT FALSE,
        priority_curation BOOLEAN DEFAULT FALSE,
        perks JSONB DEFAULT '[]'::jsonb,
        badge_color VARCHAR(32) DEFAULT '#f97316',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 4. Distinguished & Honoured Members Registry
    await client.query(`
      CREATE TABLE IF NOT EXISTS rbac_distinguished_honoured_registry (
        id VARCHAR(64) PRIMARY KEY,
        rank_name VARCHAR(128) UNIQUE NOT NULL,
        rank_slug VARCHAR(64) UNIQUE NOT NULL,
        description TEXT,
        voting_weight INT DEFAULT 1,
        can_access_council_chamber BOOLEAN DEFAULT TRUE,
        can_submit_governance_proposals BOOLEAN DEFAULT TRUE,
        direct_founder_advisory BOOLEAN DEFAULT FALSE,
        honorary_perks JSONB DEFAULT '[]'::jsonb,
        badge_accent VARCHAR(32) DEFAULT '#8b5cf6',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 5. User Distinguished Assignments
    await client.query(`
      CREATE TABLE IF NOT EXISTS rbac_user_distinguished_assignments (
        id VARCHAR(64) PRIMARY KEY,
        user_id UUID NOT NULL,
        rank_id VARCHAR(64) NOT NULL REFERENCES rbac_distinguished_honoured_registry(id) ON DELETE CASCADE,
        citation TEXT,
        appointed_by VARCHAR(128) NOT NULL,
        appointed_at TIMESTAMPTZ DEFAULT NOW(),
        is_active BOOLEAN DEFAULT TRUE
      );
    `);

    // 6. Moderator Scopes
    await client.query(`
      CREATE TABLE IF NOT EXISTS rbac_moderator_scopes (
        id VARCHAR(64) PRIMARY KEY,
        user_id UUID NOT NULL,
        mod_tier VARCHAR(64) NOT NULL,
        assigned_category VARCHAR(128) DEFAULT 'ALL',
        can_timeout_users BOOLEAN DEFAULT TRUE,
        can_ban_users BOOLEAN DEFAULT FALSE,
        can_pin_topics BOOLEAN DEFAULT TRUE,
        can_resolve_disputes BOOLEAN DEFAULT FALSE,
        appointed_by VARCHAR(128) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 7. Canonical Pages Directory
    await client.query(`
      CREATE TABLE IF NOT EXISTS rbac_pages_directory (
        id VARCHAR(64) PRIMARY KEY,
        path VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(128) NOT NULL,
        category VARCHAR(64) NOT NULL,
        min_role_tier VARCHAR(64) DEFAULT 'PUBLIC',
        is_public_member_facing BOOLEAN DEFAULT TRUE,
        is_backoffice_only BOOLEAN DEFAULT FALSE,
        is_moderator_only BOOLEAN DEFAULT FALSE,
        is_distinguished_only BOOLEAN DEFAULT FALSE,
        is_executive_only BOOLEAN DEFAULT FALSE,
        is_maintenance_locked BOOLEAN DEFAULT FALSE,
        has_confidential_telemetry BOOLEAN DEFAULT FALSE,
        confidential_fields JSONB DEFAULT '[]'::jsonb,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 8. Field Level Masking Rules
    await client.query(`
      CREATE TABLE IF NOT EXISTS rbac_field_masking_rules (
        id VARCHAR(64) PRIMARY KEY,
        endpoint_or_context VARCHAR(128) NOT NULL,
        field_name VARCHAR(64) NOT NULL,
        min_clearance_required VARCHAR(64) NOT NULL,
        masking_strategy VARCHAR(32) DEFAULT 'STRIP',
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log('Tables verified and created successfully.');

    // Seed Data
    // A. Seed Staff Roles
    const staffRoles = [
      {
        id: 'staff_role_finance_settlement',
        slug: 'finance-settlement',
        department: 'Treasury & Settlements',
        name: 'Finance & Payout Settlement Officer',
        description: 'Reconciles payment gateway payouts, merchant withdrawals, and currency settlement batches.',
        clearance: 4
      },
      {
        id: 'staff_role_kyc_compliance',
        slug: 'kyc-compliance',
        department: 'Trust & Compliance',
        name: 'KYC & Biometric Compliance Reviewer',
        description: 'Reviews national identity proofs, facial biometrics, and PEP/sanctions clearances.',
        clearance: 3
      },
      {
        id: 'staff_role_dispute_support',
        slug: 'dispute-support',
        department: 'Customer Operations',
        name: 'Customer Care & Marketplace Dispute Manager',
        description: 'Adjudicates buyer/seller escrow disputes, chargebacks, and refund claims.',
        clearance: 2
      },
      {
        id: 'staff_role_cms_catalogue',
        slug: 'cms-catalogue',
        department: 'Content & Stores',
        name: 'CMS & Catalogue Supervisor',
        description: 'Oversees product catalogue accuracy, forum taxonomy, and marketing banner schedules.',
        clearance: 2
      },
      {
        id: 'staff_role_audit_supervisor',
        slug: 'audit-supervisor',
        department: 'Internal Audit',
        name: 'Operations Audit Supervisor',
        description: 'Monitors tamper-proof protocol logs, staff action histories, and privilege escalations.',
        clearance: 4
      }
    ];

    for (const r of staffRoles) {
      await client.query(`
        INSERT INTO rbac_staff_roles (id, slug, department, name, description, clearance_level, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, TRUE)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          department = EXCLUDED.department,
          description = EXCLUDED.description,
          clearance_level = EXCLUDED.clearance_level,
          updated_at = NOW();
      `, [r.id, r.slug, r.department, r.name, r.description, r.clearance]);
    }
    console.log('Seeded Back Office Staff Roles.');

    // B. Seed Badge Tier Privileges
    const badgeTiers = [
      {
        id: 'badge_tier_bronze',
        name: 'Bronze Member',
        level: 1,
        minFic: 0,
        minRep: 0,
        discount: 2.50,
        vaults: false,
        drops: false,
        curation: false,
        color: '#cd7f32',
        perks: JSON.stringify(['Standard Community Access', 'Basic Messaging', 'Standard Escrow'])
      },
      {
        id: 'badge_tier_silver',
        name: 'Silver Citizen',
        level: 2,
        minFic: 500,
        minRep: 50,
        discount: 7.50,
        vaults: false,
        drops: true,
        curation: false,
        color: '#94a3b8',
        perks: JSON.stringify(['5% Fee Discount', 'Early Access to General Drops', 'Silver Profile Badge'])
      },
      {
        id: 'badge_tier_gold',
        name: 'Gold Executive',
        level: 3,
        minFic: 2500,
        minRep: 200,
        discount: 15.00,
        vaults: true,
        drops: true,
        curation: true,
        color: '#f59e0b',
        perks: JSON.stringify(['15% Fee Discount', 'Private Vault Access', 'Priority Algorithm Boost', 'Gold Crown Pill'])
      },
      {
        id: 'badge_tier_platinum',
        name: 'Platinum Sovereign',
        level: 4,
        minFic: 10000,
        minRep: 500,
        discount: 25.00,
        vaults: true,
        drops: true,
        curation: true,
        color: '#06b6d4',
        perks: JSON.stringify(['25% Fee Discount', 'VIP Droplist Reservation', 'Personal Concierge Support', 'Zero Staking Lock'])
      },
      {
        id: 'badge_tier_sovereign_vip',
        name: 'LushPin Sovereign VIP',
        level: 5,
        minFic: 50000,
        minRep: 1000,
        discount: 40.00,
        vaults: true,
        drops: true,
        curation: true,
        color: '#ec4899',
        perks: JSON.stringify(['40% Fee Discount', 'Full Enclave Access', 'VIP Lounge Entry', 'Immunity from Escrow Holds'])
      }
    ];

    for (const b of badgeTiers) {
      await client.query(`
        INSERT INTO rbac_badge_tier_privileges (id, tier_name, badge_level, min_fic_balance, min_reputation, fee_discount_pct, can_access_private_vaults, can_access_early_drops, priority_curation, perks, badge_color)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE SET
          tier_name = EXCLUDED.tier_name,
          badge_level = EXCLUDED.badge_level,
          min_fic_balance = EXCLUDED.min_fic_balance,
          min_reputation = EXCLUDED.min_reputation,
          fee_discount_pct = EXCLUDED.fee_discount_pct,
          can_access_private_vaults = EXCLUDED.can_access_private_vaults,
          can_access_early_drops = EXCLUDED.can_access_early_drops,
          priority_curation = EXCLUDED.priority_curation,
          perks = EXCLUDED.perks,
          badge_color = EXCLUDED.badge_color,
          updated_at = NOW();
      `, [b.id, b.name, b.level, b.minFic, b.minRep, b.discount, b.vaults, b.drops, b.curation, b.perks, b.color]);
    }
    console.log('Seeded Badge Tier Privileges.');

    // C. Seed Distinguished & Honoured Registry
    const distinguishedRanks = [
      {
        id: 'dist_founder_ambassador',
        name: 'Founding Protocol Ambassador',
        slug: 'founder-ambassador',
        description: 'Pioneer who seeded the genesis network. Holds direct advisory access with SuperAdmin & CFO.',
        votingWeight: 10,
        canChamber: true,
        canPropose: true,
        founderAdvisory: true,
        perks: JSON.stringify(['Direct Hotline to Executive Council', 'Permanent Lifetime Revenue Share', 'Permanent Council Seat']),
        color: '#f59e0b'
      },
      {
        id: 'dist_council_dignitary',
        name: 'Sovereign Council Dignitary',
        slug: 'council-dignitary',
        description: 'Elected protocol leader governing category charters, dispute appellate rulings, and grant distributions.',
        votingWeight: 5,
        canChamber: true,
        canPropose: true,
        founderAdvisory: false,
        perks: JSON.stringify(['Council Floor Voting Rights', 'Grant Review Veto', 'Distinguished Seal on Profile']),
        color: '#8b5cf6'
      },
      {
        id: 'dist_hall_of_fame',
        name: 'Protocol Hall of Fame Laureate',
        slug: 'hall-of-fame',
        description: 'Honorary recipient recognized for monumental cultural, academic, or commercial contributions to FingerMobile.',
        votingWeight: 3,
        canChamber: true,
        canPropose: true,
        founderAdvisory: false,
        perks: JSON.stringify(['Perpetual Hall of Fame Plaque', 'Early Access to Beta Protocol Releases']),
        color: '#10b981'
      },
      {
        id: 'dist_honorary_fellow',
        name: 'Honorary Research Fellow',
        slug: 'honorary-fellow',
        description: 'Academic and technical scholars reviewing peer-reviewed Camus philosophy and protocol whitepapers.',
        votingWeight: 2,
        canChamber: true,
        canPropose: false,
        founderAdvisory: false,
        perks: JSON.stringify(['Access to Camus Academic Chamber', 'Peer-Review Verification Badge']),
        color: '#3b82f6'
      }
    ];

    for (const d of distinguishedRanks) {
      await client.query(`
        INSERT INTO rbac_distinguished_honoured_registry (id, rank_name, rank_slug, description, voting_weight, can_access_council_chamber, can_submit_governance_proposals, direct_founder_advisory, honorary_perks, badge_accent)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          rank_name = EXCLUDED.rank_name,
          rank_slug = EXCLUDED.rank_slug,
          description = EXCLUDED.description,
          voting_weight = EXCLUDED.voting_weight,
          can_access_council_chamber = EXCLUDED.can_access_council_chamber,
          can_submit_governance_proposals = EXCLUDED.can_submit_governance_proposals,
          direct_founder_advisory = EXCLUDED.direct_founder_advisory,
          honorary_perks = EXCLUDED.honorary_perks,
          badge_accent = EXCLUDED.badge_accent,
          updated_at = NOW();
      `, [d.id, d.name, d.slug, d.description, d.votingWeight, d.canChamber, d.canPropose, d.founderAdvisory, d.perks, d.color]);
    }
    console.log('Seeded Distinguished & Honoured Registry.');

    // D. Seed Canonical Pages Directory
    const seedPages = [
      // Public / General Member Pages
      { id: 'page_forum', path: '/forum', title: 'Community Forum & Discussions', cat: 'COMMUNITY', minTier: 'PUBLIC', isPublic: true, isBackoffice: false, isMod: false, isDist: false, isExec: false, confTelemetry: false, confFields: '[]' },
      { id: 'page_storefront', path: '/storefront', title: 'Decentralized Storefront', cat: 'COMMERCE', minTier: 'PUBLIC', isPublic: true, isBackoffice: false, isMod: false, isDist: false, isExec: false, confTelemetry: true, confFields: '["gross_margin", "merchant_risk_score"]' },
      { id: 'page_beatwave', path: '/beatwave', title: 'Beatwave Audio & Podcasts', cat: 'MEDIA', minTier: 'PUBLIC', isPublic: true, isBackoffice: false, isMod: false, isDist: false, isExec: false, confTelemetry: false, confFields: '[]' },
      { id: 'page_camus', path: '/camus', title: 'Camus Philosophical Academy', cat: 'ACADEMIC', minTier: 'PUBLIC', isPublic: true, isBackoffice: false, isMod: false, isDist: false, isExec: false, confTelemetry: false, confFields: '[]' },
      { id: 'page_wallet', path: '/wallet', title: 'Sovereign Multi-Chain Wallet', cat: 'FINANCE', minTier: 'MEMBER', isPublic: true, isBackoffice: false, isMod: false, isDist: false, isExec: false, confTelemetry: true, confFields: '["system_reserve_pool", "liquidity_escrow_private_keys"]' },

      // Specialized Administrative & Enclave Portals
      { id: 'page_backoffice_ops', path: '/backoffice/operations', title: 'Back Office Operations Portal', cat: 'OPERATIONS', minTier: 'BACKOFFICE', isPublic: false, isBackoffice: true, isMod: false, isDist: false, isExec: false, confTelemetry: true, confFields: '["internal_settlement_keys", "settlement_bank_details"]' },
      { id: 'page_badge_enclave', path: '/enclave/badge-privileges', title: 'Badge Sovereign Enclave', cat: 'PERKS', minTier: 'BADGE_TIER', isPublic: false, isBackoffice: false, isMod: false, isDist: false, isExec: false, confTelemetry: false, confFields: '[]' },
      { id: 'page_council_gov', path: '/council/governance', title: 'Council of Dignitaries Chamber', cat: 'GOVERNANCE', minTier: 'DISTINGUISHED', isPublic: false, isBackoffice: false, isMod: false, isDist: true, isExec: false, confTelemetry: true, confFields: '["treasury_deliberation_notes"]' },
      { id: 'page_mod_console', path: '/moderator/command-center', title: 'Moderator Command Console', cat: 'MODERATION', minTier: 'MODERATOR', isPublic: false, isBackoffice: false, isMod: true, isDist: false, isExec: false, confTelemetry: true, confFields: '["reporter_unmasked_identity"]' },

      // Executive Consoles (SuperAdmin & CFO Only)
      { id: 'page_master_dashboard', path: '/master-dashboard', title: 'Executive Master Dashboard', cat: 'EXECUTIVE', minTier: 'CFO', isPublic: false, isBackoffice: false, isMod: false, isDist: false, isExec: true, confTelemetry: true, confFields: '["*"]' },
      { id: 'page_users_permissions', path: '/admin/users-permissions', title: 'Users Permission Console', cat: 'EXECUTIVE_RBAC', minTier: 'SUPERADMIN', isPublic: false, isBackoffice: false, isMod: false, isDist: false, isExec: true, confTelemetry: true, confFields: '["*"]' },
      { id: 'page_pages_permissions', path: '/admin/pages-permissions', title: 'Pages Permission Console', cat: 'EXECUTIVE_RBAC', minTier: 'SUPERADMIN', isPublic: false, isBackoffice: false, isMod: false, isDist: false, isExec: true, confTelemetry: true, confFields: '["*"]' }
    ];

    for (const p of seedPages) {
      await client.query(`
        INSERT INTO rbac_pages_directory (id, path, title, category, min_role_tier, is_public_member_facing, is_backoffice_only, is_moderator_only, is_distinguished_only, is_executive_only, has_confidential_telemetry, confidential_fields)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb)
        ON CONFLICT (path) DO UPDATE SET
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          min_role_tier = EXCLUDED.min_role_tier,
          is_public_member_facing = EXCLUDED.is_public_member_facing,
          is_backoffice_only = EXCLUDED.is_backoffice_only,
          is_moderator_only = EXCLUDED.is_moderator_only,
          is_distinguished_only = EXCLUDED.is_distinguished_only,
          is_executive_only = EXCLUDED.is_executive_only,
          has_confidential_telemetry = EXCLUDED.has_confidential_telemetry,
          confidential_fields = EXCLUDED.confidential_fields,
          updated_at = NOW();
      `, [p.id, p.path, p.title, p.cat, p.minTier, p.isPublic, p.isBackoffice, p.isMod, p.isDist, p.isExec, p.confTelemetry, p.confFields]);
    }
    console.log('Seeded Canonical Pages Directory.');

    // E. Seed Field Masking Rules
    const maskingRules = [
      { id: 'rule_gross_margin', endpoint: '/api/v1/storefront', field: 'gross_margin', clearance: 'CFO', strategy: 'STRIP', desc: 'Hide profit margin percentage from public product endpoints' },
      { id: 'rule_liquidity_reserve', endpoint: '/api/v1/wallet', field: 'liquidity_reserve', clearance: 'CFO', strategy: 'STRIP', desc: 'Hide sovereign liquidity reserve telemetry from regular members' },
      { id: 'rule_risk_score', endpoint: '/api/v1/users', field: 'risk_score', clearance: 'BACKOFFICE', strategy: 'STRIP', desc: 'Hide AML fraud risk score from member profiles' },
      { id: 'rule_internal_audit', endpoint: '/api/v1/audit', field: 'internal_notes', clearance: 'BACKOFFICE', strategy: 'STRIP', desc: 'Hide internal reviewer notes from public audit logs' },
      { id: 'rule_raw_kyc', endpoint: '/api/v1/kyc', field: 'raw_id_image_url', clearance: 'BACKOFFICE', strategy: 'REDACT', desc: 'Redact government ID image URLs from member payloads' }
    ];

    for (const m of maskingRules) {
      await client.query(`
        INSERT INTO rbac_field_masking_rules (id, endpoint_or_context, field_name, min_clearance_required, masking_strategy, description)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET
          endpoint_or_context = EXCLUDED.endpoint_or_context,
          field_name = EXCLUDED.field_name,
          min_clearance_required = EXCLUDED.min_clearance_required,
          masking_strategy = EXCLUDED.masking_strategy,
          description = EXCLUDED.description,
          updated_at = NOW();
      `, [m.id, m.endpoint, m.field, m.clearance, m.strategy, m.desc]);
    }
    console.log('Seeded Field Masking Rules.');

    await client.query('COMMIT');
    console.log('✅ Sovereign RBAC Migration Completed Successfully with 0 Errors!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration Failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
