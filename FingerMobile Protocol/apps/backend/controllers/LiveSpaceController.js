/**
 * LiveSpaceController - Video Rooms Controller
 * Handles video chat and live streaming functionality
 */

const forumService = require('../services/forumService');
const logger = require('../utils/logger');

class LiveSpaceController {
  /**
   * POST /api/live-spaces/rooms/create
   * Create a video room
   */
  async createRoom(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { title, type = 'video', maxParticipants = 10 } = req.body;

      if (!title) {
        return res.status(400).json({
          success: false,
          message: 'Title is required'
        });
      }

      const room = await forumService.createVideoRoom(req.user.id, {
        title,
        type,
        maxParticipants
      });

      res.status(201).json({
        success: true,
        data: room,
        message: 'Video room created successfully'
      });
    } catch (error) {
      logger.error('Error creating video room:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create video room',
        error: error.message
      });
    }
  }

  /**
   * GET /api/live-spaces/rooms/active
   * List active rooms
   */
  async getActiveRooms(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { type, limit = 20, offset = 0 } = req.query;

      const result = await forumService.getActiveVideoRooms({
        type,
        limit,
        offset
      });

      res.json({
        success: true,
        data: {
          rooms: result.rows,
          total: result.count,
          hasNext: result.count > (parseInt(offset) + parseInt(limit))
        },
        message: 'Active rooms retrieved successfully'
      });
    } catch (error) {
      logger.error('Error getting active video rooms:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve active rooms',
        error: error.message
      });
    }
  }

  /**
   * POST /api/live-spaces/rooms/:id/end
   * End a room
   */
  async endRoom(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { id } = req.params;

      const result = await forumService.endVideoRoom(id, req.user.id);

      res.json(result);
    } catch (error) {
      logger.error('Error ending video room:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to end video room',
        error: error.message
      });
    }
  }
}

module.exports = new LiveSpaceController();
