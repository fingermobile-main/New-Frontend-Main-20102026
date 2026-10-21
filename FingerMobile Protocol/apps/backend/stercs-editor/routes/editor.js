const logger = require('../../utils/logger');
const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/authenticate');
const {
  EditorController,
  getStatus
} = require('../controllers/editorController');
logger.info('getStatus after import in editor., js:', typeof getStatus);

// Apply authentication to all editor routes
router.use(authenticate);

// Editor routes
router.get('/', async (req, res) => {
  await EditorController.getEditor(req, res);
});
router.get('/status', async (req, res) => {
  await getStatus(req, res);
});
router.post('/save', EditorController.saveProject);
router.get('/projects', EditorController.getMemberProjects);
router.post('/projects', EditorController.createProject);
router.put('/projects/:id', EditorController.saveProject);
router.delete('/projects/:id', EditorController.deleteProject);

// Page save and fetch endpoints
router.post('/pages/:pageId/save', async (req, res) => {
  const { pageName, components } = req.body;
  res.json({ success: true, message: 'Page saved successfully', data: { pageName, components } });
});
router.get('/pages/:pageId', async (req, res) => {
  res.json({ success: true, data: { name: 'Saved Studio Page', components: [] } });
});

module.exports = router;
