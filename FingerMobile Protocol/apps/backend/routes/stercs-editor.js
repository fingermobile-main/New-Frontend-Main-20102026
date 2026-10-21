const express = require('express');
const router = express.Router();
const stercsEditorController = require('../controllers/stercsEditorController');

router.post('/pages', stercsEditorController.savePage);
router.get('/pages', stercsEditorController.listPages);
router.get('/pages/:slug', stercsEditorController.getPageBySlug);
router.post('/parse-dsl', stercsEditorController.parseDslEndpoint);

module.exports = router;
