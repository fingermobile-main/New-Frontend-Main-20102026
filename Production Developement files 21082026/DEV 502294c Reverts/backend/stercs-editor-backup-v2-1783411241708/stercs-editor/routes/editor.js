const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../../middleware/authenticate");
const {
  EditorController,
  getStatus
} = require("../controllers/editorController");
logger.info("getStatus after import in editor., js:", typeof getStatus);

// Apply admin authentication to all editor routes
router.use(requireAdmin);

// Editor routes
router.get("/", async (req, res) => {
  await EditorController.getEditor(req, res);
});
router.get("/status", async (req, res) => {
  await getStatus(req, res);
});
router.post("/save", EditorController.saveProject);
router.get("/projects", EditorController.getMemberProjects);
router.post("/projects", EditorController.createProject);
router.put("/projects/:id", EditorController.saveProject);
router.delete("/projects/:id", EditorController.deleteProject);

module.exports = router;
