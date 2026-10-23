/* eslint-disable no-console */
/**
 * Database Initialization Script
 * Creates all necessary tables if they don't exist
 */

const { identityDb, contentDb, financialDb, securityDb, communicationDb, socialDb, monetizationDb } = require('./db'); // Updated to correct import
const logger = require('../config/logger'); // Added missing logger import

/**
 * Initialize database tables for Identity Management
 */
async function initializeIdentityTables() {
  // Create users table
  await identityDb.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      uuid VARCHAR(36) UNIQUE NOT NULL DEFAULT gen_random_uuid(),
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(50),
      last_name VARCHAR(50),
      phone VARCHAR(20),
      date_of_birth DATE,
      gender VARCHAR(20),
      bio TEXT,
      avatar_url TEXT,
      cover_photo_url TEXT,
      location VARCHAR(255),
      timezone VARCHAR(50) DEFAULT 'UTC',
      language VARCHAR(10) DEFAULT 'en',
      role VARCHAR(20) DEFAULT 'user',
      is_active BOOLEAN DEFAULT true,
      is_call_restricted BOOLEAN DEFAULT false,
      is_verified BOOLEAN DEFAULT false,
      email_verified BOOLEAN DEFAULT false,
      phone_verified BOOLEAN DEFAULT false,
      two_factor_enabled BOOLEAN DEFAULT false,
      two_factor_secret VARCHAR(32),
      backup_codes JSONB,
      privacy_level VARCHAR(20) DEFAULT 'public',
      online_status VARCHAR(20) DEFAULT 'online',
      last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status VARCHAR(50) DEFAULT 'active';

    CREATE TABLE IF NOT EXISTS account_inactivity_log (
      id SERIAL PRIMARY KEY,
      user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      last_login_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(50) DEFAULT 'active',
      freeze_date TIMESTAMP WITH TIME ZONE,
      notification_count INTEGER DEFAULT 0,
      closure_date TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_account_inactivity_user ON account_inactivity_log(user_id);
    CREATE INDEX IF NOT EXISTS idx_account_inactivity_status ON account_inactivity_log(status);
  `);

  // Create user sessions table
  await identityDb.query(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      session_token VARCHAR(255) UNIQUE NOT NULL,
      ip_address INET,
      user_agent TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP WITH TIME ZONE,
      is_active BOOLEAN DEFAULT true
    );
  `);

  // Create refresh tokens table
  await identityDb.query(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      token VARCHAR(255) UNIQUE NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      is_revoked BOOLEAN DEFAULT false
    );
  `);

  // Create user friendships table
  await identityDb.query(`
    CREATE TABLE IF NOT EXISTS user_friendships (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
      status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, blocked
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, friend_id)
    );
  `);

  // Create indexes for better performance
  try {
    await identityDb.query(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_friendships_user_id ON user_friendships(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_friendships_friend_id ON user_friendships(friend_id);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Add role column if it doesn't exist (for existing installations)
  try {
    await identityDb.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';
    `);
  } catch (error) {
    logger.info('Role column already exists or error adding it:', error.message);
  }

  // Add is_active column if it doesn't exist
  try {
    await identityDb.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
    `);
  } catch (error) {
    logger.info('Is Active column already exists or error adding it:', error.message);
  }

  // Add followers_count column if it doesn't exist
  try {
    await identityDb.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0;
    `);
  } catch (error) {
    logger.info('Followers count column already exists or error adding it:', error.message);
  }

  // Create follows table
  await identityDb.query(`
    CREATE TABLE IF NOT EXISTS follows (
      id SERIAL PRIMARY KEY,
      follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
      following_id UUID REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(follower_id, following_id)
    );
  `);

  // Create indexes for follows table
  try {
    await identityDb.query(`
    CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
    CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create forums table
  await identityDb.query(`
    CREATE TABLE IF NOT EXISTS forums (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100),
      is_active BOOLEAN DEFAULT true,
      creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for forums table
  try {
    await identityDb.query(`
    CREATE INDEX IF NOT EXISTS idx_forums_category ON forums(category);
    CREATE INDEX IF NOT EXISTS idx_forums_creator_id ON forums(creator_id);
    CREATE INDEX IF NOT EXISTS idx_forums_is_active ON forums(is_active);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create posts table
  await identityDb.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      forum_id INTEGER REFERENCES forums(id) ON DELETE CASCADE,
      author_id UUID REFERENCES users(id) ON DELETE CASCADE,
      is_active BOOLEAN DEFAULT true,
      likes_count INTEGER DEFAULT 0,
      replies_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for posts table
  try {
    await identityDb.query(`
    CREATE INDEX IF NOT EXISTS idx_posts_forum_id ON posts(forum_id);
    CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
    CREATE INDEX IF NOT EXISTS idx_posts_is_active ON posts(is_active);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create groups table
  await identityDb.query(`
    CREATE TABLE IF NOT EXISTS groups (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100),
      is_public BOOLEAN DEFAULT true,
      creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
      members_count INTEGER DEFAULT 1,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for groups table
  try {
    await identityDb.query(`
    CREATE INDEX IF NOT EXISTS idx_groups_category ON groups(category);
    CREATE INDEX IF NOT EXISTS idx_groups_creator_id ON groups(creator_id);
    CREATE INDEX IF NOT EXISTS idx_groups_is_public ON groups(is_public);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create products table for marketplace
  await identityDb.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      stock_quantity INTEGER DEFAULT 0,
      creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
      category VARCHAR(100),
      images TEXT[],
      is_active BOOLEAN DEFAULT true,
      platform_type VARCHAR(20) DEFAULT 'marketplace' CHECK (platform_type IN ('marketplace', 'ownit', 'flamingo', 'storefront')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create product reviews table
  await identityDb.query(`
    CREATE TABLE IF NOT EXISTS product_reviews (
      id SERIAL PRIMARY KEY,
      product_id UUID REFERENCES products(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      review_text TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for product reviews table
  try {
    await identityDb.query(`
    CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
    CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create forum categories table
  await socialDb.query(`
    CREATE TABLE IF NOT EXISTS forum_categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for forum categories table
  try {
    await socialDb.query(`
    CREATE INDEX IF NOT EXISTS idx_forum_categories_name ON forum_categories(name);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create forums table
  await socialDb.query(`
    CREATE TABLE IF NOT EXISTS forums (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      category_id INT REFERENCES forum_categories(id) ON DELETE CASCADE,
      created_by UUID,
      is_active BOOLEAN DEFAULT true,
      thread_count INTEGER DEFAULT 0,
      post_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for forums table (schema might have been modified by tier1_modules_schema.sql)
  try {
    try {
      await socialDb.query(`
      CREATE INDEX IF NOT EXISTS idx_forums_created_by ON forums(created_by);
    `);
    } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }
  } catch(e) {
    logger.warn('Could not create forum indexes due to schema drift: ' + e.message);
  }

  // Create forum threads table
  await socialDb.query(`
    CREATE TABLE IF NOT EXISTS forum_threads (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      forum_id INT REFERENCES forums(id) ON DELETE CASCADE,
      author_id UUID,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      is_sticky BOOLEAN DEFAULT false,
      is_locked BOOLEAN DEFAULT false,
      view_count INTEGER DEFAULT 0,
      reply_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for forum threads table (schema might have been modified)
  try {
    try {
      await socialDb.query(`
      CREATE INDEX IF NOT EXISTS idx_forum_threads_forum_id ON forum_threads(forum_id);
      CREATE INDEX IF NOT EXISTS idx_forum_threads_author_id ON forum_threads(author_id);
      CREATE INDEX IF NOT EXISTS idx_forum_threads_is_sticky ON forum_threads(is_sticky);
      CREATE INDEX IF NOT EXISTS idx_forum_threads_created_at ON forum_threads(created_at);
    `);
    } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }
  } catch(e) {
    logger.warn('Could not create forum_threads indexes due to schema drift: ' + e.message);
  }

  // Create forum posts table
  await socialDb.query(`
    CREATE TABLE IF NOT EXISTS forum_posts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      thread_id UUID REFERENCES forum_threads(id) ON DELETE CASCADE,
      author_id UUID,
      content TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for forum posts table
  try {
    await socialDb.query(`
    CREATE INDEX IF NOT EXISTS idx_forum_posts_thread_id ON forum_posts(thread_id);
    CREATE INDEX IF NOT EXISTS idx_forum_posts_author_id ON forum_posts(author_id);
    CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON forum_posts(created_at);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create posts table
  await contentDb.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      author_id UUID NOT NULL,
      content TEXT NOT NULL,
      type VARCHAR(50) DEFAULT 'text',
      media_urls JSONB,
      hashtags TEXT[],
      visibility VARCHAR(20) DEFAULT 'public',
      status VARCHAR(20) DEFAULT 'published',
      scheduled_at TIMESTAMP WITH TIME ZONE,
      likes_count INTEGER DEFAULT 0,
      comments_count INTEGER DEFAULT 0,
      shares_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for posts table
  try {
    await contentDb.query(`
    CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
    CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
    CREATE INDEX IF NOT EXISTS idx_posts_visibility ON posts(visibility);
    CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
    CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
    CREATE INDEX IF NOT EXISTS idx_posts_hashtags ON posts USING GIN(hashtags);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create post likes table
  await contentDb.query(`
    CREATE TABLE IF NOT EXISTS post_likes (
      id SERIAL PRIMARY KEY,
      post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
      user_id UUID NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(post_id, user_id)
    );
  `);

  // Create indexes for post likes table
  try {
    await contentDb.query(`
    CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
    CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create comments table
  await contentDb.query(`
    CREATE TABLE IF NOT EXISTS comments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
      author_id UUID NOT NULL,
      parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- for nested comments
      content TEXT NOT NULL,
      likes_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for comments table
  try {
    await contentDb.query(`
    CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
    CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
    CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
    CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create shares table
  await contentDb.query(`
    CREATE TABLE IF NOT EXISTS shares (
      id SERIAL PRIMARY KEY,
      post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
      user_id UUID NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for shares table
  try {
    await contentDb.query(`
    CREATE INDEX IF NOT EXISTS idx_shares_post_id ON shares(post_id);
    CREATE INDEX IF NOT EXISTS idx_shares_user_id ON shares(user_id);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create bookmarks table
  await contentDb.query(`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id SERIAL PRIMARY KEY,
      post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
      user_id UUID NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(post_id, user_id)
    );
  `);

  // Create indexes for bookmarks table
  try {
    await contentDb.query(`
    CREATE INDEX IF NOT EXISTS idx_bookmarks_post_id ON bookmarks(post_id);
    CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create members table (referenced in forums controller)
  await socialDb.query(`
    CREATE TABLE IF NOT EXISTS members (
      id SERIAL PRIMARY KEY,
      user_id UUID UNIQUE,
      membername VARCHAR(100) UNIQUE NOT NULL,
      display_name VARCHAR(150),
      bio TEXT,
      avatar_url TEXT,
      cover_photo_url TEXT,
      location VARCHAR(255),
      website VARCHAR(255),
      date_of_birth DATE,
      gender VARCHAR(20),
      is_online BOOLEAN DEFAULT false,
      last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for members table
  try {
    await socialDb.query(`
    CREATE INDEX IF NOT EXISTS idx_members_user_id ON members(user_id);
    CREATE INDEX IF NOT EXISTS idx_members_membername ON members(membername);
    CREATE INDEX IF NOT EXISTS idx_members_display_name ON members(display_name);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create wishlist table for marketplace functionality
  await financialDb.query(`
    CREATE TABLE IF NOT EXISTS wishlists (
      id SERIAL PRIMARY KEY,
      user_id UUID,
      product_id INT ,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, product_id)
    );
  `);

  // Create indexes for wishlist table
  try {
    await financialDb.query(`
    CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);
    CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON wishlists(product_id);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create shopping cart table for marketplace functionality
  await financialDb.query(`
    CREATE TABLE IF NOT EXISTS shopping_cart (
      id SERIAL PRIMARY KEY,
      user_id UUID,
      product_id INT ,
      quantity INTEGER DEFAULT 1,
      added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for shopping cart table
  try {
    await financialDb.query(`
    CREATE INDEX IF NOT EXISTS idx_shopping_cart_user_id ON shopping_cart(user_id);
    CREATE INDEX IF NOT EXISTS idx_shopping_cart_product_id ON shopping_cart(product_id);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create orders table for marketplace functionality
  await financialDb.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id UUID,
      order_number VARCHAR(50) UNIQUE NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      total_amount DECIMAL(10, 2) NOT NULL,
      currency VARCHAR(3) DEFAULT 'USD',
      shipping_address JSONB,
      billing_address JSONB,
      payment_method VARCHAR(50),
      payment_status VARCHAR(50) DEFAULT 'pending',
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for orders table
  try {
    await financialDb.query(`
    CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create order items table for marketplace functionality
  await financialDb.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INT REFERENCES orders(id) ON DELETE CASCADE,
      product_id INT ,
      quantity INTEGER NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      total DECIMAL(10, 2) NOT NULL
    );
  `);

  // Create indexes for order items table
  try {
    await financialDb.query(`
    CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
    CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create notifications table
  await communicationDb.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id UUID,
      type VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      data JSONB,
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for notifications table
  try {
    await communicationDb.query(`
    CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
    CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create messages table
  await communicationDb.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      conversation_id UUID,
      sender_id UUID,
      receiver_id UUID,
      subject VARCHAR(255),
      content TEXT NOT NULL,
      message_type VARCHAR(20) DEFAULT 'text',
      is_read BOOLEAN DEFAULT false,
      is_deleted_by_sender BOOLEAN DEFAULT false,
      is_deleted_by_receiver BOOLEAN DEFAULT false,
      sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      read_at TIMESTAMP WITH TIME ZONE
    );
  `);

  // Create indexes for messages table
  try {
    await communicationDb.query(`
      ALTER TABLE messages ADD COLUMN IF NOT EXISTS receiver_id UUID;
      ALTER TABLE messages ADD COLUMN IF NOT EXISTS sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
      CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
      CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
      CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
      CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON messages(sent_at);
      CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
    `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create conversations table
  await communicationDb.query(`
    CREATE TABLE IF NOT EXISTS conversations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      type VARCHAR(20) DEFAULT 'direct',
      name VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create conversation_participants table for many-to-many relationship
  await communicationDb.query(`
    CREATE TABLE IF NOT EXISTS conversation_participants (
      id SERIAL PRIMARY KEY,
      conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
      user_id UUID,
      joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      left_at TIMESTAMP WITH TIME ZONE,
      is_active BOOLEAN DEFAULT true
    );
  `);

  // Create indexes for conversations tables
  try {
    await communicationDb.query(`
    CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);
    CREATE INDEX IF NOT EXISTS idx_conversation_participants_conv ON conversation_participants(conversation_id);
    CREATE INDEX IF NOT EXISTS idx_conversation_participants_user ON conversation_participants(user_id);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create user preferences table
  await identityDb.query(`
    CREATE TABLE IF NOT EXISTS user_preferences (
      id SERIAL PRIMARY KEY,
      user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      email_notifications BOOLEAN DEFAULT true,
      push_notifications BOOLEAN DEFAULT true,
      sms_notifications BOOLEAN DEFAULT false,
      privacy_settings JSONB,
      theme_preference VARCHAR(20) DEFAULT 'light',
      language VARCHAR(10) DEFAULT 'en',
      timezone VARCHAR(50) DEFAULT 'UTC',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for user preferences table
  try {
    await identityDb.query(`
    CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create user activity log table
  await securityDb.query(`
    CREATE TABLE IF NOT EXISTS user_activity_log (
      id SERIAL PRIMARY KEY,
      user_id UUID,
      action VARCHAR(100) NOT NULL,
      resource_type VARCHAR(50),
      resource_id INT,
      ip_address INET,
      user_agent TEXT,
      metadata JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for user activity log table
  try {
    await securityDb.query(`
    CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity_log(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_activity_action ON user_activity_log(action);
    CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity_log(created_at);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create media assets table
  await contentDb.query(`
    CREATE TABLE IF NOT EXISTS media_assets (
      id SERIAL PRIMARY KEY,
      user_id UUID,
      filename VARCHAR(255) NOT NULL,
      original_filename VARCHAR(500) NOT NULL,
      file_path TEXT NOT NULL,
      file_size BIGINT,
      mime_type VARCHAR(100),
      asset_type VARCHAR(50) CHECK (asset_type IN ('image', 'video', 'audio', 'document', 'other')),
      alt_text TEXT,
      caption TEXT,
      is_public BOOLEAN DEFAULT false,
      upload_status VARCHAR(20) DEFAULT 'completed',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for media assets table
  try {
    await contentDb.query(`
    CREATE INDEX IF NOT EXISTS idx_media_assets_user_id ON media_assets(user_id);
    CREATE INDEX IF NOT EXISTS idx_media_assets_mime_type ON media_assets(mime_type);
    CREATE INDEX IF NOT EXISTS idx_media_assets_asset_type ON media_assets(asset_type);
    CREATE INDEX IF NOT EXISTS idx_media_assets_created_at ON media_assets(created_at);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create FingerMobile Brand Emojis Registry table
  try {
    await contentDb.query(`
      CREATE TABLE IF NOT EXISTS fingermobile_emojis (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        category VARCHAR(100) DEFAULT 'reactions',
        toast_type VARCHAR(50),
        image_url VARCHAR(500) NOT NULL,
        asset_filename VARCHAR(255) NOT NULL,
        color_hex VARCHAR(50) DEFAULT '#defaf2',
        description TEXT,
        brand_identity JSONB DEFAULT '{"monochromatic": true, "tone": "ice-green", "hex": "#defaf2", "material": "glossy_glass", "glasses_engraved": "FingerMobile", "yellow_lip": true, "red_tongue": true}'::jsonb,
        is_active BOOLEAN DEFAULT true,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_fingermobile_emojis_category ON fingermobile_emojis(category);
      CREATE INDEX IF NOT EXISTS idx_fingermobile_emojis_toast_type ON fingermobile_emojis(toast_type);
    `);
  } catch (e) { logger.warn('fingermobile_emojis table creation skipped: ' + e.message); }

  // Create content tags table
  await contentDb.query(`
    CREATE TABLE IF NOT EXISTS content_tags (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for content tags table
  try {
    await contentDb.query(`
    CREATE INDEX IF NOT EXISTS idx_content_tags_name ON content_tags(name);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create content_tag_mappings table (junction table for tags and content)
  await contentDb.query(`
    CREATE TABLE IF NOT EXISTS content_tag_mappings (
      id SERIAL PRIMARY KEY,
      content_type VARCHAR(50) NOT NULL,
      content_id INT NOT NULL,
      tag_id INT REFERENCES content_tags(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(content_type, content_id, tag_id)
    );
  `);

  // Create indexes for content_tag_mappings table
  try {
    await contentDb.query(`
    CREATE INDEX IF NOT EXISTS idx_content_tag_mappings_content_type ON content_tag_mappings(content_type);
    CREATE INDEX IF NOT EXISTS idx_content_tag_mappings_content_id ON content_tag_mappings(content_id);
    CREATE INDEX IF NOT EXISTS idx_content_tag_mappings_tag_id ON content_tag_mappings(tag_id);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create blogs table
  await contentDb.query(`
    CREATE TABLE IF NOT EXISTS blogs (
      id SERIAL PRIMARY KEY,
      owner_id UUID REFERENCES users(id),
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      theme_colors JSONB,
      social_links JSONB,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for blogs table
  try {
    await contentDb.query(`
    CREATE INDEX IF NOT EXISTS idx_blogs_owner_id ON blogs(owner_id);
    CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
    CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create blog_categories table
  await contentDb.query(`
    CREATE TABLE IF NOT EXISTS blog_categories (
      id SERIAL PRIMARY KEY,
      blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL,
      description TEXT,
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(blog_id, slug)
    );
  `);

  // Create indexes for blog_categories table
  try {
    await contentDb.query(`
    CREATE INDEX IF NOT EXISTS idx_blog_categories_blog_id ON blog_categories(blog_id);
    CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create blog_posts table
  await contentDb.query(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      author_id UUID REFERENCES users(id),
      blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
      category_id INTEGER REFERENCES blog_categories(id),
      title VARCHAR(500) NOT NULL,
      slug VARCHAR(500) NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      cover_image TEXT,
      tags TEXT[],
      status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
      is_featured BOOLEAN DEFAULT false,
      scheduled_publish_date TIMESTAMP WITH TIME ZONE,
      view_count INTEGER DEFAULT 0,
      like_count INTEGER DEFAULT 0,
      comment_count INTEGER DEFAULT 0,
      seo_title VARCHAR(60),
      seo_description VARCHAR(160),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      published_at TIMESTAMP WITH TIME ZONE,
      UNIQUE(blog_id, slug)
    );
  `);

  // Create indexes for blog_posts table
  try {
    await contentDb.query(`
    CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_blog_id ON blog_posts(blog_id);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_is_featured ON blog_posts(is_featured);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create blog_post_likes table
  await contentDb.query(`
    CREATE TABLE IF NOT EXISTS blog_post_likes (
      id SERIAL PRIMARY KEY,
      post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(post_id, user_id)
    );
  `);

  // Create indexes for blog_post_likes table
  try {
    await contentDb.query(`
    CREATE INDEX IF NOT EXISTS idx_blog_post_likes_post_id ON blog_post_likes(post_id);
    CREATE INDEX IF NOT EXISTS idx_blog_post_likes_user_id ON blog_post_likes(user_id);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create blog_post_views table (for tracking unique views)
  await contentDb.query(`
    CREATE TABLE IF NOT EXISTS blog_post_views (
      id SERIAL PRIMARY KEY,
      post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id),
      ip_address INET,
      viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      session_id VARCHAR(255)
    );
  `);

  // Create indexes for blog_post_views table
  try {
    await contentDb.query(`
    CREATE INDEX IF NOT EXISTS idx_blog_post_views_post_id ON blog_post_views(post_id);
    CREATE INDEX IF NOT EXISTS idx_blog_post_views_user_id ON blog_post_views(user_id);
    CREATE INDEX IF NOT EXISTS idx_blog_post_views_ip_address ON blog_post_views(ip_address);
    CREATE INDEX IF NOT EXISTS idx_blog_post_views_viewed_at ON blog_post_views(viewed_at);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create gems_balances table
  await identityDb.query(`
    CREATE TABLE IF NOT EXISTS gems_balances (
      id SERIAL PRIMARY KEY,
      member_id UUID REFERENCES users(id) ON DELETE CASCADE,
      total_gems DECIMAL(10, 2) DEFAULT 0.00,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(member_id)
    );
  `);

  // Create indexes for gems_balances table
  try {
    await identityDb.query(`
    CREATE INDEX IF NOT EXISTS idx_gems_balances_member_id ON gems_balances(member_id);
    CREATE INDEX IF NOT EXISTS idx_gems_balances_total_gems ON gems_balances(total_gems);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create gems_history table
  await identityDb.query(`
    CREATE TABLE IF NOT EXISTS gems_history (
      id SERIAL PRIMARY KEY,
      member_id UUID REFERENCES users(id) ON DELETE CASCADE,
      amount DECIMAL(10, 2) NOT NULL,
      type VARCHAR(50) NOT NULL CHECK (type IN ('proof_of_play', 'curation', 'social_amplification', 'streak_bonus', 'other', 'earned', 'spent', 'transferred', 'gifted')),
      source_id UUID,
      source_model VARCHAR(50),
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for gems_history table
  try {
    await identityDb.query(`
    CREATE INDEX IF NOT EXISTS idx_gems_history_member_id ON gems_history(member_id);
    CREATE INDEX IF NOT EXISTS idx_gems_history_type ON gems_history(type);
    CREATE INDEX IF NOT EXISTS idx_gems_history_source_id ON gems_history(source_id);
    CREATE INDEX IF NOT EXISTS idx_gems_history_created_at ON gems_history(created_at);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create mii_avatars table
  await identityDb.query(`
    CREATE TABLE IF NOT EXISTS mii_avatars (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      base_template VARCHAR(100),
      customization JSONB DEFAULT '{}',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for mii_avatars table
  try {
    await identityDb.query(`
    CREATE INDEX IF NOT EXISTS idx_mii_avatars_user_id ON mii_avatars(user_id);
    CREATE INDEX IF NOT EXISTS idx_mii_avatars_is_active ON mii_avatars(is_active);
    CREATE INDEX IF NOT EXISTS idx_mii_avatars_created_at ON mii_avatars(created_at);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create mii_templates table
  await identityDb.query(`
    CREATE TABLE IF NOT EXISTS mii_templates (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      description TEXT,
      thumbnail_url TEXT,
      base_customization JSONB DEFAULT '{}',
      is_available BOOLEAN DEFAULT true,
      popularity INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for mii_templates table
  try {
    await identityDb.query(`
    CREATE INDEX IF NOT EXISTS idx_mii_templates_category ON mii_templates(category);
    CREATE INDEX IF NOT EXISTS idx_mii_templates_is_available ON mii_templates(is_available);
    CREATE INDEX IF NOT EXISTS idx_mii_templates_popularity ON mii_templates(popularity);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create mii_items table
  await identityDb.query(`
    CREATE TABLE IF NOT EXISTS mii_items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      description TEXT,
      thumbnail_url TEXT,
      price DECIMAL(10, 2) DEFAULT 0.00,
      rarity VARCHAR(50) DEFAULT 'common',
      is_available BOOLEAN DEFAULT true,
      required_level INTEGER DEFAULT 1,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for mii_items table
  try {
    await identityDb.query(`
    CREATE INDEX IF NOT EXISTS idx_mii_items_category ON mii_items(category);
    CREATE INDEX IF NOT EXISTS idx_mii_items_rarity ON mii_items(rarity);
    CREATE INDEX IF NOT EXISTS idx_mii_items_is_available ON mii_items(is_available);
    CREATE INDEX IF NOT EXISTS idx_mii_items_price ON mii_items(price);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create hallmarks table
  await identityDb.query(`
    CREATE TABLE IF NOT EXISTS hallmarks (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      rarity VARCHAR(50) DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
      category VARCHAR(50) DEFAULT 'other' CHECK (category IN ('achievement', 'milestone', 'artist', 'legacy', 'community', 'moderator', 'other')),
      criteria JSONB DEFAULT '{}',
      icon VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for hallmarks table
  try {
    await identityDb.query(`
    CREATE INDEX IF NOT EXISTS idx_hallmarks_category ON hallmarks(category);
    CREATE INDEX IF NOT EXISTS idx_hallmarks_rarity ON hallmarks(rarity);
    CREATE INDEX IF NOT EXISTS idx_hallmarks_created_at ON hallmarks(created_at);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Create user_hallmarks table (junction table for user-hallmark relationships)
  await identityDb.query(`
    CREATE TABLE IF NOT EXISTS user_hallmarks (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      hallmark_id INTEGER REFERENCES hallmarks(id) ON DELETE CASCADE,
      awarded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      awarded_by UUID REFERENCES users(id), -- Could be system user or admin
      reason TEXT,
      UNIQUE(user_id, hallmark_id)
    );
  `);

  // Create indexes for user_hallmarks table
  try {
    await identityDb.query(`
    CREATE INDEX IF NOT EXISTS idx_user_hallmarks_user_id ON user_hallmarks(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_hallmarks_hallmark_id ON user_hallmarks(hallmark_id);
    CREATE INDEX IF NOT EXISTS idx_user_hallmarks_awarded_at ON user_hallmarks(awarded_at);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

}

/**
 * Initialize database tables for Monetization
 */
async function initializeMonetizationTables() {
  // FIC Wallet Table
  await monetizationDb.query(`
    CREATE TABLE IF NOT EXISTS fic_wallets (
      id SERIAL PRIMARY KEY,
      user_id UUID,
      wallet_address VARCHAR(255) UNIQUE NOT NULL,
      balance DECIMAL(15, 2) DEFAULT 0.00,
      currency VARCHAR(10) DEFAULT 'FIC',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // FIC Transaction History Table
  await monetizationDb.query(`
    CREATE TABLE IF NOT EXISTS fic_transactions (
      id SERIAL PRIMARY KEY,
      wallet_id INTEGER REFERENCES fic_wallets(id) ON DELETE CASCADE,
      amount DECIMAL(15, 2) NOT NULL,
      transaction_type VARCHAR(50) NOT NULL,
      description TEXT,
      from_account VARCHAR(255),
      to_account VARCHAR(255),
      transaction_status VARCHAR(50) DEFAULT 'completed',
      transaction_reference VARCHAR(255) UNIQUE,
      metadata JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Exchange Rate Tracking Table
  await monetizationDb.query(`
    CREATE TABLE IF NOT EXISTS fic_exchange_rates (
      id SERIAL PRIMARY KEY,
      base_currency VARCHAR(10) DEFAULT 'FIC',
      target_currency VARCHAR(10) NOT NULL,
      rate DECIMAL(15, 6) NOT NULL,
      source VARCHAR(50),
      last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Monetization Events Table
  await monetizationDb.query(`
    CREATE TABLE IF NOT EXISTS monetization_events (
      id SERIAL PRIMARY KEY,
      user_id UUID,
      event_type VARCHAR(100) NOT NULL,
      amount DECIMAL(15, 2) NOT NULL,
      currency VARCHAR(10) DEFAULT 'NGN',
      status VARCHAR(20) DEFAULT 'pending',
      reference VARCHAR(255),
      metadata JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Indexes for Performance
  try {
    await monetizationDb.query(`
    CREATE INDEX IF NOT EXISTS idx_fic_wallets_user_id ON fic_wallets(user_id);
    CREATE INDEX IF NOT EXISTS idx_fic_wallets_address ON fic_wallets(wallet_address);
    CREATE INDEX IF NOT EXISTS idx_fic_transactions_wallet_id ON fic_transactions(wallet_id);
    CREATE INDEX IF NOT EXISTS idx_fic_transactions_reference ON fic_transactions(transaction_reference);
    CREATE INDEX IF NOT EXISTS idx_fic_exchange_rates_pair ON fic_exchange_rates(base_currency, target_currency);
    CREATE INDEX IF NOT EXISTS idx_monetization_events_user_id ON monetization_events(user_id);
    CREATE INDEX IF NOT EXISTS idx_monetization_events_type ON monetization_events(event_type);
  `);
  } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

  // Trigger for Updating Timestamps
  await monetizationDb.query(`
    CREATE OR REPLACE FUNCTION update_modified_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    DROP TRIGGER IF EXISTS update_fic_wallets_updated_at ON fic_wallets;
    CREATE TRIGGER update_fic_wallets_updated_at 
        BEFORE UPDATE ON fic_wallets 
        FOR EACH ROW 
        EXECUTE FUNCTION update_modified_column();

    DROP TRIGGER IF EXISTS update_fic_exchange_rates_updated_at ON fic_exchange_rates;
    CREATE TRIGGER update_fic_exchange_rates_updated_at 
        BEFORE UPDATE ON fic_exchange_rates 
        FOR EACH ROW 
        EXECUTE FUNCTION update_modified_column();
  `);
}

/**
 * Initialize database tables for Security
 */
async function initializeSecurityTables() {
  try {
    logger.info('Initializing security database tables (STERCS CommandBank v1)...');

    // Create enhanced audit_logs table (STERCS CommandBank v1)
    await securityDb.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        
        -- STERCS Ingestion Boundaries
        service VARCHAR(100) DEFAULT 'FingerMobile Protocol',
        zone VARCHAR(100) DEFAULT 'Platform',
        node_group VARCHAR(100),
        
        -- Actor details
        user_id UUID, 
        role VARCHAR(100),
        is_root BOOLEAN DEFAULT false,
        ip_address INET,
        user_agent TEXT,
        
        -- Event specifics
        event_category VARCHAR(100),
        action VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'SUCCESS',
        failure_reason TEXT,
        
        -- Legacy support (for backward compatibility during migration)
        resource_type VARCHAR(100),
        resource_id VARCHAR(255),
        
        -- Rich Structural Context (modules touched, diff hashes, panels)
        context JSONB,
        metadata JSONB,
        
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create STERCS CommandBank Compound Indices for Time-Series & Forensic Queries
    try {
      await securityDb.query(`
      CREATE INDEX IF NOT EXISTS idx_audit_service_actor_time ON audit_logs (service, user_id, created_at);
      CREATE INDEX IF NOT EXISTS idx_audit_zone_action_time ON audit_logs (zone, action, created_at);
      CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs (created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_audit_event_category ON audit_logs (event_category);
    `);
    } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

    logger.info('✅ Security tables created with STERCS CommandBank schema');
  } catch (error) {
    logger.error('Error initializing security tables:', error.message);
    throw error;
  }
}

/**
 * Initialize database tables for Communication
 */
async function initializeCommunicationTables() {
  try {
    logger.info('Initializing communication database tables...');

    // Create sender_certificates table for sealed sender protocol
    await communicationDb.query(`
      CREATE TABLE IF NOT EXISTS sender_certificates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        member_id VARCHAR(255) NOT NULL,
        public_key TEXT NOT NULL,
        private_key_encrypted TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `);

    // Create indexes for performance
    try {
      await communicationDb.query(`
      CREATE INDEX IF NOT EXISTS idx_sender_certificates_member ON sender_certificates(member_id);
      CREATE INDEX IF NOT EXISTS idx_sender_certificates_expires ON sender_certificates(expires_at);
    `);
    } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

    // Create sealed_messages table for sealed sender protocol
    await communicationDb.query(`
      CREATE TABLE IF NOT EXISTS sealed_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        member_id VARCHAR(255) NOT NULL,
        recipient_id VARCHAR(255) NOT NULL,
        encrypted_content TEXT NOT NULL,
        sealed_key TEXT NOT NULL,
        iv TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create indexes for performance
    try {
      await communicationDb.query(`
      CREATE INDEX IF NOT EXISTS idx_sealed_messages_member ON sealed_messages(member_id);
      CREATE INDEX IF NOT EXISTS idx_sealed_messages_recipient ON sealed_messages(recipient_id);
      CREATE INDEX IF NOT EXISTS idx_sealed_messages_created ON sealed_messages(created_at DESC);
    `);
    } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

    logger.info('✅ Communication tables created');
  } catch (error) {
    logger.error('Error initializing communication tables:', error.message);
    throw error;
  }
}

/**
 * Initialize content database tables
 */
async function initializeContentTables() {
  try {
    logger.info('Initializing content database tables...');

    // Create posts table
    await contentDb.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        author_id UUID NOT NULL,
        title VARCHAR(255),
        content TEXT,
        category_name VARCHAR(100),
        category_id VARCHAR(100),
        tags TEXT[],
        media_url TEXT,
        media_urls JSONB,
        poll_id UUID,
        poll_data JSONB,
        event_id UUID,
        event_data JSONB,
        file_attachment JSONB,
        link_preview JSONB,
        location_data JSONB,
        audio_stem JSONB,
        tagged_product JSONB,
        video_stream_url TEXT,
        type VARCHAR(50) DEFAULT 'text',
        visibility VARCHAR(20) DEFAULT 'public',
        likes_count INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        shares_count INTEGER DEFAULT 0,
        bookmarks_count INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      ALTER TABLE posts ADD COLUMN IF NOT EXISTS title VARCHAR(255);
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS content TEXT;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS category_name VARCHAR(100);
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS category_id VARCHAR(100);
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS tags TEXT[];
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS media_url TEXT;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS media_urls JSONB;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS poll_id UUID;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS poll_data JSONB;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS event_id UUID;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS event_data JSONB;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS file_attachment JSONB;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS link_preview JSONB;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS location_data JSONB;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS audio_stem JSONB;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS tagged_product JSONB;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS video_stream_url TEXT;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS shares_count INTEGER DEFAULT 0;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS bookmarks_count INTEGER DEFAULT 0;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
    `);

    // Create comments table with UUID post_id matching posts.id
    await contentDb.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        author_id UUID,
        content TEXT NOT NULL,
        parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
        likes_count INTEGER DEFAULT 0,
        is_deleted BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS post_likes (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL,
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, post_id)
      );

      CREATE TABLE IF NOT EXISTS polls (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question TEXT NOT NULL,
        options JSONB NOT NULL DEFAULT '[]'::jsonb,
        total_votes INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_by UUID,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    logger.info('✅ Content tables created');


    // Create STERCS projects table
    await contentDb.query(`
      CREATE TABLE IF NOT EXISTS stercs_projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        member_id UUID NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create STERCS pages table
    await contentDb.query(`
      CREATE TABLE IF NOT EXISTS stercs_pages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id INT REFERENCES stercs_projects(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        meta_data JSONB,
        content JSONB,
        is_published BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create STERCS templates table
    await contentDb.query(`
      CREATE TABLE IF NOT EXISTS stercs_templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        meta_data JSONB,
        content JSONB,
        is_global BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    logger.info('✅ STERCS editor tables created');
  } catch (error) {
    logger.error('Error initializing content tables:', error.message);
    throw error;
  }
}

/**
 * Initialize social database tables (forums, marketplace, etc.)
 */
async function initializeSocialTables() {
  try {
    logger.info('Initializing social database tables...');

    // Create forum_categories table
    await socialDb.query(`
      CREATE TABLE IF NOT EXISTS forum_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create forums table
    await socialDb.query(`
      CREATE TABLE IF NOT EXISTS forums (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category_id INT REFERENCES forum_categories(id),
        created_by UUID NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create forum_threads table
    await socialDb.query(`
      CREATE TABLE IF NOT EXISTS forum_threads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        forum_id INT NOT NULL REFERENCES forums(id) ON DELETE CASCADE,
        author_id UUID NOT NULL,
        title VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        is_sticky BOOLEAN DEFAULT false,
        is_locked BOOLEAN DEFAULT false,
        view_count INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create forum_posts table
    await socialDb.query(`
      CREATE TABLE IF NOT EXISTS forum_posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        thread_id UUID NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
        author_id UUID NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create products table for marketplace
    await socialDb.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        image_url TEXT,
        category VARCHAR(100),
        platform_type VARCHAR(50) DEFAULT 'marketplace',
        creator_id INT NOT NULL,
        stock_quantity INT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create orders table for marketplace
    await socialDb.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        product_id INT NOT NULL REFERENCES products(id),
        buyer_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        total_amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        status VARCHAR(20) DEFAULT 'pending',
        shipping_address TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create indexes for performance
    try {
      await socialDb.query(`
      CREATE INDEX IF NOT EXISTS idx_forums_category ON forums(category_id);
      CREATE INDEX IF NOT EXISTS idx_forums_created_by ON forums(created_by);
      CREATE INDEX IF NOT EXISTS idx_forum_threads_forum ON forum_threads(forum_id);
      CREATE INDEX IF NOT EXISTS idx_forum_threads_author ON forum_threads(author_id);
      CREATE INDEX IF NOT EXISTS idx_forum_posts_thread ON forum_posts(thread_id);
      CREATE INDEX IF NOT EXISTS idx_forum_posts_author ON forum_posts(author_id);
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
      CREATE INDEX IF NOT EXISTS idx_products_creator ON products(creator_id);
      CREATE INDEX IF NOT EXISTS idx_orders_product ON orders(product_id);
      CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
    `);
    } catch (e) { logger.warn('Index creation skipped due to schema drift: ' + e.message); }

    logger.info('✅ Social tables created');
  } catch (error) {
    logger.error('Error initializing social tables:', error.message);
    throw error;
  }
}

/**
 * Initialize financial database tables
 */
async function initializeFinancialTables() {
  try {
    logger.info('Initializing financial database tables...');

    // Create wallets table
    await financialDb.query(`
      CREATE TABLE IF NOT EXISTS wallets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id INT NOT NULL UNIQUE,
        balance DECIMAL(15, 2) DEFAULT 0.00,
        currency VARCHAR(3) DEFAULT 'USD',
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create transactions table
    await financialDb.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
        user_id INT NOT NULL,
        type VARCHAR(50) NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        status VARCHAR(20) DEFAULT 'pending',
        description TEXT,
        reference_id VARCHAR(255),
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    logger.info('✅ Financial tables created');
  } catch (error) {
    logger.error('Error initializing financial tables:', error.message);
    throw error;
  }
}

/**
 * Initialize STERCS Editor tables
 */
async function initializeStercsTables() {
  try {
    logger.info('Initializing STERCS Editor tables...');

    // Create stercs_projects table
    await identityDb.query(`
      CREATE TABLE IF NOT EXISTS stercs_projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        member_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create stercs_pages table
    await identityDb.query(`
      CREATE TABLE IF NOT EXISTS stercs_pages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id INT NOT NULL REFERENCES stercs_projects(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        content JSONB,
        meta_data JSONB,
        is_published BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create stercs_templates table
    await identityDb.query(`
      CREATE TABLE IF NOT EXISTS stercs_templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        content JSONB,
        is_public BOOLEAN DEFAULT false,
        author_id INT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    logger.info('✅ STERCS Editor tables created');
  } catch (error) {
    logger.error('Error initializing STERCS Editor tables:', error.message);
    throw error;
  }
}

/**
 * Initialize all database tables
 */
async function initializeDatabase() {
  try {
    logger.info('Starting database initialization...');

    // Initialize identity database tables
    await initializeIdentityTables();
    logger.info('✅ Identity database initialized');

    // Initialize content database tables
    await initializeContentTables();
    logger.info('✅ Content database initialized');

    // Initialize social database tables
    await initializeSocialTables();
    logger.info('✅ Social database initialized');

    // Initialize financial database tables
    await initializeFinancialTables();
    logger.info('✅ Financial database initialized');

    // Initialize security database tables
    await initializeSecurityTables();
    logger.info('✅ Security database initialized');

    // Initialize communication database tables
    await initializeCommunicationTables();  // Added this call
    logger.info('✅ Communication database initialized');

    // Initialize monetization database tables
    await initializeMonetizationTables();
    logger.info('✅ Monetization database initialized');

    // Initialize STERCS Editor tables
    await initializeStercsTables();
    logger.info('✅ STERCS database initialized');

    logger.info('🎉 All database tables created successfully!');
  } catch (error) {
    logger.error('❌ Error during database initialization:', error);
    throw error;
  }
}

module.exports = { initializeDatabase };

// Run initialization if this script is called directly
if (require.main === module) {
  initializeDatabase();
}
