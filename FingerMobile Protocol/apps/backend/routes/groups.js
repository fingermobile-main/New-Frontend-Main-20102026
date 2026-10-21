const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const groupsController = require('../controllers/groupsController');

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();
  authenticate(req, res, next);
};

// Group management
router.get('/', optionalAuth, groupsController.getAll);
router.get('/sidebar', optionalAuth, groupsController.getAll);
router.get('/:id', optionalAuth, groupsController.getById);
router.post('/', authenticate, groupsController.create);
router.put('/:id', authenticate, groupsController.update);
router.delete('/:id', authenticate, groupsController.delete);

// Group membership
router.post('/:groupId/join', authenticate, groupsController.join);
router.post('/:groupId/leave', authenticate, groupsController.leave);
router.get('/:groupId/members', authenticate, groupsController.getMembers);

module.exports = router;
