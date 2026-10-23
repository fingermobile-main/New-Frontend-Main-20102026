const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: 'password',
  database: 'fingermobile_platform_db'
});

async function run() {
  const usersRes = await pool.query('SELECT id, username FROM users LIMIT 3');
  if (usersRes.rows.length === 0) {
    console.error('No users found to own storefronts');
    process.exit(1);
  }

  const user1 = usersRes.rows[0].id;
  const user2 = usersRes.rows[1].id;
  const user3 = usersRes.rows[2].id;

  const stores = [
    {
      owner_id: user1,
      name: 'Alex Johnson Audio Labs',
      slug: 'alex-johnson-audio',
      description: 'Lossless studio master stems, custom synthesizer presets, and live sound kits designed for high-caliber sovereign producers.',
      tagline: 'Precision 24-Bit Studio Master Audio Packs',
      business_type: 'boutique',
      verification_badge: 'verified',
      is_verified: true,
      rating: 4.95,
      follower_count: 1420,
      product_count: 12,
      cover_image_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
      logo_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80'
    },
    {
      owner_id: user2,
      name: 'Afrobeat Visuals & Sound Lab',
      slug: 'afrobeat-visuals-sound',
      description: 'Authentic African percussions, live guitar riffs, high-resolution visual loop packs, and concert stage backdrop visualizers.',
      tagline: 'Pure Rhythmic Heritage & Modern Concert Audio',
      business_type: 'brand',
      verification_badge: 'premium',
      is_verified: true,
      rating: 4.98,
      follower_count: 2890,
      product_count: 18,
      cover_image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      logo_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80'
    },
    {
      owner_id: user3,
      name: 'Cybernetic Design Studio',
      slug: 'cybernetic-design-studio',
      description: '3D spatial motion graphics, UI design system templates, and holographic digital art packages.',
      tagline: 'Futuristic 3D Assets & Spatial UI Kits',
      business_type: 'individual',
      verification_badge: 'basic',
      is_verified: true,
      rating: 4.88,
      follower_count: 980,
      product_count: 8,
      cover_image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      logo_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&q=80'
    }
  ];

  for (const s of stores) {
    const storeRes = await pool.query(`
      INSERT INTO storefronts (
        owner_id, name, slug, description, tagline, business_type,
        verification_badge, is_verified, is_active, rating, follower_count,
        product_count, cover_image_url, logo_url, banner_url, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, $9, $10, $11, $12, $13, $12, NOW(), NOW())
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        rating = EXCLUDED.rating
      RETURNING id, slug;
    `, [
      s.owner_id, s.name, s.slug, s.description, s.tagline, s.business_type,
      s.verification_badge, s.is_verified, s.rating, s.follower_count,
      s.product_count, s.cover_image_url, s.logo_url
    ]);

    const storeId = storeRes.rows[0].id;

    // Seed products for this store
    await pool.query(`
      INSERT INTO storefront_products (
        storefront_id, name, slug, description, price, currency,
        category, status, visibility, goods_type, images, created_at, updated_at
      )
      VALUES 
        ($1, 'Master Stem Pack Vol. 1', 'master-stem-pack-1-' || substring(md5(random()::text) from 1 for 6), 'Studio-recorded 24-bit 96kHz lossless multitrack stems.', 45.00, 'USD', 'Music & Audio', 'active', 'visible', 'digital', '["https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80"]'::jsonb, NOW(), NOW()),
        ($1, 'Lofi Chillhop Soundbank', 'lofi-chillhop-soundbank-' || substring(md5(random()::text) from 1 for 6), 'Tape-saturated drum samples and custom Serum presets.', 25.00, 'USD', 'Music & Audio', 'active', 'visible', 'digital', '["https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80"]'::jsonb, NOW(), NOW())
      ON CONFLICT DO NOTHING;
    `, [storeId]);
  }

  console.log('Seeded storefronts and storefront_products successfully!');
  await pool.end();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
