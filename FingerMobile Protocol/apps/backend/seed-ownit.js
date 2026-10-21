const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: 'password',
  database: 'fingermobile_platform_db'
});

const stores = [
  {
    name: 'Patek & Vacheron Red Carpet Salon',
    slug: 'haute-horlogerie-salon',
    store_type: 'branded_shopfront',
    curator_name: 'Henri de Montmirail, Master Horologist',
    pavilion_location: 'Pavilion A - Grand Horology Colonnade',
    cover_4k_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=90',
    video_trailer_4k_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    description: 'The private salon housing unattainable timepieces and grand complications. Every watch is verified by master horologists with SHA-256 cryptographic provenance.',
    authenticity_pledge: '100% Guaranteed Swiss Geneve Seal authenticity with micro-engraved protocol tamper hash.',
    rating: 5.0,
    is_verified: true
  },
  {
    name: 'Celebrity Diamond Vault & High Jewelry Stall',
    slug: 'celebrity-diamond-vault',
    store_type: 'celebrity_stall',
    curator_name: 'Amina Bello, International Gemologist',
    pavilion_location: 'Pavilion B - The Diamond Rotunda',
    cover_4k_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=90',
    video_trailer_4k_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    description: 'Red-carpet gala jewelry worn at world premieres and Cannes festivals. Features D-Flawless certified diamonds and rare gemstones.',
    authenticity_pledge: 'GIA & Gübelin double certified with physical laser inscription matching the digital protocol vault.',
    rating: 4.98,
    is_verified: true
  },
  {
    name: 'Monaco Sovereign Hypercar Pavilion',
    slug: 'monaco-hypercars',
    store_type: 'shop_within_shop',
    curator_name: 'Laurent Vaneck, Scuderia Connoisseur',
    pavilion_location: 'Pavilion C - The Velocity Atrium',
    cover_4k_url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=90',
    video_trailer_4k_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    description: 'Ultra-rare hypercars with delivery escrows coordinated directly through FingerMobile Protocol sovereign escrow accounts.',
    authenticity_pledge: 'Manufacturer origin chassis verification, single-owner collector provenance documentation.',
    rating: 4.99,
    is_verified: true
  },
  {
    name: 'Haute Couture Red-Carpet Atelier',
    slug: 'haute-couture-atelier',
    store_type: 'haute_atelier',
    curator_name: 'Elena Rostova, Paris Couture Guild',
    pavilion_location: 'Pavilion D - Fashion Walkway of Fame',
    cover_4k_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=90',
    video_trailer_4k_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    description: 'Hand-embroidered evening gowns and bespoke celebrity tuxedos designed exclusively for Oscar gala red carpets.',
    authenticity_pledge: 'Authenticated by Paris Couture Federation guild archive with digital thread verification.',
    rating: 4.96,
    is_verified: true
  }
];

