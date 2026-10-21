const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  user: process.env.IDENTITY_DB_USER || process.env.DB_USER || 'postgres',
  host: process.env.IDENTITY_DB_HOST || process.env.DB_HOST || 'localhost',
  database: process.env.IDENTITY_DB_NAME || 'fingermobile_platform_db',
  password: process.env.IDENTITY_DB_PASSWORD || process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.IDENTITY_DB_PORT || process.env.DB_PORT || '5432', 10),
});

const csvDir = path.join(__dirname, '../../../Assets/CSV Files');

async function run() {
  console.log('🚀 Starting platform CSV assets import...');

  // 1. Ensure tables exist
  console.log('📦 Ensuring database tables and schema columns...');
  await pool.query(`
    -- Alter forum_categories
    ALTER TABLE forum_categories ADD COLUMN IF NOT EXISTS icon VARCHAR(500);
    ALTER TABLE forum_categories ADD COLUMN IF NOT EXISTS color VARCHAR(50) DEFAULT '#FFFFFF';
    ALTER TABLE forum_categories ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;
    ALTER TABLE forum_categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
    ALTER TABLE forum_categories ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
    ALTER TABLE forum_categories ADD COLUMN IF NOT EXISTS post_count INT DEFAULT 0;
    ALTER TABLE forum_categories ADD COLUMN IF NOT EXISTS view_count INT DEFAULT 0;
    ALTER TABLE forum_categories ADD COLUMN IF NOT EXISTS header_image TEXT;

    -- Alter forum_threads
    ALTER TABLE forum_threads ADD COLUMN IF NOT EXISTS category_id INT;
    ALTER TABLE forum_threads ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;
    ALTER TABLE forum_threads ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
    ALTER TABLE forum_threads ADD COLUMN IF NOT EXISTS last_post_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
    ALTER TABLE forum_threads ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
    ALTER TABLE forum_threads ADD COLUMN IF NOT EXISTS activity_type VARCHAR(100);

    -- Ensure blogs tables
    CREATE TABLE IF NOT EXISTS blogs (
      id SERIAL PRIMARY KEY,
      owner_id INT,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      theme_colors JSONB,
      social_links JSONB,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS blog_categories (
      id SERIAL PRIMARY KEY,
      blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      cover_image TEXT,
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      author_id INT,
      blog_id INTEGER,
      category_id INTEGER REFERENCES blog_categories(id) ON DELETE SET NULL,
      title VARCHAR(500) NOT NULL,
      slug VARCHAR(500) UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      cover_image TEXT,
      tags TEXT[],
      status VARCHAR(20) DEFAULT 'published',
      is_featured BOOLEAN DEFAULT false,
      views_count INTEGER DEFAULT 0,
      likes_count INTEGER DEFAULT 0,
      comments_count INTEGER DEFAULT 0,
      meta_keywords TEXT[],
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      published_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS blog_post_likes (
      id SERIAL PRIMARY KEY,
      post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
      user_id INT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(post_id, user_id)
    );

    -- Ensure groups tables
    CREATE TABLE IF NOT EXISTS groups (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100),
      is_public BOOLEAN DEFAULT true,
      creator_id INT,
      members_count INT DEFAULT 1,
      image_url TEXT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
    ALTER TABLE groups ADD COLUMN IF NOT EXISTS image_url TEXT;

    CREATE TABLE IF NOT EXISTS group_members (
      id SERIAL PRIMARY KEY,
      group_id INT REFERENCES groups(id) ON DELETE CASCADE,
      user_id INT,
      role VARCHAR(50) DEFAULT 'member',
      joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(group_id, user_id)
    );

    -- Ensure Loansqr_products
    CREATE TABLE IF NOT EXISTS Loansqr_products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      title VARCHAR(255),
      description TEXT,
      interest_rate NUMERIC(5,2) DEFAULT 15.00,
      max_amount NUMERIC(12,2) DEFAULT 500.00,
      loan_term_days INTEGER DEFAULT 14,
      eligibility_criteria JSONB,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✅ Schema tables verified.');

  // 2. Import Forum Categories
  const forumCatFile = path.join(csvDir, 'FingerMobile Forum Categories (1).csv');
  if (fs.existsSync(forumCatFile)) {
    const raw = fs.readFileSync(forumCatFile, 'utf8');
    const parsed = Papa.parse(raw, { header: true, skipEmptyLines: true });
    console.log(`📥 Importing ${parsed.data.length} forum categories...`);

    let count = 0;
    for (const row of parsed.data) {
      const name = (row.Name || '').trim();
      if (!name) continue;
      const desc = row.Description || '';
      const slug = (row.Slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim();
      const postCount = parseInt(row['Post Count']) || 0;
      const viewCount = parseInt(row['Post View Count']) || 0;
      const headerImage = row['Header Image'] || '';
      const rank = parseInt(row.Rank) || 0;

      // Extract text color if JSON
      let color = '#FFFFFF';
      try {
        if (row['Header Text Color'] && row['Header Text Color'].startsWith('{')) {
          color = JSON.parse(row['Header Text Color']).color || color;
        }
      } catch (_) {}

      // Icons mapping based on category name
      let icon = '💬';
      const nl = name.toLowerCase();
      if (nl.includes('tech') || nl.includes('gadget')) icon = '💻';
      else if (nl.includes('dating') || nl.includes('connect')) icon = '❤️';
      else if (nl.includes('movie')) icon = '🎬';
      else if (nl.includes('music')) icon = '🎵';
      else if (nl.includes('crypto')) icon = '🪙';
      else if (nl.includes('health')) icon = '🏥';
      else if (nl.includes('art')) icon = '🎨';
      else if (nl.includes('sport')) icon = '⚽';
      else if (nl.includes('kitchen') || nl.includes('food')) icon = '🍳';
      else if (nl.includes('give-away') || nl.includes('grant')) icon = '🎁';
      else if (nl.includes('news')) icon = '📰';
      else if (nl.includes('nature') || nl.includes('pet')) icon = '🌿';
      else if (nl.includes('law')) icon = '⚖️';
      else if (nl.includes('laff')) icon = '😄';
      else if (nl.includes('security')) icon = '🛡️';
      else if (nl.includes('college')) icon = '🎓';
      else if (nl.includes('sell') || nl.includes('shop')) icon = '🛍️';

      // Insert/update into forum_categories
      await pool.query(`
        INSERT INTO forum_categories (name, description, slug, post_count, view_count, header_image, color, icon, display_order, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
        ON CONFLICT (name) DO UPDATE SET
          description = EXCLUDED.description,
          slug = EXCLUDED.slug,
          post_count = EXCLUDED.post_count,
          view_count = EXCLUDED.view_count,
          header_image = EXCLUDED.header_image,
          icon = EXCLUDED.icon,
          color = EXCLUDED.color,
          display_order = EXCLUDED.display_order,
          is_active = true
      `, [name, desc, slug, postCount, viewCount, headerImage, color, icon, rank]);

      // Insert into forum_categories_detailed if table exists
      await pool.query(`
        INSERT INTO forum_categories_detailed (name, slug, description, icon, color, post_count, sort_order, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, true)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          icon = EXCLUDED.icon,
          color = EXCLUDED.color,
          post_count = EXCLUDED.post_count,
          sort_order = EXCLUDED.sort_order,
          is_active = true
      `, [name, slug, desc, icon, color, postCount, rank]).catch(() => {});

      count++;
    }
    console.log(`✅ Forum Categories imported: ${count}`);
  }

  // 3. Import Members from FullData Members CSV
  const membersFile = path.join(csvDir, 'FingerMobile FullData Members.csv');
  if (fs.existsSync(membersFile)) {
    const raw = fs.readFileSync(membersFile, 'utf8');
    const parsed = Papa.parse(raw, { header: true, skipEmptyLines: true });
    console.log(`📥 Importing ${parsed.data.length} members into users...`);

    let mCount = 0;
    for (const row of parsed.data) {
      const email = (row['Login Email'] || '').trim();
      if (!email) continue;
      const uuid = row.ID || null;
      const firstName = row['First Name'] || '';
      const lastName = row['Last Name'] || '';
      const username = (row.Slug || email.split('@')[0] || `user_${mCount}`).replace(/[^a-zA-Z0-9_-]/g, '_');
      const bio = row['About (Plain Text)'] || '';
      const avatarUrl = row['Profile Photo'] || null;
      const coverUrl = row['Cover Photo'] || null;
      const phone = row.Phone || null;
      const dateOfBirth = row.Birthdate && row.Birthdate.length >= 8 ? row.Birthdate : null;
      const isApproved = (row.Status || '').toUpperCase() === 'APPROVED';

      await pool.query(`
        INSERT INTO users (
          uuid, username, email, first_name, last_name, bio,
          avatar_url, avatar, cover_photo_url, phone, date_of_birth,
          is_active, is_verified, email_verified, onboarding_completed, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $7, $8, $9, $10,
          true, $11, true, true, NOW(), NOW()
        )
        ON CONFLICT (email) DO UPDATE SET
          first_name = COALESCE(EXCLUDED.first_name, users.first_name),
          last_name = COALESCE(EXCLUDED.last_name, users.last_name),
          bio = COALESCE(EXCLUDED.bio, users.bio),
          avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
          avatar = COALESCE(EXCLUDED.avatar, users.avatar),
          cover_photo_url = COALESCE(EXCLUDED.cover_photo_url, users.cover_photo_url),
          phone = COALESCE(EXCLUDED.phone, users.phone),
          is_verified = EXCLUDED.is_verified,
          onboarding_completed = true
      `, [uuid, username, email, firstName, lastName, bio, avatarUrl, coverUrl, phone, dateOfBirth, isApproved])
      .catch(e => {
        // Ignore duplicate username constraint by trying with unique suffix
        if (e.code === '23505') {
          return pool.query(`
            UPDATE users SET first_name = $1, last_name = $2, avatar_url = $3, bio = $4 WHERE email = $5
          `, [firstName, lastName, avatarUrl, bio, email]);
        }
      });

      mCount++;
    }
    console.log(`✅ Members processed: ${mCount}`);
  }

  // 4. Import Blog Categories & Blog Posts
  const blogCatFile = path.join(csvDir, 'FingerMobile Blog Categories.csv');
  let defaultBlogId = 1;
  const blogRes = await pool.query(`
    INSERT INTO blogs (owner_id, title, slug, description, is_active)
    VALUES (1, 'FingerMobile Official Chronicle', 'official-chronicle', 'Official FingerMobile Protocol publication & community perspectives.', true)
    ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
    RETURNING id
  `);
  if (blogRes.rows[0]) defaultBlogId = blogRes.rows[0].id;

  if (fs.existsSync(blogCatFile)) {
    const raw = fs.readFileSync(blogCatFile, 'utf8');
    const parsed = Papa.parse(raw, { header: true, skipEmptyLines: true });
    for (const row of parsed.data) {
      const label = row.Label || row.name;
      if (!label) continue;
      const slug = row.Slug || label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const desc = row.Description || '';
      const cover = row['Cover Image'] || null;

      await pool.query(`
        INSERT INTO blog_categories (blog_id, name, slug, description, cover_image, is_active)
        VALUES ($1, $2, $3, $4, $5, true)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          cover_image = EXCLUDED.cover_image
      `, [defaultBlogId, label, slug, desc, cover]);
    }
    console.log('✅ Blog Categories imported.');
  }

  const blogPostFile = path.join(csvDir, 'FingerMobile Blog Posts.csv');
  if (fs.existsSync(blogPostFile)) {
    const raw = fs.readFileSync(blogPostFile, 'utf8');
    const parsed = Papa.parse(raw, { header: true, skipEmptyLines: true });
    for (const row of parsed.data) {
      const title = row.Title;
      if (!title) continue;
      const slug = row.Slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const excerpt = row.Excerpt || '';
      const content = row['Plain Content'] || excerpt || title;
      const cover = row['Cover Image'] ? row['Cover Image'].replace('fingermobile:image://v1/', 'https://cdn.fingermobileprotocol.com/media/').replace('wix:image://v1/', 'https://cdn.fingermobileprotocol.com/media/').replace('https://static.wixstatic.com/media/', 'https://cdn.fingermobileprotocol.com/media/').split('#')[0] : null;
      const viewCount = parseInt(row['View Count']) || 0;
      const likeCount = parseInt(row['Like Count']) || 0;

      await pool.query(`
        INSERT INTO blog_posts (author_id, blog_id, title, slug, excerpt, content, cover_image, views_count, likes_count, status, is_featured)
        VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, 'published', true)
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          excerpt = EXCLUDED.excerpt,
          content = EXCLUDED.content,
          cover_image = EXCLUDED.cover_image,
          views_count = EXCLUDED.views_count,
          likes_count = EXCLUDED.likes_count,
          status = 'published'
      `, [defaultBlogId, title, slug, excerpt, content, cover, viewCount, likeCount]);
    }
    console.log('✅ Blog Posts imported.');
  }

  // 5. Import Marketplace Products
  const marketFile = path.join(csvDir, 'Marketplace Products.csv');
  if (fs.existsSync(marketFile)) {
    const raw = fs.readFileSync(marketFile, 'utf8');
    const parsed = Papa.parse(raw, { header: true, skipEmptyLines: true });
    console.log(`📥 Importing ${parsed.data.length} marketplace products...`);

    for (const row of parsed.data) {
      if (!row.name) continue;
      const price = parseFloat(row.price) || 0;
      const stock = parseInt(row.stock_quantity) || 10;
      const cat = row.category || 'General';
      const desc = row.description || '';

      await pool.query(`
        INSERT INTO products (name, description, price, stock_quantity, creator_id, category, is_active, platform_type)
        VALUES ($1, $2, $3, $4, 1, $5, true, 'marketplace')
      `, [row.name, desc, price, stock, cat]).catch(() => {});
    }
    console.log('✅ Marketplace Products imported.');
  }

  // 6. Import Loansqr Products
  const LoansqrFile = path.join(csvDir, 'Loansqr Products.csv');
  if (fs.existsSync(LoansqrFile)) {
    const raw = fs.readFileSync(LoansqrFile, 'utf8');
    const parsed = Papa.parse(raw, { header: true, skipEmptyLines: true });
    console.log(`📥 Importing ${parsed.data.length} Loansqr products...`);

    for (const row of parsed.data) {
      if (!row.name) continue;
      const title = row.name;
      const desc = row.description || '';
      const rate = parseFloat(row.interest_rate) || 15.0;
      const maxAmt = parseFloat(row.max_amount) || 500.0;
      const termDays = parseInt(row.loan_term_days) || 14;
      let crit = null;
      try {
        if (row.eligibility_criteria) crit = JSON.parse(row.eligibility_criteria);
      } catch (_) {}

      await pool.query(`
        INSERT INTO Loansqr_products (name, title, description, interest_rate, max_amount, loan_term_days, eligibility_criteria, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, true)
      `, [row.name, title, desc, rate, maxAmt, termDays, crit]).catch(() => {});
    }
    console.log('✅ Loansqr Products imported.');
  }

  // 7. Seed Initial Groups
  console.log('👥 Seeding platform groups...');
  const initialGroups = [
    { name: 'Tech Enthusiasts', description: 'Everything about hardware, coding, decentralized protocols and future innovations.', category: 'Technology', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60' },
    { name: 'Good Group', description: 'General welfare, community initiatives and peer empowerment conversations.', category: 'Community', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&auto=format&fit=crop&q=60' },
    { name: 'E-course Group', description: 'Skill acquisition, digital tutorials, creator Masterclasses and workshops.', category: 'Education', image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=500&auto=format&fit=crop&q=60' },
    { name: 'Camus Circle', description: 'Philosophical debates, absurdity, literary critiques, and cultural discourse.', category: 'Philosophy', image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=500&auto=format&fit=crop&q=60' },
    { name: 'Creative Artists & Film', description: 'Cinematography, short video production, music scoring and visual media.', category: 'Arts', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=500&auto=format&fit=crop&q=60' },
    { name: 'Crypto & Protocol Infinite', description: 'Discussions on tokenomics, decentralized ledger integrations, and FIC wallet utility.', category: 'Crypto', image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=500&auto=format&fit=crop&q=60' },
    { name: 'Lush & Romance Rendezvous', description: 'Sociallapidaires, meaningful matchmaking, and modern dating etiquette.', category: 'Social', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60' }
  ];

  for (const g of initialGroups) {
    const gRes = await pool.query(`
      INSERT INTO groups (name, description, category, image_url, creator_id, members_count, is_public)
      VALUES ($1, $2, $3, $4, 1, 14, true)
      ON CONFLICT DO NOTHING
      RETURNING id
    `, [g.name, g.description, g.category, g.image]);

    if (gRes.rows[0]) {
      await pool.query(`
        INSERT INTO group_members (group_id, user_id, role)
        VALUES ($1, 1, 'admin')
        ON CONFLICT DO NOTHING
      `, [gRes.rows[0].id]).catch(() => {});
    }
  }
  console.log('✅ Groups seeded.');

  // 8. Associate forum threads with categories
  const threads = await pool.query('SELECT id FROM forum_threads');
  const catRows = await pool.query('SELECT id FROM forum_categories');
  if (threads.rows.length > 0 && catRows.rows.length > 0) {
    for (let i = 0; i < threads.rows.length; i++) {
      const catId = catRows.rows[i % catRows.rows.length].id;
      await pool.query('UPDATE forum_threads SET category_id = $1 WHERE id = $2', [catId, threads.rows[i].id]);
    }
  }

  console.log('🎉 ALL CSV DATA AND ASSETS IMPORTED SUCCESSFULLY!');
  await pool.end();
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Import error:', err);
  process.exit(1);
});
