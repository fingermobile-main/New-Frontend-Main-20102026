const logger = require('../../utils/logger');
const { identityDb } = require('../../db');
const { logSecurityEvent } = require('../../utils/securityLogger');

class MemberProfileService {
  // Get member profile
  static async getMemberProfile(memberId) {
    try {
      const result = await identityDb.query(
        `SELECT
          id,
          membername,
          email,
          first_name,
          last_name,
          phone,
          avatar_url,
          bio,
          timezone,
          language,
          theme_preference,
          created_at,
          updated_at
        FROM members
        WHERE id = $1`,
        [memberId],
      );

      if (result.rows.length === 0) {
        throw new Error('Member not found');
      }

      return {success: true,
        profile: result.rows[0],
        message: 'Profile retrieved successfully'
      };
    } catch (error) {
      logger.error('Error getting member profile:', error);
      throw error;
    }
  }

  // Update member profile
  static async updateMemberProfile(memberId, profileData) {
    try {
      // Build update query dynamically
      let updateFields = [];
      let updateValues = [];
      let paramIndex = 2; // First param is memberId

      if (profileData.firstName) {
        updateFields.push(`first_name = $${paramIndex}`);
        updateValues.push(profileData.firstName);
        paramIndex++;
      }

      if (profileData.lastName) {
        updateFields.push(`last_name = $${paramIndex}`);
        updateValues.push(profileData.lastName);
        paramIndex++;
      }

      if (profileData.phone !== undefined) {
        updateFields.push(`phone = $${paramIndex}`);
        updateValues.push(profileData.phone);
        paramIndex++;
      }

      if (profileData.avatarUrl !== undefined) {
        updateFields.push(`avatar_url = $${paramIndex}`);
        updateValues.push(profileData.avatarUrl);
        paramIndex++;
      }

      if (profileData.bio !== undefined) {
        updateFields.push(`bio = $${paramIndex}`);
        updateValues.push(profileData.bio);
        paramIndex++;
      }

      if (profileData.timezone) {
        updateFields.push(`timezone = $${paramIndex}`);
        updateValues.push(profileData.timezone);
        paramIndex++;
      }

      if (profileData.language) {
        updateFields.push(`language = $${paramIndex}`);
        updateValues.push(profileData.language);
        paramIndex++;
      }

      if (profileData.themePreference) {
        updateFields.push(`theme_preference = $${paramIndex}`);
        updateValues.push(profileData.themePreference);
        paramIndex++;
      }

      if (updateFields.length === 0) {
        throw new Error('No fields to update');
      }

      updateValues.push(memberId); // Add memberId as last value

      const query = `UPDATE members SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING id, membername, email, first_name, last_name, phone, avatar_url, bio, timezone, language, theme_preference, created_at, updated_at`;
      const result = await identityDb.query(query, updateValues);

      // Log security event
      await logSecurityEvent(memberId, 'PROFILE_UPDATE', {memberId: result.rows[0].id,
        fields: Object.keys(profileData)
      });

      return {success: true,
        profile: result.rows[0],
        message: 'Profile updated successfully'
      };
    } catch (error) {
      logger.error('Error updating member profile:', error);
      throw error;
    }
  }

  // Get member preferences
  static async getMemberPreferences(memberId) {
    try {
      const result = await identityDb.query(
        `SELECT
          id,
          membername,
          email,
          theme_preference,
          language,
          timezone,
          notification_preferences
        FROM members
        WHERE id = $1`,
        [memberId],
      );

      if (result.rows.length === 0) {
        throw new Error('Member not found');
      }

      return {success: true,
        preferences: {
          theme: result.rows[0].theme_preference,
          language: result.rows[0].language,
          timezone: result.rows[0].timezone,
          notifications: result.rows[0].notification_preferences || {},
          email: result.rows[0].email
        },
        message: 'Preferences retrieved successfully'
      };
    } catch (error) {
      logger.error('Error getting member preferences:', error);
      throw error;
    }
  }

  // Update member preferences
  static async updateMemberPreferences(memberId, preferences) {
    try {
      const { theme, language, timezone, notifications } = preferences;

      const result = await identityDb.query(
        `UPDATE members
         SET theme_preference = $1,
             language = $2,
             timezone = $3,
             notification_preferences = $4,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $5
         RETURNING id, membername, email, theme_preference, language, timezone, notification_preferences`,
        [theme, language, timezone, notifications, memberId],
      );

      // Log security event
      await logSecurityEvent(memberId, 'PREFERENCES_UPDATE', {memberId: result.rows[0].id,
        preferences: { theme,
          language,
          timezone,
          notifications }
      });

      return {success: true,
        preferences: {
          theme: result.rows[0].theme_preference,
          language: result.rows[0].language,
          timezone: result.rows[0].timezone,
          notifications: result.rows[0].notification_preferences || {},
          email: result.rows[0].email
        },
        message: 'Preferences updated successfully'
      };
    } catch (error) {
      logger.error('Error updating member preferences:', error);
      throw error;
    }
  }

  // Change member password
  static async changePassword(memberId, currentPassword, newPassword) {
    try {
      // In a real implementation, we would verify the current password
      // For now, we'll just update the password
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await identityDb.query(
        'UPDATE members SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [hashedPassword, memberId],
      );

      // Log security event
      await logSecurityEvent(memberId, 'PASSWORD_CHANGE', {memberId: memberId
      });

      return {success: true,
        message: 'Password changed successfully'
      };
    } catch (error) {
      logger.error('Error changing password:', error);
      throw error;
    }
  }

  // Get member activity history
  static async getMemberActivity(memberId, limit = 10) {
    try {
      // In a real implementation, we would query an activity log table
      // For now, we'll return a mock response
      const activities = [
        {id: 1,
          action: 'Login',
          timestamp: new Date(Date.now() - 86400000),
          description: 'Member logged in from web'
        },
        {id: 2,
          action: 'Profile Update',
          timestamp: new Date(Date.now() - 172800000),
          description: 'Updated profile information'
        },
        {id: 3,
          action: 'Project Created',
          timestamp: new Date(Date.now() - 259200000),
          description: 'Created new project "Website Redesign"'
        },
        {id: 4,
          action: 'API Request',
          timestamp: new Date(Date.now() - 345600000),
          description: 'Made API request to retrieve data'
        },
        {id: 5,
          action: 'File Uploaded',
          timestamp: new Date(Date.now() - 432000000),
          description: 'Uploaded new assets to project'
        }
      ];

      return {success: true,
        activities: activities.slice(0,
          limit),
        message: 'Activity history retrieved successfully'
      };
    } catch (error) {
      logger.error('Error getting member activity:', error);
      throw error;
    }
  }
}

module.exports = MemberProfileService;
