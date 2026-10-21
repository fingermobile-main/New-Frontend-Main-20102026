'use strict';

const rolePermissionService = require('../services/RolePermissionService');

class RoleController {
  async getRoles(req, res) {
    try {
      const { category, search } = req.query;
      const data = await rolePermissionService.getAllRoles({ category, search });

      return res.status(200).json({
        success: true,
        ...data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Error fetching roles',
      });
    }
  }

  async getRoleById(req, res) {
    try {
      const { id } = req.params;
      const role = await rolePermissionService.getRoleById(id);

      return res.status(200).json({
        success: true,
        role,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message || 'Role not found',
      });
    }
  }

  async createRole(req, res) {
    try {
      const { name, description, category, permissions } = req.body;
      const newRole = await rolePermissionService.createCustomRole({
        name,
        description,
        category,
        permissions,
      });

      return res.status(201).json({
        success: true,
        message: 'Custom role created successfully',
        role: newRole,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to create role',
      });
    }
  }

  async updateRole(req, res) {
    try {
      const { id } = req.params;
      const { name, description, permissions } = req.body;

      const updated = await rolePermissionService.updateRole(id, {
        name,
        description,
        permissions,
      });

      return res.status(200).json({
        success: true,
        message: 'Role updated successfully',
        role: updated,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Error updating role',
      });
    }
  }

  async deleteRole(req, res) {
    try {
      const { id } = req.params;
      const result = await rolePermissionService.deleteRole(id);

      return res.status(200).json({
        success: true,
        message: 'Role deleted successfully',
        ...result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Error deleting role',
      });
    }
  }

  async getPermissions(req, res) {
    try {
      const permissions = await rolePermissionService.getAllPermissions();
      return res.status(200).json({
        success: true,
        permissions,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Error fetching permissions',
      });
    }
  }
}

module.exports = new RoleController();
