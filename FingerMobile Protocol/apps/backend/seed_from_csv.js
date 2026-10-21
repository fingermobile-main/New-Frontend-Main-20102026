const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Papa = require('papaparse');
const logger = require('./utils/logger');
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');

const cleanCSVLine = (line) => line.replace(/\r/g, '').trim();

// Legacy MySQL seed function removed in favor of PostgreSQL seedDatabase below.

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fingermobile_main',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432')
});

async function seedUsers() {
  const filePath = path.join(__dirname, '../../Assets/CSV Files/FingerMobile FullData Members (1).csv');
  if (!fs.existsSync(filePath)) {
    logger.info('Users CSV not found');
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  // Process CSV content with better handling of special characters
  const processedContent = content
    .split('\n')
    .map(cleanCSVLine)
    .join('\n');

  // Parse CSV with error handling
  const parseResult = Papa.parse(processedContent, {
    header: true,
    skipEmptyLines: 'greedy', // Skip any line that doesn't have values
    transformHeader: header => header.trim(), // Clean header names
    transform: value => value.trim() // Trim all values
  });

  if (parseResult.errors.length > 0) {
    logger.warn('CSV parse warnings for users:', parseResult.errors);
  }

  const result = parseResult;

  logger.info(`Found ${result.data.length} users to import`);

  const client = await pool.connect();
  let count = 0;

  // First, create the system user if it doesn't exist
  try {
    await client.query(`
      INSERT INTO users (id, email, password_hash, username, full_name, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO NOTHING
    `, ['00000000-0000-0000-0000-000000000000', 'system@fingermobileprotocol.com', 'hash', 'system', 'System User', 'admin']);
    logger.info('Created/ensured system user exists');
  } catch (e) {
    logger.error('Error inserting system user', e.message);
  }

  for (const row of result.data) {
    try {
      const email = row['Login Email'] || `user_${uuidv4().substring(0, 8)}@example.com`;
      const id = row['ID'] || uuidv4();
      const firstName = row['First Name'] || '';
      const lastName = row['Last Name'] || '';
      const fullName = (firstName + ' ' + lastName).trim() || row['Nickname'] || 'Unknown User';
      const avatarUrl = row['Profile Photo'] || null;
      const username = row['Slug'] || row['Nickname'] || `user_${uuidv4().substring(0, 8)}`;

      await client.query(
        `INSERT INTO users (id, email, password_hash, username, full_name, avatar_url, role) 
         VALUES ($1, $2, $3, $4, $5, $6, 'user')
         ON CONFLICT (id) DO UPDATE SET 
           email = EXCLUDED.email,
           username = EXCLUDED.username,
           full_name = EXCLUDED.full_name,
           avatar_url = EXCLUDED.avatar_url`,
        [id, email, 'hash_placeholder', username, fullName, avatarUrl]
      );
      count++;
    } catch (e) {
      logger.error('Error inserting user', row['Login Email'], e.message);
    }
  }

  client.release();
  logger.info(`Successfully imported ${count} users`);
}

async function seedPosts() {
  const filePath = path.join(__dirname, '../../Assets/CSV Files/FingerMobile Blog Posts.csv');
  if (!fs.existsSync(filePath)) {
    logger.info('Posts CSV not found');
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  // Process CSV content with better handling of special characters
  const processedContent = content
    .split('\n')
    .map(cleanCSVLine)
    .join('\n');

  // Parse CSV with error handling
  const parseResult = Papa.parse(processedContent, {
    header: true,
    skipEmptyLines: 'greedy', // Skip any line that doesn't have values
    transformHeader: header => header.trim(), // Clean header names
    transform: value => value.trim() // Trim all values
  });

  if (parseResult.errors.length > 0) {
    logger.warn('CSV parse warnings for posts:', parseResult.errors);
  }

  const result = parseResult;

  logger.info(`Found ${result.data.length} posts to import`);

  const client = await pool.connect();
  let count = 0;

  for (const row of result.data) {
    try {
      // If the row['ID'] is a 24-character hex (MongoDB ObjectID), we can't use it directly as a UUID
      let id = row['ID'];
      if (!id || id.length === 24) {
        id = uuidv4();
      }

      const title = row['Title'] || 'Untitled';
      const content = row['Plain Content'] || row['Excerpt'] || '';
      const authorId = row['Author'] || '00000000-0000-0000-0000-000000000000';
      const likes = parseInt(row['Like Count']) || 0;

      // Ensure the author exists, if not create a dummy one
      await client.query(`
        INSERT INTO users (id, email, password_hash, username, full_name)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO NOTHING
      `, [authorId, `author_${authorId}@example.com`, 'hash', `author_${authorId}`, 'Author']);

      // Let's insert into `community_posts` as it seems to be the one queried by `useForumPosts`
      await client.query(`
        INSERT INTO community_posts (id, title, content, author_id, community_id, like_count)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET 
          title = EXCLUDED.title,
          content = EXCLUDED.content,
          like_count = EXCLUDED.like_count
      `, [
        id,
        title,
        content,
        authorId,
        '638f7ece-81ba-0800-12b7-000000009320', // General Discussion dummy community
        likes
      ]);
      count++;
    } catch (e) {
      logger.error('Error inserting post', row['Title'], e.message);
    }
  }

  client.release();
  logger.info(`Successfully imported ${count} posts`);
}

async function executeSQLFile(filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    logger.info(`Executing SQL file: ${filePath}`);

    // Split and execute queries separately to handle multiple statements
    const queries = sql.split(/;\s*(?=\n|$)/).filter(query => query.trim());

    for (const query of queries) {
      if (query.trim()) {
        try {
          await pool.query(query);
          logger.info(`Successfully executed query from ${path.basename(filePath)}: ${query.substring(0, 50)}...`);
          logger.info(`Query was: ${query}`);
        } catch (error) {
          logger.error(`Error executing query from ${path.basename(filePath)}`, error.message);
          logger.error(`Query was: ${query}`);
        }
      }
    }
  } catch (error) {
    logger.error(`Error reading or executing SQL file ${filePath}:`, error.message);
  }
}

async function seedDatabase() {
  logger.info('Starting database seeding process...');

  try {
    // First, ensure the system user exists (with ID '00000000-0000-0000-0000-000000000000')
    const systemUserId = '00000000-0000-0000-0000-000000000000';
    const systemUserCheck = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [systemUserId]
    );

    if (systemUserCheck.rows.length === 0) {
      logger.info('Creating system user...');
      await pool.query(`
        INSERT INTO users (id, email, full_name, is_verified, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING`,
      [
        systemUserId,
        'system@fingermobileprotocol.com',
        'System User',
        true
      ]
      );
      logger.info('System user created successfully.');
    } else {
      logger.info('System user already exists.');
    }

    // Define the SQL files to execute
    const sqlFiles = [
      'import_forum_categories.sql',
      'import_forum_posts.sql',
      'import_forum_comments.sql',
      'import_community_posts.sql',
      'import_community_comments.sql'
    ];

    // Execute each SQL file
    for (const file of sqlFiles) {
      const filePath = path.join(__dirname, 'database', file);
      if (fs.existsSync(filePath)) {
        logger.info(`\nProcessing ${file}...`);
        await executeSQLFile(filePath);
      } else {
        logger.warn(`File does not exist: ${filePath}`);
      }
    }

    logger.info('\nDatabase seeding completed successfully!');
  } catch (error) {
    logger.error('Error during seeding process:', error.message);
  }
}

async function main() {
  try {
    logger.info('Starting DB Seeder...');

    // Test connection first
    await pool.query('SELECT NOW()');
    logger.info('Connected to DB successfully.');

    // First ensure system user exists and run SQL files
    await seedDatabase();

    // Then seed users to populate with real data
    await seedUsers();

    // Finally seed posts
    await seedPosts();

    logger.info('Seeding completed successfully');
  } catch (e) {
    logger.error('Fatal error during seeding:', e);
  } finally {
    // Only close the pool once at the very end
    setTimeout(async () => {
      await pool.end();
      logger.info('Database connection closed.');
      process.exit(0); // Exit the process to avoid hanging
    }, 1000); // Small delay to allow logs to flush
  }
}

main();
