/**
 * CourseContentController.js
 * Controller for course content management endpoints
 */

const CourseContentService = require('../services/courseContentService');
const logger = require('../utils/logger');

class CourseContentController {
  /**
   * GET /api/course-content
   * Get all courses with filtering and pagination
   */
  async getAll(req, res) {
    try {
      const filters = {
        category_id: req.query.category_id,
        level: req.query.level,
        min_price: req.query.min_price,
        max_price: req.query.max_price,
        search: req.query.search, sort_by: req.query.sort_by || 'created_at', order: req.query.order || 'DESC',
        limit: req.query.limit || 20, offset: req.query.offset || 0
      };

      const result = await CourseContentService.getAllCourses(filters);

      res.json(result);
    } catch (error) {
      logger.error('Error in getAll:', error);
      res.status(500).json({
        success: false, message: 'Failed to fetch courses', error: error.message
      });
    }
  }

  /**
   * GET /api/course-content/:id
   * Get single course by ID with lessons and materials
   */
  async getById(req, res) {
    try {
      const { id } = req.params;

      const result = await CourseContentService.getCourseById(id);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      logger.error('Error in getById:', error);
      res.status(500).json({
        success: false, message: 'Failed to fetch course', error: error.message
      });
    }
  }

  /**
   * POST /api/course-content
   * Create new course (instructor only)
   */
  async create(req, res) {
    try {
      const instructorId = req.member.id;
      const courseData = req.body;

      const result = await CourseContentService.createCourse(courseData, instructorId);

      res.status(201).json(result);
    } catch (error) {
      logger.error('Error in create:', error);
      res.status(400).json({
        success: false, message: error.message || 'Failed to create course'
      });
    }
  }

  /**
   * PUT /api/course-content/:id
   * Update course (instructor only)
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const instructorId = req.member.id;
      const courseData = req.body;

      const result = await CourseContentService.updateCourse(id, courseData, instructorId);

      res.json(result);
    } catch (error) {
      logger.error('Error in update:', error);
      res.status(error.message.includes('not found') ? 404 : 403).json({
        success: false, message: error.message || 'Failed to update course'
      });
    }
  }

  /**
   * DELETE /api/course-content/:id
   * Delete course (instructor only)
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const instructorId = req.member.id;

      const result = await CourseContentService.deleteCourse(id, instructorId);

      res.json(result);
    } catch (error) {
      logger.error('Error in delete:', error);
      res.status(error.message.includes('not found') ? 404 : 403).json({
        success: false, message: error.message || 'Failed to delete course'
      });
    }
  }

  /**
   * POST /api/course-content/:id/enroll
   * Enroll in course (student)
   */
  async enroll(req, res) {
    try {
      const { id } = req.params;
      const memberId = req.member.id;

      const result = await CourseContentService.enrollInCourse(id, memberId);

      res.status(201).json(result);
    } catch (error) {
      logger.error('Error in enroll:', error);
      res.status(400).json({
        success: false, message: error.message || 'Failed to enroll in course'
      });
    }
  }

  /**
   * GET /api/course-content/my-courses
   * Get member's enrolled courses
   */
  async getMyCourses(req, res) {
    try {
      const memberId = req.member.id;

      const result = await CourseContentService.getMemberEnrollments(memberId);

      res.json(result);
    } catch (error) {
      logger.error('Error in getMyCourses:', error);
      res.status(500).json({
        success: false, message: 'Failed to fetch enrolled courses',
        error: error.message
      });
    }
  }

  /**
   * GET /api/course-content/:courseId/progress
   * Get course progress for enrolled student
   */
  async getProgress(req, res) {
    try {
      const { courseId } = req.params;
      const memberId = req.member.id;

      // First get enrollment
      const enrollments = await CourseContentService.getMemberEnrollments(memberId);
      const enrollment = enrollments.data.find(e => e.course_id === parseInt(courseId));

      if (!enrollment) {
        return res.status(404).json({
          success: false, message: 'Not enrolled in this course'
        });
      }

      const result = await CourseContentService.getCourseProgress(enrollment.id);

      res.json(result);
    } catch (error) {
      logger.error('Error in getProgress:', error);
      res.status(500).json({
        success: false, message: 'Failed to fetch course progress',
        error: error.message
      });
    }
  }

  /**
   * PUT /api/course-content/lessons/:lessonId/complete
   * Mark lesson as completed
   */
  async completeLesson(req, res) {
    try {
      const { lessonId } = req.params;
      const { enrollment_id, time_spent } = req.body;
      const memberId = req.member.id;

      // Verify enrollment ownership
      const enrollments = await CourseContentService.getMemberEnrollments(memberId);
      const enrollment = enrollments.data.find(e => e.id === parseInt(enrollment_id));

      if (!enrollment) {
        return res.status(404).json({
          success: false, message: 'Enrollment not found or unauthorized'
        });
      }

      const result = await CourseContentService.completeLesson(
        parseInt(enrollment_id),
        parseInt(lessonId), parseInt(time_spent) || 0
      );

      res.json(result);
    } catch (error) {
      logger.error('Error in completeLesson:', error);
      res.status(500).json({
        success: false, message: 'Failed to mark lesson as completed',
        error: error.message
      });
    }
  }

  /**
   * POST /api/course-content/:id/review
   * Submit course review
   */
  async createReview(req, res) {
    try {
      const { id } = req.params;
      const memberId = req.member.id;
      const { rating, title, comment } = req.body;

      const result = await CourseContentService.createReview({
        course_id: parseInt(id),
        member_id: memberId,
        rating,
        title, comment
      });

      res.status(201).json(result);
    } catch (error) {
      logger.error('Error in createReview:', error);
      res.status(400).json({
        success: false, message: error.message || 'Failed to submit review'
      });
    }
  }

  /**
   * GET /api/course-content/categories
   * Get all course categories
   */
  async getCategories(req, res) {
    try {
      const result = await CourseContentService.getCategories();

      res.json(result);
    } catch (error) {
      logger.error('Error in getCategories:', error);
      res.status(500).json({
        success: false, message: 'Failed to fetch categories',
        error: error.message
      });
    }
  }
}

module.exports = new CourseContentController();
