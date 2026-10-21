const express = require('express');
const gameon = require('../controllers/gameonController');
const router = express.Router();

// Root gaming hub payload (Matches, Events, Leaderboard)
router.get('/', gameon.getHubData);
router.get('/matches', gameon.getMatches);
router.get('/leaderboard', gameon.getLeaderboard);
router.post('/wager', gameon.placeWager);

// Events routes
router.get('/events', gameon.getAll);
router.get('/events/:eventId', gameon.getById);
router.post('/events', gameon.create);
router.post('/events/:eventId/register', gameon.create);
router.delete('/events/:eventId/unregister', gameon.delete);
router.get('/users/:userId/events', gameon.getById);
router.get('/users/:userId/organized-events', gameon.getById);
router.get('/categories', gameon.getCategories);

module.exports = router;
