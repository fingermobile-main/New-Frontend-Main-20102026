const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobsController');
const authenticate = require('../middleware/authenticate');

// Public listing and detail
router.get('/', (req, res) => jobsController.getAllJobs(req, res));
router.get('/applications/my', authenticate, (req, res) => jobsController.getMyApplications(req, res));
router.get('/:id', (req, res) => jobsController.getJobById(req, res));

// Authenticated job creation & application
router.post('/', authenticate, (req, res) => jobsController.createJob(req, res));
router.post('/:id/apply', authenticate, (req, res) => jobsController.applyForJob(req, res));

module.exports = router;
