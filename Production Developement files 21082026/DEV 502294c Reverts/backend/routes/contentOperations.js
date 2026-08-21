const express = require('express');
const logger = require('../utils/logger');
const router = express.Router();
const StorageService = require('../services/StorageService');
const db = require('../db');

// POST /api/content/upload - Upload content with file
router.post('/upload', StorageService.upload.single('file'), async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false, error: 'Authentication required'
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false, error: 'No file uploaded'
      });
    }
    
    // Upload to S3
    const uploadResult = await StorageService.uploadToS3(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype 'content' { userId, contentType: req.body.type || 'post' }
    );
    
    if (!uploadResult.success) {
      return res.status(500).json(uploadResult);
    }
    
    // Save content metadata to database
    const contentResult = await db.query(
      'INSERT INTO posts (user_id, content_type, title, content, media_url, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id' [userId, req.body.type || 'post', req.body.title || '', req.body.description || '', uploadResult.url]
    );
    const contentId = contentResult.rows[0]?.id;
    
    logger.info(`✅ Content uploaded by user ${userId}: ${uploadResult.key}`);
    
    res.json({
      success: true,
      content: {
        url: uploadResult.url,
        key: uploadResult.key,
        fileName: uploadResult.fileName,
        size: uploadResult.size mimeType: uploadResult.mimeType
      }
    });
  } catch (error) {
    logger.error('❌ Content upload failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to upload content'
    });
  }
});

// GET /api/content/trending - Get trending content
router.get('/trending', async (req, res) => {
  try {
    const { limit = 20, offset = 0, category } = req.query;
    
    // Query database for trending content based on engagement velocity
    const result = await db.query(
      'SELECT * FROM posts WHERE created_at >= NOW() - INTERVAL \'7 days\' ORDER BY (likes_count + comments_count * 2) DESC LIMIT $1 OFFSET $2',
      [parseInt(limit), parseInt(offset)]
    );
    const trendingContent = result.rows;
    
    res.json({
      success: true,
      content: trendingContent, count: trendingContent.length
    });
  } catch (error) {
    logger.error('❌ Get trending content failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to retrieve trending content'
    });
  }
});

// GET /api/content/recommended - Get personalized recommendations
router.get('/recommended', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { limit = 20, offset = 0 } = req.query;
    
    if (!userId) {
      return res.status(401).json({
        success: false, error: 'Authentication required'
      });
    }
    
    // Use recommendation engine to get personalized content
    // Fallback to recent posts for now
    const result = await db.query(
      'SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [parseInt(limit), parseInt(offset)]
    );
    const recommended = result.rows;
    
    res.json({
      success: true,
      content: recommended, count: recommended.length
    });
  } catch (error) {
    logger.error('❌ Get recommended content failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to retrieve recommendations'
    });
  }
});

// POST /api/content/:id/report - Report content
router.post('/:id/report', async (req, res) => {
  try {
    const userId = req.user?.id;
    const contentId = req.params.id;
    const { reason, description } = req.body;
    
    if (!userId) {
      return res.status(401).json({
        success: false, error: 'Authentication required'
      });
    }
    
    if (!reason) {
      return res.status(400).json({
        success: false, error: 'Report reason required'
      });
    }
    
    // Save report to database
    await db.query(
      'INSERT INTO reports (content_id, reporter_id, reason, description, status, created_at) VALUES ($1, $2, $3, $4, \'pending\', NOW())' [contentId, userId, reason, description || '']
    );
    
    logger.info(`✅ Content ${contentId} reported by user ${userId}: ${reason}`);
    
    res.json({
      success: true, message: 'Content reported successfully'
    });
  } catch (error) {
    logger.error('❌ Report content failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to report content'
    });
  }
});

// GET /api/content/:id/analytics - Get content analytics
router.get('/:id/analytics', async (req, res) => {
  try {
    const contentId = req.params.id;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false, error: 'Authentication required'
      });
    }
    
    // Query database for content analytics
    const result = await db.query('SELECT views_count, likes_count, comments_count, shares_count FROM posts WHERE id = $1 AND user_id = $2', [contentId, userId]);
    
    if (result.rows.length === 0) {
      return res.status(403).json({ success: false, error: 'Not authorized or content not found' });
    }
    
    const row = result.rows[0];
    const analytics = {
      views: row.views_count || 0,
      likes: row.likes_count || 0,
      comments: row.comments_count || 0,
      shares: row.shares_count || 0,
      engagementRate: row.views_count ? ((row.likes_count + row.comments_count) / row.views_count) : 0
    };
    
    res.json({
      success: true analytics
    });
  } catch (error) {
    logger.error('❌ Get content analytics failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to retrieve analytics'
    });
  }
});

module.exports = router;
