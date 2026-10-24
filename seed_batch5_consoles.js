/**
 * Seed Batch 5 Consoles in PostgreSQL:
 * 1. comms_voip_console_items & comms_voip_console_spawns (Communications VoIP & WebRTC Relay Console)
 * 2. lumina_gallery_console_items & lumina_gallery_console_spawns (Lumina Digital Collectibles & Provenance Console)
 * 3. platform_subscription_models & subscription_models_console_spawns (Subscription Models & Monetization Tiers Console)
 */

const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.POSTGRES_HOST || '127.0.0.1',
  port: parseInt(process.env.POSTGRES_PORT || '5433', 10),
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: 'fingermobile_platform_db'
});

async function seedBatch5() {
  const client = await pool.connect();
  try {
    console.log('[Batch 5] Initializing database tables...');
    await client.query('BEGIN');

    // 1. VoIP Table updates
    await client.query(`
      ALTER TABLE comms_voip_console_items ADD COLUMN IF NOT EXISTS description TEXT;
      ALTER TABLE comms_voip_console_items ADD COLUMN IF NOT EXISTS asset_url TEXT;
    `);

    // 2. Lumina Gallery Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS lumina_gallery_console_items (
        id SERIAL PRIMARY KEY,
        code VARCHAR(64) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        total_minted INTEGER DEFAULT 1000,
        floor_price_fic NUMERIC(15,2) DEFAULT 250.00,
        royalty_pct NUMERIC(5,2) DEFAULT 7.50,
        status VARCHAR(32) DEFAULT 'active',
        display_order INTEGER DEFAULT 1,
        asset_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS lumina_gallery_console_spawns (
        id SERIAL PRIMARY KEY,
        parent_console VARCHAR(64) DEFAULT 'lumina_gallery_console',
        sub_console_name VARCHAR(255) NOT NULL,
        slug VARCHAR(128) UNIQUE NOT NULL,
        endpoint VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        status VARCHAR(32) DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 3. Platform Subscription Models Spawns
    await client.query(`
      CREATE TABLE IF NOT EXISTS subscription_models_console_spawns (
        id SERIAL PRIMARY KEY,
        parent_console VARCHAR(64) DEFAULT 'subscription_models_console',
        sub_console_name VARCHAR(255) NOT NULL,
        slug VARCHAR(128) UNIQUE NOT NULL,
        endpoint VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        status VARCHAR(32) DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Seed Lumina Gallery items
    await client.query(`DELETE FROM lumina_gallery_console_items`);
    const luminaItems = [
      ['LUMINA-01', 'Nok Terracotta Sovereign Series', 'Digital preservation of ancient Nigerian sculptures with 3D photogrammetry', 'Historical Artifacts', 500, 1250.00, 10.0, 1],
      ['LUMINA-02', 'Benin Bronze Digital Provenance', 'Verified digital lineage and immutable cultural heritage metadata on-chain', 'Historical Artifacts', 250, 3500.00, 12.5, 2],
      ['LUMINA-03', 'Afro-Futurism Masterworks 2026', 'Contemporary digital generative art by leading Pan-African creators', 'Digital Art & Generative', 1200, 450.00, 8.0, 3],
      ['LUMINA-04', 'Eyo Masquerade Sonic Token', 'Multisensory soundscapes and motion captured ritual dance collectibles', 'Music & Sonic Artifacts', 2000, 150.00, 5.0, 4],
      ['LUMINA-05', 'Royal Kente Weave Geometry', 'Algorithmic mathematical recreation of traditional Ashanti royal patterns', 'Traditional Textiles', 800, 600.00, 7.5, 5],
      ['LUMINA-06', 'Lagos Street Photography Vault', 'Rare high-resolution documentary captures of urban African life', 'Photography & Documentary', 1500, 200.00, 6.0, 6],
      ['LUMINA-07', 'SuperVi Avatar Rare Wearables', 'Interoperable 3D gaming skins and sovereign armor for SuperVi metaverses', 'Gaming & Metaverse', 5000, 85.00, 5.0, 7],
      ['LUMINA-08', 'African Architecture Blueprint NFTs', 'Sustainable indigenous engineering and modern vernacular designs', 'Architecture & Design', 300, 1800.00, 10.0, 8],
      ['LUMINA-09', 'Nollywood Classic Cinema Stills', 'Restored film frames from golden age African cinematic masterpieces', 'Cinema & Entertainment', 1000, 320.00, 7.0, 9],
      ['LUMINA-10', 'Sahara Caravan Astronomical Maps', 'Ancient celestial navigation charts digitized with interactive star overlays', 'Science & Astronomy', 400, 950.00, 9.0, 10],
      ['LUMINA-11', 'Calabash Carving 3D Holograms', 'Intricate wood and gourd engravings captured for spatial VR headsets', 'Sculpture & 3D Objects', 600, 500.00, 8.5, 11],
      ['LUMINA-12', 'Pan-African Sovereign Anthem Editions', 'Original orchestral recordings pressed to immutable digital vinyls', 'Music & Sonic Artifacts', 150, 5000.00, 15.0, 12]
    ];
    for (const item of luminaItems) {
      await client.query(`
        INSERT INTO lumina_gallery_console_items (code, name, description, category, total_minted, floor_price_fic, royalty_pct, display_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, item);
    }

    // Seed platform_subscription_models
    await client.query(`DELETE FROM platform_subscription_models`);
    const subModels = [
      ['sub_platform_free', 'Sovereign Explorer (Free Tier)', 'platform', 0, 0, 0, 0, true, 'Free Forever', 'Basic social discovery, standard P2P encrypted messaging, and free entry-level vault.', '["P2P End-to-End Chat", "Public Discover Feed", "100 MB Vault Storage"]', 85000, 0, 1],
      ['sub_platform_pro', 'Sovereign Creator Pro', 'platform', 250, 2500, 5000, 50000, false, 'Most Popular', 'High-res audio/video publishing, unthrottled storage, and zero-fee marketplace trading.', '["Unthrottled Uploads", "FLAC 24-bit Audio", "Zero Marketplace Fees", "Direct Fan Tipping"]', 14200, 3550000, 2],
      ['sub_platform_citadel', 'Citadel Enterprise Sovereign', 'platform', 2500, 25000, 50000, 500000, false, 'Institutional', 'Dedicated HSM enclave, customized governance pipelines, and unlimited sub-consoles.', '["Dedicated HSM Vault", "Unlimited Sub-Consoles", "Custom SLA Triage", "Audited Financials"]', 1850, 46250000, 3],
      ['sub_chan_vip', 'AfroBeats Producer VIP Pass', 'creator_channel', 150, 1500, 3000, 30000, false, 'Creator Pass', 'Exclusive multitrack stem downloads, direct mixing feedback, and masterclass access.', '["Multitrack Stems", "SoundOcean Archive Access", "Direct Producer Chat"]', 5600, 840000, 4],
      ['sub_gems_deal', 'Curated Gems Daily Drop', 'gems_broadcast', 100, 1000, 2000, 20000, false, 'Premium Feed', 'Private analytical signals, verified arbitrage opportunities, and early deals feed.', '["Arbitrage Signals", "Early Deal Notifications", "Verified Merchant Reviews"]', 9400, 940000, 5],
      ['sub_wall_acad', 'NYSC & Tech Fellowship Guild', 'content_paywall', 500, 5000, 10000, 100000, false, 'Education', 'Certified full-stack engineering, cloud architecture, and corporate job placement.', '["Certified Curriculum", "Interactive IDE Sandboxes", "Corporate Job Referrals"]', 3100, 1550000, 6]
    ];
    for (const sub of subModels) {
      await client.query(`
        INSERT INTO platform_subscription_models (
          id, name, category, monthly_fic, annual_fic, monthly_ngn, annual_ngn, is_free_tier,
          badge, description, features, subscriber_count, target_annual_volume_fic, sort_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12, $13, $14)
      `, sub);
    }

    await client.query('COMMIT');
    console.log('[Batch 5] Seed completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Batch 5] Seed error:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seedBatch5();
