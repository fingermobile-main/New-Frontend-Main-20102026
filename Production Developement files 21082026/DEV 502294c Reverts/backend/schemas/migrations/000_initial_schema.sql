-- ============================================================================
-- INITIAL SCHEMA MIGRATION - 000_initial_schema.sql
-- Generated: June 10, 2026
-- Purpose: Capture complete database schema for reproducible deployments
-- ============================================================================
-- 
-- IMPORTANT: This migration should be generated from the live database using:
--   pg_dump --schema-only -U postgres -d fingermobile_identity_db > 000_initial_schema.sql
--
-- Since we cannot access the running database directly, this file serves as:
-- 1. Documentation of required tables based on model analysis
-- 2. Template for manual schema generation
-- 3. Reference for future migration tooling setup
--
-- DATABASES USED:
-- - fingermobile_identity_db (users, auth, sessions)
-- - fingermobile_content_db (posts, comments, media)
-- - fingermobile_social_db (friends, groups, forums)
-- - fingermobile_monetization_db (payments, transactions, wallet)
-- - fingermobile_learning_db (courses, lessons, enrollments)
-- - fingermobile_gaming_db (achievements, leaderboards, matches)
--
-- TO GENERATE THIS FILE PROPERLY:
-- 1. Ensure database is running and populated
-- 2. Run: pg_dump --schema-only -U postgres fingermobile_identity_db > apps/backend/database/migrations/000_identity_schema.sql
-- 3. Run: pg_dump --schema-only -U postgres fingermobile_content_db > apps/backend/database/migrations/000_content_schema.sql
-- 4. Repeat for all databases
-- 5. Merge into single file or keep separate per database
-- ============================================================================

-- ============================================================================
-- IDENTITY DATABASE SCHEMA (fingermobile_identity_db)
-- ============================================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    avatar_url TEXT,
    bio TEXT,
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(50) DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    refresh_token VARCHAR(500),
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- OAuth2 Authorization Codes
CREATE TABLE IF NOT EXISTS oauth_authorization_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_id VARCHAR(255) NOT NULL,
    redirect_uri TEXT NOT NULL,
    scope TEXT,
    code_challenge VARCHAR(255),
    code_challenge_method VARCHAR(10),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_oauth_codes_code ON oauth_authorization_codes(code);
CREATE INDEX idx_oauth_codes_expires ON oauth_authorization_codes(expires_at);

-- Refresh Tokens (OAuth2/OIDC)
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(500) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_id VARCHAR(255) NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);

-- Token Blacklist
CREATE TABLE IF NOT EXISTS token_blacklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_jti VARCHAR(255) UNIQUE NOT NULL,
    reason VARCHAR(255),
    blacklisted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_token_blacklist_jti ON token_blacklist(token_jti);
CREATE INDEX idx_token_blacklist_expires ON token_blacklist(expires_at);

-- OAuth2 Clients
CREATE TABLE IF NOT EXISTS oauth_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id VARCHAR(255) UNIQUE NOT NULL,
    client_secret VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    redirect_uris TEXT[],
    grant_types TEXT[] DEFAULT '{"authorization_code","refresh_token"}',
    scope TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_oauth_clients_client_id ON oauth_clients(client_id);

-- API Keys
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    permissions JSONB,
    rate_limit INTEGER DEFAULT 1000,
    active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_api_keys_user ON api_keys(user_id);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);

-- Two-Factor Authentication Backup Codes
CREATE TABLE IF NOT EXISTS mfa_backup_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code_hash VARCHAR(255) NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mfa_backup_codes_user ON mfa_backup_codes(user_id);

-- ============================================================================
-- CONTENT DATABASE SCHEMA (fingermobile_content_db)
-- ============================================================================

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL,
    content TEXT,
    media_urls TEXT[],
    post_type VARCHAR(50) DEFAULT 'text',
    visibility VARCHAR(50) DEFAULT 'public',
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_posts_published ON posts(published_at DESC);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);

-- Media uploads
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uploader_id UUID NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    mime_type VARCHAR(100),
    file_size BIGINT,
    duration INTEGER, -- for videos/audio in seconds
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    status VARCHAR(50) DEFAULT 'processing',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_media_uploader ON media(uploader_id);
CREATE INDEX idx_media_status ON media(status);

-- Blogs
CREATE TABLE IF NOT EXISTS blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    tags TEXT[],
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'draft',
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blogs_author ON blogs(author_id);
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_status ON blogs(status);

-- ============================================================================
-- SOCIAL DATABASE SCHEMA (fingermobile_social_db)
-- ============================================================================

-- Friendships
CREATE TABLE IF NOT EXISTS friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID NOT NULL,
    addressee_id UUID NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(requester_id, addressee_id)
);

CREATE INDEX idx_friendships_requester ON friendships(requester_id);
CREATE INDEX idx_friendships_addressee ON friendships(addressee_id);
CREATE INDEX idx_friendships_status ON friendships(status);

