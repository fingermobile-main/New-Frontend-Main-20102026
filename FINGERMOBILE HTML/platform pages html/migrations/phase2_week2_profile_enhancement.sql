-- Phase 2 Week 2: Profile Enhancement - Profile Video & Skills
-- Date: June 4, 2026
-- Description: Add profile video upload and skills graph functionality

BEGIN;

-- Add profile video columns to members table
ALTER TABLE members
ADD COLUMN IF NOT EXISTS profile_video_url TEXT,
ADD COLUMN IF NOT EXISTS profile_video_duration INTEGER, -- in seconds
ADD COLUMN IF NOT EXISTS profile_video_thumbnail TEXT,
ADD COLUMN IF NOT EXISTS profile_video_uploaded_at TIMESTAMP;

-- Create skills taxonomy table
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50), -- technical, creative, business, soft_skills, etc.
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create member_skills junction table
CREATE TABLE IF NOT EXISTS member_skills (
    id SERIAL PRIMARY KEY,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level INTEGER CHECK (proficiency_level >= 1 AND proficiency_level <= 5), -- 1=Beginner, 5=Expert
    years_experience INTEGER,
    endorsement_count INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(member_id, skill_id)
);

-- Create skill endorsements table
CREATE TABLE IF NOT EXISTS skill_endorsements (
    id SERIAL PRIMARY KEY,
    endorser_id UUID REFERENCES members(id) ON DELETE CASCADE,
    endorsed_member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
    endorsement_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(endorser_id, endorsed_member_id, skill_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_members_profile_video ON members(profile_video_url) WHERE profile_video_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(name);
CREATE INDEX IF NOT EXISTS idx_member_skills_member ON member_skills(member_id);
CREATE INDEX IF NOT EXISTS idx_member_skills_skill ON member_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_member_skills_proficiency ON member_skills(proficiency_level);
CREATE INDEX IF NOT EXISTS idx_endorsements_endorsed ON skill_endorsements(endorsed_member_id);
CREATE INDEX IF NOT EXISTS idx_endorsements_skill ON skill_endorsements(skill_id);

-- Function to update skill endorsement count
CREATE OR REPLACE FUNCTION update_skill_endorsement_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE member_skills 
        SET endorsement_count = endorsement_count + 1
        WHERE member_id = NEW.endorsed_member_id AND skill_id = NEW.skill_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE member_skills 
        SET endorsement_count = GREATEST(endorsement_count - 1, 0)
        WHERE member_id = OLD.endorsed_member_id AND skill_id = OLD.skill_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update endorsement counts
DROP TRIGGER IF EXISTS trg_update_endorsement_count ON skill_endorsements;
CREATE TRIGGER trg_update_endorsement_count
AFTER INSERT OR DELETE ON skill_endorsements
FOR EACH ROW EXECUTE FUNCTION update_skill_endorsement_count();

COMMIT;

-- Verification
SELECT 'Profile enhancement tables created successfully' as status;
SELECT COUNT(*) as total_skills_tables FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('skills', 'member_skills', 'skill_endorsements');
SELECT COUNT(*) as profile_video_columns FROM information_schema.columns WHERE table_name = 'members' AND column_name IN ('profile_video_url', 'profile_video_duration', 'profile_video_thumbnail');
