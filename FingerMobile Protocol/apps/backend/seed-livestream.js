const pool = require('./db');

async function seedLiveStream() {
  console.log('Seeding LiveStream tables into PostgreSQL...');

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS live_broadcast_tiers (
        tier_key VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        capacity_limit INT NOT NULL,
        monthly_cost_fic NUMERIC(15,2) DEFAULT 0.0,
        monthly_cost_gems INT DEFAULT 0,
        monetization_enabled BOOLEAN DEFAULT false,
        can_send_gifts BOOLEAN DEFAULT false,
        can_receive_gifts BOOLEAN DEFAULT false,
        can_send_coupons BOOLEAN DEFAULT false,
        can_receive_coupons BOOLEAN DEFAULT false,
        can_earn_rewards BOOLEAN DEFAULT false,
        allowed_products_scope VARCHAR(50) DEFAULT 'NONE',
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    const tiers = [
      {
        tier_key: 'FREE',
        name: 'Free Tier (Standard)',
        capacity_limit: 50,
        monthly_cost_fic: 0.0,
        monthly_cost_gems: 0,
        monetization_enabled: false,
        can_send_gifts: false,
        can_receive_gifts: false,
        can_send_coupons: false,
        can_receive_coupons: false,
        can_earn_rewards: false,
        allowed_products_scope: 'NONE',
        description: 'Limit: 20-50 Join Requests. Standard live WebRTC stream.'
      },
      {
        tier_key: 'PRO_2000',
        name: 'Pro Creator Tier',
        capacity_limit: 2000,
        monthly_cost_fic: 250.0,
        monthly_cost_gems: 500,
        monetization_enabled: true,
        can_send_gifts: true,
        can_receive_gifts: true,
        can_send_coupons: true,
        can_receive_coupons: true,
        can_earn_rewards: true,
        allowed_products_scope: 'LIMITED',
        description: 'Capacity: 2,000 participants. Monetized with FIC/Monthly Subscriptions and gifts.'
      },
      {
        tier_key: 'MASTER_200000',
        name: 'Sovereign Master Tier',
        capacity_limit: 200000,
        monthly_cost_fic: 1200.0,
        monthly_cost_gems: 2500,
        monetization_enabled: true,
        can_send_gifts: true,
        can_receive_gifts: true,
        can_send_coupons: true,
        can_receive_coupons: true,
        can_earn_rewards: true,
        allowed_products_scope: 'UNRESTRICTED',
        description: 'Capacity: 200,000 participants. Unrestricted gifting, coupon drops, and 4K WebRTC broadcast.'
      }
    ];

    for (const t of tiers) {
      await pool.query(
        `INSERT INTO live_broadcast_tiers
           (tier_key, name, capacity_limit, monthly_cost_fic, monthly_cost_gems, monetization_enabled, can_send_gifts, can_receive_gifts, can_send_coupons, can_receive_coupons, can_earn_rewards, allowed_products_scope, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT (tier_key) DO UPDATE SET
           name = EXCLUDED.name,
           capacity_limit = EXCLUDED.capacity_limit,
           monthly_cost_fic = EXCLUDED.monthly_cost_fic,
           monetization_enabled = EXCLUDED.monetization_enabled`,
        [
          t.tier_key, t.name, t.capacity_limit, t.monthly_cost_fic, t.monthly_cost_gems,
          t.monetization_enabled, t.can_send_gifts, t.can_receive_gifts, t.can_send_coupons,
          t.can_receive_coupons, t.can_earn_rewards, t.allowed_products_scope, t.description
        ]
      );
    }
    console.log(`Seeded ${tiers.length} live broadcast tiers.`);

    // Seed an active live session in live_streaming_sessions
    await pool.query(`
      INSERT INTO live_streaming_sessions
        (room_code, title, stream_type, paywall_fee_fic, max_resolution, is_live, is_e2ee_encrypted, peak_concurrent_viewers)
      VALUES 
        ('SOVEREIGN-KEYNOTE-2026', 'FingerMobile 2026 Keynote & Ecosystem Reveal', 'public', 0.00, '4K', true, true, 8420)
      ON CONFLICT (room_code) DO UPDATE SET
        title = EXCLUDED.title,
        is_live = true;
    `);
    console.log('Seeded flagship live stream session.');

    console.log('LiveStream seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding LiveStream:', err);
    process.exit(1);
  }
}

seedLiveStream();
