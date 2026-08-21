/**
 * Platform Themes Controller
 * Complete implementation for platform theming system
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class PlatformThemesController {
  /**
   * GET /api/platform-themes/themes
   * Get available themes
   */
  async getThemes(req, res) {
    try {
      const result = await pool.query(
        `SELECT * FROM platform_themes
         WHERE is_active = true
         ORDER BY name ASC`
      );

      res.json({
        success: true,
        data: result.rows.map(theme => ({
          ...theme, colors: typeof theme.colors === 'string' ? JSON.parse(theme.colors) : theme.colors, fonts: typeof theme.fonts === 'string' ? JSON.parse(theme.fonts) : theme.fonts
        })), count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in PlatformThemesController.getThemes:', error);
      res.status(500).json({
        success: false, message: 'Failed to get themes', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/platform-themes/user-theme
   * Get current user's theme preference
   */
  async getUserTheme(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const result = await pool.query(
        `SELECT 
          ut.*,
          pt.name as theme_name,
          pt.colors as theme_colors,
          pt.fonts as theme_fonts
         FROM user_theme_preferences ut
         JOIN platform_themes pt ON ut.theme_id = pt.id
         WHERE ut.user_id = $1` [userId]
      );

      if (result.rows.length === 0) {
        // Return default theme
        const defaultTheme = await pool.query(
          'SELECT * FROM platform_themes WHERE is_default = true LIMIT 1'
        );

        if (defaultTheme.rows.length > 0) {
          const theme = defaultTheme.rows[0];
          return res.json({
            success: true,
            data: {
              themeId: theme.id,
              themeName: theme.name, colors: typeof theme.colors === 'string' ? JSON.parse(theme.colors) : theme.colors, fonts: typeof theme.fonts === 'string' ? JSON.parse(theme.fonts) : theme.fonts
            }
          });
        }

        return res.status(404).json({
          success: false, message: 'No default theme found'
        });
      }

      const preference = result.rows[0];

      res.json({
        success: true,
        data: {
          themeId: preference.theme_id,
          themeName: preference.theme_name, colors: typeof preference.theme_colors === 'string' ? JSON.parse(preference.theme_colors) : preference.theme_colors, fonts: typeof preference.theme_fonts === 'string' ? JSON.parse(preference.theme_fonts) : preference.theme_fonts
        }
      });
    } catch (error) {
      logger.error('Error in PlatformThemesController.getUserTheme:', error);
      res.status(500).json({
        success: false, message: 'Failed to get user theme', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/platform-themes/set-theme
   * Set user's theme preference
   */
  async setUserTheme(req, res) {
    try {
      const userId = req.user?.id;
      const { themeId } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (!themeId) {
        return res.status(400).json({
          success: false, message: 'Theme ID is required'
        });
      }

      // Verify theme exists
      const theme = await pool.query(
        'SELECT id FROM platform_themes WHERE id = $1 AND is_active = true',
        [themeId]
      );

      if (theme.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Theme not found'
        });
      }

      // Upsert theme preference
      await pool.query(
        `INSERT INTO user_theme_preferences (user_id, theme_id, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (user_id) DO UPDATE SET theme_id = $2, updated_at = NOW()`,
        [userId, themeId]
      );

      res.json({
        success: true, message: 'Theme set successfully'
      });
    } catch (error) {
      logger.error('Error in PlatformThemesController.setUserTheme:', error);
      res.status(500).json({
        success: false, message: 'Failed to set theme', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/platform-themes/custom/:userId
   * Get custom theme for a user
   */
  async getCustomTheme(req, res) {
    try {
      const { userId } = req.params;
      const currentUserId = req.user?.id;

      if (!currentUserId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      // Can only view own custom theme
      if (userId !== currentUserId.toString()) {
        return res.status(403).json({
          success: false, message: 'Access denied'
        });
      }

      const result = await pool.query(
        `SELECT * FROM custom_themes WHERE user_id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'No custom theme found'
        });
      }

      const customTheme = result.rows[0];

      res.json({
        success: true,
        data: {
          ...customTheme, colors: typeof customTheme.colors === 'string' ? JSON.parse(customTheme.colors) : customTheme.colors, fonts: typeof customTheme.fonts === 'string' ? JSON.parse(customTheme.fonts) : customTheme.fonts
        }
      });
    } catch (error) {
      logger.error('Error in PlatformThemesController.getCustomTheme:', error);
      res.status(500).json({
        success: false, message: 'Failed to get custom theme', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/platform-themes/custom
   * Create/update custom theme
   */
  async saveCustomTheme(req, res) {
    try {
      const userId = req.user?.id;
      const { colors, fonts, name } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (!colors) {
        return res.status(400).json({
          success: false, message: 'Colors configuration is required'
        });
      }

      await pool.query(
        `INSERT INTO custom_themes (user_id, name, colors, fonts, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         ON CONFLICT (user_id) DO UPDATE SET 
           name = $2, colors = $3, fonts = $4, updated_at = NOW()`,
        [userId, name || null, JSON.stringify(colors), JSON.stringify(fonts || {})]
      );

      res.json({
        success: true, message: 'Custom theme saved successfully'
      });
    } catch (error) {
      logger.error('Error in PlatformThemesController.saveCustomTheme:', error);
      res.status(500).json({
        success: false, message: 'Failed to save custom theme', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new PlatformThemesController();
