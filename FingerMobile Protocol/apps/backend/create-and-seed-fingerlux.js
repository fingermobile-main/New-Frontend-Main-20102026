/**
 * create-and-seed-fingerlux.js
 * Seeds fingerlux_items with luxury assets and sets up services
 */
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: 'password',
  database: 'fingermobile_platform_db'
});

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const rolex = await client.query('SELECT id FROM fingerlux_brands WHERE slug = \'rolex\' LIMIT 1');
    const hermes = await client.query('SELECT id FROM fingerlux_brands WHERE slug = \'hermes\' LIMIT 1');
    const chanel = await client.query('SELECT id FROM fingerlux_brands WHERE slug = \'chanel\' LIMIT 1');

    const watches = await client.query('SELECT id FROM fingerlux_categories WHERE slug = \'watches\' LIMIT 1');
    const handbags = await client.query('SELECT id FROM fingerlux_categories WHERE slug = \'handbags\' LIMIT 1');

    const userRes = await client.query('SELECT id FROM users LIMIT 1');
    const sellerId = userRes.rows[0]?.id || '00000000-0000-0000-0000-000000000000';

    const items = [
      {
        title: 'Rolex Cosmograph Daytona Ice Blue Platinum',
        slug: 'rolex-daytona-ice-blue-platinum',
        description: 'Iconic Oyster Perpetual Cosmograph Daytona in 950 platinum with an ice-blue dial and chestnut brown Cerachrom bezel.',
        price: 98500.00,
        originalPrice: 110000.00,
        currency: 'USD',
        categoryId: watches.rows[0]?.id,
        brandId: rolex.rows[0]?.id,
        condition: 'new',
        sku: 'FLUX-RLX-001',
        coverImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        images: JSON.stringify(['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'])
      },
      {
        title: 'Hermès Birkin 30 Porosus Crocodile Noir',
        slug: 'hermes-birkin-30-porosus-crocodile-noir',
        description: 'Rare handcrafted Birkin 30 in shiny Porosus Crocodile with palladium hardware and clochette lock.',
        price: 74200.00,
        originalPrice: 85000.00,
        currency: 'USD',
        categoryId: handbags.rows[0]?.id,
        brandId: hermes.rows[0]?.id,
        condition: 'like_new',
        sku: 'FLUX-HER-002',
        coverImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
        images: JSON.stringify(['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800'])
      },
      {
        title: 'Chanel Premiere Camellia Skeleton Watch',
        slug: 'chanel-premiere-camellia-skeleton-watch',
        description: 'Exquisite 18K white gold watch with skeleton movement depicting Gabrielle Chanel favorite Camellia flower set with brilliant diamonds.',
        price: 62000.00,
        originalPrice: 68000.00,
        currency: 'USD',
        categoryId: watches.rows[0]?.id,
        brandId: chanel.rows[0]?.id,
        condition: 'new',
        sku: 'FLUX-CHN-003',
        coverImage: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800',
        images: JSON.stringify(['https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800'])
      }
    ];

    for (const item of items) {
      if (item.categoryId && item.brandId) {
        await client.query(`
          INSERT INTO fingerlux_items (
            title, slug, description, price, original_price, currency,
            category_id, brand_id, condition, sku, cover_image, images,
            seller_id, seller_type, status, visibility, featured, editor_pick
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb,
            $13, 'boutique', 'available', 'public', true, true
          )
          ON CONFLICT (slug) DO UPDATE SET
            price = EXCLUDED.price,
            status = 'available';
        `, [
          item.title, item.slug, item.description, item.price, item.originalPrice, item.currency,
          item.categoryId, item.brandId, item.condition, item.sku, item.coverImage, item.images,
          sellerId
        ]);
      }
    }

    await client.query('COMMIT');
    console.log('✅ Successfully seeded fingerlux_items!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Failed seeding fingerlux_items:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
