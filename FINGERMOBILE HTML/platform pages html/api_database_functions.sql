-- FingerMobile Platform - API Database Functions & Views
-- This file contains PostgreSQL functions and views for the API layer
-- To be applied after platform_consolidated_schema.sql

-- ===== NEW SCHEMA TABLES (Week 1 Priority) =====

-- Pages (B2B Landing Pages)
CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES members(id) ON DELETE CASCADE,
    page_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100),
    description TEXT,
    cover_image_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    lead_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Page Visitors (Lead Tracking)
CREATE TABLE IF NOT EXISTS page_visitors (
    id SERIAL PRIMARY KEY,
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    visitor_id UUID REFERENCES members(id),
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dwell_time_seconds INTEGER DEFAULT 0,
    action_taken VARCHAR(50) -- 'contact', 'follow', 'none'
);

-- Content (Posts, Media)
CREATE TABLE IF NOT EXISTS content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES members(id) ON DELETE CASCADE,
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL, -- 'post', 'image', 'video', 'document'
    title VARCHAR(500),
    body TEXT,
    media_urls TEXT[],
    tags TEXT[],
    visibility VARCHAR(20) DEFAULT 'public', -- 'public', 'followers', 'private'
    engagement_score DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Engagement (Likes, Comments, Shares)
CREATE TABLE IF NOT EXISTS engagement (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES members(id) ON DELETE CASCADE,
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    engagement_type VARCHAR(20) NOT NULL, -- 'like', 'comment', 'share', 'save'
    comment_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Groups (Social Features)
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES members(id) ON DELETE CASCADE,
    member_count INTEGER DEFAULT 1,
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Group Members
CREATE TABLE IF NOT EXISTS group_members (
    id SERIAL PRIMARY KEY,
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member', -- 'owner', 'admin', 'moderator', 'member'
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, member_id)
);

-- Followers/Following
CREATE TABLE IF NOT EXISTS followers (
    id SERIAL PRIMARY KEY,
    follower_id UUID REFERENCES members(id) ON DELETE CASCADE,
    following_id UUID REFERENCES members(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id)
);

-- Earnings (Monetization)
CREATE TABLE IF NOT EXISTS earnings (
    id SERIAL PRIMARY KEY,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    source_type VARCHAR(50) NOT NULL, -- 'fmpp', 'cmp', 'tips', 'ads'
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'FIC',
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'paid'
    transaction_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP
);

