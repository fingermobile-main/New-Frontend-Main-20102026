const express = require('express');
const video_editor = require('../controllers/video_editorController.js');
const { authenticate } = require('../middleware/authenticate');
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { monetizationDb } = require("../db");
const VideoAssetService = require("../services/video_asset_service");
const VideoProcessingService = require("../services/video_processing_service");
const router = express.Router();

router.post("/upload", authenticate, video_editor.create);
router.post("/projects", video_editor.create);
router.get("/projects/:projectId", video_editor.getById);
router.get("/projects", video_editor.getAll);
router.put("/projects/:projectId", video_editor.update);
router.post("/projects/:projectId/save-draft", video_editor.create);
router.post("/projects/:projectId/schedule", video_editor.create);
router.post("/projects/:projectId/publish", video_editor.create);
router.delete("/projects/:projectId", video_editor.delete);
router.post("/jobs", video_editor.create);
router.get("/jobs/:jobId", video_editor.getById);
router.get("/projects/:projectId/jobs", video_editor.getById);
router.post("/jobs/:jobId/cancel", video_editor.create);

module.exports = router;