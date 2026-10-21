/**
 * LegalController
 * FingerMobile Protocol™ - Legal, Compliance, Governance, Data Privacy & Support
 */

const { pool } = require('../db');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');

const LegalController = {
  // 1. Data Subject Requests (DSR - GDPR / NDPA 2023)
  async submitDSR(req, res) {
    try {
      const { name, email, requestType = 'access', message = '', userId } = req.body;
      const effectiveUserId = req.user?.id || userId || null;

      if (!name || !email) {
        return res.status(400).json({ success: false, error: 'Name and email are required' });
      }

      const query = `
        INSERT INTO data_subject_requests (user_id, name, email, request_type, message, status)
        VALUES ($1, $2, $3, $4, $5, 'pending')
        RETURNING *
      `;
      const result = await pool.query(query, [
        effectiveUserId ? (typeof effectiveUserId === 'string' && effectiveUserId.includes('-') ? effectiveUserId : null) : null,
        name,
        email.toLowerCase().trim(),
        requestType,
        message
      ]);

      return res.status(201).json({
        success: true,
        message: 'Your Data Subject Request has been received and will be processed within statutory timelines (30 days).',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in LegalController.submitDSR:', error);
      return res.status(500).json({ success: false, error: 'Failed to submit Data Subject Request' });
    }
  },

  async getDSRs(req, res) {
    try {
      const { status, limit = 50, offset = 0 } = req.query;
      let query = 'SELECT * FROM data_subject_requests';
      const params = [];

      if (status) {
        query += ' WHERE status = $1';
        params.push(status);
      }

      query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(parseInt(limit), parseInt(offset));

      const result = await pool.query(query, params);
      return res.json({ success: true, data: result.rows, total: result.rows.length });
    } catch (error) {
      logger.error('Error in LegalController.getDSRs:', error);
      return res.status(500).json({ success: false, error: 'Failed to retrieve DSRs' });
    }
  },

  async getDSRById(req, res) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM data_subject_requests WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Request not found' });
      }
      return res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      logger.error('Error in LegalController.getDSRById:', error);
      return res.status(500).json({ success: false, error: 'Failed to retrieve request details' });
    }
  },

  // 2. Account Deletion Request
  async requestAccountDeletion(req, res) {
    try {
      const { email, password, reason = '', confirmDeletion = true } = req.body;

      if (!email || !confirmDeletion) {
        return res.status(400).json({ success: false, error: 'Email and explicit deletion confirmation are required' });
      }

      const userLookup = await pool.query('SELECT id, uuid, password_hash FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()]);
      let confirmedWithPassword = false;

      if (userLookup.rows.length > 0) {
        const user = userLookup.rows[0];
        if (password && user.password_hash) {
          confirmedWithPassword = await bcrypt.compare(password, user.password_hash).catch(() => false);
        }
      }

      const query = `
        INSERT INTO account_deletion_requests (user_id, email, reason, status, confirmed_with_password, scheduled_purge_at)
        VALUES ($1, $2, $3, 'pending', $4, CURRENT_TIMESTAMP + INTERVAL '30 days')
        RETURNING *
      `;
      const result = await pool.query(query, [
        userLookup.rows[0]?.uuid || null,
        email.toLowerCase().trim(),
        reason,
        confirmedWithPassword
      ]);

      return res.status(201).json({
        success: true,
        message: 'Account deletion request queued. Your account and personal data will be completely purged in 30 days. You may cancel by logging in before this period ends.',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in LegalController.requestAccountDeletion:', error);
      return res.status(500).json({ success: false, error: 'Failed to process account deletion request' });
    }
  },

  async getAccountDeletionStatus(req, res) {
    try {
      const email = req.query.email || req.user?.email;
      if (!email) {
        return res.status(400).json({ success: false, error: 'Email is required' });
      }

      const result = await pool.query(
        'SELECT * FROM account_deletion_requests WHERE LOWER(email) = LOWER($1) ORDER BY created_at DESC LIMIT 1',
        [email.trim()]
      );

      return res.json({
        success: true,
        pending: result.rows.length > 0 && result.rows[0].status === 'pending',
        data: result.rows[0] || null
      });
    } catch (error) {
      logger.error('Error in LegalController.getAccountDeletionStatus:', error);
      return res.status(500).json({ success: false, error: 'Failed to check deletion status' });
    }
  },

  async getAccountDeletions(req, res) {
    try {
      const result = await pool.query(
        'SELECT * FROM account_deletion_requests ORDER BY created_at DESC LIMIT 50'
      );
      return res.json({ success: true, data: result.rows });
    } catch (error) {
      logger.error('Error in LegalController.getAccountDeletions:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch account deletion requests' });
    }
  },

  // 3. Contact Us / Inbound Inquiries
  async submitContactMessage(req, res) {
    try {
      const { name, email, subject, message, department = 'general' } = req.body;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, error: 'All fields (name, email, subject, message) are required' });
      }

      const query = `
        INSERT INTO contact_submissions (name, email, subject, message, department, status)
        VALUES ($1, $2, $3, $4, $5, 'new')
        RETURNING *
      `;
      const result = await pool.query(query, [name, email.toLowerCase().trim(), subject, message, department]);

      return res.status(201).json({
        success: true,
        message: 'Thank you for reaching out to FingerMobile Protocol. Our team will review your inquiry shortly.',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in LegalController.submitContactMessage:', error);
      return res.status(500).json({ success: false, error: 'Failed to submit contact message' });
    }
  },

  async getContactMessages(req, res) {
    try {
      const { status, limit = 50, offset = 0 } = req.query;
      let query = 'SELECT * FROM contact_submissions';
      const params = [];

      if (status) {
        query += ' WHERE status = $1';
        params.push(status);
      }

      query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(parseInt(limit), parseInt(offset));

      const result = await pool.query(query, params);
      return res.json({ success: true, data: result.rows, total: result.rows.length });
    } catch (error) {
      logger.error('Error in LegalController.getContactMessages:', error);
      return res.status(500).json({ success: false, error: 'Failed to retrieve contact messages' });
    }
  },

  // 4. User Feedback Submissions
  async submitFeedback(req, res) {
    try {
      const { category = 'general', rating = 5, comment = '', pageUrl = '', userId } = req.body;
      const effectiveUserId = req.user?.id || userId || null;

      const query = `
        INSERT INTO feedback_submissions (user_id, category, rating, comment, page_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const result = await pool.query(query, [
        effectiveUserId ? (typeof effectiveUserId === 'string' && effectiveUserId.includes('-') ? effectiveUserId : null) : null,
        category,
        parseInt(rating) || 5,
        comment,
        pageUrl
      ]);

      return res.status(201).json({
        success: true,
        message: 'Thank you for your valuable feedback!',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in LegalController.submitFeedback:', error);
      return res.status(500).json({ success: false, error: 'Failed to submit feedback' });
    }
  },

  async getFeedbackList(req, res) {
    try {
      const { category, limit = 50, offset = 0 } = req.query;
      let query = 'SELECT * FROM feedback_submissions';
      const params = [];

      if (category) {
        query += ' WHERE category = $1';
        params.push(category);
      }

      query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(parseInt(limit), parseInt(offset));

      const result = await pool.query(query, params);
      return res.json({ success: true, data: result.rows, total: result.rows.length });
    } catch (error) {
      logger.error('Error in LegalController.getFeedbackList:', error);
      return res.status(500).json({ success: false, error: 'Failed to retrieve feedback list' });
    }
  },

  // 5. Legal Documents / Policies
  async getLegalDocuments(req, res) {
    try {
      const result = await pool.query('SELECT id, slug, title, version, summary, effective_date, updated_at FROM legal_documents WHERE is_active = TRUE ORDER BY title ASC');
      return res.json({ success: true, data: result.rows });
    } catch (error) {
      logger.error('Error in LegalController.getLegalDocuments:', error);
      return res.status(500).json({ success: false, error: 'Failed to retrieve legal documents' });
    }
  },

  async getLegalDocumentBySlug(req, res) {
    try {
      const { slug } = req.params;
      const result = await pool.query('SELECT * FROM legal_documents WHERE slug = $1 AND is_active = TRUE', [slug]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: `Document '${slug}' not found` });
      }
      return res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      logger.error('Error in LegalController.getLegalDocumentBySlug:', error);
      return res.status(500).json({ success: false, error: 'Failed to retrieve document' });
    }
  },

  async updateLegalDocument(req, res) {
    try {
      const { slug } = req.params;
      const { title, version, content, summary } = req.body;

      const query = `
        UPDATE legal_documents
        SET title = COALESCE($1, title),
            version = COALESCE($2, version),
            content = COALESCE($3, content),
            summary = COALESCE($4, summary),
            updated_at = CURRENT_TIMESTAMP
        WHERE slug = $5
        RETURNING *
      `;
      const result = await pool.query(query, [title, version, content, summary, slug]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Document not found' });
      }

      return res.json({ success: true, message: 'Document updated successfully', data: result.rows[0] });
    } catch (error) {
      logger.error('Error in LegalController.updateLegalDocument:', error);
      return res.status(500).json({ success: false, error: 'Failed to update document' });
    }
  },

  // 6. DMCA Requests
  async submitDMCARequest(req, res) {
    const { claimant_name, claimant_email, infringing_url, original_work_url, description, signature } = req.body;

    if (!claimant_name || !claimant_email || !infringing_url || !signature) {
      return res.status(400).json({ success: false, error: 'Missing required DMCA fields' });
    }

    try {
      const query = `
        INSERT INTO dmca_requests 
          (claimant_name, claimant_email, infringing_url, original_work_url, description, signature)
        VALUES 
          ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      const values = [claimant_name, claimant_email, infringing_url, original_work_url, description, signature];
      const result = await pool.query(query, values);

      return res.status(201).json({
        success: true,
        message: 'DMCA Request successfully submitted. Our legal team will review it within 48 hours.',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in LegalController.submitDMCARequest:', error);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  },

  async updateDMCAStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const result = await pool.query('UPDATE dmca_requests SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *', [status, id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'DMCA request not found' });
      }
      return res.status(200).json({ success: true, message: 'Status updated', data: result.rows[0] });
    } catch (error) {
      logger.error('Error in LegalController.updateDMCAStatus:', error);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
};

module.exports = LegalController;
