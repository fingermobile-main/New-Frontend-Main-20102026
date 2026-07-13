-- FingerMobile Platform Multi-Database Initialization
-- This script creates all 6 required databases for the platform

-- Create databases if they don't exist
SELECT 'CREATE DATABASE fingermobile_identity_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'fingermobile_identity_db')\gexec

SELECT 'CREATE DATABASE fingermobile_content_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'fingermobile_content_db')\gexec

SELECT 'CREATE DATABASE fingermobile_social_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'fingermobile_social_db')\gexec

SELECT 'CREATE DATABASE fingermobile_monetization_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'fingermobile_monetization_db')\gexec

SELECT 'CREATE DATABASE fingermobile_communication_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'fingermobile_communication_db')\gexec

SELECT 'CREATE DATABASE fingermobile_control_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'fingermobile_control_db')\gexec
