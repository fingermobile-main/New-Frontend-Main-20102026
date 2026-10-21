/* eslint-disable no-unused-vars */
const express = require('express');
const connections = require('../controllers/connectionsController.js');
const { authenticate } = require('../middleware/authenticate');
const { socialDb } = require('../db');
const router = express.Router();

router.get('/', authenticate, connections.getMyConnections);
router.get('/requests', authenticate, connections.getPending);
router.post('/request/:targetMemberId', authenticate, connections.sendRequest);
router.post('/accept/:requestId', authenticate, connections.acceptRequest);
router.post('/reject/:requestId', authenticate, connections.rejectRequest);
router.delete('/remove/:connectedMemberId', authenticate, connections.removeConnection);
router.post('/block/:targetMemberId', authenticate, connections.sendRequest); // stub
router.delete('/unblock/:blockedMemberId', authenticate, connections.removeConnection); // stub
router.get('/blocked', authenticate, connections.getMyConnections); // stub
router.get('/search/:query', authenticate, connections.getMyConnections); // stub
router.get('/suggestions', authenticate, connections.getMyConnections); // stub

module.exports = router;
