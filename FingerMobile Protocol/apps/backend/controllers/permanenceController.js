/**
 * Permanence Controller
 * Complete implementation for challenges, viral bets, and live streams
 * Date: September 29, 2026
 */

const permanenceService = require('../services/permanenceService');
const logger = require('../utils/logger');

class PermanenceController {
  async getAll(req, res) {
    try {
      const isStream = req.path.includes('stream') || req.baseUrl.includes('stream');
      const filters = {
        limit: parseInt(req.query.limit, 10) || 50,
        offset: parseInt(req.query.offset, 10) || 0,
        ...req.query
      };

      if (isStream) {
        const streams = await permanenceService.getStreams(filters);
        return res.json({
          success: true,
          data: streams,
          count: streams.length
        });
      }

      const challenges = await permanenceService.getChallenges(filters);
      return res.json({
        success: true,
        data: challenges,
        count: challenges.length
      });
    } catch (error) {
      logger.error('Error in PermanenceController.getAll:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const isStream = req.path.includes('stream');

      if (isStream) {
        const stream = await permanenceService.getStreamById(id);
        if (!stream) return res.status(404).json({ success: false, message: 'Stream not found' });
        return res.json({ success: true, data: stream });
      }

      const challenge = await permanenceService.getChallengeById(id);
      if (!challenge) {
        return res.status(404).json({ success: false, message: 'Challenge not found' });
      }
      return res.json({ success: true, data: challenge });
    } catch (error) {
      logger.error('Error in PermanenceController.getById:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async create(req, res) {
    try {
      const data = req.body;
      const isStream = req.path.includes('stream');
      const userId = req.user?.id || req.body.creator_id || 4;

      if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ success: false, message: 'Request body is required' });
      }

      if (isStream) {
        const stream = await permanenceService.createStream({ ...data, creator_id: userId });
        return res.status(201).json({ success: true, data: stream });
      }

      const challenge = await permanenceService.createChallenge({ ...data, creator_id: userId });
      return res.status(201).json({ success: true, data: challenge });
    } catch (error) {
      logger.error('Error in PermanenceController.create:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create item',
        error: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await permanenceService.updateChallenge(id, data);
      return res.json({ success: true, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await permanenceService.deleteChallenge(id);
      return res.json({ success: true, message: 'Challenge deleted successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new PermanenceController();
