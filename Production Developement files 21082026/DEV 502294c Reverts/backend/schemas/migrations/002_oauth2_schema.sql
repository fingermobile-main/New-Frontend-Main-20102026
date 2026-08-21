-- OAuth2/OIDC Database Schema
-- Creates tables for authorization codes, refresh tokens, and token blacklist

-- OAuth2 Authorization Codes table
CREATE TABLE IF NOT EXISTS oauth_authorization_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(255) UNIQUE NOT NULL,
    client_id VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
    scopes JSONB NOT NULL DEFAULT '[]',
    redirect_uri TEXT NOT NULL,
    code_challenge VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_oauth_codes_code ON oauth_authorization_codes(code);
CREATE INDEX IF NOT EXISTS idx_oauth_codes_client ON oauth_authorization_codes(client_id);
CREATE INDEX IF NOT EXISTS idx_oauth_codes_expires ON oauth_authorization_codes(expires_at);

-- Refresh Tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    token TEXT UNIQUE NOT NULL,
    user_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
    revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_revoked ON refresh_tokens(revoked);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires ON refresh_tokens(expires_at);

-- Token Blacklist table (for revoked access tokens)
CREATE TABLE IF NOT EXISTS token_blacklist (
    id SERIAL PRIMARY KEY,
    token TEXT UNIQUE NOT NULL,
    blacklisted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reason VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_token_blacklist_token ON token_blacklist(token);
CREATE INDEX IF NOT EXISTS idx_token_blacklist_time ON token_blacklist(blacklisted_at);

-- OAuth2 Clients table (for registered applications)
CREATE TABLE IF NOT EXISTS oauth_clients (
    id SERIAL PRIMARY KEY,
    client_id VARCHAR(255) UNIQUE NOT NULL,
    client_secret VARCHAR(255) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    redirect_uris JSONB NOT NULL DEFAULT '[]',
    allowed_scopes JSONB NOT NULL DEFAULT '["openid", "profile", "email"]',
    grant_types JSONB NOT NULL DEFAULT '["authorization_code", "refresh_token"]',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_oauth_clients_id ON oauth_clients(client_id);

-- Insert sample OAuth2 client for development
INSERT INTO oauth_clients (client_id, client_secret, client_name, redirect_uris, allowed_scopes, grant_types)
VALUES (
    'dev-client-123',
    'dev-secret-456',
    'Development Client',
    '["http://localhost:3000/callback", "https://app.fingermobile.com/callback"]',
    '["openid", "profile", "email", "courses", "analytics"]',
    '["authorization_code", "refresh_token"]'
) ON CONFLICT (client_id) DO NOTHING;

-- Function to clean up expired tokens (call via cron job)
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS VOID AS $$
BEGIN
    -- Delete expired authorization codes
    DELETE FROM oauth_authorization_codes WHERE expires_at < NOW();
    
    -- Delete expired/revoked refresh tokens older than 30 days
    DELETE FROM refresh_tokens 
    WHERE (expires_at < NOW() OR revoked = true) 
    AND revoked_at < NOW() - INTERVAL '30 days';
    
    -- Delete old blacklist entries older than 90 days
    DELETE FROM token_blacklist WHERE blacklisted_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE oauth_authorization_codes IS 'Stores OAuth2 authorization codes with PKCE support';
COMMENT ON TABLE refresh_tokens IS 'Stores refresh tokens with rotation and revocation tracking';
COMMENT ON TABLE token_blacklist IS 'Blacklist for revoked access tokens';
COMMENT ON TABLE oauth_clients IS 'Registered OAuth2 client applications';