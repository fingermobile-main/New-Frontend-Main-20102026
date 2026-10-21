const logger = require('../../utils/logger');
const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/authenticate');
const MemberManagementService = require('../services/memberManagementService');

// Apply admin authentication to all member management routes
router.use(requireAdmin);

// Create a new team member
router.post('/members', async (req, res) => {
  try {
    const memberId = req.member.id;
    const memberData = req.body;

    if (!memberData.membername || !memberData.email) {
      return res.status(400).json({success: false,
        message: 'membername and email are required for team member'
      });
    }

    const result = await MemberManagementService.createTeamMember(
      memberId,
      memberData,
    );

    res.status(201).json({success: true,
      message: result.message,
      data: result.member
    });
  } catch (error) {
    logger.error('Error creating team, member:', error);
    res.status(500).json({success: false,
      message: 'Failed to create team member',
      error: error.message
    });
  }
});

// Get all team members
router.get('/members', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { role, searchTerm } = req.query;

    const result = await MemberManagementService.getTeamMembers(memberId, {role: role || null,
      searchTerm: searchTerm || null
    });

    res.status(200).json({success: true,
      message: result.message,
      data: result.members
    });
  } catch (error) {
    logger.error('Error getting team, members:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve team members',
      error: error.message
    });
  }
});

// Update a team member
router.put('/members/:memberId', async (req, res) => {
  try {
    const adminMemberId = req.member.id;
    const {memberId: memberIdToUpdate } = req.params;
    const memberData = req.body;

    const result = await MemberManagementService.updateTeamMember(
      adminMemberId,
      parseInt(memberIdToUpdate),
      memberData,
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.member
    });
  } catch (error) {
    logger.error('Error updating team, member:', error);
    res.status(500).json({success: false,
      message: 'Failed to update team member',
      error: error.message
    });
  }
});

// Delete a team member
router.delete('/members/:memberId', async (req, res) => {
  try {
    const adminMemberId = req.member.id;
    const {memberId: memberIdToDelete } = req.params;

    const result = await MemberManagementService.deleteTeamMember(
      adminMemberId,
      parseInt(memberIdToDelete),
    );

    res.status(200).json({success: true,
      message: result.message
    });
  } catch (error) {
    logger.error('Error deleting team, member:', error);
    res.status(500).json({success: false,
      message: 'Failed to delete team member',
      error: error.message
    });
  }
});

// Invite a new member
router.post('/invitations', async (req, res) => {
  try {
    const memberId = req.member.id;
    const inviteData = req.body;

    if (!inviteData.email) {
      return res.status(400).json({success: false,
        message: 'Email is required for member invitation'
      });
    }

    const result = await MemberManagementService.inviteMember(
      memberId,
      inviteData,
    );

    res.status(201).json({success: true,
      message: result.message,
      data: result.invitation
    });
  } catch (error) {
    logger.error('Error inviting, member:', error);
    res.status(500).json({success: false,
      message: 'Failed to invite member',
      error: error.message
    });
  }
});

// Get pending invitations
router.get('/invitations', async (req, res) => {
  try {
    const memberId = req.member.id;

    const result =
      await MemberManagementService.getPendingInvitations(memberId);

    res.status(200).json({success: true,
      message: result.message,
      data: result.invitations
    });
  } catch (error) {
    logger.error('Error getting pending, invitations:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve pending invitations',
      error: error.message
    });
  }
});

// Revoke an invitation
router.delete('/invitations/:invitationId', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { invitationId } = req.params;

    const result = await MemberManagementService.revokeInvitation(
      memberId,
      parseInt(invitationId),
    );

    res.status(200).json({success: true,
      message: result.message
    });
  } catch (error) {
    logger.error('Error revoking, invitation:', error);
    res.status(500).json({success: false,
      message: 'Failed to revoke invitation',
      error: error.message
    });
  }
});

module.exports = router;
