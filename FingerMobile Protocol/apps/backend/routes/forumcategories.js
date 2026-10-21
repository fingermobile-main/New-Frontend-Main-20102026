/* eslint-disable no-unused-vars */
const express = require('express');
const forumcategories = require('../controllers/forumcategoriesController.js');
const { authenticate } = require('../middleware/authenticate');
const { socialDb } = require('../db');
const router = express.Router();

router.get('/', forumcategories.getAll);
router.get('/:categoryId', forumcategories.getById);
router.post('/', authenticate, forumcategories.create);
router.put('/:categoryId', authenticate, forumcategories.update);
router.delete('/:categoryId', authenticate, forumcategories.delete);
router.get('/:categoryId/threads', forumcategories.getById);
router.get('/popular', forumcategories.getAll);

module.exports = router;
