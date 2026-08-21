const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const gradingSystemController = require('../controllers/GradingSystemController');

/**
 * Grading System Routes
 * Manages grading systems, criteria, and assessments
 */

// Get all grading scales
router.get('/', authenticate, gradingSystemController.getGradingScales);

// Get grading scale by ID
router.get('/:id', authenticate, gradingSystemController.getGradingScaleById);

// Create new grading scale
router.post('/', authenticate, gradingSystemController.createGradingScale);

// Submit grade for student
router.post('/grades', authenticate, gradingSystemController.submitGrade);

// Update grade
router.put('/grades/:id', authenticate, gradingSystemController.updateGrade);

// Delete grade
router.delete('/grades/:id', authenticate, gradingSystemController.deleteGrade);

// Get student grades with GPA
router.get('/students/:studentId/grades', authenticate, gradingSystemController.getStudentGrades);

module.exports = router;
