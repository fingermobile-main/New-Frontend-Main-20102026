/*
 * FingerMobile Protocol™ - Content Routes
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const authMiddleware = require('../middleware/authMiddleware');

// Content Creation
router.post('/create', authMiddleware.requireAuth, contentController.createContent);
router.post('/bulk-upload', authMiddleware.requireAuth, contentController.bulkUpload);
router.post('/schedule', authMiddleware.requireAuth, contentController.scheduleContent);

// Content Library
router.get('/library/:userId', authMiddleware.requireAuth, contentController.getContentLibrary);
router.put('/library/:contentId', authMiddleware.requireAuth, contentController.updateLibraryItem);
router.delete('/library/:contentId', authMiddleware.requireAuth, contentController.deleteLibraryItem);

// Content Planner
router.get('/planner/:userId', authMiddleware.requireAuth, contentController.getContentPlanner);
router.post('/planner', authMiddleware.requireAuth, contentController.addPlannedContent);

// Filters
router.get('/filters/:userId', authMiddleware.requireAuth, contentController.getFilters);
router.post('/filters', authMiddleware.requireAuth, contentController.applyFilters);

module.exports = router;