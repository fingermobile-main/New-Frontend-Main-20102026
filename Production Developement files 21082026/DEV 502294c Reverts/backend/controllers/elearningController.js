/**
 * E-Learning Controller
 * Complete implementation for education platform
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class ELearningController {
  /**
   * GET /api/elearning/courses
   * Get all courses
   */
  async getCourses(req, res) {
    try {
      const { 
        limit = 50, 
        offset = 0, 
        category, 
        level,
        instructor, isPublished = 'true'
      } = req.query;

      let whereClause = [];
      let queryParams = [];
      let paramCount = 1;

      if (category) {
        whereClause.push(`category = $${paramCount}`);
        queryParams.push(category);
        paramCount++;
      }

      if (level) {
        whereClause.push(`level = $${paramCount}`);
        queryParams.push(level);
        paramCount++;
      }

      if (instructor) {
        whereClause.push(`instructor_id = $${paramCount}`);
        queryParams.push(instructor);
        paramCount++;
      }

      if (isPublished === 'true') {
        whereClause.push('is_published = true');
      }

      const whereSQL = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

      const result = await pool.query(`SELECT 
          c.id,
          c.title,
          c.description,
          c.category,
          c.level,
          c.duration_hours,
          c.price,
          c.thumbnail_url,
          c.instructor_id,
          u.username as instructor_name,
          COUNT(DISTINCT e.user_id) as enrolled_count,
          AVG(r.rating) as avg_rating, c.created_at
         FROM elearning_courses c
         JOIN users u ON c.instructor_id = u.id
         LEFT JOIN elearning_enrollments e ON c.id = e.course_id
         LEFT JOIN elearning_reviews r ON c.id = r.course_id
         ${whereSQL}
         GROUP BY c.id, u.username
         ORDER BY c.created_at DESC
         LIMIT $${paramCount} OFFSET $${paramCount + 1}`, [...queryParams, parseInt(limit), parseInt(offset)]);

      res.json({
        success: true,
        data: result.rows.map(course => ({
          ...course,
          price: parseFloat(course.price) || 0,
          durationHours: parseFloat(course.duration_hours) || 0,
          enrolledCount: parseInt(course.enrolled_count),
          avgRating: parseFloat(course.avg_rating) || 0
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in ELearningController.getCourses:', error);
      res.status(500).json({
        success: false, message: 'Failed to get courses', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/elearning/enroll
   * Enroll in a course
   */
  async enrollCourse(req, res) {
    try {
      const userId = req.user?.id;
      const { courseId } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (!courseId) {
        return res.status(400).json({
          success: false, message: 'Course ID is required'
        });
      }

      // Check if already enrolled
      const existing = await pool.query(
        'SELECT id FROM elearning_enrollments WHERE user_id = $1 AND course_id = $2',
        [userId, courseId]
      );

      if (existing.rows.length > 0) {
        return res.status(400).json({
          success: false, message: 'Already enrolled in this course'
        });
      }

      await pool.query(
        `INSERT INTO elearning_enrollments (user_id, course_id, enrolled_at, progress)
         VALUES ($1, $2, NOW(), 0)`,
        [userId, courseId]
      );

      res.status(201).json({
        success: true, message: 'Enrolled successfully'
      });
    } catch (error) {
      logger.error('Error in ELearningController.enrollCourse:', error);
      res.status(500).json({
        success: false, message: 'Failed to enroll', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/elearning/my-courses
   * Get enrolled courses for current user
   */
  async getMyCourses(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const result = await pool.query(
        `SELECT 
          c.*,
          e.progress,
          e.enrolled_at,
          e.last_accessed_at,
          u.username as instructor_name
         FROM elearning_enrollments e
         JOIN elearning_courses c ON e.course_id = c.id
         JOIN users u ON c.instructor_id = u.id
         WHERE e.user_id = $1
         ORDER BY e.last_accessed_at DESC NULLS LAST`,
        [userId]
      );

      res.json({
        success: true,
        data: result.rows.map(course => ({
          ...course,
          progress: parseFloat(course.progress) || 0
        })), count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in ELearningController.getMyCourses:', error);
      res.status(500).json({
        success: false, message: 'Failed to get enrolled courses', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/elearning/progress
   * Update course progress
   */
  async updateProgress(req, res) {
    try {
      const userId = req.user?.id;
      const { courseId, progress, lessonId } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (!courseId || progress === undefined) {
        return res.status(400).json({
          success: false, message: 'Course ID and progress are required'
        });
      }

      await pool.query(
        `UPDATE elearning_enrollments 
         SET progress = $1, last_accessed_at = NOW()
         WHERE user_id = $2 AND course_id = $3`,
        [parseFloat(progress), userId, courseId]
      );

      // Track lesson completion if provided
      if (lessonId) {
        await pool.query(
          `INSERT INTO elearning_lesson_completions (user_id, course_id, lesson_id, completed_at)
           VALUES ($1, $2, $3, NOW())
           ON CONFLICT (user_id, lesson_id) DO NOTHING`,
          [userId, courseId, lessonId]
        );
      }

      res.json({
        success: true, message: 'Progress updated'
      });
    } catch (error) {
      logger.error('Error in ELearningController.updateProgress:', error);
      res.status(500).json({
        success: false, message: 'Failed to update progress', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/elearning/reviews
   * Submit course review
   */
  async submitReview(req, res) {
    try {
      const userId = req.user?.id;
      const { courseId, rating, comment } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (!courseId || !rating) {
        return res.status(400).json({
          success: false, message: 'Course ID and rating are required'
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false, message: 'Rating must be between 1 and 5'
        });
      }

      // Verify enrollment
      const enrollment = await pool.query(
        'SELECT id FROM elearning_enrollments WHERE user_id = $1 AND course_id = $2',
        [userId, courseId]
      );

      if (enrollment.rows.length === 0) {
        return res.status(403).json({
          success: false, message: 'Must be enrolled to review'
        });
      }

      await pool.query(
        `INSERT INTO elearning_reviews (user_id, course_id, rating, comment, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [userId, courseId, rating, comment || null]
      );

      res.status(201).json({
        success: true, message: 'Review submitted successfully'
      });
    } catch (error) {
      logger.error('Error in ELearningController.submitReview:', error);
      res.status(500).json({
        success: false, message: 'Failed to submit review', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new ELearningController();
