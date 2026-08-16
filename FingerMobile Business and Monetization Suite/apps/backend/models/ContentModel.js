/*
 * FingerMobile Protocol™ - Content Model
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

const db = require('../config/database'); // Assuming a database connection

class ContentModel {
  static async createContent(contentData) {
    const query = `
      INSERT INTO content (
        user_id, title, description, content_type, media_url, 
        tags, metadata, status, translation_settings
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      contentData.user_id,
      contentData.title,
      contentData.description,
      contentData.content_type,
      contentData.media_url,
      JSON.stringify(contentData.tags || []),
      JSON.stringify(contentData.metadata || {}),
      contentData.status || 'draft',
      JSON.stringify(contentData.translation_settings || {})
    ]);
    
    return result.rows[0];
  }

  static async scheduleContent(scheduleData) {
    const query = `
      INSERT INTO scheduled_content (
        user_id, content_id, content_type, schedule_time, status, content_data
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      scheduleData.user_id,
      scheduleData.content_id,
      scheduleData.content_type,
      scheduleData.schedule_time,
      scheduleData.status || 'scheduled',
      JSON.stringify(scheduleData.content_data || {})
    ]);
    
    return result.rows[0];
  }

  static async getContentLibrary(userId) {
    const query = `
      SELECT 
        cl.id,
        cl.content_type,
        cl.media_url,
        cl.metadata,
        cl.tags,
        cl.usage_stats,
        cl.is_draft,
        cl.published_at,
        cl.created_at,
        cl.updated_at
      FROM content_library cl
      WHERE cl.user_id = $1
      ORDER BY cl.updated_at DESC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async updateLibraryItem(contentId, updateData) {
    const query = `
      UPDATE content_library
      SET 
        media_url = COALESCE($1, media_url),
        metadata = COALESCE($2, metadata),
        tags = COALESCE($3, tags),
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;
    
    const result = await db.query(query, [
      updateData.media_url,
      JSON.stringify(updateData.metadata || {}),
      JSON.stringify(updateData.tags || []),
      contentId
    ]);
    
    return result.rows[0];
  }

  static async deleteLibraryItem(contentId) {
    const query = `
      DELETE FROM content_library
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await db.query(query, [contentId]);
    return result.rows[0];
  }

  static async getContentPlanner(userId) {
    const query = `
      SELECT 
        cp.id,
        cp.user_id,
        cp.content_schedule,
        cp.campaign_id,
        cp.insights_data,
        cp.created_at,
        cp.updated_at
      FROM content_planner cp
      WHERE cp.user_id = $1
      ORDER BY cp.created_at DESC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async addPlannedContent(plannedContent) {
    const query = `
      INSERT INTO content_planner (
        user_id, content_schedule, campaign_id, insights_data
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      plannedContent.user_id,
      JSON.stringify(plannedContent.content_schedule || {}),
      plannedContent.campaign_id,
      JSON.stringify(plannedContent.insights_data || {})
    ]);
    
    return result.rows[0];
  }

  static async getFilters(userId) {
    const query = `
      SELECT 
        cf.id,
        cf.user_id,
        cf.filter_name,
        cf.filter_settings,
        cf.created_at
      FROM content_filters cf
      WHERE cf.user_id = $1
      ORDER BY cf.created_at DESC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async applyFilters(filterData) {
    // This would implement the actual filtering logic
    // For now, returning placeholder data
    return {
      filteredContent: [],
      filterApplied: true,
      filterId: filterData.id
    };
  }

  static async bulkUpload(uploadData) {
    // Begin transaction to ensure atomicity
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      
      const results = [];
      for (const content of uploadData.contents) {
        const result = await this.createContent({
          ...content,
          user_id: uploadData.userId,
          status: 'draft' // Initially draft, user can publish later
        });
        results.push(result);
      }
      
      await client.query('COMMIT');
      return results;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = ContentModel;