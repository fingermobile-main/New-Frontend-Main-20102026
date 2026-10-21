// backend/routes/comments.js
// Comments system API endpoints

const express = require('express');
const commentsController = require('../controllers/commentsController.js');
const { authenticate } = require('../middleware/authenticate'); // Correct file
const router = express.Router();

// GET /api/comments - Retrieve comments for a specific post
router.get('/', authenticate, commentsController.getAll);

// GET /api/comments/:id - Retrieve a specific comment
router.get('/:id', authenticate, commentsController.getById);

// POST /api/comments - Create a new comment
router.post('/', authenticate, commentsController.create);

// PUT /api/comments/:id - Update a comment
router.put('/:id', authenticate, commentsController.update);

// DELETE /api/comments/:id - Delete a comment
router.delete('/:id', authenticate, commentsController.delete);

// POST /api/comments/:id/like - Like/unlike a comment
router.post('/:id/like', authenticate, commentsController.like);

module.exports = router;
