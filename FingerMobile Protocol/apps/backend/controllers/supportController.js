/**
 * SupportController
 * FingerMobile Protocol™ - Customer Support & Help Desk Operations
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

const SupportController = {
  async getTickets(req, res) {
    try {
      const { status, limit = 50, offset = 0 } = req.query;
      const params = [];
      let query = `
        SELECT 
          t.id,
          t.user_id,
          t.subject,
          t.status,
          t.priority,
          t.assigned_to,
          t.created_at,
          t.updated_at,
          COALESCE(u.username, u.first_name, 'Member') as member_name,
          u.email as member_email,
          u.avatar_url as member_avatar,
          (
            SELECT json_agg(m ORDER BY m.created_at ASC)
            FROM ticket_messages m
            WHERE m.ticket_id = t.id
          ) as messages
        FROM support_tickets t
        LEFT JOIN users u ON (t.user_id::text = u.uuid::text OR t.user_id::text = u.id::text)
      `;

      if (status && status !== 'all') {
        query += ' WHERE t.status = $1';
        params.push(status);
      }

      query += ` ORDER BY t.updated_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(parseInt(limit), parseInt(offset));

      const result = await pool.query(query, params);

      const mapped = result.rows.map(row => ({
        id: row.id,
        subject: row.subject,
        status: row.status || 'open',
        priority: row.priority || 'medium',
        lastUpdated: new Date(row.updated_at || row.created_at).toLocaleDateString(),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        member: {
          id: row.user_id,
          name: row.member_name,
          email: row.member_email,
          avatarUrl: row.member_avatar
        },
        messages: (row.messages || []).map((m) => ({
          id: m.id,
          sender: m.is_internal ? 'support' : 'user',
          text: m.message,
          timestamp: m.created_at
        }))
      }));

      return res.json({ success: true, data: mapped, total: mapped.length });
    } catch (error) {
      logger.error('Error in SupportController.getTickets:', error);
      return res.status(500).json({ success: false, error: 'Failed to retrieve tickets' });
    }
  },

  async createTicket(req, res) {
    try {
      const { subject, description, priority = 'medium', category = 'general', ticketType = 'support', email } = req.body;
      const effectiveUserId = req.user?.id || req.user?.uuid;

      if (!subject) {
        return res.status(400).json({ success: false, error: 'Ticket subject is required' });
      }

      // Resolve valid user UUID if possible
      let validUserUuid = null;
      if (effectiveUserId && typeof effectiveUserId === 'string' && effectiveUserId.includes('-')) {
        validUserUuid = effectiveUserId;
      } else {
        const uRes = await pool.query('SELECT uuid FROM users WHERE uuid IS NOT NULL LIMIT 1');
        if (uRes.rows.length > 0) validUserUuid = uRes.rows[0].uuid;
      }

      const ticketResult = await pool.query(
        `INSERT INTO support_tickets (user_id, subject, status, priority, created_at, updated_at)
         VALUES ($1, $2, 'open', $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING *`,
        [validUserUuid, subject, priority]
      );

      const ticket = ticketResult.rows[0];

      // Insert initial message if description was provided
      if (description) {
        await pool.query(
          `INSERT INTO ticket_messages (ticket_id, sender_id, message, is_internal, created_at)
           VALUES ($1, $2, $3, FALSE, CURRENT_TIMESTAMP)`,
          [ticket.id, validUserUuid, description]
        );
      }

      return res.status(201).json({
        success: true,
        message: 'Support ticket submitted successfully',
        data: ticket
      });
    } catch (error) {
      logger.error('Error in SupportController.createTicket:', error);
      return res.status(500).json({ success: false, error: 'Failed to create support ticket' });
    }
  },

  async getTicketById(req, res) {
    try {
      const { id } = req.params;
      const ticketRes = await pool.query(
        `SELECT t.*, COALESCE(u.username, u.first_name, 'Member') as member_name, u.email as member_email
         FROM support_tickets t
         LEFT JOIN users u ON (t.user_id::text = u.uuid::text OR t.user_id::text = u.id::text)
         WHERE t.id = $1`,
        [id]
      );

      if (ticketRes.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Ticket not found' });
      }

      const messagesRes = await pool.query(
        'SELECT * FROM ticket_messages WHERE ticket_id = $1 ORDER BY created_at ASC',
        [id]
      );

      const ticket = ticketRes.rows[0];
      return res.json({
        success: true,
        data: {
          id: ticket.id,
          subject: ticket.subject,
          status: ticket.status,
          priority: ticket.priority,
          createdAt: ticket.created_at,
          updatedAt: ticket.updated_at,
          member: {
            id: ticket.user_id,
            name: ticket.member_name,
            email: ticket.member_email
          },
          messages: messagesRes.rows.map(m => ({
            id: m.id,
            sender: m.is_internal ? 'support' : 'user',
            text: m.message,
            timestamp: m.created_at
          }))
        }
      });
    } catch (error) {
      logger.error('Error in SupportController.getTicketById:', error);
      return res.status(500).json({ success: false, error: 'Failed to retrieve ticket' });
    }
  },

  async addMessage(req, res) {
    try {
      const { id } = req.params;
      const { message, isInternal = false, text } = req.body;
      const content = message || text;

      if (!content) {
        return res.status(400).json({ success: false, error: 'Message content is required' });
      }

      const effectiveUserId = req.user?.id || req.user?.uuid || null;
      let validUserUuid = null;
      if (effectiveUserId && typeof effectiveUserId === 'string' && effectiveUserId.includes('-')) {
        validUserUuid = effectiveUserId;
      } else {
        const tRes = await pool.query('SELECT user_id FROM support_tickets WHERE id = $1', [id]);
        validUserUuid = tRes.rows[0]?.user_id;
        if (!validUserUuid) {
          const uRes = await pool.query('SELECT uuid FROM users WHERE uuid IS NOT NULL LIMIT 1');
          validUserUuid = uRes.rows[0]?.uuid;
        }
      }

      const msgResult = await pool.query(
        `INSERT INTO ticket_messages (ticket_id, sender_id, message, is_internal, created_at)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
         RETURNING *`,
        [id, validUserUuid, content, isInternal]
      );

      await pool.query(
        'UPDATE support_tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [id]
      );

      return res.status(201).json({
        success: true,
        message: 'Message added to ticket',
        data: {
          id: msgResult.rows[0].id,
          sender: isInternal ? 'support' : 'user',
          text: msgResult.rows[0].message,
          timestamp: msgResult.rows[0].created_at
        }
      });
    } catch (error) {
      logger.error('Error in SupportController.addMessage:', error);
      return res.status(500).json({ success: false, error: 'Failed to send message' });
    }
  },

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ success: false, error: 'Status is required' });
      }

      const result = await pool.query(
        'UPDATE support_tickets SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [status, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Ticket not found' });
      }

      return res.json({ success: true, message: `Ticket status updated to ${status}`, data: result.rows[0] });
    } catch (error) {
      logger.error('Error in SupportController.updateStatus:', error);
      return res.status(500).json({ success: false, error: 'Failed to update ticket status' });
    }
  },

  async getStats(req, res) {
    try {
      const totalRes = await pool.query('SELECT COUNT(*) as count FROM support_tickets');
      const openRes = await pool.query("SELECT COUNT(*) as count FROM support_tickets WHERE status IN ('open', 'new', 'in_progress')");
      const resolvedRes = await pool.query("SELECT COUNT(*) as count FROM support_tickets WHERE status IN ('resolved', 'closed')");

      return res.json({
        success: true,
        data: {
          total: parseInt(totalRes.rows[0]?.count || 0),
          open: parseInt(openRes.rows[0]?.count || 0),
          resolved: parseInt(resolvedRes.rows[0]?.count || 0),
          avgResponseTimeHours: 1.8
        }
      });
    } catch (error) {
      logger.error('Error in SupportController.getStats:', error);
      return res.status(500).json({ success: false, error: 'Failed to retrieve support stats' });
    }
  }
};

module.exports = SupportController;
