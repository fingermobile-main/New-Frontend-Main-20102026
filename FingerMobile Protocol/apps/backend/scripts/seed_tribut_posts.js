/**
 * Seed script for Tribut showcase pins & boards in PostgreSQL
 */
const { pool } = require('../db');

const SEED_PINS = [
  {
    title: 'Minimalist Smart Studio - Ikoyi Waterfront',
    caption: 'Curated 2:3 vertical architectural layout featuring bio-climatic cross ventilation, automated smart louvers, and bespoke African timber finishes.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop',
    category: 'architecture',
    boardName: 'Smart Home Lagos 2026',
    priority: 'high',
    aspectRatio: '2:3',
    uploaderName: 'Adeola Sowande',
    uploaderHandle: '@adeola_arch',
    guardianQualityScore: 98.4,
    tags: ['architecture', 'minimalism', 'ikoyi', 'smart-home'],
    colorPalette: ['#1e293b', '#e2e8f0', '#0ea5e9'],
    displayOrder: 1
  },
  {
    title: 'Adire Indigo Silk Kimono - SS26 Runway',
    caption: 'Hand-dyed organic Abeokuta indigo on pure mulberry silk. Handcrafted geometric patterns celebrating Yoruba cosmic mythology.',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=400&auto=format&fit=crop',
    category: 'fashion',
    boardName: 'Lagos Fashion Week 2026',
    priority: 'high',
    aspectRatio: '2:3',
    uploaderName: 'Folake Kuti',
    uploaderHandle: '@folake_couture',
    guardianQualityScore: 97.8,
    tags: ['adire', 'fashion', 'indigo', 'sustainable'],
    colorPalette: ['#1e3a8a', '#172554', '#f8fafc'],
    displayOrder: 2
  },
  {
    title: 'Sovereign Biophilic Penthouse Living Room',
    caption: 'Integrated vertical hydroponic wall, terra-cotta cooling conduits, and low-energy circadian LED lighting.',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=400&auto=format&fit=crop',
    category: 'interior',
    boardName: 'Biophilic Interior Living',
    priority: 'high',
    aspectRatio: '2:3',
    uploaderName: 'Tunde Bakare',
    uploaderHandle: '@tunde_design',
    guardianQualityScore: 96.5,
    tags: ['interior', 'biophilic', 'lighting', 'penthouse'],
    colorPalette: ['#14532d', '#fef3c7', '#334155'],
    displayOrder: 3
  },
  {
    title: 'Neural Audio Synthesizer Hardware Enclosure',
    caption: 'Custom CNC-machined recycled anodized aluminum chassis for low-latency DSP neural audio synthesis.',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop',
    category: 'tech',
    boardName: 'Hardware Synthesizers & Sound',
    priority: 'medium',
    aspectRatio: '2:3',
    uploaderName: 'Chidi Okonkwo',
    uploaderHandle: '@chidi_synth',
    guardianQualityScore: 95.9,
    tags: ['tech', 'audio', 'synthesizer', 'hardware'],
    colorPalette: ['#0f172a', '#38bdf8', '#64748b'],
    displayOrder: 4
  },
  {
    title: 'Bronze & Obsidian Sculpture - The Ancestral Gate',
    caption: 'Lost-wax casting combined with modern parametric modeling, paying homage to the ancient Kingdom of Benin guild of bronze casters.',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=400&auto=format&fit=crop',
    category: 'art',
    boardName: 'Ancestral Futurism Art',
    priority: 'high',
    aspectRatio: '2:3',
    uploaderName: 'Ngozi Eze',
    uploaderHandle: '@ngozi_sculpts',
    guardianQualityScore: 99.1,
    tags: ['art', 'sculpture', 'benin', 'bronze'],
    colorPalette: ['#78350f', '#d97706', '#1c1917'],
    displayOrder: 5
  },
  {
    title: 'Holistic Moringa & Baobab Elixir Formulation',
    caption: 'Cold-pressed wild-harvested baobab oil and micronized moringa leaf extract for cellular revitalization.',
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-25f385c7e3f8?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1608248597359-25f385c7e3f8?q=80&w=400&auto=format&fit=crop',
    category: 'wellness',
    boardName: 'Indigenous Wellness & Botanicals',
    priority: 'medium',
    aspectRatio: '2:3',
    uploaderName: 'Dr. Amina Bello',
    uploaderHandle: '@amina_herbals',
    guardianQualityScore: 94.7,
    tags: ['wellness', 'botanicals', 'moringa', 'health'],
    colorPalette: ['#166534', '#fef9c3', '#475569'],
    displayOrder: 6
  },
  {
    title: 'Solar-Powered Kinetic Pavilion - Abuja Central',
    caption: 'Tensile photovoltaic canopy generating 45kW clean energy while providing public urban shade in central Abuja.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=400&auto=format&fit=crop',
    category: 'architecture',
    boardName: 'Solar Urbanism Nigeria',
    priority: 'high',
    aspectRatio: '2:3',
    uploaderName: 'Ibrahim Danjuma',
    uploaderHandle: '@ibrahim_d',
    guardianQualityScore: 97.2,
    tags: ['architecture', 'solar', 'urbanism', 'abuja'],
    colorPalette: ['#0369a1', '#f59e0b', '#0f172a'],
    displayOrder: 7
  },
  {
    title: 'Asymmetric Aso-Oke Evening Gown',
    caption: 'Handwoven metallized gold thread interwoven with traditional crimson cotton aza. Tailored for state banquets and gala galas.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop',
    category: 'fashion',
    boardName: 'Haute Couture West Africa',
    priority: 'high',
    aspectRatio: '2:3',
    uploaderName: 'Yewande Balogun',
    uploaderHandle: '@yewande_b',
    guardianQualityScore: 98.6,
    tags: ['aso-oke', 'couture', 'fashion', 'gold'],
    colorPalette: ['#991b1b', '#fbbf24', '#18181b'],
    displayOrder: 8
  }
];

