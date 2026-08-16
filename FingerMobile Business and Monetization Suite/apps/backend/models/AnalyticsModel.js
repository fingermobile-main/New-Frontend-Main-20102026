/*
 * FingerMobile Protocol™ - Analytics Model
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

const db = require('../config/database'); // Assuming a database connection

class AnalyticsModel {
  static async getPublishedUGC(userId) {
    const query = `
      SELECT 
        ca.id,
        ca.content_id,
        ca.views,
        ca.unique_viewers,
        ca.engagement_rate,
        ca.net_follows,
        ca.impressions,
        ca.comments_count,
        ca.distribution_metrics,
        ca.watch_time_seconds,
        ca.average_watch_time,
        ca.watch_time_segments,
        c.title,
        c.created_at
      FROM content_analytics ca
      JOIN content c ON ca.content_id = c.id
      WHERE c.user_id = $1 AND c.status = 'published'
      ORDER BY ca.created_at DESC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async getScheduledUGC(userId) {
    const query = `
      SELECT 
        sc.id,
        sc.content_type,
        sc.schedule_time,
        sc.status,
        sc.content_data,
        sc.translation_settings
      FROM scheduled_content sc
      WHERE sc.user_id = $1 AND sc.status IN ('scheduled', 'pending')
      ORDER BY sc.schedule_time ASC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async getDrafts(userId) {
    const query = `
      SELECT 
        cl.id,
        cl.content_type,
        cl.media_url,
        cl.metadata,
        cl.tags,
        cl.is_draft,
        cl.created_at
      FROM content_library cl
      WHERE cl.user_id = $1 AND cl.is_draft = true
      ORDER BY cl.updated_at DESC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async getWatchSegments(contentId) {
    const query = `
      SELECT watch_time_segments
      FROM content_analytics
      WHERE content_id = $1
    `;
    
    const result = await db.query(query, [contentId]);
    if (result.rows.length > 0) {
      return result.rows[0].watch_time_segments || [];
    }
    return [];
  }

  static async getDistributionMetrics(contentId) {
    const query = `
      SELECT distribution_metrics
      FROM content_analytics
      WHERE content_id = $1
    `;
    
    const result = await db.query(query, [contentId]);
    if (result.rows.length > 0) {
      return result.rows[0].distribution_metrics || {};
    }
    return {};
  }

  static async getExportData(userId, dateRange, contentType) {
    let dateCondition = '';
    if (dateRange) {
      dateCondition = `AND c.created_at BETWEEN '${dateRange.start}' AND '${dateRange.end}'`;
    }

    let typeCondition = '';
    if (contentType) {
      typeCondition = `AND c.content_type = '${contentType}'`;
    }

    const query = `
      SELECT 
        c.title,
        c.content_type,
        ca.views,
        ca.unique_viewers,
        ca.engagement_rate,
        ca.net_follows,
        ca.impressions,
        ca.comments_count,
        ca.watch_time_seconds,
        ca.average_watch_time,
        c.created_at
      FROM content_analytics ca
      JOIN content c ON ca.content_id = c.id
      WHERE c.user_id = $1 ${dateCondition} ${typeCondition}
      ORDER BY c.created_at DESC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async getLiveMetrics(contentId) {
    // This would connect to a real-time metrics service
    // For now, returning placeholder data
    return {
      live_views: Math.floor(Math.random() * 100),
      live_engagement: Math.floor(Math.random() * 50),
      live_watch_time: Math.floor(Math.random() * 300)
    };
  }

  static async createOrUpdateAnalytics(contentId, userId, analyticsData) {
    const query = `
      INSERT INTO content_analytics (
        content_id, user_id, views, unique_viewers, engagement_rate, net_follows, 
        impressions, comments_count, distribution_metrics, watch_time_seconds, 
        average_watch_time, watch_time_segments
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (content_id) 
      DO UPDATE SET
        views = content_analytics.views + EXCLUDED.views,
        unique_viewers = content_analytics.unique_viewers + EXCLUDED.unique_viewers,
        engagement_rate = EXCLUDED.engagement_rate,
        net_follows = EXCLUDED.net_follows,
        impressions = content_analytics.impressions + EXCLUDED.impressions,
        comments_count = content_analytics.comments_count + EXCLUDED.comments_count,
        distribution_metrics = EXCLUDED.distribution_metrics,
        watch_time_seconds = content_analytics.watch_time_seconds + EXCLUDED.watch_time_seconds,
        average_watch_time = EXCLUDED.average_watch_time,
        watch_time_segments = EXCLUDED.watch_time_segments,
        updated_at = NOW()
    `;
    
    await db.query(query, [
      contentId, userId, 
      analyticsData.views || 0, 
      analyticsData.unique_viewers || 0, 
      analyticsData.engagement_rate || 0, 
      analyticsData.net_follows || 0, 
      analyticsData.impressions || 0, 
      analyticsData.comments_count || 0, 
      JSON.stringify(analyticsData.distribution_metrics || {}), 
      analyticsData.watch_time_seconds || 0, 
      analyticsData.average_watch_time || 0, 
      JSON.stringify(analyticsData.watch_time_segments || {})
    ]);
  }
}

module.exports = AnalyticsModel;