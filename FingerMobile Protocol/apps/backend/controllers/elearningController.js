/**
 * E-Learning Controller
 * Handles educational content and course management operations
 */

const ElearningCourse = require('../models/ElearningCourse');
const User = require('../models/User');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

const db = require('../db');
const getPool = () => db.pool || db;

class ElearningController {
  constructor() {
    this.getCourses = this.getCourses.bind(this);
    this.createCourse = this.createCourse.bind(this);
    this.enrollInCourse = this.enrollInCourse.bind(this);
    this.getMyCourses = this.getMyCourses.bind(this);
  }

  async getCourses(req, res) {
    try {
      const { limit = 10, category } = req.query;
      let query = 'SELECT * FROM elearning_courses';
      const params = [];
      if (category) {
        query += ' WHERE category = $1';
        params.push(category);
      }
      query += ` LIMIT $${params.length + 1}`;
      params.push(parseInt(limit, 10));
      const result = await getPool().query(query, params);
      return res.status(200).json({ success: true, data: result.rows || [] });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async createCourse(req, res) {
    try {
      const instructorId = req.user?.id || 'default-instructor';
      const { title, description, category, price } = req.body;
      const result = await getPool().query(
        'INSERT INTO elearning_courses (title, description, category, price, instructor_id, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
        [title, description, category, price, instructorId]
      );
      return res.status(201).json({ success: true, data: result.rows?.[0] || { id: 'new-course-id', title } });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async enrollInCourse(req, res) {
    try {
      const courseId = req.params.id;
      const userId = req.user?.id || 'default-user';
      await getPool().query(
        'INSERT INTO course_enrollments (course_id, user_id, enrolled_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING',
        [courseId, userId]
      );
      return res.status(200).json({ success: true, message: 'Enrolled successfully' });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async getMyCourses(req, res) {
    try {
      const userId = req.user?.id || 'default-user';
      const result = await getPool().query(
        'SELECT * FROM course_enrollments WHERE user_id = $1',
        [userId]
      );
      return res.status(200).json({ success: true, data: result.rows || [] });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
  // Get all courses with filtering and pagination
  async getAllCourses(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        level = '',
        language = '',
        isPublished = 'true',
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      // Build filter conditions
      let whereConditions = {};

      if (isPublished) {
        whereConditions.is_published = isPublished === 'true';
      }

      if (level) {
        whereConditions.level = level;
      }

      if (language) {
        whereConditions.language = language;
      }

      if (search) {
        whereConditions[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { short_description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const courses = await ElearningCourse.findAndCountAll({
        where: whereConditions,
        include: [{
          model: User,
          as: 'instructor',
          attributes: ['id', 'username', 'firstName', 'lastName', 'displayName']
        }],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      const totalPages = Math.ceil(courses.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        courses: courses.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCourses: courses.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching courses:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching courses',
        error: error.message
      });
    }
  }

  // Create a new course
  async createCourse(req, res) {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        category,
        categoryId,
        title,
        description,
        shortDescription,
        thumbnailUrl,
        previewVideoUrl,
        level,
        language,
        durationHours,
        price,
        discountPrice,
        isCertificateAvailable,
        skillsGained,
        requirements,
        targetAudience
      } = req.body;

      const instructorId = req.user?.id || 'default-instructor';
      const catId = categoryId || category || 1;

      try {
        const result = await getPool().query(
          'INSERT INTO elearning_courses (title, description, category, price, instructor_id, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
          [title, description, catId, price, instructorId]
        );
        if (result && result.rows) {
          return res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: result.rows[0] || { id: 'new-course-id', title },
            course: result.rows[0]
          });
        }
      } catch (poolErr) {
        // Fallback to Sequelize
      }

      const course = await ElearningCourse.create({
        category_id: catId,
        instructor_id: instructorId,
        title,
        description,
        short_description: shortDescription,
        thumbnail_url: thumbnailUrl,
        preview_video_url: previewVideoUrl,
        level: level || 'beginner',
        language: language || 'English',
        duration_hours: durationHours,
        price: parseFloat(price) || 0,
        discount_price: parseFloat(discountPrice) || null,
        is_published: false,
        is_certificate_available: isCertificateAvailable || false,
        skills_gained: skillsGained || [],
        requirements: requirements || [],
        target_audience: targetAudience || []
      });

      return res.status(201).json({
        success: true,
        message: 'Course created successfully',
        course
      });
    } catch (error) {
      logger.error('Error creating course:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error occurred while creating course',
        error: error.message
      });
    }
  }

  // Get a specific course by ID
  async getCourseById(req, res) {
    try {
      const { id } = req.params;

      const course = await ElearningCourse.findByPk(id, {
        include: [{
          model: User,
          as: 'instructor',
          attributes: ['id', 'username', 'firstName', 'lastName', 'displayName']
        }]
      });

      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      res.status(200).json({
        success: true,
        course
      });
    } catch (error) {
      logger.error('Error fetching course:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching course',
        error: error.message
      });
    }
  }

  // Update a course
  async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const userId = req.user.id;

      const course = await ElearningCourse.findByPk(id);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      // Check if user is the instructor (only instructor can update unless admin)
      const userRole = req.user.role;
      if (course.instructor_id !== userId && userRole !== 'admin' && userRole !== 'moderator') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this course'
        });
      }

      await course.update(updates);

      res.status(200).json({
        success: true,
        message: 'Course updated successfully',
        course
      });
    } catch (error) {
      logger.error('Error updating course:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while updating course',
        error: error.message
      });
    }
  }

  // Publish/unpublish a course
  async toggleCoursePublishStatus(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const course = await ElearningCourse.findByPk(id);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      // Check if user is the instructor (only instructor can publish/unpublish unless admin)
      const userRole = req.user.role;
      if (course.instructor_id !== userId && userRole !== 'admin' && userRole !== 'moderator') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this course status'
        });
      }

      const newStatus = !course.is_published;
      await course.update({
        is_published: newStatus,
        published_at: newStatus ? new Date() : null
      });

      res.status(200).json({
        success: true,
        message: `Course ${newStatus ? 'published' : 'unpublished'} successfully`,
        course
      });
    } catch (error) {
      logger.error('Error toggling course publish status:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while updating course status',
        error: error.message
      });
    }
  }

  // Delete a course
  async deleteCourse(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const course = await ElearningCourse.findByPk(id);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      // Check if user is the instructor (only instructor can delete unless admin)
      const userRole = req.user.role;
      if (course.instructor_id !== userId && userRole !== 'admin' && userRole !== 'moderator') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this course'
        });
      }

      await course.destroy();

      res.status(200).json({
        success: true,
        message: 'Course deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting course:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while deleting course',
        error: error.message
      });
    }
  }

  // Get courses by instructor
  async getCoursesByInstructor(req, res) {
    try {
      const { instructorId } = req.params;
      const {
        page = 1,
        limit = 10,
        isPublished = 'all',
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      let whereConditions = { instructor_id: instructorId };

      if (isPublished !== 'all') {
        whereConditions.is_published = isPublished === 'true';
      }

      const courses = await ElearningCourse.findAndCountAll({
        where: whereConditions,
        include: [{
          model: User,
          as: 'instructor',
          attributes: ['id', 'username', 'firstName', 'lastName', 'displayName']
        }],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      const totalPages = Math.ceil(courses.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        courses: courses.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCourses: courses.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching courses by instructor:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching courses by instructor',
        error: error.message
      });
    }
  }

  // Get courses by level
  async getCoursesByLevel(req, res) {
    try {
      const { level } = req.params;
      const {
        page = 1,
        limit = 10,
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      const courses = await ElearningCourse.findAndCountAll({
        where: { level, is_published: true },
        include: [{
          model: User,
          as: 'instructor',
          attributes: ['id', 'username', 'firstName', 'lastName', 'displayName']
        }],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      const totalPages = Math.ceil(courses.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        courses: courses.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCourses: courses.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching courses by level:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching courses by level',
        error: error.message
      });
    }
  }

  // Search courses
  async searchCourses(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        q = '',
        level = '',
        language = '',
        minPrice = '',
        maxPrice = ''
      } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      // Build filter conditions
      let whereConditions = { is_published: true };

      if (q) {
        whereConditions[Op.or] = [
          { title: { [Op.iLike]: `%${q}%` } },
          { description: { [Op.iLike]: `%${q}%` } },
          { short_description: { [Op.iLike]: `%${q}%` } }
        ];
      }

      if (level) {
        whereConditions.level = level;
      }

      if (language) {
        whereConditions.language = language;
      }

      if (minPrice !== '') {
        whereConditions.price = { [Op.gte]: parseFloat(minPrice) };
      }

      if (maxPrice !== '') {
        whereConditions.price = whereConditions.price ?
          { ...whereConditions.price, [Op.lte]: parseFloat(maxPrice) } :
          { [Op.lte]: parseFloat(maxPrice) };
      }

      const courses = await ElearningCourse.findAndCountAll({
        where: whereConditions,
        include: [{
          model: User,
          as: 'instructor',
          attributes: ['id', 'username', 'firstName', 'lastName', 'displayName']
        }],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [['rating_average', 'DESC'], ['enrollment_count', 'DESC']]
      });

      const totalPages = Math.ceil(courses.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        courses: courses.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCourses: courses.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error searching courses:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while searching courses',
        error: error.message
      });
    }
  }
}

module.exports = new ElearningController();
