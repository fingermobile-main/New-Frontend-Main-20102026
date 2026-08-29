-- Phase 2: Create Conversations Table for CRM Features
-- Date: June 4, 2026
-- Description: Add conversations table to support Pages messaging inbox and lead management

BEGIN;

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    page_id UUID REFERENCES pages(id) ON DELETE SET NULL,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    partner_id UUID REFERENCES members(id) ON DELETE CASCADE,
    lead_score INTEGER DEFAULT 0,
    lead_status VARCHAR(20) DEFAULT 'new', -- new, contacted, qualified, converted, lost
    last_contacted_at TIMESTAMP,
    next_follow_up TIMESTAMP,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(member_id, partner_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_page ON conversations(page_id);
CREATE INDEX IF NOT EXISTS idx_conversations_member ON conversations(member_id);
CREATE INDEX IF NOT EXISTS idx_conversations_partner ON conversations(partner_id);
CREATE INDEX IF NOT EXISTS idx_conversations_lead_status ON conversations(lead_status);
CREATE INDEX IF NOT EXISTS idx_conversations_lead_score ON conversations(lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_active ON conversations(is_archived) WHERE is_archived = FALSE;

-- Function to auto-update conversation timestamp
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations 
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMIT;

-- Verification
SELECT 'Conversations table created successfully' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conversations';
SELECT COUNT(*) as conversation_indexes FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'conversations';
