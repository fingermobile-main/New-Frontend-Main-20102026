/**
 * Database Migration Script for Messages Table
 * Adds conversation support to existing messages table
 */

/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */

require('dotenv').config();
const { Pool } = require('pg');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'fingermobile_social_dev',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
};

const pool = new Pool(dbConfig);

/**
 * Main migration function
 */
async function migrate() {
  let client;

  try {
    console.log('Starting messages table migration...');

    // Connect to the database
    client = await pool.connect();

    // Check if messages table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'messages'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('Messages table does not exist, creating...');
      await client.query(`
        CREATE TABLE messages (
          id SERIAL PRIMARY KEY,
          conversation_id UUID,
          sender_id UUID,
          receiver_id UUID,
          subject VARCHAR(255),
          content TEXT NOT NULL,
          message_type VARCHAR(20) DEFAULT 'text',
          is_read BOOLEAN DEFAULT false,
          is_deleted_by_sender BOOLEAN DEFAULT false,
          is_deleted_by_receiver BOOLEAN DEFAULT false,
          sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          read_at TIMESTAMP WITH TIME ZONE
        );
      `);

      // Create indexes
      await client.query(`
        CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
        CREATE INDEX idx_messages_sender_id ON messages(sender_id);
        CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
        CREATE INDEX idx_messages_sent_at ON messages(sent_at);
        CREATE INDEX idx_messages_is_read ON messages(is_read);
      `);
    } else {
      // Check if conversation_id column exists
      const colCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'messages' AND column_name = 'conversation_id'
        );
      `);

      if (!colCheck.rows[0].exists) {
        console.log('Adding conversation_id column to messages table...');
        await client.query(`
          ALTER TABLE messages ADD COLUMN conversation_id UUID;
        `);

        // Create index for conversation_id
        await client.query(`
          CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
        `);
      }

      // Check if message_type column exists
      const typeColCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'messages' AND column_name = 'message_type'
        );
      `);

      if (!typeColCheck.rows[0].exists) {
        console.log('Adding message_type column to messages table...');
        await client.query(`
          ALTER TABLE messages ADD COLUMN message_type VARCHAR(20) DEFAULT 'text';
        `);
      }
    }

    // Check if conversations table exists
    const convTableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'conversations'
      );
    `);

    if (!convTableCheck.rows[0].exists) {
      console.log('Creating conversations table...');
      await client.query(`
        CREATE TABLE conversations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          type VARCHAR(20) DEFAULT 'direct',
          name VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await client.query(`
        CREATE INDEX idx_conversations_created_at ON conversations(created_at);
      `);
    }

    // Check if conversation_participants table exists
    const partTableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'conversation_participants'
      );
    `);

    if (!partTableCheck.rows[0].exists) {
      console.log('Creating conversation_participants table...');
      await client.query(`
        CREATE TABLE conversation_participants (
          id SERIAL PRIMARY KEY,
          conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
          user_id UUID,
          joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          left_at TIMESTAMP WITH TIME ZONE,
          is_active BOOLEAN DEFAULT true
        );
      `);

      await client.query(`
        CREATE INDEX idx_conversation_participants_conv ON conversation_participants(conversation_id);
        CREATE INDEX idx_conversation_participants_user ON conversation_participants(user_id);
      `);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Release client and close pool
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

// Run the migration
if (require.main === module) {
  migrate();
}

module.exports = migrate;
