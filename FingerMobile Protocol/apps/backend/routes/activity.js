/* eslint-disable no-unused-vars */
const express = require('express');
const activity = require('../controllers/activityController.js');
const { authenticate } = require('../middleware/authenticate');
const { socialDb } = require('../db');
const router = express.Router();

router.get('/', authenticate, activity.getAll);
router.get('/own', authenticate, activity.getAll);
router.get('/member/:memberId', authenticate, activity.getAll); // stub fallback
router.post('/', authenticate, activity.create);
router.get('/types/:activityType', activity.getAll); // stub fallback
router.get('/content/:contentId', activity.getAll); // stub fallback
router.get('/recent/:days?', authenticate, activity.getAll); // stub fallback
router.get('/stats/:memberId', activity.getStats);
router.delete('/:activityId', authenticate, activity.getAll); // stub fallback

module.exports = router;
