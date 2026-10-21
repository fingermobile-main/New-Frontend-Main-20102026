/* eslint-disable no-undef */
const logger = require('../../utils/logger');
const EditorService = require('../services/editorService');

class EditorController {
  // Create project
  static async createProject(req, res) {
    try {
      const { name, description, projectType, theme } = req.body;
      const memberId = req.user?.id || req.member?.id;

      const project = await EditorService.createProject(memberId, {
        name,
        description,
        projectType,
        theme
      });

      res.status(201).json({success: true,
        message: 'Project created successfully',
        data: project
      });
    } catch (error) {
      logger.error('Error creating project:', error);
      res.status(500).json({ success: false, message: 'Failed to create project', error: error.message });
    }
  }

  // Get member projects
  static async getMemberProjects(req, res) {
    try {
      const memberId = req.user?.id || req.member?.id;
      const projects = await EditorService.getMemberProjects(memberId);

      res.status(200).json({success: true,
        message: 'Projects retrieved successfully',
        data: projects
      });
    } catch (error) {
      logger.error('Error getting, projects:', error);
      res.status(500).json({success: false,
        message: 'Failed to retrieve projects',
        error: error.message
      });
    }
  }

  // Create page
  static async createPage(req, res) {
    try {
      const { projectId } = req.params;
      const { title, slug, content, metaData } = req.body;

      const page = await EditorService.createPage(projectId, {
        title,
        slug,
        content,
        metaData
      });

      res.status(201).json({success: true,
        message: 'Page created successfully',
        data: page
      });
    } catch (error) {
      logger.error('Error creating, page:', error);
      res.status(500).json({success: false,
        message: 'Failed to create page',
        error: error.message
      });
    }
  }

  // Get project pages
  static async getProjectPages(req, res) {
    try {
      const { projectId } = req.params;
      const pages = await EditorService.getProjectPages(projectId);

      res.status(200).json({success: true,
        message: 'Pages retrieved successfully',
        data: pages
      });
    } catch (error) {
      logger.error('Error getting, pages:', error);
      res.status(500).json({success: false,
        message: 'Failed to retrieve pages',
        error: error.message
      });
    }
  }

  // Save page content
  static async savePageContent(req, res) {
    try {
      const { pageId } = req.params;
      const { content } = req.body;

      const page = await EditorService.savePageContent(pageId, content);

      res.status(200).json({success: true,
        message: 'Page content saved successfully',
        data: page
      });
    } catch (error) {
      logger.error('Error saving page, content:', error);
      res.status(500).json({success: false,
        message: 'Failed to save page content',
        error: error.message
      });
    }
  }

  // Get available components
  static async getAvailableComponents(req, res) {
    try {
      const components = await EditorService.getAvailableComponents();

      res.status(200).json({success: true,
        message: 'Components retrieved successfully',
        data: components
      });
    } catch (error) {
      logger.error('Error getting, components:', error);
      res.status(500).json({success: false,
        message: 'Failed to retrieve components',
        error: error.message
      });
    }
  }

  // Get Editor
  static async getEditor(req, res) {
    try {
      res.status(200).json({success: true,
        message: 'Editor data retrieved successfully',
        data: {}
      });
    } catch (error) {
      logger.error('Error getting, editor:', error);
      res.status(500).json({success: false,
        message: 'Failed to retrieve editor data',
        error: error.message
      });
    }
  }

  // Create component instance
  static async createComponentInstance(req, res) {
    try {
      const { pageId } = req.params;
      const { componentId, instanceProps, positionData } = req.body;

      const componentInstance = await EditorService.createComponentInstance(
        pageId,
        componentId,
        instanceProps,
        positionData,
      );

      res.status(201).json({success: true,
        message: 'Component instance created successfully',
        data: componentInstance
      });
    } catch (error) {
      logger.error('Error creating component, instance:', error);
      res.status(500).json({success: false,
        message: 'Failed to create component instance',
        error: error.message
      });
    }
  }

  // Get page components
  static async getPageComponents(req, res) {
    try {
      const { pageId } = req.params;
      const components = await EditorService.getPageComponents(pageId);

      res.status(200).json({success: true,
        message: 'Page components retrieved successfully',
        data: components
      });
    } catch (error) {
      logger.error('Error getting page, components:', error);
      res.status(500).json({success: false,
        message: 'Failed to retrieve page components',
        error: error.message
      });
    }
  }
  // Save project
  static async saveProject(req, res) {
    try {
      const { projectId } = req.params;
      const { name, description, projectType, theme } = req.body;
      const memberId = req.member.id;

      const project = await EditorService.saveProject(memberId, projectId, {
        name,
        description,
        projectType,
        theme
      });

      res.status(200).json({success: true,
        message: 'Project saved successfully',
        data: project
      });
    } catch (error) {
      logger.error('Error saving, project:', error);
      res.status(500).json({success: false,
        message: 'Failed to save project',
        error: error.message
      });
    }
  }

  // Delete project
  static async deleteProject(req, res) {
    try {
      const { projectId } = req.params;
      const memberId = req.member.id;

      await EditorService.deleteProject(memberId, projectId);

      res.status(200).json({success: true,
        message: 'Project deleted successfully',
        data: null
      });
    } catch (error) {
      logger.error('Error deleting, project:', error);
      res.status(500).json({success: false,
        message: 'Failed to delete project',
        error: error.message
      });
    }
  }
}

async function getStatus(req, res) {
  logger.info('getStatus function called');
  try {
    const status = await EditorService.getStatus();
    res.status(200).json({success: true,
      message: 'Editor status retrieved successfully',
      data: status
    });
  } catch (error) {
    logger.error('Error getting editor, status:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve editor status',
      error: error.message
    });
  }
}
logger.info('getStatus before, export:', typeof getStatus);
module.exports = { EditorController, getStatus };
