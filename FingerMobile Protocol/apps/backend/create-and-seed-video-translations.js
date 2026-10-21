/**
 * create-and-seed-video-translations.js
 * Creates video_translations table and seeds sample translated videos.
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

    await client.query(`
      CREATE TABLE IF NOT EXISTS video_translations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" UUID NOT NULL,
        "originalFileName" VARCHAR(255) NOT NULL,
        "originalFileSize" INTEGER NOT NULL DEFAULT 0,
        "originalFileUrl" VARCHAR(512) NOT NULL DEFAULT '',
        "targetLanguages" JSONB DEFAULT '[]'::jsonb,
        status VARCHAR(50) DEFAULT 'completed',
        "processingId" VARCHAR(100) UNIQUE,
        "outputFiles" JSONB DEFAULT '[]'::jsonb,
        transcription TEXT,
        translations JSONB DEFAULT '{}'::jsonb,
        "processingStartTime" TIMESTAMPTZ DEFAULT NOW(),
        "processingEndTime" TIMESTAMPTZ DEFAULT NOW(),
        "estimatedCompletionTime" TIMESTAMPTZ,
        "totalProcessingTime" INTEGER DEFAULT 1200,
        "errorMessage" TEXT,
        "createdAt" TIMESTAMPTZ DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Fetch a user ID for seeding
    const userRes = await client.query('SELECT id FROM users LIMIT 1');
    const userId = userRes.rows[0]?.id || '00000000-0000-0000-0000-000000000000';

    const countRes = await client.query('SELECT COUNT(*) FROM video_translations');
    if (parseInt(countRes.rows[0].count, 10) === 0) {
      await client.query(`
        INSERT INTO video_translations (
          "userId", "originalFileName", "originalFileSize", "originalFileUrl",
          "targetLanguages", status, "processingId", "outputFiles", transcription, translations
        ) VALUES (
          $1, 'fingermobile-ecosystem-overview.mp4', 15728640, 'https://cdn.fingermobile.com/videos/fingermobile-ecosystem-overview.mp4',
          '["fr", "es", "yo", "sw"]'::jsonb, 'completed', 'proc-fm-001',
          '[{"language": "fr", "url": "https://cdn.fingermobile.com/videos/fingermobile-fr.mp4", "fileSize": 15900000}, {"language": "es", "url": "https://cdn.fingermobile.com/videos/fingermobile-es.mp4", "fileSize": 15850000}]'::jsonb,
          'Welcome to the FingerMobile decentralized content economy. Every creator maintains sovereign ownership.',
          '{"fr": "Bienvenue dans l économie de contenu décentralisée de FingerMobile.", "es": "Bienvenido a la economía de contenido descentralizada de FingerMobile."}'::jsonb
        );
      `, [userId]);
      console.log('✅ Seeded initial video_translations record');
    }

    await client.query('COMMIT');
    console.log('✅ video_translations table verified & ready.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Failed creating video_translations table:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
