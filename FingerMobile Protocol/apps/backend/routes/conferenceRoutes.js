/**
 * conferenceRoutes.js
 * Express routes for Conference module
 */
const express = require('express');
const router = express.Router();
const controller = require('../controllers/conferenceController');

router.get('/rooms', controller.getRooms);
router.get('/rooms/:roomId', controller.getRoomDetails);
router.post('/rooms', controller.createRoom);
router.post('/rooms/:roomId/join', controller.joinRoom);
router.post('/rooms/:roomId/leave', controller.leaveRoom);

module.exports = router;
