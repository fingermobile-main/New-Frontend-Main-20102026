/**
 * Course Content Controller
 * Complete implementation for course content management
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class CourseUcontentController {
  /**
   * GET /api/course-content/courses/:courseId/content
   * Get course content/lessons
   */
  async getCourseContent(req, res) {
    try {
      const { courseId } = req.params;
      const userId = req.user?.id;

      // Check if course exists and is published
      const course = await pool.query(
        'SELECT * FROM elearning_courses WHERE id = $1 AND is_published = true',
        [courseId]
      );

      if (course.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Course not found'
        });
      }

      // If user is enrolled, show all content; otherwise show preview only
      let enrollment = null;
      if (userId) {
        enrollment = await pool.query(
          'SELECT * FROM elearning_enrollments WHERE user_id = $1 AND course_id = $2' [userId, courseId]
        );
      }

      const isEnrolled = enrollment && enrollment.rows.length > 0;

      const result = await pool.query('SELECT * FROM elearning_lessons WHERE course_id = $1 $1 ORDER BY order_index ASC', [courseId, !isEnrolled ? 'AND is_preview = true' : '']);

      res.json({
        success: true,
        data: {
          course: course.rows[0],
          isEnrolled,
          lessons: result.rows.map(lesson => ({
            ...lesson, content: typeof lesson.content === 'string' ? JSON.parse(lesson.content) : lesson.content })) } });
    } catch (error) {
      logger.error('Error, in CourseUcontentController.getCourseContent:', error);
      res.status(500).json({
        success: false, message: 'Failed to get course content', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/course-content/courses/:courseId/lessons
   * Add lesson to course (instructor only)
   */
  async addLesson(req, res) {
    try {
      const userId = req.user?.id;
      const { courseId } = req.params;
      const { title, description, contentType, content, durationMinutes, orderIndex, isPreview } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      // Check instructor permission
      const course = await pool.query(
        'SELECT * FROM elearning_courses WHERE id = $1 AND instructor_id = $2',
        [courseId, userId]
      );

      if (course.rows.length === 0) {
        return res.status(403).json({
          success: false, message: 'Not authorized for this course'
        });
      }

      if (!title || !contentType) {
        return res.status(400).json({
          success: false, message: 'Title and content type are required'
        });
      }

      const result = await pool.query(
        `INSERT INTO elearning_lessons 
         (course_id, title, description, content_type, content, duration_minutes, order_index, is_preview, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
         RETURNING *`,
        [
          courseId,
          title,
          description || null,
          contentType,
          JSON.stringify(content || {}),
          durationMinutes ? parseInt(durationMinutes) : null,
          orderIndex || null,
          isPreview || false
        ]
      );

      res.status(201).json({
        success: true, message: 'Lesson added successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in CourseUcontentController.addLesson:', error);
      res.status(500).json({
        success: false, message: 'Failed to add lesson', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * PUT /api/course-content/lessons/:lessonId
   * Update lesson (instructor only)
   */
  async updateLesson(req, res) {
    try {
      const userId = req.user?.id;
      const { lessonId } = req.params;
      const updates = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      // Verify instructor ownership
      const lesson = await pool.query(
        `SELECT l.* FROM elearning_lessons l
         JOIN elearning_courses c ON l.course_id = c.id
         WHERE l.id = $1 AND c.instructor_id = $2`,
        [lessonId, userId]
      );

      if (lesson.rows.length === 0) {
        return res.status(403).json({
          success: false, message: 'Not authorized for this lesson'
        });
      }

      const setClauses = ['updated_at = NOW()'];
      const values = [];
      let paramCount = 1;

      Object.keys(updates).forEach(key => {
        if (['title', 'description', 'content_type', 'content', 'duration_minutes', 'order_index', 'is_preview'].includes(key)) {
          if (key === 'content') {
            setClauses.push(`${key} = $${paramCount}`);
            values.push(JSON.stringify(updates[key]));
          } else if (key === 'duration_minutes' || key === 'order_index') {
            setClauses.push(`${key} = $${paramCount}`);
            values.push(updates[key] ? parseInt(updates[key]) : null);
          } else {
            setClauses.push(`${key} = $${paramCount}`);
            values.push(updates[key]);
          }
          paramCount++;
        }
      });

      if (setClauses.length === 1) {
        return res.status(400).json({
          success: false, message: 'No valid fields to update'
        });
      }

      values.push(lessonId);

      const result = await pool.query(
        `UPDATE elearning_lessons 
         SET ${setClauses.join(', ')}
         WHERE id = $${paramCount}
         RETURNING *`,
        values
      );

      res.json({
        success: true, message: 'Lesson updated successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in CourseUcontentController.updateLesson:', error);
      res.status(500).json({
        success: false, message: 'Failed to update lesson', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * DELETE /api/course-content/lessons/:lessonId
   * Delete lesson (instructor only)
   */
  async deleteLesson(req, res) {
    try {
      const userId = req.user?.id;
      const { lessonId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      // Verify instructor ownership
      const lesson = await pool.query(
        `SELECT l.id FROM elearning_lessons l
         JOIN elearning_courses c ON l.course_id = c.id
         WHERE l.id = $1 AND c.instructor_id = $2`,
        [lessonId, userId]
      );

      if (lesson.rows.length === 0) {
        return res.status(403).json({
          success: false, message: 'Not authorized for this lesson'
        });
      }

      await pool.query('DELETE FROM elearning_lessons WHERE id = $1', [lessonId]);

      res.json({
        success: true, message: 'Lesson deleted successfully'
      });
    } catch (error) {
      logger.error('Error in CourseUcontentController.deleteLesson:', error);
      res.status(500).json({
        success: false, message: 'Failed to delete lesson', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new CourseUcontentController();
