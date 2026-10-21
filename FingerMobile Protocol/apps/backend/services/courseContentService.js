const logger = require('../utils/logger');
/**
 * CourseContentService.js
 * Business logic service for course content management
 */

const CourseContentModel = require('../models/CourseContentModel');

class CourseContentService {
  /**
   * Get all courses with filtering and pagination
   */
  static async getAllCourses(filters = {}) {
    try {
      const courses = await CourseContentModel.getCourses(filters);
      const total = await CourseContentModel.getCoursesCount(filters);

      return {
        success: true,
        data: courses,
        pagination: {
          total,
          limit: parseInt(filters.limit) || 20,
          offset: parseInt(filters.offset) || 0,
          page: Math.floor((parseInt(filters.offset) || 0) / (parseInt(filters.limit) || 20)) + 1
        }
      };
    } catch (error) {
      logger.error('Error in getAllCourses:', error);
      throw error;
    }
  }

  /**
   * Get single course by ID
   */
  static async getCourseById(id) {
    try {
      const course = await CourseContentModel.getCourseById(id);

      if (!course) {
        return {
          success: false,
          message: 'Course not found'
        };
      }

      return {
        success: true,
        data: course
      };
    } catch (error) {
      logger.error('Error in getCourseById:', error);
      throw error;
    }
  }

  /**
   * Create new course
   */
  static async createCourse(data, instructorId) {
    try {
      // Validate required fields
      if (!data.title || !data.slug) {
        throw new Error('Title and slug are required');
      }

      // Add instructor_id
      const courseData = {
        ...data,
        instructor_id: instructorId
      };

      const course = await CourseContentModel.createCourse(courseData);

      return {
        success: true,
        message: 'Course created successfully',
        data: course
      };
    } catch (error) {
      logger.error('Error in createCourse:', error);
      throw error;
    }
  }

  /**
   * Update course
   */
  static async updateCourse(id, data, instructorId) {
    try {
      // Verify ownership
      const existingCourse = await CourseContentModel.getCourseById(id);

      if (!existingCourse) {
        throw new Error('Course not found');
      }

      if (existingCourse.instructor_id !== instructorId) {
        throw new Error('Not authorized to update this course');
      }

      const updatedCourse = await CourseContentModel.updateCourse(id, data);

      return {
        success: true,
        message: 'Course updated successfully',
        data: updatedCourse
      };
    } catch (error) {
      logger.error('Error in updateCourse:', error);
      throw error;
    }
  }

  /**
   * Delete course
   */
  static async deleteCourse(id, instructorId) {
    try {
      // Verify ownership
      const existingCourse = await CourseContentModel.getCourseById(id);

      if (!existingCourse) {
        throw new Error('Course not found');
      }

      if (existingCourse.instructor_id !== instructorId) {
        throw new Error('Not authorized to delete this course');
      }

      await CourseContentModel.deleteCourse(id);

      return {
        success: true,
        message: 'Course deleted successfully'
      };
    } catch (error) {
      logger.error('Error in deleteCourse:', error);
      throw error;
    }
  }

  /**
   * Enroll in course
   */
  static async enrollInCourse(courseId, memberId) {
    try {
      const enrollment = await CourseContentModel.enrollInCourse(courseId, memberId);

      return {
        success: true,
        message: 'Successfully enrolled in course',
        data: enrollment
      };
    } catch (error) {
      logger.error('Error in enrollInCourse:', error);
      throw error;
    }
  }

  /**
   * Get member's enrollments
   */
  static async getMemberEnrollments(memberId) {
    try {
      const enrollments = await CourseContentModel.getMemberEnrollments(memberId);

      return {
        success: true,
        data: enrollments
      };
    } catch (error) {
      logger.error('Error in getMemberEnrollments:', error);
      throw error;
    }
  }

  /**
   * Complete lesson
   */
  static async completeLesson(enrollmentId, lessonId, timeSpent = 0) {
    try {
      const progress = await CourseContentModel.completeLesson(enrollmentId, lessonId, timeSpent);

      return {
        success: true,
        message: 'Lesson marked as completed',
        data: progress
      };
    } catch (error) {
      logger.error('Error in completeLesson:', error);
      throw error;
    }
  }

  /**
   * Get course progress
   */
  static async getCourseProgress(enrollmentId) {
    try {
      const progress = await CourseContentModel.getCourseProgress(enrollmentId);

      return {
        success: true,
        data: progress
      };
    } catch (error) {
      logger.error('Error in getCourseProgress:', error);
      throw error;
    }
  }

  /**
   * Create course review
   */
  static async createReview(data) {
    try {
      // Validate rating
      if (!data.rating || data.rating < 1 || data.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      const review = await CourseContentModel.createReview(data);

      return {
        success: true,
        message: 'Review submitted successfully',
        data: review
      };
    } catch (error) {
      logger.error('Error in createReview:', error);
      throw error;
    }
  }

  /**
   * Get course categories
   */
  static async getCategories() {
    try {
      const categories = await CourseContentModel.getCategories();

      return {
        success: true,
        data: categories
      };
    } catch (error) {
      logger.error('Error in getCategories:', error);
      throw error;
    }
  }
}

module.exports = CourseContentService;
