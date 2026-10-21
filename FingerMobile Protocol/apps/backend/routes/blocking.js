/* eslint-disable no-unused-vars */
const express = require('express');
const blocking = require('../controllers/blockingController.js');
const { socialDb } = require('../db');
const router = express.Router();

router.get('/', blocking.getBlockedUsers);
router.post('/', blocking.blockUser);
router.delete('/:blockedmemberId', blocking.unblockUser);
router.get('/check/:memberId', blocking.checkStatus);
router.get('/blocked-by', blocking.getBlockedUsers); // stub

module.exports = router;
