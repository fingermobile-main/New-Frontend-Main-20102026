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
    console.log('Creating jobs and job_applications tables...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        type VARCHAR(50) DEFAULT 'Full-time',
        category VARCHAR(100) DEFAULT 'Engineering',
        salary_range VARCHAR(100),
        experience_level VARCHAR(50) DEFAULT 'Mid-Level',
        description TEXT NOT NULL,
        requirements TEXT[] DEFAULT ARRAY[]::text[],
        benefits TEXT[] DEFAULT ARRAY[]::text[],
        creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
      CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);
      CREATE INDEX IF NOT EXISTS idx_jobs_created ON jobs(created_at DESC);

      CREATE TABLE IF NOT EXISTS job_applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        resume_url TEXT,
        cover_letter TEXT,
        portfolio_url TEXT,
        status VARCHAR(50) DEFAULT 'submitted',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(job_id, user_id)
      );

      CREATE INDEX IF NOT EXISTS idx_job_applications_user ON job_applications(user_id);
    `);

    // Fetch user for creator_id
    const userRes = await client.query('SELECT id FROM users LIMIT 1');
    const creatorId = userRes.rows[0]?.id || null;

    // Seed jobs
    const seedRes = await client.query(`
      INSERT INTO jobs (
        title, company, location, type, category, salary_range, experience_level,
        description, requirements, benefits, creator_id, is_active
      ) VALUES 
        (
          'Senior WebRTC & Audio Streaming Engineer',
          'FingerMobile Core Protocol Team',
          'Lagos, Nigeria (Hybrid / Remote)',
          'Full-time',
          'Engineering',
          '₦18,000,000 - ₦28,000,000 / yr',
          'Senior',
          'Build and scale high-concurrency low-latency audio pipelines powering BeatwaveNG, VoiceFeed, and real-time Stage broadcast nodes.',
          ARRAY['5+ years distributed systems with Node.js & Go', 'Deep expertise in WebRTC, Janus/MediaSoup SFU, Opus codec', 'Experience with PostgreSQL on-chain settlement hooks'],
          ARRAY['Health Insurance & Wellness Stipend', 'FIC Token Allocation & Protocol Equity', 'Annual Hardware Refresh & Co-working Allowance'],
          $1,
          true
        ),
        (
          'Afrobeats Sound Designer & DAW Specialist',
          'BeatwaveNG Labs',
          'Accra, Ghana / Remote',
          'Contract',
          'Audio Production',
          '₦1,200,000 / project',
          'Mid-Level',
          'Curate, engineer, and balance African indigenous percussion sample packs, spatial audio stem loops, and Dancia stage intro cues.',
          ARRAY['Proficiency in Ableton Live, FL Studio, or Logic Pro', 'Strong background in West/East African musical cadence', 'Experience licensing digital audio stems under Creative Commons / Web3'],
          ARRAY['Revenue share on stem sales in MiniStore', 'Direct access to verified headline artists and studios', 'Beatwave Pro subscription included'],
          $1,
          true
        ),
        (
          'Smart Contract Security Auditor (EVM / Substrate)',
          'FingerMobile Sovereign Security Enclave',
          'Remote (Global)',
          'Full-time',
          'Security',
          '$80,000 - $120,000 / yr (USD / FIC)',
          'Senior',
          'Audit and formally verify tokenized downloads, 6-8 digit PIN sovereign escrow contracts, and Tripartite Kill Switch logic.',
          ARRAY['3+ years smart contract auditing (Foundry, Slither, Certora)', 'Deep knowledge of reentrancy, access control, and gas optimization', 'Understanding of sovereign identity and biometric verification flows'],
          ARRAY['100% Remote flexibility', 'Unlimited PTO & Paid Conference Attendance', 'Emergency relocation support'],
          $1,
          true
        ),
        (
          'Creator Community Growth Manager',
          'FingerMobile Ecosystem Foundation',
          'Nairobi, Kenya (Hybrid)',
          'Full-time',
          'Community',
          'KSh 250,000 - 380,000 / mo',
          'Mid-Level',
          'Lead outreach to independent musicians, digital educators, and video creators across Sub-Saharan Africa to build sustainable storefront businesses.',
          ARRAY['Proven track record managing creator discord/telegram hubs', 'Experience organizing physical summits and online AMAs', 'Fluent in English and Swahili'],
          ARRAY['Performance-based Gem and FIC bonuses', 'Travel allowance for regional campus meetups', 'Flexible working hours'],
          $1,
          true
        )
      RETURNING id, title;
    `, [creatorId]);

    console.log(`Seeded ${seedRes.rows.length} jobs successfully.`);
  } catch (err) {
    console.error('Error seeding jobs:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
