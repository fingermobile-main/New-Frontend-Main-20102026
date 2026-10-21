/* eslint-disable no-unused-vars */
const express = require('express');
const contentmanagement = require('../controllers/contentmanagementController.js');
const { contentDb } = require('../db');
const router = express.Router();

router.get('/', contentmanagement.getPages);
router.get('/:contentId', contentmanagement.getPages); // stub fallback
router.post('/', contentmanagement.createPage);
router.put('/:contentId', contentmanagement.updatePage);
router.delete('/:contentId', contentmanagement.deletePage);
router.get('/author/:authorId', contentmanagement.getPages); // stub fallback
router.get('/categories', contentmanagement.getPages); // stub fallback
router.get('/tags', contentmanagement.getPages); // stub fallback

module.exports = router;
