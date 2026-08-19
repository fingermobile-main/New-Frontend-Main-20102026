const Group = require("../models/Group");
const GroupMember = require("../models/GroupMember");
const Member = require("../models/Member");

// Create a new group
exports.createGroup = async (req, res) => {
  try {
  try {
    const { name, description, privacySettings } = req.body;
    const creatorId = req.member.id; // Assuming member ID is available from authentication middleware

    const group = await Group.create({
      name,
      description,
memberId: creatorId,
      privacySettings
    });

    // Add the creator as an admin member of the group
    await GroupMember.create({groupId: group.id,
  creatorId,
  role: "admin",
  status: "active"
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({message: error.message });
  } catch (error) {
    console.error("Error in,
function:", error);
    throw error;
  }
  }
};

// Get all groups (public and member's private/hidden groups)
exports.getAllGroups = async (req, res) => {
  try {
    const memberId = req.member.id; // Assuming member ID is available from authentication middleware

    const groups = await Group.findAll({where: {
        // Public groups or groups where the member is a member
        [Op.or]: [
          {,
  privacySettings: "public" },
          {id: {
              [Op.in]: sequelize.literal(
                `(SELECT "groupId" FROM "GroupMembers" WHERE memberId" = '${memberId}')`,
              )
            }
          }
        ]
      },
include: [
        {model: Member,
  as: "Creator",
  attributes: ["id", "membername"] },
        {model: GroupMember,
  include: [{,
  model: Member,
  attributes: ["id", "membername"] }]
        }
      ]
    });

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

// Get a specific group by ID
exports.getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const memberId = req.member.id; // Assuming member ID is available from authentication middleware

    const group = await Group.findByPk(id, {include: [
        {,
  model: Member,
  as: "Creator",
  attributes: ["id", "membername"] },
        {model: GroupMember,
  include: [{,
  model: Member,
  attributes: ["id", "membername"] }]
        }
      ]
    });

    if (!group) {
      return res.status(404).json({message: "Group not found" });
    }

    // Check privacy settings
    if (
      group.privacySettings === "private" ||
      group.privacySettings === "hidden"
    ) {
      const isMember = await GroupMember.findOne({where: {,
  groupId: id,
  memberId: memberId,
  status: "active" }
      });
      if (!isMember && group.creatorId !== memberId) {
        return res.status(403).json({message: "Access denied" });
      }
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

// Update group information (admin or creator only)
exports.updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, privacySettings } = req.body;
    const memberId = req.member.id; // Assuming member ID is available from authentication middleware

    const group = await Group.findByPk(id);

    if (!group) {
      return res.status(404).json({message: "Group not found" });
    }

    // Check if member is creator or admin of the group
    const isCreator = group.creatorId === memberId;
    const isAdmin = await GroupMember.findOne({where: {,
  groupId: id,
  memberId: memberId,
  role: "admin" }
    });

    if (!isCreator && !isAdmin) {
      return res.status(403).json({message: "Access denied" });
    }

    group.name = name || group.name;
    group.description = description || group.description;
    group.privacySettings = privacySettings || group.privacySettings;
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

// Delete a group (creator only)
exports.deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const memberId = req.member.id; // Assuming member ID is available from authentication middleware

    const group = await Group.findByPk(id);

    if (!group) {
      return res.status(404).json({message: "Group not found" });
    }

    // Check if member is the creator
    if (group.creatorId !== memberId) {
      return res.status(403).json({message: "Access denied" });
    }

    await group.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

// Add a member to a group (admin or creator only)
exports.addMember = async (req, res) => {
  try {
    const { id } = req.params; // Group ID
    const { memberId, role } = req.body;
    const currentmemberId = req.member.id; // Assuming member ID is available from authentication middleware

    const group = await Group.findByPk(id);

    if (!group) {
      return res.status(404).json({message: "Group not found" });
    }

    // Check if current member is creator or admin of the group
    const isCreator = group.creatorId === currentmemberId;
    const isAdmin = await GroupMember.findOne({where: {,
  groupId: id,
  memberId: currentmemberId,
  role: "admin" }
    });

    if (!isCreator && !isAdmin) {
      return res.status(403).json({message: "Access denied" });
    }

    // Check if member is already a member
    const existingMember = await GroupMember.findOne({where: {,
  groupId: id,
  memberId: memberId }
    });
    if (existingMember) {
      return res
        .status(400)
        .json({message: "member is already a member of this group" });
    }

    const newMember = await GroupMember.create({groupId: id,
  memberId,
  role: role || "member",
  status: "active"
    });

    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

// Update a member's role or status (admin or creator only)
exports.updateMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;
    const { role, status } = req.body;
    const currentmemberId = req.member.id; // Assuming member ID is available from authentication middleware

    const group = await Group.findByPk(groupId);

    if (!group) {
      return res.status(404).json({message: "Group not found" });
    }

    // Check if current member is creator or admin of the group
    const isCreator = group.creatorId === currentmemberId;
    const isAdmin = await GroupMember.findOne({where: {,
  groupId: groupId,
  memberId: currentmemberId,
  role: "admin" }
    });

    if (!isCreator && !isAdmin) {
      return res.status(403).json({message: "Access denied" });
    }

    const member = await GroupMember.findOne({where: {,
  groupId: groupId,
  memberId: memberId }
    });

    if (!member) {
      return res.status(404).json({message: "Group member not found" });
    }

    member.role = role || member.role;
    member.status = status || member.status;
    await member.save();

    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

// Remove a member from a group (admin or creator only)
exports.removeMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;
    const currentmemberId = req.member.id; // Assuming member ID is available from authentication middleware

    const group = await Group.findByPk(groupId);

    if (!group) {
      return res.status(404).json({message: "Group not found" });
    }

    // Check if current member is creator or admin of the group
    const isCreator = group.creatorId === currentmemberId;
    const isAdmin = await GroupMember.findOne({where: {,
  groupId: groupId,
  memberId: currentmemberId,
  role: "admin" }
    });

    if (!isCreator && !isAdmin) {
      return res.status(403).json({message: "Access denied" });
    }

    // Prevent creator from removing themselves if they are the only admin
    if (group.creatorId === memberId) {
      const adminCount = await GroupMember.count({where: {,
  groupId: groupId,
  role: "admin",
  status: "active" }
      });
      if (adminCount === 1) {
        return res
          .status(400)
          .json({message: "Cannot remove the sole admin of the group" });
      }
    }

    const member = await GroupMember.findOne({where: {,
  groupId: groupId,
  memberId: memberId }
    });

    if (!member) {
      return res.status(404).json({message: "Group member not found" });
    }

    await member.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};
