-- Phase 2, Week 1: Pages B2B Lead-Gen Engine Enhancements
-- Date: June 4, 2026
-- Description: Add advanced tracking and CRM features to pages system

BEGIN;

-- 1. Enhance page_visitors table with conversion tracking
ALTER TABLE page_visitors 
ADD COLUMN IF NOT EXISTS cta_clicked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS cta_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS scroll_depth INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS time_on_page_seconds INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS converted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS conversion_value DECIMAL(10,2) DEFAULT 0.00;

-- 2. Add indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_page_visitors_cta ON page_visitors(page_id, cta_clicked) WHERE cta_clicked = TRUE;
CREATE INDEX IF NOT EXISTS idx_page_visitors_time ON page_visitors(time_on_page_seconds);
CREATE INDEX IF NOT EXISTS idx_page_visitors_converted ON page_visitors(converted) WHERE converted = TRUE;

-- 3. Create CTA buttons table
CREATE TABLE IF NOT EXISTS page_ctas (
    id SERIAL PRIMARY KEY,
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    button_text VARCHAR(100) NOT NULL,
    button_type VARCHAR(50) DEFAULT 'primary', -- primary, secondary, outline
    action_type VARCHAR(50) NOT NULL, -- link, contact_form, phone, email, download
    action_value TEXT, -- URL, phone number, email, file path
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    click_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ctas_page ON page_ctas(page_id);
CREATE INDEX IF NOT EXISTS idx_ctas_active ON page_ctas(is_active) WHERE is_active = TRUE;

-- 4. Create page analytics snapshots table (for historical data)
CREATE TABLE IF NOT EXISTS page_analytics_snapshots (
    id SERIAL PRIMARY KEY,
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    snapshot_date DATE NOT NULL,
    total_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    total_cta_clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    avg_dwell_time_seconds INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(page_id, snapshot_date)
);

CREATE INDEX IF NOT EXISTS idx_analytics_page_date ON page_analytics_snapshots(page_id, snapshot_date DESC);

-- 5. Function to update engagement score when engagement changes
CREATE OR REPLACE FUNCTION calculate_engagement_score(p_content_id UUID)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    v_score DECIMAL(10,2);
BEGIN
    SELECT COALESCE(
        (COUNT(CASE WHEN engagement_type = 'save' THEN 1 END) * 5) +
        (COUNT(CASE WHEN engagement_type = 'share' THEN 1 END) * 4) +
        (COUNT(CASE WHEN engagement_type = 'comment' THEN 1 END) * 3) +
        (COUNT(CASE WHEN engagement_type = 'like' THEN 1 END) * 1),
        0
    ) INTO v_score
    FROM engagement
    WHERE content_id = p_content_id;
    
    UPDATE content SET engagement_score = v_score WHERE id = p_content_id;
    
    RETURN v_score;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger to auto-update engagement score
CREATE OR REPLACE FUNCTION trigger_update_engagement_score()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        PERFORM calculate_engagement_score(OLD.content_id);
        RETURN OLD;
    ELSE
        PERFORM calculate_engagement_score(NEW.content_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_engagement_score ON engagement;
CREATE TRIGGER trg_engagement_score
    AFTER INSERT OR UPDATE OR DELETE ON engagement
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_engagement_score();

-- 7. Function to generate daily analytics snapshots
CREATE OR REPLACE FUNCTION generate_daily_page_analytics(p_date DATE DEFAULT CURRENT_DATE)
RETURNS VOID AS $$
BEGIN
    INSERT INTO page_analytics_snapshots (
        page_id,
        snapshot_date,
        total_views,
        unique_visitors,
        total_cta_clicks,
        conversions,
        avg_dwell_time_seconds,
        bounce_rate
    )
    SELECT 
        pv.page_id,
        p_date,
        COUNT(*) as total_views,
        COUNT(DISTINCT pv.visitor_id) as unique_visitors,
        COUNT(CASE WHEN pv.cta_clicked = TRUE THEN 1 END) as total_cta_clicks,
        COUNT(CASE WHEN pv.converted = TRUE THEN 1 END) as conversions,
        AVG(pv.time_on_page_seconds) as avg_dwell_time_seconds,
        ROUND(
            COUNT(CASE WHEN pv.time_on_page_seconds < 10 THEN 1 END)::DECIMAL / 
            NULLIF(COUNT(*), 0) * 100, 
            2
        ) as bounce_rate
    FROM page_visitors pv
    WHERE DATE(pv.visited_at) = p_date
    GROUP BY pv.page_id
    ON CONFLICT (page_id, snapshot_date) 
    DO UPDATE SET
        total_views = EXCLUDED.total_views,
        unique_visitors = EXCLUDED.unique_visitors,
        total_cta_clicks = EXCLUDED.total_cta_clicks,
        conversions = EXCLUDED.conversions,
        avg_dwell_time_seconds = EXCLUDED.avg_dwell_time_seconds,
        bounce_rate = EXCLUDED.bounce_rate;
END;
$$ LANGUAGE plpgsql;

COMMIT;

-- Verification queries
SELECT 'Migration completed successfully' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('page_ctas', 'page_analytics_snapshots') ORDER BY table_name;
SELECT COUNT(*) as new_indexes FROM pg_indexes WHERE schemaname = 'public' AND (indexname LIKE 'idx_%cta%' OR indexname LIKE 'idx_%analytics%' OR indexname LIKE 'idx_page_visitors_%');
