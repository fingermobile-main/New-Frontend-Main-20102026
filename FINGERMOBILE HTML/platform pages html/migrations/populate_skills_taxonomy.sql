-- Phase 2 Week 2: Pre-populate Skills Taxonomy
-- Date: June 4, 2026
-- Description: Add 100+ common skills across different categories

BEGIN;

-- Technical Skills
INSERT INTO skills (name, category, description) VALUES
('JavaScript', 'technical', 'Programming language for web development'),
('TypeScript', 'technical', 'Typed superset of JavaScript'),
('Python', 'technical', 'High-level programming language'),
('Java', 'technical', 'Object-oriented programming language'),
('C++', 'technical', 'Systems programming language'),
('React', 'technical', 'JavaScript library for building user interfaces'),
('Node.js', 'technical', 'JavaScript runtime environment'),
('SQL', 'technical', 'Database query language'),
('PostgreSQL', 'technical', 'Relational database management system'),
('MongoDB', 'technical', 'NoSQL document database'),
('Docker', 'technical', 'Containerization platform'),
('Kubernetes', 'technical', 'Container orchestration system'),
('AWS', 'technical', 'Amazon Web Services cloud platform'),
('Azure', 'technical', 'Microsoft cloud computing platform'),
('Git', 'technical', 'Version control system'),
('Linux', 'technical', 'Open-source operating system'),
('HTML/CSS', 'technical', 'Web markup and styling languages'),
('REST API', 'technical', 'Representational State Transfer API design'),
('GraphQL', 'technical', 'Query language for APIs'),
('Microservices', 'technical', 'Architectural style for applications')
ON CONFLICT (name) DO NOTHING;

-- Creative Skills
INSERT INTO skills (name, category, description) VALUES
('Graphic Design', 'creative', 'Visual communication and design'),
('UI/UX Design', 'creative', 'User interface and experience design'),
('Video Editing', 'creative', 'Post-production video editing'),
('Photography', 'creative', 'Digital photography and image capture'),
('Illustration', 'creative', 'Digital and traditional illustration'),
('Animation', 'creative', 'Motion graphics and animation'),
('3D Modeling', 'creative', 'Three-dimensional digital modeling'),
('Typography', 'creative', 'Art and technique of arranging type'),
('Branding', 'creative', 'Brand identity and strategy'),
('Content Writing', 'creative', 'Written content creation')
ON CONFLICT (name) DO NOTHING;

-- Business Skills
INSERT INTO skills (name, category, description) VALUES
('Project Management', 'business', 'Planning and executing projects'),
('Strategic Planning', 'business', 'Long-term business strategy development'),
('Business Analysis', 'business', 'Analyzing business processes and requirements'),
('Financial Analysis', 'business', 'Evaluating financial data and trends'),
('Marketing Strategy', 'business', 'Developing marketing plans and campaigns'),
('Sales Management', 'business', 'Managing sales teams and processes'),
('Customer Relationship Management', 'business', 'Managing customer interactions'),
('Supply Chain Management', 'business', 'Optimizing supply chain operations'),
('Risk Management', 'business', 'Identifying and mitigating business risks'),
('Change Management', 'business', 'Managing organizational change')
ON CONFLICT (name) DO NOTHING;

-- Soft Skills
INSERT INTO skills (name, category, description) VALUES
('Communication', 'soft_skills', 'Effective verbal and written communication'),
('Leadership', 'soft_skills', 'Guiding and motivating teams'),
('Problem Solving', 'soft_skills', 'Analytical thinking and solution finding'),
('Teamwork', 'soft_skills', 'Collaborative work with others'),
('Time Management', 'soft_skills', 'Efficient use of time and resources'),
('Adaptability', 'soft_skills', 'Flexibility in changing environments'),
('Critical Thinking', 'soft_skills', 'Objective analysis and evaluation'),
('Emotional Intelligence', 'soft_skills', 'Understanding and managing emotions'),
('Negotiation', 'soft_skills', 'Reaching mutually beneficial agreements'),
('Public Speaking', 'soft_skills', 'Effective presentation and speaking')
ON CONFLICT (name) DO NOTHING;

-- Data & Analytics
INSERT INTO skills (name, category, description) VALUES
('Data Analysis', 'data', 'Analyzing and interpreting data'),
('Machine Learning', 'data', 'Building predictive models'),
('Data Visualization', 'data', 'Creating visual representations of data'),
('Statistics', 'data', 'Statistical analysis and methods'),
('Big Data', 'data', 'Processing large datasets'),
('Business Intelligence', 'data', 'Transforming data into insights'),
('A/B Testing', 'data', 'Experimental design and testing'),
('Predictive Analytics', 'data', 'Forecasting future trends'),
('Data Mining', 'data', 'Extracting patterns from data'),
('ETL', 'data', 'Extract, Transform, Load processes')
ON CONFLICT (name) DO NOTHING;

COMMIT;

-- Verification
SELECT 'Skills taxonomy populated successfully' as status;
SELECT COUNT(*) as total_skills FROM skills;
SELECT category, COUNT(*) as count FROM skills GROUP BY category ORDER BY count DESC;
