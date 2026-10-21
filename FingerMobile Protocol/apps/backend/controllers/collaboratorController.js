'use strict';

const collaboratorService = require('../services/collaboratorService');

class CollaboratorController {
  async getCollaborators(req, res) {
    try {
      const { page, limit, search, roleId, status } = req.query;
      const data = await collaboratorService.getCollaborators({
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
        search,
        roleId,
        status,
      });

      return res.status(200).json({
        success: true,
        ...data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Error fetching collaborators',
      });
    }
  }

  async inviteCollaborator(req, res) {
    try {
      const { email, name, roleIds, locationScope } = req.body;
      const collaborator = await collaboratorService.inviteCollaborator({
        email,
        name,
        roleIds,
        locationScope,
      });

      return res.status(201).json({
        success: true,
        message: 'Invitation sent successfully and seat reserved',
        collaborator,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to invite collaborator',
      });
    }
  }

  async updateRoles(req, res) {
    try {
      const { id } = req.params;
      const { roleIds } = req.body;

      if (!Array.isArray(roleIds)) {
        return res.status(400).json({
          success: false,
          message: 'roleIds must be an array of role identifiers',
        });
      }

      const updated = await collaboratorService.updateCollaboratorRoles(id, { roleIds });
      return res.status(200).json({
        success: true,
        message: 'Collaborator roles updated successfully',
        collaborator: updated,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Error updating collaborator roles',
      });
    }
  }

  async updateLocations(req, res) {
    try {
      const { id } = req.params;
      const { type, locationIds, locationNames } = req.body;

      const updated = await collaboratorService.updateCollaboratorLocations(id, {
        type,
        locationIds,
        locationNames,
      });

      return res.status(200).json({
        success: true,
        message: 'Collaborator location restrictions updated',
        collaborator: updated,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Error updating location restrictions',
      });
    }
  }

  async removeCollaborator(req, res) {
    try {
      const { id } = req.params;
      const result = await collaboratorService.removeCollaborator(id);

      return res.status(200).json({
        success: true,
        message: 'Collaborator removed and seat freed',
        ...result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Error removing collaborator',
      });
    }
  }

  async upgradeSeatPlan(req, res) {
    try {
      const { totalSeats } = req.body;
      const seats = await collaboratorService.upgradeSeatPlan(totalSeats || 20);

      return res.status(200).json({
        success: true,
        message: 'Collaborator seat quota upgraded',
        seats,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Error upgrading seat plan',
      });
    }
  }
}

module.exports = new CollaboratorController();
