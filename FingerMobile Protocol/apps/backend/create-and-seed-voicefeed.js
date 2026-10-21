const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'fingermobile_platform_db',
});

async function run() {
  const client = await pool.connect();
  try {
    console.log('Setting up voicefeed_posts table and seeding data...');

    // 1. Create voicefeed_posts table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS voicefeed_posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        audio_url TEXT NOT NULL,
        duration_seconds INTEGER DEFAULT 0,
        category VARCHAR(100) DEFAULT 'general',
        tags JSONB DEFAULT '[]'::jsonb,
        is_published BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_voicefeed_posts_author ON voicefeed_posts(author_id);
      CREATE INDEX IF NOT EXISTS idx_voicefeed_posts_category ON voicefeed_posts(category);
      CREATE INDEX IF NOT EXISTS idx_voicefeed_posts_created ON voicefeed_posts(created_at DESC);
    `);

    // 2. Add foreign key from voicefeed_comments and voicefeed_plays if needed
    try {
      await client.query(`
        ALTER TABLE voicefeed_comments 
        ADD CONSTRAINT fk_voicefeed_comments_post 
        FOREIGN KEY (post_id) REFERENCES voicefeed_posts(id) ON DELETE CASCADE;
      `);
    } catch (e) {
      // Constraint might already exist or ignore
    }

    try {
      await client.query(`
        ALTER TABLE voicefeed_plays 
        ADD CONSTRAINT fk_voicefeed_plays_post 
        FOREIGN KEY (post_id) REFERENCES voicefeed_posts(id) ON DELETE CASCADE;
      `);
    } catch (e) {
      // Constraint might already exist
    }

    // 3. Seed rich voice clips
    const usersRes = await client.query('SELECT id, username FROM users LIMIT 3');
    if (usersRes.rows.length === 0) {
      console.log('No users available for voicefeed seed');
      return;
    }

    const u1 = usersRes.rows[0].id;
    const u2 = usersRes.rows[1] ? usersRes.rows[1].id : u1;

    const insertPosts = await client.query(`
      INSERT INTO voicefeed_posts (author_id, title, audio_url, duration_seconds, category, tags, is_published)
      VALUES 
        ($1, 'Morning Inspiration: Building Sovereign Protocols in Africa', 'https://assets.fingermobile.org/audio/voicefeed/morning-inspiration-01.mp3', 142, 'inspiration', '["tech", "crypto", "sovereignty"]', true),
        ($2, 'Acoustic Guitar Hook Idea #4 (Key of D Minor)', 'https://assets.fingermobile.org/audio/voicefeed/guitar-hook-dminor.mp3', 45, 'music', '["acoustic", "beatwave", "guitar"]', true),
        ($1, 'Why Decentralized Identity Matters for Artists', 'https://assets.fingermobile.org/audio/voicefeed/decentralized-id-artists.mp3', 188, 'education', '["web3", "identity", "creators"]', true),
        ($2, 'Live Studio Reaction to the New Afrobeat Master', 'https://assets.fingermobile.org/audio/voicefeed/studio-reaction-afrobeat.mp3', 60, 'entertainment', '["studio", "afrobeat", "vibes"]', true),
        ($1, 'FingerMobile Dev Diary: Audio Engine 2.0 Walkthrough', 'https://assets.fingermobile.org/audio/voicefeed/audio-engine-walkthrough.mp3', 210, 'tech', '["engineering", "audio", "voicefeed"]', true)
      RETURNING id, title;
    `, [u1, u2]);

    console.log(`Seeded ${insertPosts.rows.length} voicefeed posts.`);

    // 4. Seed plays and comments
    for (const post of insertPosts.rows) {
      await client.query(`
        INSERT INTO voicefeed_plays (post_id, user_id, played_at)
        VALUES 
          ($1, $2, NOW() - INTERVAL '2 hours'),
          ($1, $3, NOW() - INTERVAL '1 hour');
      `, [post.id, u1, u2]);

      await client.query(`
        INSERT INTO voicefeed_comments (post_id, user_id, content, created_at)
        VALUES 
          ($1, $2, 'Incredible clarity and flow! Looking forward to part 2.', NOW() - INTERVAL '30 minutes');
      `, [post.id, u2]);
    }

    console.log('Voicefeed plays and comments seeded successfully.');
  } catch (err) {
    console.error('Error in voicefeed setup/seed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
