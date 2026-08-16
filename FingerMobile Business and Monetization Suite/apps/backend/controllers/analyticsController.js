/*
 * FingerMobile Protocol™ - Analytics Controller
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

const AnalyticsModel = require('../models/AnalyticsModel');
const ContentModel = require('../models/ContentModel');

exports.getPublishedUGC = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user authorization
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Unauthorized access' });
    }
    
    const analytics = await AnalyticsModel.getPublishedUGC(userId);
    
    // Calculate derived metrics
    const processedAnalytics = analytics.map(item => ({
      ...item,
      engagement_rate: item.engagement_rate || (item.likes + item.comments + item.shares) / item.views * 100,
      net_follows: item.net_follows || (item.follows_received - item.follows_lost),
      average_watch_time: item.average_watch_time || item.watch_time_seconds / item.views,
    }));
    
    res.json({ success: true, data: processedAnalytics });
  } catch (error) {
    console.error('Error fetching published UGC:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getWatchSegments = async (req, res) => {
  try {
    const { contentId } = req.params;
    
    // Verify user authorization
    const content = await ContentModel.getContentById(contentId);
    if (req.user.id !== content.user_id && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Unauthorized access' });
    }
    
    const segments = await AnalyticsModel.getWatchSegments(contentId);
    
    // Process watch time segments
    const processedSegments = {
      '3-10s': segments.filter(s => s.start >= 3 && s.end <= 10).length,
      '10-30s': segments.filter(s => s.start >= 10 && s.end <= 30).length,
      '1-10m': segments.filter(s => s.duration >= 60 && s.duration <= 600).length,
    };
    
    res.json({ success: true, data: processedSegments });
  } catch (error) {
    console.error('Error fetching watch segments:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getDistributionMetrics = async (req, res) => {
  try {
    const { contentId } = req.params;
    
    // Verify user authorization
    const content = await ContentModel.getContentById(contentId);
    if (req.user.id !== content.user_id && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Unauthorized access' });
    }
    
    const distributionMetrics = await AnalyticsModel.getDistributionMetrics(contentId);
    
    res.json({ success: true, data: distributionMetrics });
  } catch (error) {
    console.error('Error fetching distribution metrics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getScheduledUGC = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user authorization
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Unauthorized access' });
    }
    
    const scheduledUGC = await AnalyticsModel.getScheduledUGC(userId);
    
    res.json({ success: true, data: scheduledUGC });
  } catch (error) {
    console.error('Error fetching scheduled UGC:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getDrafts = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user authorization
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Unauthorized access' });
    }
    
    const drafts = await AnalyticsModel.getDrafts(userId);
    
    res.json({ success: true, data: drafts });
  } catch (error) {
    console.error('Error fetching drafts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.exportToCSV = async (req, res) => {
  try {
    const { userId, dateRange, contentType } = req.body;
    
    // Verify user authorization
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Unauthorized access' });
    }
    
    const data = await AnalyticsModel.getExportData(userId, dateRange, contentType);
    const csvData = await require('../utils/csvExporter')(data);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=analytics_${Date.now()}.csv`);
    res.send(csvData);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.exportToPDF = async (req, res) => {
  try {
    const { userId, dateRange, contentType } = req.body;
    
    // Verify user authorization
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Unauthorized access' });
    }
    
    const data = await AnalyticsModel.getExportData(userId, dateRange, contentType);
    const pdfData = await require('../utils/pdfExporter')(data);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=analytics_${Date.now()}.pdf`);
    res.send(pdfData);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getLiveMetrics = async (req, res) => {
  try {
    const { contentId } = req.params;
    
    // Verify user authorization
    const content = await ContentModel.getContentById(contentId);
    if (req.user.id !== content.user_id && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Unauthorized access' });
    }
    
    const liveMetrics = await AnalyticsModel.getLiveMetrics(contentId);
    
    res.json({ success: true, data: liveMetrics });
  } catch (error) {
    console.error('Error fetching live metrics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};