/* eslint-disable no-unused-vars */
const express = require('express');
const mobile_video_editor = require('../controllers/mobile_video_editorController.js');
const { authenticate } = require('../middleware/authenticate');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { monetizationDb } = require('../db');
const MobileVideoEditorService = require('../services/mobile_video_editor_service');
const router = express.Router();

router.post('/projects', authenticate, mobile_video_editor.create);
router.post('/projects/:projectId/effects', mobile_video_editor.create);
router.post('/projects/:projectId/filters', mobile_video_editor.create);
router.post('/projects/:projectId/text', mobile_video_editor.create);
router.post('/projects/:projectId/stickers', mobile_video_editor.create);
router.post('/projects/:projectId/render', mobile_video_editor.create);
router.post('/projects/:projectId/export', mobile_video_editor.create);
router.get('/projects/:projectId', mobile_video_editor.getById);
router.get('/projects', mobile_video_editor.getAll);

module.exports = router;
