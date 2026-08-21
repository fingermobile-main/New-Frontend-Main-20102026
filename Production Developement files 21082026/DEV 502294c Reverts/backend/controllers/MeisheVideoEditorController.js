/**
 * MeisheVideoEditorController.js
 * Controller for MeisheSDK video editor endpoints
 * Extracted from routes/meishe_video_editor.js inline handlers
 */

const { monetizationDb } = require("../db");
const logger = require('../utils/logger');
const MeisheVideoEditorService = require('../services/meishe_video_editor_service');

class MeisheVideoEditorController {
  /**
   * POST /api/meishe-video-editor/projects
   * Create a new video project with MeisheSDK
   */
  async createProject(req, res) {
    try {
      const memberId = req.member.id;
      const { title, description, initialMediaPath } = req.body;

      const project = await MeisheVideoEditorService.createProject(
        memberId, title || "Untitled Project", $5,
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
  }

  /**
   * POST /api/meishe-video-editor/projects/:projectId/beauty
   * Apply beauty effect using MeisheSDK
   */
  async applyBeautyEffect(req, res) {
    try {
      const memberId = req.member.id;
      const { projectId } = req.params;
      const { beautyType, params } = req.body;

      // Verify the project belongs to the member
      const projectResult = await monetizationDb.query(
        `SELECT id FROM video_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        return res.status(404).json({
          success: false, message: "Project not found or does not belong to member"
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
  }

  /**
   * POST /api/meishe-video-editor/projects/:projectId/ar-effects
   * Apply AR effect using MeisheSDK
   */
  async applyAREffect(req, res) {
    try {
      const memberId = req.member.id;
      const { projectId } = req.params;
      const { arEffectType, params } = req.body;

      // Verify the project belongs to the member
      const projectResult = await monetizationDb.query(
        `SELECT id FROM video_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        return res.status(404).json({
          success: false, message: "Project not found or does not belong to member"
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
  }

  /**
   * POST /api/meishe-video-editor/projects/:projectId/ai-features
   * Apply AI-powered feature using MeisheSDK
   */
  async applyAIFeature(req, res) {
    try {
      const memberId = req.member.id;
      const { projectId } = req.params;
      const { featureType, params } = req.body;

      // Verify the project belongs to the member
      const projectResult = await monetizationDb.query(
        `SELECT id FROM video_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        return res.status(404).json({
          success: false, message: "Project not found or does not belong to member"
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
  }

  /**
   * POST /api/meishe-video-editor/projects/:projectId/templates
   * Apply template using MeisheSDK
   */
  async applyTemplate(req, res) {
    try {
      const memberId = req.member.id;
      const { projectId } = req.params;
      const { templateId, customizations } = req.body;

      // Verify the project belongs to the member
      const projectResult = await monetizationDb.query(
        `SELECT id FROM video_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        return res.status(404).json({
          success: false, message: "Project not found or does not belong to member"
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
  }

  /**
   * GET /api/meishe-video-editor/templates
   * Get available templates from MeisheSDK
   */
  async getTemplates(req, res) {
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
  }

  /**
   * GET /api/meishe-video-editor/filters
   * Get available filters from MeisheSDK
   */
  async getFilters(req, res) {
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
  }

  /**
   * GET /api/meishe-video-editor/stickers
   * Get available stickers from MeisheSDK
   */
  async getStickers(req, res) {
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
  }

  /**
   * POST /api/meishe-video-editor/projects/:projectId/render
   * Render a project using MeisheSDK
   */
  async renderProject(req, res) {
    try {
      const memberId = req.member.id;
      const { projectId } = req.params;
      const exportOptions = req.body;

      // Verify the project belongs to the member
      const projectResult = await monetizationDb.query(
        `SELECT id FROM video_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        return res.status(404).json({
          success: false, message: "Project not found or does not belong to member"
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
  }

  /**
   * GET /api/meishe-video-editor/projects/:projectId
   * Get a project
   */
  async getProject(req, res) {
    try {
      const memberId = req.member.id;
      const { projectId } = req.params;

      const project = await MeisheVideoEditorService.getProject(projectId);

      // Verify the project belongs to the member
      if (project.member_id !== memberId) {
        return res.status(404).json({
          success: false, message: "Project not found or does not belong to member"
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
  }

  /**
   * GET /api/meishe-video-editor/projects
   * Get all projects for a member
   */
  async getProjectsForMember(req, res) {
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
  }
}

// Export as singleton instance
module.exports = new MeisheVideoEditorController();
