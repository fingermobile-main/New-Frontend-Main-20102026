/**
 * Support Router
 * FingerMobile Protocol™ - Support Tickets & Help Desk
 * Routes mounted at /api/support
 */

const express = require('express');
const router = express.Router();
const SupportController = require('../controllers/supportController');

router.get('/tickets', SupportController.getTickets);
router.post('/tickets', SupportController.createTicket);
router.get('/tickets/:id', SupportController.getTicketById);
router.post('/tickets/:id/messages', SupportController.addMessage);
router.put('/tickets/:id/status', SupportController.updateStatus);
router.get('/stats', SupportController.getStats);

module.exports = router;
