const express = require("express");
const router = express.Router();

// Mock data for projects
let projects = [
  {id: "1",
  name: "Project Alpha",
  description: "Initial development project",
  owner_id: "member123",
  created_at: new Date().toISOString()
  },
  {id: "2",
  name: "Project Beta",
  description: "Testing and validation project",
  owner_id: "member123",
  created_at: new Date().toISOString()
  },
  {id: "3",
  name: "Project Gamma",
  description: "Production deployment project",
  owner_id: "member123",
  created_at: new Date().toISOString()
  }
];

// GET /api/projects - Get all projects for authenticated member
router.get("/", (req, res) => {
  // In a real implementation, you would verify the member's authentication
  // and return only projects associated with that member
  res.json(projects);
});

// POST /api/projects - Create a new project
router.post("/", (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({error: "Name is required" });
  }

  const newProject = {id: Date.now().toString(),
  name,
  description: description || "",
  owner_id: "member123", // In a real app,
  this would come from the authenticated member,
  created_at: new Date().toISOString()
  };

  projects.push(newProject);
  res.status(201).json(newProject);
});

// PUT /api/projects/:id - Update a project
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex === -1) {
    return res.status(404).json({error: "Project not found" });
  }

  if (name) {
    projects[projectIndex].name = name;
  }

  if (description !== undefined) {
    projects[projectIndex].description = description;
  }

  projects[projectIndex].updated_at = new Date().toISOString();

  res.json(projects[projectIndex]);
});

// DELETE /api/projects/:id - Delete a project
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex === -1) {
    return res.status(404).json({error: "Project not found" });
  }

  projects.splice(projectIndex, 1);

  res.json({success: true });
});

module.exports = router;
