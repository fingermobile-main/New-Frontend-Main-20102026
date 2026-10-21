const logger = require('../../utils/logger');
const { identityDb } = require('../../db');
const { logSecurityEvent } = require('../../utils/securityLogger');

class CollaborationService {
  // Invite a member to collaborate on a project
  static async inviteMember(memberId, inviteData) {
    try {
      const {
        projectId,
        email,
        role = 'viewer', // viewer, editor, admin
        permissions = [],
      } = inviteData;

      if (!projectId || !email) {
        throw new Error(
          'Project ID and email are required for inviting a member',
        );
      }

      // Check if member already exists in the system
      const memberResult = await identityDb.query(
        'SELECT id FROM members WHERE email = $1',
        [email],
      );

      let invitedmemberId;
      if (memberResult.rows.length === 0) {
        // member doesn't exist, we'll create an invitation record
        const invitationResult = await identityDb.query(
          `INSERT INTO stercs_collaboration_invitations 
           (inviter_id, project_id, email, role, permissions)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [memberId, projectId, email, role, permissions],
        );

        // Log security event
        await logSecurityEvent(memberId, 'COLLABORATION_INVITE_SENT', {invitationId: invitationResult.rows[0].id,
          email: email
        });

        return {success: true,
          invitation: invitationResult.rows[0],
          message:
            'Invitation sent successfully. member will need to register first.'
        };
      } else {
        invitedmemberId = memberResult.rows[0].id;
      }

      // Check if member is already a collaborator
      const existingCollabResult = await identityDb.query(
        `SELECT id FROM stercs_project_collaborators 
         WHERE project_id = $1 AND member_id = $2`,
        [projectId, invitedmemberId],
      );

      if (existingCollabResult.rows.length > 0) {
        throw new Error('Member is already a collaborator on this project');
      }

      // Add member as a collaborator
      const result = await identityDb.query(
        `INSERT INTO stercs_project_collaborators 
         (project_id, member_id, role, permissions)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [projectId, invitedmemberId, role, permissions],
      );

      // Log security event
      await logSecurityEvent(memberId, 'COLLABORATION_member_ADDED', {collaboratorId: result.rows[0].id,
        memberId: invitedmemberId
      });

      return {success: true,
        collaborator: result.rows[0],
        message: 'Member invited to collaborate successfully'
      };
    } catch (error) {
      logger.error('Error inviting member to, collaborate:', error);
      throw error;
    }
  }

  // Get project collaborators
  static async getProjectCollaborators(memberId, projectId) {
    try {
      // Verify member has access to the project
      const projectResult = await identityDb.query(
        `SELECT id FROM stercs_project_collaborators 
         WHERE project_id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error('Member does not have access to this project');
      }

      const result = await identityDb.query(
        `SELECT pc.*, m.membername, m.email 
         FROM stercs_project_collaborators pc
         JOIN members m ON pc.member_id = m.id
         WHERE pc.project_id = $1
         ORDER BY pc.created_at DESC`,
        [projectId],
      );

      return {success: true,
        collaborators: result.rows,
        message: 'Project collaborators retrieved successfully'
      };
    } catch (error) {
      logger.error('Error getting project, collaborators:', error);
      throw error;
    }
  }

  // Update collaborator permissions
  static async updateCollaborator(memberId, collaboratorId, updateData) {
    try {
      // Get the collaborator record to check if the current member has permission to update
      const collabResult = await identityDb.query(
        `SELECT * FROM stercs_project_collaborators 
         WHERE id = $1`,
        [collaboratorId],
      );

      if (collabResult.rows.length === 0) {
        throw new Error('Collaborator not found');
      }

      const collaborator = collabResult.rows[0];

      // Check if the current member is an admin of the project
      const adminCheck = await identityDb.query(
        `SELECT id FROM stercs_project_collaborators 
         WHERE project_id = $1 AND member_id = $2 AND role = 'admin'`,
        [collaborator.project_id, memberId],
      );

      if (adminCheck.rows.length === 0) {
        throw new Error(
          'Only project admins can update collaborator permissions',
        );
      }

      const { role, permissions } = updateData;

      const updateFields = [];
      const updateValues = [];
      let paramIndex = 3; // First two params are collaboratorId and projectId

      if (role) {
        updateFields.push(`role = $${paramIndex}`);
        updateValues.push(role);
        paramIndex++;
      }

      if (permissions) {
        updateFields.push(`permissions = $${paramIndex}`);
        updateValues.push(permissions);
        paramIndex++;
      }

      updateValues.push(collaboratorId, collaborator.project_id);

      const query = `UPDATE stercs_project_collaborators 
                     SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
                     WHERE id = $${paramIndex - 1} AND project_id = $${paramIndex}
                     RETURNING *`;

      const result = await identityDb.query(query, updateValues);

      // Log security event
      await logSecurityEvent(memberId, 'COLLABORATION_member_UPDATED', {collaboratorId: result.rows[0].id,
        memberId: result.rows[0].member_id
      });

      return {success: true,
        collaborator: result.rows[0],
        message: 'Collaborator updated successfully'
      };
    } catch (error) {
      logger.error('Error updating, collaborator:', error);
      throw error;
    }
  }

  // Remove a collaborator from a project
  static async removeCollaborator(memberId, collaboratorId) {
    try {
      // Get the collaborator record
      const collabResult = await identityDb.query(
        `SELECT * FROM stercs_project_collaborators 
         WHERE id = $1`,
        [collaboratorId],
      );

      if (collabResult.rows.length === 0) {
        throw new Error('Collaborator not found');
      }

      const collaborator = collabResult.rows[0];

      // Check if the current member is an admin of the project
      const adminCheck = await identityDb.query(
        `SELECT id FROM stercs_project_collaborators 
         WHERE project_id = $1 AND member_id = $2 AND role = 'admin'`,
        [collaborator.project_id, memberId],
      );

      if (adminCheck.rows.length === 0) {
        throw new Error('Only project admins can remove collaborators');
      }

      // Prevent removing the last admin
      if (collaborator.role === 'admin') {
        const adminCountResult = await identityDb.query(
          `SELECT COUNT(*) as count FROM stercs_project_collaborators 
           WHERE project_id = $1 AND role = 'admin'`,
          [collaborator.project_id],
        );

        if (parseInt(adminCountResult.rows[0].count) <= 1) {
          throw new Error('Cannot remove the last admin of a project');
        }
      }

      await identityDb.query(
        'DELETE FROM stercs_project_collaborators WHERE id = $1',
        [collaboratorId],
      );

      // Log security event
      await logSecurityEvent(memberId, 'COLLABORATION_member_REMOVED', {collaboratorId: collaboratorId,
        memberId: collaborator.member_id
      });

      return {success: true,
        message: 'Collaborator removed successfully'
      };
    } catch (error) {
      logger.error('Error removing, collaborator:', error);
      throw error;
    }
  }

  // Get pending invitations for a member
  static async getPendingInvitations(memberId) {
    try {
      const result = await identityDb.query(
        `SELECT sci.*, m.membername as inviter_membername, p.name as project_name
         FROM stercs_collaboration_invitations sci
         JOIN members m ON sci.inviter_id = m.id
         JOIN stercs_projects p ON sci.project_id = p.id
         WHERE sci.email = (SELECT email FROM members WHERE id = $1)
         ORDER BY sci.created_at DESC`,
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

  // Accept an invitation
  static async acceptInvitation(memberId, invitationId) {
    try {
      // Get the invitation
      const invitationResult = await identityDb.query(
        'SELECT * FROM stercs_collaboration_invitations WHERE id = $1',
        [invitationId],
      );

      if (invitationResult.rows.length === 0) {
        throw new Error('Invitation not found');
      }

      const invitation = invitationResult.rows[0];
      const memberEmailResult = await identityDb.query(
        'SELECT email FROM members WHERE id = $1',
        [memberId],
      );

      if (
        memberEmailResult.rows.length === 0 ||
        memberEmailResult.rows[0].email !== invitation.email
      ) {
        throw new Error('Invalid invitation for this member');
      }

      // Check if member is already a collaborator
      const existingCollabResult = await identityDb.query(
        `SELECT id FROM stercs_project_collaborators 
         WHERE project_id = $1 AND member_id = $2`,
        [invitation.project_id, memberId],
      );

      if (existingCollabResult.rows.length > 0) {
        throw new Error('Member is already a collaborator on this project');
      }

      // Add member as a collaborator
      const collabResult = await identityDb.query(
        `INSERT INTO stercs_project_collaborators 
         (project_id, member_id, role, permissions)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [
          invitation.project_id,
          memberId,
          invitation.role,
          invitation.permissions
        ],
      );

      // Remove the invitation
      await identityDb.query(
        'DELETE FROM stercs_collaboration_invitations WHERE id = $1',
        [invitationId],
      );

      // Log security event
      await logSecurityEvent(memberId, 'COLLABORATION_INVITE_ACCEPTED', {invitationId: invitationId,
        projectId: invitation.project_id
      });

      return {success: true,
        collaborator: collabResult.rows[0],
        message: 'Invitation accepted successfully'
      };
    } catch (error) {
      logger.error('Error accepting, invitation:', error);
      throw error;
    }
  }

  // Decline an invitation
  static async declineInvitation(memberId, invitationId) {
    try {
      // Get the invitation
      const invitationResult = await identityDb.query(
        'SELECT * FROM stercs_collaboration_invitations WHERE id = $1',
        [invitationId],
      );

      if (invitationResult.rows.length === 0) {
        throw new Error('Invitation not found');
      }

      const invitation = invitationResult.rows[0];
      const memberEmailResult = await identityDb.query(
        'SELECT email FROM members WHERE id = $1',
        [memberId],
      );

      if (
        memberEmailResult.rows.length === 0 ||
        memberEmailResult.rows[0].email !== invitation.email
      ) {
        throw new Error('Invalid invitation for this member');
      }

      // Remove the invitation
      await identityDb.query(
        'DELETE FROM stercs_collaboration_invitations WHERE id = $1',
        [invitationId],
      );

      // Log security event
      await logSecurityEvent(memberId, 'COLLABORATION_INVITE_DECLINED', {invitationId: invitationId
      });

      return {success: true,
        message: 'Invitation declined successfully'
      };
    } catch (error) {
      logger.error('Error declining, invitation:', error);
      throw error;
    }
  }
}

module.exports = CollaborationService;
