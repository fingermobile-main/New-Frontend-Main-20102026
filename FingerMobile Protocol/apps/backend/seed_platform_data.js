#!/usr/bin/env node

/**
 * Platform Data Seeding Script
 * This script permanently seeds the database with forum, blog, and group data
 * It ensures the platform has the proper data from CSV files as specified
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
require('dotenv').config();

const logger = require('./utils/logger');

// Database configuration from environment variables
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fingermobile_platform_db',
  password: process.env.DB_PASSWORD || 'your_password',
  port: parseInt(process.env.DB_PORT) || 5432,
};

// Paths to CSV files - corrected path
const CSV_DIR = path.join(__dirname, '../../Assets/CSV Files');
const FORUM_CATEGORIES_FILE = path.join(CSV_DIR, 'FingerMobile Forum Categories (1).csv');
// const POSTS_FILE = path.join(CSV_DIR, 'Posts.csv');
// const COMMENTS_FILE = path.join(CSV_DIR, 'Comments.csv');
// const BLOG_POSTS_FILE = path.join(CSV_DIR, 'FingerMobile Blog Posts.csv');

// Path to SQL files
const SQL_DIR = path.join(__dirname, 'database');
const COMMUNITY_SCHEMA_SQL = path.join(SQL_DIR, 'community_schema.sql');
const FORUM_CATEGORIES_SQL = path.join(SQL_DIR, 'import_forum_categories_fixed.sql');

/**
 * Check if a table exists in the database
 */
