/* eslint-disable no-unused-vars */
const logger = require('../utils/logger');
/**
 * ConferenceService
 * WebRTC-based video conferencing with room management, recording, and screen sharing
 */

const { v4: uuidv4 } = require('uuid');
const pool = require('../database/connection');

class ConferenceService {
  /**
   * Create conference room
   */
  async createRoom(userId, options = {}) {
    try {
      const {
        name,
        description,
        maxParticipants = 50,
        isRecordingEnabled = true,
        isScreenShareEnabled = true,
        password = null
      } = options;

      const roomId = uuidv4();

      const query = `
        INSERT INTO conference_rooms (
          id, host_id, name, description, max_participants,
          is_recording_enabled, is_screen_share_enabled,
          password, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active', NOW())
        RETURNING *
      `;

      const result = await pool.query(query, [
        roomId,
        userId,
        name,
        description,
        maxParticipants,
        isRecordingEnabled,
        isScreenShareEnabled,
        password
      ]);

      return result.rows[0];
    } catch (error) {
      logger.error('Error creating conference room:', error);
      throw error;
    }
  }

  /**
   * Join conference room
   */
  async joinRoom(roomId, userId) {
    try {
      // Check if room exists and is active
      const room = await this.getRoomById(roomId);

      if (!room || room.status !== 'active') {
        throw new Error('Conference room not found or inactive');
      }

      // Check participant limit
      const currentParticipants = await this.getActiveParticipants(roomId);
      if (currentParticipants.length >= room.max_participants) {
        throw new Error('Room is full');
      }

      // Add participant
      const query = `
        INSERT INTO conference_participants (
          room_id, user_id, joined_at, status
        ) VALUES ($1, $2, NOW(), 'connected')
        ON CONFLICT (room_id, user_id)
        DO UPDATE SET status = 'connected', joined_at = NOW()
        RETURNING *
      `;

      const result = await pool.query(query, [roomId, userId]);

      return result.rows[0];
    } catch (error) {
      logger.error('Error joining conference room:', error);
      throw error;
    }
  }

  /**
   * Leave conference room
   */
  async leaveRoom(roomId, userId) {
    try {
      const query = `
        UPDATE conference_participants
        SET status = 'disconnected', left_at = NOW()
        WHERE room_id = $1 AND user_id = $2
        RETURNING *
      `;

      const result = await pool.query(query, [roomId, userId]);

      return result.rows[0];
    } catch (error) {
      logger.error('Error leaving conference room:', error);
      throw error;
    }
  }

  /**
   * Start recording
   */
  async startRecording(roomId, userId) {
    try {
      const room = await this.getRoomById(roomId);

      if (!room.is_recording_enabled) {
        throw new Error('Recording is not enabled for this room');
      }

      const recordingId = uuidv4();

      const query = `
        INSERT INTO conference_recordings (
          id, room_id, started_by, started_at, status
        ) VALUES ($1, $2, $3, NOW(), 'recording')
        RETURNING *
      `;

      const result = await pool.query(query, [recordingId, roomId, userId]);

      return result.rows[0];
    } catch (error) {
      logger.error('Error starting recording:', error);
      throw error;
    }
  }

  /**
   * Stop recording
   */
  async stopRecording(recordingId, userId) {
    try {
      const query = `
        UPDATE conference_recordings
        SET status = 'completed', ended_at = NOW()
        WHERE id = $1
        RETURNING *
      `;

      const result = await pool.query(query, [recordingId]);

      return result.rows[0];
    } catch (error) {
      logger.error('Error stopping recording:', error);
      throw error;
    }
  }

  /**
   * Get active participants
   */
  async getActiveParticipants(roomId) {
    const query = `
      SELECT cp.*, u.name, u.email, u.avatar_url
      FROM conference_participants cp
      JOIN users u ON cp.user_id = u.id
      WHERE cp.room_id = $1 AND cp.status = 'connected'
      ORDER BY cp.joined_at ASC
    `;

    const result = await pool.query(query, [roomId]);

    return result.rows;
  }

  /**
   * Get room by ID
   */
  async getRoomById(roomId) {
    const query = 'SELECT * FROM conference_rooms WHERE id = $1';
    const result = await pool.query(query, [roomId]);
    return result.rows[0] || null;
  }

  /**
   * List user's conferences
   */
  async getUserConferences(userId) {
    const query = `
      SELECT DISTINCT cr.*
      FROM conference_rooms cr
      LEFT JOIN conference_participants cp ON cr.id = cp.room_id
      WHERE cr.host_id = $1 OR cp.user_id = $1
      ORDER BY cr.created_at DESC
    `;

    const result = await pool.query(query, [userId]);

    return result.rows;
  }
}

module.exports = new ConferenceService();
