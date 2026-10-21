const { socialDb, contentDb, monetizationDb } = require('./db');
const logger = require('../utils/logger');

async function initializeTables() {
  try {
    logger.info('Initializing fingermobile_social_db tables...');
    await socialDb.query(`
      CREATE TABLE IF NOT EXISTS members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        membername VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(255)
      );
      
      CREATE TABLE IF NOT EXISTS forum_categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS forums (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category_id UUID REFERENCES forum_categories(id),
        created_by UUID REFERENCES members(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS forum_threads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        forum_id UUID REFERENCES forums(id),
        author_id UUID REFERENCES members(id),
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        is_sticky BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_post_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS forum_posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        thread_id UUID REFERENCES forum_threads(id),
        author_id UUID REFERENCES members(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    logger.info('Initializing fingermobile_content_db tables...');
    await contentDb.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content TEXT NOT NULL,
        author_id UUID NOT NULL,
        likes_count INT DEFAULT 0,
        comments_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    logger.info('Initializing fingermobile_monetization_db tables...');
    await monetizationDb.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sku VARCHAR(100),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        seller_id UUID NOT NULL,
        stock INT DEFAULT 0,
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    logger.info('Inserting seed data...');

    // Seed forum category
    const catRes = await socialDb.query(`
      INSERT INTO forum_categories (name, description) 
      SELECT 'General Discussion', 'General discussion category'
      WHERE NOT EXISTS (SELECT id FROM forum_categories LIMIT 1)
      RETURNING id;
    `);

    let categoryId = catRes.rows[0]?.id;
    if (!categoryId) {
      const existingCat = await socialDb.query('SELECT id FROM forum_categories LIMIT 1');
      categoryId = existingCat.rows[0]?.id;
    }

    // Seed member
    const memRes = await socialDb.query(`
      INSERT INTO members (membername, avatar_url)
      SELECT 'AdminUser', 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminUser'
      WHERE NOT EXISTS (SELECT id FROM members LIMIT 1)
      RETURNING id;
    `);
    let memberId = memRes.rows[0]?.id;
    if (!memberId) {
      const existingMem = await socialDb.query('SELECT id FROM members LIMIT 1');
      memberId = existingMem.rows[0]?.id;
    }

    if (categoryId && memberId) {
      const forumRes = await socialDb.query(`
          INSERT INTO forums (title, name, description, category_id, created_by)
          SELECT 'Welcome Forum', 'Welcome Forum', 'Introduce yourself here', $1, $2
          WHERE NOT EXISTS (SELECT id FROM forums LIMIT 1)
          RETURNING id;
       `, [categoryId, memberId]);

      let forumId = forumRes.rows[0]?.id;
      if (!forumId) {
        const existingForum = await socialDb.query('SELECT id FROM forums LIMIT 1');
        forumId = existingForum.rows[0]?.id;
      }

      if (forumId) {
        const threadRes = await socialDb.query(`
            INSERT INTO forum_threads (forum_id, author_id, title, content)
            SELECT $1, $2, 'Welcome to the new FingerMobile', 'We are glad to have you here!'
            WHERE NOT EXISTS (SELECT id FROM forum_threads LIMIT 1)
            RETURNING id;
          `, [forumId, memberId]);

        let threadId = threadRes.rows[0]?.id;
        if (!threadId) {
          const existingThread = await socialDb.query('SELECT id FROM forum_threads LIMIT 1');
          threadId = existingThread.rows[0]?.id;
        }

        if (threadId) {
          await socialDb.query(`
               INSERT INTO forum_posts (thread_id, author_id, content)
               SELECT $1, gen_random_uuid(), 'First reply! Hello everyone.'
               WHERE NOT EXISTS (SELECT id FROM forum_posts LIMIT 1);
            `, [threadId]);
        }
      }
    }

    // Seed Content DB posts
    if (memberId) {
      await contentDb.query(`
           INSERT INTO posts (title, content, author_id, likes_count, comments_count)
           SELECT 'Welcome Post', 'Welcome to the platform! This is our first post.', $1, 10, 5
           WHERE NOT EXISTS (SELECT id FROM posts LIMIT 1);
        `, [memberId]);
    }

    // Seed Marketplace product
    if (memberId) {
      await monetizationDb.query(`
        INSERT INTO products (name, description, price, seller_id, stock)
        SELECT 'FingerMobile Premium Account', '1 Year Subscription', 99.99, $1, 100
        WHERE NOT EXISTS (SELECT id FROM products LIMIT 1);
      `, [memberId]);
    }

    logger.info('Database initialization completed successfully.');
    process.exit(0);
  } catch (err) {
    logger.error('Error initializing database:', err);
    process.exit(1);
  }
}

initializeTables();
