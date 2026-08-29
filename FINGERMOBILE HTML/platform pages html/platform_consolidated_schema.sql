-- Consolidated FingerMobile Platform Schema
-- To be applied to fingermobile_platform_db

-- Identity Database Schema (Core Tables)
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  membername VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone_number VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(20),
  country VARCHAR(100),
  city VARCHAR(100),
  profile_picture_url TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Communication & Security Schema
CREATE TABLE IF NOT EXISTS sender_certificates (
    id SERIAL PRIMARY KEY,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    public_key TEXT NOT NULL,
    private_key_encrypted TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS sealed_messages (
    id SERIAL PRIMARY KEY,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES members(id) ON DELETE CASCADE,
    encrypted_content TEXT NOT NULL,
    sealed_key TEXT NOT NULL,
    iv TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES members(id) ON DELETE CASCADE,
  message_type VARCHAR(20) DEFAULT 'text',
  content TEXT,
  file_url TEXT,
  status VARCHAR(20) DEFAULT 'sent',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wallet & Monetization Schema
CREATE TABLE IF NOT EXISTS fics_wallets (
  id SERIAL PRIMARY KEY,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(15, 2) DEFAULT 0.00,
  locked_balance DECIMAL(15, 2) DEFAULT 0.00,
  currency_code VARCHAR(10) DEFAULT 'FIC',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_members_membername ON members(membername);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_sender_certificates_member ON sender_certificates(member_id);
CREATE INDEX IF NOT EXISTS idx_sealed_messages_recipient ON sealed_messages(recipient_id);
