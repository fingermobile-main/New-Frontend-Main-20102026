/**
 * FingerMobile Protocol™ Batch 4 Consoles Database Migration & Seeding
 * Consoles 22, 23, 24:
 * - 22: Sound River & Sound Ocean Sonic Console
 * - 23: Platform Domain & Edge Network Console
 * - 24: Gamification, Quests & Rewards Citadel Console
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
    console.log('⚡ Starting PostgreSQL migration for Batch 4 Consoles (22, 23, 24)...');
    await client.query('BEGIN');

    // ==========================================
    // 1. CONSOLE 22: SOUND SONIC CONSOLE
    // ==========================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS sound_sonic_console_items (
        id SERIAL PRIMARY KEY,
        code VARCHAR(64) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        bitrate_kbps INT DEFAULT 320,
        sample_rate_khz INT DEFAULT 48,
        latency_ms INT DEFAULT 20,
        channels INT DEFAULT 2,
        status VARCHAR(32) DEFAULT 'active',
        display_order INT DEFAULT 1,
        asset_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS sound_sonic_console_spawns (
        id SERIAL PRIMARY KEY,
        parent_console VARCHAR(64) DEFAULT 'sound-sonic-console',
        sub_console_name VARCHAR(255) NOT NULL,
        slug VARCHAR(128) NOT NULL,
        endpoint VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        status VARCHAR(32) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    const soundItems = [
      { code: 'SONIC-RIVER-HQ', name: '320kbps Sonic River Pan-African Stream Relay', description: 'Continuous adaptive bitrate audio stream optimized for African 3G/4G/5G mobile edge networks.', category: 'Sonic River', bitrate_kbps: 320, sample_rate_khz: 48, latency_ms: 18, channels: 2, status: 'active', display_order: 1 },
      { code: 'SONIC-OCEAN-FLAC', name: '24-bit / 192kHz Audiophile FLAC Ocean Pipe', description: 'Studio-grade uncompressed FLAC streaming pipeline for high-fidelity audiophiles and mastering engineers.', category: 'Sound Ocean', bitrate_kbps: 9216, sample_rate_khz: 192, latency_ms: 45, channels: 2, status: 'active', display_order: 2 },
      { code: 'SONIC-SPATIAL-3D', name: 'Binaural Spatial 3D Audio Positional Panner', description: 'Interactive head-tracked 3D audio rendering engine creating panoramic African acoustic environments.', category: 'Spatial Audio', bitrate_kbps: 640, sample_rate_khz: 96, latency_ms: 12, channels: 8, status: 'active', display_order: 3 },
      { code: 'SONIC-STEMS-AI', name: 'Nexus Neural Stems Isolator (Vocals, Bass, Drums, Synths)', description: 'AI-driven real-time audio separation separating Afrobeat stems for instant remakes and sample slicing.', category: 'Stems Processing', bitrate_kbps: 1411, sample_rate_khz: 44, latency_ms: 120, channels: 4, status: 'active', display_order: 4 },
      { code: 'SONIC-SUBBASS-SYNC', name: 'Afrobeats 40Hz Resonant Sub-Bass Equalizer & Sync', description: 'Dedicated low-frequency harmonic generator ensuring profound club-grade punch across mobile speakers.', category: 'DSP & Mastering', bitrate_kbps: 320, sample_rate_khz: 48, latency_ms: 8, channels: 2, status: 'active', display_order: 5 },
      { code: 'SONIC-RADIO-NG', name: 'Live Sovereign Radio & DJ Cast Multi-Bitrate Edge', description: 'Ultra-low latency live broadcast relay supporting synchronized shoutouts, track metadata and chat triggers.', category: 'Broadcast Relays', bitrate_kbps: 256, sample_rate_khz: 44, latency_ms: 22, channels: 2, status: 'active', display_order: 6 },
      { code: 'SONIC-PODCAST-OPUS', name: 'Adaptive Bitrate Low-Bandwidth Voice Opus Transcoder', description: 'Crystal-clear speech compression maintaining voice intelligibility even at 24kbps on congested networks.', category: 'Spoken Word', bitrate_kbps: 64, sample_rate_khz: 48, latency_ms: 15, channels: 1, status: 'active', display_order: 7 },
      { code: 'SONIC-WATERMARK-ZK', name: 'Zero-Knowledge Cryptographic Audio Fingerprint & DRM', description: 'Imperceptible ultrasonic acoustic watermarking proving track authorship and preventing unauthorized piracy.', category: 'Copyright & Proof', bitrate_kbps: 0, sample_rate_khz: 48, latency_ms: 4, channels: 2, status: 'active', display_order: 8 },
      { code: 'SONIC-ROYALTY-TICK', name: 'Sub-Second Micro-Royalty Stream Pay-Per-Second Engine', description: 'Real-time FIC fractional token micropayments direct to registered artists as each second of audio plays.', category: 'Monetization', bitrate_kbps: 0, sample_rate_khz: 0, latency_ms: 5, channels: 0, status: 'active', display_order: 9 },
      { code: 'SONIC-AFRICAN-VOICE', name: 'SuperVi Voice Engine African Stems Master Matrix', description: 'High-energy authentic African voice line audio engine powering praise lines, combo shouts and warnings.', category: 'Voice Synthesizer', bitrate_kbps: 320, sample_rate_khz: 48, latency_ms: 6, channels: 2, status: 'active', display_order: 10 },
      { code: 'SONIC-ANALYTICS-DSP', name: 'Real-Time Spectrum Analyzer & Loudness (LUFS) Profiler', description: 'Broadcast loudness normalization (EBU R128 / -14 LUFS) ensuring consistent listening volume across tracks.', category: 'DSP & Mastering', bitrate_kbps: 0, sample_rate_khz: 96, latency_ms: 10, channels: 2, status: 'active', display_order: 11 },
      { code: 'SONIC-ARCHIVE-WORM', name: 'Immutable Lossless Master Tape Archive (WORM Storage)', description: 'Cryptographically hashed write-once-read-many storage guaranteeing uncorrupted preservation of cultural music.', category: 'Vault Storage', bitrate_kbps: 9216, sample_rate_khz: 192, latency_ms: 250, channels: 2, status: 'active', display_order: 12 },
    ];

    for (const item of soundItems) {
      await client.query(`
        INSERT INTO sound_sonic_console_items (code, name, description, category, bitrate_kbps, sample_rate_khz, latency_ms, channels, status, display_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (code) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          category = EXCLUDED.category,
          bitrate_kbps = EXCLUDED.bitrate_kbps,
          sample_rate_khz = EXCLUDED.sample_rate_khz,
          latency_ms = EXCLUDED.latency_ms,
          channels = EXCLUDED.channels,
          status = EXCLUDED.status,
          display_order = EXCLUDED.display_order;
      `, [item.code, item.name, item.description, item.category, item.bitrate_kbps, item.sample_rate_khz, item.latency_ms, item.channels, item.status, item.display_order]);
    }

    // ==========================================
    // 2. CONSOLE 23: DOMAIN & EDGE NETWORK
    // ==========================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS domain_edge_console_items (
        id SERIAL PRIMARY KEY,
        code VARCHAR(64) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        qps_capacity INT DEFAULT 100000,
        ssl_grade VARCHAR(32) DEFAULT 'A+',
        cache_hit_pct NUMERIC(6, 2) DEFAULT 95.00,
        status VARCHAR(32) DEFAULT 'active',
        display_order INT DEFAULT 1,
        asset_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS domain_edge_console_spawns (
        id SERIAL PRIMARY KEY,
        parent_console VARCHAR(64) DEFAULT 'domain-edge-console',
        sub_console_name VARCHAR(255) NOT NULL,
        slug VARCHAR(128) NOT NULL,
        endpoint VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        status VARCHAR(32) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    const domainItems = [
      { code: 'EDGE-APEX-ROUTER', name: 'Sovereign Anycast BGP Edge Routing Fabric', description: 'Multi-continent BGP route optimization steering user traffic to the topologically closest datacenter.', category: 'Edge Routing', qps_capacity: 450000, ssl_grade: 'A+ (TLS 1.3)', cache_hit_pct: 94.20, status: 'active', display_order: 1 },
      { code: 'EDGE-DNS-SEC', name: 'DNSSEC Sub-Zone Sovereign Authoritative Nameservers', description: 'Cryptographically signed DNS responses preventing DNS spoofing and cache poisoning across domains.', category: 'DNS & Security', qps_capacity: 850000, ssl_grade: 'A+', cache_hit_pct: 99.80, status: 'active', display_order: 2 },
      { code: 'EDGE-SSL-AUTO', name: 'Camus Hardware Managed Let\'s Encrypt / DigiCert Auto-Renewal', description: 'Confidential compute automated SSL certificate rotation with zero-downtime hot reloading.', category: 'SSL & Certificates', qps_capacity: 100000, ssl_grade: 'A+ (EV)', cache_hit_pct: 100.00, status: 'active', display_order: 3 },
      { code: 'EDGE-CDN-LAGOS', name: 'Lagos Western Africa IXPN Edge Cache PoP', description: 'Direct peering at the Internet Exchange Point of Nigeria delivering sub-5ms content delivery in Lagos.', category: 'CDN Points of Presence', qps_capacity: 250000, ssl_grade: 'A+', cache_hit_pct: 96.50, status: 'active', display_order: 4 },
      { code: 'EDGE-CDN-NAIROBI', name: 'Nairobi Silicon Savannah East Africa KIXP PoP', description: 'Direct peering with Kenyan carriers terminating East African streaming and marketplace requests.', category: 'CDN Points of Presence', qps_capacity: 180000, ssl_grade: 'A+', cache_hit_pct: 95.80, status: 'active', display_order: 5 },
      { code: 'EDGE-CDN-JOBURG', name: 'Johannesburg Southern Africa NAPAfrica PoP', description: 'High-throughput edge cache serving South Africa and SADC members with low-latency media assets.', category: 'CDN Points of Presence', qps_capacity: 220000, ssl_grade: 'A+', cache_hit_pct: 97.10, status: 'active', display_order: 6 },
      { code: 'EDGE-CDN-LONDON', name: 'London LINX EMEA Diaspora Low-Latency Gateway', description: 'European edge cache point accelerating diaspora remittance, media streaming and merchant consoles.', category: 'CDN Points of Presence', qps_capacity: 350000, ssl_grade: 'A+', cache_hit_pct: 98.40, status: 'active', display_order: 7 },
      { code: 'EDGE-WAF-DEFCON', name: 'DefCon Heuristic Web Application Firewall & Bot Shield', description: 'Neural behavioral filter stopping SQL injection, cross-site scripting and malicious scraper farms.', category: 'WAF & Mitigation', qps_capacity: 600000, ssl_grade: 'A+', cache_hit_pct: 88.00, status: 'active', display_order: 8 },
      { code: 'EDGE-DDOS-SYN', name: 'Autonomous SYN Flood & UDP Amplification Blackhole Sink', description: 'Volumetric DDoS mitigation pipeline scrubbing up to 1.2 Tbps of malicious network packets.', category: 'WAF & Mitigation', qps_capacity: 1200000, ssl_grade: 'A+', cache_hit_pct: 99.90, status: 'active', display_order: 9 },
      { code: 'EDGE-MICRO-PROXY', name: 'Micro-Frontend Dynamic Reverse Proxy & Route Transpiler', description: 'High-speed edge proxy routing frontend requests to independent micro-app bundles seamlessly.', category: 'Proxy & Gateway', qps_capacity: 150000, ssl_grade: 'A+', cache_hit_pct: 91.50, status: 'active', display_order: 10 },
      { code: 'EDGE-CUSTOM-DOMAINS', name: 'VIP Merchant Custom Domain CNAME White-Label Engine', description: 'Instant issuance of SSL certs and reverse proxy maps for merchant custom domains.', category: 'White-Label Domains', qps_capacity: 75000, ssl_grade: 'A+', cache_hit_pct: 93.00, status: 'active', display_order: 11 },
      { code: 'EDGE-TELEMETRY-RADAR', name: 'Global PoP Latency & TTFB Millisecond Telemetry Radar', description: 'Active synthetic probing measuring time-to-first-byte and uptime across all continent nodes.', category: 'Telemetry & Radar', qps_capacity: 500000, ssl_grade: 'A+', cache_hit_pct: 100.00, status: 'active', display_order: 12 },
    ];

    for (const item of domainItems) {
      await client.query(`
        INSERT INTO domain_edge_console_items (code, name, description, category, qps_capacity, ssl_grade, cache_hit_pct, status, display_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (code) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          category = EXCLUDED.category,
          qps_capacity = EXCLUDED.qps_capacity,
          ssl_grade = EXCLUDED.ssl_grade,
          cache_hit_pct = EXCLUDED.cache_hit_pct,
          status = EXCLUDED.status,
          display_order = EXCLUDED.display_order;
      `, [item.code, item.name, item.description, item.category, item.qps_capacity, item.ssl_grade, item.cache_hit_pct, item.status, item.display_order]);
    }

    // ==========================================
    // 3. CONSOLE 24: GAMIFICATION & REWARDS
    // ==========================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS gamification_rewards_console_items (
        id SERIAL PRIMARY KEY,
        code VARCHAR(64) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        multiplier_cap NUMERIC(6, 2) DEFAULT 5.00,
        total_participants INT DEFAULT 10000,
        reward_budget_fic NUMERIC(12, 2) DEFAULT 50000.00,
        status VARCHAR(32) DEFAULT 'active',
        display_order INT DEFAULT 1,
        asset_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS gamification_rewards_console_spawns (
        id SERIAL PRIMARY KEY,
        parent_console VARCHAR(64) DEFAULT 'gamification-rewards-console',
        sub_console_name VARCHAR(255) NOT NULL,
        slug VARCHAR(128) NOT NULL,
        endpoint VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        status VARCHAR(32) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    const gameItems = [
      { code: 'GAME-XP-MULTIPLIER', name: 'Dynamic Tiered XP Multiplier & Combo Velocity Engine', description: 'Calculates real-time XP accumulation rates based on active gaming combos, quests and loyalty badges.', category: 'XP & Progression', multiplier_cap: 10.00, total_participants: 840000, reward_budget_fic: 150000.00, status: 'active', display_order: 1 },
      { code: 'GAME-BADGE-MINT', name: 'Autonomous Sovereign On-Chain & In-App Badge Minter', description: 'Issues tamper-proof collectible badges celebrating user milestones, creator support and game wins.', category: 'Badges & Accolades', multiplier_cap: 1.00, total_participants: 620000, reward_budget_fic: 75000.00, status: 'active', display_order: 2 },
      { code: 'GAME-SEASON-QUEST', name: 'Quarterly Continental Quest Ladder & Battle Pass Matrix', description: 'Multi-stage gamified objectives across communities, games and shopping with progressive unlock tiers.', category: 'Seasonal Quests', multiplier_cap: 5.00, total_participants: 410000, reward_budget_fic: 300000.00, status: 'active', display_order: 3 },
      { code: 'GAME-STREAK-LOGIN', name: 'SuperVi Daily Login Streak & Milestone Multipliers', description: 'Encourages daily retention by compounding login rewards from day 1 to day 365 with bonus FIC drop chests.', category: 'Daily Streaks', multiplier_cap: 3.50, total_participants: 950000, reward_budget_fic: 200000.00, status: 'active', display_order: 4 },
      { code: 'GAME-LEADERBOARD-PVP', name: 'Six Heroes Real-Time Global PvP Tournament Ladder', description: 'Synchronized tournament standings and ELO rankings with instant prize pool distribution.', category: 'Competitive PvP', multiplier_cap: 15.00, total_participants: 320000, reward_budget_fic: 500000.00, status: 'active', display_order: 5 },
      { code: 'GAME-VOICE-UNLOCKS', name: 'SuperVi African Voice Line Unlockable Audio Stem Vault', description: 'Sound stem rewards unlocking exclusive warrior cheers, slang emotes and customized victory anthems.', category: 'Audio & Customization', multiplier_cap: 1.00, total_participants: 510000, reward_budget_fic: 50000.00, status: 'active', display_order: 6 },
      { code: 'GAME-COMMUNITY-GEMS', name: 'Community Contributor Gem Minting & Hall of Fame', description: 'Micro-rewards gifted to helpful forum answers, insightful blog posts and trending social videos.', category: 'Community Prestige', multiplier_cap: 2.00, total_participants: 180000, reward_budget_fic: 120000.00, status: 'active', display_order: 7 },
      { code: 'GAME-MERCHANT-CASHBACK', name: 'Commerce Gamified Cashback Roulette & Mystery Drops', description: 'Checkout gamification awarding random 5% to 50% purchase cashbacks on verified marketplace purchases.', category: 'Commerce Rewards', multiplier_cap: 4.00, total_participants: 390000, reward_budget_fic: 250000.00, status: 'active', display_order: 8 },
      { code: 'GAME-NYSC-SCHOLAR', name: 'NYSC SAED EduTech Top-Student Staking Scholarships', description: 'Academic achievement rewards granting tuition grants and micro-startup seed capital to outstanding corp members.', category: 'Academic Accolades', multiplier_cap: 1.00, total_participants: 25000, reward_budget_fic: 400000.00, status: 'active', display_order: 9 },
      { code: 'GAME-ANTI-CHEAT-AI', name: 'Anti-Bot Heuristic Telemetry & Sybil Farm Quarantine', description: 'Autonomous machine learning isolating click farms, auto-clickers and multi-accounting reward exploiters.', category: 'Integrity & Fair Play', multiplier_cap: 0.00, total_participants: 1200000, reward_budget_fic: 0.00, status: 'active', display_order: 10 },
      { code: 'GAME-NFT-TROPHY', name: 'Camus Enclave Cryptographically Sealed Genesis Trophies', description: 'Hardware-attested ultra-rare tournament trophies minted on-chain with verifiable immutable provenance.', category: 'Genesis Collectibles', multiplier_cap: 25.00, total_participants: 10000, reward_budget_fic: 1000000.00, status: 'active', display_order: 11 },
      { code: 'GAME-GUILD-CLANS', name: 'Pan-African Sovereign Guilds & Alliance War Chests', description: 'Team-based guild rankings where communities pool points to unlock communal infrastructure upgrades.', category: 'Guilds & Factions', multiplier_cap: 8.00, total_participants: 280000, reward_budget_fic: 600000.00, status: 'active', display_order: 12 },
    ];

    for (const item of gameItems) {
      await client.query(`
        INSERT INTO gamification_rewards_console_items (code, name, description, category, multiplier_cap, total_participants, reward_budget_fic, status, display_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (code) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          category = EXCLUDED.category,
          multiplier_cap = EXCLUDED.multiplier_cap,
          total_participants = EXCLUDED.total_participants,
          reward_budget_fic = EXCLUDED.reward_budget_fic,
          status = EXCLUDED.status,
          display_order = EXCLUDED.display_order;
      `, [item.code, item.name, item.description, item.category, item.multiplier_cap, item.total_participants, item.reward_budget_fic, item.status, item.display_order]);
    }

    await client.query('COMMIT');
    console.log('✅ Batch 4 Consoles (22, 23, 24) migration & data seeding completed successfully!');
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
