/**
 * UphotocreditsController
 * Auto-generated controller for photocredits routes
 * Generated: 2026-06-08 13:55:23
 */

const UphotocreditsControllerService = require('../services/photoCreditsService');
const logger = require('../utils/logger');

class UphotocreditsController {
  /**
   * GET /api/photocredits
   * Get all items
   */
  async getAll(req, res) {
    try {
      const filters = {
        limit: req.query.limit || 50,
        offset: req.query.offset || 0,
        ...req.query
      };

      const data = await UphotocreditsControllerService.getAll(filters);

      res.json({
        success: true,
        data,
        count: data.length,
        filters // Fixed: Added missing comma
      });
    } catch (error) {
      logger.error('Error in UphotocreditsController.getAll:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/photocredits/:id
   * Get item by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;

      const data = await UphotocreditsControllerService.getById(id);

      if (!data) {
        return res.status(404).json({
          success: false, message: 'photocredits not found'
        });
      }

      res.json({
        success: true,
        data // Fixed: Added missing comma
      });
    } catch (error) {
      logger.error('Error in UphotocreditsController.getById:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/photocredits
   * Create new item
   */
  async create(req, res) {
    try {
      const data = req.body;

      // Basic validation
      if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({
          success: false, message: 'Request body is required'
        });
      }

      const result = await UphotocreditsControllerService.create(data);

      res.status(201).json({
        success: true, message: 'photocredits created successfully', data: result
      });
    } catch (error) {
      logger.error('Error in UphotocreditsController.create:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * PUT /api/photocredits/:id
   * Update existing item
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({
          success: false, message: 'Request body is required'
        });
      }

      const result = await UphotocreditsControllerService.update(id, data);

      if (!result) {
        return res.status(404).json({
          success: false, message: 'photocredits not found'
        });
      }

      res.json({
        success: true, message: 'photocredits updated successfully', data: result
      });
    } catch (error) {
      logger.error('Error in UphotocreditsController.update:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * DELETE /api/photocredits/:id
   * Delete item
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      const result = await UphotocreditsControllerService.delete(id);

      if (!result) {
        return res.status(404).json({
          success: false, message: 'photocredits not found'
        });
      }

      res.json({
        success: true, message: 'photocredits deleted successfully'
      });
    } catch (error) {
      logger.error('Error in UphotocreditsController.delete:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/photocredits/giveaway
   * Get 26-Day Friday Monthly Giveaway Leaderboard (Top 10 Photos)
   */
  async getGiveawayLeaderboard(req, res) {
    try {
      const data = await UphotocreditsControllerService.getGiveawayLeaderboard();
      res.json({
        success: true,
        data
      });
    } catch (error) {
      logger.error('Error in UphotocreditsController.getGiveawayLeaderboard:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/photocredits/:id/vote
   * Vote / Engage (like, dislike, download, share, rating, poll_vote)
   */
  async vote(req, res) {
    try {
      const { id } = req.params;
      const { action, payload } = req.body;

      if (!action) {
        return res.status(400).json({ success: false, message: 'action is required' });
      }

      const result = await UphotocreditsControllerService.votePhoto(id, action, payload);
      if (!result) {
        return res.status(404).json({ success: false, message: 'Photo not found' });
      }

      res.json({
        success: true,
        message: `Action ${action} recorded successfully`,
        data: result
      });
    } catch (error) {
      logger.error('Error in UphotocreditsController.vote:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/photocredits/:id/poll
   * Conduct poll or vote on poll
   */
  async poll(req, res) {
    try {
      const { id } = req.params;
      const { action, optionIndex, poll } = req.body;

      const result = await UphotocreditsControllerService.votePhoto(id, action || 'poll_vote', { optionIndex, poll });
      if (!result) {
        return res.status(404).json({ success: false, message: 'Photo not found' });
      }

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Error in UphotocreditsController.poll:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/photocredits/upload
   * Upload photograph with metadata & EXIF
   */
  async upload(req, res) {
    try {
      const body = req.body || {};
      const files = req.files || (req.file ? [req.file] : []);
      let imageUrl = body.imageUrl || body.image_url;

      if (files.length === 0 && !imageUrl) {
        return res.status(400).json({
          success: false,
          message: 'Photograph/video file(s) or media URL is required'
        });
      }

      const isUuid = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
      const defaultUploaderId = isUuid(body.uploaderId)
        ? body.uploaderId
        : (isUuid(body.uploader_id)
          ? body.uploader_id
          : (isUuid(req.user?.id) ? req.user.id : '00000000-0000-0000-0000-000000000000'));

      const createdItems = [];
      const baseTitle = body.title || 'Untitled Sovereign Media';

      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileUrl = `/uploads/photocredits/${file.filename}`;
          const isVideo = file.mimetype?.startsWith('video') || /\.(mp4|mov|webm|avi|mkv)$/i.test(file.originalname);
          const itemTitle = files.length > 1 && i > 0 ? `${baseTitle} (${i + 1})` : baseTitle;

          const photoData = {
            title: itemTitle,
            description: body.description || '',
            imageUrl: fileUrl,
            thumbnailUrl: fileUrl,
            category: body.category || (isVideo ? 'Cinematography & Video' : 'Architecture'),
            photographerName: body.photographerName || body.photographer_name || 'Creator',
            uploaderId: defaultUploaderId,
            location: body.location || 'Global',
            tags: typeof body.tags === 'string' ? JSON.parse(body.tags) : (body.tags || []),
            price: parseFloat(body.price || body.price_credits) || 25,
            licenseType: body.licenseType || body.license_type || 'Royalty-Free Standard',
            cameraInfo: {
              camera: body.camera || (isVideo ? 'Cinema 4K Rig' : 'Sovereign Camera'),
              lens: body.lens || 'Prime Lens',
              iso: parseInt(body.iso) || 100,
              shutter: body.shutter || '1/250s',
              aperture: body.aperture || 'f/2.8'
            },
            poll: i === 0 && body.poll ? (typeof body.poll === 'string' ? JSON.parse(body.poll) : body.poll) : undefined
          };

          const itemResult = await UphotocreditsControllerService.create(photoData);
          if (photoData.poll) {
            await UphotocreditsControllerService.votePhoto(itemResult.id, 'create_poll', { poll: photoData.poll });
          }
          createdItems.push(itemResult);
        }
      } else {
        const photoData = {
          title: baseTitle,
          description: body.description || '',
          imageUrl: imageUrl,
          thumbnailUrl: imageUrl,
          category: body.category || 'Architecture',
          photographerName: body.photographerName || body.photographer_name || 'Creator',
          uploaderId: defaultUploaderId,
          location: body.location || 'Global',
          tags: typeof body.tags === 'string' ? JSON.parse(body.tags) : (body.tags || []),
          price: parseFloat(body.price || body.price_credits) || 25,
          licenseType: body.licenseType || body.license_type || 'Royalty-Free Standard',
          cameraInfo: {
            camera: body.camera || 'Sovereign Camera',
            lens: body.lens || 'Prime Lens',
            iso: parseInt(body.iso) || 100,
            shutter: body.shutter || '1/250s',
            aperture: body.aperture || 'f/2.8'
          },
          poll: body.poll ? (typeof body.poll === 'string' ? JSON.parse(body.poll) : body.poll) : undefined
        };

        const itemResult = await UphotocreditsControllerService.create(photoData);
        if (photoData.poll) {
          await UphotocreditsControllerService.votePhoto(itemResult.id, 'create_poll', { poll: photoData.poll });
        }
        createdItems.push(itemResult);
      }

      res.status(201).json({
        success: true,
        message: `${createdItems.length} media item${createdItems.length > 1 ? 's' : ''} uploaded and licensed on sovereign protocol ledger! ✓`,
        data: createdItems[0],
        items: createdItems
      });
    } catch (error) {
      logger.error('Error in UphotocreditsController.upload:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new UphotocreditsController();
