/*
 * FingerMobile Protocol™ - Content Controller
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

const ContentModel = require('../models/ContentModel');
const AnalyticsModel = require('../models/AnalyticsModel');

exports.createContent = async (req, res) => {
  try {
    const contentData = {
      ...req.body,
      user_id: req.user.id // Ensure content belongs to authenticated user
    };

    // Validate content type
    const validTypes = ['post', 'story', 'reel'];
    if (!validTypes.includes(contentData.content_type)) {
      return res.status(400).json({ success: false, error: 'Invalid content type' });
    }

    const content = await ContentModel.createContent(contentData);

    // Initialize analytics record for new content
    await AnalyticsModel.createOrUpdateAnalytics(
      content.id, 
      req.user.id, 
      {
        views: 0,
        unique_viewers: 0,
        engagement_rate: 0,
        net_follows: 0,
        impressions: 0,
        comments_count: 0,
        distribution_metrics: {},
        watch_time_seconds: 0,
        average_watch_time: 0,
        watch_time_segments: []
      }
    );

    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.scheduleContent = async (req, res) => {
  try {
    const scheduleData = {
      ...req.body,
      user_id: req.user.id // Ensure content belongs to authenticated user
    };

    const scheduledContent = await ContentModel.scheduleContent(scheduleData);

    res.json({ success: true, data: scheduledContent });
  } catch (error) {
    console.error('Error scheduling content:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getContentLibrary = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user authorization
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Unauthorized access' });
    }

    const library = await ContentModel.getContentLibrary(userId);

    res.json({ success: true, data: library });
  } catch (error) {
    console.error('Error fetching content library:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateLibraryItem = async (req, res) => {
  try {
    const { contentId } = req.params;
    const updateData = req.body;

    // Verify user authorization
    const libraryItem = await ContentModel.getLibraryItemById(contentId);
    if (req.user.id !== libraryItem.user_id && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Unauthorized access' });
    }

    const updatedItem = await ContentModel.updateLibraryItem(contentId, updateData);

    res.json({ success: true, data: updatedItem });
  } catch (error) {
    console.error('Error updating library item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteLibraryItem = async (req, res) => {
  try {
    const { contentId } = req.params;

    // Verify user authorization
    const libraryItem = await ContentModel.getLibraryItemById(contentId);
    if (req.user.id !== libraryItem.user_id && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Unauthorized access' });
    }

    const deletedItem = await ContentModel.deleteLibraryItem(contentId);

    res.json({ success: true, data: deletedItem });
  } catch (error) {
    console.error('Error deleting library item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getContentPlanner = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user authorization
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Unauthorized access' });
    }

    const planner = await ContentModel.getContentPlanner(userId);

    res.json({ success: true, data: planner });
  } catch (error) {
    console.error('Error fetching content planner:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.addPlannedContent = async (req, res) => {
  try {
    const plannedContent = {
      ...req.body,
      user_id: req.user.id // Ensure content belongs to authenticated user
    };

    const addedContent = await ContentModel.addPlannedContent(plannedContent);

    res.json({ success: true, data: addedContent });
  } catch (error) {
    console.error('Error adding planned content:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getFilters = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user authorization
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Unauthorized access' });
    }

    const filters = await ContentModel.getFilters(userId);

    res.json({ success: true, data: filters });
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.applyFilters = async (req, res) => {
  try {
    const filterData = {
      ...req.body,
      user_id: req.user.id // Ensure filters belong to authenticated user
    };

    const result = await ContentModel.applyFilters(filterData);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error applying filters:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.bulkUpload = async (req, res) => {
  try {
    const uploadData = {
      contents: req.body.contents,
      userId: req.user.id // Ensure upload belongs to authenticated user
    };

    // Validate content types
    const validTypes = ['post', 'story', 'reel'];
    for (const content of uploadData.contents) {
      if (!validTypes.includes(content.content_type)) {
        return res.status(400).json({ success: false, error: `Invalid content type: ${content.content_type}` });
      }
    }

    const results = await ContentModel.bulkUpload(uploadData);

    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error during bulk upload:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};