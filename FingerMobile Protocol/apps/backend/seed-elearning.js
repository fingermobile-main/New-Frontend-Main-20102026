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
    console.log('Seeding E-Learning Academy...');

    // 1. Get instructor user ID
    const usersRes = await client.query('SELECT id, username FROM users LIMIT 2');
    if (usersRes.rows.length === 0) {
      console.log('No users available');
      return;
    }
    const instructor1 = usersRes.rows[0].id;
    const instructor2 = usersRes.rows[1] ? usersRes.rows[1].id : instructor1;

    // 2. Categories
    const catRes = await client.query(`
      INSERT INTO elearning_categories (name, description, slug, is_active)
      VALUES 
        ('Web3 & Sovereign Protocols', 'Decentralized identity, consensus mechanics, and cryptographic protocol architecture.', 'web3-sovereign', true),
        ('Digital Media & Audio Engineering', 'Sound design with BeatwaveNG, stem production, and Dancia-4Tv broadcasting.', 'media-audio', true),
        ('Autonomous AI & Agentic Systems', 'Building resilient multi-agent platforms and cognitive workflow automation.', 'autonomous-ai', true),
        ('African Creator Entrepreneurship', 'Monetizing digital content, copyright, Fic tokenomics, and Global Storefronts.', 'creator-business', true)
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
      RETURNING id, name;
    `);

    const c1 = catRes.rows[0]?.id || 1;
    const c2 = catRes.rows[1]?.id || c1;
    const c3 = catRes.rows[2]?.id || c1;
    const c4 = catRes.rows[3]?.id || c1;

    // 3. Courses
    await client.query(`
      INSERT INTO elearning_courses (
        category_id, instructor_id, title, description, short_description,
        thumbnail_url, level, language, duration_hours, price, is_published,
        enrollment_count, rating_average, rating_count, is_certificate_available
      ) VALUES 
        ($1, $5, 'FingerMobile Protocol Masterclass: Sovereign Identity & Payments', 'Comprehensive deep-dive into sovereign credentials, PIN exchange protocols, FIC settlement, and cross-border creator liquidity.', 'Master sovereign identity and on-chain protocol architecture in 12 hours.', 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600', 'intermediate', 'English', 12.5, 49.99, true, 342, 4.95, 128, true),
        ($2, $6, 'BeatwaveNG Sound Design & Audio Stems Production', 'Learn how to engineer high-fidelity spatial audio, master African percussion loops, and sell royalty-free stem packs on FingerMobile.', 'Produce professional audio stems and publish to BeatwaveNG.', 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600', 'beginner', 'English', 8.0, 29.99, true, 510, 4.88, 204, true),
        ($3, $5, 'Multi-Agent Autonomous Workflow Automation', 'Design, orchestrate, and supervise AI subagents using the Google Antigravity & MCP standards.', 'Autonomous agent systems for enterprise productivity.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600', 'advanced', 'English', 16.0, 79.99, true, 195, 4.98, 86, true),
        ($4, $6, 'Digital Media Monetization & Storefront Mastery', 'Step-by-step blueprint for scaling digital merchandise, booking live stages, and collecting on-chain royalties.', 'Monetize digital assets and physical merchandise effectively.', 'https://images.unsplash.com/photo-1556742049-0a67e557224f?w=600', 'beginner', 'English', 6.5, 19.99, true, 670, 4.91, 312, true)
      ON CONFLICT DO NOTHING;
    `, [c1, c2, c3, c4, instructor1, instructor2]);

    console.log('E-Learning categories and courses seeded successfully.');
  } catch (err) {
    console.error('Error seeding E-Learning:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