-- Groups
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    avatar_url TEXT,
    creator_id UUID NOT NULL,
    privacy VARCHAR(50) DEFAULT 'public',
    member_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_groups_creator ON groups(creator_id);

-- Group Memberships
CREATE TABLE IF NOT EXISTS group_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, user_id)
);

CREATE INDEX idx_group_memberships_group ON group_memberships(group_id);
CREATE INDEX idx_group_memberships_user ON group_memberships(user_id);

-- Forums
CREATE TABLE IF NOT EXISTS forums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    creator_id UUID NOT NULL,
    post_count INTEGER DEFAULT 0,
    member_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_forums_creator ON forums(creator_id);

-- Forum Categories
CREATE TABLE IF NOT EXISTS forum_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    order_index INTEGER DEFAULT 0
);

-- ============================================================================
-- MONETIZATION DATABASE SCHEMA (fingermobile_monetization_db)
-- ============================================================================

-- Wallets
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wallets_user ON wallets(user_id);

-- Wallet Transactions
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- credit, debit
    amount DECIMAL(15, 2) NOT NULL,
    balance_after DECIMAL(15, 2) NOT NULL,
    reference_type VARCHAR(100),
    reference_id UUID,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wallet_transactions_wallet ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_transactions_created ON wallet_transactions(created_at DESC);

-- Payment Gateways
CREATE TABLE IF NOT EXISTS payment_gateways (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    provider VARCHAR(100) NOT NULL, -- paystack, stripe, etc.
    config JSONB NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending',
    payment_gateway VARCHAR(100),
    payment_reference VARCHAR(255),
    paid_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Coupons
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) UNIQUE NOT NULL,
    discount_type VARCHAR(50) NOT NULL, -- percentage, fixed
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(15, 2),
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_until TIMESTAMP WITH TIME ZONE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_coupons_code ON coupons(code);

-- Gift Cards
CREATE TABLE IF NOT EXISTS gift_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    balance DECIMAL(15, 2) NOT NULL,
    purchaser_id UUID,
    recipient_email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    redeemed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gift_cards_code ON gift_cards(code);

-- Creator Subscriptions
CREATE TABLE IF NOT EXISTS creator_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL,
    subscriber_id UUID NOT NULL,
    tier VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'active',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(creator_id, subscriber_id)
);

CREATE INDEX idx_creator_subscriptions_creator ON creator_subscriptions(creator_id);
CREATE INDEX idx_creator_subscriptions_subscriber ON creator_subscriptions(subscriber_id);

-- ============================================================================
-- LEARNING DATABASE SCHEMA (fingermobile_learning_db)
-- ============================================================================

-- Courses
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instructor_id UUID NOT NULL,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    category VARCHAR(100),
    level VARCHAR(50) DEFAULT 'beginner',
    price DECIMAL(10, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    total_lessons INTEGER DEFAULT 0,
    total_duration INTEGER DEFAULT 0, -- in minutes
    enrollment_count INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_status ON courses(status);

-- Course Lessons
CREATE TABLE IF NOT EXISTS course_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    video_url TEXT,
    duration INTEGER, -- in seconds
    order_index INTEGER NOT NULL,
    is_preview BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_course_lessons_course ON course_lessons(course_id);
CREATE INDEX idx_course_lessons_order ON course_lessons(order_index);

-- Course Materials
CREATE TABLE IF NOT EXISTS course_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_course_materials_course ON course_materials(course_id);

-- Course Enrollments
CREATE TABLE IF NOT EXISTS course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    member_id UUID NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    progress_percentage DECIMAL(5, 2) DEFAULT 0.00,
    completed_lessons INTEGER DEFAULT 0,
    total_lessons INTEGER NOT NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(course_id, member_id)
);

CREATE INDEX idx_course_enrollments_member ON course_enrollments(member_id);

-- Course Progress
CREATE TABLE IF NOT EXISTS course_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL REFERENCES course_enrollments(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent_seconds INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(enrollment_id, lesson_id)
);

CREATE INDEX idx_course_progress_enrollment ON course_progress(enrollment_id);

-- Course Reviews
CREATE TABLE IF NOT EXISTS course_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    member_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(500),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, member_id)
);

CREATE INDEX idx_course_reviews_course ON course_reviews(course_id);

-- Course Categories
CREATE TABLE IF NOT EXISTS course_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES course_categories(id),
    order_index INTEGER DEFAULT 0
);

-- Grading Scales
CREATE TABLE IF NOT EXISTS grading_scales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    scale_type VARCHAR(50) DEFAULT 'percentage',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Grade Entries
CREATE TABLE IF NOT EXISTS grade_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    course_id UUID NOT NULL,
    assignment_id UUID,
    grade_value DECIMAL(5, 2) NOT NULL,
    grade_scale_id UUID REFERENCES grading_scales(id),
    feedback TEXT,
    graded_by UUID,
    graded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_grade_entries_student ON grade_entries(student_id);
