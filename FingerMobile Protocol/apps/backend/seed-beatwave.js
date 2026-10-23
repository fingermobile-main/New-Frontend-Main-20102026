const pool = require('./db');
const { randomUUID } = require('crypto');

async function seedBeatwave() {
  console.log('Seeding BeatwaveNG data into PostgreSQL...');

  try {
    // 1. Artists
    const artists = [
      {
        id: 1,
        name: 'Burna Boy & Wizkid Pulse',
        bio: 'Afro-fusion masters blending highlife, fuji, and modern digital rhythms.',
        cover_art: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
        followers: 1250000,
        verified: true,
        social_links: JSON.stringify({ twitter: '@burnaboy', instagram: '@burnaboygram' })
      },
      {
        id: 2,
        name: 'Pretoria Soul Collective',
        bio: 'Pioneers of private school Amapiano, warm Rhodes keys, and resonant log drums.',
        cover_art: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
        followers: 480000,
        verified: true,
        social_links: JSON.stringify({ instagram: '@pretoriasoul' })
      },
      {
        id: 3,
        name: 'DJ Spinall & Metro Vibe',
        bio: 'Club DJ powerhouse curating high-tempo Afrobeats and electronic dance fusions.',
        cover_art: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
        followers: 720000,
        verified: true,
        social_links: JSON.stringify({ twitter: '@djspinall' })
      },
      {
        id: 4,
        name: 'Tems & Ayra Starr Harmony',
        bio: 'Silky alternative RnB vocalists and sonic architects leading global African music.',
        cover_art: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        followers: 950000,
        verified: true,
        social_links: JSON.stringify({ instagram: '@temsbaby' })
      }
    ];

    for (const a of artists) {
      await pool.query(
        `INSERT INTO beatwave_artists (id, name, bio, cover_art, followers, verified, social_links, moderation_status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, 'active', NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           bio = EXCLUDED.bio,
           cover_art = EXCLUDED.cover_art,
           followers = EXCLUDED.followers,
           verified = EXCLUDED.verified,
           social_links = EXCLUDED.social_links,
           moderation_status = 'active',
           updated_at = NOW()`,
        [a.id, a.name, a.bio, a.cover_art, a.followers, a.verified, a.social_links]
      );
    }
    // Update artist sequence
    await pool.query('SELECT setval(\'beatwave_artists_id_seq\', (SELECT MAX(id) FROM beatwave_artists))');
    console.log(`Seeded ${artists.length} Beatwave artists.`);

    // 2. Tracks
    const tracks = [
      {
        id: 1,
        title: 'Lagos Night Energy (Sovereign Mix)',
        artist_id: 1,
        duration: 214,
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        cover_art: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
        genre: 'Afrobeats',
        year: 2026,
        track_number: 1,
        writer: 'Damini Ogulu, Ayodeji Balogun',
        producer: 'Kel P',
        plays: 142000,
        likes: 8940,
        bpm: 108,
        musical_key: 'F# Min',
        is_published: true,
        moderation_status: 'active'
      },
      {
        id: 2,
        title: 'Amapiano Log Drum Meditation',
        artist_id: 2,
        duration: 245,
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        cover_art: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
        genre: 'Amapiano',
        year: 2026,
        track_number: 2,
        writer: 'Kabelo Motha',
        producer: 'Kabza De Small',
        plays: 98000,
        likes: 6420,
        bpm: 113,
        musical_key: 'G Min',
        is_published: true,
        moderation_status: 'active'
      },
      {
        id: 3,
        title: 'Street-Hop Anthem (Omo Ologo)',
        artist_id: 3,
        duration: 198,
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        cover_art: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
        genre: 'Street-Hop',
        year: 2026,
        track_number: 3,
        writer: 'Sodamola Oluseye',
        producer: 'Rexxie',
        plays: 87500,
        likes: 5120,
        bpm: 122,
        musical_key: 'C Min',
        is_published: true,
        moderation_status: 'active'
      },
      {
        id: 4,
        title: 'Celestial Serenade',
        artist_id: 4,
        duration: 228,
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        cover_art: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        genre: 'Alternative RnB',
        year: 2026,
        track_number: 4,
        writer: 'Temilade Openiyi',
        producer: 'GuiltyBeatz',
        plays: 112000,
        likes: 9850,
        bpm: 96,
        musical_key: 'Eb Maj',
        is_published: true,
        moderation_status: 'active'
      },
      {
        id: 5,
        title: 'Atlantic Sunset Groove',
        artist_id: 1,
        duration: 210,
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        cover_art: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop&q=80',
        genre: 'Highlife',
        year: 2026,
        track_number: 5,
        writer: 'Damini Ogulu',
        producer: 'P2J',
        plays: 64000,
        likes: 4200,
        bpm: 104,
        musical_key: 'Bb Maj',
        is_published: true,
        moderation_status: 'active'
      },
      {
        id: 6,
        title: 'SoundOcean Sovereign Wave',
        artist_id: 2,
        duration: 270,
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        cover_art: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
        genre: 'Lofi Beats',
        year: 2026,
        track_number: 6,
        writer: 'Pretoria Collective',
        producer: 'SoundOcean Lab',
        plays: 45000,
        likes: 3100,
        bpm: 84,
        musical_key: 'D Min',
        is_published: true,
        moderation_status: 'active'
      }
    ];

    for (const t of tracks) {
      await pool.query(
        `INSERT INTO beatwave_tracks 
           (id, title, artist_id, duration, url, cover_art, genre, year, track_number, writer, producer, plays, likes, bpm, musical_key, is_published, moderation_status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           artist_id = EXCLUDED.artist_id,
           duration = EXCLUDED.duration,
           url = EXCLUDED.url,
           cover_art = EXCLUDED.cover_art,
           genre = EXCLUDED.genre,
           year = EXCLUDED.year,
           track_number = EXCLUDED.track_number,
           writer = EXCLUDED.writer,
           producer = EXCLUDED.producer,
           plays = EXCLUDED.plays,
           likes = EXCLUDED.likes,
           bpm = EXCLUDED.bpm,
           musical_key = EXCLUDED.musical_key,
           is_published = EXCLUDED.is_published,
           moderation_status = EXCLUDED.moderation_status,
           updated_at = NOW()`,
        [
          t.id, t.title, t.artist_id, t.duration, t.url, t.cover_art,
          t.genre, t.year, t.track_number, t.writer, t.producer,
          t.plays, t.likes, t.bpm, t.musical_key, t.is_published, t.moderation_status
        ]
      );
    }
    // Update track sequence
    await pool.query('SELECT setval(\'beatwave_tracks_id_seq\', (SELECT MAX(id) FROM beatwave_tracks))');
    console.log(`Seeded ${tracks.length} Beatwave tracks.`);

    // 3. Podcasts
    const podcasts = [
      {
        id: 'pod-001',
        title: 'The Sovereign Sound: African Music Tech',
        host: 'Mbah Israel Obinna',
        guest: 'Kel P & Sarz',
        description: 'Deep dive into decentralized audio distribution, sovereign IP rights, and tokenized creator royalties.',
        cover_art: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&auto=format&fit=crop&q=80',
        duration_minutes: 28,
        genre: 'Music Tech',
        episode_number: 1,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        tags: JSON.stringify(['Tech', 'Afrobeats', 'Creator Economy', 'Web3'])
      },
      {
        id: 'pod-002',
        title: 'Lagos Night Pulse: Underground Culture',
        host: 'DJ Spinall',
        guest: 'Asake',
        description: 'Exploring the genesis of Street-hop, Amapiano nightlife trends, and global festival takeover.',
        cover_art: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
        duration_minutes: 24,
        genre: 'Culture & Entertainment',
        episode_number: 2,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        tags: JSON.stringify(['Culture', 'Nightlife', 'Lagos', 'Amapiano'])
      }
    ];

    for (const p of podcasts) {
      await pool.query(
        `INSERT INTO beatwave_podcasts
           (id, title, host, guest, description, cover_art, duration_minutes, genre, episode_number, audio_url, tags, source_type, ttl_days, moderation_status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, 'audio_upload', 30, 'active', NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           host = EXCLUDED.host,
           guest = EXCLUDED.guest,
           description = EXCLUDED.description,
           cover_art = EXCLUDED.cover_art,
           duration_minutes = EXCLUDED.duration_minutes,
           genre = EXCLUDED.genre,
           episode_number = EXCLUDED.episode_number,
           audio_url = EXCLUDED.audio_url,
           tags = EXCLUDED.tags,
           moderation_status = 'active',
           updated_at = NOW()`,
        [
          p.id, p.title, p.host, p.guest, p.description, p.cover_art,
          p.duration_minutes, p.genre, p.episode_number, p.audio_url, p.tags
        ]
      );
    }
    console.log(`Seeded ${podcasts.length} Beatwave podcasts.`);

    console.log('BeatwaveNG seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding BeatwaveNG:', err);
    process.exit(1);
  }
}

seedBeatwave();
