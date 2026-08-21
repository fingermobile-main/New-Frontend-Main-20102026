-- Course Content Module Database Schema
-- E-learning content management system for FingerMobile Protocol
-- Created: June 9, 2026

-- ============================================================================
-- Table: course_categories
-- Description: Categories for organizing courses
-- ============================================================================
CREATE TABLE IF NOT EXISTS course_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_url VARCHAR(500),
    parent_id INTEGER REFERENCES course_categories(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for course_categories
CREATE INDEX IF NOT EXISTS idx_course_categories_slug ON course_categories(slug);
CREATE INDEX IF NOT EXISTS idx_course_categories_parent ON course_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_course_categories_active ON course_categories(is_active) WHERE is_active = true;

-- ============================================================================
-- Table: courses
-- Description: Main course entities with metadata
-- ============================================================================
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    short_description VARCHAR(500),
    category_id INTEGER REFERENCES course_categories(id) ON DELETE SET NULL,
    instructor_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
    thumbnail_url VARCHAR(500),
    preview_video_url VARCHAR(500),
    level VARCHAR(20) CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    language VARCHAR(10) DEFAULT 'en',
    duration_hours DECIMAL(5,2) DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    enrollment_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    tags TEXT[],
    requirements TEXT[],
    learning_outcomes TEXT[],
    meta_title VARCHAR(200),
    meta_description VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for courses
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_courses_featured ON courses(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_price ON courses(price);

-- ============================================================================
-- Table: course_lessons
-- Description: Individual lessons within courses
-- ============================================================================
CREATE TABLE IF NOT EXISTS course_lessons (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    description TEXT,
    lesson_type VARCHAR(20) CHECK (lesson_type IN ('video', 'text', 'quiz', 'assignment', 'download')) DEFAULT 'video',
    video_url VARCHAR(500),
    video_duration_minutes DECIMAL(5,2),
    content TEXT,
    resources JSONB,
    sort_order INTEGER DEFAULT 0,
    is_preview BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    completion_criteria JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, slug)
);

-- Indexes for course_lessons
CREATE INDEX IF NOT EXISTS idx_course_lessons_course ON course_lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_sort ON course_lessons(course_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_course_lessons_published ON course_lessons(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_course_lessons_type ON course_lessons(lesson_type);

-- ============================================================================
-- Table: course_enrollments
-- Description: Student enrollment tracking with progress
-- ============================================================================
CREATE TABLE IF NOT EXISTS course_enrollments (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('active', 'completed', 'cancelled', 'expired')) DEFAULT 'active',
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    completed_lessons INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    certificate_issued BOOLEAN DEFAULT false,
    certificate_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, member_id)
);

-- Indexes for course_enrollments
CREATE INDEX IF NOT EXISTS idx_course_enrollments_member ON course_enrollments(member_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_status ON course_enrollments(status);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_active ON course_enrollments(member_id, status) WHERE status = 'active';

-- ============================================================================
-- Table: course_progress
-- Description: Detailed lesson completion tracking
-- ============================================================================
CREATE TABLE IF NOT EXISTS course_progress (
    id SERIAL PRIMARY KEY,
    enrollment_id INTEGER NOT NULL REFERENCES course_enrollments(id) ON DELETE CASCADE,
    lesson_id INTEGER NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent_seconds INTEGER DEFAULT 0,
    last_position_seconds INTEGER DEFAULT 0,
    quiz_score DECIMAL(5,2),
    quiz_attempts INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(enrollment_id, lesson_id)
);

-- Indexes for course_progress
CREATE INDEX IF NOT EXISTS idx_course_progress_enrollment ON course_progress(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_lesson ON course_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_completed ON course_progress(is_completed) WHERE is_completed = true;

-- ============================================================================
-- Table: course_reviews
-- Description: Student ratings and feedback
-- ============================================================================
CREATE TABLE IF NOT EXISTS course_reviews (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    is_approved BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, member_id)
);

-- Indexes for course_reviews
CREATE INDEX IF NOT EXISTS idx_course_reviews_course ON course_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_course_reviews_member ON course_reviews(member_id);
CREATE INDEX IF NOT EXISTS idx_course_reviews_approved ON course_reviews(is_approved) WHERE is_approved = true;
CREATE INDEX IF NOT EXISTS idx_course_reviews_rating ON course_reviews(rating);

-- ============================================================================
-- Table: course_materials
-- Description: Supplementary resources (PDFs, videos, links)
-- ============================================================================
CREATE TABLE IF NOT EXISTS course_materials (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES course_lessons(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    material_type VARCHAR(20) CHECK (material_type IN ('pdf', 'video', 'audio', 'link', 'document', 'code')) DEFAULT 'document',
    file_url VARCHAR(500),
    external_url VARCHAR(500),
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    description TEXT,
    is_downloadable BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for course_materials
CREATE INDEX IF NOT EXISTS idx_course_materials_course ON course_materials(course_id);
CREATE INDEX IF NOT EXISTS idx_course_materials_lesson ON course_materials(lesson_id);
CREATE INDEX IF NOT EXISTS idx_course_materials_type ON course_materials(material_type);

-- ============================================================================
-- Triggers for automatic timestamp updates
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all course tables
CREATE TRIGGER update_course_categories_updated_at BEFORE UPDATE ON course_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_lessons_updated_at BEFORE UPDATE ON course_lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_enrollments_updated_at BEFORE UPDATE ON course_enrollments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_progress_updated_at BEFORE UPDATE ON course_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_reviews_updated_at BEFORE UPDATE ON course_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_materials_updated_at BEFORE UPDATE ON course_materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Function to update course statistics after enrollment changes
-- ============================================================================
CREATE OR REPLACE FUNCTION update_course_enrollment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE courses 
        SET enrollment_count = enrollment_count + 1
        WHERE id = NEW.course_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE courses 
        SET enrollment_count = GREATEST(enrollment_count - 1, 0)
        WHERE id = OLD.course_id;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_enrollment_count
    AFTER INSERT OR DELETE ON course_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_course_enrollment_count();

-- ============================================================================
-- Function to update course rating after review changes
-- ============================================================================
CREATE OR REPLACE FUNCTION update_course_average_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        IF NEW.is_approved THEN
            UPDATE courses 
            SET 
                average_rating = (
                    SELECT COALESCE(AVG(rating), 0)
                    FROM course_reviews
                    WHERE course_id = NEW.course_id AND is_approved = true
                ),
                review_count = (
                    SELECT COUNT(*)
                    FROM course_reviews
                    WHERE course_id = NEW.course_id AND is_approved = true
                )
            WHERE id = NEW.course_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.is_approved THEN
            UPDATE courses 
            SET 
                average_rating = (
                    SELECT COALESCE(AVG(rating), 0)
                    FROM course_reviews
                    WHERE course_id = OLD.course_id AND is_approved = true
                ),
                review_count = (
                    SELECT COUNT(*)
                    FROM course_reviews
                    WHERE course_id = OLD.course_id AND is_approved = true
                )
            WHERE id = OLD.course_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_course_rating
    AFTER INSERT OR UPDATE OR DELETE ON course_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_course_average_rating();

-- ============================================================================
-- Sample Data for Testing
-- ============================================================================

-- Insert sample categories
INSERT INTO course_categories (name, slug, description, icon_url, sort_order) VALUES
('Programming & Development', 'programming-development', 'Learn coding, web development, and software engineering', '/icons/programming.svg', 1),
('Business & Entrepreneurship', 'business-entrepreneurship', 'Master business skills and startup strategies', '/icons/business.svg', 2),
('Design & Creative', 'design-creative', 'Graphic design, UI/UX, and creative arts', '/icons/design.svg', 3),
('Marketing & Sales', 'marketing-sales', 'Digital marketing, SEO, and sales techniques', '/icons/marketing.svg', 4),
('Data Science & AI', 'data-science-ai', 'Machine learning, data analysis, and AI applications', '/icons/data-science.svg', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample courses (assuming member_id 1 exists as instructor)
INSERT INTO courses (title, slug, description, short_description, category_id, instructor_id, level, language, duration_hours, total_lessons, price, is_published, is_featured, tags, requirements, learning_outcomes) VALUES
(
    'Complete JavaScript Bootcamp',
    'complete-javascript-bootcamp',
    'Master JavaScript from basics to advanced concepts including ES6+, async programming, DOM manipulation, and modern frameworks.',
    'Comprehensive JavaScript course for beginners to advanced developers',
    1,
    1,
    'beginner',
    'en',
    42.5,
    85,
    49.99,
    true,
    true,
    ARRAY['javascript', 'web-development', 'programming', 'frontend'],
    ARRAY['No prior programming experience required', 'Computer with internet access', 'Text editor (VS Code recommended)'],
    ARRAY['Build interactive web applications', 'Master asynchronous JavaScript', 'Understand modern JS features', 'Create real-world projects']
),
(
    'React.js Masterclass',
    'react-js-masterclass',
    'Deep dive into React.js ecosystem including hooks, context API, state management, and performance optimization.',
    'Advanced React patterns and best practices',
    1,
    1,
    'intermediate',
    'en',
    28.0,
    56,
    79.99,
    true,
    false,
    ARRAY['react', 'javascript', 'hooks', 'frontend'],
    ARRAY['Basic JavaScript knowledge', 'Understanding of HTML/CSS', 'Familiarity with ES6 syntax'],
    ARRAY['Build complex React applications', 'Master React Hooks', 'Implement state management', 'Optimize React performance']
),
(
    'Digital Marketing Fundamentals',
    'digital-marketing-fundamentals',
    'Learn SEO, social media marketing, email campaigns, and analytics to grow your online presence.',
    'Complete guide to digital marketing strategies',
    4,
    1,
    'beginner',
    'en',
    18.5,
    37,
    39.99,
    true,
    true,
    ARRAY['marketing', 'seo', 'social-media', 'analytics'],
    ARRAY['Basic computer skills', 'Access to social media accounts', 'Willingness to learn'],
    ARRAY['Create effective marketing campaigns', 'Optimize websites for SEO', 'Analyze marketing metrics', 'Build brand awareness']
)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample lessons for first course
INSERT INTO course_lessons (course_id, title, slug, description, lesson_type, video_url, video_duration_minutes, sort_order, is_preview) VALUES
(1, 'Introduction to JavaScript', 'intro-to-javascript', 'Overview of JavaScript and its role in web development', 'video', 'https://example.com/videos/intro.mp4', 15.5, 1, true),
(1, 'Setting Up Your Environment', 'setting-up-environment', 'Install Node.js, VS Code, and essential tools', 'video', 'https://example.com/videos/setup.mp4', 12.0, 2, true),
(1, 'Variables and Data Types', 'variables-data-types', 'Understanding var, let, const and primitive types', 'video', 'https://example.com/videos/variables.mp4', 22.5, 3, false),
(1, 'Functions and Scope', 'functions-scope', 'Function declarations, expressions, and scope rules', 'video', 'https://example.com/videos/functions.mp4', 25.0, 4, false),
(1, 'Arrays and Objects', 'arrays-objects', 'Working with arrays and objects in JavaScript', 'video', 'https://example.com/videos/arrays.mp4', 28.0, 5, false)
ON CONFLICT (course_id, slug) DO NOTHING;

-- Insert sample materials
INSERT INTO course_materials (course_id, lesson_id, title, material_type, file_url, description, sort_order) VALUES
(1, 1, 'JavaScript Cheat Sheet', 'pdf', 'https://example.com/materials/js-cheatsheet.pdf', 'Quick reference guide for JavaScript basics', 1),
(1, 3, 'Practice Exercises', 'document', 'https://example.com/materials/exercises.md', 'Hands-on exercises for variables and data types', 2),
(1, 5, 'Array Methods Reference', 'pdf', 'https://example.com/materials/array-methods.pdf', 'Complete guide to JavaScript array methods', 3)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Comments
-- ============================================================================
COMMENT ON TABLE course_categories IS 'Categories for organizing and filtering courses';
COMMENT ON TABLE courses IS 'Main course entities with metadata and pricing';
COMMENT ON TABLE course_lessons IS 'Individual lessons that make up a course curriculum';
COMMENT ON TABLE course_enrollments IS 'Tracks student enrollments and overall course progress';
COMMENT ON TABLE course_progress IS 'Detailed tracking of individual lesson completion';
COMMENT ON TABLE course_reviews IS 'Student ratings and written feedback for courses';
COMMENT ON TABLE course_materials IS 'Supplementary learning resources and downloads';