CREATE INDEX idx_grade_entries_course ON grade_entries(course_id);

-- ============================================================================
-- GAMING DATABASE SCHEMA (fingermobile_gaming_db)
-- ============================================================================

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url TEXT,
    points INTEGER DEFAULT 0,
    category VARCHAR(100),
    difficulty VARCHAR(50) DEFAULT 'easy',
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Achievements
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);

-- Leaderboards
CREATE TABLE IF NOT EXISTS leaderboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'weekly',
    category VARCHAR(100),
    reset_schedule VARCHAR(50),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Leaderboard Entries
CREATE TABLE IF NOT EXISTS leaderboard_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    leaderboard_id UUID NOT NULL REFERENCES leaderboards(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    score INTEGER NOT NULL,
    rank INTEGER,
    period_start TIMESTAMP WITH TIME ZONE,
    period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(leaderboard_id, user_id, period_start)
);

CREATE INDEX idx_leaderboard_entries_leaderboard ON leaderboard_entries(leaderboard_id);
CREATE INDEX idx_leaderboard_entries_score ON leaderboard_entries(score DESC);

-- P2P Matches
CREATE TABLE IF NOT EXISTS p2p_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_type VARCHAR(100) NOT NULL,
    player1_id UUID NOT NULL,
    player2_id UUID NOT NULL,
    winner_id UUID,
    status VARCHAR(50) DEFAULT 'pending',
    stake_amount DECIMAL(10, 2) DEFAULT 0.00,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_p2p_matches_player1 ON p2p_matches(player1_id);
CREATE INDEX idx_p2p_matches_player2 ON p2p_matches(player2_id);
CREATE INDEX idx_p2p_matches_status ON p2p_matches(status);

-- Gems (In-game currency)
CREATE TABLE IF NOT EXISTS gems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    balance INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE INDEX idx_gems_user ON gems(user_id);

-- ============================================================================
-- ANALYTICS & METRICS SCHEMA
-- ============================================================================

-- Analytics Events
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    user_id UUID,
    session_id VARCHAR(255),
    properties JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at DESC);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- Feature Flags
CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    enabled BOOLEAN DEFAULT FALSE,
    rollout_percentage INTEGER DEFAULT 0,
    target_users UUID[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_feature_flags_name ON feature_flags(name);

-- ============================================================================
-- AI & PROMPTS SCHEMA
-- ============================================================================

-- AI Credit Balances
CREATE TABLE IF NOT EXISTS ai_credit_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL,
    balance INTEGER DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'credits',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_credit_balances_user ON ai_credit_balances(user_id);

-- AI Usage Logs
CREATE TABLE IF NOT EXISTS ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    feature VARCHAR(100) NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    cost INTEGER DEFAULT 0,
    request_metadata JSONB,
    response_metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_usage_logs_user ON ai_usage_logs(user_id);
CREATE INDEX idx_ai_usage_logs_created ON ai_usage_logs(created_at DESC);

-- NexusGNN Graph Nodes
CREATE TABLE IF NOT EXISTS nexusgnn_graph_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    node_type VARCHAR(100),
    properties JSONB,
    embedding VECTOR(768), -- Requires pgvector extension
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_nexusgnn_entity ON nexusgnn_graph_nodes(entity_id, entity_type);

-- ============================================================================
-- SPECIALIZED FEATURES SCHEMA
-- ============================================================================

-- FingerLux Shows
CREATE TABLE IF NOT EXISTS fingerlux_shows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    genre VARCHAR(100),
    rating DECIMAL(3, 2),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stercs Episodes
CREATE TABLE IF NOT EXISTS stercs_episodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    show_id UUID NOT NULL REFERENCES fingerlux_shows(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    episode_number INTEGER NOT NULL,
    season_number INTEGER NOT NULL,
    video_url TEXT,
    duration INTEGER,
    released_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stercs_episodes_show ON stercs_episodes(show_id);

-- SEADS Initiatives
CREATE TABLE IF NOT EXISTS seads_initiatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    goal_amount DECIMAL(15, 2),
    raised_amount DECIMAL(15, 2) DEFAULT 0.00,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    subject VARCHAR(500) NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    priority VARCHAR(50) DEFAULT 'medium',
    assigned_to UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);

-- Ticket Messages
CREATE TABLE IF NOT EXISTS ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL,
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    attachments TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ticket_messages_ticket ON ticket_messages(ticket_id);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_posts_author_created ON posts(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_created ON comments(post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_created ON wallet_transactions(wallet_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_member_status ON course_enrollments(member_id, status);

-- ============================================================================
-- TRIGGERS FOR AUTOMATION
-- ============================================================================

-- Update updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- END OF INITIAL SCHEMA MIGRATION
-- ============================================================================
