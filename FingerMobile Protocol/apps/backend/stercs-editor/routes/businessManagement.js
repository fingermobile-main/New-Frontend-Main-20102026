const logger = require('../../utils/logger');
const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/authenticate');
const BusinessManagementService = require('../services/businessManagementService');

// Apply admin authentication to all business management routes
router.use(requireAdmin);

// Create a new business project
router.post('/projects', async (req, res) => {
  try {
    const memberId = req.member.id;
    const projectData = req.body;

    if (!projectData.name || !projectData.industry) {
      return res.status(400).json({success: false,
        message: 'Name and industry are required for business project'
      });
    }

    const result = await BusinessManagementService.createBusinessProject(
      memberId,
      projectData,
    );

    res.status(201).json({success: true,
      message: result.message,
      data: result.project
    });
  } catch (error) {
    logger.error('Error creating business, project:', error);
    res.status(500).json({success: false,
      message: 'Failed to create business project',
      error: error.message
    });
  }
});

// Get all business projects for a member
router.get('/projects', async (req, res) => {
  try {
    const memberId = req.member.id;

    const result =
      await BusinessManagementService.getBusinessProjects(memberId);

    res.status(200).json({success: true,
      message: result.message,
      data: result.projects
    });
  } catch (error) {
    logger.error('Error getting business, projects:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve business projects',
      error: error.message
    });
  }
});

// Update a business project
router.put('/projects/:projectId', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId } = req.params;
    const projectData = req.body;

    const result = await BusinessManagementService.updateBusinessProject(
      memberId,
      projectId,
      projectData,
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.project
    });
  } catch (error) {
    logger.error('Error updating business, project:', error);
    res.status(500).json({success: false,
      message: 'Failed to update business project',
      error: error.message
    });
  }
});

// Delete a business project
router.delete('/projects/:projectId', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId } = req.params;

    const result = await BusinessManagementService.deleteBusinessProject(
      memberId,
      projectId,
    );

    res.status(200).json({success: true,
      message: result.message
    });
  } catch (error) {
    logger.error('Error deleting business, project:', error);
    res.status(500).json({success: false,
      message: 'Failed to delete business project',
      error: error.message
    });
  }
});

// Create a business goal
router.post('/projects/:projectId/goals', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId } = req.params;
    const goalData = req.body;

    if (!goalData.title) {
      return res.status(400).json({success: false,
        message: 'Title is required for business goal'
      });
    }

    const result = await BusinessManagementService.createBusinessGoal(
      memberId,
      projectId,
      goalData,
    );

    res.status(201).json({success: true,
      message: result.message,
      data: result.goal
    });
  } catch (error) {
    logger.error('Error creating business, goal:', error);
    res.status(500).json({success: false,
      message: 'Failed to create business goal',
      error: error.message
    });
  }
});

// Get business goals for a project
router.get('/projects/:projectId/goals', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId } = req.params;

    const result = await BusinessManagementService.getBusinessGoals(
      memberId,
      projectId,
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.goals
    });
  } catch (error) {
    logger.error('Error getting business, goals:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve business goals',
      error: error.message
    });
  }
});

// Create a business milestone
router.post('/goals/:goalId/milestones', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { goalId } = req.params;
    const milestoneData = req.body;

    if (!milestoneData.title) {
      return res.status(400).json({success: false,
        message: 'Title is required for business milestone'
      });
    }

    const result = await BusinessManagementService.createBusinessMilestone(
      memberId,
      goalId,
      milestoneData,
    );

    res.status(201).json({success: true,
      message: result.message,
      data: result.milestone
    });
  } catch (error) {
    logger.error('Error creating business, milestone:', error);
    res.status(500).json({success: false,
      message: 'Failed to create business milestone',
      error: error.message
    });
  }
});

// Get business milestones for a goal
router.get('/goals/:goalId/milestones', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { goalId } = req.params;

    const result = await BusinessManagementService.getBusinessMilestones(
      memberId,
      goalId,
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.milestones
    });
  } catch (error) {
    logger.error('Error getting business, milestones:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve business milestones',
      error: error.message
    });
  }
});

// Update milestone status
router.put('/milestones/:milestoneId/status', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { milestoneId } = req.params;
    const { completed } = req.body;

    if (completed === undefined) {
      return res.status(400).json({success: false,
        message: 'Completed status is required'
      });
    }

    const result = await BusinessManagementService.updateMilestoneStatus(
      memberId,
      milestoneId,
      completed,
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.milestone
    });
  } catch (error) {
    logger.error('Error updating milestone, status:', error);
    res.status(500).json({success: false,
      message: 'Failed to update milestone status',
      error: error.message
    });
  }
});

module.exports = router;
