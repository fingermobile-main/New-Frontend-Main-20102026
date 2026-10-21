const express = require('express');
const router = express.Router();
const ExportController = require('../controllers/ExportController');
const { authenticate } = require('../middleware/authenticate');

// All routes require authentication
router.use(authenticate);

// Create export job
router.post('/', ExportController.createExport);

// List export jobs
router.get('/jobs', ExportController.listExportJobs);

// Get export job status
router.get('/jobs/:id', ExportController.getExportJob);

// Download export file
router.get('/download/:id', ExportController.downloadExport);

// Delete export job
router.delete('/jobs/:id', ExportController.deleteExportJob);

module.exports = router;
