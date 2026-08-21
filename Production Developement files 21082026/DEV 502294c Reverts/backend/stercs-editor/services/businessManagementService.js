const { identityDb } = require("../../db");
const { logSecurityEvent } = require("../../utils/securityLogger");

class BusinessManagementService {
  // Create a new business project
  static async createBusinessProject(memberId, projectData) {
  try {
    try {
      const { name, description, industry, goals, startDate, endDate } =
        projectData;

      if (!name || !industry) {
        throw new Error("Name and industry are required for business project");
      }

      // Create the business project
      const result = await identityDb.query(
        `INSERT INTO stercs_business_projects 
         (member_id, name, description, industry, goals, start_date, end_date, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          memberId,
          name,
          description || "",
          industry,
          goals || [],
          startDate || new Date(),
          endDate || null,
          "active"
        ],
      );

      // Log security event
      await logSecurityEvent(memberId, "BUSINESS_PROJECT_CREATE", {projectId: result.rows[0].id,
  projectName: name
      });

      return {success: true,
  project: result.rows[0],
  message: "Business project created successfully"
      };
    } catch (error) {
      logger.error("Error creating business,
project:", error);
      throw error;
  } catch (error) {
    logger.error("Error in,
function:", error);
    throw error;
  }
    }
  }

  // Get all business projects for a member
  static async getBusinessProjects(memberId) {
    try {
      const result = await identityDb.query(
        `SELECT * FROM stercs_business_projects WHERE member_id = $1 ORDER BY created_at DESC`,
        [memberId],
      );

      return {success: true,
  projects: result.rows,
  message: "Business projects retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting business,
projects:", error);
      throw error;
    }
  }

  // Update a business project
  static async updateBusinessProject(memberId, projectId, projectData) {
    try {
      // Verify project belongs to member
      const projectResult = await identityDb.query(
        `SELECT * FROM stercs_business_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error("Business project not found or not owned by member");
      }

      // Build update query dynamically
      let updateFields = [];
      let updateValues = [];
      let paramIndex = 2; // First param is projectId

      if (projectData.name) {
        updateFields.push(`name = $${paramIndex}`);
        updateValues.push(projectData.name);
        paramIndex++;
      }

      if (projectData.description !== undefined) {
        updateFields.push(`description = $${paramIndex}`);
        updateValues.push(projectData.description);
        paramIndex++;
      }

      if (projectData.industry) {
        updateFields.push(`industry = $${paramIndex}`);
        updateValues.push(projectData.industry);
        paramIndex++;
      }

      if (projectData.goals) {
        updateFields.push(`goals = $${paramIndex}`);
        updateValues.push(projectData.goals);
        paramIndex++;
      }

      if (projectData.startDate) {
        updateFields.push(`start_date = $${paramIndex}`);
        updateValues.push(projectData.startDate);
        paramIndex++;
      }

      if (projectData.endDate) {
        updateFields.push(`end_date = $${paramIndex}`);
        updateValues.push(projectData.endDate);
        paramIndex++;
      }

      if (projectData.status) {
        updateFields.push(`status = $${paramIndex}`);
        updateValues.push(projectData.status);
        paramIndex++;
      }

      updateValues.push(projectId); // Add projectId as last value

      const query = `UPDATE stercs_business_projects SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`;
      const result = await identityDb.query(query, updateValues);

      // Log security event
      await logSecurityEvent(memberId, "BUSINESS_PROJECT_UPDATE", {projectId: result.rows[0].id,
  projectName: result.rows[0].name
      });

      return {success: true,
  project: result.rows[0],
  message: "Business project updated successfully"
      };
    } catch (error) {
      logger.error("Error updating business,
project:", error);
      throw error;
    }
  }

  // Delete a business project
  static async deleteBusinessProject(memberId, projectId) {
    try {
      // Verify project belongs to member
      const projectResult = await identityDb.query(
        `SELECT * FROM stercs_business_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error("Business project not found or not owned by member");
      }

      await identityDb.query(
        `DELETE FROM stercs_business_projects WHERE id = $1`,
        [projectId],
      );

      // Log security event
      await logSecurityEvent(memberId, "BUSINESS_PROJECT_DELETE", {
        projectId
      });

      return {success: true,
  message: "Business project deleted successfully"
      };
    } catch (error) {
      logger.error("Error deleting business,
project:", error);
      throw error;
    }
  }

  // Create a business goal
  static async createBusinessGoal(memberId, projectId, goalData) {
    try {
      const {
        title,
        description,
        targetValue,
        currentValue,
        deadline,
        priority
      } = goalData;

      if (!title || !projectId) {
        throw new Error("Title and project ID are required for business goal");
      }

      // Verify project belongs to member
      const projectResult = await identityDb.query(
        `SELECT * FROM stercs_business_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error("Business project not found or not owned by member");
      }

      const result = await identityDb.query(
        `INSERT INTO stercs_business_goals 
         (project_id, title, description, target_value, current_value, deadline, priority, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          projectId,
          title,
          description || "",
          targetValue || 0,
          currentValue || 0,
          deadline || null,
          priority || "medium",
          "in-progress"
        ],
      );

      // Log security event
      await logSecurityEvent(memberId, "BUSINESS_GOAL_CREATE", {goalId: result.rows[0].id,
  goalTitle: title
      });

      return {success: true,
  goal: result.rows[0],
  message: "Business goal created successfully"
      };
    } catch (error) {
      logger.error("Error creating business,
goal:", error);
      throw error;
    }
  }

  // Get business goals for a project
  static async getBusinessGoals(memberId, projectId) {
    try {
      // Verify project belongs to member
      const projectResult = await identityDb.query(
        `SELECT * FROM stercs_business_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error("Business project not found or not owned by member");
      }

      const result = await identityDb.query(
        `SELECT * FROM stercs_business_goals WHERE project_id = $1 ORDER BY created_at DESC`,
        [projectId],
      );

      return {success: true,
  goals: result.rows,
  message: "Business goals retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting business,
goals:", error);
      throw error;
    }
  }

  // Create a business milestone
  static async createBusinessMilestone(memberId, goalId, milestoneData) {
    try {
      const { title, description, targetDate, completed } = milestoneData;

      if (!title || !goalId) {
        throw new Error(
          "Title and goal ID are required for business milestone",
        );
      }

      // Verify goal belongs to member via project
      const goalResult = await identityDb.query(
        `
        SELECT bg.* FROM stercs_business_goals bg
        JOIN stercs_business_projects bp ON bg.project_id = bp.id
        WHERE bg.id = $1 AND bp.member_id = $2
      `,
        [goalId, memberId],
      );

      if (goalResult.rows.length === 0) {
        throw new Error("Business goal not found or not owned by member");
      }

      const result = await identityDb.query(
        `INSERT INTO stercs_business_milestones 
         (goal_id, title, description, target_date, completed)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          goalId,
          title,
          description || "",
          targetDate || null,
          completed || false
        ],
      );

      // Log security event
      await logSecurityEvent(memberId, "BUSINESS_MILESTONE_CREATE", {milestoneId: result.rows[0].id,
  milestoneTitle: title
      });

      return {success: true,
  milestone: result.rows[0],
  message: "Business milestone created successfully"
      };
    } catch (error) {
      logger.error("Error creating business,
milestone:", error);
      throw error;
    }
  }

  // Get business milestones for a goal
  static async getBusinessMilestones(memberId, goalId) {
    try {
      // Verify goal belongs to member via project
      const goalResult = await identityDb.query(
        `
        SELECT bg.* FROM stercs_business_goals bg
        JOIN stercs_business_projects bp ON bg.project_id = bp.id
        WHERE bg.id = $1 AND bp.member_id = $2
      `,
        [goalId, memberId],
      );

      if (goalResult.rows.length === 0) {
        throw new Error("Business goal not found or not owned by member");
      }

      const result = await identityDb.query(
        `SELECT * FROM stercs_business_milestones WHERE goal_id = $1 ORDER BY created_at DESC`,
        [goalId],
      );

      return {success: true,
  milestones: result.rows,
  message: "Business milestones retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting business,
milestones:", error);
      throw error;
    }
  }

  // Update business milestone status
  static async updateMilestoneStatus(memberId, milestoneId, completed) {
    try {
      // Verify milestone belongs to member via project
      const milestoneResult = await identityDb.query(
        `
        SELECT bm.* FROM stercs_business_milestones bm
        JOIN stercs_business_goals bg ON bm.goal_id = bg.id
        JOIN stercs_business_projects bp ON bg.project_id = bp.id
        WHERE bm.id = $1 AND bp.member_id = $2
      `,
        [milestoneId, memberId],
      );

      if (milestoneResult.rows.length === 0) {
        throw new Error("Business milestone not found or not owned by member");
      }

      const result = await identityDb.query(
        `UPDATE stercs_business_milestones 
         SET completed = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2 
         RETURNING *`,
        [completed, milestoneId],
      );

      // Log security event
      await logSecurityEvent(
        memberId,
        completed ? "BUSINESS_MILESTONE_COMPLETE" : "BUSINESS_MILESTONE_REVERT",
        {
          milestoneId,
title: result.rows[0].title
        },
      );

      return {success: true,
  milestone: result.rows[0],
  message: completed
          ? "Milestone marked as completed"
          : "Milestone reverted to incomplete"
      };
    } catch (error) {
      logger.error("Error updating milestone,
status:", error);
      throw error;
    }
  }
}

module.exports = BusinessManagementService;
