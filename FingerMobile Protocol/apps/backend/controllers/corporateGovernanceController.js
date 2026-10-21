/**
 * FingerMobile Protocol - Corporate Governance Controller
 * Blueprint Reference: FingerMobile corporate governance and structure 14102026.md
 */

const corporateGovernanceService = require('../services/corporateGovernanceService');

exports.getRoles = (req, res) => {
  try {
    const roles = corporateGovernanceService.getRoles();
    return res.status(200).json({
      success: true,
      count: roles.length,
      data: roles
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getRoleById = (req, res) => {
  try {
    const { id } = req.params;
    const role = corporateGovernanceService.getRoleById(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: `Corporate Role with ID ${id} not found.`
      });
    }
    return res.status(200).json({
      success: true,
      data: role
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.createRole = (req, res) => {
  try {
    const role = corporateGovernanceService.createRole(req.body);
    return res.status(201).json({
      success: true,
      message: `Role ${role.title} created successfully.`,
      data: role
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.updateRole = (req, res) => {
  try {
    const { id } = req.params;
    const updated = corporateGovernanceService.updateRole(id, req.body);
    return res.status(200).json({
      success: true,
      message: `Role ${updated.title} updated successfully.`,
      data: updated
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.deleteRole = (req, res) => {
  try {
    const { id } = req.params;
    const result = corporateGovernanceService.deleteRole(id);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.addSubOffice = (req, res) => {
  try {
    const { roleId } = req.params;
    const unit = corporateGovernanceService.addSubOffice(roleId, req.body);
    return res.status(201).json({
      success: true,
      message: `Sub-office unit ${unit.name} added successfully.`,
      data: unit
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.updateSubOffice = (req, res) => {
  try {
    const { roleId, subOfficeId } = req.params;
    const unit = corporateGovernanceService.updateSubOffice(roleId, subOfficeId, req.body);
    return res.status(200).json({
      success: true,
      message: `Sub-office unit ${unit.name} updated successfully.`,
      data: unit
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.deleteSubOffice = (req, res) => {
  try {
    const { roleId, subOfficeId } = req.params;
    const result = corporateGovernanceService.deleteSubOffice(roleId, subOfficeId);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.getDoaMatrix = (req, res) => {
  try {
    const matrix = corporateGovernanceService.getDoaMatrix();
    return res.status(200).json({
      success: true,
      count: matrix.length,
      data: matrix
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getRaciMatrix = (req, res) => {
  try {
    const matrix = corporateGovernanceService.getRaciMatrix();
    return res.status(200).json({
      success: true,
      count: matrix.length,
      data: matrix
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getSodSafeguards = (req, res) => {
  try {
    const safeguards = corporateGovernanceService.getSodSafeguards();
    return res.status(200).json({
      success: true,
      count: safeguards.length,
      data: safeguards
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.assignMemberToRole = (req, res) => {
  try {
    const { memberId, roleId, subOfficeId, assignedBy, memberDetails } = req.body;
    if (!memberId || !roleId) {
      return res.status(400).json({
        success: false,
        message: 'memberId and roleId are required fields.'
      });
    }

    const assignment = corporateGovernanceService.assignMemberToRole(
      memberId,
      roleId,
      subOfficeId,
      assignedBy || req.user?.username || 'owner_mbah_israel_obinna',
      memberDetails
    );

    return res.status(200).json({
      success: true,
      message: `Member ${memberId} successfully assigned to ${assignment.roleTitle}.`,
      data: assignment
    });
  } catch (err) {
    const statusCode = err.message.includes('UNAUTHORIZED_ACTION') ? 403 : 400;
    return res.status(statusCode).json({
      success: false,
      message: err.message
    });
  }
};

exports.getMemberAssignments = (req, res) => {
  try {
    const assignments = corporateGovernanceService.getMemberAssignments();
    return res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getAuditLogs = (req, res) => {
  try {
    const logs = corporateGovernanceService.getAuditLogs();
    return res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
