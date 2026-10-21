const pool = require('./db');
const { randomUUID } = require('crypto');

async function seedFingerShorts() {
  console.log('Seeding FingerShorts sessions and cards in PostgreSQL...');

  try {
    const authorId = '44444444-4444-4444-4444-444444444444';

    const sessions = [
      {
        id: randomUUID(),
        title: 'Lekki Sunset Dance & Street Vibes',
        author_id: authorId,
        card_count: 2,
        cards: [
          {
            id: randomUUID(),
            card_index: 1,
            media_type: 'video',
            media_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnail_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
            file_size_bytes: 8400000,
            duration_seconds: 15.0,
            resolution_w: 1080,
            resolution_h: 1920,
            sound_title: 'Original Sound - Burna Boy Pulse',
            views_count: 14200,
            likes_count: 2150,
            comments_count: 340
          },
          {
            id: randomUUID(),
            card_index: 2,
            media_type: 'video',
            media_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            thumbnail_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600',
            file_size_bytes: 9100000,
            duration_seconds: 15.0,
            resolution_w: 1080,
            resolution_h: 1920,
            sound_title: 'Amapiano Log Drum Beat Vol 2',
            views_count: 9800,
            likes_count: 1420,
            comments_count: 180
          }
        ]
      },
      {
        id: randomUUID(),
        title: 'SuperVi Speed Run Highlights: 145K Points',
        author_id: authorId,
        card_count: 1,
        cards: [
          {
            id: randomUUID(),
            card_index: 1,
            media_type: 'video',
            media_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            thumbnail_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600',
            file_size_bytes: 11200000,
            duration_seconds: 20.0,
            resolution_w: 1080,
            resolution_h: 1920,
            sound_title: 'SuperVi Cyber Beat - Lagos 2026',
            views_count: 32500,
            likes_count: 4890,
            comments_count: 620
          }
        ]
      }
    ];

    for (const s of sessions) {
      await pool.query(
        `INSERT INTO fingershorts_sessions
           (id, author_id, title, card_count, is_published, expires_at, created_at, updated_at)
         VALUES ($1, $2, $3, $4, true, NOW() + INTERVAL '48 hours', NOW(), NOW())
         ON CONFLICT (id) DO NOTHING`,
        [s.id, s.author_id, s.title, s.card_count]
      );

      for (const c of s.cards) {
        await pool.query(
          `INSERT INTO fingershorts_cards
             (id, session_id, author_id, card_index, media_type, media_url, thumbnail_url,
              file_size_bytes, duration_seconds, resolution_w, resolution_h, aspect_ratio,
              frame_rate, format, sound_title, views_count, likes_count, comments_count,
              expires_at, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, '9:16', 30, 'mp4', $12, $13, $14, $15, NOW() + INTERVAL '48 hours', NOW())
           ON CONFLICT (id) DO NOTHING`,
          [
            c.id, s.id, s.author_id, c.card_index, c.media_type, c.media_url, c.thumbnail_url,
            c.file_size_bytes, c.duration_seconds, c.resolution_w, c.resolution_h, c.sound_title,
            c.views_count, c.likes_count, c.comments_count
          ]
        );
      }
    }

    console.log(`Seeded ${sessions.length} FingerShorts sessions.`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding FingerShorts:', err);
    process.exit(1);
  }
}

seedFingerShorts();
