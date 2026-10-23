#!/usr/bin/env node

/**
 * Comprehensive Platform Data Import Script
 * Imports forum categories, blog posts, groups, forum posts, and comments from CSV files
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
const Blog = require('./models/Blog');
const Group = require('./models/Group');
// const { Forum, Topic } = require('./models/forum');
// const User = require('./models/user'); // Assuming user model exists

// Paths to CSV files
const CSV_DIR = path.join(__dirname, '../Assets/CSV Files');
const FORUM_CATEGORIES_FILE = path.join(CSV_DIR, 'FingerMobile Forum Categories (1).csv');
const POSTS_FILE = path.join(CSV_DIR, 'Posts.csv');
const COMMENTS_FILE = path.join(CSV_DIR, 'Comments.csv');
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
  logger.info('Importing forum categories (communities)...');

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

      // Prepare community data based on the community_schema.sql structure
      const communityData = {
        id: uuid,
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
      await sequelize.query(
        `INSERT INTO communities (id, name, slug, description, type, category, creator_id, avatar_url, cover_image_url, 
                                 member_count, post_count, is_verified, is_featured, settings, rules, status, metadata, created_at, updated_at)
         VALUES (:id, :name, :slug, :description, :type, :category, :creator_id, :avatar_url, :cover_image_url, 
                 :member_count, :post_count, :is_verified, :is_featured, :settings, :rules, :status, :metadata, :created_at, :updated_at)
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
        {
          replacements: {
            id: communityData.id,
            name: communityData.name,
            slug: communityData.slug,
            description: communityData.description,
            type: communityData.type,
            category: communityData.category,
            creator_id: communityData.creator_id,
            avatar_url: communityData.avatar_url,
            cover_image_url: communityData.cover_image_url,
            member_count: communityData.member_count,
            post_count: communityData.post_count,
            is_verified: communityData.is_verified,
            is_featured: communityData.is_featured,
            settings: JSON.stringify(communityData.settings),
            rules: communityData.rules,
            status: communityData.status,
            metadata: JSON.stringify(communityData.metadata),
            created_at: communityData.created_at,
            updated_at: communityData.updated_at
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
      logger.error('Row data:', JSON.stringify(parsed.data.find(r => r.ID === row.ID) || row, null, 2));
      skippedCount++;
    }
  }

  logger.info(`Forum categories import completed: ${importedCount} imported, ${skippedCount} skipped`);
  return importedCount;
}

/**
 * Import forum posts from CSV
 */
