const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const courseContentController = require('../controllers/CourseContentController');

/**
 * Course Content Routes
 * E-learning content management system
 */

// Public routes
router.get('/', courseContentController.getAll);
router.get('/categories', courseContentController.getCategories);
router.get('/:id', courseContentController.getById);

// Protected routes - Student
router.get('/my-courses', authenticate, courseContentController.getMyCourses);
router.post('/:id/enroll', authenticate, courseContentController.enroll);
router.get('/:courseId/progress', authenticate, courseContentController.getProgress);
router.put('/lessons/:lessonId/complete', authenticate, courseContentController.completeLesson);
router.post('/:id/review', authenticate, courseContentController.createReview);

// Protected routes - Instructor
router.post('/', authenticate, courseContentController.create);
router.put('/:id', authenticate, courseContentController.update);
router.delete('/:id', authenticate, courseContentController.delete);

module.exports = router;
