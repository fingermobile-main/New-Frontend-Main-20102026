const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../../middleware/authenticate");
const CollaborationService = require("../services/collaborationService");

// Apply admin authentication to all collaboration routes
router.use(requireAdmin);

// Invite a member to collaborate on a project
router.post("/invite", async (req, res) => {
  try {
    const memberId = req.member.id;
    const inviteData = req.body;

    if (!inviteData.projectId || !inviteData.email) {
      return res.status(400).json({success: false,
  message: "Project ID and email are required for inviting a member"
      });
    }

    const result = await CollaborationService.inviteMember(
      memberId,
      inviteData,
    );

    res.status(201).json({success: true,
  message: result.message,
  data: result.invitation || result.collaborator
    });
  } catch (error) {
    logger.error("Error inviting, member:", error);
    res.status(500).json({success: false,
  message: "Failed to invite member",
  error: error.message
    });
  }
});

// Get project collaborators
router.get("/project/:projectId", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId } = req.params;

    const result = await CollaborationService.getProjectCollaborators(
      memberId,
      parseInt(projectId),
    );

    res.status(200).json({success: true,
  message: result.message,
  data: result.collaborators
    });
  } catch (error) {
    logger.error("Error getting project, collaborators:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve project collaborators",
  error: error.message
    });
  }
});

// Update collaborator permissions
router.put("/:collaboratorId", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { collaboratorId } = req.params;
    const updateData = req.body;

    const result = await CollaborationService.updateCollaborator(
      memberId,
      parseInt(collaboratorId),
      updateData,
    );

    res.status(200).json({success: true,
  message: result.message,
  data: result.collaborator
    });
  } catch (error) {
    logger.error("Error updating, collaborator:", error);
    res.status(500).json({success: false,
  message: "Failed to update collaborator",
  error: error.message
    });
  }
});

// Remove a collaborator from a project
router.delete("/:collaboratorId", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { collaboratorId } = req.params;

    const result = await CollaborationService.removeCollaborator(
      memberId,
      parseInt(collaboratorId),
    );

    res.status(200).json({success: true,
  message: result.message
    });
  } catch (error) {
    logger.error("Error removing, collaborator:", error);
    res.status(500).json({success: false,
  message: "Failed to remove collaborator",
  error: error.message
    });
  }
});

// Get pending invitations for the current member
router.get("/invitations", async (req, res) => {
  try {
    const memberId = req.member.id;

    const result = await CollaborationService.getPendingInvitations(memberId);

    res.status(200).json({success: true,
  message: result.message,
  data: result.invitations
    });
  } catch (error) {
    logger.error("Error getting pending, invitations:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve pending invitations",
  error: error.message
    });
  }
});

// Accept an invitation
router.post("/invitations/:invitationId/accept", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { invitationId } = req.params;

    const result = await CollaborationService.acceptInvitation(
      memberId,
      parseInt(invitationId),
    );

    res.status(200).json({success: true,
  message: result.message,
  data: result.collaborator
    });
  } catch (error) {
    logger.error("Error accepting, invitation:", error);
    res.status(500).json({success: false,
  message: "Failed to accept invitation",
  error: error.message
    });
  }
});

// Decline an invitation
router.post("/invitations/:invitationId/decline", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { invitationId } = req.params;

    const result = await CollaborationService.declineInvitation(
      memberId,
      parseInt(invitationId),
    );

    res.status(200).json({success: true,
  message: result.message
    });
  } catch (error) {
    logger.error("Error declining, invitation:", error);
    res.status(500).json({success: false,
  message: "Failed to decline invitation",
  error: error.message
    });
  }
});

module.exports = router;
