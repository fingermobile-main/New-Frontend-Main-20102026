const { pool } = require('../db');
const logger = require('../utils/logger');

class JobsController {
  // GET /api/jobs - List active jobs with filtering and pagination
  async getAllJobs(req, res) {
    try {
      const {
        search = '',
        type = '',
        category = '',
        location = '',
        page = 1,
        limit = 20
      } = req.query;

      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, Math.min(50, parseInt(limit) || 20));
      const offset = (pageNum - 1) * limitNum;

      const conditions = ['is_active = true'];
      const params = [];
      let paramCount = 1;

      if (search) {
        conditions.push(`(title ILIKE $${paramCount} OR company ILIKE $${paramCount} OR description ILIKE $${paramCount})`);
        params.push(`%${search}%`);
        paramCount++;
      }

      if (type) {
        conditions.push(`type ILIKE $${paramCount}`);
        params.push(type);
        paramCount++;
      }

      if (category) {
        conditions.push(`category ILIKE $${paramCount}`);
        params.push(category);
        paramCount++;
      }

      if (location) {
        conditions.push(`location ILIKE $${paramCount}`);
        params.push(`%${location}%`);
        paramCount++;
      }

      const whereClause = conditions.join(' AND ');

      const countResult = await pool.query(
        `SELECT COUNT(*) as total FROM jobs WHERE ${whereClause}`,
        params
      );
      const total = parseInt(countResult.rows[0].total) || 0;

      const jobsResult = await pool.query(
        `SELECT 
          id, title, company, location, type, category, 
          salary_range, experience_level, description, requirements, benefits, 
          creator_id, created_at, updated_at
         FROM jobs
         WHERE ${whereClause}
         ORDER BY created_at DESC
         LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
        [...params, limitNum, offset]
      );

      return res.status(200).json({
        success: true,
        data: jobsResult.rows,
        jobs: jobsResult.rows,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    } catch (error) {
      logger.error('Error in JobsController.getAllJobs:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve jobs',
        error: error.message
      });
    }
  }

  // GET /api/jobs/:id - Get specific job details
  async getJobById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const result = await pool.query(
        'SELECT * FROM jobs WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Job posting not found'
        });
      }

      const job = result.rows[0];

      // Check if user has already applied
      let userApplication = null;
      if (userId) {
        const appResult = await pool.query(
          'SELECT id, status, created_at FROM job_applications WHERE job_id = $1 AND user_id = $2',
          [id, userId]
        );
        if (appResult.rows.length > 0) {
          userApplication = appResult.rows[0];
        }
      }

      return res.status(200).json({
        success: true,
        data: {
          ...job,
          hasApplied: !!userApplication,
          application: userApplication
        }
      });
    } catch (error) {
      logger.error('Error in JobsController.getJobById:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve job details',
        error: error.message
      });
    }
  }

  // POST /api/jobs - Create a new job vacancy
  async createJob(req, res) {
    try {
      const creatorId = req.user?.id || null;
      const {
        title,
        company,
        location,
        type = 'Full-time',
        category = 'Engineering',
        salaryRange = '$70,000 - $100,000',
        experienceLevel = 'Mid-Level',
        description,
        requirements = [],
        benefits = []
      } = req.body;

      if (!title || !company || !location || !description) {
        return res.status(400).json({
          success: false,
          message: 'Title, company, location, and description are required'
        });
      }

      const result = await pool.query(
        `INSERT INTO jobs (
          title, company, location, type, category, 
          salary_range, experience_level, description, 
          requirements, benefits, creator_id, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true)
        RETURNING *`,
        [
          title, company, location, type, category,
          salaryRange, experienceLevel, description,
          Array.isArray(requirements) ? requirements : [requirements],
          Array.isArray(benefits) ? benefits : [benefits],
          creatorId
        ]
      );

      return res.status(201).json({
        success: true,
        message: 'Job vacancy created successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in JobsController.createJob:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create job posting',
        error: error.message
      });
    }
  }

  // POST /api/jobs/:id/apply - Apply for a job
  async applyForJob(req, res) {
    try {
      const userId = req.user?.id;
      const { id: jobId } = req.params;
      const { resumeUrl, coverLetter, portfolioUrl } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required to apply'
        });
      }

      // Verify job exists and is active
      const jobCheck = await pool.query(
        'SELECT id, title, company FROM jobs WHERE id = $1 AND is_active = true',
        [jobId]
      );

      if (jobCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Job vacancy not found or no longer active'
        });
      }

      // Check if already applied
      const existing = await pool.query(
        'SELECT id FROM job_applications WHERE job_id = $1 AND user_id = $2',
        [jobId, userId]
      );

      if (existing.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'You have already applied for this position'
        });
      }

      const result = await pool.query(
        `INSERT INTO job_applications (job_id, user_id, resume_url, cover_letter, portfolio_url, status)
         VALUES ($1, $2, $3, $4, $5, 'submitted')
         RETURNING *`,
        [jobId, userId, resumeUrl || null, coverLetter || null, portfolioUrl || null]
      );

      return res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in JobsController.applyForJob:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to submit application',
        error: error.message
      });
    }
  }

  // GET /api/jobs/applications/my - Current user applications
  async getMyApplications(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const result = await pool.query(
        `SELECT 
          ja.id as application_id, ja.status, ja.created_at as applied_at,
          j.id as job_id, j.title, j.company, j.location, j.type, j.salary_range
         FROM job_applications ja
         JOIN jobs j ON ja.job_id = j.id
         WHERE ja.user_id = $1
         ORDER BY ja.created_at DESC`,
        [userId]
      );

      return res.status(200).json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      logger.error('Error in JobsController.getMyApplications:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch your applications',
        error: error.message
      });
    }
  }
}

module.exports = new JobsController();
