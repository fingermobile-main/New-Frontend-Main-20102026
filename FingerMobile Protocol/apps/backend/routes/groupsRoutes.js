const express = require('express');
const router = express.Router();
const GroupController = require('../controllers/GroupController');
const { authenticate } = require('../middleware/authenticate');

router.get('/', GroupController.getAllGroups);
router.get('/sidebar', GroupController.getAllGroups);
router.post('/', authenticate, GroupController.createGroup);
router.get('/:id', GroupController.getGroupById);
router.put('/:id', authenticate, GroupController.updateGroup);
router.delete('/:id', authenticate, GroupController.deleteGroup);
router.post('/:id/join', authenticate, GroupController.joinGroup);
router.post('/:id/leave', authenticate, GroupController.leaveGroup);
router.get('/:id/members', GroupController.getMembers);

module.exports = router;