const products = [
  {
    name: 'Grand Celestial Tourbillon Minute Repeater',
    brand: 'Patek Philippe Vault',
    category: 'Haute Horlogerie',
    description: '4K Ultra-HD Masterpiece. Hand-chiseled 18k white gold case with celestial sky chart complications showing sidereal time and phase of the moon. Only 3 examples produced worldwide.',
    price_usd: 3500000,
    price_fic: 350000,
    media_4k_urls: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=2048&q=95',
      'https://images.unsplash.com/photo-1547996160-71dfabbce5fa?auto=format&fit=crop&w=2048&q=95'
    ],
    video_showcase_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    authenticity_cert_number: 'OWNIT-PP-SKY-001',
    cryptographic_sha256: '0x9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d',
    provenance_history: [
      { year: 2024, event: 'Manufactured and Geneve Seal Certified', entity: 'Patek Philippe SA, Plan-les-Ouates' },
      { year: 2025, event: 'Private Exhibition at Only Watch Monaco', entity: 'Prince Albert II Foundation' },
      { year: 2026, event: 'Vaulted in FingerMobile Protocol Sovereign Custody', entity: 'FingerMobile Protocol OwnIt Vault' }
    ],
    serial_number: 'PP-6102R-014',
    rarity_level: 'Unique 1-of-3 Worldwide',
    celebrity_endorsement: 'Curated by Henri de Montmirail',
    stock: 1,
    likes: 342,
    dislikes: 2,
    rating: 4.99,
    poll_data: {
      question: 'Should this timepiece be released on cross-chain fractional ownership?',
      options: [
        { id: 1, text: 'Keep 1-of-1 Sovereign Ownership', votes: 184 },
        { id: 2, text: 'Issue 100 Protocol Fractions', votes: 158 }
      ]
    }
  },
  {
    name: 'The Pink Empress 22.4ct Vivid Pink Diamond Ring',
    brand: 'Graff High Jewelry',
    category: 'Fine Jewelry & Gems',
    description: 'Flawless Fancy Vivid Pink Type IIa Diamond set in platinum with shield-cut shoulder diamonds. Worn at the 83rd Venice Film Festival Gala.',
    price_usd: 14200000,
    price_fic: 1420000,
    media_4k_urls: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=2048&q=95',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2048&q=95'
    ],
    video_showcase_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    authenticity_cert_number: 'OWNIT-GRAFF-PINK-002',
    cryptographic_sha256: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    provenance_history: [
      { year: 2023, event: 'Unearthed in Argyle Mine & Cut by Laurence Graff', entity: 'Graff Diamonds London' },
      { year: 2025, event: 'Red-Carpet Debut at Venice Premiere', entity: 'Cannes Sovereign Jewel Trust' },
      { year: 2026, event: 'Transferred to OwnIt Vault', entity: 'FingerMobile Protocol' }
    ],
    serial_number: 'GIA-2248901234',
    rarity_level: 'Sole Specimen in Existence',
    celebrity_endorsement: 'Verified by Amina Bello',
    stock: 1,
    likes: 512,
    dislikes: 4,
    rating: 5.0,
    poll_data: {
      question: 'Preferred exhibition display venue:',
      options: [
        { id: 1, text: 'Dubai Red-Carpet Pavilion', votes: 290 },
        { id: 2, text: 'Monaco Yacht Gala Suite', votes: 222 }
      ]
    }
  },
  {
    name: 'Bugatti Bolide Sovereign Track Edition',
    brand: 'Bugatti Automobiles',
    category: 'Hypercars & Aviation',
    description: '1,825 bhp quad-turbo W16 engine with full carbon-monocoque chassis. Top speed exceeding 500 km/h with custom FingerMobile Protocol telemetry.',
    price_usd: 4800000,
    price_fic: 480000,
    media_4k_urls: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2048&q=95'
    ],
    video_showcase_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    authenticity_cert_number: 'OWNIT-BUGATTI-BOLIDE-003',
    cryptographic_sha256: '0x4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e',
    provenance_history: [
      { year: 2024, event: 'Factory Built in Molsheim Atelier', entity: 'Bugatti Automobiles S.A.S.' },
      { year: 2026, event: 'Delivered to OwnIt Monaco Pavilion', entity: 'FingerMobile Protocol Escrow' }
    ],
    serial_number: 'BOLIDE-CHASSIS-009',
    rarity_level: 'Limited to 40 Units Worldwide',
    celebrity_endorsement: 'Curated by Laurent Vaneck',
    stock: 1,
    likes: 670,
    dislikes: 8,
    rating: 4.98,
    poll_data: {
      question: 'Delivery preference for buyer:',
      options: [
        { id: 1, text: 'VIP Air Cargo to Private Airfield', votes: 412 },
        { id: 2, text: 'Delivery at Monaco Yacht Club Pavilion', votes: 258 }
      ]
    }
  }
];

async function run() {
  const storeMap = new Map();

  for (const store of stores) {
    const res = await pool.query(`
      INSERT INTO ownit_stores (
        name, slug, store_type, curator_name, pavilion_location,
        cover_4k_url, video_trailer_4k_url, description, authenticity_pledge,
        rating, is_verified, is_active, status, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, 'active', NOW())
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        rating = EXCLUDED.rating
      RETURNING id, slug;
    `, [
      store.name, store.slug, store.store_type, store.curator_name, store.pavilion_location,
      store.cover_4k_url, store.video_trailer_4k_url, store.description, store.authenticity_pledge,
      store.rating, store.is_verified
    ]);
    storeMap.set(store.slug, res.rows[0].id);
  }

  const p1StoreId = storeMap.get('haute-horlogerie-salon');
  const p2StoreId = storeMap.get('celebrity-diamond-vault');
  const p3StoreId = storeMap.get('monaco-hypercars');

  products[0].store_id = p1StoreId;
  products[1].store_id = p2StoreId;
  products[2].store_id = p3StoreId;

  for (const prod of products) {
    await pool.query(`
      INSERT INTO ownit_products (
        store_id, name, brand, category, description,
        price_usd, price_fic, media_4k_urls, video_showcase_url,
        authenticity_cert_number, cryptographic_sha256, provenance_history,
        serial_number, rarity_level, celebrity_endorsement,
        stock, likes, dislikes, rating, poll_data,
        is_active, status, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, true, 'active', NOW())
      ON CONFLICT (authenticity_cert_number) DO UPDATE SET
        name = EXCLUDED.name,
        price_usd = EXCLUDED.price_usd,
        price_fic = EXCLUDED.price_fic,
        likes = EXCLUDED.likes,
        dislikes = EXCLUDED.dislikes;
    `, [
      prod.store_id, prod.name, prod.brand, prod.category, prod.description,
      prod.price_usd, prod.price_fic, prod.media_4k_urls, prod.video_showcase_url,
      prod.authenticity_cert_number, prod.cryptographic_sha256, JSON.stringify(prod.provenance_history),
      prod.serial_number, prod.rarity_level, prod.celebrity_endorsement,
      prod.stock, prod.likes, prod.dislikes, prod.rating, JSON.stringify(prod.poll_data)
    ]);
  }

  console.log('Successfully seeded OwnIt luxury stores and 4K products!');
  await pool.end();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
