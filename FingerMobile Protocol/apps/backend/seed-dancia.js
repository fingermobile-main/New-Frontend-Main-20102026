const pool = require('./db');

async function seedDancia() {
  console.log('Seeding Dancia-4Tv data into PostgreSQL...');

  try {
    // 1. Channels
    const channels = [
      {
        id: 'dancia-tv-1',
        name: 'Dancia Live Cinema HD',
        description: '24/7 Premium cinematic broadcast featuring blockbuster films and original series.',
        stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        is_active: true,
        moderation_status: 'active'
      },
      {
        id: 'dancia-tv-2',
        name: 'AfroCinema 4K',
        description: 'The premier destination for Nollywood, African cinema, and international festival winners.',
        stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        is_active: true,
        moderation_status: 'active'
      },
      {
        id: 'dancia-tv-3',
        name: 'Global Sound & Visual Beats',
        description: 'Music videos, live concert broadcasts, and musical performances in Dolby Atmos.',
        stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        is_active: true,
        moderation_status: 'active'
      }
    ];

    for (const c of channels) {
      await pool.query(
        `INSERT INTO dancia_channels (id, name, description, stream_url, is_active, moderation_status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           stream_url = EXCLUDED.stream_url,
           is_active = EXCLUDED.is_active,
           moderation_status = EXCLUDED.moderation_status,
           updated_at = NOW()`,
        [c.id, c.name, c.description, c.stream_url, c.is_active, c.moderation_status]
      );
    }
    console.log('Seeded 3 Dancia channels.');

    // 2. Subscription Plans
    const plans = [
      {
        id: 'plan-free',
        name: 'Dancia Free Pass',
        description: 'Ad-supported 720p streaming across all connected mobile and web platforms.',
        price: 0,
        features: JSON.stringify(['Ad-supported streaming', '720p HD resolution', 'Stereo sound', 'Live TV channels'])
      },
      {
        id: 'plan-pro',
        name: 'Dancia Cinema VIP',
        description: '4K HDR cinema, Dolby Atmos, commercial-free streaming and offline downloads.',
        price: 9.99,
        features: JSON.stringify(['4K Ultra HD & HDR', 'Dolby Atmos Spatial Audio', 'Commercial-free experience', 'Unlimited Offline Downloads', '4 Simultaneous Streams'])
      },
      {
        id: 'plan-sovereign',
        name: 'Dancia Sovereign Annual Pass',
        description: 'All-inclusive annual pass including festival premieres, VIP live chats, and studio drops.',
        price: 89.99,
        features: JSON.stringify(['All VIP Benefits included', 'Exclusive Early Access Releases', 'Virtual Red Carpet Live Q&As', 'VIP Badge & FIC Token Perks', 'Priority Customer Concierge'])
      }
    ];

    for (const p of plans) {
      await pool.query(
        `INSERT INTO dancia_subscription_plans (id, name, description, price, features, is_active, moderation_status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, true, 'active', NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           price = EXCLUDED.price,
           features = EXCLUDED.features,
           is_active = true,
           moderation_status = 'active',
           updated_at = NOW()`,
        [p.id, p.name, p.description, p.price, p.features]
      );
    }
    console.log('Seeded 3 Dancia subscription plans.');

    // 3. Videos
    const videos = [
      {
        id: 'video-svod-001',
        title: 'The Sovereign Throne: Crown of Fire',
        description: 'A high-stakes royal succession drama set in modern Lagos and ancient kingdom lines.',
        genre: 'Drama',
        stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c7a5c1?auto=format&fit=crop&w=800&q=85',
        duration_seconds: 8520,
        resolution: '4K Ultra HD',
        views: 284200,
        likes: 19400,
        iarc_rating: 'PG-13',
        creator: 'Kemi Adetiba',
        regional_category: 'Nollywood',
        source_type: 'studio_vod'
      },
      {
        id: 'video-svod-002',
        title: 'Aetheris: Vanguard of Tomorrow',
        description: 'When a quantum anomaly fractures global defenses, elite planetary guardians unite to defend Earth.',
        genre: 'Action',
        stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=85',
        duration_seconds: 9360,
        resolution: '4K Ultra HD',
        views: 541000,
        likes: 42100,
        iarc_rating: 'PG-13',
        creator: 'Christopher Nolan',
        regional_category: 'Hollywood',
        source_type: 'studio_vod'
      },
      {
        id: 'video-svod-003',
        title: 'Seoul Protocol: Cyber Nemesis',
        description: 'A cybersecurity detective uncovers a rogue quantum AI operating inside the Seoul high-frequency financial exchange.',
        genre: 'Crime',
        stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=85',
        duration_seconds: 7440,
        resolution: '4K Ultra HD',
        views: 312500,
        likes: 27800,
        iarc_rating: '18+',
        creator: 'Bong Joon-ho',
        regional_category: 'Korean',
        source_type: 'studio_vod'
      },
      {
        id: 'video-svod-004',
        title: 'Afrobeats Symphony: Live at O2',
        description: 'The monumental world tour live recorded in full Dolby Atmos, showcasing modern African rhythm icons.',
        genre: 'Musical',
        stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=85',
        duration_seconds: 6900,
        resolution: '4K Ultra HD',
        views: 489000,
        likes: 56300,
        iarc_rating: 'PG',
        creator: 'Burna Boy & Symphony',
        regional_category: 'Nollywood',
        source_type: 'live_broadcast'
      },
      {
        id: 'video-svod-005',
        title: 'Sahara Mirage: The Lost Caravan',
        description: 'An expedition deep into the ancient trans-Saharan gold trade routes discovers an untouched oasis fortress.',
        genre: 'Adventure',
        stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=85',
        duration_seconds: 6120,
        resolution: '1080p',
        views: 184500,
        likes: 14200,
        iarc_rating: 'PG',
        creator: 'Alioune Diop',
        regional_category: 'South African & Australian',
        source_type: 'studio_vod'
      },
      {
        id: 'video-svod-006',
        title: 'Neo-Tokyo Overdrive',
        description: 'Underground cybernetic street racing teams challenge an authoritarian city corporate conglomerate.',
        genre: 'Science Fiction',
        stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=85',
        duration_seconds: 7080,
        resolution: '4K Ultra HD',
        views: 395000,
        likes: 31000,
        iarc_rating: 'PG-13',
        creator: 'Kenji Kamiyama',
        regional_category: 'Japanese & Taiwan',
        source_type: 'studio_vod'
      }
    ];

    for (const v of videos) {
      await pool.query(
        `INSERT INTO dancia_videos 
           (id, title, description, genre, stream_url, thumbnail_url, duration_seconds, resolution, views, likes, iarc_rating, creator, regional_category, source_type, is_active, moderation_status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, true, 'active', NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           description = EXCLUDED.description,
           genre = EXCLUDED.genre,
           stream_url = EXCLUDED.stream_url,
           thumbnail_url = EXCLUDED.thumbnail_url,
           duration_seconds = EXCLUDED.duration_seconds,
           resolution = EXCLUDED.resolution,
           views = EXCLUDED.views,
           likes = EXCLUDED.likes,
           iarc_rating = EXCLUDED.iarc_rating,
           creator = EXCLUDED.creator,
           regional_category = EXCLUDED.regional_category,
           source_type = EXCLUDED.source_type,
           is_active = true,
           moderation_status = 'active',
           updated_at = NOW()`,
        [
          v.id, v.title, v.description, v.genre, v.stream_url, v.thumbnail_url,
          v.duration_seconds, v.resolution, v.views, v.likes, v.iarc_rating,
          v.creator, v.regional_category, v.source_type
        ]
      );
    }
    console.log(`Seeded ${videos.length} Dancia videos.`);

    console.log('Dancia-4Tv seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding Dancia-4Tv:', err);
    process.exit(1);
  }
}

seedDancia();
