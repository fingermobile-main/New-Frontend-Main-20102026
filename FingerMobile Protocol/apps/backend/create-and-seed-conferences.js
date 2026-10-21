/**
 * create-and-seed-conferences.js
 * Adds compatibility columns to conference_rooms and seeds active conference rooms.
 */
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: 'password',
  database: 'fingermobile_platform_db'
});

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Add compatibility columns
    await client.query(`
      ALTER TABLE conference_rooms 
        ADD COLUMN IF NOT EXISTS room_id VARCHAR(100),
        ADD COLUMN IF NOT EXISTS title VARCHAR(255),
        ADD COLUMN IF NOT EXISTS scheduled_start TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN IF NOT EXISTS scheduled_end TIMESTAMP WITH TIME ZONE,
        ADD COLUMN IF NOT EXISTS meeting_code VARCHAR(50);
    `);

    // 2. Fetch a valid user id for host
    const userRes = await client.query('SELECT id FROM users LIMIT 1');
    const hostId = userRes.rows[0]?.id || '00000000-0000-0000-0000-000000000000';

    // 3. Upsert conference rooms
    const sampleRooms = [
      {
        roomId: 'STRATEGIC-SYNC-2026',
        name: 'FingerMobile Protocol Strategic Sync 2026',
        title: 'FingerMobile Protocol Strategic Sync 2026',
        description: 'Executive quarterly sync and architectural roadmap discussion for FingerMobile ecosystem.',
        meetingCode: 'STRATEGIC-SYNC-2026',
        status: 'active',
        maxParticipants: 100
      },
      {
        roomId: 'TECH-SUMMIT-STAGE',
        name: 'Global Web3 & Creator Infrastructure Summit',
        title: 'Global Web3 & Creator Infrastructure Summit',
        description: 'Deep dive into decentralized video, payment streaming, and AI avatar companion integration.',
        meetingCode: 'TECH-SUMMIT-STAGE',
        status: 'active',
        maxParticipants: 250
      },
      {
        roomId: 'CREATOR-TOWNHALL-1',
        name: 'Creator Townhall & Protocol Governance',
        title: 'Creator Townhall & Protocol Governance',
        description: 'Monthly open forum with protocol creators, audio artists, and verified publishers.',
        meetingCode: 'CREATOR-TOWNHALL-1',
        status: 'active',
        maxParticipants: 500
      }
    ];

    for (const room of sampleRooms) {
      const existing = await client.query('SELECT id FROM conference_rooms WHERE room_id = $1 OR name = $2', [room.roomId, room.name]);
      let confRoomId;
      if (existing.rows.length === 0) {
        const ins = await client.query(`
          INSERT INTO conference_rooms (
            host_id, name, title, description, max_participants, 
            is_recording_enabled, is_screen_share_enabled, status, room_id, meeting_code, scheduled_start
          ) VALUES ($1, $2, $3, $4, $5, true, true, $6, $7, $8, NOW())
          RETURNING id;
        `, [hostId, room.name, room.title, room.description, room.maxParticipants, room.status, room.roomId, room.meetingCode]);
        confRoomId = ins.rows[0].id;
      } else {
        confRoomId = existing.rows[0].id;
        await client.query(`
          UPDATE conference_rooms
          SET title = $1, room_id = $2, meeting_code = $3, status = $4
          WHERE id = $5
        `, [room.title, room.roomId, room.meetingCode, room.status, confRoomId]);
      }

      // Add a participant if none exists
      const pCount = await client.query('SELECT COUNT(*) FROM conference_participants WHERE room_id = $1', [confRoomId]);
      if (parseInt(pCount.rows[0].count, 10) === 0) {
        await client.query(`
          INSERT INTO conference_participants (room_id, user_id, joined_at, status)
          VALUES ($1, $2, NOW(), 'connected')
        `, [confRoomId, hostId]);
      }
    }

    await client.query('COMMIT');
    console.log('✅ Successfully seeded conference rooms & participants!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Failed seeding conferences:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
