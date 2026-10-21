const express = require('express');
const controller = require('../controllers/camusController');
const consoleUpload = require('../middleware/consoleUpload');
const router = express.Router();

// Academic Telemetry & Statistics
router.get('/telemetry', controller.getTelemetry);
router.get('/stats', controller.getStats);

// Courses Engine & Syllabuses
router.get('/courses', controller.getCourses);
router.get('/courses/:courseId', controller.getCourseById);
router.post('/courses', consoleUpload.single('thumbnail'), controller.createCourse);
router.put('/courses/:courseId', consoleUpload.single('thumbnail'), controller.updateCourse);
router.delete('/courses/:courseId', controller.deleteCourse);
router.get('/courses/:courseId/modules', controller.getCourseById);
router.get('/courses/:courseId/reviews', controller.getCourseById);

// Topics Camus Course Engine
router.get('/topics', controller.getTopics);
router.post('/topics', controller.createTopic);
router.get('/topics/:id', controller.getTopicById);
router.put('/topics/:id', controller.updateTopic);
router.delete('/topics/:id', controller.deleteTopic);

// Fresh Applicants & Admission Tracks
router.get('/applicants/tracks', controller.getApplicantTracks);
router.post('/applicants/apply', controller.applyApplicant);

// Students & Enrollments Engine
router.get('/enrollments', controller.getEnrollments);
router.post('/enrollments', controller.createEnrollment);
router.put('/enrollments/:enrollmentId/progress', controller.updateProgress);
router.post('/enrollments/progress', controller.updateProgress);

// Curated Open Educational Resources (OER) & SDKs
router.get('/resources/open-library', controller.getOpenResources);
router.get('/resources', controller.getOpenResources);

// Cryptographic Certificates & Permanence Ledger
router.post('/certificates/mint', controller.mintCertificate);
router.get('/certificates/:certificateId', controller.verifyCertificate);

// Preserved Philosophical Legacy Endpoints
router.get('/posts/topic/:topicId', controller.getPostsByTopic);
router.get('/posts/:id', controller.getPostById);
router.post('/posts', controller.createPost);
router.put('/posts/:id', controller.updatePost);
router.delete('/posts/:id', controller.deletePost);

module.exports = router;
