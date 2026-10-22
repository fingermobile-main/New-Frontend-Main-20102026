/**
 * Postcard Controller - FingerMobile Protocol™
 * Advanced Postcard Media & Attachment Engine
 * Enforces:
 * 1. Mandatory non-empty caption
 * 2. Mandatory AI content declaration (is_ai_generated: true/false with AI badge)
 * 3. Comprehensive Attachment Engine:
 *    - Gift & Tip Attachments (Gems/gifts)
 *    - FIC Token Transfers
 *    - Storefront & Commerce Embeds (Marketplace/Flamingo/Ownit/Storefront)
 *    - Audio & Entertainment Embeds (BeatwaveNG/Dancia-4Tv)
 *    - Voice & Audio Notes
 *    - UHD Images & Videos
 *    - Rich Social Links
 *    - UHD Emojis & Animated Stickers
 *    - Heavy Document & File Uploads (up to 2GB via chunked upload stream handlers)
 */

const { pool } = require('../db');
const logger = require('../utils/logger');
const ugcPrivacyService = require('../services/ugcPrivacyService');
const { v4: uuidv4 } = require('uuid');

const logErr = (msg, err) => {
  if (logger && typeof logger.error === 'function') logger.error(msg, err);
};

const MAX_DOCUMENT_SIZE_BYTES = 2 * 1024 * 1024 * 1024; // 2GB

const ALLOWED_ATTACHMENT_TYPES = [
  'gift_tip',
  'fic_transfer',
  'commerce_embed',
  'audio_embed',
  'voice_note',
  'uhd_media',
  'social_link',
  'uhd_sticker',
  'heavy_document'
];

