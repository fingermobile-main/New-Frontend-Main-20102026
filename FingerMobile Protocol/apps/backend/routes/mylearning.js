const express = require('express');
const router = express.Router();
const mylearning = require('../controllers/mylearningController.js');
const authenticate = require('../middleware/authenticate');

// Learning Dashboard & Stats
router.get('/dashboard', authenticate, (req, res) => mylearning.getDashboard(req, res));
router.get('/stats', authenticate, (req, res) => mylearning.getStats(req, res));
router.get('/recommendations', authenticate, (req, res) => mylearning.getRecommendations(req, res));

// Course Enrollments & Progress
router.get('/courses', authenticate, (req, res) => mylearning.getEnrolledCourses(req, res));
router.post('/courses/:courseId/enroll', authenticate, (req, res) => mylearning.enrollCourse(req, res));
router.post('/progress', authenticate, (req, res) => mylearning.updateProgress(req, res));
router.post('/activities', authenticate, (req, res) => mylearning.recordActivity(req, res));

// Legacy / alias routes
router.get('/students/:studentId/courses', authenticate, (req, res) => mylearning.getEnrolledCourses(req, res));

module.exports = router;
