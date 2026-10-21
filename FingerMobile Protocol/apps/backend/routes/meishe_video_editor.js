/* eslint-disable no-unused-vars */
const { monetizationDb } = require('../db');
const logger = require('../utils/logger');
const MeisheVideoEditorService = require('../services/meishe_video_editor_service');

const createProject = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { title, description, initialMediaPath } = req.body;

    const project = await MeisheVideoEditorService.createProject(
      memberId,
      title || 'Untitled Project',
      description || '',
      initialMediaPath,
    );

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const applyBeautyEffect = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId } = req.params;
    const { beautyType, params } = req.body;

    // Verify the project belongs to the member
    const projectResult = await monetizationDb.query(
      'SELECT id FROM video_projects WHERE id = $1 AND member_id = $2',
      [projectId, memberId],
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        success: false, message: 'Project not found or does not belong to member'
      });
    }

    const project = await MeisheVideoEditorService.applyBeautyEffect(
      projectId,
      beautyType,
      params || {}
    );

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const applyAREffect = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId } = req.params;
    const { arEffectType, params } = req.body;

    // Verify the project belongs to the member
    const projectResult = await monetizationDb.query(
      'SELECT id FROM video_projects WHERE id = $1 AND member_id = $2',
      [projectId, memberId],
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        success: false, message: 'Project not found or does not belong to member'
      });
    }

    const project = await MeisheVideoEditorService.applyAREffect(
      projectId,
      arEffectType,
      params || {}
    );

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const applyAIFeature = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId } = req.params;
    const { featureType, params } = req.body;

    // Verify the project belongs to the member
    const projectResult = await monetizationDb.query(
      'SELECT id FROM video_projects WHERE id = $1 AND member_id = $2',
      [projectId, memberId],
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        success: false, message: 'Project not found or does not belong to member'
      });
    }

    const project = await MeisheVideoEditorService.applyAIFeature(
      projectId,
      featureType,
      params || {}
    );

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const applyTemplate = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId } = req.params;
    const { templateId, customizations } = req.body;

    // Verify the project belongs to the member
    const projectResult = await monetizationDb.query(
      'SELECT id FROM video_projects WHERE id = $1 AND member_id = $2',
      [projectId, memberId],
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        success: false, message: 'Project not found or does not belong to member'
      });
    }

    const project = await MeisheVideoEditorService.applyTemplate(
      projectId,
      templateId,
      customizations || {}
    );

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getTemplates = async (req, res) => {
  try {
    const { category, limit = 20, offset = 0 } = req.query;

    const templates = await MeisheVideoEditorService.getTemplates(
      category || null,
      parseInt(limit),
      parseInt(offset),
    );

    res.status(200).json({
      success: true,
      templates,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: templates.length
      }
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getFilters = async (req, res) => {
  try {
    const filters = await MeisheVideoEditorService.getFilters();

    res.status(200).json({
      success: true,
      filters
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getStickers = async (req, res) => {
  try {
    const { category } = req.query;

    const stickers = await MeisheVideoEditorService.getStickers(
      category || null,
    );

    res.status(200).json({
      success: true,
      stickers
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const renderProject = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId } = req.params;
    const exportOptions = req.body;

    // Verify the project belongs to the member
    const projectResult = await monetizationDb.query(
      'SELECT id FROM video_projects WHERE id = $1 AND member_id = $2',
      [projectId, memberId],
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        success: false, message: 'Project not found or does not belong to member'
      });
    }

    const result = await MeisheVideoEditorService.renderProject(
      projectId,
      exportOptions,
    );

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getProject = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId } = req.params;

    const project = await MeisheVideoEditorService.getProject(projectId);

    // Verify the project belongs to the member
    if (project.member_id !== memberId) {
      return res.status(404).json({
        success: false, message: 'Project not found or does not belong to member'
      });
    }

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getProjectsForMember = async (req, res) => {
  try {
    const memberId = req.member.id;

    const projects =
      await MeisheVideoEditorService.getProjectsForMember(memberId);

    res.status(200).json({
      success: true,
      projects
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createProject,
  applyBeautyEffect,
  applyAREffect,
  applyAIFeature,
  applyTemplate,
  getTemplates,
  getFilters,
  getStickers,
  renderProject,
  getProject,
  getProjectsForMember
};
const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { authenticate } = require('../middleware/authenticate');
const meisheController = require('../controllers/MeisheVideoEditorController');

const router = express.Router();


// Create a new video project with MeisheSDK
router.post('/projects', authenticate, meisheController.createProject);

// Apply beauty effect using MeisheSDK
router.post('/projects/:projectId/beauty', authenticate, meisheController.applyBeautyEffect);

// Apply AR effect using MeisheSDK
router.post('/projects/:projectId/ar-effects', authenticate, meisheController.applyAREffect);

// Apply AI-powered feature using MeisheSDK
router.post('/projects/:projectId/ai-features', authenticate, meisheController.applyAIFeature);

// Apply template using MeisheSDK
router.post('/projects/:projectId/templates', authenticate, meisheController.applyTemplate);

// Get available templates from MeisheSDK
router.get('/templates', authenticate, meisheController.getTemplates);

// Get available filters from MeisheSDK
router.get('/filters', authenticate, meisheController.getFilters);

// Get available stickers from MeisheSDK
router.get('/stickers', authenticate, meisheController.getStickers);

// Render a project using MeisheSDK
router.post('/projects/:projectId/render', authenticate, meisheController.renderProject);

// Get a project
router.get('/projects/:projectId', authenticate, meisheController.getProject);

// Get all projects for a member
router.get('/projects', authenticate, meisheController.getProjectsForMember);

module.exports = router;
