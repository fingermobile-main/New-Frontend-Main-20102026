'use strict';

const memberAccessService = require('../services/memberAccessService');

class MemberAccessController {
  async getOverview(req, res) {
    try {
      const overview = await memberAccessService.getOverview();
      return res.status(200).json({
        success: true,
        ...overview,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Error fetching member access overview',
      });
    }
  }

  async getRoles(req, res) {
    try {
      const { search } = req.query;
      const roles = await memberAccessService.getMemberRoles({ search });
      return res.status(200).json({
        success: true,
        roles,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Error fetching member roles',
      });
    }
  }

  async createRole(req, res) {
    try {
      const { name, description, accessiblePageIds } = req.body;
      const role = await memberAccessService.createMemberRole({
        name,
        description,
        accessiblePageIds,
      });

      return res.status(201).json({
        success: true,
        message: 'Member role created successfully',
        role,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Error creating member role',
      });
    }
  }

  async updateRole(req, res) {
    try {
      const { id } = req.params;
      const { name, description, accessiblePageIds } = req.body;

      const updated = await memberAccessService.updateMemberRole(id, {
        name,
        description,
        accessiblePageIds,
      });

      return res.status(200).json({
        success: true,
        message: 'Member role updated successfully',
        role: updated,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Error updating member role',
      });
    }
  }

  async deleteRole(req, res) {
    try {
      const { id } = req.params;
      const result = await memberAccessService.deleteMemberRole(id);

      return res.status(200).json({
        success: true,
        message: 'Member role deleted successfully',
        ...result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Error deleting member role',
      });
    }
  }

  async getPages(req, res) {
    try {
      const pages = await memberAccessService.getMemberPages();
      return res.status(200).json({
        success: true,
        pages,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Error fetching member pages',
      });
    }
  }

  async updatePagePermissions(req, res) {
    try {
      const { pageId } = req.params;
      const { allowedRoleIds } = req.body;

      if (!Array.isArray(allowedRoleIds)) {
        return res.status(400).json({
          success: false,
          message: 'allowedRoleIds must be an array',
        });
      }

      const updated = await memberAccessService.updatePagePermissions(pageId, {
        allowedRoleIds,
      });

      return res.status(200).json({
        success: true,
        message: 'Page access permissions updated',
        page: updated,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Error updating page permissions',
      });
    }
  }
}

module.exports = new MemberAccessController();
