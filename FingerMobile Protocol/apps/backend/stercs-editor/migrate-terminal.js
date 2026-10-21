/* eslint-disable no-unused-vars */
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

// Database connection configuration
const dbConfig = {member: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fingermobile_identity_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432
};

// SQL to add terminal-related tables
const terminalSchemaSQL = `
-- AI Integration Tables
CREATE TABLE IF NOT EXISTS ai_prompt_history (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES stercs_members(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    type VARCHAR(50), -- text, image, code, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_generated_content (
    id SERIAL PRIMARY KEY,
    prompt_id INTEGER REFERENCES ai_prompt_history(id) ON DELETE CASCADE,
    content_type VARCHAR(50), -- text, image, code, etc.
    content TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Code Snippets Table
CREATE TABLE IF NOT EXISTS code_snippets (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES stercs_members(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    language VARCHAR(50), -- typescript, javascript, css, etc.
    code TEXT NOT NULL,
    tags TEXT[],
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Custom Styles Table
CREATE TABLE IF NOT EXISTS custom_styles (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES stercs_members(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    css TEXT NOT NULL,
    is_global BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workspace Settings
CREATE TABLE IF NOT EXISTS workspace_settings (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES stercs_members(id) ON DELETE CASCADE,
    settings JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Container Management
CREATE TABLE IF NOT EXISTS containers (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES stercs_members(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    image VARCHAR(255) NOT NULL,
    ports JSONB,
    volumes JSONB,
    environment JSONB,
    status VARCHAR(50) DEFAULT 'stopped',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Terminal Sessions
CREATE TABLE IF NOT EXISTS terminal_sessions (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES stercs_members(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL,
    command_history TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Explorer History
CREATE TABLE IF NOT EXISTS explorer_history (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES stercs_members(id) ON DELETE CASCADE,
    path VARCHAR(512) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Version Control
CREATE TABLE IF NOT EXISTS version_control (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES stercs_members(id) ON DELETE CASCADE,
    project_id INTEGER REFERENCES stercs_projects(id) ON DELETE CASCADE,
    commit_hash VARCHAR(64) NOT NULL,
    message TEXT,
    author VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    diff TEXT
);

-- Preview Settings
CREATE TABLE IF NOT EXISTS preview_settings (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES stercs_members(id) ON DELETE CASCADE,
    settings JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to update the updated_at timestamp
CREATE TRIGGER update_workspace_settings_updated_at 
    BEFORE UPDATE ON workspace_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_styles_updated_at 
    BEFORE UPDATE ON custom_styles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_code_snippets_updated_at 
    BEFORE UPDATE ON code_snippets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_containers_updated_at 
    BEFORE UPDATE ON containers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_preview_settings_updated_at 
    BEFORE UPDATE ON preview_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

async function runMigration() {
  const client = new Client(dbConfig);

  try {
    await client.connect();
    logger.info('Connected to PostgreSQL database');

    // Run the schema migration
    await client.query(terminalSchemaSQL);
    logger.info('Terminal-related schema migration completed successfully!');
  } catch (err) {
    logger.error('Error running, migration:', err);
  } finally {
    await client.end();
    logger.info('Database connection closed');
  }
}

// Run the migration
runMigration();