-- Authenticity Scores
CREATE TABLE IF NOT EXISTS authenticity_scores (
    id SERIAL PRIMARY KEY,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE UNIQUE,
    overall_score DECIMAL(5,2) DEFAULT 50.00,
    profile_completeness DECIMAL(5,2) DEFAULT 0.00,
    verification_level INTEGER DEFAULT 0,
    activity_consistency DECIMAL(5,2) DEFAULT 0.00,
    last_calculated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_pages_owner ON pages(owner_id);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_content_author ON content(author_id);
CREATE INDEX IF NOT EXISTS idx_content_page ON content(page_id);
CREATE INDEX IF NOT EXISTS idx_engagement_content ON engagement(content_id);
CREATE INDEX IF NOT EXISTS idx_earnings_member ON earnings(member_id);
CREATE INDEX IF NOT EXISTS idx_groups_owner ON groups(owner_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_followers_follower ON followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_followers_following ON followers(following_id);
CREATE INDEX IF NOT EXISTS idx_authenticity_member ON authenticity_scores(member_id);

-- ===== MEMBERS API =====

-- Get member by ID (public profile)
CREATE OR REPLACE FUNCTION get_member_profile(p_member_id UUID)
RETURNS TABLE (
    id UUID,
    membername VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_picture_url TEXT,
    bio TEXT,
    is_verified BOOLEAN,
    country VARCHAR,
    city VARCHAR,
    created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id, m.membername, m.first_name, m.last_name,
        m.profile_picture_url, m.bio, m.is_verified,
        m.country, m.city, m.created_at
    FROM members m
    WHERE m.id = p_member_id AND m.is_active = TRUE;
END;
$$ LANGUAGE plpgsql;

-- Update member profile
CREATE OR REPLACE FUNCTION update_member_profile(
    p_member_id UUID,
    p_first_name VARCHAR DEFAULT NULL,
    p_last_name VARCHAR DEFAULT NULL,
    p_bio TEXT DEFAULT NULL,
    p_country VARCHAR DEFAULT NULL,
    p_city VARCHAR DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    UPDATE members
    SET 
        first_name = COALESCE(p_first_name, first_name),
        last_name = COALESCE(p_last_name, last_name),
        bio = COALESCE(p_bio, bio),
        country = COALESCE(p_country, country),
        city = COALESCE(p_city, city),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_member_id;
END;
$$ LANGUAGE plpgsql;

-- ===== AUTHENTICATION API =====

-- Create session (login)
CREATE OR REPLACE FUNCTION create_session(
    p_member_id UUID,
    p_session_token VARCHAR,
    p_expires_at TIMESTAMP
)
RETURNS BIGINT AS $$
DECLARE
    v_session_id BIGINT;
BEGIN
    INSERT INTO sessions (member_id, session_token, expires_at)
    VALUES (p_member_id, p_session_token, p_expires_at)
    RETURNING id INTO v_session_id;
    
    UPDATE members SET last_login = CURRENT_TIMESTAMP WHERE id = p_member_id;
    
    RETURN v_session_id;
END;
$$ LANGUAGE plpgsql;

-- Validate session
CREATE OR REPLACE FUNCTION validate_session(p_session_token VARCHAR)
RETURNS TABLE (
    member_id UUID,
    is_valid BOOLEAN,
    expires_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.member_id,
        (s.expires_at > CURRENT_TIMESTAMP) AS is_valid,
        s.expires_at
    FROM sessions s
    WHERE s.session_token = p_session_token;
END;
$$ LANGUAGE plpgsql;

-- Delete session (logout)
CREATE OR REPLACE FUNCTION delete_session(p_session_token VARCHAR)
RETURNS VOID AS $$
BEGIN
    DELETE FROM sessions WHERE session_token = p_session_token;
END;
$$ LANGUAGE plpgsql;

-- ===== WALLET API =====

-- Get wallet balance
CREATE OR REPLACE FUNCTION get_wallet_balance(p_member_id UUID)
RETURNS TABLE (
    wallet_id BIGINT,
    balance DECIMAL,
    locked_balance DECIMAL,
    currency_code VARCHAR,
    status VARCHAR,
    updated_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        w.id, w.balance, w.locked_balance, 
        w.currency_code, w.status, w.updated_at
    FROM fics_wallets w
    WHERE w.member_id = p_member_id;
END;
$$ LANGUAGE plpgsql;

-- Transfer FIC between wallets
CREATE OR REPLACE FUNCTION transfer_fic(
    p_from_member_id UUID,
    p_to_member_id UUID,
    p_amount DECIMAL,
    p_description TEXT DEFAULT NULL
)
RETURNS TABLE (
    success BOOLEAN,
    error_message TEXT,
    transaction_id BIGINT
) AS $$
DECLARE
    v_from_balance DECIMAL;
    v_to_wallet_id BIGINT;
    v_transaction_id BIGINT;
BEGIN
    -- Check balance
    SELECT balance INTO v_from_balance 
    FROM fics_wallets 
    WHERE member_id = p_from_member_id;
    
    IF v_from_balance < p_amount THEN
        RETURN QUERY SELECT FALSE, 'Insufficient balance'::TEXT, NULL::BIGINT;
        RETURN;
    END IF;
    
    -- Perform transfer
    UPDATE fics_wallets 
    SET balance = balance - p_amount, updated_at = CURRENT_TIMESTAMP
    WHERE member_id = p_from_member_id;
    
    UPDATE fics_wallets 
    SET balance = balance + p_amount, updated_at = CURRENT_TIMESTAMP
    WHERE member_id = p_to_member_id;
    
    RETURN QUERY SELECT TRUE, NULL::TEXT, NULL::BIGINT;
END;
$$ LANGUAGE plpgsql;

-- ===== MESSAGES API =====

-- Send message
CREATE OR REPLACE FUNCTION send_message(
    p_from_member_id UUID,
    p_to_member_id UUID,
    p_content TEXT,
    p_message_type VARCHAR DEFAULT 'text'
)
RETURNS BIGINT AS $$
DECLARE
    v_message_id BIGINT;
BEGIN
    INSERT INTO messages (member_id, recipient_id, content, message_type)
    VALUES (p_from_member_id, p_to_member_id, p_content, p_message_type)
    RETURNING id INTO v_message_id;
    
    RETURN v_message_id;
END;
$$ LANGUAGE plpgsql;

-- Get conversations
CREATE OR REPLACE FUNCTION get_conversations(p_member_id UUID)
RETURNS TABLE (
    conversation_partner_id UUID,
    partner_membername VARCHAR,
    partner_profile_picture_url TEXT,
    last_message TEXT,
    last_message_at TIMESTAMP,
    unread_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE 
            WHEN m.member_id = p_member_id THEN m.recipient_id
            ELSE m.member_id
        END AS conversation_partner_id,
        mem.membername,
        mem.profile_picture_url,
        m.content AS last_message,
        m.created_at AS last_message_at,
        (SELECT COUNT(*) FROM messages 
         WHERE member_id != p_member_id 
         AND recipient_id = p_member_id 
         AND status = 'sent') AS unread_count
    FROM messages m
    JOIN members mem ON mem.id = (
        CASE 
            WHEN m.member_id = p_member_id THEN m.recipient_id
            ELSE m.member_id
        END
    )
    WHERE m.member_id = p_member_id OR m.recipient_id = p_member_id
    ORDER BY m.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Get messages in conversation
CREATE OR REPLACE FUNCTION get_conversation_messages(
    p_member_id UUID,
    p_partner_id UUID,
    p_limit INT DEFAULT 50,
    p_offset INT DEFAULT 0
)
RETURNS TABLE (
    id BIGINT,
    sender_id UUID,
    sender_membername VARCHAR,
    content TEXT,
    message_type VARCHAR,
    status VARCHAR,
    created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id, m.member_id, mem.membername,
        m.content, m.message_type, m.status, m.created_at
    FROM messages m
    JOIN members mem ON mem.id = m.member_id
    WHERE (m.member_id = p_member_id AND m.recipient_id = p_partner_id)
       OR (m.member_id = p_partner_id AND m.recipient_id = p_member_id)
    ORDER BY m.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_read(
    p_member_id UUID,
    p_from_member_id UUID
)
RETURNS VOID AS $$
BEGIN
    UPDATE messages
    SET status = 'read'
    WHERE member_id = p_from_member_id 
      AND recipient_id = p_member_id 
      AND status = 'sent';
END;
$$ LANGUAGE plpgsql;

-- ===== ANALYTICS & STATS =====

-- Get platform stats
CREATE OR REPLACE FUNCTION get_platform_stats()
RETURNS TABLE (
    total_members BIGINT,
    active_members BIGINT,
    total_messages BIGINT,
    total_wallet_balance DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM members WHERE is_active = TRUE),
        (SELECT COUNT(*) FROM members WHERE last_login > CURRENT_TIMESTAMP - INTERVAL '30 days'),
        (SELECT COUNT(*) FROM messages),
        (SELECT COALESCE(SUM(balance), 0) FROM fics_wallets);
END;
$$ LANGUAGE plpgsql;

-- ===== INDEXES FOR PERFORMANCE =====
CREATE INDEX IF NOT EXISTS idx_messages_member_recipient ON messages(member_id, recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_fics_wallets_member ON fics_wallets(member_id);

-- ===== VIEWS FOR COMMON QUERIES =====

-- Active members view
CREATE OR REPLACE VIEW active_members AS
SELECT 
    id, membername, first_name, last_name,
    profile_picture_url, bio, is_verified,
    country, city, last_login, created_at
FROM members
WHERE is_active = TRUE;

-- Wallet summary view
CREATE OR REPLACE VIEW wallet_summary AS
SELECT 
    m.id AS member_id,
    m.membername,
    m.email,
    w.balance,
    w.locked_balance,
    w.currency_code,
    w.status AS wallet_status,
    w.updated_at AS wallet_updated_at
FROM members m
LEFT JOIN fics_wallets w ON m.id = w.member_id
WHERE m.is_active = TRUE;

-- Recent messages view
CREATE OR REPLACE VIEW recent_messages AS
SELECT 
    m.id,
    m.member_id AS sender_id,
    sm.membername AS sender_name,
    m.recipient_id,
    rm.membername AS recipient_name,
    m.content,
    m.message_type,
    m.status,
    m.created_at
FROM messages m
JOIN members sm ON sm.id = m.member_id
JOIN members rm ON rm.id = m.recipient_id
ORDER BY m.created_at DESC
LIMIT 100;
