const express = require('express');
const router = express.Router();
const nysc = require('../controllers/nyscController.js');
const authenticate = require('../middleware/authenticate');

// Programs & Courses
router.get('/programs', (req, res) => nysc.getPrograms(req, res));
router.get('/courses', (req, res) => nysc.getCourses(req, res));

// Public stats & events
router.get('/stats', (req, res) => nysc.getStats(req, res));
router.get('/events', (req, res) => nysc.getEvents(req, res));
router.post('/events', authenticate, (req, res) => nysc.createEvent(req, res));

// Discussions
router.get('/discussions', (req, res) => nysc.getDiscussions(req, res));
router.post('/discussions', authenticate, (req, res) => nysc.createDiscussion(req, res));

// Members & registration
router.get('/members', (req, res) => nysc.getMembers(req, res));
router.post('/registration', (req, res) => nysc.registerMember(req, res));
router.post('/register', (req, res) => nysc.registerMember(req, res));

// PPA & Allowances
router.post('/ppa/:id/update', authenticate, (req, res) => nysc.updatePPA(req, res));
router.get('/allowances', authenticate, (req, res) => nysc.getAllowances(req, res));

// Legacy / compatibility routes
router.get('/batches', (req, res) => nysc.getMembers(req, res));
router.get('/batches/:batchId', (req, res) => nysc.getMembers(req, res));
router.get('/batches/:batchId/corpers', (req, res) => nysc.getMembers(req, res));
router.get('/corpers/:corperId', (req, res) => nysc.getMembers(req, res));
router.get('/state/:stateCode', (req, res) => nysc.getMembers(req, res));

module.exports = router;
