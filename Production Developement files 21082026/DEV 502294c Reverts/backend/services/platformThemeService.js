const { identityDb } = require("../db");
const { logSecurityEvent } = require("../utils/securityLogger");

class PlatformThemeService {
  // Create a new platform theme
  static async createTheme(memberId, themeData) {
    try {
      const { name, description, properties, isPublic, scheduledChanges } =
        themeData;

      // Validate required fields
      if (!name || !properties) {
        throw new Error("Name and properties are required for theme");
      }

      // Validate properties structure
      const requiredProps = ["primaryColor", "backgroundColor", "textColor"];
      for (const prop of requiredProps) {
        if (!properties[prop]) {
          throw new Error(`Missing required property: ${prop}`);
        }
      }

      // Create theme entry
      const result = await identityDb.query(
        `INSERT INTO platform_themes 
         (name, description, properties, is_public, created_by, scheduled_changes)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [
          name,
          description,
          JSON.stringify(properties),
          isPublic || false,
          memberId,
          scheduledChanges || []
        ],
      );

      // Log security event
      await logSecurityEvent(memberId, "THEME_CREATE", {
        themeName: name,
        themeId: result.rows[0].id
      });

      return {
        success: true,
        themeId: result.rows[0].id,
        message: "Theme created successfully"
      };
    } catch (error) {
      logger.error("Error creating theme:", error);
      throw error;
    }
  }

  // Get all available themes
  static async getThemes(memberId, options = {}) {
    try {
      let query = `SELECT pt.*, m.membername as created_by_membername FROM platform_themes pt 
                   LEFT JOIN members m ON pt.created_by = m.id WHERE 1=1`;
      const params = [];

      if (options.isPublic) {
        query += ` AND (pt.is_public = true OR pt.created_by = $${params.length + 1})`;
        params.push(memberId);
      } else {
        // Include public themes and member's own themes
        query += ` AND (pt.is_public = true OR pt.created_by = $${params.length + 1})`;
        params.push(memberId);
      }

      if (options.searchTerm) {
        query += ` AND pt.name ILIKE $${params.length + 1}`;
        params.push(`%${options.searchTerm}%`);
      }

      query += ` ORDER BY pt.created_at DESC`;

      const result = await identityDb.query(query, params);

      return result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        properties: JSON.parse(row.properties),
        isPublic: row.is_public,
        createdBy: row.created_by,
        createdBymembername: row.created_by_membername,
        scheduledChanges: row.scheduled_changes,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      logger.error("Error getting themes:", error);
      throw error;
    }
  }

  // Get theme by ID
  static async getThemeById(themeId) {
    try {
      const result = await identityDb.query(
        `SELECT pt.*, m.membername as created_by_membername FROM platform_themes pt 
         LEFT JOIN members m ON pt.created_by = m.id
         WHERE pt.id = $1`,
        [themeId],
      );

      if (result.rows.length === 0) {
        throw new Error("Theme not found");
      }

      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        description: row.description,
        properties: JSON.parse(row.properties),
        isPublic: row.is_public,
        createdBy: row.created_by,
        createdBymembername: row.created_by_membername,
        scheduledChanges: row.scheduled_changes,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    } catch (error) {
      logger.error("Error getting theme by ID:", error);
      throw error;
    }
  }

  // Update theme
  static async updateTheme(memberId, themeId, themeData) {
    try {
      // Check if member owns the theme or is an admin
      const themeResult = await identityDb.query(
        `SELECT * FROM platform_themes WHERE id = $1`,
        [themeId],
      );

      if (themeResult.rows.length === 0) {
        throw new Error("Theme not found");
      }

      const theme = themeResult.rows[0];
      if (theme.created_by !== memberId) {
        // Check if member is admin
        const memberResult = await identityDb.query(
          `SELECT role FROM members WHERE id = $1`,
          [memberId],
        );

        if (
          memberResult.rows.length === 0 ||
          !["admin", "superadmin"].includes(memberResult.rows[0].role)
        ) {
          throw new Error(
            "Member does not have permission to update this theme",
          );
        }
      }

      // Build update query
      let updateFields = [];
      let updateValues = [];
      let paramIndex = 2; // First param is themeId

      if (themeData.name) {
        updateFields.push(`name = $${paramIndex}`);
        updateValues.push(themeData.name);
        paramIndex++;
      }

      if (themeData.description) {
        updateFields.push(`description = $${paramIndex}`);
        updateValues.push(themeData.description);
        paramIndex++;
      }

      if (themeData.properties) {
        // Validate properties
        const requiredProps = ["primaryColor", "backgroundColor", "textColor"];
        for (const prop of requiredProps) {
          if (!themeData.properties[prop]) {
            throw new Error(`Missing required property: ${prop}`);
          }
        }

        updateFields.push(`properties = $${paramIndex}`);
        updateValues.push(JSON.stringify(themeData.properties));
        paramIndex++;
      }

      if (themeData.isPublic !== undefined) {
        updateFields.push(`is_public = $${paramIndex}`);
        updateValues.push(themeData.isPublic);
        paramIndex++;
      }

      if (themeData.scheduledChanges) {
        updateFields.push(`scheduled_changes = $${paramIndex}`);
        updateValues.push(themeData.scheduledChanges);
        paramIndex++;
      }

      updateValues.push(themeId); // Add themeId as last value

      const query = `UPDATE platform_themes SET ${updateFields.join(", ")} updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`;
      const result = await identityDb.query(query, updateValues);

      // Log security event
      await logSecurityEvent(memberId, "THEME_UPDATE", {
        themeId,
        themeName: result.rows[0].name
      });

      return {
        success: true,
        theme: {
          id: result.rows[0].id,
          name: result.rows[0].name,
          description: result.rows[0].description,
          properties: JSON.parse(result.rows[0].properties),
          isPublic: result.rows[0].is_public,
          createdBy: result.rows[0].created_by,
          scheduledChanges: result.rows[0].scheduled_changes,
          createdAt: result.rows[0].created_at,
          updatedAt: result.rows[0].updated_at
        },
        message: "Theme updated successfully"
      };
    } catch (error) {
      logger.error("Error updating theme:", error);
      throw error;
    }
  }

  // Delete theme
  static async deleteTheme(memberId, themeId) {
    try {
      // Check if member owns the theme or is an admin
      const themeResult = await identityDb.query(
        `SELECT * FROM platform_themes WHERE id = $1`,
        [themeId],
      );

      if (themeResult.rows.length === 0) {
        throw new Error("Theme not found");
      }

      const theme = themeResult.rows[0];
      if (theme.created_by !== memberId) {
        // Check if member is admin
        const memberResult = await identityDb.query(
          `SELECT role FROM members WHERE id = $1`,
          [memberId],
        );

        if (
          memberResult.rows.length === 0 ||
          !["admin", "superadmin"].includes(memberResult.rows[0].role)
        ) {
          throw new Error(
            "Member does not have permission to delete this theme",
          );
        }
      }

      await identityDb.query(`DELETE FROM platform_themes WHERE id = $1`, [
        themeId
      ]);

      // Log security event
      await logSecurityEvent(memberId, "THEME_DELETE", {
        themeId
      });

      return {
        success: true,
        message: "Theme deleted successfully"
      };
    } catch (error) {
      logger.error("Error deleting theme:", error);
      throw error;
    }
  }

  // Get member's active theme
  static async getMemberActiveTheme(memberId) {
    try {
      // First check if member has a specific theme set
      const memberSettingsResult = await identityDb.query(
        `SELECT settings FROM member_preferences WHERE member_id = $1`,
        [memberId],
      );

      if (memberSettingsResult.rows.length > 0) {
        const settings = memberSettingsResult.rows[0].settings;
        if (settings.activeThemeId) {
          return await this.getThemeById(settings.activeThemeId);
        }
      }

      // If no specific theme, return default theme
      const defaultThemeResult = await identityDb.query(
        `SELECT * FROM platform_themes WHERE name = 'Default Light' LIMIT 1`,
      );

      if (defaultThemeResult.rows.length > 0) {
        return await this.getThemeById(defaultThemeResult.rows[0].id);
      }

      // If no default theme, return light theme as fallback
      return {
        id: "light",
        name: "Light Theme",
        description: "Default light theme",
        properties: {
          primaryColor: "#3b82f6",
          secondaryColor: "#60a5fa",
          backgroundColor: "#ffffff",
          textColor: "#1f2937",
          accentColor: "#8b5cf6",
          borderRadius: "6px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          backgroundImage: null,
          backgroundPattern: null
        }
      };
    } catch (error) {
      logger.error("Error getting member active theme:", error);
      throw error;
    }
  }

  // Set member's active theme
  static async setMemberActiveTheme(memberId, themeId) {
    try {
      // Verify theme exists and is accessible to member
      const theme = await this.getThemeById(themeId);

      if (!theme.isPublic) {
        // If theme is not public, check if member owns it
        if (theme.createdBy !== memberId) {
          // Check if member is admin
          const memberResult = await identityDb.query(
            `SELECT role FROM members WHERE id = $1`,
            [memberId],
          );

          if (
            memberResult.rows.length === 0 ||
            !["admin", "superadmin"].includes(memberResult.rows[0].role)
          ) {
            throw new Error("Member does not have access to this theme");
          }
        }
      }

      // Get or create member preferences
      let memberSettingsResult = await identityDb.query(
        `SELECT settings FROM member_preferences WHERE member_id = $1`,
        [memberId],
      );

      let settings = {};
      if (memberSettingsResult.rows.length > 0) {
        settings = memberSettingsResult.rows[0].settings;
      }

      // Update active theme
      settings.activeThemeId = themeId;

      // Insert or update member preferences
      await identityDb.query(
        `INSERT INTO member_preferences (member_id, settings)
         VALUES ($1, $2)
         ON CONFLICT (member_id)
         DO UPDATE SET settings = $2, updated_at = CURRENT_TIMESTAMP`,
        [memberId, settings],
      );

      // Log security event
      await logSecurityEvent(memberId, "MEMBER_THEME_SET", {
        themeId,
        themeName: theme.name
      });

      return {
        success: true,
        message: "Member theme updated successfully"
      };
    } catch (error) {
      logger.error("Error setting member active theme:", error);
      throw error;
    }
  }

  // Schedule theme change
  static async scheduleThemeChange(memberId, themeId, scheduleData) {
    try {
      const { scheduledAt, duration, recurrence } = scheduleData;

      // Verify member has access to theme
      const theme = await this.getThemeById(themeId);

      if (!theme.isPublic && theme.createdBy !== memberId) {
        // Check if member is admin
        const memberResult = await identityDb.query(
          `SELECT role FROM members WHERE id = $1`,
          [memberId],
        );

        if (
          memberResult.rows.length === 0 ||
          !["admin", "superadmin"].includes(memberResult.rows[0].role)
        ) {
          throw new Error("Member does not have access to this theme");
        }
      }

      // Add scheduled change to theme
      const newSchedule = {
        id: Date.now().toString(),
        scheduledAt,
        duration: duration || null,
        recurrence: recurrence || null,
        createdBy: memberId
      };

      const result = await identityDb.query(
        `UPDATE platform_themes 
         SET scheduled_changes = scheduled_changes || $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [JSON.stringify([newSchedule]), themeId],
      );

      // Log security event
      await logSecurityEvent(memberId, "THEME_SCHEDULE", {
        themeId,
        scheduledAt
      });

      return {
        success: true,
        scheduleId: newSchedule.id,
        message: "Theme scheduled successfully"
      };
    } catch (error) {
      logger.error("Error scheduling theme change:", error);
      throw error;
    }
  }

