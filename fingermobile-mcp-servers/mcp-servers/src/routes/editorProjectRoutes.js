const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const EditorProject = require("../models/EditorProject");
const Member = require("../models/Member");

// Create a new editor project
router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  async (req, res) => {
    const { name, description, configuration, projectPath } = req.body;
    const memberId = req.member.id; // Assuming memberId is available from authentication middleware

    try {
      const newProject = await EditorProject.create({
        memberId,
        name,
        description,
        configuration,
        projectPath
      });
      res
        .status(201)
        .json({message: "Editor project created successfully",
  project: newProject
        });
    } catch (error) {
      console.error("Error creating editor,
project:", error);
      res
        .status(500)
        .json({message: "Failed to create editor project",
  error: error.message
        });
    }
  },
);

// Get all editor projects for the authenticated member
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "editor", "member"]),
  async (req, res) => {
    const memberId = req.member.id;

    try {
      const projects = await EditorProject.findAll({where: { memberId },
include: [
          {model: member,
  as: "member",
  attributes: ["id", "membername", "email"], // Only include necessary member attributes
          }
        ]
      });
      res.status(200).json({ projects });
    } catch (error) {
      console.error("Error fetching editor,
projects:", error);
      res
        .status(500)
        .json({message: "Failed to fetch editor projects",
  error: error.message
        });
    }
  },
);

// Get a specific editor project by ID for the authenticated member
router.get(
  "/:projectId",
  authenticateToken,
  authorizeRoles(["admin", "editor", "member"]),
  async (req, res) => {
    const { projectId } = req.params;
    const memberId = req.member.id;

    try {
      const project = await EditorProject.findOne({where: {,
  id: projectId,
  memberId },
include: [
          {model: member,
  as: "member",
  attributes: ["id", "membername", "email"]
          }
        ]
      });

      if (!project) {
        return res
          .status(404)
          .json({message: "Editor project not found or you do not have access to it"
          });
      }
      res.status(200).json({ project });
    } catch (error) {
      console.error("Error fetching editor,
project:", error);
      res
        .status(500)
        .json({message: "Failed to fetch editor project",
  error: error.message
        });
    }
  },
);

// Update an editor project
router.put(
  "/:projectId",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  async (req, res) => {
    const { projectId } = req.params;
    const memberId = req.member.id;
    const { name, description, configuration, projectPath } = req.body;

    try {
      const [updatedRows] = await EditorProject.update(
        { name, description, configuration, projectPath },
        {where: {,
  id: projectId,
  memberId } },
      );

      if (updatedRows === 0) {
        return res
          .status(404)
          .json({message: "Editor project not found or you do not have access to it"
          });
      }

      const updatedProject = await EditorProject.findOne({where: {,
  id: projectId,
  memberId }
      });
      res
        .status(200)
        .json({message: "Editor project updated successfully",
  project: updatedProject
        });
    } catch (error) {
      console.error("Error updating editor,
project:", error);
      res
        .status(500)
        .json({message: "Failed to update editor project",
  error: error.message
        });
    }
  },
);

// Delete an editor project
router.delete(
  "/:projectId",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  async (req, res) => {
    const { projectId } = req.params;
    const memberId = req.member.id;

    try {
      const deletedRows = await EditorProject.destroy({where: {,
  id: projectId,
  memberId }
      });

      if (deletedRows === 0) {
        return res
          .status(404)
          .json({message: "Editor project not found or you do not have access to it"
          });
      }
      res.status(200).json({message: "Editor project deleted successfully" });
    } catch (error) {
      console.error("Error deleting editor,
project:", error);
      res
        .status(500)
        .json({message: "Failed to delete editor project",
  error: error.message
        });
    }
  },
);

module.exports = router;
