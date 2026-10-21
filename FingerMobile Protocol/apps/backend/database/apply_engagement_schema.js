const { pool } = require('../db');
const logger = require('../utils/logger');

const sql = `
-- 1. Alter posts table to include missing counter columns
ALTER TABLE posts ADD COLUMN IF NOT EXISTS dislikes_count INT DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS views_count INT DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS shares_count INT DEFAULT 0;

-- 2. Track who disliked which post
CREATE TABLE IF NOT EXISTS post_dislikes (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    member_id INT NOT NULL, -- references members table ideally
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, member_id)
);

-- 3. Store Polls
CREATE TABLE IF NOT EXISTS post_polls (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Store Poll Votes
CREATE TABLE IF NOT EXISTS post_poll_votes (
    id SERIAL PRIMARY KEY,
    poll_id INT NOT NULL REFERENCES post_polls(id) ON DELETE CASCADE,
    member_id INT NOT NULL,
    option_index INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(poll_id, member_id)
);

-- 5. Track interactions like sending gifts, giftcards, gems, products
CREATE TABLE IF NOT EXISTS post_interactions (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    member_id INT NOT NULL,
    interaction_type VARCHAR(50) NOT NULL, -- 'gift', 'giftcard', 'gem', 'product'
    item_id VARCHAR(100) NOT NULL,
    amount INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

async function applyEngagementSchema() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    logger.info('Applying engagement schema to database...');
    await client.query(sql);
    await client.query('COMMIT');
    logger.info('Successfully applied engagement schema!');
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Error applying schema:', error);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

applyEngagementSchema();
