/*
 * FingerMobile Protocol™ - Content Manager Routes
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

const express = require('express');
const router = express.Router();
const contentManagerController = require('../controllers/contentManagerController');
const authMiddleware = require('../middleware/authMiddleware');

// Comments Management
router.get('/comments/:userId', authMiddleware.requireAuth, contentManagerController.getComments);
router.get('/comments/:userId/unresponded', authMiddleware.requireAuth, contentManagerController.getUnrespondedComments);
router.put('/comments/respond/:commentId', authMiddleware.requireAuth, contentManagerController.respondToComment);

// Mentions Management
router.get('/mentions/:userId', authMiddleware.requireAuth, contentManagerController.getMentions);

// Follows Management
router.get('/follows/:userId', authMiddleware.requireAuth, contentManagerController.getFollows);

// Moderation Assist
router.get('/moderation-assist/:userId', authMiddleware.requireAuth, contentManagerController.getModerationAssist);
router.post('/moderate', authMiddleware.requireAuth, contentManagerController.moderateContent);

// Activity Log
router.get('/activity-log/:userId', authMiddleware.requireAuth, contentManagerController.getActivityLog);

module.exports = router;