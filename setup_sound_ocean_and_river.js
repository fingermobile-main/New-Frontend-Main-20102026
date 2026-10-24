/**
 * Standalone Database Architecture & Seeds for:
 * 1. SoundOcean Microservice: Independent Audio Collector, Categorizer, Library & Archival Vault
 * 2. SoundRiver Microservice: Independent Real-Time Stream Engine & BeatwaveNG Seeder/Feeder
 *
 * FingerMobile Protocol™ Sovereign Operations Control Plane
 */

const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.POSTGRES_HOST || '127.0.0.1',
  port: parseInt(process.env.POSTGRES_PORT || '5433', 10),
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: 'fingermobile_platform_db'
});

async function setupSoundOceanAndRiver() {
  const client = await pool.connect();
  try {
    console.log('[SoundOcean & SoundRiver] Initializing independent microservices tables in PostgreSQL...');
    await client.query('BEGIN');

    // =========================================================================
    // 1. SOUNDOCEAN TABLES (The Collector, Categorizer & Library Microservice)
    // =========================================================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS sound_ocean_library_items (
        id SERIAL PRIMARY KEY,
        code VARCHAR(64) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        artist VARCHAR(255) NOT NULL,
        genre VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        bpm INTEGER DEFAULT 120,
        key_signature VARCHAR(16) DEFAULT 'C Maj',
        bit_depth INTEGER DEFAULT 24,
        sample_rate_khz INTEGER DEFAULT 48,
        audio_format VARCHAR(32) DEFAULT 'FLAC',
        audio_url TEXT NOT NULL,
        stem_vault_file TEXT,
        stem_channels JSONB DEFAULT '["Vocals", "Drums", "Bass", "Melody", "Percussion"]'::jsonb,
        file_size_mb NUMERIC(8,2) DEFAULT 45.5,
        uploader_id VARCHAR(64) DEFAULT 'member-sovereign',
        uploader_name VARCHAR(255) DEFAULT 'Community Creator',
        license_type VARCHAR(100) DEFAULT 'Creative Commons CC-BY 4.0',
        fic_price NUMERIC(10,2) DEFAULT 0.00,
        royalty_split_pct NUMERIC(5,2) DEFAULT 85.00,
        play_count INTEGER DEFAULT 0,
        download_count INTEGER DEFAULT 0,
        curation_status VARCHAR(32) DEFAULT 'approved',
        status VARCHAR(32) DEFAULT 'active',
        display_order INTEGER DEFAULT 1,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS sound_ocean_console_spawns (
        id SERIAL PRIMARY KEY,
        parent_console VARCHAR(64) DEFAULT 'sound_ocean_console',
        sub_console_name VARCHAR(255) NOT NULL,
        slug VARCHAR(128) UNIQUE NOT NULL,
        endpoint VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        status VARCHAR(32) DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS sound_ocean_royalties (
        id SERIAL PRIMARY KEY,
        item_id INTEGER REFERENCES sound_ocean_library_items(id) ON DELETE CASCADE,
        recipient_id VARCHAR(64) NOT NULL,
        recipient_name VARCHAR(255) NOT NULL,
        amount_fic NUMERIC(12,2) NOT NULL,
        tx_hash VARCHAR(128) NOT NULL,
        status VARCHAR(32) DEFAULT 'settled',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // =========================================================================
    // 2. SOUNDRIVER TABLES (The Stream Generator & BeatwaveNG Feeder Microservice)
    // =========================================================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS sound_river_stream_items (
        id SERIAL PRIMARY KEY,
        code VARCHAR(64) UNIQUE NOT NULL,
        station_name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        active_listeners INTEGER DEFAULT 450,
        peak_listeners INTEGER DEFAULT 12000,
        target_bitrate_kbps INTEGER DEFAULT 320,
        codec VARCHAR(32) DEFAULT 'AAC-LC',
        current_track_id INTEGER REFERENCES sound_ocean_library_items(id) ON DELETE SET NULL,
        current_track_title VARCHAR(255),
        current_track_artist VARCHAR(255),
        current_track_url TEXT,
        next_track_title VARCHAR(255),
        crossfade_seconds INTEGER DEFAULT 4,
        feed_mode VARCHAR(32) DEFAULT 'auto_seed',
        buffer_health_pct NUMERIC(5,2) DEFAULT 99.8,
        status VARCHAR(32) DEFAULT 'active',
        display_order INTEGER DEFAULT 1,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS sound_river_feed_schedules (
        id SERIAL PRIMARY KEY,
        stream_id INTEGER REFERENCES sound_river_stream_items(id) ON DELETE CASCADE,
        slot_time VARCHAR(32) NOT NULL,
        genre_focus VARCHAR(100) NOT NULL,
        min_bpm INTEGER DEFAULT 80,
        max_bpm INTEGER DEFAULT 140,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS sound_river_console_spawns (
        id SERIAL PRIMARY KEY,
        parent_console VARCHAR(64) DEFAULT 'sound_river_console',
        sub_console_name VARCHAR(255) NOT NULL,
        slug VARCHAR(128) UNIQUE NOT NULL,
        endpoint VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        status VARCHAR(32) DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // =========================================================================
    // SEED SOUNDOCEAN LIBRARY (Member & Studio Audio Recordings & Stems)
    // =========================================================================
    await client.query(`DELETE FROM sound_ocean_royalties`);
    await client.query(`DELETE FROM sound_river_stream_items`);
    await client.query(`DELETE FROM sound_ocean_library_items`);

    const oceanItems = [
      [
        'OCN-LIB-001', 'Lagos Midnight Highlife Symphony', 'Sir Victor & The Sovereign All-Stars',
        'Highlife Fusion', 'Master Stems', 112, 'G Maj', 24, 96, 'FLAC',
        'https://cdn.fingermobileprotocol.com/soundocean/highlife-symphony-24bit.flac',
        'https://cdn.fingermobileprotocol.com/soundocean/stems/highlife-symphony-stems.zip',
        JSON.stringify(['Lead Vocals', 'Brass Horns', 'Talking Drum', 'Electric Bass', 'Congas']),
        88.4, 'creator_tunde_01', 'Tunde Soundworks', 'Exclusive Sovereign License', 25.00, 85.00, 14200, 480, 1
      ],
      [
        'OCN-LIB-002', 'Kigali Dawn Amapiano Log-Drum Pack', 'DJ Kagame Beats',
        'Amapiano', 'Sound Packs', 115, 'F Min', 24, 48, 'WAV',
        'https://cdn.fingermobileprotocol.com/soundocean/kigali-logdrum-sample.wav',
        'https://cdn.fingermobileprotocol.com/soundocean/stems/kigali-logdrum-pack.zip',
        JSON.stringify(['Heavy Log Drum', 'Sub Bass', 'Shaker Loop', 'Piano Chords', 'Vocal Chops']),
        54.2, 'creator_kagame_09', 'Kagame Audio Lab', 'Creative Commons CC-BY 4.0', 10.00, 90.00, 28900, 1850, 2
      ],
      [
        'OCN-LIB-003', 'Sahara Desert Tuareg Guitar Chords', 'Tinariwen Heritage Collective',
        'Desert Blues', 'Master Stems', 98, 'D Maj', 24, 192, 'FLAC',
        'https://cdn.fingermobileprotocol.com/soundocean/tuareg-guitar-master.flac',
        'https://cdn.fingermobileprotocol.com/soundocean/stems/tuareg-guitar-stems.zip',
        JSON.stringify(['Acoustic Guitar', 'Electric Resonator', 'Clap Choir', 'Solo Flute']),
        124.8, 'creator_tinariwen_03', 'Sahara Sounds', 'Royalty Sharing Collective', 40.00, 80.00, 9400, 290, 3
      ],
      [
        'OCN-LIB-004', 'Nairobi Afro-Futuristic Drill 2026', 'CyberKenyatta',
        'Electronic Drill', 'Full Tracks', 140, 'C# Min', 24, 48, 'WAV',
        'https://cdn.fingermobileprotocol.com/soundocean/nairobi-cyber-drill.wav',
        'https://cdn.fingermobileprotocol.com/soundocean/stems/cyber-drill-stems.zip',
        JSON.stringify(['808 Glide Bass', 'Rapid Hi-Hats', 'Cyber Synth', 'Vocal Bars']),
        42.1, 'creator_cyber_02', 'Nairobi Future Beats', 'Creative Commons CC-BY 4.0', 5.00, 85.00, 31200, 910, 4
      ],
      [
        'OCN-LIB-005', 'Accra High Street Afrobeat Horn Section', 'The Black Star Brass Band',
        'Afrobeat Brass', 'Vocal & Instrument Stems', 118, 'Bb Maj', 24, 96, 'FLAC',
        'https://cdn.fingermobileprotocol.com/soundocean/accra-brass-master.flac',
        'https://cdn.fingermobileprotocol.com/soundocean/stems/accra-brass-stems.zip',
        JSON.stringify(['Trumpet 1', 'Trumpet 2', 'Trombone', 'Tenor Sax', 'Baritone Sax']),
        76.5, 'creator_brass_ghana', 'Black Star Collective', 'Creative Commons CC-BY 4.0', 18.00, 85.00, 18600, 640, 5
      ],
      [
        'OCN-LIB-006', 'Fuji Bata Rhythm Master Recording', 'Alhaji Wasiu Sovereign Sound',
        'Fuji Classic', 'Cultural Heritage', 124, 'E Maj', 24, 96, 'FLAC',
        'https://cdn.fingermobileprotocol.com/soundocean/fuji-bata-master.flac',
        'https://cdn.fingermobileprotocol.com/soundocean/stems/fuji-bata-stems.zip',
        JSON.stringify(['Bata Lead', 'Sakara Drum', 'Agogo Bell', 'Lead Vocal Chant', 'Chorus']),
        95.0, 'creator_wasiu_fuji', 'Yoruba Heritage Foundation', 'Preserved Cultural Heritage', 0.00, 100.00, 45000, 3200, 6
      ],
      [
        'OCN-LIB-007', 'Cape Town Deep House Rhodes Moods', 'Table Mountain Audio Guild',
        'Deep House', 'Master Stems', 120, 'Eb Min', 24, 48, 'WAV',
        'https://cdn.fingermobileprotocol.com/soundocean/capetown-deep-house.wav',
        'https://cdn.fingermobileprotocol.com/soundocean/stems/capetown-stems.zip',
        JSON.stringify(['Rhodes Keys', 'Deep Sub', 'Open Hats', 'Pad Atmosphere']),
        48.3, 'creator_capetown_dj', 'South African Groove Hub', 'Creative Commons CC-BY 4.0', 12.00, 85.00, 22100, 780, 7
      ],
      [
        'OCN-LIB-008', 'NYSC Camp Morning Bugle & Drums', 'Federal Cadet Marching Corps',
        'Ceremonial March', 'Field Recordings', 108, 'C Maj', 16, 44, 'WAV',
        'https://cdn.fingermobileprotocol.com/soundocean/nysc-bugle-cadet.wav',
        null,
        JSON.stringify(['Bugle Solo', 'Snare Drum Rolls', 'Bass Drum Thunder']),
        24.0, 'creator_nysc_archive', 'NYSC National Archive', 'Public Sovereign Domain', 0.00, 100.00, 12000, 890, 8
      ],
      [
        'OCN-LIB-009', 'Soweto Youth Choir Acapella Stems', 'Holy Cross Voices of Soweto',
        'Gospel & Choral', 'Vocal Stems', 92, 'Ab Maj', 24, 96, 'FLAC',
        'https://cdn.fingermobileprotocol.com/soundocean/soweto-choir-master.flac',
        'https://cdn.fingermobileprotocol.com/soundocean/stems/soweto-choir-stems.zip',
        JSON.stringify(['Soprano', 'Alto', 'Tenor', 'Bass', 'Lead Improviser']),
        110.2, 'creator_soweto_voices', 'Soweto Choral Trust', 'Royalty Sharing Collective', 30.00, 80.00, 16800, 520, 9
      ],
      [
        'OCN-LIB-010', 'Zanzibar Taarab Violin & Kanun Duet', 'Indian Ocean Pearl Ensemble',
        'Taarab & Swahili', 'Master Stems', 100, 'D Min', 24, 192, 'FLAC',
        'https://cdn.fingermobileprotocol.com/soundocean/zanzibar-taarab-master.flac',
        'https://cdn.fingermobileprotocol.com/soundocean/stems/zanzibar-stems.zip',
        JSON.stringify(['Kanun String', 'Violin Duet', 'Oud Harmony', 'Dumbek Drum']),
        138.0, 'creator_zanzibar_arts', 'Swahili Maritime Archives', 'Exclusive Sovereign License', 35.00, 85.00, 8900, 310, 10
      ],
      [
        'OCN-LIB-011', 'Afro-Gqom Dark Energy Drum Loops', 'Durban Sub-Bass Syndicate',
        'Gqom', 'Sound Packs', 128, 'B Min', 24, 48, 'WAV',
        'https://cdn.fingermobileprotocol.com/soundocean/durban-gqom-loops.wav',
        'https://cdn.fingermobileprotocol.com/soundocean/stems/durban-gqom-pack.zip',
        JSON.stringify(['Broken Kick', 'Distorted Rimshot', 'Sub Rattle', 'Metal Clank']),
        38.6, 'creator_durban_underground', 'Durban Gqom Central', 'Creative Commons CC-BY 4.0', 8.00, 90.00, 27400, 1450, 11
      ],
      [
        'OCN-LIB-012', 'SuperVi 8-Bit Cyber-Kora Game Stems', 'Neo-Dakar Chip Musicians',
        'Chiptune & Kora', 'Gaming & Metaverse', 135, 'A Maj', 24, 48, 'FLAC',
        'https://cdn.fingermobileprotocol.com/soundocean/supervi-cyber-kora.flac',
        'https://cdn.fingermobileprotocol.com/soundocean/stems/cyber-kora-stems.zip',
        JSON.stringify(['8-Bit Lead', 'Kora Plucks', 'Game SFX', 'Chip Bass', 'Punchy Kick']),
        45.0, 'creator_supervi_audio', 'SuperVi Game Audio Core', 'Gaming Soundtrack License', 15.00, 85.00, 39800, 2100, 12
      ]
    ];

    const insertedOceanIds = [];
    for (const item of oceanItems) {
      const res = await client.query(`
        INSERT INTO sound_ocean_library_items (
          code, title, artist, genre, category, bpm, key_signature, bit_depth, sample_rate_khz,
          audio_format, audio_url, stem_vault_file, stem_channels, file_size_mb, uploader_id,
          uploader_name, license_type, fic_price, royalty_split_pct, play_count, download_count, display_order
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
        ) RETURNING id;
      `, item);
      insertedOceanIds.push(res.rows[0].id);
    }

    // =========================================================================
    // SEED SOUNDRIVER STREAMS (Continuous Feeders seeding BeatwaveNG & Streams)
    // =========================================================================
    const riverStreams = [
      [
        'RVR-STRM-001', 'Lagos 24/7 Sovereign Afrobeat River', 'Live Beatwave Feeder',
        1850, 45000, 320, 'AAC-LC', insertedOceanIds[0],
        'Lagos Midnight Highlife Symphony', 'Sir Victor & The Sovereign All-Stars',
        'https://cdn.fingermobileprotocol.com/soundocean/highlife-symphony-24bit.flac',
        'Accra High Street Afrobeat Horn Section', 4, 'auto_seed', 99.95, 1
      ],
      [
        'RVR-STRM-002', 'Amapiano Log-Drum Pulse River', 'Live Beatwave Feeder',
        3200, 85000, 320, 'AAC-LC', insertedOceanIds[1],
        'Kigali Dawn Amapiano Log-Drum Pack', 'DJ Kagame Beats',
        'https://cdn.fingermobileprotocol.com/soundocean/kigali-logdrum-sample.wav',
        'Afro-Gqom Dark Energy Drum Loops', 5, 'auto_seed', 99.98, 2
      ],
      [
        'RVR-STRM-003', 'Sahara & Sahel Deep Meditative River', 'Curated Algorithm River',
        920, 24000, 320, 'Opus', insertedOceanIds[2],
        'Sahara Desert Tuareg Guitar Chords', 'Tinariwen Heritage Collective',
        'https://cdn.fingermobileprotocol.com/soundocean/tuareg-guitar-master.flac',
        'Zanzibar Taarab Violin & Kanun Duet', 6, 'auto_seed', 99.90, 3
      ],
      [
        'RVR-STRM-004', 'Nairobi Cyber-Drill High Energy Stream', 'Creator Showcase River',
        1400, 32000, 320, 'AAC-LC', insertedOceanIds[3],
        'Nairobi Afro-Futuristic Drill 2026', 'CyberKenyatta',
        'https://cdn.fingermobileprotocol.com/soundocean/nairobi-cyber-drill.wav',
        'SuperVi 8-Bit Cyber-Kora Game Stems', 3, 'auto_seed', 99.85, 4
      ],
      [
        'RVR-STRM-005', 'Fuji & Traditional Yoruba Roots River', 'Preserved Heritage Relay',
        1650, 28000, 256, 'AAC-LC', insertedOceanIds[5],
        'Fuji Bata Rhythm Master Recording', 'Alhaji Wasiu Sovereign Sound',
        'https://cdn.fingermobileprotocol.com/soundocean/fuji-bata-master.flac',
        'Lagos Midnight Highlife Symphony', 4, 'auto_seed', 99.92, 5
      ],
      [
        'RVR-STRM-006', 'Cape Town Audiophile Lossless Studio River', 'Audiophile FLAC River',
        680, 15000, 1411, 'FLAC', insertedOceanIds[6],
        'Cape Town Deep House Rhodes Moods', 'Table Mountain Audio Guild',
        'https://cdn.fingermobileprotocol.com/soundocean/capetown-deep-house.wav',
        'Soweto Youth Choir Acapella Stems', 4, 'auto_seed', 99.99, 6
      ],
      [
        'RVR-STRM-007', 'NYSC Nationwide SAED Campus Radio River', 'Radio Relay',
        4500, 95000, 128, 'AAC-LC', insertedOceanIds[7],
        'NYSC Camp Morning Bugle & Drums', 'Federal Cadet Marching Corps',
        'https://cdn.fingermobileprotocol.com/soundocean/nysc-bugle-cadet.wav',
        'Kigali Dawn Amapiano Log-Drum Pack', 2, 'auto_seed', 99.75, 7
      ],
      [
        'RVR-STRM-008', 'Soweto Sunday Choral & Gospel River', 'Live Beatwave Feeder',
        1100, 22000, 256, 'Opus', insertedOceanIds[8],
        'Soweto Youth Choir Acapella Stems', 'Holy Cross Voices of Soweto',
        'https://cdn.fingermobileprotocol.com/soundocean/soweto-choir-master.flac',
        'Sahara Desert Tuareg Guitar Chords', 5, 'auto_seed', 99.94, 8
      ],
      [
        'RVR-STRM-009', 'Zanzibar Maritime Taarab Chillout Stream', 'Curated Algorithm River',
        750, 18000, 320, 'Opus', insertedOceanIds[9],
        'Zanzibar Taarab Violin & Kanun Duet', 'Indian Ocean Pearl Ensemble',
        'https://cdn.fingermobileprotocol.com/soundocean/zanzibar-taarab-master.flac',
        'Cape Town Deep House Rhodes Moods', 4, 'auto_seed', 99.88, 9
      ],
      [
        'RVR-STRM-010', 'Durban Gqom Underground Club River', 'Creator Showcase River',
        2100, 48000, 320, 'AAC-LC', insertedOceanIds[10],
        'Afro-Gqom Dark Energy Drum Loops', 'Durban Sub-Bass Syndicate',
        'https://cdn.fingermobileprotocol.com/soundocean/durban-gqom-loops.wav',
        'Nairobi Afro-Futuristic Drill 2026', 4, 'auto_seed', 99.80, 10
      ],
      [
        'RVR-STRM-011', 'SuperVi Gamer Physics & Runner Beat Stream', 'Gaming & Metaverse',
        2800, 65000, 320, 'AAC-LC', insertedOceanIds[11],
        'SuperVi 8-Bit Cyber-Kora Game Stems', 'Neo-Dakar Chip Musicians',
        'https://cdn.fingermobileprotocol.com/soundocean/supervi-cyber-kora.flac',
        'Lagos Midnight Highlife Symphony', 3, 'auto_seed', 99.96, 11
      ],
      [
        'RVR-STRM-012', 'Universal Global Diaspora Bridge Stream', 'P2P WebRTC Mesh Feeder',
        3600, 110000, 256, 'Opus', insertedOceanIds[4],
        'Accra High Street Afrobeat Horn Section', 'The Black Star Brass Band',
        'https://cdn.fingermobileprotocol.com/soundocean/accra-brass-master.flac',
        'Fuji Bata Rhythm Master Recording', 4, 'auto_seed', 99.91, 12
      ]
    ];

    for (const strm of riverStreams) {
      await client.query(`
        INSERT INTO sound_river_stream_items (
          code, station_name, category, active_listeners, peak_listeners, target_bitrate_kbps,
          codec, current_track_id, current_track_title, current_track_artist, current_track_url,
          next_track_title, crossfade_seconds, feed_mode, buffer_health_pct, display_order
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
        );
      `, strm);
    }

    // Seed Spawns for SoundOcean and SoundRiver
    await client.query(`
      INSERT INTO sound_ocean_console_spawns (parent_console, sub_console_name, slug, endpoint, category)
      VALUES
        ('sound_ocean_console', 'West Africa Master Stems Archive', 'west-africa-stems', '/api/sound-ocean-console/spawns/west-africa', 'Master Stems'),
        ('sound_ocean_console', 'East Africa Log-Drum Vault', 'east-africa-logdrums', '/api/sound-ocean-console/spawns/east-africa', 'Sound Packs'),
        ('sound_ocean_console', 'Sovereign Cultural Heritage Repository', 'cultural-heritage-repo', '/api/sound-ocean-console/spawns/heritage', 'Cultural Heritage')
      ON CONFLICT DO NOTHING;

      INSERT INTO sound_river_console_spawns (parent_console, sub_console_name, slug, endpoint, category)
      VALUES
        ('sound_river_console', 'Lagos Radio Relay Feeder', 'lagos-radio-feeder', '/api/sound-river-console/spawns/lagos', 'Radio Relay'),
        ('sound_river_console', 'Nairobi Mobile High-Bitrate Pipe', 'nairobi-mobile-pipe', '/api/sound-river-console/spawns/nairobi', 'Live Beatwave Feeder'),
        ('sound_river_console', 'Diaspora WebRTC Audio Mesh Relay', 'diaspora-webrtc-mesh', '/api/sound-river-console/spawns/diaspora', 'P2P WebRTC Mesh Feeder')
      ON CONFLICT DO NOTHING;
    `);

    await client.query('COMMIT');
    console.log('[SoundOcean & SoundRiver] PostgreSQL setup and seed complete!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[SoundOcean & SoundRiver] Error setting up database:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

setupSoundOceanAndRiver();
