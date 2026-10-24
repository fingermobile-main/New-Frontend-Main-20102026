/**
 * FingerMobile Protocol™ Batch 3 Consoles Database Migration & Seeding
 * Consoles 19, 20, 21:
 * - 19: Franchise & Regional Hubs Management Console
 * - 20: Email, Push & Communications Delivery Console
 * - 21: Support, SLA & Customer Care Operations Console
 */

const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5433', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'fingermobile_platform_db',
});

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('⚡ Starting PostgreSQL migration for Batch 3 Consoles (19, 20, 21)...');
    await client.query('BEGIN');

    // ==========================================
    // 1. CONSOLE 19: FRANCHISE & REGIONAL HUBS
    // ==========================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS franchise_hubs_console_items (
        id SERIAL PRIMARY KEY,
        code VARCHAR(64) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        territory VARCHAR(255) NOT NULL,
        merchants INT DEFAULT 0,
        revenue_share_pct NUMERIC(6, 2) DEFAULT 10.00,
        tax_compliance_status VARCHAR(64) DEFAULT 'Compliant',
        currency VARCHAR(16) DEFAULT 'NGN',
        status VARCHAR(32) DEFAULT 'active',
        display_order INT DEFAULT 1,
        asset_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS franchise_hubs_console_spawns (
        id SERIAL PRIMARY KEY,
        parent_console VARCHAR(64) DEFAULT 'franchise-hubs-console',
        sub_console_name VARCHAR(255) NOT NULL,
        slug VARCHAR(128) NOT NULL,
        endpoint VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        status VARCHAR(32) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    const franchiseItems = [
      { code: 'FRAN-NG-HQ', name: 'Lagos Sovereign Franchise HQ & Western Corridor Hub', description: 'Central continental franchise operations, merchant accreditation vault & Lagos-Ibadan financial rail terminal.', category: 'West Africa', territory: 'Nigeria - Lagos & SW Zone', merchants: 4250, revenue_share_pct: 12.50, tax_compliance_status: 'Compliant', currency: 'NGN', status: 'active', display_order: 1 },
      { code: 'FRAN-ABJ-NORTH', name: 'Abuja Federal Capital & Northern Territory Gateway', description: 'Northern federation commercial nexus, Sahel regional logistics & government liaison chamber.', category: 'West Africa', territory: 'Nigeria - North Central & Northern Corridors', merchants: 1820, revenue_share_pct: 12.00, tax_compliance_status: 'Compliant', currency: 'NGN', status: 'active', display_order: 2 },
      { code: 'FRAN-GH-ACCRA', name: 'Accra Digital Trade & ECOWAS Regional Nexus', description: 'Ghana cedi liquidity bridges, West African cross-border merchant corridors and port customs clearing.', category: 'West Africa', territory: 'Ghana - Greater Accra & Ashanti', merchants: 950, revenue_share_pct: 14.00, tax_compliance_status: 'Compliant', currency: 'GHS', status: 'active', display_order: 3 },
      { code: 'FRAN-KE-NAIROBI', name: 'Nairobi Silicon Savannah & East Africa Corridor', description: 'M-Pesa interoperability gateways, Kenya-Uganda-Rwanda logistics coordination and mobile tech incubator.', category: 'East Africa', territory: 'Kenya, Uganda & Rwanda Corridor', merchants: 2100, revenue_share_pct: 13.50, tax_compliance_status: 'Compliant', currency: 'KES', status: 'active', display_order: 4 },
      { code: 'FRAN-ZA-JOBURG', name: 'Johannesburg & Southern SADC Sovereign Enclave', description: 'South Africa rand settlement network, southern mining luxury corridor and SADC corporate partnerships.', category: 'Southern Africa', territory: 'South Africa, Namibia & Botswana', merchants: 1680, revenue_share_pct: 11.50, tax_compliance_status: 'Compliant', currency: 'ZAR', status: 'active', display_order: 5 },
      { code: 'FRAN-UK-LDN', name: 'London Diaspora Payout Bridge & EMEA Settlement Hub', description: 'FCA-aligned diaspora remittance routing, Sterling-to-Naira instant settlements and UK merchant syndicate.', category: 'Diaspora & EMEA', territory: 'United Kingdom & Western Europe', merchants: 1120, revenue_share_pct: 8.50, tax_compliance_status: 'HMRC Certified', currency: 'GBP', status: 'active', display_order: 6 },
      { code: 'FRAN-US-EST', name: 'North America Diaspora Trade & Escrow Terminal', description: 'US/Canada diaspora marketplace terminals, Fedwire liquidity bridges and FinCEN compliant transactions.', category: 'Diaspora & Americas', territory: 'United States & Canada East Coast', merchants: 1450, revenue_share_pct: 8.00, tax_compliance_status: 'FinCEN Cleared', currency: 'USD', status: 'active', display_order: 7 },
      { code: 'FRAN-FR-PARIS', name: 'Francophone Africa Diaspora Gateway', description: 'CFA Franc corridor integration, Paris diaspora fashion & luxury goods escrow fulfillment.', category: 'Diaspora & EMEA', territory: 'France, Belgium & West Africa Franc Zone', merchants: 640, revenue_share_pct: 9.00, tax_compliance_status: 'EU Compliant', currency: 'EUR', status: 'active', display_order: 8 },
      { code: 'FRAN-RW-KIGALI', name: 'Kigali Innovation Hub & Web3 Micro-Franchise Node', description: 'Zero-friction Pan-African startup accreditation, EAC digital single market pilot and smart contract franchising.', category: 'East Africa', territory: 'Rwanda Innovation City & Central Rift', merchants: 520, revenue_share_pct: 10.00, tax_compliance_status: 'Compliant', currency: 'RWF', status: 'active', display_order: 9 },
      { code: 'FRAN-EG-CAIRO', name: 'Cairo & North Africa Sovereign Trade Chamber', description: 'North African maritime trade links, Egyptian Pound FX clearing and Mediterranean merchant accreditation.', category: 'North Africa', territory: 'Egypt & Maghreb Maritime Corridor', merchants: 780, revenue_share_pct: 11.00, tax_compliance_status: 'CBE Audited', currency: 'EGP', status: 'active', display_order: 10 },
      { code: 'FRAN-AE-DXB', name: 'Dubai Multi-Commodities & Gulf Remittance Corridor', description: 'Gulf diaspora investment bridge, DMCC precious metal vaulting and Dirham-denominated escrow accounts.', category: 'Middle East', territory: 'UAE, Qatar & GCC African Trade', merchants: 890, revenue_share_pct: 7.50, tax_compliance_status: 'VARA Aligned', currency: 'AED', status: 'active', display_order: 11 },
      { code: 'FRAN-MERCH-ACCRED', name: 'Autonomous Franchise Merchant Accreditation & KYC Engine', description: 'Automated biometric and corporate registration validation, AML sanctions screening and instant franchise license minting.', category: 'Governance & Audits', territory: 'Global Franchise Network', merchants: 16200, revenue_share_pct: 0.00, tax_compliance_status: 'Automated Real-Time', currency: 'MULTI', status: 'active', display_order: 12 },
    ];

    for (const item of franchiseItems) {
      await client.query(`
        INSERT INTO franchise_hubs_console_items (code, name, description, category, territory, merchants, revenue_share_pct, tax_compliance_status, currency, status, display_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (code) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          category = EXCLUDED.category,
          territory = EXCLUDED.territory,
          merchants = EXCLUDED.merchants,
          revenue_share_pct = EXCLUDED.revenue_share_pct,
          tax_compliance_status = EXCLUDED.tax_compliance_status,
          currency = EXCLUDED.currency,
          status = EXCLUDED.status,
          display_order = EXCLUDED.display_order;
      `, [item.code, item.name, item.description, item.category, item.territory, item.merchants, item.revenue_share_pct, item.tax_compliance_status, item.currency, item.status, item.display_order]);
    }

    // ==========================================
    // 2. CONSOLE 20: EMAIL, PUSH & COMMS
    // ==========================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS email_comms_console_items (
        id SERIAL PRIMARY KEY,
        code VARCHAR(64) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        throughput_sec INT DEFAULT 1000,
        delivery_rate_pct NUMERIC(6, 2) DEFAULT 99.00,
        bounce_rate_pct NUMERIC(6, 2) DEFAULT 0.50,
        status VARCHAR(32) DEFAULT 'active',
        display_order INT DEFAULT 1,
        asset_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS email_comms_console_spawns (
        id SERIAL PRIMARY KEY,
        parent_console VARCHAR(64) DEFAULT 'email-comms-console',
        sub_console_name VARCHAR(255) NOT NULL,
        slug VARCHAR(128) NOT NULL,
        endpoint VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        status VARCHAR(32) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    const commsItems = [
      { code: 'COMM-SMTP-PRI', name: 'Primary Sovereign SMTP Relay Cluster (DKIM, SPF, DMARC 100%)', description: 'Multi-tenant high-reputation SMTP nodes with dedicated IP warming and automated bounce circuit breakers.', category: 'Transactional Email', throughput_sec: 1200, delivery_rate_pct: 99.85, bounce_rate_pct: 0.12, status: 'active', display_order: 1 },
      { code: 'COMM-SMS-TERMII', name: 'Termii Multi-Carrier African SMS Gateway (9JA DND Bypass)', description: 'Direct telco SS7 binding with MTN, Airtel, Glo and 9mobile with regulatory DND whitelist failover.', category: 'African SMS Rails', throughput_sec: 650, delivery_rate_pct: 99.40, bounce_rate_pct: 0.45, status: 'active', display_order: 2 },
      { code: 'COMM-SMS-AT', name: "Africa's Talking Pan-African Telephony & USSD Failover Rail", description: 'Cross-continental telecom aggregator covering Kenya, Ghana, Uganda, Tanzania, Rwanda and South Africa.', category: 'African SMS Rails', throughput_sec: 500, delivery_rate_pct: 99.20, bounce_rate_pct: 0.60, status: 'active', display_order: 3 },
      { code: 'COMM-PUSH-FCM', name: 'Firebase Cloud Messaging (FCM) Real-Time Android Push Pipe', description: 'High-concurrency mobile push channel with background payload wakeups and African regional edge caching.', category: 'Push Notifications', throughput_sec: 8500, delivery_rate_pct: 98.90, bounce_rate_pct: 0.95, status: 'active', display_order: 4 },
      { code: 'COMM-PUSH-APNS', name: 'Apple Push Notification Service (APNs) HTTP/2 VIP Pipe', description: 'Dedicated Apple iOS low-latency push notification pipeline with sound badge and critical alert entitlements.', category: 'Push Notifications', throughput_sec: 4200, delivery_rate_pct: 99.70, bounce_rate_pct: 0.25, status: 'active', display_order: 5 },
      { code: 'COMM-PUSH-WEB', name: 'WebPush RFC 8292 Real-Time Edge Broadcast Mesh', description: 'Browser standard VAPID push system delivering instant notifications to Chrome, Firefox, Safari and Edge.', category: 'Push Notifications', throughput_sec: 3100, delivery_rate_pct: 96.50, bounce_rate_pct: 2.10, status: 'active', display_order: 6 },
      { code: 'COMM-TMPL-ENGINE', name: 'Dynamic STERCS Handlebars & MJML Template Transpiler', description: 'Responsive email and message layout rendering engine with multi-lingual localization support.', category: 'Template Transpiler', throughput_sec: 2500, delivery_rate_pct: 100.00, bounce_rate_pct: 0.00, status: 'active', display_order: 7 },
      { code: 'COMM-OTP-ENCLAVE', name: 'Camus Hardware Cryptographic 2FA & OTP Dispatch Enclave', description: 'Sub-second generation of hardware-authenticated one-time passwords with rate-limiting and replay shields.', category: 'Security & 2FA', throughput_sec: 1800, delivery_rate_pct: 99.98, bounce_rate_pct: 0.01, status: 'active', display_order: 8 },
      { code: 'COMM-BOUNCE-GUARD', name: 'Autonomous Machine Learning Bounce & Spam Reputation Guard', description: 'Predictive heuristic filtering detecting spam traps, disposable inboxes and domain blacklisting threats.', category: 'Reputation & Guard', throughput_sec: 5000, delivery_rate_pct: 100.00, bounce_rate_pct: 0.00, status: 'active', display_order: 9 },
      { code: 'COMM-WHATSAPP-BIZ', name: 'WhatsApp Cloud Business API Interactive Notification Rail', description: 'Meta verified business interactive messaging channel for order receipts, ticket updates and secure alerts.', category: 'Instant Messaging', throughput_sec: 350, delivery_rate_pct: 98.60, bounce_rate_pct: 0.80, status: 'active', display_order: 10 },
      { code: 'COMM-TELEGRAM-BOT', name: 'STERCS Sovereign Telegram Bot Alert & Command Dispatcher', description: 'Instant administrative and community operations alerting bot with two-way command execution capabilities.', category: 'Instant Messaging', throughput_sec: 900, delivery_rate_pct: 99.90, bounce_rate_pct: 0.05, status: 'active', display_order: 11 },
      { code: 'COMM-AUDIT-ARCHIVE', name: 'Immutable 7-Year Communications Audit & Compliance Vault', description: 'NDPR, GDPR and CBN compliant write-once-read-many (WORM) storage for all transactional communications.', category: 'Regulatory Compliance', throughput_sec: 1500, delivery_rate_pct: 100.00, bounce_rate_pct: 0.00, status: 'active', display_order: 12 },
    ];

    for (const item of commsItems) {
      await client.query(`
        INSERT INTO email_comms_console_items (code, name, description, category, throughput_sec, delivery_rate_pct, bounce_rate_pct, status, display_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (code) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          category = EXCLUDED.category,
          throughput_sec = EXCLUDED.throughput_sec,
          delivery_rate_pct = EXCLUDED.delivery_rate_pct,
          bounce_rate_pct = EXCLUDED.bounce_rate_pct,
          status = EXCLUDED.status,
          display_order = EXCLUDED.display_order;
      `, [item.code, item.name, item.description, item.category, item.throughput_sec, item.delivery_rate_pct, item.bounce_rate_pct, item.status, item.display_order]);
    }

    // ==========================================
    // 3. CONSOLE 21: SUPPORT & CUSTOMER CARE
    // ==========================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS support_care_console_items (
        id SERIAL PRIMARY KEY,
        code VARCHAR(64) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        avg_first_response_min NUMERIC(6, 2) DEFAULT 2.00,
        resolution_rate_pct NUMERIC(6, 2) DEFAULT 95.00,
        sla_compliance_pct NUMERIC(6, 2) DEFAULT 99.00,
        csat_score NUMERIC(4, 2) DEFAULT 4.80,
        status VARCHAR(32) DEFAULT 'active',
        display_order INT DEFAULT 1,
        asset_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS support_care_console_spawns (
        id SERIAL PRIMARY KEY,
        parent_console VARCHAR(64) DEFAULT 'support-care-console',
        sub_console_name VARCHAR(255) NOT NULL,
        slug VARCHAR(128) NOT NULL,
        endpoint VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        status VARCHAR(32) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    const supportItems = [
      { code: 'SUPP-T1-TRIAGE', name: 'Tier-1 Autonomous AI Customer Care & Instant Bot Triage', description: 'Autonomous natural language classifier answering common inquiries, resetting credentials and routing complex cases.', category: 'Tier-1 Care', avg_first_response_min: 0.20, resolution_rate_pct: 68.50, sla_compliance_pct: 99.80, csat_score: 4.82, status: 'active', display_order: 1 },
      { code: 'SUPP-T2-HUMAN', name: 'Tier-2 Senior Support Specialist Chamber (Lagos / Nairobi Ops)', description: 'Experienced platform specialists handling deep user account investigations, KYC verifications and manual payouts.', category: 'Tier-2 Care', avg_first_response_min: 4.50, resolution_rate_pct: 88.20, sla_compliance_pct: 98.50, csat_score: 4.75, status: 'active', display_order: 2 },
      { code: 'SUPP-T3-ENG', name: 'Tier-3 Engineering & Distributed Systems Escrow Escalations', description: 'Core protocol engineers resolving database state anomalies, blockchain bridge freezes and rare system defects.', category: 'Tier-3 Engineering', avg_first_response_min: 15.00, resolution_rate_pct: 97.40, sla_compliance_pct: 96.80, csat_score: 4.90, status: 'active', display_order: 3 },
      { code: 'SUPP-DISPUTE-MERCH', name: 'VIP Merchant & High-Volume Storefront Dispute Arbitration', description: 'Dedicated trade arbitration bench for marketplace buyer/seller disputes, damaged inventory and delivery claims.', category: 'Merchant Disputes', avg_first_response_min: 5.00, resolution_rate_pct: 94.00, sla_compliance_pct: 99.10, csat_score: 4.88, status: 'active', display_order: 4 },
      { code: 'SUPP-CHARGEBACK-ESC', name: 'CBN/NDPR Financial Chargeback & Escrow Recovery Chamber', description: 'Bank-level chargeback defense, debit dispute evidence compilation and escrow reclaim management.', category: 'Financial Disputes', avg_first_response_min: 8.00, resolution_rate_pct: 91.50, sla_compliance_pct: 99.50, csat_score: 4.65, status: 'active', display_order: 5 },
      { code: 'SUPP-GAMING-DISPUTE', name: 'SuperVi Gaming Tournament & Loot Staking Fair-Play Tribunal', description: 'Anti-cheat telemetry analysis, tournament prize pool payout verification and esports match disputes.', category: 'Gaming Care', avg_first_response_min: 1.50, resolution_rate_pct: 95.00, sla_compliance_pct: 98.90, csat_score: 4.84, status: 'active', display_order: 6 },
      { code: 'SUPP-VIP-CONCIERGE', name: 'FingerLux Black Card Sovereign Concierge Desk (24/7 Live)', description: 'Dedicated human concierge dedicated exclusively to high-net-worth VIP members, luxury buyers and council members.', category: 'VIP Concierge', avg_first_response_min: 0.50, resolution_rate_pct: 99.20, sla_compliance_pct: 100.00, csat_score: 4.98, status: 'active', display_order: 7 },
      { code: 'SUPP-SLA-BREACH', name: 'Automated SLA Breach Penalty & Refund Credit Dispatcher', description: 'Automated credit dispatcher that grants FIC apology credits if response time thresholds are exceeded.', category: 'SLA Operations', avg_first_response_min: 0.10, resolution_rate_pct: 100.00, sla_compliance_pct: 100.00, csat_score: 4.92, status: 'active', display_order: 8 },
      { code: 'SUPP-CSAT-TELEMETRY', name: 'Real-Time Net Promoter Score (NPS) & Sentiment Telemetry', description: 'Live customer happiness dashboard tracking user sentiment across social, in-app and email channels.', category: 'Sentiment & Audits', avg_first_response_min: 0.00, resolution_rate_pct: 100.00, sla_compliance_pct: 100.00, csat_score: 4.89, status: 'active', display_order: 9 },
      { code: 'SUPP-COMMUNITY-CARE', name: 'Communities & Forum Moderator Escalation Pipeline', description: 'Fast-track routing for community forum flags, spam reports and member harassment prevention.', category: 'Community Care', avg_first_response_min: 3.00, resolution_rate_pct: 89.00, sla_compliance_pct: 97.50, csat_score: 4.70, status: 'active', display_order: 10 },
      { code: 'SUPP-FRAUD-QUARANTINE', name: 'Suspected Account Impersonation & Identity Lock Desk', description: 'Emergency isolation and forensic identity verification for accounts exhibiting takeover signals.', category: 'Trust & Safety', avg_first_response_min: 2.00, resolution_rate_pct: 96.00, sla_compliance_pct: 99.40, csat_score: 4.79, status: 'active', display_order: 11 },
      { code: 'SUPP-KNOWLEDGE-BASE', name: 'Multilingual Self-Service Knowledge Base & Video Walkthroughs', description: 'Searchable multimedia guidance center with interactive troubleshooting guides and video tutorials.', category: 'Self-Service', avg_first_response_min: 0.00, resolution_rate_pct: 78.00, sla_compliance_pct: 100.00, csat_score: 4.85, status: 'active', display_order: 12 },
    ];

    for (const item of supportItems) {
      await client.query(`
        INSERT INTO support_care_console_items (code, name, description, category, avg_first_response_min, resolution_rate_pct, sla_compliance_pct, csat_score, status, display_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (code) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          category = EXCLUDED.category,
          avg_first_response_min = EXCLUDED.avg_first_response_min,
          resolution_rate_pct = EXCLUDED.resolution_rate_pct,
          sla_compliance_pct = EXCLUDED.sla_compliance_pct,
          csat_score = EXCLUDED.csat_score,
          status = EXCLUDED.status,
          display_order = EXCLUDED.display_order;
      `, [item.code, item.name, item.description, item.category, item.avg_first_response_min, item.resolution_rate_pct, item.sla_compliance_pct, item.csat_score, item.status, item.display_order]);
    }

    await client.query('COMMIT');
    console.log('✅ Batch 3 Consoles (19, 20, 21) migration & data seeding completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(err => {
  console.error(err);
  process.exit(1);
});
