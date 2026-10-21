/**
 * Polls API Routes
 * Express routes for Polls & Interactive Voting Engine
 * Date: September 29, 2026
 */

const express = require('express');
const router = express.Router();
const PollController = require('../controllers/PollController');
const authenticate = require('../middleware/authenticate');

router.post('/', authenticate, (req, res) => PollController.createPoll(req, res));
router.get('/', (req, res) => PollController.getPolls(req, res));
router.get('/:id', (req, res) => PollController.getPollById(req, res));
router.post('/:id/vote', authenticate, (req, res) => PollController.votePoll(req, res));
router.put('/:id', authenticate, (req, res) => PollController.updatePoll(req, res));
router.delete('/:id', authenticate, (req, res) => PollController.deletePoll(req, res));
router.get('/:id/analytics', authenticate, (req, res) => PollController.getPollAnalytics(req, res));

module.exports = router;