async function importForumPosts() {
  logger.info('Importing forum posts...');

  if (!fs.existsSync(POSTS_FILE)) {
    logger.warn(`Posts file not found: ${POSTS_FILE}`);
    return 0;
  }

  const csvContent = fs.readFileSync(POSTS_FILE, 'utf8');

  const parsed = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    transform: function(value) {
      return value.replace(/^\uFEFF/, '').trim();
    }
  });

  let importedCount = 0;
  let skippedCount = 0;

  // Get available communities to link posts to
  const communities = await sequelize.query('SELECT id, name FROM communities', { type: sequelize.QueryTypes.SELECT });

  if (communities.length === 0) {
    logger.warn('No communities found. Skipping forum posts import.');
    return 0;
  }

  for (const row of parsed.data) {
    try {
      // Convert hex ID to UUID format
      let postId = convertHexIdToUuid(row.ID || row.id || '');
      if (!postId) {
        postId = undefined;
      }

      // Find a community to assign this post to
      // Use the Category ID from the row if available, otherwise pick the first community
      let communityId = communities[0].id;
      if (row['Category ID'] || row.categoryId) {
        const targetCommunity = communities.find(c => c.id === convertHexIdToUuid(row['Category ID'] || row.categoryId));
        if (targetCommunity) {
          communityId = targetCommunity.id;
        }
      }

      // Default to first available user ID (we'll use a placeholder)
      const authorId = '00000000-0000-0000-0000-000000000000';

      const postData = {
        id: postId,
        community_id: communityId,
        author_id: authorId,
        title: row.Title || row.title || 'Untitled Post',
        content: row['Plain Content'] || row.content || '',
        type: row.Type || row.type || 'text',
        status: row.Status || row.status || 'published',
        is_pinned: row.Pinned || row.pinned || false,
        is_locked: false,
        view_count: parseInt(row['View Count'] || row.viewCount || 0) || 0,
        like_count: parseInt(row['Like Count'] || row.likeCount || 0) || 0,
        comment_count: parseInt(row['Comment Count'] || row.commentCount || 0) || 0,
        share_count: parseInt(row['Share Count'] || row.shareCount || 0) || 0,
        published_at: new Date(row['Published Date'] || row.publishedAt || Date.now()),
        created_at: new Date(row['Created date'] || row.createdAt || Date.now()),
        updated_at: new Date()
      };

      // Insert or update the forum post
      await sequelize.query(
        `INSERT INTO community_posts (id, community_id, author_id, title, content, type, status, 
                                      is_pinned, is_locked, view_count, like_count, comment_count, share_count, 
                                      published_at, created_at, updated_at)
         VALUES (:id, :community_id, :author_id, :title, :content, :type, :status, 
                 :is_pinned, :is_locked, :view_count, :like_count, :comment_count, :share_count, 
                 :published_at, :created_at, :updated_at)
         ON CONFLICT (id) DO UPDATE SET
           community_id = EXCLUDED.community_id,
           author_id = EXCLUDED.author_id,
           title = EXCLUDED.title,
           content = EXCLUDED.content,
           type = EXCLUDED.type,
           status = EXCLUDED.status,
           is_pinned = EXCLUDED.is_pinned,
           is_locked = EXCLUDED.is_locked,
           view_count = EXCLUDED.view_count,
           like_count = EXCLUDED.like_count,
           comment_count = EXCLUDED.comment_count,
           share_count = EXCLUDED.share_count,
           published_at = EXCLUDED.published_at,
           updated_at = EXCLUDED.updated_at`,
        {
          replacements: {
            id: postData.id,
            community_id: postData.community_id,
            author_id: postData.author_id,
            title: postData.title,
            content: postData.content,
            type: postData.type,
            status: postData.status,
            is_pinned: postData.is_pinned,
            is_locked: postData.is_locked,
            view_count: postData.view_count,
            like_count: postData.like_count,
            comment_count: postData.comment_count,
            share_count: postData.share_count,
            published_at: postData.published_at,
            created_at: postData.created_at,
            updated_at: postData.updated_at
          },
          type: sequelize.QueryTypes.INSERT
        }
      );

      importedCount++;
      if (importedCount % 10 === 0) {
        logger.info(`  Processed ${importedCount} forum posts...`);
      }
    } catch (error) {
      logger.error('Error importing forum post:', error.message);
      skippedCount++;
    }
  }

  logger.info(`Forum posts import completed: ${importedCount} imported, ${skippedCount} skipped`);
  return importedCount;
}

/**
 * Import comments from CSV
 */
