/**
 * conferenceController.js
 * Controller for Conference Room module
 */
const { pool } = require('../db');
const logger = require('../utils/logger');

class ConferenceController {
  // GET /api/conference/rooms
  async getRooms(req, res) {
    try {
      const result = await pool.query(`
        SELECT cr.*, 
               COUNT(cp.id)::int as active_participants_count
        FROM conference_rooms cr
        LEFT JOIN conference_participants cp ON cr.id = cp.room_id AND cp.left_at IS NULL
        GROUP BY cr.id
        ORDER BY cr.scheduled_start DESC
      `);
      return res.json({
        success: true,
        data: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in conferenceController.getRooms:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch rooms', error: error.message });
    }
  }

  // GET /api/conference/rooms/:roomId
  async getRoomDetails(req, res) {
    try {
      const { roomId } = req.params;
      const roomRes = await pool.query('SELECT * FROM conference_rooms WHERE room_id = $1 OR id::text = $1', [roomId]);
      if (roomRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Conference room not found' });
      }
      const room = roomRes.rows[0];
      const participantsRes = await pool.query(`
        SELECT * FROM conference_participants 
        WHERE room_id = $1 AND left_at IS NULL
        ORDER BY joined_at ASC
      `, [room.id]);

      return res.json({
        success: true,
        data: {
          ...room,
          participants: participantsRes.rows
        }
      });
    } catch (error) {
      logger.error('Error in conferenceController.getRoomDetails:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch room details', error: error.message });
    }
  }

  // POST /api/conference/rooms
  async createRoom(req, res) {
    try {
      const { title, room_id, scheduled_start, max_participants = 50 } = req.body;
      const host_id = req.user?.id || 'host_user';
      const actualRoomId = room_id || `conf-${Date.now()}`;

      const result = await pool.query(`
        INSERT INTO conference_rooms (room_id, host_id, title, scheduled_start, is_active, max_participants)
        VALUES ($1, $2, $3, $4, true, $5)
        RETURNING *
      `, [actualRoomId, host_id, title || 'Instant Conference Meeting', scheduled_start || new Date(), max_participants]);

      return res.status(201).json({
        success: true,
        message: 'Conference room created successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in conferenceController.createRoom:', error);
      return res.status(500).json({ success: false, message: 'Failed to create conference room', error: error.message });
    }
  }

  // POST /api/conference/rooms/:roomId/join
  async joinRoom(req, res) {
    try {
      const { roomId } = req.params;
      const { user_name, role = 'participant' } = req.body;
      const userId = req.user?.id || req.body.userId || `user-${Date.now()}`;

      // Find room
      let room = (await pool.query('SELECT * FROM conference_rooms WHERE room_id = $1 OR id::text = $1', [roomId])).rows[0];
      if (!room) {
        // Auto-provision room if accessed by code
        room = (await pool.query(`
          INSERT INTO conference_rooms (room_id, host_id, title, is_active)
          VALUES ($1, $2, $3, true)
          RETURNING *
        `, [roomId, userId, `Room ${roomId}`])).rows[0];
      }

      const participantRes = await pool.query(`
        INSERT INTO conference_participants (room_id, user_id, role, is_speaking, is_muted, has_video)
        VALUES ($1, $2, $3, false, false, true)
        RETURNING *
      `, [room.id, userId, role]);

      return res.json({
        success: true,
        message: 'Joined conference room',
        data: {
          room,
          participant: participantRes.rows[0]
        }
      });
    } catch (error) {
      logger.error('Error in conferenceController.joinRoom:', error);
      return res.status(500).json({ success: false, message: 'Failed to join room', error: error.message });
    }
  }

  // POST /api/conference/rooms/:roomId/leave
  async leaveRoom(req, res) {
    try {
      const { roomId } = req.params;
      const userId = req.user?.id || req.body.userId;

      await pool.query(`
        UPDATE conference_participants
        SET left_at = NOW()
        WHERE user_id = $1 AND left_at IS NULL
      `, [userId]);

      return res.json({ success: true, message: 'Left conference room' });
    } catch (error) {
      logger.error('Error in conferenceController.leaveRoom:', error);
      return res.status(500).json({ success: false, message: 'Failed to leave room', error: error.message });
    }
  }
}

module.exports = new ConferenceController();
