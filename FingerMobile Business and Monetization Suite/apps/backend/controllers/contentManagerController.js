/*
 * FingerMobile Protocol™ - Content Manager Controller
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

const ContentManagerModel = require('../models/ContentManagerModel');
const ContentModel = require('../models/ContentModel');

exports.getComments = async (req, res) => {
  try {
    const { userId } = req.params;
    const { respondedStatus, sortBy } = req.query;
    
    // Verify user authorization
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Unauthorized access' });
    }
    
    const comments = await ContentManagerModel.getCommentsByUser(
      userId, 
      respondedStatus, 
      sortBy
    );
    
    res.json({ success: true, data: comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUnrespondedComments = async (req, res) => {
  try {
    const { userId } = req.params;
    const { sortBy } = req.query;
    
    // Verify user authorization
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Unauthorized access' });
    }
    
    const comments = await ContentManagerModel.getCommentsByUser(
      userId, 
      'unresponded', 
      sortBy
    );
    
    res.json({ success: true, data: comments });
  } catch (error) {
    console.error('Error fetching unresponded comments:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.respondToComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { responseText } = req.body;
    
    // Verify user authorization
    const comment = await ContentManagerModel.getCommentById(commentId);
    if (req.user.id !== comment.user_id && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Unauthorized access' });
    }
    
    const updatedComment = await ContentManagerModel.respondToComment(
      commentId, 
      responseText, 
      req.user.id
    );
    
    res.json({ success: true, data: updatedComment });
  } catch (error) {
    console.error('Error responding to comment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMentions = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user authorization
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Unauthorized access' });
    }
    
    const mentions = await ContentManagerModel.getMentions(userId);
    
    res.json({ success: true, data: mentions });
  } catch (error) {
    console.error('Error fetching mentions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getFollows = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user authorization
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Unauthorized access' });
    }
    
    const follows = await ContentManagerModel.getFollows(userId);
    
    res.json({ success: true, data: follows });
  } catch (error) {
    console.error('Error fetching follows:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getModerationAssist = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user authorization
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Unauthorized access' });
    }
    
    const pendingItems = await ContentManagerModel.getPendingItems(userId);
    
    // Apply AI moderation assist
    const aiModerationResults = await Promise.all(
      pendingItems.map(async (item) => {
        const moderationScore = await require('../services/aiModerationService')(item);
        return { ...item, aiModerationScore };
      })
    );
    
    res.json({ success: true, data: aiModerationResults });
  } catch (error) {
    console.error('Error in moderation assist:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.moderateContent = async (req, res) => {
  try {
    const { itemId, decision, moderatorNotes } = req.body;
    
    // Verify user authorization
    const item = await ContentManagerModel.getItemById(itemId);
    if (req.user.id !== item.user_id && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Unauthorized access' });
    }
    
    const updatedItem = await ContentManagerModel.updateModerationStatus(
      itemId, 
      decision, 
      req.user.id
    );
    
    // Log the moderation action
    await require('../services/activityLogger')({
      userId: req.user.id,
      action: 'moderate_content',
      targetId: itemId,
      metadata: { decision, notes: moderatorNotes }
    });
    
    res.json({ success: true, data: updatedItem });
  } catch (error) {
    console.error('Error moderating content:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getActivityLog = async (req, res) => {
  try {
    const { userId } = req.params;
    const { timeRange, activityType, criteria } = req.query;
    
    // Verify user authorization
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Unauthorized access' });
    }
    
    const activityLog = await ContentManagerModel.getActivityLog(
      userId, 
      timeRange, 
      activityType, 
      criteria
    );
    
    res.json({ success: true, data: activityLog });
  } catch (error) {
    console.error('Error fetching activity log:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};