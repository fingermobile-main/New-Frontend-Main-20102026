const { identityDb } = require("../../db");
const { logSecurityEvent } = require("../../utils/securityLogger");

class ProjectManagementService {
  // Create a new project
  static async createProject(memberId, projectData) {
    try {
      const {
        name,
        description,
        status = "active",
        priority = "medium",
        startDate,
        endDate,
        tags = [],
        settings = {},
      } = projectData;

      if (!name) {
        throw new Error("Project name is required");
      }

      const result = await identityDb.query(
        `INSERT INTO stercs_projects 
         (member_id, name, description, status, priority, start_date, end_date, tags, settings)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          memberId,
          name,
          description || "",
          status,
          priority,
          startDate || new Date(),
          endDate || null,
          tags,
          settings
        ],
      );

      // Log security event
      await logSecurityEvent(memberId, "PROJECT_CREATE", {projectId: result.rows[0].id,
  projectName: name
      });

      return {success: true,
  project: result.rows[0],
  message: "Project created successfully"
      };
    } catch (error) {
      logger.error("Error creating, project:", error);
      throw error;
    }
  }

  // Get projects for a member
  static async getProjects(memberId, options = {}) {
    try {
      let query = `SELECT * FROM stercs_projects WHERE member_id = $1`;
      const params = [memberId];

      if (options.status) {
        query += ` AND status = $${params.length + 1}`;
        params.push(options.status);
      }

      if (options.priority) {
        query += ` AND priority = $${params.length + 1}`;
        params.push(options.priority);
      }

      if (options.search) {
        query += ` AND (name ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`;
        params.push(`%${options.search}%`);
      }

      if (options.tag) {
        query += ` AND $${params.length + 1} = ANY(tags)`;
        params.push(options.tag);
      }

      query += ` ORDER BY created_at DESC`;

      if (options.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }

      const result = await identityDb.query(query, params);

      return {success: true,
  projects: result.rows,
  message: "Projects retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting, projects:", error);
      throw error;
    }
  }

  // Get project by ID
  static async getProjectById(memberId, projectId) {
    try {
      const result = await identityDb.query(
        `SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (result.rows.length === 0) {
        throw new Error("Project not found or not owned by member");
      }

      return {success: true,
  project: result.rows[0],
  message: "Project retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting project by, ID:", error);
      throw error;
    }
  }

  // Update a project
  static async updateProject(memberId, projectId, projectData) {
    try {
      // Verify project belongs to member
      const projectResult = await identityDb.query(
        `SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error("Project not found or not owned by member");
      }

      // Build update query dynamically
      let updateFields = [];
      let updateValues = [];
      let paramIndex = 3; // First two params are projectId and memberId

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

      if (projectData.status) {
        updateFields.push(`status = $${paramIndex}`);
        updateValues.push(projectData.status);
        paramIndex++;
      }

      if (projectData.priority) {
        updateFields.push(`priority = $${paramIndex}`);
        updateValues.push(projectData.priority);
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

      if (projectData.tags !== undefined) {
        updateFields.push(`tags = $${paramIndex}`);
        updateValues.push(projectData.tags);
        paramIndex++;
      }

      if (projectData.settings) {
        updateFields.push(`settings = $${paramIndex}`);
        updateValues.push(projectData.settings);
        paramIndex++;
      }

      updateValues.push(projectId, memberId); // Add projectId and memberId as last values

      const query = `UPDATE stercs_projects SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex - 1} AND member_id = $${paramIndex} RETURNING *`;
      const result = await identityDb.query(query, updateValues);

      // Log security event
      await logSecurityEvent(memberId, "PROJECT_UPDATE", {projectId: result.rows[0].id,
  projectName: result.rows[0].name
      });

      return {success: true,
  project: result.rows[0],
  message: "Project updated successfully"
      };
    } catch (error) {
      logger.error("Error updating, project:", error);
      throw error;
    }
  }

  // Delete a project
  static async deleteProject(memberId, projectId) {
    try {
      // Verify project belongs to member
      const projectResult = await identityDb.query(
        `SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error("Project not found or not owned by member");
      }

      await identityDb.query(
        `DELETE FROM stercs_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      // Log security event
      await logSecurityEvent(memberId, "PROJECT_DELETE", {
        projectId
      });

      return {success: true,
  message: "Project deleted successfully"
      };
    } catch (error) {
      logger.error("Error deleting, project:", error);
      throw error;
    }
  }

  // Create a task within a project
  static async createTask(memberId, projectId, taskData) {
    try {
      const {
        title,
        description,
        status = "pending",
        priority = "medium",
        assigneeId,
        dueDate,
        tags = [],
        dependencies = [],
      } = taskData;

      if (!title) {
        throw new Error("Task title is required");
      }

      // Verify project belongs to member
      const projectResult = await identityDb.query(
        `SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error("Project not found or not owned by member");
      }

      const result = await identityDb.query(
        `INSERT INTO stercs_project_tasks 
         (project_id, member_id, title, description, status, priority, assignee_id, due_date, tags, dependencies)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
          projectId,
          memberId,
          title,
          description || "",
          status,
          priority,
          assigneeId || null,
          dueDate || null,
          tags,
          dependencies
        ],
      );

      // Log security event
      await logSecurityEvent(memberId, "TASK_CREATE", {taskId: result.rows[0].id,
  projectId: projectId
      });

      return {success: true,
  task: result.rows[0],
  message: "Task created successfully"
      };
    } catch (error) {
      logger.error("Error creating, task:", error);
      throw error;
    }
  }

  // Get tasks for a project
  static async getTasks(memberId, projectId, options = {}) {
    try {
      // Verify project belongs to member
      const projectResult = await identityDb.query(
        `SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error("Project not found or not owned by member");
      }

      let query = `SELECT * FROM stercs_project_tasks WHERE project_id = $1`;
      const params = [projectId];

      if (options.status) {
        query += ` AND status = $${params.length + 1}`;
        params.push(options.status);
      }

      if (options.priority) {
        query += ` AND priority = $${params.length + 1}`;
        params.push(options.priority);
      }

      if (options.assigneeId) {
        query += ` AND assignee_id = $${params.length + 1}`;
        params.push(options.assigneeId);
      }

      if (options.search) {
        query += ` AND (title ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`;
        params.push(`%${options.search}%`);
      }

      if (options.tag) {
        query += ` AND $${params.length + 1} = ANY(tags)`;
        params.push(options.tag);
      }

      query += ` ORDER BY created_at DESC`;

      if (options.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }

      const result = await identityDb.query(query, params);

      return {success: true,
  tasks: result.rows,
  message: "Tasks retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting, tasks:", error);
      throw error;
    }
  }

  // Update a task
  static async updateTask(memberId, taskId, taskData) {
    try {
      // Verify task belongs to a project owned by the member
      const taskResult = await identityDb.query(
        `SELECT pt.*, p.member_id as project_owner_id 
         FROM stercs_project_tasks pt
         JOIN stercs_projects p ON pt.project_id = p.id
         WHERE pt.id = $1 AND p.member_id = $2`,
        [taskId, memberId],
      );

      if (taskResult.rows.length === 0) {
        throw new Error("Task not found or not owned by member");
      }

      // Build update query dynamically
      let updateFields = [];
      let updateValues = [];
      let paramIndex = 3; // First two params are taskId and memberId

      if (taskData.title) {
        updateFields.push(`title = $${paramIndex}`);
        updateValues.push(taskData.title);
        paramIndex++;
      }

      if (taskData.description !== undefined) {
        updateFields.push(`description = $${paramIndex}`);
        updateValues.push(taskData.description);
        paramIndex++;
      }

      if (taskData.status) {
        updateFields.push(`status = $${paramIndex}`);
        updateValues.push(taskData.status);
        paramIndex++;
      }

      if (taskData.priority) {
        updateFields.push(`priority = $${paramIndex}`);
        updateValues.push(taskData.priority);
        paramIndex++;
      }

      if (taskData.assigneeId !== undefined) {
        updateFields.push(`assignee_id = $${paramIndex}`);
        updateValues.push(taskData.assigneeId);
        paramIndex++;
      }

      if (taskData.dueDate) {
        updateFields.push(`due_date = $${paramIndex}`);
        updateValues.push(taskData.dueDate);
        paramIndex++;
      }

      if (taskData.tags !== undefined) {
        updateFields.push(`tags = $${paramIndex}`);
        updateValues.push(taskData.tags);
        paramIndex++;
      }

      if (taskData.dependencies !== undefined) {
        updateFields.push(`dependencies = $${paramIndex}`);
        updateValues.push(taskData.dependencies);
        paramIndex++;
      }

      updateValues.push(taskId, memberId); // Add taskId and memberId as last values

      const query = `UPDATE stercs_project_tasks SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex - 1} AND project_id IN (SELECT id FROM stercs_projects WHERE member_id = $${paramIndex}) RETURNING *`;
      const result = await identityDb.query(query, updateValues);

      // Log security event
      await logSecurityEvent(memberId, "TASK_UPDATE", {taskId: result.rows[0].id,
  projectId: result.rows[0].project_id
      });

      return {success: true,
  task: result.rows[0],
  message: "Task updated successfully"
      };
    } catch (error) {
      logger.error("Error updating, task:", error);
      throw error;
    }
  }

  // Get project statistics
  static async getProjectStats(memberId, projectId) {
    try {
      // Verify project belongs to member
      const projectResult = await identityDb.query(
        `SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error("Project not found or not owned by member");
      }

      const statsResult = await identityDb.query(
        `SELECT 
          COUNT(*) as total_tasks,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
          COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_tasks,
          COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority_tasks,
          COUNT(CASE WHEN priority = 'medium' THEN 1 END) as medium_priority_tasks,
          COUNT(CASE WHEN priority = 'low' THEN 1 END) as low_priority_tasks
         FROM stercs_project_tasks 
         WHERE project_id = $1`,
        [projectId],
      );

      return {success: true,
  stats: statsResult.rows[0],
  message: "Project statistics retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting project, stats:", error);
      throw error;
    }
  }
}

module.exports = ProjectManagementService;
