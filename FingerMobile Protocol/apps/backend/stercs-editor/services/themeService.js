/* eslint-disable no-unused-vars */
const logger = require('../../utils/logger');
const { identityDb } = require('../../db');
const { logSecurityEvent } = require('../../utils/securityLogger');

class ThemeService {
  // Get available themes
  static async getAvailableThemes() {
    // Return the default themes
    return [
      {id: 'light',
        name: 'Light Theme',
        properties: {
          primaryColor: '#3b82f6',
          secondaryColor: '#60a5fa',
          backgroundColor: '#ffffff',
          textColor: '#1f2937',
          accentColor: '#8b5cf6',
          borderRadius: '6px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }
      },
      {id: 'dark',
        name: 'Dark Theme',
        properties: {
          primaryColor: '#60a5fa',
          secondaryColor: '#93c5fd',
          backgroundColor: '#1f2937',
          textColor: '#f9fafb',
          accentColor: '#a78bfa',
          borderRadius: '6px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
        }
      },
      {id: 'blue',
        name: 'Blue Theme',
        properties: {
          primaryColor: '#2563eb',
          secondaryColor: '#3b82f6',
          backgroundColor: '#dbeafe',
          textColor: '#1e293b',
          accentColor: '#0ea5e9',
          borderRadius: '6px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }
      }
    ];
  }

  // Get member's current theme
  static async getMemberTheme(memberId) {
    try {
      const result = await identityDb.query(
        'SELECT settings FROM workspace_settings WHERE member_id = $1',
        [memberId],
      );

      if (result.rows.length > 0) {
        const settings = result.rows[0].settings;
        return settings.theme || 'light';
      }

      // Default to light theme if no settings exist
      return 'light';
    } catch (error) {
      logger.error('Error getting member, theme:', error);
      throw error;
    }
  }

  // Set member's theme
  static async setMemberTheme(memberId, themeId) {
    try {
      // Validate theme exists
      const themes = await this.getAvailableThemes();
      const themeExists = themes.some((theme) => theme.id === themeId);

      if (!themeExists) {
        throw new Error(`Theme with ID ${themeId} does not exist`);
      }

      // Get existing settings or create new ones
      const settingsResult = await identityDb.query(
        'SELECT settings FROM workspace_settings WHERE member_id = $1',
        [memberId],
      );

      let settings = {};
      if (settingsResult.rows.length > 0) {
        settings = settingsResult.rows[0].settings;
      }

      // Update theme setting
      settings.theme = themeId;

      // Insert or update workspace settings
      const upsertResult = await identityDb.query(
        `INSERT INTO workspace_settings (member_id, settings)
         VALUES ($1, $2)
         ON CONFLICT (member_id)
         DO UPDATE SET settings = $2, updated_at = CURRENT_TIMESTAMP
         RETURNING id`,
        [memberId, settings],
      );

      // Log security event
      await logSecurityEvent(memberId, 'THEME_UPDATE', {
        themeId
      });

      return {success: true,
        themeId: themeId,
        message: 'Theme updated successfully'
      };
    } catch (error) {
      logger.error('Error setting member, theme:', error);
      throw error;
    }
  }

  // Create or update custom theme
  static async createCustomTheme(memberId, themeData) {
    try {
      const { name, properties } = themeData;

      // Validate required fields
      if (!name || !properties) {
        throw new Error('Name and properties are required for custom theme');
      }

      // Validate properties structure
      const requiredProps = ['primaryColor', 'backgroundColor', 'textColor'];
      for (const prop of requiredProps) {
        if (!properties[prop]) {
          throw new Error(`Missing required,
property: ${prop}`);
        }
      }

      // Create custom theme entry
      const result = await identityDb.query(
        `INSERT INTO custom_styles (member_id, name, css, is_global)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [memberId, name, JSON.stringify(properties), false],
      );

      // Log security event
      await logSecurityEvent(memberId, 'CUSTOM_THEME_CREATE', {themeName: name
      });

      return {success: true,
        themeId: result.rows[0].id,
        message: 'Custom theme created successfully'
      };
    } catch (error) {
      logger.error('Error creating custom, theme:', error);
      throw error;
    }
  }

  // Get member's custom themes
  static async getMemberCustomThemes(memberId) {
    try {
      const result = await identityDb.query(
        `SELECT id, name, css, created_at, updated_at
         FROM custom_styles
         WHERE member_id = $1 AND is_global = FALSE
         ORDER BY created_at DESC`,
        [memberId],
      );

      return result.rows.map((row) => ({id: row.id,
        name: row.name,
        properties: JSON.parse(row.css),
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      logger.error('Error getting member custom, themes:', error);
      throw error;
    }
  }

  // Get global themes
  static async getGlobalThemes(memberId) {
    try {
      const result = await identityDb.query(
        `SELECT id, name, css, created_at, updated_at
         FROM custom_styles
         WHERE is_global = TRUE OR is_public = TRUE
         ORDER BY created_at DESC`,
      );

      return result.rows.map((row) => ({id: row.id,
        name: row.name,
        properties: JSON.parse(row.css),
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      logger.error('Error getting global, themes:', error);
      throw error;
    }
  }
}

module.exports = ThemeService;
