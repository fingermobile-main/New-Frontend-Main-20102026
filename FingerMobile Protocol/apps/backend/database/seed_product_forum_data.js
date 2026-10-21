require('dotenv').config({ path: '../.env' });
const logger = require('../config/logger');
const { identityDb, socialDb, contentDb } = require('../db/db');

async function seedData() {
  try {
    logger.info('Starting Product and Forum data seeding...');

    // 1. Seed Users (if not exists)
    logger.info('Seeding default users...');
    const userRes = await identityDb.query(`
      INSERT INTO users (username, email, password_hash, first_name, last_name, is_active)
      VALUES 
        ('johndoe', 'john@example.com', 'hashed_pass_placeholder', 'John', 'Doe', true),
        ('janedoe', 'jane@example.com', 'hashed_pass_placeholder', 'Jane', 'Doe', true),
        ('techguru', 'tech@example.com', 'hashed_pass_placeholder', 'Tech', 'Guru', true)
      ON CONFLICT (email) DO UPDATE SET username = EXCLUDED.username
      RETURNING id, uuid, username;
    `);
    const users = userRes.rows;
    const userId1 = users[0].id;
    const userId2 = users[1].id;
    const userId3 = users[2].id;

    // We must use the UUID for cross-database relations (socialDb, contentDb)
    const userUuid1 = users[0].uuid;
    const userUuid2 = users[1].uuid;
    const userUuid3 = users[2].uuid;

    logger.info(`✅ Seeded default users: ${userId1}, ${userId2}, ${userId3}`);

    // 2. Seed Products (Marketplace) in identityDb
    logger.info('Seeding marketplace products...');
    await identityDb.query(`
      INSERT INTO products (name, description, price, stock_quantity, creator_id, category, images, is_active, platform_type)
      VALUES 
        ('FingerLux Premium Widget', 'A premium widget for your dashboard with glassmorphism effects.', 19.99, 100, $1, 'UI Components', '{"https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400"}', true, 'marketplace'),
        ('FingerWars Starter Pack', 'Get started with FingerWars with this exclusive asset bundle.', 49.99, 50, $2, 'Gaming', '{"https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=400"}', true, 'marketplace'),
        ('BeatWave Pro License', 'Commercial license for BeatWave audio generation engine.', 149.00, 10, $3, 'Software', '{"https://images.unsplash.com/photo-1516280440502-62b1b3693fb1?auto=format&fit=crop&q=80&w=400"}', true, 'marketplace'),
        ('Creator Mentorship', '1-on-1 mentorship session for aspiring creators.', 99.00, 5, $1, 'Services', '{"https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400"}', true, 'marketplace'),
        ('Stercs E-Book: Mastering Short Form', 'Learn how to create viral content with Stercs.', 14.99, 500, $2, 'Education', '{"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400"}', true, 'marketplace')
    `, [userId1, userId2, userId3]);
    logger.info('✅ Seeded marketplace products');

    // 3. Seed Forum Categories in socialDb
    logger.info('Seeding forum categories...');
    const catRes = await socialDb.query(`
      INSERT INTO forum_categories (name, description)
      VALUES 
        ('General Discussion', 'Talk about anything related to FingerMobile.'),
        ('Tech Support', 'Get help with your FingerMobile products and integrations.'),
        ('Feature Requests', 'Suggest new features for the platform.')
      ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
      RETURNING id, name;
    `);
    const categories = catRes.rows;
    const catGeneral = categories.find(c => c.name === 'General Discussion').id;
    const catTech = categories.find(c => c.name === 'Tech Support').id;

    // 4. Seed Forums in socialDb
    logger.info('Seeding forums...');
    const forumRes = await socialDb.query(`
      INSERT INTO forums (name, description, category_id, is_active, thread_count, post_count)
      VALUES 
        ('Platform Updates', 'Official announcements and updates.', $1, true, 2, 5),
        ('Developer Lounge', 'Chat with other developers building on FingerMobile.', $1, true, 1, 3),
        ('API Troubleshooting', 'Help with API integration issues.', $2, true, 0, 0)
      RETURNING id, name;
    `, [catGeneral, catTech]);
    const forums = forumRes.rows;
    const forumUpdates = forums.find(f => f.name === 'Platform Updates').id;
    const forumDevs = forums.find(f => f.name === 'Developer Lounge').id;

    // 5. Seed Forum Threads in socialDb
    logger.info('Seeding forum threads...');
    const threadRes = await socialDb.query(`
      INSERT INTO forum_threads (forum_id, author_id, title, content, view_count, reply_count)
      VALUES 
        ($1, $3, 'Welcome to the FingerMobile Community!', 'We are excited to launch the new platform. Let us know what you think!', 150, 2),
        ($2, $4, 'How to use the new Glassmorphism UI?', 'Has anyone figured out the best way to apply the new glass classes to custom widgets?', 45, 1)
      RETURNING id;
    `, [forumUpdates, forumDevs, userUuid1, userUuid2]);
    const threads = threadRes.rows;

    // 6. Seed Forum Posts (Replies) in socialDb
    logger.info('Seeding forum posts...');
    await socialDb.query(`
      INSERT INTO forum_posts (thread_id, author_id, content)
      VALUES 
        ($1, $3, 'This looks amazing! Cant wait to start building.'),
        ($1, $4, 'Great work team!'),
        ($2, $5, 'You just need to add the "glass" class to your container div. It automatically applies the backdrop filter and border.')
    `, [threads[0].id, threads[1].id, userUuid2, userUuid3, userUuid1]);

    // 7. Seed Social Feed Posts in contentDb
    logger.info('Seeding social feed posts...');
    await contentDb.query(`
      INSERT INTO posts (author_id, content, type, media_urls, hashtags, likes_count, comments_count)
      VALUES 
        ($1, 'Just launched my new UI kit on the Marketplace! Check it out! #ui #design #glassmorphism', 'text', '[]', ARRAY['ui', 'design', 'glassmorphism'], 24, 3),
        ($2, 'Exploring the new BeatWave engine... the audio quality is insane! 🎵🔥', 'media', '["https://images.unsplash.com/photo-1516280440502-62b1b3693fb1?auto=format&fit=crop&q=80&w=400"]', ARRAY['audio', 'beatwave', 'music'], 56, 12),
        ($3, 'Who is going to the FingerMobile developer conference next month? 🚀', 'text', '[]', ARRAY['dev', 'conference', 'tech'], 18, 5)
    `, [userUuid1, userUuid2, userUuid3]);
    logger.info('✅ Seeded social feed posts');

    logger.info('Product and Forum data seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    logger.error('Error seeding data:', err);
    process.exit(1);
  }
}

seedData();
