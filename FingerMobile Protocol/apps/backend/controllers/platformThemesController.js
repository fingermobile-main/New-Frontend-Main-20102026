const logger = require('../utils/logger');
const { pool } = require('../db');

class PlatformThemesController {
  static async getThemes(req, res) {
    try {
      const result = await pool.query('SELECT * FROM platform_themes ORDER BY created_at DESC');
      res.json({ data: result.rows });
    } catch (error) {
      logger.error('Error fetching themes:', error);
      res.status(500).json({ error: 'Failed to fetch themes' });
    }
  }

  static async getActiveTheme(req, res) {
    try {
      const result = await pool.query(`
        SELECT * FROM platform_themes 
        WHERE is_active = true 
           OR (CURRENT_TIMESTAMP >= scheduled_start AND CURRENT_TIMESTAMP <= scheduled_end)
        ORDER BY updated_at DESC LIMIT 1
      `);

      if (result.rows.length === 0) {
        return res.json({ data: null, message: 'No active theme found' });
      }
      res.json({ data: result.rows[0] });
    } catch (error) {
      logger.error('Error fetching active theme:', error);
      res.status(500).json({ error: 'Failed to fetch active theme' });
    }
  }

  static async createTheme(req, res) {
    const { theme_name, theme_config, is_active, scheduled_start, scheduled_end } = req.body;
    try {
      const result = await pool.query(`
        INSERT INTO platform_themes (theme_name, theme_config, is_active, scheduled_start, scheduled_end)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [theme_name, theme_config, is_active || false, scheduled_start || null, scheduled_end || null]);

      res.status(201).json({ data: result.rows[0], message: 'Theme created successfully' });
    } catch (error) {
      logger.error('Error creating theme:', error);
      res.status(500).json({ error: 'Failed to create theme' });
    }
  }

  static async updateTheme(req, res) {
    const { id } = req.params;
    const { theme_name, theme_config, is_active, scheduled_start, scheduled_end } = req.body;
    try {
      const result = await pool.query(`
        UPDATE platform_themes 
        SET theme_name = COALESCE($1, theme_name),
            theme_config = COALESCE($2, theme_config),
            is_active = COALESCE($3, is_active),
            scheduled_start = COALESCE($4, scheduled_start),
            scheduled_end = COALESCE($5, scheduled_end),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING *
      `, [theme_name, theme_config, is_active, scheduled_start, scheduled_end, id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Theme not found' });
      }
      res.json({ data: result.rows[0], message: 'Theme updated successfully' });
    } catch (error) {
      logger.error('Error updating theme:', error);
      res.status(500).json({ error: 'Failed to update theme' });
    }
  }

  static async deleteTheme(req, res) {
    const { id } = req.params;
    try {
      const result = await pool.query('DELETE FROM platform_themes WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Theme not found' });
      }
      res.json({ message: 'Theme deleted successfully' });
    } catch (error) {
      logger.error('Error deleting theme:', error);
      res.status(500).json({ error: 'Failed to delete theme' });
    }
  }
}

module.exports = PlatformThemesController;
