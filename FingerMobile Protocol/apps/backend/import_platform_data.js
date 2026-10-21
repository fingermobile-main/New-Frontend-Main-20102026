#!/usr/bin/env node

/**
 * Comprehensive Platform Data Import Script
 * Imports forum categories, blog posts, and groups from CSV files
 * Uses the community schema and proper data mapping
 */

const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
require('dotenv').config();

const logger = require('./utils/logger');

// Import models
const { sequelize } = require('./database/connection');
// const ForumCategory = require('./models/forumCategory');
const Blog = require('./models/blog');
const Group = require('./models/group');
// const { Forum, Topic } = require('./models/forum');

// Paths to CSV files
const CSV_DIR = path.join(__dirname, '../Assets/CSV Files');
const FORUM_CATEGORIES_FILE = path.join(CSV_DIR, 'FingerMobile Forum Categories (1).csv');
const BLOG_POSTS_FILE = path.join(CSV_DIR, 'FingerMobile Blog Posts.csv');
// const BLOG_CATEGORIES_FILE = path.join(CSV_DIR, 'FingerMobile Blog Categories.csv');
// const BLOG_TAGS_FILE = path.join(CSV_DIR, 'FingerMobile Blog Tags.csv');
// const MEMBERS_FILE = path.join(CSV_DIR, 'FingerMobile FullData Members.csv');

// Ensure the CSV directory exists
if (!fs.existsSync(CSV_DIR)) {
  logger.error(`CSV directory does not exist: ${CSV_DIR}`);
  process.exit(1);
}

/**
 * Import forum categories from CSV
 */
