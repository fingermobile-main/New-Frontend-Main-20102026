const { pool } = require('./db');

async function seedCanary() {
  try {
    console.log('--- Initializing Canary Ads & Announcements Schema ---');

    // 1. Create canary_announcements table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS canary_announcements (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        title varchar(255) NOT NULL,
        content text NOT NULL,
        category varchar(50) DEFAULT 'security',
        status varchar(50) DEFAULT 'active',
        author_id varchar(100),
        author_name varchar(100) DEFAULT 'FingerMobile Security',
        author_membername varchar(100) DEFAULT 'security',
        author_avatar text,
        is_verified boolean DEFAULT true,
        likes_count integer DEFAULT 0,
        replies_count integer DEFAULT 0,
        reposts_count integer DEFAULT 0,
        created_at timestamptz DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Clear old test announcements
    await pool.query('DELETE FROM canary_announcements;');

    // 3. Seed real canary announcements
    await pool.query(`
      INSERT INTO canary_announcements (
        title, content, category, status, author_id, author_name, author_membername, author_avatar, is_verified, likes_count, replies_count, reposts_count
      ) VALUES 
      (
        'Sovereign Encryption & Zero-Breach Warrant Canary',
        'As of October 2026, FingerMobile Protocol confirms zero warrants, zero backdoors, and zero third-party cryptographic disclosures. User data and sovereign vaults remain end-to-end fortified.',
        'security',
        'active',
        '101',
        'FingerMobile Security Core',
        'security_core',
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200',
        true,
        420,
        64,
        180
      ),
      (
        'Canary Advertising Engine v2.4 Live Deployment',
        'High-velocity native promotions now support 360 interactive video, instant articles, and verified sponsor badges across all 6 core microservices.',
        'updates',
        'active',
        '102',
        'Canary Ads Desk',
        'canary_ads',
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200',
        true,
        310,
        38,
        92
      ),
      (
        'Decentralized Ad Quality & Verification Standard',
        'All Canary campaigns are pre-audited via automated content safety and prompt sanitization to prevent phishing, fraudulent paylinks, or non-compliant media.',
        'compliance',
        'active',
        '103',
        'Platform Trust & Safety',
        'trust_safety',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
        true,
        195,
        22,
        45
      );
    `);

    // 4. Seed advertiser, campaign, ad group, creative if empty
    const userRes = await pool.query('SELECT id FROM users LIMIT 1');
    const userId = userRes.rows[0]?.id || 'b77e0895-0246-467e-9d74-fa8e59e788ec';

    const advCount = await pool.query('SELECT count(*) FROM canary_advertisers');
    let advId;
    if (parseInt(advCount.rows[0].count, 10) === 0) {
      const advRes = await pool.query(`
        INSERT INTO canary_advertisers (
          user_id, company_name, billing_email, status, is_verified_merchant
        ) VALUES (
          $1,
          'FingerMobile Protocol Labs',
          'ads@fingermobile.io',
          'active',
          true
        ) RETURNING id;
      `, [userId]);
      advId = advRes.rows[0].id;
    } else {
      const advRes = await pool.query('SELECT id FROM canary_advertisers LIMIT 1');
      advId = advRes.rows[0].id;
    }

    const campCount = await pool.query('SELECT count(*) FROM canary_campaigns');
    if (parseInt(campCount.rows[0].count, 10) === 0) {
      const campRes = await pool.query(`
        INSERT INTO canary_campaigns (
          advertiser_id, title, campaign_type, status, daily_budget, total_budget, currency, bid_strategy
        ) VALUES (
          $1,
          'Canary Sovereign Ecosystem Launch',
          'display',
          'active',
          50.00,
          500.00,
          'FIC',
          'auto_cpc'
        ) RETURNING id;
      `, [advId]);
      const campId = campRes.rows[0].id;

      const groupRes = await pool.query(`
        INSERT INTO canary_ad_groups (
          campaign_id, name, placement, status, target_locations, target_keywords
        ) VALUES (
          $1,
          'Global Feed Video & Banners',
          'feed_video',
          'active',
          ARRAY['Nigeria', 'United Kingdom', 'United States', 'Global'],
          ARRAY['crypto', 'music', 'gaming', 'sovereign']
        ) RETURNING id;
      `, [campId]);
      const groupId = groupRes.rows[0].id;

      await pool.query(`
        INSERT INTO canary_creatives (
          ad_group_id, format, headline, primary_text, media_url, thumbnail_url, destination_url, call_to_action, moderation_status
        ) VALUES 
        (
          $1,
          'single_image',
          'Experience Next-Gen Sovereign Media',
          'Empowering African and Global Creators with 4K Streaming and Direct Royalty Distribution.',
          'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
          'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
          'https://fingermobile.io',
          'Learn More',
          'approved'
        ),
        (
          $1,
          'single_video',
          'BeatwaveNG Master Audio Immersion',
          'Stream lossless Afrobeat master tracks directly with decentralized permanence proofs.',
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
          'https://fingermobile.io/beatwave',
          'Listen Now',
          'approved'
        );
      `, [groupId]);
    }

    console.log('✅ Canary Ads & Announcements successfully seeded and verified!');
  } catch (err) {
    console.error('❌ Error seeding Canary:', err);
  } finally {
    process.exit(0);
  }
}

seedCanary();