const SEED_BOARDS = [
  {
    title: 'Smart Home Lagos 2026',
    description: 'Eco-conscious residential concepts and low-energy IoT devices for metropolitan Lagos.',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    privacy: 'public',
    pinCount: 12
  },
  {
    title: 'Lagos Fashion Week 2026',
    description: 'Innovative West African textiles, modern Adire, Aso-Oke, and sustainable luxury lookbooks.',
    coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    privacy: 'public',
    pinCount: 18
  },
  {
    title: 'Biophilic Interior Living',
    description: 'Harmonizing nature, living greenery, natural stone, and modern smart amenities.',
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
    privacy: 'public',
    pinCount: 9
  },
  {
    title: 'Hardware Synthesizers & Sound',
    description: 'Analog and digital hardware musical instruments engineered for African polyrhythms.',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
    privacy: 'public',
    pinCount: 6
  }
];

async function seed() {
  const userId = '00000000-0000-0000-0000-000000000001';

  // Seed project boards
  for (const b of SEED_BOARDS) {
    const existing = await pool.query('SELECT id FROM tribut_project_boards WHERE title = $1', [b.title]);
    if (existing.rows.length === 0) {
      await pool.query(`
        INSERT INTO tribut_project_boards (user_id, title, description, cover_image, privacy, pin_count, moderation_status)
        VALUES ($1, $2, $3, $4, $5, $6, 'active');
      `, [userId, b.title, b.description, b.coverImage, b.privacy, b.pinCount]);
    }
  }

  // Seed pins
  for (const p of SEED_PINS) {
    const existing = await pool.query('SELECT id FROM tribut_posts WHERE title = $1', [p.title]);
    if (existing.rows.length === 0) {
      await pool.query(`
        INSERT INTO tribut_posts (
          user_id, title, caption, image_url, thumbnail_url, category, aspect_ratio,
          dimensions, tags, status, is_pinned_to_gallery, is_pinned_to_tribut, board_name,
          priority, uploader_name, uploader_handle, guardian_quality_score, color_palette,
          display_order, is_censored, comments_paused
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, 'published', true, true, $10,
          $11, $12, $13, $14, $15,
          $16, false, false
        );
      `, [
        userId, p.title, p.caption, p.imageUrl, p.thumbnailUrl, p.category, p.aspectRatio,
        JSON.stringify({ width: 1200, height: 1800 }), JSON.stringify(p.tags), p.boardName,
        p.priority, p.uploaderName, p.uploaderHandle, p.guardianQualityScore, JSON.stringify(p.colorPalette),
        p.displayOrder
      ]);
    }
  }

  const countPins = await pool.query('SELECT count(*) FROM tribut_posts WHERE status != \'deleted\';');
  const countBoards = await pool.query('SELECT count(*) FROM tribut_project_boards;');
  console.log(`Seeding complete. tribut_posts: ${countPins.rows[0].count}, tribut_project_boards: ${countBoards.rows[0].count}`);
}

seed().then(() => process.exit(0)).catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