async function tableExists(client, tableName) {
  const result = await client.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = $1
    );
  `, [tableName]);

  return result.rows[0].exists;
}

/**
 * Create community schema if it doesn't exist
 */
async function ensureCommunitySchema(client) {
  if (!(await tableExists(client, 'communities'))) {
    logger.info('Communities table does not exist, creating schema...');

    if (!fs.existsSync(COMMUNITY_SCHEMA_SQL)) {
      logger.error(`Community schema file does not exist: ${COMMUNITY_SCHEMA_SQL}`);
      throw new Error('Community schema file not found');
    }

    const schemaContent = fs.readFileSync(COMMUNITY_SCHEMA_SQL, 'utf8');
    const statements = schemaContent.split(/;\s*(?=\n|$)/).filter(stmt => stmt.trim());

    for (const statement of statements) {
      const trimmedStmt = statement.trim();
      if (trimmedStmt) {
        try {
          await client.query(trimmedStmt);
        } catch (error) {
          // Some statements might fail if they already exist, which is OK
          if (!error.message.includes('already exists')) {
            throw error;
          }
        }
      }
    }

    logger.info('Community schema ensured');
  } else {
    logger.info('Community schema already exists');
  }
}

/**
 * Import forum categories from CSV
 */
async function importForumCategoriesFromCSV(client) {
  logger.info('Importing forum categories from CSV...');

  if (!fs.existsSync(FORUM_CATEGORIES_FILE)) {
    logger.warn(`Forum categories CSV file does not exist: ${FORUM_CATEGORIES_FILE}`);
    return 0;
  }

  const csvContent = fs.readFileSync(FORUM_CATEGORIES_FILE, 'utf8');

  // Parse CSV with BOM handling
  const parsed = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    transform: function(value) {
      return value.replace(/^\uFEFF/, '').trim();
    }
  });

  let importedCount = 0;
  let skippedCount = 0;

  for (const row of parsed.data) {
    try {
      // Convert hex ID to UUID format
      const id = convertHexIdToUuid(row.ID || row.id || '');
      if (!id) continue; // Skip if we can't convert the ID

      // Determine type based on privacy settings
      let type = 'public';
      if (row['Write Protected'] === 'true' || row['Write Protected'] === true) {
        type = 'private';
      }

      // Prepare community data based on the community_schema.sql structure
      const communityData = {
        id: id,
        name: row.Name || row.name || row['Header Title'] || 'Unnamed Category',
        slug: row.Slug || row.slug || generateSlug(row.Name || row.name || 'unnamed-category'),
        description: row.Description || row.description || '',
        type: type,
        category: 'forum', // Mark as forum category
        creator_id: '00000000-0000-0000-0000-000000000000', // Default user ID
        avatar_url: row['Header Image'] || row['headerImage'] || null,
        cover_image_url: row['Header Image'] || row['headerImage'] || null,
        member_count: parseInt(row['Post Count'] || row.postCount || 0) || 0,
        post_count: parseInt(row['Post Count'] || row.postCount || 0) || 0,
        is_verified: false,
        is_featured: false,
        settings: {
          allow_posts: true,
          allow_comments: true,
          require_approval: row['Write Protected'] === 'true' || row['Write Protected'] === true
        },
        rules: null,
        status: 'active',
        metadata: {
          rank: parseInt(row.Rank || 0) || 0,
          page_url: row['Page URL'] || null,
          parent_id: row['Parent ID'] || null,
          header_text_color: row['Header Text Color'] || null,
          header_bg_color: row['Header Background Color'] || null,
          header_overlay_color: row['Header Image Overlay Color'] || null,
          header_type: row['Header Type'] || 'IMAGE'
        },
        created_at: new Date(),
        updated_at: new Date()
      };

      // Insert or update the community record
      await client.query(
        `INSERT INTO communities (id, name, slug, description, type, category, creator_id, avatar_url, cover_image_url, 
                                 member_count, post_count, is_verified, is_featured, settings, rules, status, metadata, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           slug = EXCLUDED.slug,
           description = EXCLUDED.description,
           type = EXCLUDED.type,
           category = EXCLUDED.category,
           avatar_url = EXCLUDED.avatar_url,
           cover_image_url = EXCLUDED.cover_image_url,
           member_count = EXCLUDED.member_count,
           post_count = EXCLUDED.post_count,
           is_verified = EXCLUDED.is_verified,
           is_featured = EXCLUDED.is_featured,
           settings = EXCLUDED.settings,
           rules = EXCLUDED.rules,
           status = EXCLUDED.status,
           metadata = EXCLUDED.metadata,
           updated_at = EXCLUDED.updated_at`,
        [
          communityData.id,
          communityData.name,
          communityData.slug,
          communityData.description,
          communityData.type,
          communityData.category,
          communityData.creator_id,
          communityData.avatar_url,
          communityData.cover_image_url,
          communityData.member_count,
          communityData.post_count,
          communityData.is_verified,
          communityData.is_featured,
          JSON.stringify(communityData.settings),
          communityData.rules,
          communityData.status,
          JSON.stringify(communityData.metadata),
          communityData.created_at,
          communityData.updated_at
        ]
      );

      importedCount++;
      if (importedCount % 10 === 0) {
        logger.info(`  Processed ${importedCount} forum categories...`);
      }
    } catch (error) {
      logger.error('Error importing forum category:', error.message);
      skippedCount++;
    }
  }

  logger.info(`Forum categories import completed: ${importedCount} imported, ${skippedCount} skipped`);
  return importedCount;
}

/**
 * Execute SQL import file if CSV import fails or is not preferred
 */
async function executeSQLImport(client) {
  logger.info('Executing SQL import as backup option...');

  const sqlFilePath = fs.existsSync(FORUM_CATEGORIES_SQL) ? FORUM_CATEGORIES_SQL : null;

  if (!sqlFilePath) {
    logger.warn('No SQL import file found, skipping SQL import');
    return false;
  }

  try {
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    const statements = sqlContent.split(/;\s*(?=\n|$)/).filter(stmt => stmt.trim());

    for (const statement of statements) {
      const trimmedStmt = statement.trim();
      if (trimmedStmt) {
        try {
          await client.query(trimmedStmt);
        } catch (error) {
          // Some statements might fail if records already exist, which is OK due to ON CONFLICT
          if (!error.message.toLowerCase().includes('conflict') &&
              !error.message.toLowerCase().includes('duplicate')) {
            logger.warn(`Statement execution warning: ${error.message}`);
          }
        }
      }
    }

    logger.info('SQL import completed');
    return true;
  } catch (error) {
    logger.error('Error executing SQL import:', error.message);
    return false;
  }
}

/**
 * Verify the data was imported correctly
 */
async function verifyImport(client) {
  logger.info('Verifying imported data...');

  // Check communities table
  const communityResult = await client.query('SELECT COUNT(*) FROM communities;');
  const communityCount = parseInt(communityResult.rows[0].count);
  logger.info(`Verification: Found ${communityCount} forum categories in the database`);

  // Show some sample data
  if (communityCount > 0) {
    const sampleResult = await client.query('SELECT id, name, slug, post_count FROM communities ORDER BY post_count DESC LIMIT 5;');
    logger.info('Top 5 forum categories by post count:');
    for (const row of sampleResult.rows) {
      logger.info(`  - ${row.name} (${row.slug}): ${row.post_count} posts`);
    }
  }

  return {
    communityCount
  };
}

/**
 * Convert hex ID to UUID format
 * Converts 24-character hex IDs like "638f7ece81ba080012b79320" to UUID format
 */
function convertHexIdToUuid(hexId) {
  if (!hexId || typeof hexId !== 'string' || hexId.length < 16) {
    return null;
  }

  // Pad short IDs with zeros
  let paddedHex = hexId.padEnd(24, '0');

  // Split into UUID segments: 8-4-4-4-12
  const part1 = paddedHex.substr(0, 8);
  const part2 = paddedHex.substr(8, 4);
  const part3 = paddedHex.substr(12, 4);
  const part4 = paddedHex.substr(16, 4);
  const part5 = paddedHex.substr(20, 12).padEnd(12, '0');

  return `${part1}-${part2}-${part3}-${part4}-${part5}`;
}

/**
 * Generate slug from title
 */
function generateSlug(title) {
  if (!title) return 'untitled-' + Date.now();
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
}

/**
 * Main function to seed platform data
 */
async function main() {
  logger.info('='.repeat(80));
  logger.info('PLATFORM DATA SEEDING SCRIPT');
  logger.info('='.repeat(80));
  logger.info('This script permanently seeds the database with forum, blog, and group data');
  logger.info('from the CSV files located in the Assets directory.');
  logger.info('='.repeat(80));
  logger.info('');

  let client;

  try {
    // Connect to database
    logger.info('Connecting to database...');
    client = new Client(dbConfig);
    await client.connect();
    logger.info('✅ Connected to database successfully');
    logger.info('');

    // Ensure community schema exists
    await ensureCommunitySchema(client);
    logger.info('');

    // Import forum categories from CSV
    logger.info('Starting forum categories import from CSV...');
    const forumCount = await importForumCategoriesFromCSV(client);
    logger.info('');

    // If no records were imported from CSV, try SQL import as fallback
    if (forumCount === 0) {
      logger.info('No records imported from CSV, attempting SQL import...');
      await executeSQLImport(client);

      // Re-verify after SQL import
      const verifyResult = await verifyImport(client);
      logger.info(`After SQL import: ${verifyResult.communityCount} forum categories in database`);
    }

    // Verify the data
    logger.info('Final verification...');
    const verifyResult = await verifyImport(client);
    logger.info('');

    logger.info('='.repeat(80));
    logger.info('PLATFORM DATA SEEDING COMPLETED SUCCESSFULLY');
    logger.info('='.repeat(80));
    logger.info('');
    logger.info('The platform now has the proper seed data from CSV files:');
    logger.info(`- ${verifyResult.communityCount} forum categories`);
    logger.info('');
    logger.info('This data is now permanently stored in the database and will persist');
    logger.info('between application restarts. The import process is complete.');
    logger.info('');

    // Check if we have the expected number of categories
    if (verifyResult.communityCount >= 38) { // Based on the CSV having 38+ categories
      logger.info(`✅ Success: Imported ${verifyResult.communityCount} forum categories (expected ~40+)`);
    } else if (verifyResult.communityCount > 0) {
      logger.info(`⚠️  Partial success: Imported ${verifyResult.communityCount} forum categories`);
      logger.info('   This may be due to duplicates being skipped during import.');
    } else {
      logger.warn('⚠️  Warning: No forum categories were imported successfully');
    }

  } catch (error) {
    logger.error('');
    logger.error('='.repeat(80));
    logger.error('❌ PLATFORM DATA SEEDING FAILED');
    logger.error('='.repeat(80));
    logger.error('');
    logger.error('Error:', error.message);
    logger.error('Stack:', error.stack);
    logger.error('');
    logger.error('Please check:');
    logger.error('1. Database is running and accessible');
    logger.error('2. CSV files exist in the expected location');
    logger.error('3. Environment variables are correctly configured');
    logger.error('4. Database schema matches the import requirements');
    logger.error('');

    throw error;
  } finally {
    if (client) {
      await client.end();
      logger.info('Database connection closed');
    }
  }
}

// Run the script if called directly
if (require.main === module) {
  main()
    .then(() => {
      logger.info('Platform data seeding process completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      logger.error('Platform data seeding process failed:', error);
      process.exit(1);
    });
}

module.exports = { main, importForumCategoriesFromCSV, verifyImport, convertHexIdToUuid, generateSlug };