  // Apply scheduled theme changes (this would be called by a scheduler)
  static async applyScheduledChanges() {
    try {
      // Get all themes with scheduled changes
      const themesResult = await identityDb.query(
        `SELECT * FROM platform_themes WHERE scheduled_changes != '[]'`,
      );

      const now = new Date();
      const appliedChanges = [];

      for (const theme of themesResult.rows) {
        const scheduledChanges = JSON.parse(theme.scheduled_changes);
        const remainingChanges = [];

        for (const schedule of scheduledChanges) {
          const scheduleTime = new Date(schedule.scheduledAt);

          // Check if this schedule is due
          if (scheduleTime <= now) {
            // Apply the theme change system-wide or to specific members
            // This is a simplified implementation - in a real system, you might
            // apply to all members or specific member groups

            appliedChanges.push({
              themeId: theme.id,
              scheduleId: schedule.id,
              appliedAt: now
            });
          } else {
            // Keep the schedule for later
            remainingChanges.push(schedule);
          }
        }

        // Update the theme with remaining schedules
        if (remainingChanges.length !== scheduledChanges.length) {
          await identityDb.query(
            `UPDATE platform_themes 
             SET scheduled_changes = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2`,
            [JSON.stringify(remainingChanges), theme.id],
          );
        }
      }

      return {
        success: true,
        appliedChanges,
        message: `${appliedChanges.length} scheduled theme changes applied`
      };
    } catch (error) {
      logger.error("Error applying scheduled changes:", error);
      throw error;
    }
  }
}

module.exports = PlatformThemeService;