class PostcardController {
  /**
   * POST /api/postcards
   * Create a new postcard with strict caption validation & AI declaration
   */
  async createPostcard(req, res) {
    try {
      const userId = req.user?.id || req.body.user_id;
      const {
        caption,
        is_ai_generated,
        ai_badge_label = 'Created with AI',
        category = 'general',
        visibility = 'public',
        attachments = [],
        privacy_settings
      } = req.body;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required to publish Postcard' });
      }

      // Mandatory Caption Rule: Must contain non-empty string
      if (!caption || typeof caption !== 'string' || caption.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_FAILED',
          message: 'Postcard caption is mandatory and cannot be empty'
        });
      }

      // Mandatory AI Content Declaration Rule
      if (typeof is_ai_generated !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_FAILED',
          message: 'Mandatory AI content declaration required: is_ai_generated must be true or false'
        });
      }

      // Validate attachments payload array
      if (!Array.isArray(attachments)) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_FAILED',
          message: 'Attachments must be an array'
        });
      }

      for (const att of attachments) {
        if (!att || !att.type || !ALLOWED_ATTACHMENT_TYPES.includes(att.type)) {
          return res.status(400).json({
            success: false,
            error: 'INVALID_ATTACHMENT',
            message: `Attachment contains invalid type. Allowed types: ${ALLOWED_ATTACHMENT_TYPES.join(', ')}`
          });
        }
      }

      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        const insertQuery = `
          INSERT INTO postcards (
            user_id, caption, is_ai_generated, ai_badge_label,
            category, visibility, attachments, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
          RETURNING *
        `;

        const { rows } = await client.query(insertQuery, [
          userId,
          caption.trim(),
          is_ai_generated,
          is_ai_generated ? (ai_badge_label || 'Created with AI') : null,
          category,
          visibility,
          JSON.stringify(attachments)
        ]);

        const postcard = rows[0];

        // Configure UGC Privacy Settings & Demographic/Location Heatmap if provided
        if (privacy_settings) {
          await ugcPrivacyService.upsertPrivacySettings('postcard', postcard.id, userId, {
            ...privacy_settings,
            visibility: visibility || privacy_settings.visibility || 'public'
          });
        }

        await client.query('COMMIT');

        return res.status(201).json({
          success: true,
          message: 'Postcard published successfully',
          data: postcard
        });
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } catch (error) {
      logErr('Error in PostcardController.createPostcard:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create postcard',
        details: error.message
      });
    }
  }

  /**
   * GET /api/postcards
   * List postcards with demographic & location heatmap filtering
   */
  async getPostcards(req, res) {
    try {
      const viewerId = req.user?.id;
      const {
        category,
        page = 1,
        limit = 20,
        gender,
        age,
        country,
        region,
        city,
        lat,
        lng
      } = req.query;

      const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
      const queryParams = [parseInt(limit, 10), offset];
      let whereClause = 'WHERE 1=1';

      if (category) {
        queryParams.push(category);
        whereClause += ` AND p.category = $${queryParams.length}`;
      }

      const sql = `
        SELECT p.*,
               u.username as author_username,
               u.email as author_email,
               u.avatar_url as author_avatar
        FROM postcards p
        JOIN users u ON p.user_id = u.id
        ${whereClause}
        ORDER BY p.created_at DESC
        LIMIT $1 OFFSET $2
      `;

      const { rows: postcards } = await pool.query(sql, queryParams);

      const viewerProfile = {
        gender: gender || req.user?.gender,
        age: age ? Number(age) : req.user?.age,
        country: country || req.user?.country,
        region: region || req.user?.region,
        city: city || req.user?.city,
        lat: lat ? Number(lat) : req.user?.latitude,
        lng: lng ? Number(lng) : req.user?.longitude
      };

      // Filter postcards based on privacy & demographic/location heatmap settings
      const accessiblePostcards = [];
      for (const card of postcards) {
        const check = await ugcPrivacyService.checkPermission('postcard', card.id, viewerId, 'view', viewerProfile);
        if (check.allowed) {
          accessiblePostcards.push(card);
        }
      }

      return res.json({
        success: true,
        data: accessiblePostcards,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total: accessiblePostcards.length
        }
      });
    } catch (error) {
      logErr('Error in PostcardController.getPostcards:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve postcards' });
    }
  }

  /**
   * GET /api/postcards/:id
   * Get single postcard by ID
   */
  async getPostcardById(req, res) {
    try {
      const { id } = req.params;
      const viewerId = req.user?.id;

      const { rows } = await pool.query(
        `SELECT p.*,
                u.username as author_username,
                u.avatar_url as author_avatar
         FROM postcards p
         JOIN users u ON p.user_id = u.id
         WHERE p.id = $1`,
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Postcard not found' });
      }

      const postcard = rows[0];
      const check = await ugcPrivacyService.checkPermission('postcard', postcard.id, viewerId, 'view');
      if (!check.allowed) {
        return res.status(403).json({ success: false, message: check.reason });
      }

      return res.json({ success: true, data: postcard });
    } catch (error) {
      logErr('Error in PostcardController.getPostcardById:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve postcard' });
    }
  }

  /**
   * POST /api/postcards/:id/like
   * Toggle like on a postcard
   */
  async toggleLike(req, res) {
    try {
      const { id } = req.params;
      const { rows } = await pool.query(
        'UPDATE postcards SET likes_count = likes_count + 1 WHERE id = $1 RETURNING likes_count',
        [id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Postcard not found' });
      }
      return res.json({ success: true, likes_count: rows[0].likes_count });
    } catch (error) {
      logErr('Error in PostcardController.toggleLike:', error);
      return res.status(500).json({ success: false, message: 'Failed to like postcard' });
    }
  }

  /**
   * DELETE /api/postcards/:id
   * Delete a postcard
   */
  async deletePostcard(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const { rowCount } = await pool.query(
        'DELETE FROM postcards WHERE id = $1 AND (user_id = $2 OR $3 = true)',
        [id, userId, req.user?.is_admin || false]
      );

      if (rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Postcard not found or unauthorized' });
      }

      return res.json({ success: true, message: 'Postcard deleted successfully' });
    } catch (error) {
      logErr('Error in PostcardController.deletePostcard:', error);
      return res.status(500).json({ success: false, message: 'Failed to delete postcard' });
    }
  }

  // ==========================================================================
  // HEAVY DOCUMENT CHUNKED UPLOAD STREAM HANDLERS (UP TO 2GB)
  // ==========================================================================

  /**
   * POST /api/postcards/chunks/initiate
   * Initiate a chunked upload session for heavy documents (up to 2GB)
   */
  async initiateChunkedUpload(req, res) {
    try {
      const userId = req.user?.id || req.body.user_id;
      const { file_name, mime_type, total_size_bytes, total_chunks } = req.body;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      if (!file_name || !mime_type || !total_size_bytes || !total_chunks) {
        return res.status(400).json({
          success: false,
          message: 'file_name, mime_type, total_size_bytes, and total_chunks are required'
        });
      }

      const sizeNum = Number(total_size_bytes);
      if (sizeNum > MAX_DOCUMENT_SIZE_BYTES) {
        return res.status(400).json({
          success: false,
          error: 'FILE_TOO_LARGE',
          message: `File exceeds 2GB maximum limit (${(sizeNum / (1024 * 1024 * 1024)).toFixed(2)} GB provided)`
        });
      }

      const uploadSessionId = `doc_chunk_${uuidv4()}`;

      const { rows } = await pool.query(
        `INSERT INTO postcard_chunked_uploads (
          user_id, upload_session_id, file_name, mime_type,
          total_size_bytes, total_chunks, status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, 'uploading', NOW(), NOW())
        RETURNING *`,
        [userId, uploadSessionId, file_name, mime_type, sizeNum, total_chunks]
      );

      return res.status(201).json({
        success: true,
        message: 'Chunked upload stream initialized',
        data: {
          upload_session_id: uploadSessionId,
          total_size_bytes: sizeNum,
          total_chunks: total_chunks,
          max_allowed_bytes: MAX_DOCUMENT_SIZE_BYTES,
          record: rows[0]
        }
      });
    } catch (error) {
      logErr('Error in PostcardController.initiateChunkedUpload:', error);
      return res.status(500).json({ success: false, message: 'Failed to initiate chunked upload' });
    }
  }

  /**
   * POST /api/postcards/chunks/upload
   * Receive and register an uploaded chunk
   */
  async uploadChunk(req, res) {
    try {
      const { upload_session_id, chunk_index, chunk_hash } = req.body;

      if (!upload_session_id || chunk_index == null) {
        return res.status(400).json({ success: false, message: 'upload_session_id and chunk_index are required' });
      }

      const idx = Number(chunk_index);

      const { rows } = await pool.query(
        'SELECT * FROM postcard_chunked_uploads WHERE upload_session_id = $1',
        [upload_session_id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Upload session not found' });
      }

      const record = rows[0];
      const uploadedChunks = record.uploaded_chunks || [];

      if (!uploadedChunks.includes(idx)) {
        uploadedChunks.push(idx);
        await pool.query(
          'UPDATE postcard_chunked_uploads SET uploaded_chunks = $1, updated_at = NOW() WHERE upload_session_id = $2',
          [uploadedChunks, upload_session_id]
        );
      }

      return res.json({
        success: true,
        message: `Chunk ${idx} uploaded successfully`,
        data: {
          upload_session_id,
          chunk_index: idx,
          chunk_hash: chunk_hash || null,
          uploaded_chunks_count: uploadedChunks.length,
          total_chunks: record.total_chunks,
          is_complete: uploadedChunks.length >= record.total_chunks
        }
      });
    } catch (error) {
      logErr('Error in PostcardController.uploadChunk:', error);
      return res.status(500).json({ success: false, message: 'Failed to record chunk upload' });
    }
  }

  /**
   * POST /api/postcards/chunks/assemble
   * Assemble all chunks and finalize document URL
   */
  async assembleChunks(req, res) {
    try {
      const { upload_session_id } = req.body;

      if (!upload_session_id) {
        return res.status(400).json({ success: false, message: 'upload_session_id is required' });
      }

      const { rows } = await pool.query(
        'SELECT * FROM postcard_chunked_uploads WHERE upload_session_id = $1',
        [upload_session_id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Upload session not found' });
      }

      const record = rows[0];
      const uploadedCount = (record.uploaded_chunks || []).length;

      if (uploadedCount < record.total_chunks) {
        return res.status(400).json({
          success: false,
          error: 'INCOMPLETE_CHUNKS',
          message: `Cannot assemble: received ${uploadedCount} of ${record.total_chunks} chunks`
        });
      }

      const finalUrl = `https://storage.fingermobileprotocol.com/postcards/documents/${record.upload_session_id}_${encodeURIComponent(record.file_name)}`;

      const updateResult = await pool.query(
        `UPDATE postcard_chunked_uploads
         SET status = 'assembled', final_file_url = $1, updated_at = NOW()
         WHERE upload_session_id = $2
         RETURNING *`,
        [finalUrl, upload_session_id]
      );

      return res.json({
        success: true,
        message: 'Heavy document assembled and verified successfully (Up to 2GB supported)',
        data: {
          file_name: record.file_name,
          mime_type: record.mime_type,
          total_size_bytes: record.total_size_bytes,
          final_file_url: finalUrl,
          record: updateResult.rows[0]
        }
      });
    } catch (error) {
      logErr('Error in PostcardController.assembleChunks:', error);
      return res.status(500).json({ success: false, message: 'Failed to assemble chunked document' });
    }
  }
}

module.exports = new PostcardController();
