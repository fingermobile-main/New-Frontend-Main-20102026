/**
 * Database Migration Runner
 * Executes all pending database migrations
 */

const {
  identityDb,
  contentDb,
  socialDb,
  monetizationDb,
  communicationDb,
  controlDb
} = require("./db");

async function runMigrations() {
  logger.info("Starting database migrations...");

  try {
    // Read and execute migration 001
    logger.info(
      "Executing migration,
001: Creating missing functionality tables...",
    );
    const migration1Sql = `
      --,
Migration: Create tables for missing functionality endpoints

      -- Connect to content_db for post-related tables
      --,
Note: We don't need \c commands here as each pool connects to a specific DB
      
      -- Table for post likes
      CREATE TABLE IF NOT EXISTS post_likes (
          id BIGSERIAL PRIMARY KEY,
          post_id BIGINT NOT NULL,
          member_id BIGINT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(post_id, member_id)
      );

      -- Index for faster queries on post likes
      CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
      CREATE INDEX IF NOT EXISTS idx_post_likes_member_id ON post_likes(member_id);

      -- Table for post comments
      CREATE TABLE IF NOT EXISTS post_comments (
          id BIGSERIAL PRIMARY KEY,
          post_id BIGINT NOT NULL,
          member_id BIGINT NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Index for faster queries on post comments
      CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
      CREATE INDEX IF NOT EXISTS idx_post_comments_member_id ON post_comments(member_id);

      -- Table for post votes/polls
      CREATE TABLE IF NOT EXISTS post_votes (
          id BIGSERIAL PRIMARY KEY,
          post_id BIGINT NOT NULL,
          member_id BIGINT NOT NULL,
          option_id VARCHAR(255) NOT NULL, -- identifier for the option voted for
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(post_id, member_id)
      );

      -- Index for faster queries on post votes
      CREATE INDEX IF NOT EXISTS idx_post_votes_post_id ON post_votes(post_id);
      CREATE INDEX IF NOT EXISTS idx_post_votes_option_id ON post_votes(option_id);

      -- Table for post tokenization (NFTs)
      CREATE TABLE IF NOT EXISTS post_tokens (
          id BIGSERIAL PRIMARY KEY,
          post_id BIGINT NOT NULL,
          creator_id BIGINT NOT NULL,
          token_name VARCHAR(255) NOT NULL,
          token_description TEXT,
          token_contract_address VARCHAR(255),
          token_id VARCHAR(255),
          blockchain_network VARCHAR(50) DEFAULT 'ethereum',
          status VARCHAR(20) DEFAULT 'pending', -- pending, minted, failed
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Index for faster queries on post tokens
      CREATE INDEX IF NOT EXISTS idx_post_tokens_post_id ON post_tokens(post_id);
      CREATE INDEX IF NOT EXISTS idx_post_tokens_creator_id ON post_tokens(creator_id);

      -- Connect to monetization_db for gift-related tables
      -- Table for gift transactions
      CREATE TABLE IF NOT EXISTS gift_transactions (
          id BIGSERIAL PRIMARY KEY,
          sender_id BIGINT NOT NULL,
          recipient_id BIGINT NOT NULL,
          gift_id VARCHAR(255) NOT NULL, -- identifier for the specific gift
          message TEXT,
          amount DECIMAL(10,2) NOT NULL DEFAULT 0.00, -- cost of the gift
          currency_code VARCHAR(3) NOT NULL DEFAULT 'FIC',
          status VARCHAR(20) DEFAULT 'completed', -- pending, completed, refunded
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Index for faster queries on gift transactions
      CREATE INDEX IF NOT EXISTS idx_gift_transactions_sender_id ON gift_transactions(sender_id);
      CREATE INDEX IF NOT EXISTS idx_gift_transactions_recipient_id ON gift_transactions(recipient_id);
      CREATE INDEX IF NOT EXISTS idx_gift_transactions_gift_id ON gift_transactions(gift_id);

      -- Table for AI generations tracking
      CREATE TABLE IF NOT EXISTS ai_generations (
          id BIGSERIAL PRIMARY KEY,
          member_id BIGINT NOT NULL,
          prompt TEXT NOT NULL,
          content_type VARCHAR(20) NOT NULL, -- image, video, text
          output_url TEXT,
          generation_cost DECIMAL(10,2) DEFAULT 0.00,
          status VARCHAR(20) DEFAULT 'processing', -- processing, completed, failed
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          completed_at TIMESTAMP WITH TIME ZONE
      );

      -- Index for faster queries on AI generations
      CREATE INDEX IF NOT EXISTS idx_ai_generations_member_id ON ai_generations(member_id);
      CREATE INDEX IF NOT EXISTS idx_ai_generations_content_type ON ai_generations(content_type);
    `;

    await contentDb.query(migration1Sql);
    logger.info("✓ Migration 001 completed");

    // Read and execute migration 002
    logger.info(
      "Executing migration,
002: Creating specialized platform tables...",
    );
    const migration2Sql = `
      --,
Migration: Create tables for specialized platform services

      -- Table for CAMUS courses
      CREATE TABLE IF NOT EXISTS camus_courses (
          id BIGSERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          category VARCHAR(100),
          instructor_id BIGINT NOT NULL,
          price DECIMAL(10,2) DEFAULT 0.00,
          thumbnail_url TEXT,
          rating DECIMAL(3,2) DEFAULT 0.00,
          review_count INTEGER DEFAULT 0,
          is_published BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Table for CAMUS course modules
      CREATE TABLE IF NOT EXISTS camus_modules (
          id BIGSERIAL PRIMARY KEY,
          course_id BIGINT NOT NULL REFERENCES camus_courses(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Table for CAMUS lessons
      CREATE TABLE IF NOT EXISTS camus_lessons (
          id BIGSERIAL PRIMARY KEY,
          module_id BIGINT NOT NULL REFERENCES camus_modules(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          content TEXT,
          lesson_type VARCHAR(50) DEFAULT 'text', -- text, video, quiz, assignment
          video_url TEXT,
          duration INTEGER, -- in seconds
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Table for CAMUS enrollments
      CREATE TABLE IF NOT EXISTS camus_enrollments (
          id BIGSERIAL PRIMARY KEY,
          member_id BIGINT NOT NULL,
          course_id BIGINT NOT NULL REFERENCES camus_courses(id) ON DELETE CASCADE,
          progress_percentage INTEGER DEFAULT 0,
          enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          completed_at TIMESTAMP WITH TIME ZONE,
          UNIQUE(member_id, course_id)
      );

      -- Table for CAMUS course reviews
      CREATE TABLE IF NOT EXISTS camus_course_reviews (
          id BIGSERIAL PRIMARY KEY,
          course_id BIGINT NOT NULL REFERENCES camus_courses(id) ON DELETE CASCADE,
          member_id BIGINT NOT NULL,
          rating INTEGER CHECK (rating >= 1 AND rating <= 5),
          review_text TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(course_id, member_id)
      );

      -- Indexes for CAMUS tables
      CREATE INDEX IF NOT EXISTS idx_camus_courses_instructor ON camus_courses(instructor_id);
      CREATE INDEX IF NOT EXISTS idx_camus_courses_category ON camus_courses(category);
      CREATE INDEX IF NOT EXISTS idx_camus_enrollments_member ON camus_enrollments(member_id);
      CREATE INDEX IF NOT EXISTS idx_camus_enrollments_course ON camus_enrollments(course_id);

      -- Table for SEADS projects
      CREATE TABLE IF NOT EXISTS seads_projects (
          id BIGSERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          category VARCHAR(100),
          creator_id BIGINT NOT NULL,
          funding_goal DECIMAL(12,2) NOT NULL,
          current_funding DECIMAL(12,2) DEFAULT 0.00,
          deadline TIMESTAMP WITH TIME ZONE,
          image_url TEXT,
          rating DECIMAL(3,2) DEFAULT 0.00,
          review_count INTEGER DEFAULT 0,
          status VARCHAR(20) DEFAULT 'active', -- active, completed, failed, cancelled
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Table for SEADS project updates
      CREATE TABLE IF NOT EXISTS seads_updates (
          id BIGSERIAL PRIMARY KEY,
          project_id BIGINT NOT NULL REFERENCES seads_projects(id) ON DELETE CASCADE,
          author_id BIGINT NOT NULL,
          title VARCHAR(255) NOT NULL,
          content TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Table for SEADS backers
      CREATE TABLE IF NOT EXISTS seads_backers (
          id BIGSERIAL PRIMARY KEY,
          project_id BIGINT NOT NULL REFERENCES seads_projects(id) ON DELETE CASCADE,
          backer_id BIGINT NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          backed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Table for SEADS project reviews
      CREATE TABLE IF NOT EXISTS seads_reviews (
          id BIGSERIAL PRIMARY KEY,
          project_id BIGINT NOT NULL REFERENCES seads_projects(id) ON DELETE CASCADE,
          reviewer_id BIGINT NOT NULL,
          rating INTEGER CHECK (rating >= 1 AND rating <= 5),
          review_text TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(project_id, reviewer_id)
      );

      -- Indexes for SEADS tables
      CREATE INDEX IF NOT EXISTS idx_seads_projects_creator ON seads_projects(creator_id);
      CREATE INDEX IF NOT EXISTS idx_seads_projects_category ON seads_projects(category);
      CREATE INDEX IF NOT EXISTS idx_seads_backers_project ON seads_backers(project_id);
      CREATE INDEX IF NOT EXISTS idx_seads_backers_backer ON seads_backers(backer_id);

      -- Table for advertising campaigns
      CREATE TABLE IF NOT EXISTS publicitee_campaigns (
          id BIGSERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          advertiser_id BIGINT NOT NULL,
          campaign_type VARCHAR(50) DEFAULT 'display', -- display, video, native, search
          budget DECIMAL(12,2) NOT NULL,
          spent_amount DECIMAL(12,2) DEFAULT 0.00,
          start_date DATE,
          end_date DATE,
          target_audience TEXT,
          status VARCHAR(20) DEFAULT 'draft', -- draft, active, paused, completed
          landing_page_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Table for ad impressions
      CREATE TABLE IF NOT EXISTS publicitee_impressions (
          id BIGSERIAL PRIMARY KEY,
          campaign_id BIGINT NOT NULL REFERENCES publicitee_campaigns(id) ON DELETE CASCADE,
          member_id BIGINT,
          impression_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          device_type VARCHAR(20), -- mobile, desktop, tablet
          browser VARCHAR(50),
          ip_address VARCHAR(45),
          member_agent TEXT
      );

      -- Indexes for PUBLICITEE tables
      CREATE INDEX IF NOT EXISTS idx_publicitee_campaigns_advertiser ON publicitee_campaigns(advertiser_id);
      CREATE INDEX IF NOT EXISTS idx_publicitee_impressions_campaign ON publicitee_impressions(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_publicitee_impressions_member ON publicitee_impressions(member_id);

      -- Table for short-form videos
      CREATE TABLE IF NOT EXISTS fingershorts_videos (
          id BIGSERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          creator_id BIGINT NOT NULL,
          video_url TEXT NOT NULL,
          thumbnail_url TEXT,
          duration INTEGER, -- in seconds
          view_count INTEGER DEFAULT 0,
          like_count INTEGER DEFAULT 0,
          comment_count INTEGER DEFAULT 0,
          is_public BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Table for video likes
      CREATE TABLE IF NOT EXISTS fingershorts_video_likes (
          id BIGSERIAL PRIMARY KEY,
          video_id BIGINT NOT NULL REFERENCES fingershorts_videos(id) ON DELETE CASCADE,
          member_id BIGINT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(video_id, member_id)
      );

      -- Table for video comments
      CREATE TABLE IF NOT EXISTS fingershorts_comments (
          id BIGSERIAL PRIMARY KEY,
          video_id BIGINT NOT NULL REFERENCES fingershorts_videos(id) ON DELETE CASCADE,
          member_id BIGINT NOT NULL,
          content TEXT NOT NULL,
          parent_comment_id BIGINT, -- for nested replies
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Indexes for FINGERSHORTS tables
      CREATE INDEX IF NOT EXISTS idx_fingershorts_videos_creator ON fingershorts_videos(creator_id);
      CREATE INDEX IF NOT EXISTS idx_fingershorts_video_likes_video ON fingershorts_video_likes(video_id);
      CREATE INDEX IF NOT EXISTS idx_fingershorts_video_likes_member ON fingershorts_video_likes(member_id);
      CREATE INDEX IF NOT EXISTS idx_fingershorts_comments_video ON fingershorts_comments(video_id);
      CREATE INDEX IF NOT EXISTS idx_fingershorts_comments_member ON fingershorts_comments(member_id);

      -- Table for system alerts
      CREATE TABLE IF NOT EXISTS canary_alerts (
          id BIGSERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          severity VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
          category VARCHAR(50), -- security, performance, availability, etc.
          source_component VARCHAR(100),
          reported_by BIGINT, -- member ID if human report, NULL if automated
          is_resolved BOOLEAN DEFAULT FALSE,
          resolved_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Table for alert subscriptions
      CREATE TABLE IF NOT EXISTS canary_subscriptions (
          id BIGSERIAL PRIMARY KEY,
          member_id BIGINT NOT NULL,
          alert_category VARCHAR(50),
          notification_method VARCHAR(20) DEFAULT 'email', -- email, sms, push
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Indexes for CANARY tables
      CREATE INDEX IF NOT EXISTS idx_canary_alerts_severity ON canary_alerts(severity);
      CREATE INDEX IF NOT EXISTS idx_canary_alerts_category ON canary_alerts(category);
      CREATE INDEX IF NOT EXISTS idx_canary_alerts_resolved ON canary_alerts(is_resolved);
      CREATE INDEX IF NOT EXISTS idx_canary_subscriptions_member ON canary_subscriptions(member_id);

      -- Table for voice clips
      CREATE TABLE IF NOT EXISTS voicefeed_posts (
          id BIGSERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          category VARCHAR(100),
          creator_id BIGINT NOT NULL,
          audio_url TEXT NOT NULL,
          duration INTEGER, -- in seconds
          language VARCHAR(10),
          like_count INTEGER DEFAULT 0,
          comment_count INTEGER DEFAULT 0,
          view_count INTEGER DEFAULT 0,
          is_public BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Table for voice clip likes
      CREATE TABLE IF NOT EXISTS voicefeed_likes (
          id BIGSERIAL PRIMARY KEY,
          clip_id BIGINT NOT NULL REFERENCES voicefeed_posts(id) ON DELETE CASCADE,
          member_id BIGINT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(clip_id, member_id)
      );

      -- Table for voice clip comments
      CREATE TABLE IF NOT EXISTS voicefeed_comments (
          id BIGSERIAL PRIMARY KEY,
          clip_id BIGINT NOT NULL REFERENCES voicefeed_posts(id) ON DELETE CASCADE,
          member_id BIGINT NOT NULL,
          comment_text TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Indexes for VOICEFEED tables
      CREATE INDEX IF NOT EXISTS idx_voicefeed_posts_creator ON voicefeed_posts(creator_id);
      CREATE INDEX IF NOT EXISTS idx_voicefeed_posts_category ON voicefeed_posts(category);
      CREATE INDEX IF NOT EXISTS idx_voicefeed_likes_clip ON voicefeed_likes(clip_id);
      CREATE INDEX IF NOT EXISTS idx_voicefeed_comments_clip ON voicefeed_comments(clip_id);
    `;

    await monetizationDb.query(migration2Sql);
    logger.info("✓ Migration 002 completed");

    logger.info("\nAll database migrations completed successfully!");
  } catch (error) {
    logger.error("Error during,
migrations:", error);
    process.exit(1);
  }
}

// Run migrations if this script is called directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
