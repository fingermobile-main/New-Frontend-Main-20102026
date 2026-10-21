/* eslint-disable no-unused-vars */
/**
 * HelpCenter Controller
 * Complete implementation for support ticket management
 * Date: June 10, 2026 - Phase 1 Week 1 Priority #2
 */

const { SupportTicket, TicketMessage } = require('../models/TicketMessage');
const logger = require('../utils/logger');
const User = require('../models/User');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const sequelize = require('sequelize'); // Ensured sequelize reference is available for fn/col hooks

class HelpCenterController {
  /**
   * GET /api/helpcenter/tickets
   * Get all support tickets with pagination and filtering
   */
  async getAllTickets(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 20, 100);
      const offset = (page - 1) * limit;

      // Build filters
      const where = {};
      if (req.query.status) where.status = req.query.status;
      if (req.query.category) where.category = req.query.category;
      if (req.query.priority) where.priority = req.query.priority;
      if (req.query.submittedBy) where.submittedBy = req.query.submittedBy;

      // For non-admin users, only show their own tickets
      if (req.user && !req.user.isAdmin) {
        where.submittedBy = req.user.id;
      }

      // Fetch data with pagination
      const { count, rows: data } = await SupportTicket.findAndCountAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: User, as: 'submitter', attributes: ['id', 'username', 'email'],
            required: false
          },
          {
            model: User, as: 'assignee', attributes: ['id', 'username', 'email'],
            required: false
          }
        ]
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        success: true,
        data: data.map(ticket => ({
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          subject: ticket.subject,
          category: ticket.category,
          priority: ticket.priority,
          status: ticket.status,
          submittedBy: ticket.submitter,
          assignedTo: ticket.assignee,
          createdAt: ticket.createdAt,
          updatedAt: ticket.updatedAt,
          isSLABreached: ticket.isSLABreached()
        })),
        pagination: {
          page,
          limit,
          total: count,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      logger.error('Error in HelpCenterController.getAllTickets:', error);
      res.status(500).json({
        success: false, message: 'Failed to retrieve support tickets', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/helpcenter/tickets/:id
   * Get ticket by ID with messages
   */
  async getTicketById(req, res) {
    try {
      const { id } = req.params;

      const ticket = await SupportTicket.findByPk(id, {
        include: [
          {
            model: User, as: 'submitter', attributes: ['id', 'username', 'email']
          }, // Fixed: Added missing comma
          {
            model: User, as: 'assignee', attributes: ['id', 'username', 'email'],
            required: false
          }, // Fixed: Added missing comma
          {
            model: TicketMessage, as: 'messages',
            include: [
              {
                model: User, as: 'sender', attributes: ['id', 'username', 'email'],
                required: false
              }
            ], // Fixed: Added missing comma
            order: [['createdAt', 'ASC']]
          }
        ]
      });

      if (!ticket) {
        return res.status(404).json({
          success: false, message: 'Support ticket not found'
        });
      }

      // Check authorization
      if (req.user && !req.user.isAdmin && ticket.submittedBy !== req.user.id) {
        return res.status(403).json({
          success: false, message: 'Not authorized to view this ticket'
        });
      }

      res.json({
        success: true,
        data: {
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          subject: ticket.subject,
          description: ticket.description,
          category: ticket.category,
          priority: ticket.priority,
          status: ticket.status,
          resolution: ticket.resolution,
          submittedBy: ticket.submitter,
          assignedTo: ticket.assignee,
          resolvedAt: ticket.resolvedAt,
          closedAt: ticket.closedAt,
          messages: ticket.messages,
          createdAt: ticket.createdAt,
          updatedAt: ticket.updatedAt, // Fixed: Added missing comma
          isSLABreached: ticket.isSLABreached()
        }
      });
    } catch (error) {
      logger.error('Error in HelpCenterController.getTicketById:', error);
      res.status(500).json({
        success: false, message: 'Failed to retrieve support ticket', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/helpcenter/tickets
   * Create new support ticket
   */
  async createTicket(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false, message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { subject, description, category, priority } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      // Generate ticket number
      const ticketNumber = SupportTicket.generateTicketNumber();

      // Create ticket
      const ticket = await SupportTicket.create({
        ticketNumber,
        subject,
        description,
        category, // Fixed: Added missing comma
        priority: priority || 'medium',
        submittedBy: userId
      });

      // Create initial message
      await TicketMessage.create({
        ticketId: ticket.id,
        message: description,
        senderType: 'customer',
        senderId: userId
      });

      res.status(201).json({
        success: true, message: 'Support ticket created successfully',
        data: {
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          subject: ticket.subject,
          category: ticket.category,
          priority: ticket.priority,
          status: ticket.status, // Fixed: Added missing comma
          createdAt: ticket.createdAt
        }
      });
    } catch (error) {
      logger.error('Error in HelpCenterController.createTicket:', error);
      res.status(500).json({
        success: false, message: 'Failed to create support ticket', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/helpcenter/tickets/:id/messages
   * Add message to ticket
   */
  async addMessage(req, res) {
    try {
      const { id } = req.params;
      const { message, attachments } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const ticket = await SupportTicket.findByPk(id);

      if (!ticket) {
        return res.status(404).json({
          success: false, message: 'Support ticket not found'
        });
      }

      // Check if ticket is closed
      if (ticket.status === 'closed') {
        return res.status(400).json({
          success: false, message: 'Cannot add messages to closed tickets'
        });
      }

      // Determine sender type
      const isAdmin = req.user?.isAdmin || false;
      const senderType = isAdmin ? 'support_agent' : 'customer';

      // Create message
      const ticketMessage = await TicketMessage.create({
        ticketId: ticket.id,
        message,
        senderType,
        senderId: userId,
        attachments: attachments || []
      });

      // Update ticket status if needed
      if (senderType === 'support_agent' && ticket.status === 'open') {
        await ticket.update({ status: 'in_progress', assignedTo: userId });
      } else if (senderType === 'customer' && ticket.status === 'waiting_for_customer') {
        await ticket.update({ status: 'in_progress' });
      }

      res.status(201).json({
        success: true, message: 'Message added successfully',
        data: {
          id: ticketMessage.id,
          message: ticketMessage.message,
          senderType: ticketMessage.senderType, // Fixed: Added missing comma
          createdAt: ticketMessage.createdAt
        }
      });
    } catch (error) {
      logger.error('Error in HelpCenterController.addMessage:', error);
      res.status(500).json({
        success: false, message: 'Failed to add message', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * PUT /api/helpcenter/tickets/:id/status
   * Update ticket status
   */
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, resolution } = req.body;

      const ticket = await SupportTicket.findByPk(id);

      if (!ticket) {
        return res.status(404).json({
          success: false, message: 'Support ticket not found'
        });
      }

      // Validate status transition
      const validTransitions = {
        open: ['in_progress', 'closed'],
        in_progress: ['waiting_for_customer', 'resolved', 'closed'],
        waiting_for_customer: ['in_progress', 'closed'],
        resolved: ['closed', 'in_progress'],
        closed: ['open']
      };

      if (!validTransitions[ticket.status]?.includes(status)) {
        return res.status(400).json({
          success: false, message: `Invalid status transition from ${ticket.status} to ${status}`
        });
      }

      const updates = { status };
      if (status === 'resolved') {
        updates.resolvedAt = new Date();
        updates.resolution = resolution;
      } else if (status === 'closed') {
        updates.closedAt = new Date();
      }

      await ticket.update(updates);

      res.json({
        success: true, message: 'Ticket status updated successfully',
        data: {
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          status: ticket.status,
          resolvedAt: ticket.resolvedAt, // Fixed: Added missing comma
          closedAt: ticket.closedAt
        }
      });
    } catch (error) {
      logger.error('Error in HelpCenterController.updateStatus:', error);
      res.status(500).json({
        success: false, message: 'Failed to update ticket status', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/helpcenter/stats
   * Get support ticket statistics
   */
  async getStats(req, res) {
    try {
      // Fixed: Reconstructed proper formatting for dynamic model selections and groupings
      const stats = await SupportTicket.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['status']
      });

      const categoryStats = await SupportTicket.findAll({
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['category']
      });

      const summary = {
        total: await SupportTicket.count(),
        byStatus: {}, // Fixed: Added missing comma
        byCategory: {}, // Fixed: Added missing comma
        slaBreaches: 0
      };

      stats.forEach(stat => {
        summary.byStatus[stat.status] = parseInt(stat.dataValues.count);
      });

      categoryStats.forEach(stat => {
        summary.byCategory[stat.category] = parseInt(stat.dataValues.count);
      });

      // Count SLA breaches
      const allTickets = await SupportTicket.findAll();
      summary.slaBreaches = allTickets.filter(t => t.isSLABreached()).length;

      res.json({
        success: true, data: summary
      });
    } catch (error) {
      logger.error('Error in HelpCenterController.getStats:', error);
      res.status(500).json({
        success: false, message: 'Failed to retrieve statistics', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/helpcenter/faqs
   * Get FAQ articles with filtering and search
   */
  async getFAQs(req, res) {
    try {
      const { category, search, featured, limit = 50 } = req.query;

      // Fixed: Added missing selection comma between category_name and category_slug
      let query = `
        SELECT 
          fa.*,
          fc.name as category_name, 
          fc.slug as category_slug
        FROM faq_articles fa
        LEFT JOIN faq_categories fc ON fa.category_id = fc.id
        WHERE fa.is_active = true
      `;

      const params = [];
      let paramCount = 0;

      if (category) {
        paramCount++;
        query += ` AND fc.slug = $${paramCount}`;
        params.push(category);
      }

      if (featured === 'true') {
        query += ' AND fa.is_featured = true';
      }

      if (search) {
        paramCount++;
        query += ` AND (fa.question ILIKE $${paramCount} OR fa.answer ILIKE $${paramCount})`;
        params.push(`%${search}%`);
      }

      query += ` ORDER BY fa.is_featured DESC, fa.view_count DESC LIMIT $${paramCount + 1}`;
      params.push(parseInt(limit));

      const { pool } = require('../db');
      const result = await pool.query(query, params);

      // Increment view count for returned articles (async, don't wait)
      result.rows.forEach(async (article) => {
        try {
          await pool.query('UPDATE faq_articles SET view_count = view_count + 1 WHERE id = $1', [article.id]);
        } catch (e) {
          // Ignore view count errors
        }
      });

      res.json({
        success: true,
        data: result.rows.map(faq => ({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          shortAnswer: faq.short_answer,
          category: {
            id: faq.category_id,
            name: faq.category_name,
            slug: faq.category_slug
          }, // Fixed: Added missing comma
          tags: faq.tags,
          viewCount: faq.view_count,
          helpfulCount: faq.helpful_count,
          notHelpfulCount: faq.not_helpful_count,
          isFeatured: faq.is_featured,
          createdAt: faq.created_at
        }))
      });
    } catch (error) {
      logger.error('Error in HelpCenterController.getFAQs:', error);
      res.status(500).json({
        success: false, message: 'Failed to retrieve FAQs', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/helpcenter/faqs/:id/feedback
   * Submit feedback on FAQ article
   */
  async submitFeedback(req, res) {
    try {
      const { id } = req.params;
      const { feedbackType, comment } = req.body;
      const userId = req.user?.id;

      if (!feedbackType || !['helpful', 'not_helpful'].includes(feedbackType)) {
        return res.status(400).json({
          success: false, message: 'Valid feedback type required (helpful or not_helpful)'
        });
      }

      const { pool } = require('../db');

      // Insert feedback
      await pool.query(`
        INSERT INTO faq_feedback (article_id, user_id, feedback_type, comment)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (article_id, user_id) DO UPDATE
        SET feedback_type = $3, comment = $4, created_at = NOW()
      `, [id, userId || null, feedbackType, comment || null]);

      // Fixed: Escaped single quote blocks and integrated structural targeting fields directly into template literals safely
      const updateField = feedbackType === 'helpful' ? 'helpful_count' : 'not_helpful_count';
      await pool.query(`
        UPDATE faq_articles SET ${updateField} = ${updateField} + 1 WHERE id = $1
      `, [id]);

      res.json({
        success: true, message: 'Feedback submitted successfully'
      });
    } catch (error) {
      logger.error('Error in HelpCenterController.submitFeedback:', error);
      res.status(500).json({
        success: false, message: 'Failed to submit feedback', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/helpcenter/categories
   * Get FAQ categories
   */
  async getCategories(req, res) {
    try {
      const { pool } = require('../db');
      const result = await pool.query(`
        SELECT id, name, slug, description, icon
        FROM faq_categories
        WHERE is_active = true
        ORDER BY sort_order ASC
      `);

      res.json({
        success: true, data: result.rows
      });
    } catch (error) {
      logger.error('Error in HelpCenterController.getCategories:', error);
      res.status(500).json({
        success: false, message: 'Failed to retrieve categories', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new HelpCenterController();
