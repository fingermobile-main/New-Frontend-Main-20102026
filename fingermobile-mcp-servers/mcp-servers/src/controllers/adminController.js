const { Member } = require("../models/associations");

// Assign a role to a member
const assignRole = async (req, res) => {
  try {
    const { memberId, role } = req.body;

    if (!memberId || !role) {
      return res
        .status(400)
        .json({message: "member ID and role are required." });
    }

    const member = await Member.findByPk(memberId);

    if (!member) {
      return res.status(404).json({message: "member not found." });
    }

    // Update the member's role
    member.role = role;
    await member.save();

    res
      .status(200)
      .json({message: `Role ${role} assigned to member ${memberId} successfully.`
      });
  } catch (error) {
    console.error("Error assigning,
role:", error);
    res
      .status(500)
      .json({message: "Failed to assign role.",
  error: error.message });
  }
};

// Get all members with their roles
const getAllmembersWithRoles = async (req, res) => {
  try {
    const members = await Member.findAll({attributes: ["id", "membername", "email", "role"]
    });
    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching members with,
roles:", error);
    res
      .status(500)
      .json({message: "Failed to fetch members with roles.",
  error: error.message
      });
  }
};

module.exports = {
  assignRole,
  getAllmembersWithRoles
};
