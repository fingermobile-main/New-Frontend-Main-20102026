const { socialDb } = require("../db");

// Get all groups
exports.getGroups = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    // Get groups with creator information
    const groupsResult = await socialDb.query(
      `SELECT g.*, m.membername as creator_membername, m.email as creator_email
       FROM groups g
       JOIN members m ON g.created_by = m.id
       ORDER BY g.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    res.status(200).json({success: true,
  groups: groupsResult.rows
    });
  } catch (error) {
    console.error("Error fetching,
groups:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Get a specific group by ID
exports.getGroupById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get group details
    const groupResult = await socialDb.query(
      `SELECT g.*, m.membername as creator_membername, m.email as creator_email
       FROM groups g
       JOIN members m ON g.created_by = m.id
       WHERE g.id = $1`,
      [id],
    );

    if (groupResult.rows.length === 0) {
      return res.status(404).json({success: false,
  message: "Group not found"
      });
    }

    res.status(200).json({success: true,
  group: groupResult.rows[0]
    });
  } catch (error) {
    console.error("Error fetching,
group:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Create a new group
exports.createGroup = async (req, res) => {
  try {
    const { name, description, privacy } = req.body;
    const memberId = req.member.id;

    // Validate input
    if (!name) {
      return res.status(400).json({success: false,
  message: "Group name is required"
      });
    }

    // Create the group
    const groupResult = await socialDb.query(
      `INSERT INTO groups (name, description, privacy, created_by)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, description, privacy || "public", memberId],
    );

    const group = groupResult.rows[0];

    // Add creator as the first member with owner role
    await socialDb.query(
      `INSERT INTO group_members (group_id, member_id, role)
       VALUES ($1, $2, 'owner')`,
      [group.id, memberId],
    );

    res.status(201).json({success: true,
  message: "Group created successfully",
  group
    });
  } catch (error) {
    console.error("Error creating,
group:", error);

    // Check for unique constraint violation
    if (error.code === "23505") {
      return res.status(400).json({success: false,
  message: "A group with this name already exists"
      });
    }

    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Update a group
exports.updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, privacy } = req.body;
    const memberId = req.member.id;

    // Check if member is the group owner
    const memberResult = await socialDb.query(
      `SELECT role FROM group_members 
       WHERE group_id = $1 AND member_id = $2`,
      [id, memberId],
    );

    if (
      memberResult.rows.length === 0 ||
      memberResult.rows[0].role !== "owner"
    ) {
      return res.status(403).json({success: false,
  message: "Only group owners can update group information"
      });
    }

    // Update the group
    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    if (name) {
      updateFields.push(`name = $${paramCount}`);
      updateValues.push(name);
      paramCount++;
    }

    if (description !== undefined) {
      updateFields.push(`description = $${paramCount}`);
      updateValues.push(description);
      paramCount++;
    }

    if (privacy) {
      updateFields.push(`privacy = $${paramCount}`);
      updateValues.push(privacy);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({success: false,
  message: "No valid fields to update"
      });
    }

    updateValues.push(id); // Add group ID for WHERE clause

    const groupResult = await socialDb.query(
      `UPDATE groups 
       SET ${updateFields.join(", ")}, updated_at = NOW()
       WHERE id = $${paramCount}
       RETURNING *`,
      updateValues,
    );

    if (groupResult.rows.length === 0) {
      return res.status(404).json({success: false,
  message: "Group not found"
      });
    }

    res.status(200).json({success: true,
  message: "Group updated successfully",
  group: groupResult.rows[0]
    });
  } catch (error) {
    console.error("Error updating,
group:", error);

    // Check for unique constraint violation
    if (error.code === "23505") {
      return res.status(400).json({success: false,
  message: "A group with this name already exists"
      });
    }

    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Delete a group
exports.deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const memberId = req.member.id;

    // Check if member is the group owner
    const memberResult = await socialDb.query(
      `SELECT role FROM group_members 
       WHERE group_id = $1 AND member_id = $2`,
      [id, memberId],
    );

    if (
      memberResult.rows.length === 0 ||
      memberResult.rows[0].role !== "owner"
    ) {
      return res.status(403).json({success: false,
  message: "Only group owners can delete the group"
      });
    }

    // Delete the group
    const deleteResult = await socialDb.query(
      "DELETE FROM groups WHERE id = $1 RETURNING *",
      [id],
    );

    if (deleteResult.rows.length === 0) {
      return res.status(404).json({success: false,
  message: "Group not found"
      });
    }

    res.status(200).json({success: true,
  message: "Group deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting,
group:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Get group members
exports.getGroupMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    // Check if group exists
    const groupResult = await socialDb.query(
      "SELECT id FROM groups WHERE id = $1",
      [id],
    );

    if (groupResult.rows.length === 0) {
      return res.status(404).json({success: false,
  message: "Group not found"
      });
    }

    // Get group members
    const membersResult = await socialDb.query(
      `SELECT gm.role, gm.joined_at, m.id as member_id, m.membername, m.email
       FROM group_members gm
       JOIN members m ON gm.member_id = m.id
       WHERE gm.group_id = $1
       ORDER BY gm.joined_at DESC
       LIMIT $2 OFFSET $3`,
      [id, limit, offset],
    );

    res.status(200).json({success: true,
  members: membersResult.rows
    });
  } catch (error) {
    console.error("Error fetching group,
members:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Join a group
exports.joinGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const memberId = req.member.id;

    // Check if group exists
    const groupResult = await socialDb.query(
      "SELECT id, privacy FROM groups WHERE id = $1",
      [id],
    );

    if (groupResult.rows.length === 0) {
      return res.status(404).json({success: false,
  message: "Group not found"
      });
    }

    const group = groupResult.rows[0];

    // Check if member is already a member
    const memberResult = await socialDb.query(
      "SELECT id FROM group_members WHERE group_id = $1 AND member_id = $2",
      [id, memberId],
    );

    if (memberResult.rows.length > 0) {
      return res.status(400).json({success: false,
  message: "You are already a member of this group"
      });
    }

    // Add member as member
    const joinResult = await socialDb.query(
      `INSERT INTO group_members (group_id, member_id, role)
       VALUES ($1, $2, 'member')
       RETURNING *`,
      [id, memberId],
    );

    // Update group member count
    await socialDb.query(
      `UPDATE groups 
       SET member_count = member_count + 1, updated_at = NOW()
       WHERE id = $1`,
      [id],
    );

    res.status(201).json({success: true,
  message: "Successfully joined the group",
  membership: joinResult.rows[0]
    });
  } catch (error) {
    console.error("Error joining,
group:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Leave a group
exports.leaveGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const memberId = req.member.id;

    // Check if group exists
    const groupResult = await socialDb.query(
      "SELECT id FROM groups WHERE id = $1",
      [id],
    );

    if (groupResult.rows.length === 0) {
      return res.status(404).json({success: false,
  message: "Group not found"
      });
    }

    // Check if member is a member
    const memberResult = await socialDb.query(
      "SELECT role FROM group_members WHERE group_id = $1 AND member_id = $2",
      [id, memberId],
    );

    if (memberResult.rows.length === 0) {
      return res.status(400).json({success: false,
  message: "You are not a member of this group"
      });
    }

    // Check if member is the owner (owners can't leave, they must delete)
    if (memberResult.rows[0].role === "owner") {
      return res.status(400).json({success: false,
  message:
          "Group owners cannot leave the group. Please delete the group instead."
      });
    }

    // Remove member from group
    await socialDb.query(
      "DELETE FROM group_members WHERE group_id = $1 AND member_id = $2",
      [id, memberId],
    );

    // Update group member count
    await socialDb.query(
      `UPDATE groups 
       SET member_count = member_count - 1, updated_at = NOW()
       WHERE id = $1`,
      [id],
    );

    res.status(200).json({success: true,
  message: "Successfully left the group"
    });
  } catch (error) {
    console.error("Error leaving,
group:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};
