const logger = require('../../utils/logger');
const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/authenticate');
const ProjectManagementService = require('../services/projectManagementService');

// Apply admin authentication to all project management routes
router.use(requireAdmin);

// Create a new project
router.post('/projects', async (req, res) => {
  try {
    const memberId = req.member.id;
    const projectData = req.body;

    if (!projectData.name) {
      return res.status(400).json({success: false,
        message: 'Project name is required'
      });
    }

    const result = await ProjectManagementService.createProject(
      memberId,
      projectData,
    );

    res.status(201).json({success: true,
      message: result.message,
      data: result.project
    });
  } catch (error) {
    logger.error('Error creating, project:', error);
    res.status(500).json({success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
});

// Get projects for a member
router.get('/projects', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { status, priority, search, tag, limit } = req.query;

    const result = await ProjectManagementService.getProjects(memberId, {status: status || null,
      priority: priority || null,
      search: search || null,
      tag: tag || null,
      limit: limit ? parseInt(limit) : null
    });

    res.status(200).json({success: true,
      message: result.message,
      data: result.projects
    });
  } catch (error) {
    logger.error('Error getting, projects:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve projects',
      error: error.message
    });
  }
});

// Get project by ID
router.get('/projects/:projectId', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId } = req.params;

    const result = await ProjectManagementService.getProjectById(
      memberId,
      parseInt(projectId),
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.project
    });
  } catch (error) {
    logger.error('Error getting, project:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve project',
      error: error.message
    });
  }
});

// Update a project
router.put('/projects/:projectId', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId } = req.params;
    const projectData = req.body;

    const result = await ProjectManagementService.updateProject(
      memberId,
      parseInt(projectId),
      projectData,
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.project
    });
  } catch (error) {
    logger.error('Error updating, project:', error);
    res.status(500).json({success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
});

// Delete a project
router.delete('/projects/:projectId', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId } = req.params;

    const result = await ProjectManagementService.deleteProject(
      memberId,
      parseInt(projectId),
    );

    res.status(200).json({success: true,
      message: result.message
    });
  } catch (error) {
    logger.error('Error deleting, project:', error);
    res.status(500).json({success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
});

// Create a task within a project
router.post('/projects/:projectId/tasks', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId } = req.params;
    const taskData = req.body;

    if (!taskData.title) {
      return res.status(400).json({success: false,
        message: 'Task title is required'
      });
    }

    const result = await ProjectManagementService.createTask(
      memberId,
      parseInt(projectId),
      taskData,
    );

    res.status(201).json({success: true,
      message: result.message,
      data: result.task
    });
  } catch (error) {
    logger.error('Error creating, task:', error);
    res.status(500).json({success: false,
      message: 'Failed to create task',
      error: error.message
    });
  }
});

// Get tasks for a project
router.get('/projects/:projectId/tasks', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId } = req.params;
    const { status, priority, assigneeId, search, tag, limit } = req.query;

    const result = await ProjectManagementService.getTasks(
      memberId,
      parseInt(projectId),
      {status: status || null,
        priority: priority || null,
        assigneeId: assigneeId ? parseInt(assigneeId) : null,
        search: search || null,
        tag: tag || null,
        limit: limit ? parseInt(limit) : null
      },
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.tasks
    });
  } catch (error) {
    logger.error('Error getting, tasks:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve tasks',
      error: error.message
    });
  }
});

// Update a task
router.put('/tasks/:taskId', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { taskId } = req.params;
    const taskData = req.body;

    const result = await ProjectManagementService.updateTask(
      memberId,
      parseInt(taskId),
      taskData,
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.task
    });
  } catch (error) {
    logger.error('Error updating, task:', error);
    res.status(500).json({success: false,
      message: 'Failed to update task',
      error: error.message
    });
  }
});

// Get project statistics
router.get('/projects/:projectId/stats', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId } = req.params;

    const result = await ProjectManagementService.getProjectStats(
      memberId,
      parseInt(projectId),
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.stats
    });
  } catch (error) {
    logger.error('Error getting project, stats:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve project statistics',
      error: error.message
    });
  }
});

module.exports = router;
