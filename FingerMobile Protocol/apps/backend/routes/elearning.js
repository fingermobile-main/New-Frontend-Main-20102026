const express = require('express');
const router = express.Router();
const ElearningController = require('../controllers/elearningController');
const authenticate = require('../middleware/authenticate');
const { body, param, query } = require('express-validator');

// GET /api/elearning/courses - Get all courses with filtering and pagination
router.get('/courses', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim().escape(),
  query('level').optional().isIn(['beginner', 'intermediate', 'advanced', 'expert']).withMessage('Invalid level'),
  query('language').optional().trim().escape(),
  query('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
  query('sortBy').optional().isIn(['created_at', 'rating_average', 'enrollment_count', 'price']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['ASC', 'DESC']).withMessage('Sort order must be ASC or DESC')
], ElearningController.getAllCourses);

// POST /api/elearning/courses - Create a new course
router.post('/courses', authenticate, [
  body('categoryId').isInt().withMessage('Category ID must be an integer'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('level').optional().isIn(['beginner', 'intermediate', 'advanced', 'expert']).withMessage('Invalid level'),
  body('language').optional().trim().escape(),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number')
], ElearningController.createCourse);

// GET /api/elearning/courses/:id - Get a specific course by ID
router.get('/courses/:id', [
  param('id').isInt().withMessage('Course ID must be an integer')
], ElearningController.getCourseById);

// PUT /api/elearning/courses/:id - Update a course
router.put('/courses/:id', authenticate, [
  param('id').isInt().withMessage('Course ID must be an integer'),
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number')
], ElearningController.updateCourse);

// PATCH /api/elearning/courses/:id/publish - Toggle course publish status
router.patch('/courses/:id/publish', authenticate, [
  param('id').isInt().withMessage('Course ID must be an integer')
], ElearningController.toggleCoursePublishStatus);

// DELETE /api/elearning/courses/:id - Delete a course
router.delete('/courses/:id', authenticate, [
  param('id').isInt().withMessage('Course ID must be an integer')
], ElearningController.deleteCourse);

// GET /api/elearning/courses/instructor/:instructorId - Get courses by instructor
router.get('/courses/instructor/:instructorId', [
  param('instructorId').isInt().withMessage('Instructor ID must be an integer'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('isPublished').optional().isIn(['true', 'false', 'all']).withMessage('Invalid isPublished value')
], ElearningController.getCoursesByInstructor);

// GET /api/elearning/courses/level/:level - Get courses by level
router.get('/courses/level/:level', [
  param('level').isIn(['beginner', 'intermediate', 'advanced', 'expert']).withMessage('Invalid level'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], ElearningController.getCoursesByLevel);

// GET /api/elearning/courses/search - Search courses
router.get('/courses/search', [
  query('q').notEmpty().withMessage('Search query is invalid').trim().escape(),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('level').optional().isIn(['beginner', 'intermediate', 'advanced', 'expert']).withMessage('Invalid level'),
  query('language').optional().trim().escape(),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Minimum price must be a non-negative number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Maximum price must be a non-negative number')
], ElearningController.searchCourses);

module.exports = router;
