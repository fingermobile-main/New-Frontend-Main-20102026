const express = require("express");
const router = express.Router();

// Mock data for tasks
let tasks = [
  {id: "1",
  title: "Setup project",
  description: "Initialize the project structure",
  completed: true,
  project_id: "1",
  created_at: new Date().toISOString()
  },
  {id: "2",
  title: "Design UI",
  description: "Create member interface mockups",
  completed: false,
  project_id: "1",
  due_date: "2025-01-10",
  created_at: new Date().toISOString()
  },
  {id: "3",
  title: "Implement auth",
  description: "Add authentication system",
  completed: false,
  project_id: "1",
  due_date: "2025-01-15",
  created_at: new Date().toISOString()
  }
];

// GET /api/tasks - Get all tasks, optionally filtered by project
router.get("/", (req, res) => {
  const { projectId } = req.query;

  let filteredTasks = tasks;

  if (projectId) {
    filteredTasks = tasks.filter((task) => task.project_id === projectId);
  }

  res.json(filteredTasks);
});

// POST /api/tasks - Create a new task
router.post("/", (req, res) => {
  const { title, description, projectId, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({error: "Title is required" });
  }

  const newTask = {id: Date.now().toString(),
  title,
  description: description || "",
  completed: false,
  project_id: projectId || null,
  due_date: dueDate || null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id - Update a task
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, completed, dueDate } = req.body;

  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({error: "Task not found" });
  }

  if (title !== undefined) {
    tasks[taskIndex].title = title;
  }

  if (description !== undefined) {
    tasks[taskIndex].description = description;
  }

  if (completed !== undefined) {
    tasks[taskIndex].completed = completed;
  }

  if (dueDate !== undefined) {
    tasks[taskIndex].due_date = dueDate;
  }

  tasks[taskIndex].updated_at = new Date().toISOString();

  res.json(tasks[taskIndex]);
});

// DELETE /api/tasks/:id - Delete a task
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({error: "Task not found" });
  }

  tasks.splice(taskIndex, 1);

  res.json({success: true });
});

module.exports = router;
