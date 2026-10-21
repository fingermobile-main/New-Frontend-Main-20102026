/**
 * programsController.js
 * Controller for Programs & Courses module
 */
const { pool } = require('../db');
const logger = require('../utils/logger');

class ProgramsController {
  // GET /api/programs
  async getAll(req, res) {
    try {
      const { category, search } = req.query;
      let query = 'SELECT * FROM programs WHERE 1=1';
      const params = [];

      if (category && category !== 'all') {
        params.push(category);
        query += ` AND category = $${params.length}`;
      }

      if (search) {
        params.push(`%${search}%`);
        query += ` AND (title ILIKE $${params.length} OR description ILIKE $${params.length})`;
      }

      query += ' ORDER BY created_at DESC';

      const result = await pool.query(query, params);

      return res.json({
        success: true,
        data: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in programsController.getAll:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch programs', error: error.message });
    }
  }

  // GET /api/programs/:id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM programs WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Program not found' });
      }
      return res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in programsController.getById:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch program', error: error.message });
    }
  }

  // POST /api/programs
  async create(req, res) {
    try {
      const {
        title,
        description,
        thumbnail_url,
        category = 'technology',
        difficulty_level = 'intermediate',
        price = 0,
        currency = 'FIC',
        enrollment_limit = 100,
        curriculum = []
      } = req.body;

      if (!title) {
        return res.status(400).json({ success: false, message: 'Program title is required' });
      }

      const creator_id = req.user?.id || 'admin';

      const result = await pool.query(`
        INSERT INTO programs (
          creator_id, title, description, thumbnail_url, category,
          difficulty_level, price, currency, enrollment_limit, curriculum
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `, [creator_id, title, description || '', thumbnail_url || '', category, difficulty_level, price, currency, enrollment_limit, JSON.stringify(curriculum)]);

      return res.status(201).json({
        success: true,
        message: 'Program created successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in programsController.create:', error);
      return res.status(500).json({ success: false, message: 'Failed to create program', error: error.message });
    }
  }

  // POST /api/programs/:id/enroll
  async enroll(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.body.userId || 'current_user';

      // Check program existence
      const progRes = await pool.query('SELECT * FROM programs WHERE id = $1', [id]);
      if (progRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Program not found' });
      }
      const program = progRes.rows[0];

      // Increment enrollment count
      await pool.query('UPDATE programs SET enrolled_count = enrolled_count + 1 WHERE id = $1', [id]);

      return res.json({
        success: true,
        message: `Successfully enrolled in ${program.title}!`,
        data: {
          program_id: id,
          user_id: userId,
          enrolled_at: new Date()
        }
      });
    } catch (error) {
      logger.error('Error in programsController.enroll:', error);
      return res.status(500).json({ success: false, message: 'Failed to enroll in program', error: error.message });
    }
  }
}

module.exports = new ProgramsController();
