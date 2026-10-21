const logger = require('../../utils/logger');
const { identityDb } = require('../../db');
const { logSecurityEvent } = require('../../utils/securityLogger');

class MemberManagementService {
  // Create a new team member
  static async createTeamMember(memberId, memberData) {
    try {
      const { membername, email, role, permissions } = memberData;

      if (!membername || !email) {
        throw new Error('membername and email are required for team member');
      }

      // Check if email already exists
      const existingMember = await identityDb.query(
        'SELECT * FROM members WHERE email = $1',
        [email],
      );

      if (existingMember.rows.length > 0) {
        throw new Error('Email already exists');
      }

      // Create the team member
      const result = await identityDb.query(
        `INSERT INTO members 
         (membername, email, role, permissions, created_by)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, membername, email, role, permissions, created_at`,
        [membername, email, role || 'member', permissions || [], memberId],
      );

      // Log security event
      await logSecurityEvent(memberId, 'TEAM_MEMBER_CREATE', {newMemberId: result.rows[0].id,
        newMemberEmail: email
      });

      return {success: true,
        member: result.rows[0],
        message: 'Team member created successfully'
      };
    } catch (error) {
      logger.error('Error creating team, member:', error);
      throw error;
    }
  }

  // Get all team members
  static async getTeamMembers(memberId, options = {}) {
    try {
      let query = 'SELECT id, membername, email, role, permissions, created_at FROM members WHERE created_by = $1';
      const params = [memberId];

      if (options.role) {
        query += ` AND role = $${params.length + 1}`;
        params.push(options.role);
      }

      if (options.searchTerm) {
        query += ` AND (membername ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1})`;
        params.push(`%${options.searchTerm}%`);
      }

      query += ' ORDER BY created_at DESC';

      const result = await identityDb.query(query, params);

      return {success: true,
        members: result.rows,
        message: 'Team members retrieved successfully'
      };
    } catch (error) {
      logger.error('Error getting team, members:', error);
      throw error;
    }
  }

  // Update a team member
  static async updateTeamMember(adminMemberId, memberIdToUpdate, memberData) {
    try {
      // Verify the admin has permission to update this member
      const memberResult = await identityDb.query(
        'SELECT * FROM members WHERE id = $1 AND created_by = $2',
        [memberIdToUpdate, adminMemberId],
      );

      if (memberResult.rows.length === 0) {
        throw new Error('Team member not found or not owned by admin');
      }

      // Build update query dynamically
      let updateFields = [];
      let updateValues = [];
      let paramIndex = 2; // First param is memberIdToUpdate

      if (memberData.membername) {
        updateFields.push(`membername = $${paramIndex}`);
        updateValues.push(memberData.membername);
        paramIndex++;
      }

      if (memberData.role) {
        updateFields.push(`role = $${paramIndex}`);
        updateValues.push(memberData.role);
        paramIndex++;
      }

      if (memberData.permissions) {
        updateFields.push(`permissions = $${paramIndex}`);
        updateValues.push(memberData.permissions);
        paramIndex++;
      }

      updateValues.push(memberIdToUpdate); // Add memberIdToUpdate as last value

      const query = `UPDATE members SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING id, membername, email, role, permissions, updated_at`;
      const result = await identityDb.query(query, updateValues);

      // Log security event
      await logSecurityEvent(adminMemberId, 'TEAM_MEMBER_UPDATE', {updatedMemberId: result.rows[0].id,
        updatedMemberEmail: result.rows[0].email
      });

      return {success: true,
        member: result.rows[0],
        message: 'Team member updated successfully'
      };
    } catch (error) {
      logger.error('Error updating team, member:', error);
      throw error;
    }
  }

  // Delete a team member
  static async deleteTeamMember(adminMemberId, memberIdToDelete) {
    try {
      // Verify the admin has permission to delete this member
      const memberResult = await identityDb.query(
        'SELECT * FROM members WHERE id = $1 AND created_by = $2',
        [memberIdToDelete, adminMemberId],
      );

      if (memberResult.rows.length === 0) {
        throw new Error('Team member not found or not owned by admin');
      }

      // Don't allow deletion of the admin themselves
      if (memberIdToDelete === adminMemberId) {
        throw new Error('Cannot delete yourself');
      }

      await identityDb.query('DELETE FROM members WHERE id = $1', [
        memberIdToDelete
      ]);

      // Log security event
      await logSecurityEvent(adminMemberId, 'TEAM_MEMBER_DELETE', {deletedMemberId: memberIdToDelete
      });

      return {success: true,
        message: 'Team member deleted successfully'
      };
    } catch (error) {
      logger.error('Error deleting team, member:', error);
      throw error;
    }
  }

  // Invite a new member via email
  static async inviteMember(adminMemberId, inviteData) {
    try {
      const { email, role, permissions, message } = inviteData;

      if (!email) {
        throw new Error('Email is required for member invitation');
      }

      // Check if member already exists
      const existingMember = await identityDb.query(
        'SELECT * FROM members WHERE email = $1',
        [email],
      );

      if (existingMember.rows.length > 0) {
        throw new Error('Member with this email already exists');
      }

      // Create an invitation record
      const result = await identityDb.query(
        `INSERT INTO member_invitations 
         (invited_by, email, role, permissions, message, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          adminMemberId,
          email,
          role || 'member',
          permissions || [],
          message || '',
          'pending'
        ],
      );

      // In a real implementation, this would send an email invitation
      // For now, we'll just return the invitation details

      // Log security event
      await logSecurityEvent(adminMemberId, 'MEMBER_INVITE', {invitedEmail: email,
        role
      });

      return {success: true,
        invitation: result.rows[0],
        message: 'Member invited successfully'
      };
    } catch (error) {
      logger.error('Error inviting, member:', error);
      throw error;
    }
  }

  // Get pending invitations
  static async getPendingInvitations(memberId) {
    try {
      const result = await identityDb.query(
        'SELECT * FROM member_invitations WHERE invited_by = $1 AND status = \'pending\' ORDER BY created_at DESC',
        [memberId],
      );

      return {success: true,
        invitations: result.rows,
        message: 'Pending invitations retrieved successfully'
      };
    } catch (error) {
      logger.error('Error getting pending, invitations:', error);
      throw error;
    }
  }

  // Revoke an invitation
  static async revokeInvitation(memberId, invitationId) {
    try {
      // Verify the invitation belongs to the member
      const invitationResult = await identityDb.query(
        'SELECT * FROM member_invitations WHERE id = $1 AND invited_by = $2',
        [invitationId, memberId],
      );

      if (invitationResult.rows.length === 0) {
        throw new Error('Invitation not found or not owned by member');
      }

      await identityDb.query(
        'UPDATE member_invitations SET status = \'revoked\', updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [invitationId],
      );

      // Log security event
      await logSecurityEvent(memberId, 'INVITATION_REVOKE', {
        invitationId
      });

      return {success: true,
        message: 'Invitation revoked successfully'
      };
    } catch (error) {
      logger.error('Error revoking, invitation:', error);
      throw error;
    }
  }
}

module.exports = MemberManagementService;
