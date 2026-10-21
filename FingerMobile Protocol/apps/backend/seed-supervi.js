const pool = require('./db');

async function seedSuperVi() {
  console.log('Setting up SuperVi tables and comprehensive data in PostgreSQL...');

  try {
    // 1. Create tables if not exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS supervi_characters (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        identity_label VARCHAR(255),
        description TEXT,
        character_class VARCHAR(100),
        origin_city VARCHAR(255),
        suit_style TEXT,
        orb_color VARCHAR(50),
        orb_symbols TEXT,
        avatar_url TEXT,
        abilities JSONB DEFAULT '{}',
        unlock_method VARCHAR(100),
        is_unlocked BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS supervi_powerups (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        cost INT DEFAULT 100,
        currency VARCHAR(20) DEFAULT 'COINS',
        icon VARCHAR(50),
        duration_seconds INT DEFAULT 15,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS supervi_daily_challenges (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        target_value INT DEFAULT 1000,
        reward_fic INT DEFAULT 25,
        reward_coins INT DEFAULT 500,
        challenge_type VARCHAR(100) DEFAULT 'distance',
        is_active BOOLEAN DEFAULT true,
        expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS supervi_voice_lines (
        id VARCHAR(100) PRIMARY KEY,
        character_id VARCHAR(100),
        text TEXT NOT NULL,
        category VARCHAR(100),
        accent VARCHAR(100) DEFAULT 'Nigerian English',
        audio_url TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS supervi_leaderboards (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) DEFAULT 'global',
        rules JSONB DEFAULT '{}',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS supervi_leaderboard_records (
        id VARCHAR(100) PRIMARY KEY,
        leaderboard_id VARCHAR(100) NOT NULL,
        user_id VARCHAR(100),
        username VARCHAR(255),
        avatar_url TEXT,
        score NUMERIC(15,2) NOT NULL DEFAULT 0,
        rank INT,
        level INT DEFAULT 1,
        character_id VARCHAR(100),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS supervi_achievements (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) DEFAULT 'gameplay',
        difficulty VARCHAR(50) DEFAULT 'medium',
        points INT DEFAULT 50,
        icon VARCHAR(100) DEFAULT 'award',
        requirements JSONB DEFAULT '{}',
        rewards JSONB DEFAULT '{}',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('SuperVi database tables verified.');

    // 2. Seed Characters
    const characters = [
      {
        id: 'zara_zephyr',
        name: 'Zara the Zephyr',
        identity_label: 'Black Hausa Female Superhero',
        description: 'Protective, brave guardian spirit who levitates above flames and descends in a fiery streak.',
        character_class: 'Guardian of Heritage',
        origin_city: 'Abuja, Lagos, Kano (Nigeria)',
        suit_style: 'Skin-tight red spandex with gold light trimmings, opals, knee-length flowing hijab',
        orb_color: '#EF4444',
        orb_symbols: 'Fiery glowing red Orb with Egyptian hieroglyphs floating around it',
        avatar_url: '/images/characters/zara.png',
        abilities: JSON.stringify({
          passive: ['Levitates above flames', 'Fiery streak'],
          active: ['Fire-based attack'],
          orb_ability: { name: 'Fire Dash', description: 'Creates a fiery path burning obstacles' }
        }),
        unlock_method: 'Starting Character',
        is_unlocked: true
      },
      {
        id: 'tenko_gen',
        name: 'Tenko-Gen',
        identity_label: 'Brown-skinned Fulani Female Superhero',
        description: 'Strategic, observant scout and messenger who sees dangers from afar.',
        character_class: 'Wisdom Keeper',
        origin_city: 'Abuja, Lagos, Kano (Nigeria)',
        suit_style: 'Blue urban African spandex with gold trimmings, long braided hair with hijab',
        orb_color: '#3B82F6',
        orb_symbols: 'Blue glowing Orb with ancient Egyptian protective glyphs',
        avatar_url: '/images/characters/tenko.png',
        abilities: JSON.stringify({
          passive: ['Enhanced vision for pathfinding', 'Navigates high hurdles'],
          active: ['Foresight trajectory'],
          orb_ability: { name: 'Neck Extension', description: 'Reaches high platforms and airborne bonus fruits' }
        }),
        unlock_method: 'Level 5 Unlock',
        is_unlocked: true
      },
      {
        id: 'king_guardian',
        name: 'King the Guardian',
        identity_label: 'Dark-skinned Yoruba Male Superhero',
        description: 'Commanding warrior king with thunder-infused gauntlets protecting the sacred grounds.',
        character_class: 'Titan Defender',
        origin_city: 'Lagos Island, Nigeria',
        suit_style: 'Black & emerald ceremonial nano-armor with glowing adire patterns',
        orb_color: '#10B981',
        orb_symbols: 'Emerald thunder Orb with winged scarab motif',
        avatar_url: '/images/characters/king.png',
        abilities: JSON.stringify({
          passive: ['Shockwave shield', 'Heavy obstacle smash'],
          active: ['Thunder stomp'],
          orb_ability: { name: 'Titan Surge', description: 'Magnetizes all gold coins and destroys ground barriers' }
        }),
        unlock_method: 'Level 10 Unlock',
        is_unlocked: true
      }
    ];

    for (const c of characters) {
      await pool.query(
        `INSERT INTO supervi_characters
           (id, name, identity_label, description, character_class, origin_city, suit_style, orb_color, orb_symbols, avatar_url, abilities, unlock_method, is_unlocked, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12, $13, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           abilities = EXCLUDED.abilities,
           is_unlocked = EXCLUDED.is_unlocked,
           updated_at = NOW()`,
        [
          c.id, c.name, c.identity_label, c.description, c.character_class,
          c.origin_city, c.suit_style, c.orb_color, c.orb_symbols,
          c.avatar_url, c.abilities, c.unlock_method, c.is_unlocked
        ]
      );
    }
    console.log(`Seeded ${characters.length} SuperVi characters.`);

    // 3. Seed Powerups
    const powerups = [
      { id: 'shield_aegis', name: 'Aegis Energy Shield', description: 'Absorbs 1 collision with an obstacle or train', category: 'defense', cost: 150, icon: 'shield', duration_seconds: 20 },
      { id: 'magnet_pulse', name: 'Orb Coin Magnet', description: 'Pulls all coins and FIC tokens within 15 meters', category: 'utility', cost: 200, icon: 'magnet', duration_seconds: 15 },
      { id: 'speed_hyperdrive', name: 'Hyperdrive Booster', description: 'Accelerates speed by 2.5x with invincible flight', category: 'speed', cost: 350, icon: 'zap', duration_seconds: 10 }
    ];

    for (const p of powerups) {
      await pool.query(
        `INSERT INTO supervi_powerups (id, name, description, category, cost, icon, duration_seconds)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           cost = EXCLUDED.cost`,
        [p.id, p.name, p.description, p.category, p.cost, p.icon, p.duration_seconds]
      );
    }
    console.log(`Seeded ${powerups.length} SuperVi powerups.`);

    // 4. Seed Daily Challenges
    const challenges = [
      { id: 'chal_01', title: 'Lekki Sprint Challenge', description: 'Run 5,000 meters across Lekki-Ikoyi Bridge without crashing', target_value: 5000, reward_fic: 50, reward_coins: 1000, challenge_type: 'distance' },
      { id: 'chal_02', title: 'Golden Glyphs Collector', description: 'Collect 12 glowing Egyptian orbs in a single run', target_value: 12, reward_fic: 35, reward_coins: 800, challenge_type: 'orbs' },
      { id: 'chal_03', title: 'Speed Demon Combo', description: 'Achieve a 25x trick combo using Zara or King', target_value: 25, reward_fic: 40, reward_coins: 900, challenge_type: 'combo' }
    ];

    for (const ch of challenges) {
      await pool.query(
        `INSERT INTO supervi_daily_challenges (id, title, description, target_value, reward_fic, reward_coins, challenge_type, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, true)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           description = EXCLUDED.description,
           is_active = true`,
        [ch.id, ch.title, ch.description, ch.target_value, ch.reward_fic, ch.reward_coins, ch.challenge_type]
      );
    }
    console.log(`Seeded ${challenges.length} SuperVi daily challenges.`);

    // 5. Seed Leaderboards & Rankings
    await pool.query(`
      INSERT INTO supervi_leaderboards (id, name, description, category, rules, is_active)
      VALUES 
        ('global', 'SuperVi World Grand Prix', 'Top runners worldwide across all cities', 'global', '{"min_level": 1}'::jsonb, true),
        ('lagos', 'Lagos Expressway Sprint', 'Highest scores clocked in Lagos metropolis', 'city', '{"city": "Lagos"}'::jsonb, true)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        is_active = true;
    `);

    const records = [
      { id: 'rec-1', leaderboard_id: 'global', user_id: 'usr-001', username: 'Obinna_Sovereign', avatar_url: 'https://images.unsplash.com/photo-1534528741775?w=150', score: 145200, rank: 1, level: 14, character_id: 'zara_zephyr' },
      { id: 'rec-2', leaderboard_id: 'global', user_id: 'usr-002', username: 'Tunde_Vanguard', avatar_url: 'https://images.unsplash.com/photo-1507003211169?w=150', score: 128900, rank: 2, level: 12, character_id: 'king_guardian' },
      { id: 'rec-3', leaderboard_id: 'global', user_id: 'usr-003', username: 'Amara_Speedster', avatar_url: 'https://images.unsplash.com/photo-1494790108377?w=150', score: 114600, rank: 3, level: 11, character_id: 'tenko_gen' }
    ];

    for (const r of records) {
      await pool.query(
        `INSERT INTO supervi_leaderboard_records 
           (id, leaderboard_id, user_id, username, avatar_url, score, rank, level, character_id, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
         ON CONFLICT (id) DO UPDATE SET
           score = EXCLUDED.score,
           rank = EXCLUDED.rank`,
        [r.id, r.leaderboard_id, r.user_id, r.username, r.avatar_url, r.score, r.rank, r.level, r.character_id]
      );
    }
    console.log(`Seeded ${records.length} SuperVi rankings.`);

    // 6. Seed Achievements
    const achievements = [
      { id: 'ach_first_flight', title: 'First Flight', description: 'Complete your first run session with any hero', category: 'progression', difficulty: 'easy', points: 20, requirements: JSON.stringify({ runs: 1 }), rewards: JSON.stringify({ fic: 10 }) },
      { id: 'ach_orb_master', title: 'Orb Master', description: 'Collect 100 Egyptian glowing orbs', category: 'collection', difficulty: 'medium', points: 50, requirements: JSON.stringify({ orbs: 100 }), rewards: JSON.stringify({ fic: 25 }) },
      { id: 'ach_lagos_speedster', title: 'Lekki Sonic Boom', description: 'Reach top speed across the Lekki bridge for 60 seconds continuously', category: 'speed', difficulty: 'hard', points: 100, requirements: JSON.stringify({ continuous_speed_sec: 60 }), rewards: JSON.stringify({ fic: 50 }) }
    ];

    for (const a of achievements) {
      await pool.query(
        `INSERT INTO supervi_achievements
           (id, title, description, category, difficulty, points, icon, requirements, rewards, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, true)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           description = EXCLUDED.description,
           is_active = true`,
        [a.id, a.title, a.description, a.category, a.difficulty, a.points, a.icon, a.requirements, a.rewards]
      );
    }
    console.log(`Seeded ${achievements.length} SuperVi achievements.`);

    console.log('SuperVi seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding SuperVi:', err);
    process.exit(1);
  }
}

seedSuperVi();
