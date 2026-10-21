'use strict';

const badgeService = require('../services/badgeService');

class BadgeController {
  async getBadges(req, res) {
    try {
      const { search } = req.query;
      const badges = await badgeService.getBadges({ search });
      return res.status(200).json({
        success: true,
        badges,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Error fetching badges',
      });
    }
  }

  async getBadgeById(req, res) {
    try {
      const { id } = req.params;
      const badge = await badgeService.getBadgeById(id);
      return res.status(200).json({
        success: true,
        badge,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message || 'Badge not found',
      });
    }
  }

  async createBadge(req, res) {
    try {
      const {
        name,
        description,
        iconSvg,
        iconUrl,
        bgColor,
        textColor,
        badgeAccessEnabled,
        accessiblePageIds,
      } = req.body;

      const badge = await badgeService.createBadge({
        name,
        description,
        iconSvg,
        iconUrl,
        bgColor,
        textColor,
        badgeAccessEnabled,
        accessiblePageIds,
      });

      return res.status(201).json({
        success: true,
        message: 'Member badge created successfully',
        badge,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Error creating badge',
      });
    }
  }

  async updateBadge(req, res) {
    try {
      const { id } = req.params;
      const updated = await badgeService.updateBadge(id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Badge updated successfully',
        badge: updated,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Error updating badge',
      });
    }
  }

  async deleteBadge(req, res) {
    try {
      const { id } = req.params;
      const result = await badgeService.deleteBadge(id);

      return res.status(200).json({
        success: true,
        message: 'Badge deleted successfully',
        ...result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Error deleting badge',
      });
    }
  }

  async assignBadge(req, res) {
    try {
      const { id } = req.params;
      const { members, assignedBy } = req.body;

      const result = await badgeService.assignBadge(id, { members, assignedBy });
      return res.status(200).json({
        success: true,
        message: 'Badge assigned to members successfully',
        ...result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Error assigning badge',
      });
    }
  }

  async unassignBadge(req, res) {
    try {
      const { id } = req.params;
      const { memberId } = req.body;

      const result = await badgeService.unassignBadge(id, memberId);
      return res.status(200).json({
        success: true,
        message: 'Badge removed from member',
        ...result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Error unassigning badge',
      });
    }
  }

  async getMembers(req, res) {
    try {
      const { id } = req.params;
      const members = await badgeService.getBadgeMembers(id);
      return res.status(200).json({
        success: true,
        members,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Error fetching badge members',
      });
    }
  }

  async toggleMute(req, res) {
    try {
      const { id, memberId } = req.params;
      const target = await badgeService.toggleMuteMember(id, memberId);
      return res.status(200).json({
        success: true,
        message: `Member ${target.isMuted ? 'muted' : 'unmuted'} successfully`,
        assignment: target,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Error toggling member mute status',
      });
    }
  }
}

module.exports = new BadgeController();