async function importForumCategories() {
  logger.info('Importing forum categories...');

  if (!fs.existsSync(FORUM_CATEGORIES_FILE)) {
    logger.warn(`Forum categories file not found: ${FORUM_CATEGORIES_FILE}`);
    return 0;
  }

  const csvContent = fs.readFileSync(FORUM_CATEGORIES_FILE, 'utf8');

  // Parse CSV with BOM handling
  const parsed = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    transform: function(value) {
      // Remove BOM if present and trim whitespace
      return value.replace(/^\uFEFF/, '').trim();
    }
  });

  let importedCount = 0;
  let skippedCount = 0;

  for (const row of parsed.data) {
    try {
      // Convert hex ID to UUID format
      let uuid = convertHexIdToUuid(row.ID || row.id || '');

      // If no valid ID in CSV, let DB auto-generate
      if (!uuid) {
        uuid = undefined;
      }

      // Determine type based on privacy settings
      let type = 'public';
      if (row['Write Protected'] === 'true' || row['Write Protected'] === true) {
        type = 'private';
      }

      // Prepare category data
      const categoryData = {
        id: uuid,
        name: row.Name || row.name || row['Header Title'] || 'Unnamed Category',
        slug: row.Slug || row.slug || generateSlug(row.Name || row.name || 'unnamed-category'),
        description: row.Description || row.description || '',
        type: type,
        avatar_url: row['Header Image'] || row['headerImage'] || null,
        cover_image_url: row['Header Image'] || row['headerImage'] || null,
        post_count: parseInt(row['Post Count'] || row.postCount || 0) || 0,
        settings: {
          allow_posts: true,
          allow_comments: true,
          require_approval: false
        },
        creator_id: '00000000-0000-0000-0000-000000000000', // Default user ID
        created_at: new Date(),
        updated_at: new Date()
      };

      // Insert or update the community record
      await sequelize.query(
        `INSERT INTO communities (id, name, slug, description, type, creator_id, avatar_url, cover_image_url, post_count, settings, created_at, updated_at)
         VALUES (:id, :name, :slug, :description, :type, :creator_id, :avatar_url, :cover_image_url, :post_count, :settings, :created_at, :updated_at)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           slug = EXCLUDED.slug,
           description = EXCLUDED.description,
           type = EXCLUDED.type,
           avatar_url = EXCLUDED.avatar_url,
           cover_image_url = EXCLUDED.cover_image_url,
           post_count = EXCLUDED.post_count,
           settings = EXCLUDED.settings,
           updated_at = EXCLUDED.updated_at`,
        {
          replacements: {
            id: categoryData.id,
            name: categoryData.name,
            slug: categoryData.slug,
            description: categoryData.description,
            type: categoryData.type,
            creator_id: categoryData.creator_id,
            avatar_url: categoryData.avatar_url,
            cover_image_url: categoryData.cover_image_url,
            post_count: categoryData.post_count,
            settings: JSON.stringify(categoryData.settings),
            created_at: categoryData.created_at,
            updated_at: categoryData.updated_at
          },
          type: sequelize.QueryTypes.INSERT
        }
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
 * Import blog posts from CSV
 */
async function importBlogPosts() {
  logger.info('Importing blog posts...');

  if (!fs.existsSync(BLOG_POSTS_FILE)) {
    logger.warn(`Blog posts file not found: ${BLOG_POSTS_FILE}`);
    return 0;
  }

  const csvContent = fs.readFileSync(BLOG_POSTS_FILE, 'utf8');

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
      // Find or create a default author
      // For now, we'll use a default UUID as the author ID
      const authorId = '00000000-0000-0000-0000-000000000000';

      const blogData = {
        title: row.Title || row.title || 'Untitled Blog Post',
        slug: row.Slug || row.slug || generateSlug(row.Title || 'untitled-blog-post'),
        content: row['Rich Content'] || row['Plain Content'] || row.content || '',
        excerpt: row.Excerpt || row.excerpt || '',
        featuredImage: row['Cover Image'] || row.coverImage || null,
        authorId: authorId,
        category: row.Category || row.category || 'General',
        status: 'published', // Assuming CSV data is ready to publish
        viewCount: parseInt(row['View Count'] || row.viewCount || 0) || 0,
        likeCount: parseInt(row['Like Count'] || row.likeCount || 0) || 0,
        commentCount: parseInt(row['Comment Count'] || row.commentCount || 0) || 0,
        readTime: Math.ceil((row['Rich Content'] || row['Plain Content'] || '').length / 1000) || 1, // Estimate read time
        publishedAt: new Date(row['Published Date'] || Date.now()),
        tags: row.Tags ? (Array.isArray(row.Tags) ? row.Tags : [row.Tags]) : [],
        seoMeta: {
          metaDescription: row['SEO Description'] || '',
          keywords: row['SEO Keywords'] || ''
        }
      };

      // Check if blog post already exists by slug
      const existingBlog = await Blog.findOne({
        where: { slug: blogData.slug }
      });

      if (existingBlog) {
        // Update existing blog post
        await existingBlog.update(blogData);
        logger.info(`  Updated blog post: ${blogData.title}`);
      } else {
        // Create new blog post
        await Blog.create(blogData);
        logger.info(`  Created blog post: ${blogData.title}`);
      }

      importedCount++;
      if (importedCount % 10 === 0) {
        logger.info(`  Processed ${importedCount} blog posts...`);
      }
    } catch (error) {
      logger.error('Error importing blog post:', error.message);
      skippedCount++;
    }
  }

  logger.info(`Blog posts import completed: ${importedCount} imported, ${skippedCount} skipped`);
  return importedCount;
}

/**
 * Import groups from CSV (using members data to create groups if needed)
 */
async function importGroups() {
  logger.info('Preparing to import groups...');

  // For now, we'll create some default groups based on forum categories
  // since there isn't a dedicated groups CSV file

  const defaultGroups = [
    { name: 'VIP Members', description: 'Exclusive group for VIP members', category: 'exclusive' },
    { name: 'Newcomers', description: 'Group for new members to get acquainted', category: 'onboarding' },
    { name: 'Staff', description: 'Administrative staff group', category: 'administration' },
    { name: 'Developers', description: 'Group for developers and tech enthusiasts', category: 'technology' }
  ];

  let importedCount = 0;
  let skippedCount = 0;

  for (const groupData of defaultGroups) {
    try {
      // Check if group already exists
      const existingGroup = await Group.findOne({
        where: { name: groupData.name }
      });

      if (!existingGroup) {
        await Group.create({
          name: groupData.name,
          description: groupData.description,
          category: groupData.category,
          isPrivate: false,
          memberCount: 0,
          createdBy: '00000000-0000-0000-0000-000000000000',
          status: 'active',
          coverImage: null,
          rules: null,
          metadata: {}
        });

        logger.info(`  Created group: ${groupData.name}`);
        importedCount++;
      } else {
        logger.info(`  Group already exists: ${groupData.name}`);
        importedCount++; // Count as processed
      }
    } catch (error) {
      logger.error('Error importing group:', error.message);
      skippedCount++;
    }
  }

  logger.info(`Groups preparation completed: ${importedCount} processed, ${skippedCount} skipped`);
  return importedCount;
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
 * Main function to run all imports
 */
async function main() {
  logger.info('='.repeat(80));
  logger.info('COMPREHENSIVE PLATFORM DATA IMPORT');
  logger.info('='.repeat(80));
  logger.info('');

  try {
    // Authenticate database connection
    await sequelize.authenticate();
    logger.info('✅ Database connection authenticated');

    // Sync models to ensure tables exist
    logger.info('Syncing database models...');
    await sequelize.sync({ alter: true }); // Use alter to update existing tables safely
    logger.info('✅ Database models synced');
    logger.info('');

    // Import all data
    logger.info('Starting data import process...');
    logger.info('-'.repeat(50));

    const forumCount = await importForumCategories();
    const blogCount = await importBlogPosts();
    const groupCount = await importGroups();

    logger.info('');
    logger.info('='.repeat(80));
    logger.info('DATA IMPORT COMPLETED SUCCESSFULLY');
    logger.info('='.repeat(80));
    logger.info('');
    logger.info('Summary:');
    logger.info(`- Forum categories: ${forumCount} imported`);
    logger.info(`- Blog posts: ${blogCount} imported`);
    logger.info(`- Groups: ${groupCount} processed`);
    logger.info('');
    logger.info('Data import process finished successfully!');
    logger.info('');

    process.exit(0);
  } catch (error) {
    logger.error('');
    logger.error('='.repeat(80));
    logger.error('❌ DATA IMPORT FAILED');
    logger.error('='.repeat(80));
    logger.error('');
    logger.error('Error:', error.message);
    logger.error('Stack:', error.stack);
    logger.error('');

    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

module.exports = {
  importForumCategories,
  importBlogPosts,
  importGroups,
  convertHexIdToUuid,
  generateSlug
};