async function importComments() {
  logger.info('Importing comments...');

  if (!fs.existsSync(COMMENTS_FILE)) {
    logger.warn(`Comments file not found: ${COMMENTS_FILE}`);
    return 0;
  }

  const csvContent = fs.readFileSync(COMMENTS_FILE, 'utf8');

  const parsed = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    transform: function(value) {
      return value.replace(/^\uFEFF/, '').trim();
    }
  });

  let importedCount = 0;
  let skippedCount = 0;

  // Get available posts to link comments to
  const posts = await sequelize.query('SELECT id FROM community_posts', { type: sequelize.QueryTypes.SELECT });

  if (posts.length === 0) {
    logger.warn('No posts found. Skipping comments import.');
    return 0;
  }

  for (const row of parsed.data) {
    try {
      // Convert hex ID to UUID format
      let commentId = convertHexIdToUuid(row.ID || row.id || '');
      if (!commentId) {
        commentId = undefined;
      }

      // Find a post to assign this comment to
      let postId = posts[0].id;
      if (row['Post ID'] || row.postId) {
        const targetPost = posts.find(p => p.id === convertHexIdToUuid(row['Post ID'] || row.postId));
        if (targetPost) {
          postId = targetPost.id;
        }
      }

      // Default to first available user ID (we'll use a placeholder)
      const authorId = '00000000-0000-0000-0000-000000000000';

      const commentData = {
        id: commentId,
        post_id: postId,
        parent_comment_id: row['Parent ID'] || row.parentId || null,
        author_id: authorId,
        content: row['Plain Content'] || row.content || 'Default comment content',
        status: 'published',
        created_at: new Date(row['Created date'] || row.createdAt || Date.now()),
        updated_at: new Date()
      };

      // Insert or update the comment
      await sequelize.query(
        `INSERT INTO community_comments (id, post_id, parent_comment_id, author_id, content, status, created_at, updated_at)
         VALUES (:id, :post_id, :parent_comment_id, :author_id, :content, :status, :created_at, :updated_at)
         ON CONFLICT (id) DO UPDATE SET
           post_id = EXCLUDED.post_id,
           parent_comment_id = EXCLUDED.parent_comment_id,
           author_id = EXCLUDED.author_id,
           content = EXCLUDED.content,
           status = EXCLUDED.status,
           updated_at = EXCLUDED.updated_at`,
        {
          replacements: {
            id: commentData.id,
            post_id: commentData.post_id,
            parent_comment_id: commentData.parent_comment_id,
            author_id: commentData.author_id,
            content: commentData.content,
            status: commentData.status,
            created_at: commentData.created_at,
            updated_at: commentData.updated_at
          },
          type: sequelize.QueryTypes.INSERT
        }
      );

      importedCount++;
      if (importedCount % 10 === 0) {
        logger.info(`  Processed ${importedCount} comments...`);
      }
    } catch (error) {
      logger.error('Error importing comment:', error.message);
      skippedCount++;
    }
  }

  logger.info(`Comments import completed: ${importedCount} imported, ${skippedCount} skipped`);
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
        excerpt: row.Excerpt || row.excerpt || row.Description || row.description || '',
        featuredImage: row['Cover Image'] || row.coverImage || null,
        authorId: authorId,
        category: row.Category || row.category || 'General',
        status: 'published', // Assuming CSV data is ready to publish
        viewCount: parseInt(row['View Count'] || row.viewCount || 0) || 0,
        likeCount: parseInt(row['Like Count'] || row.likeCount || 0) || 0,
        commentCount: parseInt(row['Comment Count'] || row.commentCount || 0) || 0,
        readTime: Math.ceil(((row['Rich Content'] || row['Plain Content'] || '').length || 0) / 1000) || 1, // Estimate read time
        publishedAt: new Date(row['Published Date'] || row.publishedAt || Date.now()),
        tags: row.Tags ? (Array.isArray(row.Tags) ? row.Tags : [row.Tags]) : [],
        seoMeta: {
          metaDescription: row['SEO Description'] || row.metaDescription || '',
          keywords: row['SEO Keywords'] || row.keywords || ''
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
    const postCount = await importForumPosts();
    const commentCount = await importComments();
    const blogCount = await importBlogPosts();
    const groupCount = await importGroups();

    logger.info('');
    logger.info('='.repeat(80));
    logger.info('DATA IMPORT COMPLETED SUCCESSFULLY');
    logger.info('='.repeat(80));
    logger.info('');
    logger.info('Summary:');
    logger.info(`- Forum categories: ${forumCount} imported`);
    logger.info(`- Forum posts: ${postCount} imported`);
    logger.info(`- Comments: ${commentCount} imported`);
    logger.info(`- Blog posts: ${blogCount} imported`);
    logger.info(`- Groups: ${groupCount} processed`);
    logger.info('');
    logger.info('Total records imported: ' + (forumCount + postCount + commentCount + blogCount + groupCount));
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
  importForumPosts,
  importComments,
  importBlogPosts,
  importGroups,
  convertHexIdToUuid,
  generateSlug
};
