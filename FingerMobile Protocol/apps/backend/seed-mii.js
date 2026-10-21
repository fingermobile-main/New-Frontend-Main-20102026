const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'fingermobile_platform_db',
});

async function seedMii() {
  const client = await pool.connect();
  try {
    console.log('Seeding Mii platform ecosystem...');
    
    // 1. Get 2 user IDs
    const usersRes = await client.query('SELECT id, username FROM users LIMIT 3');
    if (usersRes.rows.length === 0) {
      console.log('No users found in database');
      return;
    }
    const user1 = usersRes.rows[0].id;
    const user2 = usersRes.rows[1] ? usersRes.rows[1].id : user1;
    const user3 = usersRes.rows[2] ? usersRes.rows[2].id : user1;

    // 2. Channels
    await client.query(`
      INSERT INTO mii_channels (creator_id, name, description, avatar_url, subscriber_count, is_verified, moderation_status)
      VALUES 
        ($1, 'Lagos Tech & Sovereign Creators', 'Official sovereign creators network for Web3, AI, and digital media production in West Africa.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 1420, true, 'active'),
        ($2, 'FingerMobile Global Soundlab', 'Beat producers, sound designers, and live acoustic experiments broadcasting via BeatwaveNG.', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150', 890, true, 'active'),
        ($1, 'Dancia Studio Live Room', 'Behind-the-scenes clips, stage rehearsals, and 4K dance performance highlights.', 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150', 3200, true, 'active')
      ON CONFLICT DO NOTHING;
    `, [user1, user2]);

    // 3. Activity Presence
    await client.query(`
      INSERT INTO mii_activity_presence (
        user_id, is_online, now_listening_track_id, now_listening_title, now_listening_artist, now_listening_source,
        now_watching_video_id, now_watching_title, now_watching_source, active_livestream_url
      ) VALUES 
        ($1, true, 'bw-001', 'Midnight Groove (Acoustic Mix)', 'Fela Horizon', 'BeatwaveNG', 'd4-991', 'Afro-Contemporary Solo Finals', 'Dancia-4Tv', 'https://stream.fingermobile.org/live/afrobeat-finals'),
        ($2, true, 'bw-002', 'Lekki Tollgate Sunrise', 'DJ Sovereign', 'BeatwaveNG', 'd4-992', 'Street Dance Cypher Lagos 2026', 'Dancia-4Tv', NULL)
      ON CONFLICT (user_id) DO UPDATE SET
        is_online = EXCLUDED.is_online,
        now_listening_title = EXCLUDED.now_listening_title,
        now_listening_artist = EXCLUDED.now_listening_artist,
        now_watching_title = EXCLUDED.now_watching_title,
        updated_at = NOW();
    `, [user1, user2]);

    // 4. Statuses and Status Cards
    const statusRes = await client.query(`
      INSERT INTO mii_statuses (author_id, card_count, audience_type, is_active, expires_at, moderation_status)
      VALUES ($1, 2, 'followers', true, NOW() + INTERVAL '46 hours', 'active')
      RETURNING id;
    `, [user1]);

    if (statusRes.rows.length > 0) {
      const statusId = statusRes.rows[0].id;
      await client.query(`
        INSERT INTO mii_status_cards (
          status_id, author_id, card_index, media_type, media_url, thumbnail_url,
          file_size_bytes, duration_seconds, timer_type, caption, custom_sound_url, views_count, expires_at
        ) VALUES 
          ($1, $2, 1, 'image', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200', 450000, 0, '48hrs', 'Rehearsing the new festival routine on stage! ✨', 'https://assets.fingermobile.org/sounds/stage-intro.mp3', 84, NOW() + INTERVAL '46 hours'),
          ($1, $2, 2, 'video', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200', 12500000, 15, '48hrs', 'Beat drop test with the live brass section 🎷', 'https://assets.fingermobile.org/sounds/brass-hit.mp3', 62, NOW() + INTERVAL '46 hours')
        ON CONFLICT (status_id, card_index) DO NOTHING;
      `, [statusId, user1]);
    }

    // 5. Contacts
    await client.query(`
      INSERT INTO mii_contacts (user_id, contact_user_id, contact_name, phone_number_hash, pin_code, pin_status, is_trusted, activity_visible)
      VALUES 
        ($1, $2, 'Chukwudi Okafor (Producer)', 'hash_sample_001', '789456', 'accepted', true, true),
        ($2, $1, 'Eunice Mbah (Director)', 'hash_sample_002', '123456', 'accepted', true, true)
      ON CONFLICT (user_id, contact_user_id) DO UPDATE SET
        pin_status = EXCLUDED.pin_status,
        activity_visible = EXCLUDED.activity_visible;
    `, [user1, user2]);

    // 6. Orbit Folders
    const orbitRes = await client.query(`
      INSERT INTO mii_orbit_folders (user_id, folder_type, visibility, ugc_timer)
      VALUES 
        ($1, 'video', 'public', '24hrs'),
        ($1, 'image', 'public', '24hrs')
      ON CONFLICT (user_id, folder_type) DO NOTHING
      RETURNING id, folder_type;
    `, [user1]);

    // 7. MiniStore Products
    await client.query(`
      INSERT INTO mii_ministore_products (seller_id, title, description, price_fic, price_gems, catalog_page, media_urls, is_active, moderation_status)
      VALUES 
        ($1, 'Dancia Pro Dance Sneakers 2026', 'Limited edition grip-sole stage sneakers with shock absorbers.', 120.00, 450, 1, ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'], true, 'active'),
        ($1, 'Beatwave Afro-House Stems Vol. 4', 'Royalty-free DAW stems and loop packs for sovereign sound producers.', 45.00, 180, 2, ARRAY['https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600'], true, 'active')
      ON CONFLICT DO NOTHING;
    `, [user1]);

    console.log('Mii ecosystem seeded successfully.');
  } catch (err) {
    console.error('Error seeding Mii:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seedMii();
